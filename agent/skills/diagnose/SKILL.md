---
description: "Diagnose a hard bug or performance regression with a reproducible feedback loop. Use for live incidents, unknown failures, and regressions."
---
# Diagnose

Find a reliable signal before guessing. The loop is: contain a live incident, build a repro, observe
it, test predictions, fix it, and prove the original symptom is gone.

## 0. Live incident only

Use this step only when real users are affected.

1. Mitigate with the smallest reversible lever: return traffic to a prior revision, disable a flag,
   pause the offending job, or cap spend.
2. Preserve logs, trace or run IDs, relevant dashboards, and a safe data snapshot before they change.
3. Draft a plain-language customer update if people are affected. Send it only when the user or an
   established incident procedure authorizes that channel.
4. Diagnose from the preserved evidence, not from a changing production system.

A local or continuous-integration failure starts at step 1.

## 1. Build the feedback loop

Create the fastest reliable pass/fail signal for the reported symptom. Start with the smallest fit:
a failing test, CLI or HTTP request, browser flow, captured trace replay, or narrow throwaway harness.
For an intermittent issue, repeat the trigger under controlled time, data, and concurrency; use a
comparison or bisection when two versions or configurations differ.

Make the loop faster, sharper, and more deterministic before spending time on hypotheses. Pin time
and randomness, isolate files and network dependencies, and assert the symptom rather than merely
"no crash".

If a person must perform a step, write a short platform-native checklist that captures the result.
`scripts/hitl-loop.template.sh` is an optional convenience only where a compatible shell is available.

If no credible loop is possible, stop. Report attempts and ask for the missing access, captured
artifact, or authorization for temporary production instrumentation. Do not guess without a loop.

## 2. Reproduce and explain

Run the loop until it shows the user's symptom. Capture the error, wrong output, or timing.
For a flaky problem, raise the reproduction rate enough to distinguish a fix from luck.

Write three to five ranked, falsifiable hypotheses. Each says what observation would support or reject
it. Share the list as useful progress; wait only when the user holds information needed to continue.

## 3. Probe one prediction at a time

Prefer a debugger or REPL, then targeted logs at the boundary that distinguishes two hypotheses.
Use the environment's available search tool; do not depend on a particular shell command. Tag temporary
logs with a unique prefix so they can be removed reliably. For performance work, establish a baseline
measurement or profile before changing code.

## 4. Fix and prove

Turn the reproduced symptom into a failing regression test at the real call seam when one exists.
If no honest seam exists, record that architectural limit instead of adding a misleading unit test.
Apply the smallest fix, run the regression test, then run the original feedback loop again.

Before closing:

- remove temporary instrumentation and throwaway harnesses;
- inspect the nearest existing test and correct why it missed the bug;
- record the confirmed cause and prevention in the task, commit, pull request, or incident note;
- recommend `clean-house` or `improve-readability` only for a specific structural or comprehension
  problem the diagnosis exposed.

For a customer-impacting incident, save a brief incident note at
`docs/audits/YYYY-MM-DD-incident-<slug>.md` with the symptom, mitigation, cause, and prevention after
the immediate fix is verified.
