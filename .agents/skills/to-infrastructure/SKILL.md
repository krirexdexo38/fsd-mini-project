---
name: to-infrastructure
description: Define the development-to-production path and external service decisions in definitions/infrastructure.md. Use on a greenfield project before /to-spec, when choosing or re-picking one provider, or when a deployment path actually changes.
disable-model-invocation: true
---

Run only on explicit invocation by name, slash/dollar command, or workflow stub. Otherwise say this
skill exists and wait.

# To Infrastructure

definitions/infrastructure.md holds two related things: the path from development to production,
and the external services that path uses. /go-live later verifies the running facts recorded here.
This skill defines the plan; it does not claim the running system already matches it.

Read [the selection method](../../docs/selection-method.md) for the current-source research method and this directory's
[pipeline guidance](pipeline.md) for the gate, promotion, apply, and rollback mechanics. Use the detailed guide only
for the decision in front of you.

## Choose the route

| Situation | Do this | Do not reopen |
|---|---|---|
| First infrastructure definition | Use the greenfield path once | Nothing is assumed yet |
| Add or re-pick one service | Use the service decision path | Environments, gates, deployment, and infrastructure-as-code unless this change needs one |
| Change an environment, gate, deployment, promotion, rollback, or infrastructure-as-code rule | Update only the relevant plumbing section | Unrelated service choices |
| A NEXT REVIEW or TRIGGER fires | Revisit only the affected record | Settled records with no fired trigger |

A single-service change is not a reason to redesign the deployment path.

## Greenfield path

Ask one unresolved decision at a time and recommend an answer.

1. **Development to production.** Choose local-first, cloud-first, or hybrid using the seven
   questions in the selection method. Record the route, its trade-off, parity commitments,
   line-start TRIGGER: lines, and NEXT REVIEW date.
2. **Environment ladder.** List each real environment: purpose, data, external services,
   deployer, and lifetime. Keep the ladder small. Each environment uses the same immutable
   release input appropriate to the product: a container image, package, binary, mobile build,
   or pinned source deployment. A demo is a configuration profile, not a fork.

   Production declares itself and rejects dev/test affordances. Non-production uses synthetic
   data unless a masked exception is recorded. Configuration is shared across environments;
   environment values and state locations are selected deliberately, never by copying a fork.
   Record the deploy rung for verification fidelity (how closely tests match real use) in /to-spec.
3. **Gate ladder.** Follow [pipeline guidance](pipeline.md) sections 1 through 3. Record each level, its runnable
   repository entry point, what it proves, the one required merge check, advisory lanes and
   their notifier, and any scheduled lane. CI calls the same scripts a person can run.
4. **Build and deployment.** Follow [pipeline guidance](pipeline.md) sections 4 through 7. Record what produces the
   immutable release input, when it promotes, how a candidate is checked before traffic, who can
   deploy production, migration ordering, mutation serialization, secrets handling, and rollback.
   Build once and promote the same release input; do not rebuild per environment.
5. **Infrastructure as code.** Use it when the surface or environment count makes a written
   console process unsafe. Follow [pipeline guidance](pipeline.md) sections 8 through 10 for remote state, short-lived
   applying identity, plan/apply separation, destroy protection, and exclusions that need a check.

Record these as Development-to-production path, Environments, Gate ladder, Build and deploy, and
Infrastructure as code. The detailed guide contains the traps; cite it instead of copying it into
every decision.

## Service decision path

Use this path for one capability without rewriting the plumbing.

1. Write five requirements: capability, scale now and at 12 months, residency, budget ceiling,
   and one non-negotiable.
2. Research the current market. Include the existing platform's bundled option when a platform
   exists, plus realistic alternatives. Use each candidate's own pricing, terms, and capability
   sources. If those sources cannot be checked, keep the decision open rather than invent facts.
3. Disqualify candidates against the requirements. Score cost, exit, operations, maturity, limits,
   tier-specific service level agreement, residency, and security/compliance. Explain every red.
4. Spike only a genuine tie. Set a short time limit and kill criteria before starting.
5. Replace the current section for the affected capability and append its accepted C-* record.
   Do not change the deployment design unless the service change actually requires it.

If no primary platform exists, choose the platform or hosting basis first. Only then use the
bundled-service default. When one exists, prefer its bundled capability unless a requirement
forces a different choice.

## Records

Follow the shared [amend mode](../../docs/amend-mode.md). The current body has one ## section per plumbing area or service capability. The first accepted
current body gets the shared C-001 baseline record. A re-pick replaces the current section and
appends a direct Change C-* record; Git retains the detailed earlier research.

~~~md
## Change C-018
Affects: § Transactional email
Before: <prior approved provider contract>
After: <new approved provider contract>
Preserve: <nearby behavior that stays>
Verify: <migration, gate, or go-live proof>
Work: <task id or pending>
~~~

Each service section records:

- requirements and non-negotiable;
- dated first-party research and shortlist;
- scorecard and justified red flags;
- chosen service and one-sentence trade-off;
- cost at current and expected scale;
- exit path;
- alternatives rejected;
- line-start TRIGGER: lines; and
- NEXT REVIEW: YYYY-MM-DD.

A plumbing section records the decisions that apply to it, evidence for any provider-specific
claim, the relevant trigger, and its verification or rollback path. Do not pad it with a provider
scorecard that belongs only to a service choice.

## Category prompts

Ask only the questions that could change the choice.

| Capability | Default when a platform exists | Questions that can overturn it |
|---|---|---|
| Compute | Platform compute | Duration, state, scale-to-zero, cold-start tolerance |
| Relational store | Managed store | Recovery, read scale, residency |
| Cache | None | Measured bottleneck |
| Queue/events | Existing database | Need for a broker or independent scaling |
| Object storage | Platform bucket | Egress, lifecycle, residency |
| Secrets | Platform secret manager | Rotation, audit, blast radius |
| Auth | Standard protocol or platform | Portability, single sign-on, residency |
| Email or SMS | Dedicated provider | Deliverability/reach, data agreement, cost |
| DNS/CDN/TLS | Platform service | Certificate automation, egress, cache control |
| CI/CD | Code host service | Minutes, self-hosting, secret handling |
| Telemetry | Platform telemetry | Ingest, retention, cardinality |
| Error tracking | Dedicated provider | Volume, redaction, retention |
| Backups/DR | Managed recovery | Cross-region and retention needs |
| Feature flags | Configuration first | Shared control and audit need |
| Payments | Hosted checkout | Avoiding card-data custody |

Avoid free-tier cliffs, egress surprises, resume-driven picks, premature multi-cloud, reseller
lock-in, agent-priced seats without a cost model, enterprise-gated basics, and an unwritten exit.

## Freshness

Date every researched fact. clean-house sweeps NEXT REVIEW: and TRIGGER: lines; a fired trigger
feeds the appropriate re-pick or /go-live check. Do not put a fixed vendor, price, or version in
this method. Those belong in the dated record.
