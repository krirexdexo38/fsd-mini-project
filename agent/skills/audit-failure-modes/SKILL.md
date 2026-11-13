---
description: "Find and rank credible code failure modes before release or during hardening. Reports P0/P1/P2 findings without changing the system."
---
Run only on explicit invocation - by name, slash/dollar command, or workflow stub. Otherwise say this
skill is available and wait.

# Audit Failure Modes

Read the system for failures that have not happened yet. This is a code pre-mortem. `go-live` separately
checks whether runtime launch evidence is true.

## 1. Choose the surfaces

Read the entry point and top-level layout. Inspect only surfaces that exist. If the client offers
independent reviewers, fan out only material non-overlapping surfaces; otherwise inspect serially.
The audit owner consolidates citations and rankings.

| Surface | Look for |
|---|---|
| External dependencies | Timeouts, bounded retries and heartbeats, validated response shapes, actionable failures, model limit/filter cases, and cancelled or hung subprocesses. |
| Concurrency and lifecycle | Restart recovery, cancellation propagation, submit/cancel races, replay duplicates, and conflicting writes. |
| Persistence and integrity | Atomic writes, corrupt-read behavior, multi-step transaction or orphan handling, schema/cache versions, disk-full handling, and re-ingest behavior. |
| Resource exhaustion | Streaming and size limits, archive expansion caps, disk and log limits, worker concurrency, and child-process supervision. |
| Configuration and startup | Startup validation, meaningful readiness, unsafe defaults, declared production mode that rejects dev/test affordances, timeout alignment, and usable logs. |
| Security and data hygiene | Sensitive file access, secrets at rest and in logs, sanitized external errors, retention, export, and deletion across every personal-data store. |
| Frontend resilience | Fetch cancellation and timeout, polling backoff and visibility, optimistic rollback, focus rechecks, error boundaries, and rollover-safe cursors. |
| Model and agent surface | Prompt injection at every untrusted channel, data-to-model flows, spend caps, irreversible autonomy, and a reversible kill switch. |

## 2. Rank without inventing work

Give every finding one dominant category and a `file:line` citation. Before recommending a handler, ask
whether a simpler contract can make the bad state impossible. Rank only concrete findings:

- **P0:** correctness, data loss, or privacy harm before another user is affected.
- **P1:** likely reliability failure under realistic use or load.
- **P2:** defense in depth or polish worth doing with capacity.

If the failure is acceptable for the real usage profile, say why and include the cost and blast radius.
Do not manufacture pushback. Suggest one first-PR bundle only when several P0s share real scaffolding.

## 3. Report

```text
## Categories audited
- category - surface examined

## Findings
| ID | Failure mode | Where | Priority |
|---|---|---|---|
| A1 | ... | file:line | P0 |

## Pushback
- finding - why it is acceptable now

## Suggested first PR
- shared P0 work, or no natural bundle
```

Do not summarize the system. Report in chat unless the user asks to save
`docs/audits/YYYY-MM-DD-failure-modes.md`; when requested, save it without asking again.

## Out of scope

Test-coverage quality belongs to `improve-readability`; an existing performance regression belongs to
`diagnose`; document consistency belongs to `audit-drift`.
