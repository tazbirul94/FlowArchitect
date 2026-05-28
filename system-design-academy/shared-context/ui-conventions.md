# UI Conventions

Design language for UI template specifications. Load for UI/UX Template Agent.

---

## Color Semantics

| Color | Meaning | Use For |
|---|---|---|
| Green | Healthy, success, hit | Cache hits, healthy servers, successful requests |
| Red | Error, failure, miss | Cache misses, failed components, rejected requests |
| Yellow / Orange | Warning, degraded, processing | High load, slow response, retrying |
| Blue | Processing, in-flight, active | In-progress requests, active connections |
| Gray | Idle, inactive, standby | Standby components, empty queues |
| Purple | Special state | Event sourcing replay, admin actions |

## Layout Principles

- **Controls left, output right**: Sliders and buttons on left panel. Visual output on right/center.
- **Status top, details below**: Summary metrics at top. Detailed breakdowns below.
- **Step indicator top-right**: "Step 3 of 7" for tutorial flows.
- **Legend always visible**: Color key always on screen — don't require hover to understand colors.

## Interaction Patterns

| Pattern | Use For |
|---|---|
| Slider | Adjusting continuous variables (traffic rate, cache size, TTL) |
| Toggle | Binary states (enable/disable caching, kill a server) |
| Step buttons (Previous/Next) | Tutorial step progression |
| Dropdown select | Choosing algorithm or strategy (LRU vs LFU, Round-Robin vs Least Connections) |
| Click-to-expand | Component detail panels |
| Animated path | Request/event flowing through architecture |
| Progress bar | Queue depth, cache fill, traffic load |
| Heat map | Server load distribution across a fleet |

## Animation Guidelines

- Requests: Moving dots or arrows, left-to-right or top-to-bottom
- Speed: Default animation at medium speed; slider for fast/slow
- Failure: Red flash on failed component, faded path for broken route
- Recovery: Green pulse when component recovers

## Terminology in UI Labels

Use learner-friendly labels, not technical shorthand:

| Technical | UI Label |
|---|---|
| req/sec | requests per second |
| TTL | time until this expires |
| ACK | acknowledged |
| L7 | request-level routing |
| P50 / P99 | median / 99th percentile latency |
