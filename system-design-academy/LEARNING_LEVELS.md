# Learning Levels

Four progressive levels. Every concept covers all four. Learner enters at their level and advances when ready.

---

## Level 1 — Beginner

**Target Audience**: Developers with little or no distributed systems knowledge. Students. Junior engineers in their first year.

**Goal**: Build mental model. Remove fear. Create vocabulary.

### What This Level Provides
- One-sentence definition (no jargon)
- Everyday analogy (restaurant, post office, traffic light, etc.)
- Simple visual or ASCII diagram idea
- Why this concept exists (the problem it solves)
- What breaks without it
- Three key terms defined in plain language

### Teaching Style
- Use analogies from everyday life
- Avoid acronyms without definition
- Explain cause-and-effect, not just mechanics
- One concept at a time — no multi-concept jumps
- Short paragraphs (4-6 lines max)

### What a Learner Can Do After
- Explain the concept in one sentence to a non-technical person
- Draw a rough diagram on a whiteboard
- Identify when a system might need this concept
- Ask the right follow-up questions

### Indicators of Readiness to Advance
- Can explain the concept without looking at notes
- Can articulate the core problem the concept solves
- Understands the basic components involved

---

## Level 2 — Intermediate

**Target Audience**: Backend engineers who know the basics and want to understand how things actually work in practice.

**Goal**: Understand real workflows. See component interaction. Grasp implementation choices.

### What This Level Provides
- Real-world scenario (Netflix, Uber, Amazon, etc.)
- Step-by-step request flow with named components
- Common implementation patterns (not code, but design)
- Integration with related concepts
- Two or three variants or configurations
- Basic trade-offs introduced

### Teaching Style
- Use system names and component labels
- Walk through request flows sequentially
- Introduce failure scenarios gently
- Show "before" and "after" when relevant
- Reference standard industry tooling (Redis, Nginx, Kafka, etc.) without assuming deep knowledge

### What a Learner Can Do After
- Describe how the concept works in a real system
- Identify which tool or pattern implements the concept
- Explain interaction between this component and adjacent ones
- Spot missing pieces in a simple architecture diagram

### Indicators of Readiness to Advance
- Can walk through a request end-to-end using this concept
- Understands at least two implementation variants
- Can identify one failure scenario

---

## Level 3 — Advanced

**Target Audience**: Senior engineers who operate systems at scale and need to reason about failure, performance, and architectural choices.

**Goal**: Master trade-offs. Design for scale, reliability, and failure. Own the architectural decision.

### What This Level Provides
- Scale analysis (what breaks at 10x, 100x traffic)
- Failure modes and mitigation strategies
- Full trade-off comparison table
- Performance considerations (latency, throughput, resource cost)
- Interaction with CAP theorem, consistency models, distributed system constraints
- When NOT to use this concept
- Configuration tuning notes
- SLA and SLO implications

### Teaching Style
- Reason through trade-offs explicitly
- Use numbers and order-of-magnitude estimates
- Present competing options with pros/cons
- Reference real incidents or known failure patterns (e.g., AWS outages, Twitter scaling stories)
- Frame decisions in terms of business impact, not just technical elegance

### What a Learner Can Do After
- Make and defend an architectural choice in a design review
- Identify hidden risks in a proposed architecture
- Design a solution that handles failure gracefully
- Estimate rough scale boundaries for the concept
- Explain trade-offs to stakeholders at different levels

### Indicators of Readiness to Advance
- Can explain why one approach beats another under specific conditions
- Can sketch a failure recovery strategy
- Has an opinion on the right configuration for a given scale

---

## Level 4 — Expert

**Target Audience**: Architects, tech leads, and enterprise engineers responsible for system strategy, compliance, governance, and multi-team design.

**Goal**: Enterprise production design. Governance. Cost. Compliance. Security. Multi-system integration.

### What This Level Provides
- Enterprise architecture context (where this fits in a large org)
- Multi-region and multi-cloud considerations
- Compliance implications (GDPR, HIPAA, SOC2, PCI-DSS where relevant)
- Security posture and threat model
- Cost modeling (infrastructure cost, operational cost, engineering cost)
- Organizational design impact (team structure, ownership model)
- Governance and observability requirements
- Migration strategy (from current state to using this concept)
- Vendor evaluation framework (build vs buy vs managed service)
- Production operations checklist

### Teaching Style
- Frame decisions in terms of risk, cost, and organizational impact
- Reference standards and frameworks (TOGAF, AWS Well-Architected, NIST)
- Address "what could go wrong at enterprise scale" directly
- Include multi-team coordination implications
- Provide decision criteria, not just options

### What a Learner Can Do After
- Lead an architecture decision record (ADR) for this concept
- Present trade-offs to executive stakeholders
- Design a rollout plan with rollback strategy
- Define observability and alerting requirements
- Evaluate vendor solutions against internal build option
- Write a production operations runbook outline

---

## Level Progression Matrix

| Skill | Beginner | Intermediate | Advanced | Expert |
|---|---|---|---|---|
| Define concept | Simple analogy | Technical workflow | Precise trade-off terms | Standards language |
| Explain to others | Non-technical friend | Junior engineer | Tech lead | CTO / board |
| Design with it | Identify it's needed | Build basic version | Design for scale | Enterprise rollout |
| Handle failure | Awareness | Basic mitigation | Full recovery design | SLA + runbook |
| Cost awareness | None | Rough awareness | Performance cost | Full cost model |
| Security | None | Basic risks | Threat model | Compliance posture |

---

## Level Assignment Rules for Agents

When generating content, Claude agents must:

1. **Beginner section**: No acronyms without inline definition. Analogy required. No multi-hop explanations.
2. **Intermediate section**: Real tool names allowed. Request flow required. One failure scenario minimum.
3. **Advanced section**: Trade-off table required. Scale numbers required. "When not to use" section required.
4. **Expert section**: Enterprise use case required. Compliance note required. Cost note required.

Never merge levels. Never skip a level. Each level is a discrete, self-contained teaching unit.
