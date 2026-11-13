---
name: review-pr
description: Review the current change before shipping. Finds concrete correctness, scope, safety, test, prompt, and task-contract problems.
disable-model-invocation: true
---

Run only on explicit invocation - by name, slash/dollar command, or workflow stub. Otherwise say this
skill is available and wait.

# Review

Review the current diff, not the whole system. `audit-drift` checks the doc graph and
`audit-failure-modes` reads wider system risk.

## 1. Establish the comparison

Use the pull request target when available. Otherwise resolve the repository's configured default branch
from local Git or hosting metadata; ask only if no base can be determined. Surface pre-existing dirty
files instead of quietly bundling them. Read the diff, commit list, and every changed file in full before
judging it.

## 2. Review what this diff introduced

Report only a problem you can point to in the change.

- **Behavior and safety:** wrong logic, missing edge case, unsafe external input, leaked secret or raw
  provider error, and user-visible work with no progress or actionable failure.
- **Scope and simplicity:** unrelated cleanup, speculative setting or abstraction, duplicated source of
  truth, needless guard or catch, or a wrapper that hides no decision.
- **Tests and removal:** a changed behavior lacks evidence; a bug fix lacks a symptom-level regression
  test; a deletion leaves tests, fixtures, routes, demos, or documentation behind.
- **Interfaces and readability:** a new public surface has an unclear contract, a name lies, private
  internals cross a module boundary, or a comment repeats code instead of explaining a decision.
- **Task contract:** when one applies, Change, Source, Sections, and Version still name the accepted
  record and the named proof or gate ran. A missing block is allowed only without a governing SPEC.
  Direct maintenance or drift work, and controller-provided named maintenance jobs, never exempt a
  numbered task. `Work:` is traceability, not delivery proof.

For a cross-surface or removal change, search the whole repository for its names and artifacts, not only
the changed files.

### Prompt and MCP changes

When prompts, SKILL.md bodies, MCP tools, resources, or descriptions change, also check:

- each rule says when it applies and what happens;
- examples, tools, and fields still match registered and parsed behavior;
- tool descriptions name the domain and tell a client when to call them;
- MCP changes still match `definitions/mcp-servers.md` and the [MCP design brief](../../docs/agentic-patterns/06_mcp_design_brief.md) when those exist. For a mutation, check that advertised behavior exists, change notifications are available when the client needs them, and schemas fail at startup rather than at first use.

## 3. Report and resolve

Use only these sections:

```text
## Must fix
- file:line - problem and concrete correction

## Worth noting
- file:line - non-blocking consequence
```

Say when a section is empty. Do not summarize or praise the diff. Recommend `audit-drift` only when a
changed definition or observed inconsistency needs a whole-graph check; mention `audit-failure-modes`
before a release cut when risk has not been assessed.

After a response, re-read the changed files and confirm every must-fix is resolved before signing off.
