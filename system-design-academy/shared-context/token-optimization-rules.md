# Token Optimization Rules (Compact)

Quick reference for agents. Full rules in TOKEN_OPTIMIZATION.md.

---

1. One concept per session. Never load two concept files.
2. Load shared context once at session start. Don't re-paste it.
3. Generate and review in separate calls.
4. Reference templates by name — don't paste them.
5. Specify level — don't generate all 4 levels unless concept is simple.
6. No preamble. Start output with content directly.
7. Skip research brief for well-known concepts (API, REST, Docker, etc.).
8. Batch all 4 tutorial level steps in one call (they're short).
9. Interview section needs only definition + 2-3 trade-offs as input.
10. Diagrams are separate files — merge at Documentation Agent step.
11. Enterprise section is a separate agent call.
12. Token budget per concept: under 10K tokens total.
13. Compress after review passes — not during generation.
14. Targeted fix: provide only the failed section, not the full file.
15. Shared context files total: under 5K tokens combined.
