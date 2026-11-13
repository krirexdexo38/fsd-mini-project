# Readability checks

Use the relevant rows on the area being changed. Each is a question to investigate, not
an automatic edit. Preserve supported behavior and the project's domain vocabulary.

## Meaning and information

| Difficulty | Useful response |
|---|---|
| Vague or misleading name | Name the actual value or behavior; include units or a meaningful hazard |
| A function is hard to name or explain | Check whether it does unrelated jobs before changing its wording |
| A comment repeats code | Remove it, or state the missing reason or constraint |
| A public comment describes internals | Explain what callers must know: inputs, results, errors, ordering, units |
| Code requires mental execution to understand | Use a clear name, intermediate value, or simpler control flow |
| One decision is repeated across files | Give it one owner when that reduces the work needed to change it |
| Shared code knows a particular caller | Keep the caller-specific choice with that caller |
| Two functions only make sense together | Keep them together or change the split so each is understandable |
| Errors are handled at every level | Give recovery and reporting clear owners; retain meaningful failure cases |

## What the reader must remember

| Difficulty | Useful response |
|---|---|
| Many changing values, nested branches, or long conditions | Reduce nesting, name intermediate facts, and keep phases clear |
| Hidden dependencies or required call order | Make inputs and ordering visible in the interface |
| A read operation changes state | Separate reading and modification where the contract allows |
| Several words name the same domain concept | Use the term defined by the project |
| Similar names follow different conventions | Follow the established pattern in the touched area |
| No clear entry point or overview | Add a useful name or short explanation where the reader starts |

Use complexity measurements only to locate difficult code. Do not split a coherent function
merely to meet a number.

## Code that is difficult to change

| Difficulty | Useful response |
|---|---|
| Repeated logic | Share it when the examples really represent one rule |
| A long function does unrelated jobs | Extract complete, clearly named tasks |
| Parameters or fields repeatedly travel together | Represent the concept they form |
| One file changes for unrelated reasons | Separate responsibilities; route module redesign to `clean-house` |
| One change requires edits across many files | Put the related decision and behavior together |
| A function mostly handles another module's data | Consider moving it nearer that data |
| Domain values are ambiguous strings or numbers | Use a clearer type when it prevents real mistakes |
| Repeated switches on the same discriminator | Consider one dispatch point or supported variants |
| Long chains expose another module's structure | Let the appropriate owner perform the operation |
| Tiny helpers require reading all their siblings | Recombine them into a coherent task |
| A field only applies in some states | Make the actual states clear |
| An apologetic comment explains avoidable complexity | Simplify the code and retain only the necessary reason |

## Unnecessary code and error paths

| Candidate | Evidence needed before simplifying |
|---|---|
| Unreachable guard or error path | Prove it cannot occur through supported callers or external inputs |
| Repeated validation | Establish where validation is guaranteed and preserve every trust boundary |
| An optional value said to be always present | Prove absence is impossible; caller defaults alone are not proof |
| A setting with one observed value | Check supported deployments and callers before fixing it to that value |
| A boolean selects two operations | Check whether two named operations make callers simpler |
| Nested retry policies | Identify one owner without losing required retry or deadline behavior |
| Catch, log, and rethrow | Ensure a meaningful error is still reported once at the responsible layer |
| A fallback returns a success-shaped empty result | Preserve the actual failure or handle it where a useful decision is possible |
| A forwarding wrapper | Check whether it owns a contract, isolation, or other necessary purpose |
| Duplicate or dead paths | Prove retained behavior and callers are covered |
| Decision logic mixed with side effects | Separate them when it makes the behavior clearer and tests more faithful |
| Unused extension points | Check real consumers before removing them |

An unlikely failure is still possible. Missing evidence means keep the protection and report
the uncertainty. A public contract change or whole-feature removal belongs to `clean-house`.

## Names and structure

Names should reveal units, scope, and intent. Booleans describe a condition; reading, fetching,
and modifying use honest verbs. Use short scopes, direct conditions, and consistent ordering.
Prefer a clear intermediate value to an expression that needs rereading.

Extract a helper only when it has a useful name and can be understood on its own. After a
split, check for hidden shared state and misleading read-shaped names that modify values.
A small amount of duplication can be cheaper than the wrong shared abstraction.

## Comments and documentation

Keep public contracts and non-obvious reasons, constraints, trade-offs, and examples.
Put a fact in a type, name, or code structure when that makes it clearer.

Remove proven redundant comments, obsolete commented-out code, empty docstrings, decorative
banners, and history that Git already records. Keep helpful section explanations in a coherent
long function. Review old TODOs for continuing relevance; age alone does not make them false.
Do not remove license notices, tool directives, accepted change records, decision history, or
useful audit evidence under a general comment-cleanup rule.

Repair the current claim when behavior changed. Historical decisions retain their designated
records under [amend mode](../../docs/amend-mode.md).

## Optional tools

Use already installed tools for duplication, unused exports, complexity, or mutation testing.
Inspect each result before acting. Prefer the project's commands and available shell; do not
install a tool or introduce a fixed tool catalog just to complete this review.
