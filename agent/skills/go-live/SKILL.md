---
description: "Make an evidence-based GO or NO-GO decision before first traffic or a one-way cutover. Reports runtime gaps without deploying or changing it."
---
Run only on explicit invocation - by name, slash/dollar command, or workflow stub. Otherwise say this
skill is available and wait.

# Go Live

Check runtime facts before first traffic, a domain or DNS move, a datastore migration, or a provider
re-point that holds data or serves inference. `audit-failure-modes` is the code pre-mortem; this gate
checks the running evidence it cannot see.

## 0. Read evidence and authority first

Read the project's deploy and verify scripts, runbooks, schedules, secrets documentation, and the SPEC
rollout section with its [rollout guidance](../to-spec/rollout.md). Cite the evidence those sources
produce; do not recreate a gate from memory.

Classify each check before running it:

- **Existing evidence or read-only check:** inspect an approved config, log, trace, dashboard, or prior
  verifier output.
- **Documented probe:** run only a project-provided verifier within its documented safe environment and
  already-authorized scope.
- **Operational probe:** a synthetic crash, cap exercise, or switch test can create cost or side effects.
  Do not run it implicitly. Require explicit operational authorization and the documented safe environment.

Every applicable row needs current, citable evidence and a pass or fail. Evidence older than the change it
supports fails. A non-applicable row may be struck with a one-line reason; a failed row is never struck.

## 1. Runtime gate

| Area | Verify with evidence |
|---|---|
| Environment and config | Same immutable, versioned artifact across environments (for example, a commit-hash-tagged build); declared production mode; production refuses dev/test affordances; configuration parity with the last-good environment; and applied configuration matching the serving revision. |
| Secrets | Custody and rotation are documented and rehearsed; scans find no secret in images, repos, or state; probes prove required values are loaded without revealing them. |
| Domain, DNS, and TLS | Active certificate, cutover TTL when relevant, and a rehearsed rollback re-point. |
| Data | Verified backups, recovery retention, a dated restore drill, and a restore fence for cursors, tokens, and webhooks. |
| Monitoring | Public uptime probe, budget alert, proven error reporting, and readiness that returns the serving version. |
| Release mechanics | Deploy traceable to its immutable version, serving configuration evidence, rehearsed rollback, previous-release boot against migrated data, and a safe-environment kill-switch proof. |
| Cost | Caps from real prices, per-account and global agent caps when relevant, and billing export or alerts. |
| Support and legal | A human support route, privacy/export/deletion path, and recording or consent disclosure when relevant. |

For a model or agent surface, also verify pinned model IDs, a documented safe-environment cap exercise,
prompt-injection posture for every untrusted channel, and one deployed end-to-end trace. Cite the
failure-mode audit for detailed injection analysis instead of repeating it.

## 2. Verdict

```text
## Verdict: GO / NO-GO

## Blockers
### Priority 0 (P0) - no traffic until fixed
- area and missing evidence, with the action that produces it

### Priority 1 (P1) - fix within days
- non-catastrophic gap

## Struck
- non-applicable row and reason
```

Any missing or failed evidence for data loss, bill shock, prolonged downtime, breach, or lock-in is P0.
A catastrophe guard cannot be struck because of scale. It cannot be downgraded. Do not summarize the
deployment; cite evidence or its absence.

Report in chat unless the user asks to save `docs/audits/YYYY-MM-DD-go-live.md`; when requested, save
it without asking again. A fired `TRIGGER:` in `definitions/infrastructure.md` is a reason to run this
gate before the next cutover.
