# Remembering scope decisions

Record durable rejected features in `definitions/decisions.md`, using
[the decision format](../clean-house/DECISIONS-FORMAT.md). One short section states the
decision, reason, and related issue links. Add new requests to the existing decision
instead of creating a file per request. Bugs and temporary deferrals do not need records.

Read existing `.out-of-scope/*.md` files as well when a project already uses them. Treat
them as prior decisions, not permanent prohibitions. Match the concept, explain the reason,
and let the maintainer confirm or reconsider it. Do not migrate the directory as incidental
triage work. When consolidating a relevant record with authorization, preserve its reason
and links before removing the duplicate.

A changed decision gets a new entry; mark the old entry `Superseded by` and link the new
one. Keep the prior reasoning. Old issues stay historical unless reopening them is requested.
If reconsideration changes an accepted product requirement, follow
[amend mode](../../docs/amend-mode.md) as well.
