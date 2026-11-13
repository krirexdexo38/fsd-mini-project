# Architecture terms

Use the project's domain names first. These terms help explain a design when the distinction
matters; they do not forbid familiar words such as service, API, or boundary.

| Term | Meaning |
|---|---|
| Module | A function, class, package, or related group of code with an interface callers use |
| Interface | Everything a caller must know: inputs, outputs, errors, ordering, settings, and performance constraints |
| Implementation | The code that carries out that interface |
| Depth | How much useful behavior a module provides compared with what callers must learn |
| Seam | A place where an implementation can be replaced without changing its callers |
| Adapter | An implementation that connects an interface to a particular dependency |
| Leverage | Useful behavior gained from a small interface |
| Locality | Related decisions, changes, and bugs kept in one place |

A deep module gives callers useful behavior through a simpler interface. Its internal code
may contain smaller pieces without exposing them to callers. Count neither lines nor methods
as a substitute for that judgment.

Imagine removing a layer: does complexity disappear, or does every caller have to recreate
what it did? The answer distinguishes unnecessary forwarding from a useful interface.

Test through the interface callers rely on. Keep test-only details private. Introduce a
replaceable connection only when actual variation justifies it, such as production and a
faithful test dependency. One implementation alone does not justify another layer.
