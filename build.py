"""Build the phone-ready single file, including a snapshot and all presentation assets."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent
data = root / "data/snapshot.json"
snapshot = json.loads(data.read_text()) if data.exists() else {"schema": 1}
template = (root / "web/page.html").read_text()
for token, filename in (("/*STYLE*/", "style.css"), ("/*APP*/", "app.js")):
    template = template.replace(token, (root / "web" / filename).read_text())
embedded = json.dumps(snapshot, ensure_ascii=False, separators=(",", ":")).replace("<", r"\u003c")
(root / "index.html").write_text(template.replace("__SNAPSHOT__", embedded))
