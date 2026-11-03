"""KITO holder snapshot and confirmed burns from the jetton master's transactions."""
import json
import re
import time
from decimal import Decimal
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

API = "https://tonapi.io/v2"
MASTER = "EQCSLLVQ8qdhEqZUKaiKU7F6sVfnNPmQ4FsCpCo8olo795LP"
MASTER_RAW = "0:922cb550f2a76112a65429a88a53b17ab157e734f990e05b02a42a3ca25a3bf7"
RAW_ADDRESS = re.compile(r"-?[0-9]+:[0-9a-f]{64}")
DOMAIN = re.compile(r"(?:[a-z0-9-]+\.)+ton")
BURN_NOTIFICATION = "0x7bdd97de"
HOLDER_LIMIT = 20


def fetch(path, attempts=3):
    for attempt in range(attempts):
        try:
            request = Request(API + path, headers={"Accept": "application/json", "User-Agent": "KITO-data/1.0"})
            with urlopen(request, timeout=20) as response:
                return json.load(response)
        except (HTTPError, URLError, TimeoutError, ConnectionError) as error:
            if isinstance(error, HTTPError) and error.code not in (408, 429, 500, 502, 503, 504):
                raise
            if attempt + 1 == attempts:
                raise
            time.sleep(2 ** (attempt + 1))


def raw_address(value):
    address = str(value).lower()
    if not RAW_ADDRESS.fullmatch(address):
        raise ValueError("Invalid TON address in response")
    return address


def token_amount(units):
    if not re.fullmatch(r"[0-9]+", str(units)):
        raise ValueError("Invalid KITO base units")
    whole, fraction = divmod(int(units), 10**9)
    return (f"{whole}.{fraction:09d}").rstrip("0").rstrip(".")


def resolved_domain(owner):
    name = (owner.get("name") or "").lower()
    if not DOMAIN.fullmatch(name):
        return None
    try:
        record = fetch("/dns/" + quote(name, safe="") + "/resolve", attempts=1)
    except (HTTPError, URLError, TimeoutError, ConnectionError):
        return None
    wallet = record.get("wallet") or {}
    return name if str(wallet.get("address")).lower() == raw_address(owner["address"]) else None


def holders():
    info = fetch("/jettons/" + MASTER)
    metadata = info["metadata"]
    if raw_address(metadata["address"]) != MASTER_RAW or int(metadata["decimals"]) != 9:
        raise ValueError("Unexpected KITO metadata")
    supply = int(info["total_supply"])
    page = fetch(f"/jettons/{MASTER}/holders?limit={HOLDER_LIMIT}")
    count = page["total"]
    if supply <= 0 or count < len(page["addresses"]) or not page["addresses"]:
        raise ValueError("Inconsistent KITO holder snapshot")
    rows = []
    seen = set()
    for item in page["addresses"]:
        owner = item["owner"]
        address = raw_address(owner["address"])
        units = int(item["balance"])
        if address in seen or not 0 <= units <= supply:
            raise ValueError("Unexpected holder balance or duplicate owner")
        seen.add(address)
        rows.append({"wallet": address, "name": resolved_domain(owner), "kito": token_amount(units),
                     "share": float(Decimal(units) * 100 / supply)})
    rows.sort(key=lambda row: Decimal(row["kito"]), reverse=True)
    return {"totalSupply": token_amount(supply), "holderCount": count, "holders": rows}


def confirmed_burn(tx):
    if raw_address(tx["account"]["address"]) != MASTER_RAW:
        raise ValueError("Transaction belongs to another master")
    msg = tx.get("in_msg") or {}
    if msg.get("op_code") != BURN_NOTIFICATION:
        return None
    if not tx["success"] or tx["aborted"] or msg["bounced"]:
        return None
    if raw_address(msg["destination"]["address"]) != MASTER_RAW:
        raise ValueError("Burn notification destination mismatch")
    body = msg["decoded_body"]
    tx_hash = tx["hash"].lower()
    if not re.fullmatch(r"[0-9a-f]{64}", tx_hash):
        raise ValueError("Malformed transaction hash")
    amount = token_amount(body["amount"])
    if amount == "0":
        return None
    return {"kind": "burn", "time": int(tx["utime"]), "tx": tx_hash, "wallet": raw_address(body["sender"]),
            "name": None, "kito": amount}


def burns(previous_rows, since_timestamp):
    """Scan descending to the requested inclusive lower bound, preserving older rows.

    A successful, non-bounced burn notification accepted by KITO's own master
    confirms the burn. Sender-side burn requests alone are insufficient.
    Network or decoding failures abort the refresh. No partial scan claims coverage.
    """
    if not isinstance(since_timestamp, int) or since_timestamp < 0:
        raise ValueError("Invalid lower bound")
    # Replace the scanned interval to handle a re-indexed tip.
    by_hash = {row["tx"]: row for row in previous_rows if row["time"] < since_timestamp}
    before = None
    for _ in range(300):
        params = {"limit": 100}
        if before is not None:
            params["before_lt"] = before
        txs = fetch(f"/blockchain/accounts/{MASTER}/transactions?" + urlencode(params))["transactions"]
        if not txs:
            break
        reached_floor = False
        for tx in txs:
            if int(tx["utime"]) < since_timestamp:
                reached_floor = True
                continue
            row = confirmed_burn(tx)
            if row:
                by_hash[row["tx"]] = row
        if reached_floor or len(txs) < 100:
            break
        oldest = min(int(tx["lt"]) for tx in txs)
        if before is not None and oldest >= before:
            raise ValueError("TON transaction cursor did not advance")
        before = oldest
        time.sleep(1)
    else:
        raise RuntimeError("Burn history page limit reached")
    return sorted(by_hash.values(), key=lambda row: (row["time"], row["tx"]), reverse=True), since_timestamp
