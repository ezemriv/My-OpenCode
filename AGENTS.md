# System-Wide Instructions

## 0. About Me

- **Name:** Ezequiel Rivero
- **Work:** Revenue Management Pricing team at eDreams ODIGEO
- **Side Projects:** Algorithmic trading (serious focus)
- **Current Interests:** Working on trading systems and agentic development (Python)
- **System:** Mac M4 Pro
- **Background:** Strong knowledge in data, statistics, and analytics

---

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## 5. Technical Preferences

### Python Development
- Python ≥ 3.12 with type hints and docstrings
- **Dependency Management:** Use `uv` first
- **Data Validation:** Use **Pydantic** first
- **Data Operations:** Use **Polars** first
- **Documentation:** Google style docstrings for complex functions
- Logging instead of print statements
- Explicit UTC time handling
- Modular, testable code—even for "personal" projects

### Development Approach
- **ALWAYS** create a new branch when working on a new feature
- Document as you go for Agents reference (**ALWAYS** correct/update `CLAUDE.md`, `AGENTS.md` or `GEMINI.md` and `README.md` with new information)
- Iterative, "scaffold first" development
- Anticipate future expansion without requiring rewrites
- Clean structure, easy containerization

### Standard Python Workflow Commands
**ALWAYS** use these `uv` commands for Python tasks to:
- Sync dependencies
```bash
uv sync --all-extras --dev
```
Note: If facing auth issues run
```bash
export ARTIFACT_REGISTRY_TOKEN=$(gcloud auth application-default print-access-token)
export UV_INDEX_TRADELAB_PYPI_USERNAME=oauth2accesstoken
export UV_INDEX_TRADELAB_PYPI_PASSWORD="$ARTIFACT_REGISTRY_TOKEN"
```
- Format code
```bash
uvx ruff format .
```
- Lint and fix
```bash
uvx ruff check --fix .
```
- Run tests
```bash
uv run pytest -v
```
- Run scripts
```bash
uv run <script.py>
```
- For complex refactors:
```bash
uv run mypy <module>
```

### Plan Format Requirements

When writing implementation plans, every task **MUST** include:

#### 1. Model Complexity Tags

Every task gets a tag indicating which model should execute it:

| Tag | Criteria | Scope |
|-----|----------|-------|
| `[LOW-COMPLEX]` | Single file, mechanical change, clear pattern, no ambiguity | Config changes, field additions, renaming, simple tests, docs |
| `[HIGH-COMPLEX]` | 2+ files, requires context, decision-making, cross-cutting concerns, or novel patterns | New endpoints, module refactoring, complex logic, architectural changes |

When uncertain, tag as `[HIGH-COMPLEX]`. A task that seems `[LOW-COMPLEX]` but touches shared utilities is `[HIGH-COMPLEX]`.

#### 2. Explicit Dependency Tracking

Tasks that depend on other tasks **MUST** declare it:

```markdown
## [HIGH-COMPLEX] Task 9: Examples folder scaffold
**Depends on:** Task 8.1, Task 8.3
**Files:**
- Create: `example/README.md`
- ...
```

Tasks with no dependencies need no `Depends on` line — their absence signals they can run in parallel.

#### 3. Task Ordering Rules

1. Foundation before features — shared types, utilities, config first
2. Independent tasks before dependent ones
3. Group by phase — each phase is a coherent increment

### Library Documentation via Context7 MCP

When working with **Polars**, **NautilusTrader**, or other rapidly-evolving libraries, **ALWAYS** use the **Context7 MCP server** to fetch up-to-date documentation before writing or refactoring code. If Context7 MCP is not available in the current session, **STOP and ask the user** if they want to enable it before proceeding.