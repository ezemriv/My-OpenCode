---
name: notebooklm-mcp
description: Query Google NotebookLM via MCP tools for source-grounded, citation-backed answers. Use when querying notebooks, researching topics in uploaded docs, adding sources, creating artifacts (audio, reports, quizzes), or managing notebooks. Replaces the old browser-based NotebookLM skill.
---

# NotebookLM MCP Skill

Interact with Google NotebookLM via the `notebooklm-mcp-cli` MCP server. All operations use native MCP tools — no browser automation, no Patchright, no `run.py` wrappers.

## When to Use

- User mentions NotebookLM or shares a NotebookLM URL
- User asks to query their notebooks/documentation
- User wants to add sources, create artifacts, or manage notebooks
- User needs citation-backed answers from uploaded documents
- Phrases: "ask my NotebookLM", "check my docs", "query my notebook"

## Known Issue: SSL Certificate Error

On macOS with corporate proxies or self-signed certs, MCP tool calls may fail with:
```
[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self-signed certificate in certificate chain
```

### Fix: Add env vars to MCP server config

Find your MCP config (typically `~/.config/opencode/opencode.json` or similar) and add:
```json
{
  "mcp": {
    "notebooklm": {
      "command": "uvx",
      "args": ["notebooklm-mcp-cli"],
      "env": {
        "SSL_CERT_FILE": "/opt/homebrew/etc/openssl@3/cert.pem",
        "REQUESTS_CA_BUNDLE": "/opt/homebrew/etc/openssl@3/cert.pem"
      }
    }
  }
}
```

### CLI Fallback

If MCP tools fail, use the `nlm` CLI directly:
```bash
SSL_CERT_FILE=/opt/homebrew/etc/openssl@3/cert.pem \
REQUESTS_CA_BUNDLE=/opt/homebrew/etc/openssl@3/cert.pem \
nlm query notebook <NOTEBOOK_ID> "Your question here"
```

## Authentication

Before any query, ensure auth is configured:

```bash
# Check auth status
nlm login   # Opens browser for Google login

# Or check via MCP tool
notebooklm_server_info()  # Returns auth_status: configured|stale|not_configured
```

## Core Workflow

### 1. Query a Notebook

```
notebooklm_notebook_query({
  notebook_id: "<UUID>",
  query: "Your question"
})
```

Returns: `answer`, `conversation_id`, `citations`, `sources_used`.

**Follow-ups:** Pass `conversation_id` from previous response to maintain context.

**Large notebooks (50+ sources):** Use async flow:
```
notebooklm_notebook_query_start({ notebook_id, query })
  → poll notebooklm_notebook_query_status({ query_id }) until completed
```

### 2. List & Discover Notebooks

```
notebooklm_notebook_list()              # List all notebooks
notebooklm_notebook_get({ notebook_id })  # Get notebook details + sources
notebooklm_notebook_describe({ notebook_id })  # AI-generated summary
```

### 3. Manage Sources

```
# Add sources
notebooklm_source_add({ notebook_id, source_type: "url", url: "..." })
notebooklm_source_add({ notebook_id, source_type: "text", text: "...", title: "..." })
notebooklm_source_add({ notebook_id, source_type: "file", file_path: "..." })
notebooklm_source_add({ notebook_id, source_type: "drive", document_id: "..." })

# Inspect sources
notebooklm_source_describe({ source_id })       # AI summary of source
notebooklm_source_get_content({ source_id })     # Raw text extraction

# Manage sources
notebooklm_source_rename({ notebook_id, source_id, new_title: "..." })
notebooklm_source_delete({ source_ids: [...], confirm: true })
```

### 4. Research & Discover New Sources

```
# Fast research (~30s, ~10 sources)
notebooklm_research_start({ query: "...", mode: "fast" })

# Deep research (~5min, ~40 sources)
notebooklm_research_start({ query: "...", mode: "deep" })

# Poll until completed
notebooklm_research_status({ notebook_id })

# Import discovered sources
notebooklm_research_import({ notebook_id, task_id })
```

### 5. Create Studio Artifacts

```
notebooklm_studio_create({ notebook_id, artifact_type: "audio" })      # Podcast
notebooklm_studio_create({ notebook_id, artifact_type: "report" })     # Briefing doc
notebooklm_studio_create({ notebook_id, artifact_type: "quiz" })       # Quiz
notebooklm_studio_create({ notebook_id, artifact_type: "slide_deck" }) # Slides
notebooklm_studio_create({ notebook_id, artifact_type: "infographic" })
notebooklm_studio_create({ notebook_id, artifact_type: "mind_map" })
notebooklm_studio_create({ notebook_id, artifact_type: "flashcards" })
notebooklm_studio_create({ notebook_id, artifact_type: "data_table" })

# Check status
notebooklm_studio_status({ notebook_id })

# Download
notebooklm_download_artifact({ notebook_id, artifact_type: "audio", output_path: "..." })
```

### 6. Notebook Management

```
notebooklm_notebook_create({ title: "..." })
notebooklm_notebook_rename({ notebook_id, new_title: "..." })
notebooklm_notebook_delete({ notebook_id, confirm: true })
notebooklm_note({ notebook_id, action: "create", title: "...", content: "..." })
```

### 7. Organization

```
# Tags
notebooklm_tag({ action: "add", notebook_id, tags: "ai,research" })
notebooklm_tag({ action: "select", query: "financial ml" })

# Labels (source-level, needs 5+ sources)
notebooklm_label({ notebook_id, action: "auto" })
notebooklm_label({ notebook_id, action: "list" })
```

### 8. Cross-Notebook Queries

```
notebooklm_cross_notebook_query({ query: "...", tags: "ai" })
notebooklm_cross_notebook_query({ query: "...", all: true })  # All notebooks
```

### 9. Sharing

```
notebooklm_notebook_share_public({ notebook_id, is_public: true })
notebooklm_notebook_share_invite({ notebook_id, email: "...", role: "viewer" })
```

### 10. Batch Operations

```
notebooklm_batch({ action: "query", notebook_names: "NB1,NB2", query: "..." })
notebooklm_batch({ action: "create", titles: "NB1,NB2" })
notebooklm_batch({ action: "delete", notebook_names: "NB1", confirm: true })
```

## Follow-Up Pattern (Critical)

Every answer may be incomplete. Required behavior:

1. **STOP** — Do not immediately respond to user
2. **ANALYZE** — Compare answer to user's original request
3. **IDENTIFY GAPS** — Determine if more information needed
4. **ASK FOLLOW-UP** — Use `conversation_id` to ask in same context
5. **REPEAT** — Continue until information is complete
6. **SYNTHESIZE** — Combine all answers before responding to user

## CLI Quick Reference

For operations not covered by MCP tools, or when MCP is unavailable:

```bash
# Auth
nlm login                           # Browser-based login
nlm login --profile work            # Named profile

# Query
nlm query notebook <ID> "question"
nlm query notebook <ID> "follow-up" -c <conversation_id>

# Notebooks
nlm notebook list
nlm notebook create --title "My Notebook"
nlm notebook get <ID>

# Sources
nlm source add <NOTEBOOK_ID> --url "https://..."
nlm source add <NOTEBOOK_ID> --text "content" --title "My Text"
nlm source add <NOTEBOOK_ID> --file /path/to/file.pdf

# Studio
nlm studio create <NOTEBOOK_ID> --type audio
nlm studio create <NOTEBOOK_ID> --type report --format "Briefing Doc"
nlm studio status <NOTEBOOK_ID>

# Research
nlm research start "query" --mode fast
nlm research start "query" --mode deep

# Tags
nlm tag add <NOTEBOOK_ID> --tags "ai,finance"
nlm tag select "query"
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| SSL cert error | Set `SSL_CERT_FILE` + `REQUESTS_CA_BUNDLE` in MCP env config |
| Auth not configured | Run `nlm login` |
| Query timeout | Use `notebooklm_notebook_query_start` for async flow |
| Rate limit (50/day free) | Wait or switch Google account |
| Stale auth | Run `nlm login` or `notebooklm_refresh_auth` |
| MCP server not found | Run `nlm setup` to configure for your tool |

## Migration Notes (from old browser-based skill)

- **Old:** `python scripts/run.py ask_question.py` → **New:** `notebooklm_notebook_query`
- **Old:** `python scripts/run.py auth_manager.py status` → **New:** `notebooklm_server_info`
- **Old:** `python scripts/run.py notebook_manager.py list` → **New:** `notebooklm_notebook_list`
- **Old:** Browser state in `~/.claude/skills/notebooklm/data/` → **New:** Auth via `nlm login` (tokens in `~/.notebooklm/`)
- **Old:** `session_id` param → **New:** `conversation_id` param (same concept, different name)
- **Old:** Manual Chromium/Patchright setup → **New:** None needed (MCP uses API directly)
