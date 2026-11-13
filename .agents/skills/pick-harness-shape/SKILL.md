---
name: pick-harness-shape
description: Decide whether a large language model (LLM) or agent system needs a custom harness and, when it does, record its runtime shape, tools, safety gates, and evaluation plan in definitions/harness.md. Use when reliability must come from programmatic control rather than a person reviewing each result.
---

# Pick Harness Shape

A harness is the code around a large language model (LLM): tool dispatch, state, verification, recovery, and audit.
Use it only when those controls are needed. A normal coding agent, a single model call, or a chat
where the user checks every result usually does not need one.

Read only the selected brief:
- [Harness engineering](../../docs/agentic-patterns/01_harness_engineering_brief.md) for runtime and tool boundaries.
- [Role design](../../docs/agentic-patterns/02_role_design_brief.md) for separate roles.
- [Context management](../../docs/agentic-patterns/03_context_management_brief.md) for state.
- [Prompt management](../../docs/agentic-patterns/04_prompt_management_brief.md) for model controls.
- [Harness architectures](../../docs/agentic-patterns/05_harness_architectures_brief.md) for control and recovery.
- [MCP design](../../docs/agentic-patterns/06_mcp_design_brief.md) for tool protocols.
- [Evaluation and observability](../../docs/agentic-patterns/07_eval_observability_brief.md) for measurement.

These briefs are evidence for a pattern, not catalogs of current provider facts. Verify the available software development kit (SDK), model controls,
pricing, deployment constraints, and support status before recording a provider-specific choice.

Ask one unresolved decision at a time. Recommend an answer and explain the trade-off in plain
language.

## Amend mode

If definitions/harness.md exists and this is a scoped change, use [amend mode](../../docs/amend-mode.md) and the C-* ID and affected
headings from define. Keep drafts outside the current body. When the design is accepted, replace
only those sections, reconcile contradictions, and append ## Change C-* with exact Affects:
headings. If the tool layer changes, route to design-mcp-server; then route to /to-spec.

## 1. Establish the need

Read:

- definitions/prd.md. Its user, regulatory, business, and trust constraints set the bar.
- definitions/journeys.md, when present. Its autonomy matrix defines which actions may run
  unattended and when a person takes over.
- definitions/mockups.md, when present. Tool and gate choices must fit the approved surfaces.

If there is no PRD, stop and name /to-prd. The exception is a harness that is itself the
product or its differentiator; say that its design will shape the PRD and get the user's direction.

Choose the simple path unless one of these is true:

- work runs unattended, on a schedule, or in the background;
- a failure needs an audit trail, a bounded blast radius, or a programmatic check;
- the system chooses its next tool call over multiple turns;
- separate roles have a real lifecycle, permission, or trust boundary; or
- the harness itself is the product.

Record why a direct call, existing agent, or ordinary deterministic pipeline is insufficient.
If none applies, stop instead of creating harness machinery.

## 2. Choose the shape

Make these decisions in order. Record only choices that apply.

1. **Runtime choice.** Start with the provider and runtime the project already uses. Compare a
   supported software development kit (SDK), a thin custom loop, a control-flow framework, or a maintained fork only when
   its current capabilities solve a stated need. Verify version, license, deployment fit,
   operational ownership, and exit path at decision time.
2. **Control loop.** Start with one agent and clear stop conditions. Add planning when execution
   needs a durable plan, supervision when the plan must be checked and revised, and separate
   agents only for independent lifecycles, distinct permissions, or proven parallel work.
   A role has an input, output, allowed tools, stop condition, and prohibition; it is not a
   persona.
3. **Recovery.** Pick no retry, bounded retry with useful feedback, search with a cheap evaluator,
   or a reusable-skill/evaluation loop. State the evidence that makes the extra loop worthwhile.
4. **State.** Choose no state, bounded context, retrieval-backed memory, or durable state. State
   what is retained, who can read it, and when it is summarized or deleted.
5. **Tool layer.** State the rough tool count and group tools around user-meaningful actions.
   Record agent-facing input/output, permission scope, repeat-call safety (idempotency), and side effects. Choose Model Context Protocol (MCP)
   only when shared, out-of-process, or product-facing tools need a protocol; otherwise keep the
   tool in process.

## 3. Make unattended work safe

For each verification gate, record the input format, the check, hard or advisory outcome, failure
it catches, recovery action, and retry ceiling. Also set a task-wide action or iteration limit,
token or cost budget, wall-clock limit, and an explicit unfinished result.

Name the trust boundary:

- what the runtime can touch and the blast radius of a bad call;
- irreversible actions and their approval, dry-run, or hard-gate path;
- how untrusted tool output, retrieved text, and user content are handled;
- role-to-role boundaries when roles are separate; and
- the audit record needed for regulated or reconstructable decisions.

A skipped item needs a reason, such as "all tools are read-only."

## 4. Choose current model settings and evidence

For every stage that actually exists, record the provider/model tier, sampling controls exposed by
the current API, reasoning setting if available, output limit, timeout, and budget. Verify those
controls against the installed SDK and provider documentation at decision time. Do not copy a
model name, version, temperature, or pricing claim from a reference as though it were current.

Define success before tuning: a representative task set, pass/fail signal, cost and latency
limits, and the comparison that would justify a topology or model change. For an always-on system,
also record trajectory/tool/gate telemetry, cost per successful run, and the threshold that alerts
an owner.

## 5. Save the artifact

Draft outside the committed current body. Once accepted, write definitions/harness.md and commit
it. Its first accepted current body gets the shared C-001 baseline record with exact top-level
Affects: headings. Later changes update the current body and append the matching C-* record.

Use the selected pattern brief for material pattern claims and current primary sources for
provider-specific facts. Record rejected alternatives so later work does not reopen them blindly.

<harness-template>

## Sources

- definitions/prd.md
- definitions/journeys.md and definitions/mockups.md, if read
- Current SDK, provider, or deployment sources used for a provider-specific decision

## Summary

The runtime choice, control loop, state, rough tool boundary, safety approach, evaluation signal, and owner.

## Why a custom harness

The reliability requirement that made the simpler path insufficient.

## Runtime and control loop

**Runtime choice:**
**Control loop:**
**Recovery:**
**Why and current-source evidence:**

## Roles

Only when planning, supervision, or multiple agents apply.

| Role | Input and output | Allowed tools | Stop condition | Prohibition | Separate runtime? |
|---|---|---|---|---|---|

## State and tools

**State and compaction/deletion policy:**
**Tool boundaries, permissions, and repeat-call safety (idempotency):**
**MCP or in-process decision:**

## Gates, recovery, and budget

| Gate | Input format | Check | Hard or advisory | Failure handled | Recovery and retry limit |
|---|---|---|---|---|---|

**Task limits:** action/iteration, cost or token, time, child-agent quota when concurrent agents are allowed, and unfinished-result policy.

## Security and trust boundary

**Sandbox and blast radius:**
**Irreversible-action path:**
**Untrusted-input posture:**
**Role boundary and audit trail:**

## Model settings and evaluation

| Stage | Current model/tier | Controls verified | Limit | Evidence used to tune |
|---|---|---|---|---|---|

**Success signal, held-out work, and production telemetry:**

## Rejected alternatives

| Alternative | Why it was rejected |
|---|---|

## Open questions

</harness-template>

## Hand-off

If MCP was chosen, name design-mcp-server; it writes definitions/mcp-servers.md. If the system
runs unattended in the cloud and its placement is unsettled, create definitions/runtime.md with
its trigger, maximum run duration, state across waits, generated-code execution, concurrency,
residency, irreversible effects, telemetry backend, and revisit TRIGGER: lines.

First ask whether one routine compute service is enough. If it is, record that verdict and the
profile. If it is not, make the placement choices using the [selection method](../../docs/selection-method.md), including cost
limits and a kill switch. runtime.md owns where the loop runs; /to-infrastructure owns individual
service choices. Give the first accepted runtime profile its C-001 baseline record.

Then name /to-spec, which reads the harness and runtime artifacts.
