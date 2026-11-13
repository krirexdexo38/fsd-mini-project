# Observability: writing the SPEC's telemetry plan

Instructions to the spec author for the SPEC Observability section. This is the project's single telemetry plan. [pick-harness-shape](../pick-harness-shape/SKILL.md)'s Model settings and evaluation section defines the harness posture, [design-mcp-server](../design-mcp-server/SKILL.md)'s Test and operate the contract section defines server-internal logs, and definitions/runtime.md names the backend. They point here; they do not redefine the set.

Producer/consumer, both directions: `/go-live` verifies that what this section promises is actually armed in the running environment, and `/readout` reads the product-metric table weeks after launch to decide whether the PRD's bet paid. Write it so both of them can cite it.

## 1. Telemetry set

What exists to be read. One row per signal, not per line of code — a signal is something a person or an alert queries.

| Signal | Kind (log / counter / histogram / span) | Emitted where | Level | Retention |
|---|---|---|---|---|

- Prefer OpenTelemetry GenAI semantic conventions for agent traces: model call, tool call, and agent step each as a span.
- **Never** log credentials, PII, or auth headers — including inside error messages and stack traces (AGENTS.md §8). Where a field is needed for debugging but sensitive, say what is redacted and how.
- Every failure mode named in the SPEC's Failure taxonomy needs a signal here that would show it happening. A taxonomy row with no matching signal is a failure you have decided not to notice.

## 2. Service level objectives

What "working" means as a number. Two or three, no more — an SLO nobody would act on is a metric.

| Objective | Target | Measured by | Error budget | What happens when it is spent |
|---|---|---|---|---|

The last column is the one that makes an SLO real. "Stop shipping features until it recovers" is an answer. "Investigate" is not.

For an agent or LLM surface, useful objectives are usually cost per successful run, trajectory length, and gate hit rate. Take them from definitions/harness.md's Model settings and evaluation section rather than inventing new ones.

## 3. Alerts

Only thresholds a human would act on at the moment they fire. Everything else is a dashboard.

| Alert | Fires when | Routes to | First action | Runbook |
|---|---|---|---|---|

- Anything with no first action is noise, and noise is how a real page gets missed. Cut it or give it one.
- A budget or spend alert is mandatory for any surface that spends tokens or bills per call.
- [/go-live](../go-live/SKILL.md)'s Monitoring row proves alerts are armed with one synthetic firing, not a configuration screenshot. Write alerts so that proof is cheap to produce.

## 4. Product metrics — the row that is always missing

For every metric and every kill criterion in the PRD's *Goals & Success Metrics*, name the signal that measures it and where it is read from.

| PRD metric or kill criterion | Signal (from §1) | Where read | Baseline | Read by |
|---|---|---|---|---|

A PRD metric with no row here can never be checked. Its kill criterion can therefore never fire, which means the product cannot fail, which means shipping it teaches nothing. This table is what turns the PRD's success criteria from decoration into a claim someone can lose.

Two rules:

- **Instrument before launch, not after.** The baseline column needs a number measured *before* the change ships, or the readout has nothing to compare against.
- **Name the reader.** `/readout` is the default, at a date the PRD's kill-criteria table already set. If a metric is read by a dashboard nobody opens, it is not instrumented — it is decorated.

## 5. Dashboards

One line each: who opens it, when, and the question it answers. A dashboard with no named reader and no question gets deleted by the next `clean-house` pass, and rightly.
