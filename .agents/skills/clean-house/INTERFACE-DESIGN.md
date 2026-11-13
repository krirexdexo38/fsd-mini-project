# Compare interface designs

Use only when alternatives for a chosen module need exploration.

1. State the caller's job, required behavior, constraints, and actual dependencies.
   A small usage example can make the problem concrete.
2. Compare materially different designs. Useful alternatives minimize what callers must
   learn, simplify the common case, or handle a demonstrated second use case. Do not invent
   extension needs just to make designs different.
3. Use available agents for independent alternatives when useful; otherwise work through
   them in order. Workers do not recruit other workers. No fixed agent count is required.
4. For each design, show the interface, a caller example, hidden implementation decisions,
   dependency/testing approach, and trade-offs.
5. Recommend the design that best meets the actual constraints with the least caller
   complexity. Combine ideas only when the combined design is easier to explain.

Use domain terms from `CONTEXT.md` and [the architecture terms](LANGUAGE.md) where needed.
[The dependency guide](DEEPENING.md) covers testing across external connections.
Present unresolved choices to the user; use an already accepted choice without asking again.
