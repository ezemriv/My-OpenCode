---
name: codex-project-update
description: Refresh Codex project memory after work. Use when AGENTS.md has gone stale, active context has changed, people or acronyms should be promoted or demoted, or memory/ needs new glossary entries, project notes, or workflow context based on repo activity and the current conversation.
---

# Codex Project Update

Keep project memory current so Codex does not need to relearn the same context every session.

## Scope

This skill updates the Codex memory system only:

- the managed memory block inside `AGENTS.md`
- `memory/glossary.md`
- files in `memory/people/`
- files in `memory/projects/`
- files in `memory/context/`

Do not use this skill to manage task files or dashboards.

## Update Workflow

### 1. Load Current Memory

Read:

- `AGENTS.md`
- `memory/glossary.md`
- relevant files under `memory/people/`, `memory/projects/`, and `memory/context/`

If the structure is missing, use `$codex-project-start` first.

### 2. Scan for New Context

Compare existing memory with the freshest available signals:

- the current conversation
- files you just edited
- nearby docs or config
- recent commits if helpful
- tests or commands that reveal active workflows

Look for:

- new acronyms or shorthand
- newly important people
- renamed or newly active projects
- changed repo conventions
- completed workstreams that should leave the hot cache

### 3. Promote High-Signal Items

Move items into the managed `AGENTS.md` block when they are:

- active right now
- repeatedly referenced
- essential to understanding likely future requests

Keep entries short. `AGENTS.md` should stay scannable.

### 4. Demote Stale Items

When a person, term, or project is no longer active:

1. preserve it in `memory/`
2. remove it from the managed block
3. keep any historical notes that may matter later

Do not delete durable context just because it is no longer hot.

### 5. Reconcile Contradictions

If `AGENTS.md` and `memory/` disagree:

- prefer the newer, better-supported source
- update both layers to match
- ask the user only when the conflict changes behavior and evidence is weak

### 6. Enrich, Don’t Inflate

Good update examples:

- add a newly learned acronym to `memory/glossary.md`
- add owner and rollout notes to `memory/projects/api-v2.md`
- promote `cutover` into `AGENTS.md` because it is now part of daily work

Bad update examples:

- copying full meeting notes into `AGENTS.md`
- storing speculative interpretations as facts
- creating profile files for people mentioned once with no enduring role

## Maintenance Heuristics

Use these defaults:

- `AGENTS.md` is the hot cache
- `memory/` is the archive plus reference layer
- duplicate only what needs fast lookup
- preserve links and ownership in deep memory when they help future execution

## Recommended Managed Block Checks

When updating the managed `AGENTS.md` block, check:

1. Are the listed workstreams still active?
2. Are the people still the ones most likely to appear in future requests?
3. Are there terms being used repeatedly that are still missing?
4. Has the repo workflow changed enough to update preferences or conventions?

## Safety Rules

- Never rewrite user-authored instructions outside the managed block
- Never silently remove historical detail unless it is redundant and preserved elsewhere
- Never assume an acronym expansion without evidence
- Never let the active block become a second README

## Completion Standard

An update is complete when:

- the active block reflects current work
- deep memory preserves the richer detail
- contradictions are resolved
- future requests in this repo will require less re-explaining
