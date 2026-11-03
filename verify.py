"""Reject structurally invalid snapshots and look for a truncated packaged page."""
import json
import re
from decimal import Decimal
from pathlib import Path

root = Path(__file__).resolve().parent
snapshot = json.loads((root / "data/snapshot.json").read_text())
assert snapshot["schema"] == 1 and snapshot.get("updated", 0) > 0
for key, kinds in (("trades", {"buy", "sell"}), ("burns", {"burn"})):
    if key not in snapshot:
        assert key in snapshot["errors"]
        continue
    section = snapshot[key]
    assert 0 < section["since"] <= section["asOf"]
    seen = set()
    for row in section["rows"]:
        assert row["kind"] in kinds and Decimal(row["kito"]) > 0
        assert re.fullmatch(r"[a-f0-9]{64}", row["tx"]) and row["tx"] not in seen
        assert re.fullmatch(r"-?\d+:[a-f0-9]{64}", row["wallet"])
        if key == "trades":
            assert Decimal(row["ton"]) > 0
        seen.add(row["tx"])
if "holders" in snapshot:
    holders = snapshot["holders"]
    assert 0 < len(holders["holders"]) <= holders["holderCount"]
    for holder in holders["holders"]:
        expected = Decimal(holder["kito"]) * 100 / Decimal(holders["totalSupply"])
        assert abs(Decimal(str(holder["share"])) - expected) < Decimal("0.00000001")
page = (root / "index.html").read_text()
payload = re.search(r'<script id="snapshot" type="application/json">(.*?)</script>', page, re.S)
assert payload and json.loads(payload[1]) == snapshot
assert "/*APP*/" not in page and "/*STYLE*/" not in page
print("Snapshot and standalone page validated.")
