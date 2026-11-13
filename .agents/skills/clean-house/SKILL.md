---
name: clean-house
description: Review an existing product for things to remove or simplify, including features, modules, dependencies, and processes. Use for a maintenance pass or named removal and architecture candidates.
---

# Clean house

Find what no longer earns its cost, then simplify what remains. Use evidence from the
built product. For readability work that preserves capabilities and interfaces, use
`improve-readability`.

## Choose the scope

- **Named targets:** review only the files, sections, features, or module groups named.
  Check whether each should remain before redesigning it. Report in chat.
- **Whole-product pass:** run the steps below once and save a report. Continue another
  pass only when requested.

A review request authorizes investigation. An instruction to implement agreed changes
authorizes those changes; do not ask again at each step. Present newly discovered scope
changes with their evidence before acting. Use available agents for independent areas;
workers do not recruit more workers.

## Read the evidence

Read the relevant current bodies in `definitions/`, domain terms in `CONTEXT.md` or
`CONTEXT-MAP.md`, and settled decisions in `definitions/decisions.md`. Use the latest
maintenance report, recent readouts, Git history, tests, and actual usage where available.
Missing documents do not require creating them.

Current design describes approved work. Check linked tasks and verification before
treating an unimplemented requirement as unused or obsolete. Change records are history;
[amend mode](../../docs/amend-mode.md) owns their meaning and updates.

## 1. Question what exists

For each relevant requirement or settled choice, ask:

- Is it used, reachable, or needed for a demonstrated case?
- Who needs it, and what observable failure would removal cause?
- Has later evidence or an accepted decision replaced it?

Missing usage data is uncertainty, not proof of disuse. Compare old promises with
delivery evidence before recommending a cut.

Check dated decisions with `scripts/freshness-sweep.py` in this skill directory, using an
available Python 3 runner from the project root. It uses only the standard library. If
Python is unavailable, report the unrun scan and inspect the relevant records without
claiming the script passed. It lists overdue dates and active triggers
from infrastructure, runtime, and decision records. It excludes code examples, change
history, and superseded decisions. Read each trigger to decide whether its condition
actually occurred. Follow its named next action; do not reopen unrelated decisions.

## 2. Remove what is no longer needed

Check relevant layers:

| Area | Candidates |
|---|---|
| Features and requirements | Replaced, unused with evidence, or no longer wanted |
| Code and dependencies | Unreachable paths, unused exports, duplicate dependencies |
| Settings | Options with no supported use beyond one fixed value |
| Modules | Forwarding layers or extension points with no real purpose |
| Process and automation | Repeated work, obsolete jobs, unnecessary gates |
| Tests | Checks for removed behavior or duplicated coverage |
| Documentation and skills | Completed procedures, false claims, repeated rules, stale vendor facts |

Use [the removal checklist](DELETION-AUDIT.md) for a candidate that needs investigation.
Independent candidates can be reviewed together; do not require a worker for every file.

Present what would go, evidence, consequences, and the signal that would justify bringing
it back. Remove only authorized targets. Update their tests, references, documentation,
and newly unused code together. Prove that deleted guards are unnecessary and that retained
behavior remains tested. Preserve current design and accepted change history.

Record a durable rejected proposal in [the decision register](DECISIONS-FORMAT.md) when
its reason will prevent future confusion. Judge cuts by retained usefulness and reduced
complexity; there is no deletion quota or target for re-adding work.

## 3. Simplify what remains

Look for one concept scattered across files, callers that must know implementation details,
or behavior that is hard to test through its public interface. Describe the files, the
reading or change difficulty, the proposed shape, and how callers and tests improve.

Prefer keeping related decisions together behind a simpler interface. Use
[the dependency and testing guide](DEEPENING.md) when reshaping modules, and
[interface comparisons](INTERFACE-DESIGN.md) only when alternatives need exploration.
[Language](LANGUAGE.md) defines the technical terms; explain the change in the project's
own domain words.

Settle unresolved constraints before editing. Revisit an old decision only with new
evidence. Record new domain terms in [CONTEXT.md](CONTEXT-FORMAT.md) when they prevent
real confusion. Do not create a glossary or decision record for an obvious change.

## 4. Improve feedback and automation

Measure test, build, and deployment feedback on the surviving paths. Fix an authorized,
bounded delay; propose a larger change separately. Keep required checks intact.

Automate a repeated manual step only after its inputs and failure handling are understood.
Remove automation whose purpose disappeared. Do not speed up or automate work still
proposed for removal.

## 5. Verify and reconcile

Run checks for the changed behavior and required project gates. A requirement change
updates its current body and change record, then only the affected downstream documents
and tasks, following [amend mode](../../docs/amend-mode.md).

Apply [audit-drift](../audit-drift/SKILL.md) to the affected documents and code. This is
part of the maintenance pass, so do not request a second invocation. Fix inconsistencies
caused by this pass; report unexplained ones separately.

## Report

For a whole-product pass, write `docs/audits/YYYY-MM-DD-clean-house.md`; use a short suffix
if another report already occupies that name. Include:

- Result: complete, or remaining work with its reason.
- Removals and simplifications: evidence, checks, and re-add conditions.
- Rejected proposals and recorded decisions.
- Things restored since the previous report and what was learned.
- Feedback and automation changes.
- Unresolved questions and work left for a later pass.

Summarize the useful changes in chat and link the report. Do not print it twice or list
every unchanged item examined.
