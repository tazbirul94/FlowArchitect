# Enterprise Architecture Glossary

Enterprise-specific terms for Expert-level content generation. Load only for Expert sections and Enterprise Architect Agent tasks.

---

## Governance & Standards

**ADR (Architecture Decision Record)**: A document capturing an architectural decision, its context, and its consequences.
**TOGAF (The Open Group Architecture Framework)**: An enterprise architecture framework and methodology.
**AWS Well-Architected Framework**: AWS's set of best practices across six pillars: operational excellence, security, reliability, performance, cost optimization, sustainability.
**NIST Cybersecurity Framework**: A voluntary framework for managing and reducing cybersecurity risk.
**Domain-Driven Design (DDD)**: Software design approach that models software around business domains.
**Bounded Context**: A DDD concept — the boundary within which a particular domain model applies.
**RFC (Request for Comments)**: An internal proposal process for significant architectural changes.

## Compliance & Regulation

**GDPR (General Data Protection Regulation)**: EU regulation governing data protection and privacy for EU individuals.
**HIPAA (Health Insurance Portability and Accountability Act)**: US law regulating the handling of Protected Health Information (PHI).
**PCI-DSS (Payment Card Industry Data Security Standard)**: Security standards for organizations handling credit card data.
**SOC 2 (Service Organization Control 2)**: Audit standard for SaaS companies covering security, availability, processing integrity, confidentiality, privacy.
**ISO 27001**: International standard for information security management systems.
**Data Residency**: Requirement that data must be stored in a specific geographic region.
**Data Sovereignty**: Legal concept that data is subject to the laws of the country where it is stored.
**Right to Erasure (GDPR Article 17)**: User right to have their personal data deleted — architecturally complex in event logs and backups.
**PHI (Protected Health Information)**: Any health information that identifies an individual — must be encrypted and access-controlled under HIPAA.
**PII (Personally Identifiable Information)**: Data that can identify an individual (name, email, IP address, etc.).
**Data Classification**: Categorizing data by sensitivity level (Public, Internal, Confidential, Restricted).
**Encryption at Rest**: Encrypting data stored on disk so it's unreadable without the decryption key.
**Encryption in Transit**: Encrypting data while it moves across a network (TLS/HTTPS).
**Key Management Service (KMS)**: A managed service for creating, storing, and rotating encryption keys.
**Audit Log**: An immutable record of who did what to which data and when — required for compliance in most regulated industries.

## SLA / SLO / Error Budgets

**SLA (Service Level Agreement)**: A contractual commitment to a minimum availability or performance level; breaking it has financial penalties.
**SLO (Service Level Objective)**: An internal target, stricter than the SLA, used to ensure the SLA is met.
**SLI (Service Level Indicator)**: The actual measured metric (e.g., 99.94% requests succeeded in the past 30 days).
**Error Budget**: The acceptable amount of downtime or errors derived from the SLO (100% − SLO). If SLO is 99.9%, error budget is 0.1% = 8.7 hours/year.
**Burn Rate**: How quickly the error budget is being consumed; high burn rate requires incident response.
**Toil**: Repetitive, automatable manual operational work — reducing toil is a core SRE objective.
**SRE (Site Reliability Engineering)**: A discipline applying software engineering practices to operations and reliability.

## Cost Modeling

**TCO (Total Cost of Ownership)**: Full cost of a system: infrastructure, licensing, engineering, operations, and opportunity cost.
**OpEx (Operational Expenditure)**: Ongoing costs — cloud compute, SaaS subscriptions, staff.
**CapEx (Capital Expenditure)**: Upfront asset costs — data center hardware, perpetual licenses.
**Cost per Request**: Infrastructure cost divided by request count — key metric for cost optimization.
**Reserved Instances**: Pre-purchased cloud compute at 30-60% discount vs on-demand, committing to 1-3 year term.
**Spot Instances**: Interruptible cloud compute at 70-90% discount — suitable for fault-tolerant batch workloads.
**Right-Sizing**: Choosing instance types and sizes that match actual workload requirements (not over-provisioning).

## Organizational Design

**Platform Team**: Central team that builds internal infrastructure and tools for product teams.
**Domain Team / Product Team**: Team owning a specific business domain or product area.
**Conway's Law**: Organizations design systems that mirror their communication structure.
**Inverse Conway Maneuver**: Deliberately structuring teams to get the desired system architecture.
**Team Topology**: A model for organizing teams around four types: Stream-aligned, Platform, Enabling, Complicated-subsystem.
**Runbook**: A documented procedure for routine or emergency operations tasks.
**Playbook**: A collection of runbooks for common scenarios.
**Blameless Post-Mortem**: An incident review focused on systemic causes, not individual blame.
**Change Freeze**: A period where non-critical changes to production are prohibited (e.g., before major releases, holidays).

## Multi-Region & Disaster Recovery

**Active-Active**: Multiple regions serving live production traffic simultaneously with cross-region failover.
**Active-Passive**: One region serves all traffic; the second region is a standby that activates on failure.
**Failover**: The process of switching traffic from a failed system to a backup system.
**Multi-Region Replication**: Copying data across geographic regions for availability and latency reduction.
**Geo-Routing**: Directing users to the nearest or most appropriate region based on geography.
**RTO (Recovery Time Objective)**: The maximum acceptable time to restore service after a failure.
**RPO (Recovery Point Objective)**: The maximum acceptable amount of data loss, measured in time.
**DR Drill**: A practice exercise to test and validate the disaster recovery process.
**Warm Standby**: A standby environment that's running but at reduced capacity — can scale up quickly on failover.
**Cold Standby**: A standby environment that's not running — requires startup time on failover.

## Security Architecture

**Zero Trust Architecture**: Security model where no user or system is trusted by default, regardless of network location — verify everything.
**Defense in Depth**: Layered security controls so no single failure exposes the full system.
**WAF (Web Application Firewall)**: A firewall that monitors and filters HTTP traffic between the internet and an application.
**DDoS (Distributed Denial of Service)**: An attack that overwhelms a system with traffic from many sources.
**SIEM (Security Information and Event Management)**: A system that aggregates security logs and alerts on suspicious patterns.
**Principle of Least Privilege**: Users and systems should have only the minimum permissions required.
**Secrets Management**: Secure storage and rotation of credentials, API keys, and certificates (e.g., HashiCorp Vault, AWS Secrets Manager).
**Certificate Rotation**: The process of replacing expiring TLS certificates before they expire to prevent outages.
**Penetration Testing**: Authorized simulated attack on a system to identify security vulnerabilities.
**Threat Modeling**: A structured process for identifying and prioritizing potential security threats.

## Vendor Evaluation

**Build vs Buy vs Managed**: Framework for deciding whether to build a capability in-house, purchase a commercial product, or use a managed cloud service.
**Vendor Lock-In**: Dependency on a specific vendor's proprietary features that makes switching costly.
**SLA Penalty**: Financial compensation owed by a vendor when they miss their SLA commitment.
**Open Source**: Software with publicly available source code; no licensing cost but self-managed.
**Managed Service**: A cloud-hosted version of a technology managed by the provider (e.g., AWS RDS for PostgreSQL, AWS MSK for Kafka).
**Proof of Concept (PoC)**: A small-scale test implementation to validate a vendor or technology choice before full commitment.
