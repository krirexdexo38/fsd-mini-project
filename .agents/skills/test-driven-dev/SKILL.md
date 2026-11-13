---
name: test-driven-dev
description: Implement a settled issue or SPEC slice test-first. Use for scoped feature work, bug fixes, or red-green-refactor; route undecided product changes through define.
---

# Test-Driven Development

Tests prove behavior through public interfaces. Prefer a real production path over a test of a
private helper or an internal mock.

Read [tests.md](tests.md) for production-path coverage and external-service rules. Use
[mocking.md](mocking.md), [deep-modules.md](deep-modules.md), [evals.md](evals.md),
[test-assets.md](test-assets.md), or [mcp-testing.md](mcp-testing.md) only when that subject applies.

## Before coding

- Read the task's `## Task contract` when present. Confirm its Change, Source, Sections, and
  Version still name the accepted source record. Hold a mismatched task for `/to-issues`.
  A missing block is allowed only without a governing `definitions/spec.md`. Direct maintenance or
  drift work, and controller-provided named maintenance jobs, follow their own route; they never
  exempt a numbered task under a governing SPEC.
- Read the task acceptance criteria and any linked journey. Start with its end-state proof through the
  right production path: browser for a user interface, API, CLI, or tool boundary otherwise. Cover its
  relevant failure branches in later tests.
- State the public behavior, the smallest useful interface, the first behaviors to prove, and what is
  outside the slice. For a new public interface, state non-obvious inputs, invariants, units, and errors
  for callers. Compare interface shapes only when more than one viable choice affects callers.
- Keep interfaces small and put complexity behind them. Define avoidable error cases out of the
  contract when the intended semantics permit it.

Use the matching extra check when needed:

| Condition | Extra check |
|---|---|
| Web user interface (UI) | Make the first user-facing test a real-browser critical journey, not a component-only test. Apply `ui-taste` before styling. |
| Model or agent behavior | Make the red test an eval case with a stated threshold on a pinned model; test deterministic seams normally. |
| Image, audio, video, or rich-text fixture | Follow [test-assets.md](test-assets.md). It creates stimuli, never a subjective verdict. |
| Paid or external dependency | Exercise the failure path. An unavailable environment skips the integration check; a code regression fails it. |

## Build one vertical slice at a time

1. Start with the task or linked journey end-state proof. Exercise it through the narrowest production path, then watch the test fail for the expected reason.
2. Write the smallest code that passes it.
3. Repeat for the next behavior. Prioritize critical and complex behavior instead of every permutation. Do not write a batch of imagined tests or anticipate later work.
4. Once green, simplify names, duplication, comments, and boundaries without changing behavior.
   Run the relevant tests after each refactor.

Never refactor while red.

## Bugs found during the slice

| Finding | Action |
|---|---|
| Inside this slice | Fix it now with a test. |
| Outside this slice | Leave it and report what you saw, where, and how to confirm it. `/run-wave` collects these between waves. |
| Breaks a shipped journey or loses data | Stop and ask the user before acting. |

Mention pre-existing dead code; do not delete it as incidental cleanup.

## Before declaring the slice done

- The task contract still matches the source, when one applies.
- Tests use the caller's real input path and assert the promised behavior.
- A regression test fails with the reported symptom before the fix.
- Each external dependency has a meaningful failure case.
- UI behavior has a browser proof; model behavior has an eval threshold; relevant failure branches are covered.
- The smallest implementation passes the task's named checks.
