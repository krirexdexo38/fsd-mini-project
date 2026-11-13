---
description: "Research customer pain and the competitive landscape, then write evidence for product ideation in definitions/research.md. Use when market evidence is needed before choosing an idea."
---
Run only on explicit invocation — by name, slash/dollar command, or workflow stub. Otherwise say this skill exists and wait.

Research the problem space, customer pain, and alternatives. Write `definitions/research.md`.

## Inputs

Use the problem, segments, and hypotheses from `define`. If they are not defined, prompt the user to run `define` and stop.

## Process

1. **Choose the depth.** Use a quick review when a small number of sources can answer the questions. Use a structured corpus when several stakeholder voices matter or counts must be auditable. Before paid or slow collection, state the expected scope, time, and cost and get the user's approval.

2. **Cover the questions, not a quota.** Make a source list where the target people complain, compare products, or describe workarounds. Test that the sources are accessible. Collect until each defined question has evidence or a named gap, relevant and opposing stakeholder voices are represented, and the research reaches saturation: new material stops changing the themes or known uncertainty. Do not pad the sample to reach a number.

3. **Keep provenance.** Record the source URL, date, source type, voice or segment, and why it was selected. Keep a source-local author key and thread ID when publicly available, without collecting extra personal details or assuming accounts across sites belong to the same person. Prefer recent, high-signal discussion where timing matters. Use the available browser or fetch tools; do not require or install a particular utility.

   For structured research, save a repeatable script and resolved source list. Store one observation per line in `research-corpus/corpus.jsonl` and its non-verbatim metadata in `research-corpus/index.csv`. Add raw material and the corpus to `.gitignore`; commit the script, source list, and index, never verbatim third-party content.

4. **Synthesize.** For each pain theme, record the pain, affected segment and voice, severity, supporting quotes with URLs, and volume. Count distinct people per theme, not repeated posts. If people cannot be distinguished, label the count as observations instead. Use counts and a denominator only when the structured index supports them; otherwise use a clear qualitative label. Surface tensions between stakeholder voices. Cover direct and indirect competitors, their strengths and weaknesses, recurring gaps, and relevant historical failures.

   State what the evidence cannot answer: missing voices, date or location limits, source-selection bias, and credible opposing evidence. Separate observed evidence from your inference.

5. **Write and hand off.** A rerun replaces `definitions/research.md`, so say so before replacing research the user may still cite. Keep the artifact concise. Once accepted, commit the summary and any structured method, then prompt `ideate`.

## Output template

<summary-template>

# Market research

**Scope and evidence limits.** Questions covered, source dates and locations, missing voices, selection bias, and opposing evidence.

## Customer pain

| Theme | Voice / segment | Severity | Evidence and volume | Representative quote |
|---|---|---|---|---|

Add a tension matrix when stakeholder voices conflict.

## Competitive landscape

| Competitor or workaround | Direct / indirect | Strength | Weakness or gap | Evidence |
|---|---|---|---|---|

**Historical failures.** Similar products that failed and the evidence for why.

**Pain-to-competitor map.** For each leading pain, who solves it well, who does not, and the remaining gap.

</summary-template>
