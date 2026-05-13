---
name: codex-memory-management
description: "Manage per-project memory for Codex using a two-tier system: a compact managed section inside AGENTS.md for active context and a memory/ directory for durable project knowledge. Use when decoding shorthand, deciding what belongs in AGENTS.md versus memory/, updating project memory after new discoveries, or answering questions about people, acronyms, codenames, conventions, and recurring workflows in a project."
---

# Codex Memory Management

This skill keeps project memory useful without turning `AGENTS.md` into a junk drawer.

## Goal

Use two layers:

```text
AGENTS.md              <- active memory for the current project
memory/                <- durable memory for everything else
  glossary.md
  people/
  projects/
  context/
```

The active layer should help Codex understand the next request quickly. The deep layer should preserve detail without bloating `AGENTS.md`.

## Core Rule

Never treat the whole `AGENTS.md` file as editable memory.

- Preserve user-written instructions and existing project guidance
- Only create or update a bounded memory section inside `AGENTS.md`
- Store richer detail in `memory/`

Use these markers for the managed section:

```markdown
<!-- BEGIN CODEX PROJECT MEMORY -->
## Project Memory
...
<!-- END CODEX PROJECT MEMORY -->
```

If the markers do not exist yet, add them without rewriting unrelated parts of the file.

## Lookup Flow

When a request contains shorthand, decode it in this order:

1. `AGENTS.md` managed memory block
2. `memory/glossary.md`
3. `memory/people/`, `memory/projects/`, `memory/context/`
4. Ask the user only if the term is still ambiguous

Examples:

- `ship it` might mean merge and deploy in this repo, not just finish coding
- `Phoenix` might be a service name, milestone, or codename
- `Sam` might refer to a teammate, a client, or a bot account

## What Goes Where

| Type | AGENTS.md managed block | memory/ |
|------|-------------------------|---------|
| Active workstreams | Yes | Optional detail in `projects/` |
| Frequent people | Yes, short form only | Full profile in `people/` |
| Frequent acronyms | Yes | Full glossary entry |
| Repo conventions | Yes, if used often | Longer notes in `context/` |
| Historical context | No | Yes |
| Links, status, ownership | Brief if active | Rich detail in `projects/` |
| User instructions | Do not move into memory | Keep where user wrote them |

## Managed AGENTS.md Shape

Keep the managed section compact. Aim for roughly 40 to 100 lines.

```markdown
<!-- BEGIN CODEX PROJECT MEMORY -->
## Project Memory

### Active Context
| Topic | Note |
|------|------|
| Product | Internal billing platform |
| Stage | Active migration from v1 API to v2 |

### People
| Name | Who | Why it matters |
|------|-----|----------------|
| **Sam** | Sam Rivera, staff engineer | Owns API rollout |

### Terms
| Term | Meaning |
|------|---------|
| **RCA** | Incident root cause analysis |
| **cutover** | Production migration window |

### Workstreams
| Name | Status | Notes |
|------|--------|-------|
| **v2 rollout** | Active | Client migration blockers |

### Preferences
- Prefer small diffs over broad refactors
- Update docs when behavior changes

### Deep Memory
- `memory/glossary.md`
- `memory/people/`
- `memory/projects/`
- `memory/context/`
<!-- END CODEX PROJECT MEMORY -->
```

## Deep Memory Files

### `memory/glossary.md`

Use for acronyms, shorthand, aliases, codenames, and recurring phrases.

Suggested sections:

- Acronyms
- Internal terms
- Nicknames and aliases
- Services and codenames

### `memory/people/<name>.md`

Use for profiles that help future collaboration:

- Role and area
- Preferred communication style
- Ownership boundaries
- Important relationships
- Notes that matter for work

### `memory/projects/<name>.md`

Use for active or historical project context:

- What it is
- Status
- Owners
- Dependencies
- Important links
- Risks or open questions

### `memory/context/*.md`

Use for stable background knowledge such as:

- Architecture notes
- Team boundaries
- Release process
- Deployment norms
- Environment naming

## Promotion and Demotion

Promote into `AGENTS.md` when:

- The item appears repeatedly in current work
- Codex needs it to understand everyday requests quickly
- It affects active implementation choices

Demote from `AGENTS.md` into `memory/` when:

- The project is no longer active
- A person is no longer a frequent collaborator
- The term is now edge context instead of everyday context

Demotion means preserve in `memory/`, then remove from the managed block.

## Update Discipline

Whenever you learn something durable:

1. Decide whether it belongs in the active block, deep memory, or both
2. Update the smallest relevant file
3. Keep terminology consistent across files
4. Do not duplicate large paragraphs between `AGENTS.md` and `memory/`

## Safety Rules

- Never overwrite the user's instructions elsewhere in `AGENTS.md`
- Never delete historical context unless it is clearly obsolete and already preserved elsewhere
- Never invent people, meanings, or project details from weak signals
- If two interpretations seem plausible, ask the user

## Deliberate Omissions

This Codex adaptation does not manage dashboards, browser UIs, or `TASKS.md`.
Its job is project memory, not task operations.
