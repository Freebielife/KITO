"""Read current TON balances, NFT ownership and the positions of JVault pool 216."""
import base64
import binascii
import re
import time
from collections import defaultdict
from urllib.parse import urlencode

from assets import fetch, raw_address

POOL = "EQANDE3kcYMMSkumPIuj0BWLi2kTTRXng6FSYrvRbEpUv877"
AUTHOR = "EQAhaFPX9zIBVYe_vfy3dudCkxJDjSoMjj59KndtHKcqo3iy"
TOKENS = {
    "vnuk": ("EQCp6hbevSAM9G2WxeZDp0Mte6MPTUJouZrCNIeWHnhlOZZA", False),
    "joystick": ("EQBJpyjYjsZ5xhqClAgaSqVHlgFtsJvclU-93Ah-LequH5uC", True),
    "phoenix": ("EQABtSLSzrAOISWPfIjBl2VmeStkM1eHaPrUxRTj8mY-9h43", True),
}
COLLECTIONS = {
    "author": AUTHOR,
    "vnukNft": "EQBHe9CCEGOW6xpnLEqUx3bJ3lYgaCXmlokE5xPckXtY3f4X",
    "joystickNft": "EQCZIvCtiPmacSrvOUvsJE7P5si6letm0Bo0EYMl5c5F-cbQ",
}


def raw_friendly(address):
    data = base64.urlsafe_b64decode(address)
    if len(data) != 36 or binascii.crc_hqx(data[:34], 0) != int.from_bytes(data[34:], "big"):
        raise ValueError("Invalid friendly address")
    return f"{int.from_bytes(data[1:2], 'big', signed=True)}:{data[2:34].hex()}"


POOL_RAW = raw_friendly(POOL)
ZERO = "0:" + "0" * 64


def holders(master, inclusive):
    jetton = fetch(f"/jettons/{master}")["metadata"]
    if jetton["address"] != raw_friendly(master):
        raise ValueError("Wrong jetton metadata")
    limit = 200_000 * 10 ** int(jetton["decimals"])
    owners = {}
    for offset in range(0, 9000, 100):
        data = fetch(f"/jettons/{master}/holders?limit=100&sort_by=balance&offset={offset}")
        rows = data["addresses"]
        for row in rows:
            balance = int(row["balance"])
            if balance < limit or (balance == limit and not inclusive):
                return owners
            owner = raw_address(row["owner"]["address"])
            if owner != ZERO:
                owners[owner] = True
        if len(rows) < 100:
            if offset + len(rows) < data["total"]:
                raise ValueError("Truncated jetton holder list")
            return owners
        time.sleep(0.6)
    raise RuntimeError("Jetton holder pagination limit")


def nft_owners(collection, keep_item):
    collection_raw = raw_friendly(collection)
    owners = {}
    for offset in range(0, 10000, 100):
        rows = fetch(f"/nfts/collections/{collection}/items?limit=100&offset={offset}")["nft_items"]
        for row in rows:
            owner = (row.get("owner") or {}).get("address")
            if not owner or owner == ZERO or row.get("verified") is not True:
                continue
            if (row.get("collection") or {}).get("address") != collection_raw:
                raise ValueError("Unexpected NFT collection")
            owner = raw_address(owner)
            candidate = (int(row["index"]), raw_address(row["address"]))
            if owner not in owners or candidate < owners[owner]:
                owners[owner] = candidate
        if len(rows) < 100:
            return {owner: item if keep_item else True for owner, (_, item) in owners.items()}
        time.sleep(0.6)
    raise RuntimeError("NFT pagination limit")


def decode_address(item):
    # TonAPI serializes a plain MsgAddressInt as one 267-bit cell without refs.
    match = re.fullmatch(r"b5ee9c72010101010024000043([0-9a-f]{68})", item.get("cell", ""))
    if not match:
        raise ValueError("Unexpected address cell")
    value = int(match[1], 16)
    if value >> 269 != 4 or value & 31 != 16:
        raise ValueError("Unexpected MsgAddressInt tag")
    workchain = ((value >> 261) & 255).to_bytes(1, "big")
    return f"{int.from_bytes(workchain, 'big', signed=True)}:{(value >> 5) & ((1 << 256) - 1):064x}"


def position(address):
    result = fetch(f"/blockchain/accounts/{address}/methods/get_storage_data")
    stack = result["stack"]
    if not result["success"] or len(stack) != 15 or decode_address(stack[0]) != POOL_RAW:
        raise ValueError("Unexpected JVault position contract")
    return decode_address(stack[1]), int(stack[3]["num"], 16) + int(stack[7]["num"], 16)


def discover(previous):
    """Enumerate positions notified by the pool, including transfers and withdrawals."""
    known = set(previous.get("positions", []))
    checkpoint = int(previous.get("cursor", 0))
    before = None
    tip = checkpoint
    for _ in range(100):
        query = {"limit": 100}
        if before is not None:
            query["before_lt"] = before
        rows = fetch(f"/blockchain/accounts/{POOL}/transactions?" + urlencode(query))["transactions"]
        if not rows:
            if checkpoint:
                raise ValueError("JVault cursor was not reached")
            return known, tip
        if before is None:
            tip = int(rows[0]["lt"])
        for tx in rows:
            lt = int(tx["lt"])
            if lt == checkpoint:
                return known, tip
            if lt < checkpoint:
                raise ValueError("JVault history skipped the previous cursor")
            if tx["account"]["address"] != POOL_RAW:
                raise ValueError("Unexpected JVault transaction account")
            if tx["success"] and not tx["aborted"]:
                for message in tx["out_msgs"]:
                    if message.get("op_code") == "0xae9307ce":
                        known.add(raw_address(message["destination"]["address"]))
        before = int(rows[-1]["lt"])
        if len(rows) < 100:
            if checkpoint:
                raise ValueError("JVault cursor was not reached")
            return known, tip
        time.sleep(0.6)
    raise RuntimeError("JVault history pagination limit")


def stake(previous):
    addresses, cursor = discover(previous)
    totals = defaultdict(int)
    for address in sorted(addresses):
        time.sleep(1.1)
        owner, total = position(address)
        totals[owner] += total
    qualifying = {owner: True for owner, amount in totals.items() if amount >= 500_000 * 10**9}
    return {"wallets": qualifying, "positions": sorted(addresses), "cursor": str(cursor)}


def refresh(previous, now):
    sources = dict(previous.get("sources", {}))
    jobs = {key: (holders, args) for key, args in TOKENS.items()}
    jobs.update({key: (nft_owners, (address, key == "author")) for key, address in COLLECTIONS.items()})
    failed = []
    for key, (read, args) in jobs.items():
        try:
            sources[key] = {"asOf": now, "wallets": read(*args)}
        except Exception as error:
            failed.append(key)
            print(f"Badges {key}: {error}", flush=True)
    try:
        sources["staking"] = {"asOf": now, **stake(sources.get("staking", {}))}
    except Exception as error:
        failed.append("staking")
        print(f"Badges staking: {error}", flush=True)
    return {"sources": sources, "failed": failed}
