---
description: "Check whether a released change met its promised outcomes. Use for a post-launch review or a decision to keep, improve, remove, or rethink a feature."
---
# Readout

Run only when explicitly invoked. Read evidence and write a dated report; do not change
the product, instrumentation, or requirements during the review.

Run at the measurement date agreed in the product requirements document (PRD), or when
the user asks. An early review may have too little evidence to decide.

## 1. Identify the released promise

Find the deployed revision, release date, and linked task or change ID. Read the PRD
and specification associated with that release, using Git history when the current
documents describe newer work. Record the source revisions. If the release cannot be
matched reliably, name the uncertainty instead of choosing a convenient baseline.

Recover the hypothesis, target user group, success metrics, pre-launch baselines,
measurement window, risks, and kill criteria: thresholds agreed in advance for stopping
or changing direction. Read the specification's Observability section for each metric's
signal and where to read it. Change records explain decisions; task and release evidence
establish what actually shipped. See [amend mode](../../docs/amend-mode.md).

A missing metric table is a documentation gap. Check the code and available dashboards
for the promised measurement before concluding that instrumentation is missing. Never
substitute a different metric just because it is easier to obtain.

## 2. Read the evidence

Run the available query, open the dashboard, or read the recorded measurement. Cite the
query or source and the observation time. Keep estimates and assumptions separate from
readings. Do not print personal records or credentials.

For each metric, record baseline, target, actual result, denominator, user group, and
time window. With small samples, lead with counts such as "3 of 4 users". State gaps,
collection changes, and other changes that could explain the result. A before/after
comparison alone does not establish what caused the difference.

Also inspect effects that could offset the gain: support load, latency, cost, retention,
or another affected group. Record surprising user behavior, workarounds, unused features,
failures, and assumptions the evidence challenged.

## 3. Decide what the evidence supports

Check the agreed kill criteria first. Record each as met, not met, or unknown, with
evidence. Do not quietly relax a threshold after seeing the result. A proposed exception
is a decision for the user.

| Result | Meaning | Next step |
|---|---|---|
| keep | Targets met without an unacceptable downside | No follow-up needed |
| iterate | Evidence supports the direction and a specific improvement | `define` frames that change |
| cut | Sufficient evidence shows no useful return or unacceptable cost | `clean-house` reviews that feature |
| pivot | Evidence contradicts the central product assumption | `define` frames a new direction |
| insufficient evidence | Missing readings, an uncertain release, too few observations, or an unfinished measurement window prevents a decision | Name what is missing, how to obtain it, and a review date or observable trigger |

Give the reason in plain language. Explain which decisions remain possible when evidence
is incomplete. Missing evidence does not cancel a kill criterion that is already proven.
Recommend the next step without automatically starting another skill.

## 4. Save the report

Write `docs/audits/YYYY-MM-DD-readout.md`. If that path already records another review,
add a short feature name or time to the filename. Keep prior readouts intact: they record
what was observed at that time. Follow the project's commit policy.

Include only these sections, using tables where they help:

- **Release and promise:** feature, shipped date, source revisions/change ID, hypothesis,
  user group, and measurement window.
- **Metrics:** baseline, target, actual, denominator, and dated source.
- **Kill criteria:** threshold, result, evidence.
- **Other effects and surprises:** gains, costs, workarounds, and contrary evidence.
- **Result and next step:** supported decision, uncertainty, evidence still needed,
  and review date or trigger when unresolved.

Show the result and important evidence in chat; link the full report.
