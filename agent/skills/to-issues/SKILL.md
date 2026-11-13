---
description: "Turn an accepted SPEC or legacy plan into small GitHub issues grouped into waves for /run-wave. Use when the user wants implementation tickets, a reconciled backlog, or a plan broken into vertical slices."
---
Run only on explicit invocation by name, slash/dollar command, or workflow stub. Otherwise say this
skill exists and wait.

# To Issues

Create small vertical slices that deliver a complete user-visible or verifiable path. /run-wave
works those slices in waves and reconciles the remaining backlog after each wave.

## 1. Establish the source and reconcile existing work

Read the accepted SPEC when it exists. Also read journeys for end-state proof and branches, mockups
for UI panel IDs, and the SPEC's Verification fidelity section (how closely tests match real use) for mock, sandbox, live, and
crossover work. Read any passed GitHub issue with its comments, but the issue body is the task
contract source of truth.

### Governed path

A project with definitions/spec.md is governed. Follow [amend mode](../../docs/amend-mode.md). Every numbered GitHub issue uses an accepted
Change C-* record in its current source. The source revision is the committed revision containing
that current body and record; never use a dirty working tree as Version.

A governed issue begins with this exact block in its body:

~~~md
## Task contract
Change: C-018
Source: definitions/spec.md
Sections: Checkout; Payment failure
Version: <committed source revision>
~~~

When persistent `work-queue` will start a governed task, its source revision must be committed on the configured remote main before START. You may draft or create issues first; do not publish a source merely to start a worker.

Sections are the exact relevant subset of the record's Affects headings, without the section
marker. A comment may explain the decision, but it cannot replace or override this body block.

Before creating work for a change, inspect every open issue with pagination. A task is affected
when its Source matches the changed source and any of its Sections overlap the record's Affects
headings. Compare all Change IDs: the ID traces why the task was created; it does not limit
reconciliation. A task with a different source or no overlapping section continues.

Hold only the affected task when its contract is missing, malformed, stale, or ambiguous. If an
Affects line is missing or ambiguous, hold matching-source tasks and ask for headings. Do not infer
replacement scope. Reconcile overtaken work explicitly: preserve it when the current sections
still support it, update it when the new accepted contract makes the replacement clear, or close it
with a reason naming the C-* change. Then create any new slices.

### Legacy path

When no definitions/spec.md exists, a PRD or user plan may create legacy issues. Omit Task
contract and add a short Source plan section instead. Legacy work has no automatic contract
reconciliation; surface material scope changes to the user. Do not put a fake C-* record or
Version in a legacy issue.

If a SPEC is created later, reconcile open legacy issues before treating them as governed. A
contractless numbered issue in a governed project is held, not silently promoted. The work queue's
built-in unnumbered maintenance and drift routes are outside this GitHub issue flow; do not create
a contractless numbered issue to imitate them.

## 2. Draft vertical slices

Explore the codebase when it would change the slice boundary or reveal an exemplar.

Each slice crosses the relevant layers end to end: data, behavior, interface, and proof. Do not
split a deliverable into "schema first" or "UI first" tickets unless that horizontal work itself is
the independently verifiable outcome.

- A slice has a narrow, demoable or testable result.
- Copy journey end-state proof and relevant branches into acceptance criteria. Do not invent them.
  If the journey lacks a needed proof, correct the accepted source before creating work.
- UI slices name the approved mockup panel IDs and retain the required real-browser proof.
- The fidelity rung decides whether a slice uses a mock, sandbox, or live dependency. Each planned
  crossover, such as mock-to-live, staging deploy, evaluation set, or real journey drive, is its
  own slice.
- A template-establishing slice comes before similar slices. Mark mirrors Blocked by it so
  concurrent work follows one real in-repo example.

Classify each slice as AFK (away from keyboard), which a worker can complete unattended, or HITL
(human in the loop), which needs the user. Then rank it:

| Band | Conditions | Wave |
|---|---|---|
| Certain | Clear contract, available dependency at its fidelity rung, and an exemplar or shape-establishing purpose | 1 |
| Likely | Clear contract with one unproven support | Later |
| Unclear | Open product decision, unknown dependency, or missing proof | Last; resolve the uncertainty when possible |

Do not put a blocker in the same wave as its dependent. Do not put slices that edit the same files
in the same wave. A wave can contain one issue or many.

Apply decisions already present in the request and accepted artifacts. Ask only when an unresolved
choice changes scope, dependencies, or HITL/AFK status.

## 3. Set up AFK work

AFK work can complete without a person. HITL work needs a decision, interactive setup, a consent
flow, or a credential not yet available.

Use the project's declared credential mechanism. If existing code reads environment variables and
the project already uses a gitignored local environment file, add only missing commented
placeholders and never replace a value. Otherwise document the project's supported secret store,
test fixture, or setup command. Do not introduce a root .env file merely because this skill runs.

For every sandbox or live dependency needed by an AFK slice, list the variable or secret name, the
slices that use it, how the user obtains it from the provider's primary documentation, and whether
it needs payment, administrator access, or interactive consent. Never write, print, or commit a
secret. Reclassify the slice as HITL if any required setup remains interactive or unavailable.

## 4. Create the issues

Ensure afk, hitl, and required wave-N labels exist using the available GitHub CLI or UI. Do not
assume a POSIX shell. Create blockers first so issue numbers can be cited.

Use the template below for a governed issue. For a legacy issue, replace the entire Task contract
block with `## Source plan` and the approved PRD or user-plan reference; omit Source spec. Never
leave an empty Task contract or invented contract fields. Do not modify or close a parent issue.

<issue-template>

## Task contract

Change: C-<id>
Source: definitions/spec.md
Sections: <exact relevant subset from Affects:>
Version: <committed source revision>

## Parent

#<parent-issue-number> when applicable.

## What to build

Describe the vertical behavior, not a list of files or layers.

## Source spec

The section or anchor this slice implements. Omit for a legacy issue.

## Exemplar to mirror

Existing file or pattern. Omit when this slice establishes the pattern.

## Decisions and conventions

Only the settled choices and cross-issue invariants this slice must follow.

## Credentials / setup

Names and purpose only, using the project's declared mechanism. Never include values.

## Acceptance criteria

- [ ] End state: <journey proof>
- [ ] Branch: when <condition>, then <outcome>
- [ ] UI panels: <ids>, when applicable

## Scope discipline

- Fix a bug inside this slice in place.
- Report an outside-the-slice bug; do not file or fix it here.
- Stop and ask the user for a bug that breaks a shipped journey or loses data.

## Blocked by

#<issue-number>, or None - can start immediately.

</issue-template>

## 5. Hand off

Report the issue count by wave, HITL work and its blocker, and any uncertainty that still changes
the first wave. Name /run-wave for a backlog; a single issue can go directly to test-driven-dev.
