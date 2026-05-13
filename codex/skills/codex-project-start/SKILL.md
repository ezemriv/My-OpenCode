---
name: codex-project-start
description: Bootstrap or repair Codex project memory for a repo. Use when a project lacks AGENTS.md, lacks a managed memory section inside AGENTS.md, or has no memory/ directory and Codex needs to initialize them from repo context and the current conversation without overwriting existing instructions.
---

# Codex Project Start

Initialize the Codex memory system for a project without dragging in dashboard or task-manager behavior.

## What to Create

Create or repair these project-local artifacts:

```text
AGENTS.md
memory/
  glossary.md
  people/
  projects/
  context/
```

If `AGENTS.md` already exists, preserve it and add only the managed memory block described in `$codex-memory-management`.

## Initialization Workflow

### 1. Inspect Existing Project Context

Look for the minimum useful context before writing anything:

- `AGENTS.md`
- `README*`
- root manifests such as `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`
- `docs/` and architecture notes
- existing assistant files such as `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, or `.github/copilot-instructions.md`
- current conversation details from the user

If the repo is a git repository, recent commit subjects can help identify active workstreams.

### 2. Create the Memory Directory

If missing, create:

- `memory/glossary.md`
- `memory/people/`
- `memory/projects/`
- `memory/context/`

Use lightweight starter files. Do not fill every file just because it exists.

### 3. Create or Update AGENTS.md

If `AGENTS.md` does not exist, create a minimal file with:

```markdown
# AGENTS

<!-- BEGIN CODEX PROJECT MEMORY -->
## Project Memory
...
<!-- END CODEX PROJECT MEMORY -->
```

If `AGENTS.md` exists:

- keep all existing instructions intact
- append the managed memory block if it is missing
- update only the content inside the markers if the block already exists

### 4. Bootstrap from Real Project Signals

Extract only high-confidence context:

- Product or service names
- Main packages or apps
- Important acronyms
- Known environments
- Frequent owners named in docs or the conversation
- Active migration names, codenames, or subsystem names

Do not turn every symbol or folder into memory.

### 5. Write the First Pass

Populate the managed `AGENTS.md` block with:

- Active context
- Frequent people
- Frequent terms
- Current workstreams
- Working preferences already established by the user or repo

Populate deep memory with richer detail:

- `memory/glossary.md` for acronyms and aliases
- `memory/projects/*.md` for major systems or workstreams
- `memory/context/*.md` for stable repo or workflow notes

### 6. Handle Unknowns Carefully

If there are unresolved but important unknowns:

- ask the user only about the minimum set of blockers, or
- leave the item out of active memory until confirmed

Do not create fake certainty.

## Starter Templates

### `memory/glossary.md`

```markdown
# Glossary

## Acronyms
| Term | Meaning | Notes |
|------|---------|-------|

## Internal Terms
| Term | Meaning | Notes |
|------|---------|-------|

## Aliases
| Alias | Canonical name | Notes |
|-------|----------------|-------|
```

### `memory/projects/<name>.md`

```markdown
# Project Name

## Summary

## Status

## Owners

## Key Details

## Links
```

### `memory/context/repo.md`

```markdown
# Repo Context

## Purpose

## Main Components

## Conventions

## Common Commands
```

## Success Criteria

Initialization is complete when:

1. `AGENTS.md` has a bounded managed memory section
2. `memory/` exists with sensible starter structure
3. The managed block contains only active, high-signal context
4. Deep memory holds the richer details needed later

## Deliberate Omissions

- No dashboard
- No browser UI
- No automatic task system
- No dependence on Claude-specific commands
