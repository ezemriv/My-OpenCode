# My-OpenCode

OpenCode configuration and tools.

## OpenCode Go Dashboard

An interactive dashboard for OpenCode Go models with benchmarks, usage limits, and task-based tiering.

**Live URL:** https://ezemriv.github.io/My-OpenCode/

### Features

- **Model Cards:** Visual cards for all 15 OpenCode Go models
- **Task-Based Tiering:** Models organized by use case with Claude comparisons
  - Opus-class: Complex reasoning & coding
  - Sonnet-class: General purpose
  - Haiku-class: Fast, cost-effective tasks
- **Benchmarks:** HumanEval, MMLU, LMSYS Elo scores (when available)
- **Usage Limits:** Visual breakdown of $12/5h, $30/week, $60/month limits
- **Interactive Filters:** Filter by task, tier, or search by name
- **Sorting:** Sort by cost, requests, benchmarks, or name
- **Benchmark Charts:** Visual comparison of model performance
- **Auto-Updates:** Data refreshed weekly via GitHub Actions

### Development

```bash
cd dashboard
npm install
npm run dev
```

### Deployment

The dashboard is automatically deployed to GitHub Pages on every push to `main`.

### Data Updates

Run the GitHub Action manually or wait for the weekly cron job to refresh model data.