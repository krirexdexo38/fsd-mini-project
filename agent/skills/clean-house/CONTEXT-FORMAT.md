# Project vocabulary

Create `CONTEXT.md` only when a project-specific term needs explaining. Keep each definition
short, use it consistently, and list confusing synonyms only when they have caused a problem.

```md
# Ordering

## Language
**Order:** A customer's request for goods.
**Invoice:** A request for payment for delivered goods.

## Relationships
- An Order can produce several Invoices.
- Each Invoice belongs to one Order.
```

Add an example or a resolved ambiguity when it helps distinguish related concepts.
General programming vocabulary does not belong in this file. Add naming conventions only
when the project needs a shared choice; follow existing code otherwise.

Most projects need one root file. If `CONTEXT-MAP.md` already describes several domains,
read it and update the relevant domain's `CONTEXT.md`. The map lists each domain's file
and how the domains interact. Create that extra structure only when distinct domains
actually require different meanings.

Resolve an ambiguous term from code, documents, or the user before establishing its meaning.
