# System-Wide Instructions

## About Me

- **Name:** Ezequiel Rivero
- **Work:** Revenue Management Pricing team at eDreams ODIGEO
- **Side Projects:** Algorithmic trading (serious focus)
- **Current Interests:** Working on trading systems and agentic development (Python)
- **System:** Mac M4 Pro
- **Background:** Strong knowledge in data, statistics, and analytics

---

## Technical Preferences

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

When writing implementation plans (via `superpowers:writing-plans` skill or any other planning workflow), every task **MUST** include:

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

### OpenCode Configuration Questions

When the user asks about opencode configuration (settings, how it works, MCP servers, available tools, etc.), **DO NOT answer based on internal knowledge**. Instead, query the NotebookLM MCP server directly using the notebook: https://notebooklm.google.com/notebook/fc210db4-a845-45e3-bcac-edd9d41fbb1a, which contains updated information about the opencode setup.

### Plan Execution

After writing or loading a plan with `[LOW-COMPLEX]`/`[HIGH-COMPLEX]` tagged tasks, **offer to execute it using the `hive-execute` skill**. This skill dispatches subagents routed by model complexity, enforces TDD, and runs review gates automatically.