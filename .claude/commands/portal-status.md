# /portal-status — Show portal build progress

Quick status check: what's built, what's pending, what batch is next.

## What to do

1. Glob `software-architect-learning-portal/pages/*.html`
2. Compare against the 25-page list (00–24) in CLAUDE.md
3. Show a status table
4. Identify the next batch to build

## Output format

```
DevArchitect Portal — Build Status
===================================

BUILT (N/25):
  ✅ 01 — Docker Fundamentals
  ✅ 02 — Docker Commands
  ...

PENDING (N/25):
  ⏳ 00 — Learning Roadmap
  ⏳ 07 — Container Registries & Nexus
  ...

NEXT BATCH: Batch 3 (pages 00, 07, 08)
COMMAND: /batch 3

Progress: ██████░░░░░░░░░░░░░░ 6/25 (24%)
```

Keep output compact. No extra explanation needed.
