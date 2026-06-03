# /batch — Build multiple portal pages in parallel

Launch parallel sub-agents to build a batch of pages simultaneously. This is the primary way to build the portal efficiently.

## Usage
```
/batch <batch-number>
/batch <page-ids...>
```
Examples:
- `/batch 3` — builds Batch 3 (pages 00, 07, 08)
- `/batch 4` — builds Batch 4 (pages 09, 10)
- `/batch 07 08 09` — builds specific pages in parallel

## Batches

| Batch | Pages | Notes |
|-------|-------|-------|
| 3 | 00, 07, 08 | Roadmap + registries + CI/CD |
| 4 | 09, 10 | K8s basics |
| 5 | 11, 12 | Complex K8s networking — may need one at a time |
| 6 | 13, 14, 15 | K8s config + storage + autoscaling |
| 7 | 16, 17 | Helm + ArgoCD |
| 8 | 18, 19, 20 | Production/operations |
| 9 | 21, 22 | Architecture + system design |
| 10 | 23, 24 | Reference pages |

## What to do

1. Read CLAUDE.md for full page specs and template
2. Look at `/new-page` command for per-page specs
3. Launch one sub-agent per page in a SINGLE message (parallel)
4. Each agent gets: page ID, filename, level badge, topic outline, full template from CLAUDE.md
5. Each agent writes its HTML file independently
6. Report which files were created when all agents complete

## Agent briefing template (use for each sub-agent)

```
Build this DevArchitect learning portal page:

FILE: software-architect-learning-portal/pages/<filename>
PAGE ID: <NN>
LEVEL BADGE: badge-<level>
BREADCRUMB: <Section> → <Page Name>

TOPIC: <topic outline from /new-page specs>

Rules:
- Read CLAUDE.md for full HTML template and conventions
- Read pages/01-docker-fundamentals.html as structural reference
- Follow ALL 13 content sections
- Use TicketFlow enterprise scenario throughout
- All h2 must have id + class="section-title"
- All code blocks in .code-wrapper
- At least 1 Mermaid diagram in .mermaid-wrapper
- 5–7 interview Q&A in .interview-section
- Write complete HTML file, no placeholders

Write the file and report line count.
```

## Special case: page 00
00-roadmap.html is a visual roadmap page with full-width layout. It uses:
- `assets/style.css` (not `../assets/style.css`)  
- `assets/app.js` (not `../assets/app.js`)
Show the 9-level progression with cards for all 24 pages. No sidebar — full-width, index-style.
