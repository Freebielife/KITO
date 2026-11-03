"""Ownership of canonical four-digit TON DNS NFTs and Resistance Tools socool subdomains."""
import re
import time
from collections import defaultdict
from urllib.parse import urlencode

from assets import fetch, RAW_ADDRESS

ROOT = "0:b774d95eb20543f186c06b371ab88ad704f7e256130caf96189368a7d0cb6ccf"
SOCOOL = "0:c66b350a646c1b7f6d2dc6c188e4562e224766c619ac667f1eaa18c12e6e5a7a"
DIGITS = re.compile(r"[0-9]{4}\.ton")
SUB = re.compile(r"[a-z0-9_-]+\.socool\.ton")


def owned(item, collection):
    if item.get("verified") is not True or (item.get("collection") or {}).get("address") != collection:
        return None
    owner = (item.get("owner") or {}).get("address", "")
    return owner if RAW_ADDRESS.fullmatch(owner) else None


def pages(path, params):
    for offset in range(0, 10000, 100):
        items = fetch(path + "?" + urlencode(dict(params, offset=offset, limit=100)), attempts=2)["nft_items"]
        yield from items
        if len(items) < 100:
            return
        time.sleep(1)
    raise RuntimeError("NFT pagination limit reached")


def subdomains():
    if fetch("/dns/socool.ton/resolve")["next_resolver"] != SOCOOL:
        raise ValueError("socool.ton collection changed")
    result = defaultdict(set)
    for item in pages("/nfts/collections/" + SOCOOL + "/items", {}):
        owner = owned(item, SOCOOL)
        name = (item.get("metadata", {}).get("name") or "").lower()
        if owner and SUB.fullmatch(name):
            result[owner].add(name)
    return result


def four_digits(wallet):
    result = set()
    for item in pages("/accounts/" + wallet + "/nfts", {"collection":ROOT}):
        name = (item.get("dns") or "").lower()
        if owned(item, ROOT) == wallet and DIGITS.fullmatch(name):
            result.add(name)
    return sorted(result)


def enrich(snapshot, now):
    previous = snapshot.get("domains", {})
    holders = [r["wallet"] for r in snapshot.get("holders", {}).get("holders", [])]
    trades = [r["wallet"] for r in snapshot.get("trades", {}).get("rows", [])]
    burns = [r["wallet"] for r in snapshot.get("burns", {}).get("rows", [])]
    addresses = list(dict.fromkeys(holders + trades[:50] + burns + trades))
    wanted = set(addresses)
    checked = {w:dict(r) for w,r in previous.get("byWallet", {}).items() if w in wanted}
    # The whole socool collection is small. Replacing its complete owner map also handles transfers.
    try:
        subs = subdomains()
    except (OSError, ValueError, KeyError, RuntimeError) as exc:
        print("Subdomain collection pending:", type(exc).__name__, flush=True)
        subs = None
    for w in addresses:
        record = checked.setdefault(w, {"digits":[], "digitsAt":0})
        if subs is not None:
            record.update(sub=sorted(subs.get(w, ())), subAt=now)
        elif now-record.get("subAt",0)>86400:
            record["sub"] = []
    # Prioritise visible wallets; rotate through the rest across scheduled refreshes.
    due = [w for w in addresses if now-checked[w].get("digitsAt",0) >= 86400]
    due.sort(key=lambda w: max(checked[w].get("digitsAt",0), checked[w].get("lastAttempt",0)))
    end = time.monotonic()+120
    for w in due[:45]:
        if time.monotonic() >= end: break
        checked[w]["lastAttempt"] = now
        try:
            checked[w].update(digits=four_digits(w), digitsAt=now)
        except (OSError, ValueError, KeyError, RuntimeError) as exc:
            print("Domain check pending:", w[:10], type(exc).__name__, flush=True)
        time.sleep(1)
    for record in checked.values():
        if now - record.get("digitsAt",0) > 2*86400: record["digits"] = []
    return {"byWallet":checked, "asOf":now}
