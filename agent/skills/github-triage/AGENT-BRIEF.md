# Task instructions belong in the issue body

Use the task template in [to-issues](../to-issues/SKILL.md). Triage and planned work share
one format; comments record discussion and reasons, not a competing specification.

Keep the reporter's original account as context. If an old comment contains the accepted
brief, incorporate it into the body and link the comment. Resolve contradictions before
marking the task ready. Preserve existing contract fields unless reconciliation justifies
changing them.

Describe current and required behavior, acceptance tests, dependencies, relevant interfaces,
and scope. Use source paths and revisions for traceability; implementation line numbers
are hints, not instructions that must survive refactoring.

Where a specification governs the task, its `Task contract` must cite the accepted change,
source, exact relevant headings, and committed version. Follow [amend mode](../../docs/amend-mode.md).
Never invent those fields or copy a newer version merely to remove a hold.
