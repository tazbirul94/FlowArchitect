"""
Paths, constants, and configuration for the FlowArchitect orchestration pipeline.
"""

from pathlib import Path

# ── Root paths ────────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent
ACADEMY = REPO_ROOT / "system-design-academy"
CONCEPTS = ACADEMY / "concepts"
STAGING = ACADEMY / "staging"
STORIES = ACADEMY / "stories"
DIAGRAMS = ACADEMY / "diagrams"
TUTORIALS = ACADEMY / "tutorials"
ENTERPRISE = ACADEMY / "enterprise-use-cases"
REVIEWS = ACADEMY / "review-checklists" / "reviews"
RESEARCH_BRIEFS = ACADEMY / "agent-prompts" / "research-briefs"
EXECUTION_MANIFEST = ACADEMY / "agent-prompts" / "execution-manifest.md"

# ── Shared context files ───────────────────────────────────────────────────────
SHARED = ACADEMY / "shared-context"
TERMINOLOGY = SHARED / "terminology.md"
ARCHITECTURE_STANDARDS = SHARED / "architecture-standards.md"
UI_CONVENTIONS = SHARED / "ui-conventions.md"
NAMING_CONVENTIONS = SHARED / "naming-conventions.md"
TOKEN_RULES = SHARED / "token-optimization-rules.md"
ENTERPRISE_GLOSSARY = SHARED / "enterprise-architecture-glossary.md"

# ── Template files ─────────────────────────────────────────────────────────────
CONCEPT_TEMPLATE = ACADEMY / "concept-template.md"
# Handle both possible casing
if not CONCEPT_TEMPLATE.exists():
    CONCEPT_TEMPLATE = ACADEMY / "CONCEPT_TEMPLATE.md"
REVIEW_CHECKLIST = ACADEMY / "REVIEW_CHECKLIST.md"
TOKEN_OPTIMIZATION = ACADEMY / "TOKEN_OPTIMIZATION.md"
UI_TEMPLATE_SYSTEM = ACADEMY / "UI_TEMPLATE_SYSTEM.md"

# ── Claude model ───────────────────────────────────────────────────────────────
# Haiku for fast parallel workers, Sonnet for generator/reviewer
MODEL_FAST = "claude-haiku-4-5-20251001"
MODEL_SMART = "claude-sonnet-4-6"

# ── Batch sizing per phase ─────────────────────────────────────────────────────
BATCH_SIZE = {
    1: 1,   # Foundation — establish quality baseline
    2: 3,   # Beginner
    3: 4,   # Intermediate
    4: 2,   # Advanced distributed — complex
    5: 2,   # Expert enterprise — complex
    6: 5,   # UI phase — optimizer batches
}

# ── All 44 concepts grouped by phase ──────────────────────────────────────────
CONCEPTS_BY_PHASE: dict[int, list[dict]] = {
    2: [
        {"name": "Client-Server Architecture", "slug": "client-server", "category": "Architecture"},
        {"name": "APIs",                        "slug": "apis",           "category": "Networking"},
        {"name": "REST",                        "slug": "rest",           "category": "Networking"},
        {"name": "HTTP Basics",                 "slug": "http-basics",    "category": "Networking"},
        {"name": "Databases",                   "slug": "databases",      "category": "Data"},
        {"name": "SQL vs NoSQL",                "slug": "sql-vs-nosql",   "category": "Data"},
        {"name": "Caching",                     "slug": "caching",        "category": "Data"},
        {"name": "CDN",                         "slug": "cdn",            "category": "Data"},
        {"name": "Authentication",              "slug": "authentication", "category": "Security"},
        {"name": "Authorization",               "slug": "authorization",  "category": "Security"},
        {"name": "Docker",                      "slug": "docker",         "category": "Operations"},
        {"name": "Monolith",                    "slug": "monolith",       "category": "Architecture"},
    ],
    3: [
        {"name": "GraphQL",           "slug": "graphql",           "category": "Networking"},
        {"name": "gRPC",              "slug": "grpc",              "category": "Networking"},
        {"name": "Load Balancer",     "slug": "load-balancer",     "category": "Infrastructure"},
        {"name": "API Gateway",       "slug": "api-gateway",       "category": "Infrastructure"},
        {"name": "Indexing",          "slug": "indexing",          "category": "Data"},
        {"name": "Replication",       "slug": "replication",       "category": "Data"},
        {"name": "Sharding",          "slug": "sharding",          "category": "Data"},
        {"name": "Rate Limiting",     "slug": "rate-limiting",     "category": "Security"},
        {"name": "OAuth",             "slug": "oauth",             "category": "Security"},
        {"name": "JWT",               "slug": "jwt",               "category": "Security"},
        {"name": "Message Queues",    "slug": "message-queues",    "category": "Messaging"},
        {"name": "Pub/Sub",           "slug": "pub-sub",           "category": "Messaging"},
        {"name": "Microservices",     "slug": "microservices",     "category": "Architecture"},
        {"name": "Service Discovery", "slug": "service-discovery", "category": "Architecture"},
    ],
    4: [
        {"name": "Event-Driven Architecture", "slug": "event-driven-architecture", "category": "Messaging"},
        {"name": "Kafka Event Streaming",     "slug": "kafka-event-streaming",     "category": "Messaging"},
        {"name": "Event Sourcing",            "slug": "event-sourcing",            "category": "Messaging"},
        {"name": "CQRS",                      "slug": "cqrs",                      "category": "Messaging"},
        {"name": "Saga Pattern",              "slug": "saga-pattern",              "category": "Reliability"},
        {"name": "Dead Letter Queue",         "slug": "dead-letter-queue",         "category": "Reliability"},
        {"name": "Retry Mechanism",           "slug": "retry-mechanism",           "category": "Reliability"},
        {"name": "Idempotency",               "slug": "idempotency",               "category": "Reliability"},
        {"name": "Circuit Breaker",           "slug": "circuit-breaker",           "category": "Reliability"},
        {"name": "CAP Theorem",               "slug": "cap-theorem",               "category": "Architecture"},
        {"name": "Consistency",               "slug": "consistency",               "category": "Architecture"},
        {"name": "Eventual Consistency",      "slug": "eventual-consistency",      "category": "Architecture"},
    ],
    5: [
        {"name": "Distributed Systems",           "slug": "distributed-systems",           "category": "Architecture"},
        {"name": "Availability",                  "slug": "availability",                  "category": "Architecture"},
        {"name": "Reliability",                   "slug": "reliability",                   "category": "Architecture"},
        {"name": "Fault Tolerance",               "slug": "fault-tolerance",               "category": "Architecture"},
        {"name": "Observability",                 "slug": "observability",                 "category": "Operations"},
        {"name": "Enterprise Architecture",       "slug": "enterprise-architecture",       "category": "Architecture"},
        {"name": "CI/CD",                         "slug": "ci-cd",                         "category": "Operations"},
        {"name": "Kubernetes",                    "slug": "kubernetes",                    "category": "Operations"},
        {"name": "Cloud Deployment",              "slug": "cloud-deployment",              "category": "Operations"},
        {"name": "Security",                      "slug": "security",                      "category": "Security"},
        {"name": "Distributed Tracing",           "slug": "distributed-tracing",          "category": "Operations"},
    ],
}

# Simple concepts that don't need a research brief (Planner can skip Agent 2)
SKIP_RESEARCH = {
    "Client-Server Architecture", "HTTP Basics", "Databases", "Docker",
    "Monolith", "CDN", "Caching",
}
