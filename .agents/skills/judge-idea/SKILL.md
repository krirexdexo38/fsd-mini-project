---
name: judge-idea
description: Challenge an ideation winner or a PRD, journeys artifact, or SPEC. Records the target revision, findings, and a proceed, revise-document, research, ideation, or pivot verdict. Use after ideate or when a definition artifact needs a skeptical read.
disable-model-invocation: true
---

Run only on explicit invocation — by name, slash/dollar command, or workflow stub. Otherwise say this skill exists and wait.

Try to invalidate the selected direction or document. Produce one dated judgment with a concrete next action.

## Target

Default to the `— WINNER` section in `definitions/ideas.md`, with `definitions/research.md` as evidence. The user may instead target `definitions/prd.md`, `definitions/journeys.md`, or `definitions/spec.md`. If no target exists, ask which artifact to judge and stop.

Read the target and its inputs. Record its current Git revision. If it is uncommitted, record
`uncommitted`, the exact target heading, and a content hash or snapshot ID of the exact target
text. The judgment applies only to that target text; rerun it after a material change.

## Review

For each area, name a specific concern or write `none found` with a short reason:

- unsupported or weak assumptions, and evidence that would confirm or disprove them;
- missing evidence, relevant voices, or credible opposing evidence;
- gaps between the problem, proposed behaviour, and proof;
- missed alternatives or pivots;
- similar failures, distribution risk, and defensibility.

## Verdict and hand-off

| Verdict | Use when | Next action |
|---|---|---|
| `proceed` | No load-bearing concern remains. | Continue from the judged artifact: winner → `to-prd`; PRD → `to-journeys` or `to-spec` when the tier allows; journeys → `to-mockups`, `pick-harness-shape`, or `to-spec` as applicable; SPEC → `to-issues`. |
| `revise-document` | The concern is local to the judged artifact. | Amend that document, add the required `C-*` record when its accepted design changes, then rerun this judgment against the new revision. |
| `loop-back-to-research` | Missing evidence makes the decision unsafe. | Rerun `research-market` with the named question and voices. |
| `loop-back-to-ideate` | The rubric or option set is inadequate. | Rerun `ideate` with the named gap. |
| `pivot` | The problem framing is wrong. | Return to `define`. |

Save `judgments/<timestamp>.md`, then show the verdict. The user may override it; record that override in the judgment.

## Template

<judgment-template>

# Judgment: {{target artifact path}}

**Target.** {{path and heading, if any}}
**Target revision.** {{Git revision, or `uncommitted` with SHA-256 content hash or snapshot ID of the exact target text}}
**Verdict.** {{proceed | revise-document | loop-back-to-research | loop-back-to-ideate | pivot}}
**Reason.** {{one sentence}}

## Findings

| Area | Concern or why none was found | Severity | Concrete next action |
|---|---|---|---|

## Override

{{User override, if any.}}

</judgment-template>
