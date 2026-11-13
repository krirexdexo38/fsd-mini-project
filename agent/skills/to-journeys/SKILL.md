---
description: "Turn each PRD journey into an executable script with observable steps, branches, and an end-state proof, plus the reference decisions those journeys need. Saves definitions/journeys.md. Use after to-prd, before to-mockups and to-spec."
---
Run only on explicit invocation — by name, slash/dollar command, or workflow stub. Otherwise say this skill exists and wait.

Turn the PRD's promise into behaviour that can be built and tested. Do not re-decide the user or product rationale; use the PRD, research, repository, and conversation.

## Inputs and amendment

`definitions/prd.md` is required. If it is absent, prompt `to-prd` and stop. Its Key User Journeys section is the inventory: each full journey here has the same name and number. Use research and ideas as evidence when available.

For records, acceptance, and downstream cascade, follow [amend mode](../../docs/amend-mode.md). On an increment, replace only affected journey or reference sections and append the matching `C-*` record.

## Build the artifact

1. **Expand only PRD journeys.** A full journey without a PRD entry is scope creep. A PRD journey that cannot be made observable needs a PRD correction.
2. **Share repeated segments without inventing a journey.** Put repeated sign-in or setup under **Shared segments** as `J0`, outside the Journey inventory. Other journeys may use it as a precondition. If it has its own user outcome, it is a PRD journey and belongs in the inventory.
3. **Write a script.** Each full journey has preconditions, concrete data, numbered actor/action/observable-result steps, branches, rules, and one end-state proof. The proof names records, counts, or states a test can assert. It becomes the first end-to-end test and task acceptance criterion.
4. **Test branches.** Every branch is tested. Give it a Panel ID only when the user sees a distinct state; leave it blank for background or external-system work. Journey-specific rules stay with the journey; shared rules move to Cross-journey rules.
5. **Record reference decisions.** Include data, channels, agent autonomy, queues, notifications, integrations, permissions, and behaviour with no journey when they apply. Use technical detail here, not in the PRD.
6. **Show provenance and failure.** Every substantive decision row has `Source / owner` and `Failure if omitted`. A source may be a PRD section, research finding, judgment, or named decision. Capability and inventory tables are summaries; they point to rows that carry those fields.
7. **Accept and hand off.** Save `definitions/journeys.md`, add `C-001` or the matching increment record, and commit. Prompt `to-mockups` for persistent UI, `pick-harness-shape` for a custom agent system, then `to-spec`.

## Template

<journeys-template>

## Source PRD

`definitions/prd.md`

## What the product does

| Capability | In plain words | Where it happens |
|---|---|---|

Every feature-tier journey appears in at least one row. Use journey IDs or `background` in the final column.

## Journey inventory

| # | Journey | Actor | Trigger | Surfaces | Tier |
|---|---|---|---|---|---|

Every row matches a PRD journey. This is an index, not implementation status.

## Shared segments

### J0 — {{shared segment, not a PRD journey}}

**Used by.** {{journeys}}
**Source / owner.** {{source}}
**Failure if omitted.** {{failure}}

| # | Actor | Action | Observable result | Panel |
|---|---|---|---|---|

**Branches**

| At step | When | Then | Panel if user-visible |
|---|---|---|---|

**End-state proof.** {{observable result the shared segment guarantees}}

## Journeys

### J1 — {{name matching the PRD}}

**Precondition.** {{state before step 1}}
**Data.** {{real names, numbers, and timestamps}}
**Surfaces.** {{product nouns in order}}
**Source / owner.** {{source}}
**Failure if omitted.** {{failure}}

| # | Actor | Action | Observable result | Panel |
|---|---|---|---|---|

**End-state proof.** {{one assertion that proves the journey succeeded}}

**Branches**

| At step | When | Then | Panel if user-visible |
|---|---|---|---|

**Rules**

| Rule | Behaviour when satisfied | Behaviour when violated | Source / owner | Failure if omitted |
|---|---|---|---|---|

## Cross-journey rules

| Rule | Applies to | Behaviour | Source / owner | Failure if omitted |
|---|---|---|---|---|

## Behaviour with no journey

| Behaviour | Trigger | What it does | How observed | Source / owner | Failure if omitted |
|---|---|---|---|---|---|

## Reference

### Data model

| Entity | Key fields | Relationships | Created / deleted by | Source / owner | Failure if omitted |
|---|---|---|---|---|---|

### External channels & touchpoints

| Channel | Inbound behaviour | Outbound behaviour | Rate / quota | Source / owner | Failure if omitted |
|---|---|---|---|---|---|

### Agent autonomy matrix (if AI is involved)

| Action | Default | Confidence gate | Hands to human when | Irreversible? | Source / owner | Failure if omitted |
|---|---|---|---|---|---|---|

### Queues & approval flows (if applicable)

| Queue | Holds | Enters when | Leaves when | Expiry / escalation | Source / owner | Failure if omitted |
|---|---|---|---|---|---|---|

### Notifications & digests (if applicable)

| Mode | Default? | Behaviour | Override | Source / owner | Failure if omitted |
|---|---|---|---|---|---|

### Integrations & migration (if applicable)

| Integration | Direction | Behaviour | Auth | Failure behaviour | Source / owner | Failure if omitted |
|---|---|---|---|---|---|---|

### Permissions (if applicable)

| Role | Can read | Can write | Can approve | Can administer | Source / owner | Failure if omitted |
|---|---|---|---|---|---|---|

## Open questions

| Question | Blocks which journey | What would settle it |
|---|---|---|

</journeys-template>
