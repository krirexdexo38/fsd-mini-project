---
description: "Make existing code and tests easier to understand without changing supported behavior. Use for confusing code, unnecessary complexity, misleading comments, or weak tests. Feature removal and module redesign belong to clean-house."
---
# Improve readability

Reduce the work needed to understand and safely change the code. Preserve the inputs,
outputs, errors, and other behavior callers rely on. When both maintenance and readability
work are needed, run `clean-house` first so this pass improves code that will remain.

## Choose the scope

For named files or one confusing area, make a focused pass. For a repository-wide request,
choose the main user journey and the areas where recent changes, bugs, or reader difficulties
concentrate. Age and line count help prioritize; neither proves a problem.

A review request stays read-only. An instruction to implement scoped improvements covers
those edits without another approval ritual. Present new scope decisions before acting.
One pass produces a result and remaining work; do not silently repeat a whole-repo survey.

Read relevant code, tests, project vocabulary, recent Git changes, and an earlier report
if one exists. Missing product documents do not block a focused code review.

## 1. Understand the behavior and its tests

Record the current test result before code changes. If it fails, identify the existing
failure and do not claim a green baseline. Check how tests exercise the exact behavior
you plan to change.

| Evidence | Next action |
|---|---|
| A relevant test catches a representative break | Use it to protect the change |
| A test runs the code but misses the wrong result | Strengthen that test first |
| Important behavior has no test | Capture its current behavior before refactoring |
| Only comments or documentation need repair | Verify their claims; no fault injection needed |

For meaningful structural changes or a weak-suite review, confirm that tests can catch
a representative fault. Use an installed mutation tool, or make a temporary deliberate
break in an isolated copy and run the relevant test. Preserve the starting work exactly
and remove the fault before continuing. No production data or external side effects.
Scale this to the changed area; a small rename does not require testing three unrelated
functions. See [TESTS.md](TESTS.md) for detailed suite review.

## 2. Read as a newcomer

Follow the selected behavior from its entry point to its result. For a broad review, also
trace one plausible newcomer change. Note concrete difficulties:

- An unexplained domain term or misleading name.
- Information the reader must fetch from another file.
- Too many conditions or changing values to hold at once.

Record location, difficulty, and a possible fix. Start from observed confusion, then use
[CHECKS.md](CHECKS.md) for naming, control flow, unnecessary code, comments, and tests.
The checklist supplies questions, not a requirement to manufacture findings in every category.

Include stale documents when relevant: false setup instructions, completed migration
guides, duplicate explanations, or reports with no remaining reader. Check references and
live value using [the removal checklist](../clean-house/DELETION-AUDIT.md). Keep current
definitions, accepted change records, durable decisions, and useful historical evidence.

## 3. Make small, verified changes

Rank findings by their effect on real readers and changes, with evidence and risk.
Group related edits around one intent. Within the authorized scope:

1. Strengthen missing protection before changing behavior-preserving structure.
2. Rename, simplify control flow, inline unnecessary wrappers, or remove proven dead paths.
   Keep related code together; a shorter function is not automatically easier to follow.
3. Run the relevant checks after each meaningful change and the required gates before
   completion. Keep test improvements distinguishable from structural changes in the diff
   and, when committing, in focused commits.
4. Update comments and references made wrong by the edit. Preserve the accepted-history
   rules in [amend mode](../../docs/amend-mode.md).
5. Re-read the changed area and confirm the original difficulty is resolved.

Do not remove a supported error case just because it is uncommon. Do not weaken a test
to make a refactor pass. Remove an existing test only after proving equivalent retained
coverage, or because its behavior was explicitly removed in separate approved work.

A discovered bug is a separate finding for `diagnose`; do not hide a behavior change in
a readability edit. Feature removal, public interface changes, and module regrouping go
to `clean-house` with evidence. For an authorized large refactor, migrate callers in
steps and remove the old path when the replacement is verified.

## 4. Add guidance only where it helps

For a broader onboarding request, update domain definitions in
[CONTEXT.md](../clean-house/CONTEXT-FORMAT.md), a short code map or reading order, and naming
conventions only when the review found a need. Create starter issues only when requested
or already authorized. A focused code cleanup does not require onboarding documents.

Offer a [decision record](../clean-house/DECISIONS-FORMAT.md) for a durable, non-obvious
constraint or rejected proposal that future readers would otherwise reopen.

## Verify and report

Revisit each recorded difficulty, rerun the required checks, and repeat relevant fault
checks when test protection changed. Report resolved and remaining problems, verification
evidence, and any behavior or area you could not verify. Useful counts include code,
branches, and redundant tests removed; they are evidence, not targets.

For a focused pass, report in chat. For a repository-wide pass, save
`docs/audits/YYYY-MM-DD-readability.md` (add a suffix to avoid overwriting another report)
and link it with a short summary. Include scope, baseline, changes and evidence, remaining
difficulties, and handoffs. Remove an older report only after checking it has no continuing
use or references; never delete readout evidence merely because a newer audit exists.
