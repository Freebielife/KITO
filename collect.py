"""Build a static KITO snapshot. Each source keeps its last good result on failure."""
import json
import sys
import time
from pathlib import Path

import assets
import badges
import domains
import observatory
import trades

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data" / "snapshot.json"
YEAR = 366 * 86400


def save(path, value):
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False))
    temporary.replace(path)


def refresh():
    now = int(time.time())
    snapshot = json.loads(DATA.read_text()) if DATA.exists() else {"schema": 1}
    errors = []
    for key in ("trades", "burns", "holders"):
        try:
            old = snapshot.get(key, {})
            if key == "holders":
                result = assets.holders()
                if not result.get("holders") or not result.get("totalSupply"):
                    raise ValueError("missing token balances")
                section = {**result, "asOf": now}
            else:
                rows = old.get("rows", [])
                cutoff = now - YEAR
                if key == "trades":
                    cursor = dict(old.get("cursor", {}))
                    rows, start = trades.collect(rows, cutoff, cursor)
                else:
                    start = 1
                    start_at = max(1, old["asOf"] - 3600) if old.get("since") == 1 else 1
                    rows, _ = assets.burns(rows, start_at)
                section = {"rows": sorted((r for r in rows if key == "burns" or r["time"] >= cutoff), key=lambda r: (-r["time"], r["tx"])), "since": start, "asOf": now}
                if key == "trades":
                    section["cursor"] = cursor
            snapshot[key] = section
            print(key, "OK", len(section.get("rows", section.get("holders", []))), flush=True)
        except Exception as error:
            errors.append(key)
            print(key, "FAILED:", error, file=sys.stderr, flush=True)
    core_updated = len(errors) < 3
    if core_updated:
        try:
            snapshot["domains"] = domains.enrich(snapshot, now)
        except Exception as error:
            errors.append("domains")
            print("domains FAILED:", error, file=sys.stderr, flush=True)
        snapshot["badges"] = badges.refresh(snapshot.get("badges", {}), now)
        if snapshot["badges"]["failed"]:
            errors.append("badges")
        try:
            snapshot["zeroBurns"] = observatory.zero_burns(snapshot.get("zeroBurns", {}), now)
        except Exception as error:
            errors.append("zeroBurns")
            print("Zero-address burns:", error, flush=True)
        snapshot["identity"] = observatory.identity(snapshot, now)
        snapshot.update(schema=1, updated=now, errors=errors)
        DATA.parent.mkdir(exist_ok=True)
        save(DATA, snapshot)
    return bool(errors)


if __name__ == "__main__":
    sys.exit(refresh())
