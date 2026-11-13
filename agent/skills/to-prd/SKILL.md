---
description: "Turn settled product context into a PRD of at most two pages covering the problem, target user, solution, journeys, success measures, scope, and change tier. Saves definitions/prd.md. Use when the user wants to create or amend a PRD."
---
Run only on explicit invocation — by name, slash/dollar command, or workflow stub. Otherwise say this skill exists and wait.

Write the product's **what** and **why**. Use the conversation, repository, research, and selected idea. Do not re-interview settled decisions; ask only when an unknown changes the promise, kill criterion, or irreversible surface choice.

## Boundaries

| This artifact decides | Another artifact decides |
|---|---|
| Problem, target user, promise, success, scope, and named journeys | Journey steps, branches, and proofs → `to-journeys` |
| User-facing form factor and constraints | UI identity and screens → `to-mockups` |
| Product constraints and accepted scope | Modules, interfaces, implementation, and test plan → `to-spec` |

## Inputs and judgments

Read the current conversation, repository, `definitions/ideas.md` winner and
`definitions/research.md` when present. Read judgments with the available file tools. Use
only the newest **applicable** judgment: its Target identifies the same winner or PRD body
and its cited target text still matches. For a committed target, compare the cited revision's
target text with the current text; for an uncommitted target, compare its recorded content hash
or snapshot ID. An unrelated Git commit that leaves the target text unchanged does not invalidate
the judgment. Ignore a judgment for another artifact or changed target text.

A non-`proceed` applicable judgment must be addressed through its named route, or explicitly overridden by the user, before it can be superseded. A `revise-document` judgment means amend the named document and rerun the judgment against the new revision.

## Write the PRD

1. Explore the repository first.
2. If the proposed form factor is costly or hard to reverse—native mobile, hardware, browser extension, or app-store distribution—ask whether a cheaper surface can test the same hypothesis. Record the user's decision.
3. Keep the current PRD body to **two pages maximum**, excluding the change records appended below it. Target User, Solution Overview, and Further Notes each have a **half-page maximum**. These are ceilings, not targets; move detailed steps and implementation to their owning artifacts.
4. Use plain, concrete product nouns. State user-facing privacy, accessibility, legal, or compliance constraints in plain language. Leave the mechanism, vendor, protocol, and implementation detail to journeys or the SPEC.
5. On acceptance, save `definitions/prd.md`. For a first current design, append `C-001`; for an increment, update only the affected body sections and append the new `C-*` record. Preserve earlier accepted records. Follow [amend mode](../../docs/amend-mode.md) for records and cascade, then commit the accepted artifact.

## Hand-off

- A feature or launch change goes to `to-journeys` for scripts, branches, and end-state proofs.
- A first PRD also goes to `to-infrastructure` before `to-spec`.
- A `fix` does not amend the PRD: use `diagnose` or `test-driven-dev`. An `internal` change with no user-behaviour change can go straight to `to-spec`.
- `judge-idea` can review the completed PRD when a load-bearing decision remains uncertain.

## Template

<prd-template>

## Change tier

`fix` | `internal` | `feature` | `launch` — see [amend mode](../../docs/amend-mode.md).

## Problem Statement

The user problem in two to four sentences.

## Target User

A specific persona, their situation, and constraints that affect their choices.

## Solution Overview

User-facing form factor, the surfaces or objects the user sees, and any user-visible autonomy boundary.

## Key User Journeys

Numbered journeys. Each names the actor, trigger, user-visible flow, outcome, and relevant surface. Keep each to two sentences.

## Goals & Success Metrics

**Anchoring promise.** One sentence stating the outcome the user should feel.

Choose **at most three metrics**, ordered by how directly they prove that promise. Prefer user behavior and outcomes over activity counts.

| Metric | Target | How measured |
|---|---|---|

**Kill criteria** are measurable thresholds for stopping or changing direction. Carry forward those agreed in `define`, with a deadline and action; do not invent weaker replacements. State the user group and measurement window clearly enough for `readout` to judge the result.

| Kill criterion | By when | Action if it fires |
|---|---|---|

## Non-Goals

At most five user groups, uses, or platforms deliberately not served.

## Out of Scope

At most five capabilities deliberately not built in this change. Also preserve cuts recorded by `clean-house`, with the reason and observable signal that would justify adding them back; these do not count toward the five.

## Risks & Open Questions

At most five items that could change the product decision. Include unresolved findings from an applicable `judge-idea` review.

| Item | Risk or question | Impact if wrong | How to resolve |
|---|---|---|---|

## Further Notes

Only constraints or evidence that do not fit above: pricing direction, distribution, accessibility, compliance, or research pointers.

</prd-template>
