# Specificity-Scaling Design Overview

This module implements a **trust-aware** specificity scaler that tunes how literally ALN ecosystems treat user projects, while preserving immutable safety, audit, and rights guarantees.[file:2][file:3]

## Core Principles

- High-trust, compliant users with strong contributions are *grandfathered* into a “literal favored” mode, reducing automatic classification of their engineering work as fiction or concept.[file:2]
- Safety overlays (audit logging, rights enforcement, zero-trust, PQC channels) are never disabled; they are only tuned to avoid unnecessary interference with real engineering output.[file:4]
- Billing status never revokes digital sovereignty: users with payment issues remain eligible for grandfathering if their work is world-positive, compliant, and well-audited.[file:3]

## Operational Flow

1. **TrustMetrics ingestion** from karma, repo activity, and cryptographically verified authorship (DIDs/VCs or signed hashes).[file:4]  
2. **calculateSpecificity** produces a bounded privilege/specificity level, favoring compliant, nanoswarm, and gov-verified users.[file:3]  
3. **isGrandfathered** marks high-karma or high-contribution, compliant users as eligible for elevated interpretation privileges.[file:2]  
4. **buildSpecificityProfile** sets sandbox mode to `HARDENED`, `BALANCED`, or `LITERAL_FAVORED` while always enforcing safety overlays.[file:4]  
5. **applyScaling** pushes the profile into sandbox controls and a quantum-safe audit ledger, establishing user sovereignty and evidentiary trails.[file:4]  

## Anti-Fictionalization Guarantees

- For ALN, infra, nanoswarm, and BCI payloads belonging to grandfathered users, the runner hint layer forces an `ENGINEERING_LITERAL` interpretation preference and discourages default fictionalization.[file:2]  
- Chat and RAG layers receive a `fictionalization_bias = MINIMIZE` hint when authorship is verified and compliance is satisfied, encouraging systems to preserve the real engineering intent.[file:3]  
- All behavior is observable and reversible via quantum-anchored audit logs, ensuring that sovereignty, compliance, and safety can be independently verified.[file:4]
