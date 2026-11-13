---
name: run-wave
description: Work one wave of GitHub issues in parallel, integrate it, then reconcile the remaining backlog before the next wave. Use when the user wants to work the backlog or implement issues created by /to-issues.
disable-model-invocation: true
---

Run only on explicit invocation by name, slash/dollar command, or workflow stub. Otherwise say this
skill exists and wait.

# Run Wave

A wave is a batch of non-colliding issues. Work one wave, integrate its result, review every
remaining issue against the code that now exists, then stop. Re-run for the next wave. The review
between waves is what turns later guesses into facts.

## 0. Inventory the backlog

Retrieve all open issues with number, title, labels, body, dependencies, and creation/update facts.
Use GitHub pagination rather than a fixed page limit. If the available tool gives only a bounded
snapshot, say exactly what it covered and do not claim that every issue was reviewed.

Read definitions/spec.md and definitions/journeys.md when present.

For each issue body, read Task contract when present:

- Every numbered GitHub issue requires a contract when definitions/spec.md exists. A legacy project
  with no SPEC may have contractless issues. The work queue's built-in maintenance and drift routes
  are unnumbered and outside this GitHub issue loop.
- The body is authoritative. Comments may explain a change but do not replace contract fields.
- A changed record affects an open task when Source matches and any Sections overlap its Affects
  headings, regardless of the task's original Change ID.
- Hold only an affected task whose contract, source revision, or headings are stale, malformed, or
  ambiguous. Route it to /to-issues. Do not infer a new scope.
- Keep a different-source or non-overlapping task moving.

If no wave labels exist, assign waves using the certainty rules in /to-issues, show the resulting
cut, and continue unless a product-scope decision is unresolved.

AFK means away from keyboard: a worker can complete it unattended. HITL means human in the loop:
the user must take part.

## 1. Pick the wave

Take the lowest wave-N label that still has open issues. Exclude:

- issues blocked by an open issue;
- issues held for contract reconciliation; and
- AFK issues whose required credentials or setup are unavailable. Reclassify those as HITL and say
  why.

If nothing can start, report the inconsistent labels or blockers and stop. Show the selected issue
numbers and titles, HITL work, AFK work, and held items. An explicit /run-wave invocation
authorizes ordinary scheduling; surface only a decision that changes product scope.

## 2. Launch the work

Complete HITL issues with the user first when they establish a shape other agents must copy. Launch
one available native agent per AFK issue in separate worktrees, subject to actual capacity and
project permissions. Choose a capable available agent/model for the task; do not invent a required
model tier or assume a particular provider.

Each worker receives the complete issue body and:

- runs test-driven-dev;
- treats acceptance criteria as the proof to produce;
- stays inside the slice;
- does not create GitHub issues; and
- reports delivered work, passing and failing criteria, and outside-slice observations.

The coordinator fans out once. Workers do not recruit workers or touch sibling issues. Keep the
user informed while work is running.

## 3. Integrate and review before promotion

Integrate worker branches into a non-default wave integration branch or worktree. Resolve overlaps
there and run the full project merge suite on the combined result. An issue whose branch cannot be
integrated is reopened with the conflict recorded; do not silently discard it.

The integration branch is not the default branch. Run the project's review path before promotion
to the default branch. When that path is /review-pr, name it for explicit invocation under its own
policy. Only a reviewed integration result with required checks and approvals may merge to the
default branch. Later waves may use the integration branch as their base while it awaits promotion.

Collect outside-slice observations after integration. A worker fixes bugs inside its slice, reports
ones outside it, and interrupts for a shipped-journey failure or data loss.

## 4. Reconcile the remaining issues

Walk every open issue from the complete inventory against the integrated code and current artifacts.
Check in this order. A held task stays open until reconciled; code meeting its old acceptance
criteria does not complete it.

| Check | Action |
|---|---|
| Contract current? | If not, hold only that task and route it to /to-issues; skip the remaining checks until reconciled |
| Still wanted? | If an accepted artifact removed the capability, close it as cancelled and cite that artifact |
| Body matches current requirements? | If not, update it from the accepted source; do not file a replacement or infer new scope |
| Already satisfied? | Close only when integrated code meets the current acceptance criteria and the named verification passes; otherwise keep it open |
| Still in the right wave? | If not, relabel wave-N based on what the wave made certain or uncertain |

For outside-slice observations, fold them into an open issue when its scope already covers them.
Otherwise create one new labelled issue during this review, or drop it with a stated reason.
Apply routine reconciliation under the invocation's authorization. Surface a decision only when it
changes product scope.

## 5. Report and re-fire

Report the integrated branch, test result, default-branch promotion state, reopened issues, and
every close, hold, edit, relabel, or new issue with a reason. State the next wave and its HITL/AFK
split.

If open issues remain, name /run-wave again. When the backlog is empty, promote only after the
review path above has passed; then continue to the shipping checks such as audit-drift.
