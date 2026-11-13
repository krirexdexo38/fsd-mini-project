# Decision records

Use `definitions/decisions.md` for a settled choice whose reason future readers will need.
Create it only when needed. Each dated section is a short paragraph:

```md
## Payment processing stays external - YYYY-MM-DD

Use the existing payment provider because it owns settlement and dispute handling.
Building those capabilities would exceed this product's scope.

Related issues: #42, #87
```

Record non-obvious constraints, meaningful alternatives, costly choices, or durable rejected
features. Skip obvious implementation choices and temporary deferrals.

Service choices belong in `definitions/infrastructure.md`. A change to an accepted design
belongs in that document's current body and change record under
[amend mode](../../docs/amend-mode.md); this register does not replace that process.

Add details only when useful:

- Alternatives and consequences that explain a real trade-off.
- Related issue links, including later requests for the same rejected feature.
- `NEXT REVIEW: YYYY-MM-DD` on its own line for a scheduled review.
- `TRIGGER: <observable condition> -> <next action>` on its own line.

When a decision changes, append a new dated section and add
`Superseded by: <new section title>` to the old one. Preserve the old reason. Readers and
the freshness checker skip superseded decisions when deciding what is current.
