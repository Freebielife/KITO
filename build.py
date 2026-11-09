"""Build the phone-ready single file, including a snapshot and all presentation assets."""
import base64
import json
from pathlib import Path

root = Path(__file__).resolve().parent
data = root / "data/snapshot.json"
snapshot = json.loads(data.read_text()) if data.exists() else {"schema": 1}
template = (root / "web/page.html").read_text()
for token, filename in (("/*LOADER*/", "snapshot-loader.js"), ("/*STYLE*/", "style.css"), ("/*APP*/", "app.js"), ("<!--CAT-->", "cat-orbit.svg")):
    template = template.replace(token, (root / "web" / filename).read_text())
art = base64.b64encode((root / "web/ornaments.svg").read_bytes()).decode("ascii")
template = template.replace("__PRINT_TILE__", "data:image/svg+xml;base64," + art)
embedded = json.dumps(snapshot, ensure_ascii=False, separators=(",", ":")).replace("<", r"\u003c")
(root / "index.html").write_text(template.replace("__SNAPSHOT__", embedded))
