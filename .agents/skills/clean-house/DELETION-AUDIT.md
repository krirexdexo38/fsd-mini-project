# Review a removal candidate

Inspect only the named file, directory, section, or capability. Report a recommendation;
do not edit during the review. Independent reviewers return findings to the main session.

## Check its purpose

- What useful behavior or knowledge would disappear?
- Who uses it, and what evidence supports that?
- Does code, a test, another document, or Git already preserve what is needed?
- What would break or become harder to understand without it?

Verify claims against callers, configuration, tests, or the running system. A file's claim
that it is essential is a question to check. A completed procedure may still be needed for
recovery or future setup; completion alone is not a reason to delete it.

References show the cost of a change, not whether the target is useful. If removing a
shared explanation would force its callers to repeat it, it may belong where it is.
If references only preserve a false claim, update them with the target.

For a script, distinguish changing state from checking it. Verify whether anything still
runs it and whether it detects a real problem. A checker should distinguish "nothing found"
from "nothing examined".

For guards, error paths, and tests, prove retained protection before proposing removal.
An uncommon case can still be supported behavior. Missing evidence belongs in the findings;
do not invent a user or assume none exists. Age and size guide attention, not the verdict.

## Recommend one action

| Action | Meaning |
|---|---|
| Delete | No continuing need remains, with evidence |
| Shorten | Keep the useful part; name exactly what survives |
| Merge into a named file | The same knowledge belongs together |
| Move to a named location | Useful content is in the wrong place |
| Keep | It is useful and correctly placed |
| More evidence needed | An unresolved fact could change the decision |

For a directory, distinguish whole-directory findings from file-specific ones. Identify
dependencies between recommendations so the main session can integrate them safely.

## Report

Give the target, action, useful content retained, evidence, consequences, references to
update, and anything unexamined. Include a rough size change when useful; count content
moved elsewhere as well as content removed.

Keep a separate proposed feature, script, or check separate from the deletion decision.
Removal does not authorize building a replacement.

After an approved change, references describe the current behavior. Historical reasons stay
in [decision records](DECISIONS-FORMAT.md), accepted change records, or Git history.
Use the [comment rules](../improve-readability/CHECKS.md) for facts future readers still need.
