---
name: to-spec
description: "Turn accepted definitions into definitions/spec.md: the implementation contract for modules, interfaces, verification, rollout, operations, and security. Use when the product decisions are settled enough to plan and build."
disable-model-invocation: true
---

Run only on explicit invocation by name, slash/dollar command, or workflow stub. Otherwise say this
skill exists and wait.

# To Spec

The SPEC explains how the agreed product will work. The PRD keeps why and for whom; journeys keep
user steps and proof; mockups keep screen design. Reuse those sources instead of rewriting them.

Do not reopen settled decisions. Ask only when an upstream artifact is missing a material boundary
that changes scope, an interface, verification, or rollout.

## Amend mode

If definitions/spec.md exists and an upstream artifact changed, use [amend mode](../../docs/amend-mode.md), the shared C-* ID, and exact
headings it affects. Draft outside the current body. When accepted, replace only those sections,
reconcile contradictions, and append ## Change C-* with exact Affects: headings. Then /to-issues
creates or reconciles only tasks affected by that change.

## Common path

1. **Read the accepted inputs.** They are baselines, not suggestions. Surface a contradiction
   before writing a different implementation decision.

   | Input | Use it for | If missing |
   |---|---|---|
   | definitions/prd.md | Product purpose and constraints | Stop and name /to-prd |
   | definitions/journeys.md | User proof and branches | Required for feature or launch work; name /to-journeys when missing |
   | definitions/mockups.md | UI panels and visual identity | Required only when this change affects a persistent UI surface not already specified; name /to-mockups |
   | definitions/harness.md | Custom agent/runtime choices | Required only when the product needs that harness |
   | definitions/mcp-servers.md | Public Model Context Protocol (MCP) tool contracts | Required only when producing an MCP server |
   | definitions/runtime.md | Residency, telemetry backend, and cost limits for an unattended loop | Fold into relevant sections |
   | definitions/infrastructure.md | Service capability choices | Point at the selected section; do not repeat vendor rationale |

2. **Include only sections that govern a real thing.** Every SPEC needs modules and interfaces,
   a test plan, verification choices, and scope. Include data, API, dependencies, rollout,
   observability, security, product surface, harness, tool, state, role, coordination, gate,
   processing-flow or browser-automation sections only when that concern exists. Do not create an empty heading; use a
   one-line exclusion only when the reason prevents future ambiguity.
3. **Make the design buildable.** Give each module one owned decision and a small interface. Map
   every journey proof to the modules that deliver it. Derive tests from settled requirements.
4. **Set verification fidelity: how closely tests match real use.** Choose the lowest faithful stand-in for each dependency, then
   name the crossover to real data, service, deploy, or user journey. A slice cannot claim done
   on a mock when its journey requires the real dependency.
5. **Save and hand off.** Draft outside the accepted body. The first accepted SPEC gets the C-001
   baseline record with exact top-level Affects: headings. An increment updates its current body
   and matching C-* record together. Commit the accepted artifact, report its C-* ID, and name
   /to-issues. /judge-idea remains optional for a load-bearing decision.

## Template

<spec-template>

## Sources

List the accepted artifacts read and the C-* records that change this SPEC.

## Product surfaces

Only for a product with persistent UI. Point to definitions/mockups.md for panel detail. Copy the
locked visual identity values that implementers need: register, audience, feel, signature,
colours, spacing, typography, and motion/depth. Modules must name the surfaces they implement.

## Harness shape

Only for a custom agent, multi-agent, or computer-use system. Summarize the accepted substrate,
control loop, state, tools, gates, and model settings, then point to definitions/harness.md. Do
not re-derive its rationale.

## Modules and interfaces

For every module: responsibility, hidden decision, input, output, and error boundary. Avoid
shallow modules that only mirror a data type or REST resource. Group behavior that changes
together behind a meaningful interface.

Close with journey coverage. Include every journey and reference row from definitions/journeys.md.

| Journey or reference | Modules that carry it | End-state proof |
|---|---|---|

An empty row is undesigned. A module in no row is unrequested work until a journey justifies it.

## Data model / schema

Only when data persists. Record behavior-changing fields, constraints, relationships, migration
rules, and ownership.

## API contracts

Only for an external or internal boundary. Record signatures, preconditions, postconditions, and
meaningful error modes.

## Processing flow (directed acyclic graph, DAG)

Only for a pipeline. Record nodes, edges, input, output, retry, repeat-call safety (idempotency), and whether a node
uses an LLM.

## Agent tools (agent-computer interface, ACI)

Only for agent tools. Record agent-facing shape, permission scope, repeat-call safety (idempotency), and side effects.
For an MCP server, summarize the accepted public contract and point to its section in
definitions/mcp-servers.md rather than creating a second source of truth.

## State, roles, coordination, and gates

Include each concern only where it exists:

- state retention, compaction, and deletion;
- role contracts: input, output, allowed tools, stop condition, and prohibition;
- coordination/routing and trust boundaries for more than one role;
- verification gates: format, check, hard or advisory result, failure handled, recovery, and retry
  budget.

## Failure taxonomy

| Failure mode | Detection | Recovery | Retry limit |
|---|---|---|---|

## Verification fidelity

| Axis | Build/test rung | Crossover trigger |
|---|---|---|
| Data | hand-authored or approved generated fixture / anonymized sample / real data | |
| External access | mock adapter / sandbox / live credential | |
| Eval signal | smoke assertion / held-out set / graded metric | |
| User journey | unit or integration / scripted end-to-end / real dependency | |
| Deploy | local / staging / production profile | |

State whether the crossover is per slice, phased, or hybrid. List crossovers that need their own
work item: an evaluation set, mock-to-live swap, staging deploy, or driven journey proof.

## Test plan and evaluation

| Module or journey | Seam | Test or proof | Existing example |
|---|---|---|---|

Tests prove external behavior. The evaluation section states the system-level pass/fail signal,
where it runs, and residual blind spots. For UI work, test-driven-dev applies ui-taste to the
locked visual identity; list only project-specific overrides here.

## External dependencies

| Dependency | Purpose | Fidelity rung | Failure if down | Mitigation | Earliest confirmable date |
|---|---|---|---|---|---|

Include hosted models, MCP servers, third-party APIs, and external approval or provisioning waits.

## Rollout / migration

For a reversible change, name the flag, cohort, or kill switch. For first traffic, a migration,
provider re-point, or other one-way action, write the numbered runbook required by [rollout guidance](rollout.md):
each step has observable Verify and Rollback clauses, one-way doors occur late, and risks name the
phase that closes them. For schema work, enforce expand/contract and prove the prior release can
boot against the migrated store.

The environment path and provider decisions remain in definitions/infrastructure.md; this section
cites them. Use [rollout guidance](rollout.md) section 7 for the environment ownership map.

## Observability

Follow [observability guidance](observability.md). Record the telemetry set, service objectives, alert routing, and one
instrumentation row for every PRD metric or kill criterion. Never log credentials, personal data,
or auth headers. The SPEC owns the telemetry plan; the harness, MCP design, and runtime profile
only point to it.

## Security / authentication / authorization

Who may do what, boundary checks, secret handling, and threat surface introduced by the change.

## Browser automation contract

Only for computer use or fragile browser automation. Record graphical user interface (GUI) anchors and document object model (DOM) selectors, login or CAPTCHA
handling, and drift detection.

## Out of scope

Rejected approaches and why.

</spec-template>
