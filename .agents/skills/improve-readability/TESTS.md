# Review an existing test suite

Use this guide when the affected tests are weak or the user requests a test-suite review.
[test-driven-dev](../test-driven-dev/SKILL.md) covers tests for new behavior.

A useful test catches a regression, survives an internal refactor, returns feedback promptly,
and is understandable to maintain. A line being covered does not prove its result is checked.

## Find missing protection

For important changes, run an installed mutation tool on the affected area, or deliberately
break a representative behavior in an isolated copy and check that the test fails. Restore
the exact starting state. The [main skill](SKILL.md) defines scope and authorization.
A review-only request does not authorize modifying the user's checkout.

Name each missed fault and the behavior that should have been asserted. Never weaken an
assertion to make a refactor pass.

| Problem | Improvement |
|---|---|
| Asserts private state or internal mock calls | Test the result through the caller's interface |
| No meaningful assertion | Assert the observable result or remove a proven redundant test |
| Setup bypasses the real creation or input path | Build the input as production does |
| Hidden fixtures, shared state, clock, or environment | Make relevant inputs visible and controlled |
| One test covers unrelated behaviors | Separate the claims |
| Branches decide what to assert | Use explicit cases with clear expectations |
| Many unexplained assertions | Label the meaningful claims so failure points to the problem |
| Mocks replace code the project owns | Exercise that code; substitute external dependencies only where appropriate |
| Repeated setup hides the case | Share clear setup without bypassing the production path |
| A large snapshot is accepted without inspection | Assert the meaningful fields and invariants |
| Slow or intermittent failure | Find the cause; record any authorized quarantine as missing coverage |
| Behavior no longer exists | Remove its orphaned test with the approved behavior removal |

See [production-path tests](../test-driven-dev/tests.md) and
[mocking](../test-driven-dev/mocking.md) for details.

## Improve the tests

1. Record the current failures and representative faults the suite misses.
2. Establish tests at the supported interface, including relevant failure behavior.
3. Strengthen assertions until the missed faults fail.
4. Remove superseded tests only after proving their cases remain covered. Keep distinct
   edge cases; a broader test does not automatically replace all smaller tests.
5. Rerun the same fault checks and the required project gates.

Separate test improvements from structural changes so their effect can be reviewed.
Use an observed external error or a documented reproducible response instead of inventing
provider error text. An unavailable integration environment is missing verification, never
proof that the integration works.

Do not pursue a coverage percentage in unrelated code. Report the protection gained,
remaining gaps, and checks that could not run.
