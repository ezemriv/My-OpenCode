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

CUSTOM_SKILLS=(
    "context7-mcp"
    "polars-nautilus-context"
    "update-docs-on-completion"
)

log() { echo "  $1"; }
ok() { echo "  ✅ $1"; }
warn() { echo "  ⚠️  $1"; }

mkdir -p "$OPENCODE_DIR"
mkdir -p "$OPENCODE_SKILLS_DIR"

echo "=== Syncing OpenCode Configs ==="
for file in "${CONFIG_FILES[@]}"; do
    src="$SCRIPT_DIR/myopencode_config/$file"
    dst="$OPENCODE_DIR/$file"
    if [[ -f "$src" ]]; then
        if [[ -f "$dst" ]]; then
            backup="${dst}.backup-$(date -u +%Y-%m-%dT%H-%M-%SZ)"
            cp "$dst" "$backup"
            log "Backed up existing → $(basename "$backup")"
        fi
        cp "$src" "$dst"
        ok "Copied $file"
    else
        warn "Source not found: $src"
    fi
done

echo ""
echo "=== Syncing Custom Skills ==="
for skill in "${CUSTOM_SKILLS[@]}"; do
    src="$SCRIPT_DIR/skills/$skill"
    dst="$OPENCODE_SKILLS_DIR/$skill"
    if [[ -d "$src" ]]; then
        cp -R "$src" "$dst"
        ok "Copied skill: $skill/"
    else
        warn "Source not found: $src"
    fi
done

echo ""
echo "=== Sync Complete ==="
echo "Configs → $OPENCODE_DIR/"
echo "Skills  → $OPENCODE_SKILLS_DIR/"