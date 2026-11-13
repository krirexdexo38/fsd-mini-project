---
name: ideate
description: Generate, rank, and select research-grounded product concepts. Produces a default set of ten one-page concepts, a user-approved rubric, and a winner in definitions/ideas.md. Use after research-market.
disable-model-invocation: true
---

Run only on explicit invocation — by name, slash/dollar command, or workflow stub. Otherwise say this skill exists and wait.

Generate distinct product directions from `definitions/research.md`, then let the user choose.

## Inputs

- `definitions/research.md` is required. If it is absent, prompt `research-market` and stop.
- Reuse the `## Rubric` section of an earlier `definitions/ideas.md` when one exists; propose changes only when new research warrants them.

## Process

1. Read the customer-pain and competitive-landscape evidence.
2. Propose five to seven weighted criteria. Each criterion names the research finding or decision that justifies it. Show the rubric and get the user's approval before scoring.
3. Draft ten distinct one-page concepts by default. Use fewer only when the evidence supports fewer genuinely different directions; state why. Spread them across pain themes. Each starts with a focused minimum version and has a credible expansion path.
4. Score each concept from 1 to 5 against the approved rubric, calculate the weighted total, and rank them. Every score note must cite a research theme or record, or say that it is an assumption.
5. Present the top three with their trade-offs. The user chooses the winner and may override the ranking.
6. Write `definitions/ideas.md`: the approved rubric first, then every concept in ranked order. Mark the chosen heading `— WINNER` and record any user override. Keep rejected concepts so later work can see what was considered. Commit the accepted artifact.
7. Prompt `judge-idea` before `to-prd`.

## One-pager template

<one-pager-template>

## {{N}}. {{Idea name}}

**Research basis.** Pain theme, source, and competitive gap this addresses.

**Segment.** User or customer; name each side for a multi-sided market.

**Minimum version.** The smallest version that delivers value.

**Expansion path.** One or two later capabilities that increase value.

**Differentiator.** Why this is meaningfully different from current options.

**Key risks.** The two or three facts that could kill it.

| Criterion | Score (1–5) | Evidence or assumption |
|---|---|---|

**Weighted total.** {{N}}

</one-pager-template>
