"""Incremental archive of successful DeDust swap logs emitted by the KITO pool.

Reference: https://hub.dedust.io/contracts/v2/reference/core/pool/#event-swap
TonAPI decodes the event body; no API key or third-party Python package is needed.
"""
import json
import re
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

POOL = "EQDBJK9IVV2MLjHxpsSj4DOuybmwnO0QjUTIoQVpdfgXb4qQ"
POOL_RAW = "0:c124af48555d8c2e31f1a6c4a3e033aec9b9b09ced108d44c8a1056975f8176f"
MASTER = "0:922cb550f2a76112a65429a88a53b17ab157e734f990e05b02a42a3ca25a3bf7"
ENDPOINT = f"https://tonapi.io/v2/blockchain/accounts/{POOL}/transactions"
HEX = re.compile(r"[0-9a-f]{64}")
ADDRESS = re.compile(r"-?\d+:[0-9a-f]{64}")


def _page(before):
    url = ENDPOINT + "?limit=100"
    if before is not None:
        url += f"&before_lt={int(before)}"
    for attempt in range(3):
        try:
            request = Request(url, headers={"Accept": "application/json", "User-Agent": "Freebielife-KITO/1"})
            with urlopen(request, timeout=20) as response:
                items = json.load(response)["transactions"]
            if not isinstance(items, list):
                raise ValueError("TonAPI transactions is not a list")
            return items
        except (HTTPError, URLError, TimeoutError) as error:
            if attempt == 2 or (isinstance(error, HTTPError) and error.code < 500 and error.code != 429):
                raise
            time.sleep(2 ** (attempt + 1))


def _asset(asset):
    if asset["sum_type"] == "Native":
        return "native"
    if asset["sum_type"] == "Jetton":
        jetton = asset["jetton"]
        return f'{jetton["workchain_id"]}:{jetton["address"].lower()}'
    return asset["sum_type"]


def _amount(nano):
    number = str(nano)
    if not number.isdigit() or int(number) <= 0:
        raise ValueError("Unexpected swap amount")
    whole, remainder = divmod(int(number), 10**9)
    return f"{whole}.{remainder:09d}".rstrip("0").rstrip(".")


def _trade(tx):
    if tx["success"] is not True or tx.get("aborted"):
        return None
    logs = [message for message in tx["out_msgs"]
            if message["msg_type"] == "ext_out_msg" and message.get("op_code") == "0x9c610de3"]
    if not logs:
        return None
    if len(logs) != 1:
        raise ValueError("Multiple swap logs in one pool transaction")
    body = logs[0]["decoded_body"]
    pair = (_asset(body["asset_in"]), _asset(body["asset_out"]))
    if pair == ("native", MASTER):
        kind, kito, ton = "buy", body["amount_out"], body["amount_in"]
    elif pair == (MASTER, "native"):
        kind, kito, ton = "sell", body["amount_in"], body["amount_out"]
    else:
        raise ValueError("Pool swap event has unexpected assets")
    wallet = body["field4"]["sender_addr"].lower()
    if not ADDRESS.fullmatch(wallet) or not HEX.fullmatch(tx["hash"]):
        raise ValueError("Invalid pool swap address or transaction hash")
    return {"kind": kind, "time": int(tx["utime"]), "tx": tx["hash"], "wallet": wallet,
            "kito": _amount(kito), "ton": _amount(ton)}


def collect(previous_rows, since_timestamp, state=None, *, backfill_pages=6):
    """Return rows newest first and the earliest completely scanned Unix second.

    Persist the updated `state` alongside rows. Each refresh catches up to the
    previous head and then extends coverage backward by up to backfill_pages.
    A discontinuity, ambiguous decode, or upstream failure raises before changing
    state. Caller must retain its last good snapshot on failure.
    """
    if backfill_pages < 1:
        raise ValueError("backfill_pages must be positive")
    since = int(since_timestamp)
    checkpoint = dict(state or {})
    retained = {row["tx"]: row for row in previous_rows if row["time"] >= since}
    # A caller can request a longer history after previously pruning data.
    # In that case, restart the scan rather than claim pruned rows as covered.
    if since < checkpoint.get("requestedSince", since) and checkpoint.get("reachedCutoff"):
        checkpoint = {}
    old_head = checkpoint.get("headHash")
    first_hash = None

    def scan(items, expected=None, stop_hash=None):
        nonlocal first_hash
        for tx in items:
            if tx["account"]["address"].lower() != POOL_RAW:
                raise ValueError("Unexpected pool account")
            if expected and tx["hash"] != expected:
                raise ValueError("Discontinuous pool history; retry from previous checkpoint")
            if first_hash is None:
                first_hash = tx["hash"]
            if tx["hash"] == stop_hash:
                return "joined", tx
            if int(tx["utime"]) < since:
                return "cutoff", tx
            row = _trade(tx)
            if row:
                retained[row["tx"]] = row
            expected = tx["prev_trans_hash"]
        return "more", items[-1]

    page = _page(None)
    if not page:
        raise ValueError("TonAPI returned no history for the known KITO pool")
    head_lt = int(page[0]["lt"])
    if head_lt < checkpoint.get("headLt", 0):
        raise ValueError("TonAPI returned a regressed chain head; keeping previous snapshot")
    status, tail = scan(page, stop_hash=old_head)
    if old_head:
        for _ in range(99):
            if status != "more":
                break
            time.sleep(1.1)
            page = _page(tail["lt"])
            if not page:
                raise ValueError("Previous pool checkpoint was not reached")
            status, tail = scan(page, tail["prev_trans_hash"], old_head)
        if status == "more":
            raise RuntimeError("Too many pages to catch up safely in one run")
    if status == "joined":
        tail = checkpoint["tail"]
        remaining = backfill_pages
    else:
        remaining = backfill_pages - 1

    def covered():
        # Other transactions can share this second across a page boundary.
        return since if int(tail["prev_trans_lt"]) == 0 else max(since, int(tail["utime"]) + 1)

    while remaining and covered() > since:
        time.sleep(1.1)
        page = _page(tail["lt"])
        if not page:
            raise ValueError("TonAPI archive ended before predecessor of scanned transaction")
        status, tail = scan(page, tail["prev_trans_hash"])
        remaining -= 1

    coverage = covered()
    if state is not None:
        state.update(headHash=first_hash, headLt=head_lt, requestedSince=since,
                     reachedCutoff=coverage == since, tail={key: tail[key] for key in
                     ("utime", "lt", "prev_trans_lt", "prev_trans_hash")})
    return sorted(retained.values(), key=lambda row: (row["time"], row["tx"]), reverse=True), coverage
