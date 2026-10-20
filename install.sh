#!/usr/bin/env bash
# Installs the kit for Claude Code on macOS / Linux (needs python3).
#  1. Copies skills/agents/commands/rules into ~/.claude (backs up existing folders)
#  2. Copies the plugin marketplace to ~/.claude/student-kit/marketplace
#  3. Registers that marketplace and enables every plugin in settings.json (backed up first)
set -e
DEST="$HOME/.claude"; STAMP=$(date +%Y%m%d-%H%M%S); SRC="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$DEST"
for d in skills agents commands rules; do
  [ -d "$DEST/$d" ] && cp -r "$DEST/$d" "$DEST/$d.bak-$STAMP"
  cp -r "$SRC/$d" "$DEST/"
done
rm -rf "$DEST/student-kit" && mkdir -p "$DEST/student-kit"
cp -r "$SRC/marketplace" "$DEST/student-kit/"
[ -f "$DEST/settings.json" ] && cp "$DEST/settings.json" "$DEST/settings.json.bak-$STAMP"
python3 - "$DEST" <<'PY'
import json, sys, pathlib
dest = pathlib.Path(sys.argv[1]); f = dest / "settings.json"
mp = dest / "student-kit" / "marketplace"
s = json.loads(f.read_text()) if f.exists() else {}
s.setdefault("extraKnownMarketplaces", {})["student-kit"] = {"source": {"source": "directory", "path": str(mp)}}
names = [p["name"] for p in json.loads((mp / ".claude-plugin/marketplace.json").read_text())["plugins"]]
s.setdefault("enabledPlugins", {}).update({f"{n}@student-kit": True for n in names})
f.write_text(json.dumps(s, indent=2))
print(f"Done: {len(names)} plugins enabled. Restart Claude Code.")
PY
