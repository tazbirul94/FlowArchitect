# Naming Conventions

File naming, concept naming, and identifier conventions for consistent output across all agents.

---

## File Naming

- Concept files: `kebab-case.md` — `event-driven-architecture.md`, `cap-theorem.md`
- Story files: `[concept-kebab]-story.md` — `load-balancer-story.md`
- Diagram files: `[concept-kebab]-diagrams.md`
- Tutorial files: `[concept-kebab]-[level].md` — `caching-beginner.md`, `caching-expert.md`
- Research briefs: `[concept-kebab]-brief.md`
- Review reports: `[concept-kebab]-review.md`
- Enterprise use cases: `[concept-kebab]-enterprise.md`

## Concept Names in Text

- **In prose**: Title Case — "Load Balancer", "Event-Driven Architecture", "CAP Theorem"
- **In file names**: kebab-case — `load-balancer`, `event-driven-architecture`, `cap-theorem`
- **In metadata fields**: kebab-case — `concept-name: load-balancer`
- **In code/JSON/YAML**: camelCase — `loadBalancer`, `eventDrivenArchitecture`
- **Acronyms in prose**: Always expand on first use — "CAP Theorem (Consistency, Availability, Partition Tolerance)"

## Level Names

Capitalize in all contexts: Beginner, Intermediate, Advanced, Expert

## Agent Names

Title Case: Planner Agent, Concept Generator Agent, Story Writing Agent, etc.

## Category Names

Exact strings to use in metadata:
- `Networking`
- `Data`
- `Security`
- `Messaging`
- `Reliability`
- `Architecture`
- `Operations`
- `Infrastructure`
