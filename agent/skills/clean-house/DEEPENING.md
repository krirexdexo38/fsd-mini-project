# Simpler interfaces and their tests

Use this guide when regrouping related code so callers need to know less.
[Language](LANGUAGE.md) explains module, interface, and adapter.

Choose the dependency strategy from what the code actually uses:

| Dependency | Test approach |
|---|---|
| Pure computation or in-memory state | Exercise the public interface directly |
| A local dependency with a faithful test equivalent | Run that equivalent behind the interface; check differences that matter to the behavior |
| Another service the project owns | Test the behavior and the real connection contract; a local adapter can cover repeatable cases |
| A third-party service | Substitute it at the external interface for controlled tests; retain appropriate integration checks |

Do not add an adapter or expose a test-only interface unless an actual dependency needs it.
Keep internal replacements private. Avoid tests that assert implementation details callers
cannot observe.

Write protection at the resulting interface before removing old tests. Delete a replaced
test only after proving its meaningful cases remain covered, including failures. Keep tests
that cover distinct behavior. A passing replacement test alone does not prove equivalence.

Migrate callers in reviewable steps. Check behavior, errors, ordering, and performance
constraints as applicable; remove the old path once the replacement is verified.
