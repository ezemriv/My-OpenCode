#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENCODE_DIR="$HOME/.config/opencode"
OPENCODE_SKILLS_DIR="$OPENCODE_DIR/skills"

CONFIG_FILES=(
    "opencode-lite.json"
    "opencode-full.json"
    "oh-my-openagent.json"
    "AGENTS.md"
)

log() { echo "  $1"; }
ok() { echo "  ✅ $1"; }
warn() { echo "  ⚠️  $1"; }

mkdir -p "$SCRIPT_DIR/myopencode_config"
mkdir -p "$SCRIPT_DIR/skills"

echo "=== Pulling Configs from Local OpenCode ==="
for file in "${CONFIG_FILES[@]}"; do
    src="$OPENCODE_DIR/$file"
    dst="$SCRIPT_DIR/myopencode_config/$file"
    if [[ -f "$src" ]]; then
        cp "$src" "$dst"
        ok "Pulled $file"
    else
        warn "Not found in local: $file"
    fi
done

echo ""
echo "=== Pulling All Skills from Local OpenCode ==="
if [[ -d "$OPENCODE_SKILLS_DIR" ]]; then
    skill_count=0
    for skill_dir in "$OPENCODE_SKILLS_DIR"/*/; do
        if [[ -d "$skill_dir" ]]; then
            skill_name="$(basename "$skill_dir")"
            [[ "$skill_name" == .* ]] && continue
            dst="$SCRIPT_DIR/skills/$skill_name"
            cp -R "$skill_dir" "$dst"
            ok "Pulled skill: $skill_name/"
            ((skill_count++)) || true
        fi
    done
    echo "  Total: $skill_count skills"
else
    warn "Skills directory not found: $OPENCODE_SKILLS_DIR"
fi

echo ""
echo "=== Pull Complete ==="
echo "Configs → $SCRIPT_DIR/myopencode_config/"
echo "Skills  → $SCRIPT_DIR/skills/"