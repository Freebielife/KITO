"""Build a static KITO snapshot. Each source keeps its last good result on failure."""
import json
import sys
import time
from pathlib import Path

import assets
import badges
import domains
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
                    start_at = max(cutoff, old.get("asOf", cutoff) - 3600)
                    rows, start = assets.burns(rows, start_at)
                    if old.get("since") and start <= old["asOf"]:
                        start = max(cutoff, min(start, old["since"]))
                section = {"rows": sorted((r for r in rows if r["time"] >= cutoff), key=lambda r: (-r["time"], r["tx"])), "since": start, "asOf": now}
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
        snapshot.update(schema=1, updated=now, errors=errors)
        DATA.parent.mkdir(exist_ok=True)
        save(DATA, snapshot)
    return bool(errors)


if __name__ == "__main__":
    sys.exit(refresh())
