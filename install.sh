#!/usr/bin/env bash
# Installs the kit for Claude Code on macOS / Linux (needs python3).
#  1. Copies skills/agents/commands/rules into ~/.claude (backs up existing folders)
#  2. Copies the plugin marketplace to ~/.claude/student-kit/marketplace
#  3. Registers that marketplace and enables every plugin in settings.json (backed up first)
#  4. Installs every plugin with the claude CLI (enabling them in settings.json doesn't install them)
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
print(f"{len(names)} plugins enabled.")
PY
if command -v claude >/dev/null; then
  claude plugin marketplace add "$DEST/student-kit/marketplace" </dev/null >/dev/null
  ok=0; failed=0
  for n in $(python3 -c 'import json, sys; print(" ".join(p["name"] for p in json.load(open(sys.argv[1]))["plugins"]))' "$DEST/student-kit/marketplace/.claude-plugin/marketplace.json"); do
    if claude plugin install "$n@student-kit" -s user </dev/null >/dev/null; then ok=$((ok+1))
    else echo "Could not install $n"; failed=$((failed+1)); fi
  done
  echo "$ok plugins installed, $failed failed."
else
  echo "claude CLI not found: install Claude Code, then run this script again to install the plugins."
fi
echo "Done. Restart Claude Code."
