---
name: audit-drift
description: Check docs and code for contradictions, stale links, and missing coverage. Separates pending work, regressions, and unknown delivery.
---

# Audit Drift

This is a whole doc-graph sweep, not a diff review (`review-pr`) or a system-risk review
(`audit-failure-modes`). It also runs as the document check inside `clean-house`.

## 1. Read the available evidence

Use the current artifacts in `definitions/`: PRD, journeys, mockups Markdown and HTML, harness,
runtime, MCP servers, infrastructure, decisions, and SPEC. Use `CONTEXT-MAP.md` and its listed
`CONTEXT.md` files, or the root `CONTEXT.md`. Run only checks whose input artifact or table exists, and
name skipped checks in the report.

If neither a PRD nor SPEC exists, stop: there is no doc graph to audit. For code-versus-SPEC work,
also read the relevant Change record's `Work:` references, linked tasks or issues, and available
work-queue state, reconciliation, or verification evidence. Use a task contract's Change, Source,
and Sections to reject unrelated work. A closed task without verification evidence does not prove delivery.

## 2. Check the graph

### Change records - must fix or question

For each current-design artifact, parse direct `## Change C-*` records separately from the current
body. Each needs one `Affects:` line with exact `§`-prefixed headings. `mockups.html` has no
footer; `decisions.md` is a decision register.

Use Git history to find the revision that introduced each record. At that revision, verify that its
`Affects:` headings existed in the current body. An old `Before:` statement is history, not a live
requirement, and a later accepted removal is not drift. If Git history or the acceptance revision is
unavailable, report a **Question** rather than claiming a must-fix.

### Glossary and links

For every `_Avoid_` term in the applicable CONTEXT file, find uses in defining artifacts outside code
blocks and name the canonical replacement. Check Markdown links in `definitions/`, `docs/`,
`CONTEXT.md`, and `CONTEXT-MAP.md`; verify files and heading anchors. Broken links are must-fix.

### Current decisions and current SPEC

Compare unsuperseded decisions in `definitions/decisions.md` and current infrastructure category
sections (not Change history) with the SPEC's interfaces, schema, dependencies, and rollout. Flag only
a concrete contradiction. A different layer, a `NEXT REVIEW:`, or a `TRIGGER:` line is not drift.

### Code and current SPEC

Skip this comparison when source code or `definitions/spec.md` is absent. Use named contracts from the
SPEC's interfaces, schema, APIs, tools, and verification gates. For a forward difference, find the Change
record whose `Affects:` line covers the section, then read its delivery evidence.

- **Pending implementation:** related work is open, queued, held, or running. Report pending work,
  not drift.
- **Must-fix regression:** related work completed with named verification evidence, but code now breaks
  the contract. Cite both the delivery proof and broken behavior.
- **Question:** delivery evidence is absent, conflicting, inaccessible, or lacks verification. Do not
  assume the approved target shipped.
- **Worth noting:** a major code surface is absent from the current SPEC. Flag modules, route groups,
  or public tools, not individual functions.

Apply the same comparison to named harness topology, gates, and tools, and to runtime placement or
telemetry constraints that the SPEC restates.

### Mockups and journeys

Each mockup inventory row needs an HTML panel with the same id. Each journey step or branch that names
a panel needs a row, and no row may name a missing journey or step.

The SPEC's Journey coverage table needs every journey and reference row, no empty cells, and each
module claimed by a row. The journeys capability table needs every feature-tier journey and no dangling
journey or background identifier.

## 3. Report

```text
## Must fix
- file:line - contradiction or broken link, with correction

## Pending implementation
- file:line - accepted contract and open task or queue evidence

## Questions
- file:line - difference and missing or conflicting delivery evidence

## Worth noting
- file:line - non-blocking consequence
```

Say which section is empty and which checks were skipped for missing inputs. Do not summarize the
artifacts. Report in chat unless the user asks to save `docs/audits/YYYY-MM-DD-doc-audit.md`; when
requested, save it without asking again.

## Out of scope

PRD prose judgment, deployed-only topology changes, decision completeness, and issue-tracker hygiene
belong to their named reviews, not this static sweep.
