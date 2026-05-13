#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENCODE_DIR="$HOME/.config/opencode"
OPENCODE_SKILLS_DIR="$OPENCODE_DIR/skills"
CODEX_DIR="$HOME/.codex"
CODEX_SKILLS_DIR="$CODEX_DIR/skills"

CONFIG_FILES=(
    "opencode-lite.json"
    "opencode-full.json"
    "oh-my-openagent.json"
    "AGENTS.md"
)

log() { echo "  $1"; }
ok() { echo "  ✅ $1"; }
warn() { echo "  ⚠️  $1"; }

mkdir -p "$SCRIPT_DIR/opencode/config"
mkdir -p "$SCRIPT_DIR/opencode/skills"
mkdir -p "$SCRIPT_DIR/codex/config"
mkdir -p "$SCRIPT_DIR/codex/skills"

echo "=== Pulling Configs from Local OpenCode ==="
for file in "${CONFIG_FILES[@]}"; do
    src="$OPENCODE_DIR/$file"
    dst="$SCRIPT_DIR/opencode/config/$file"
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
            dst="$SCRIPT_DIR/opencode/skills/$skill_name"
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
echo "=== Pulling Codex Configs from Local Codex ==="
src="$CODEX_DIR/AGENTS.md"
dst="$SCRIPT_DIR/codex/config/AGENTS.md"
if [[ -f "$src" ]]; then
    cp "$src" "$dst"
    ok "Pulled Codex AGENTS.md"
else
    warn "Not found in local: AGENTS.md"
fi

echo ""
echo "=== Pulling All Skills from Local Codex ==="
if [[ -d "$CODEX_SKILLS_DIR" ]]; then
    skill_count=0
    for skill_dir in "$CODEX_SKILLS_DIR"/*/; do
        if [[ -d "$skill_dir" ]]; then
            skill_name="$(basename "$skill_dir")"
            [[ "$skill_name" == .* ]] && continue
            dst="$SCRIPT_DIR/codex/skills/$skill_name"
            cp -R "$skill_dir" "$dst"
            ok "Pulled Codex skill: $skill_name/"
            ((skill_count++)) || true
        fi
    done
    echo "  Total: $skill_count skills"
else
    warn "Codex skills directory not found: $CODEX_SKILLS_DIR"
fi

echo ""
echo "=== Pull Complete ==="
echo "Configs → $SCRIPT_DIR/opencode/config/"
echo "Skills  → $SCRIPT_DIR/opencode/skills/"
echo "Codex   → $SCRIPT_DIR/codex/"
