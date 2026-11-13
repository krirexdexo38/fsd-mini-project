---
description: "Decide the visual identity and user-facing structure for a persistent UI, then draw its user-visible states. Saves definitions/mockups.md and one self-contained definitions/mockups.html. Use after to-journeys; skip CLI, API, library, and headless products."
---
Run only on explicit invocation — by name, slash/dollar command, or workflow stub. Otherwise say this skill exists and wait.

Pick and draw in one activity. The drawing tests the identity and structure; if it exposes a bad decision, revise it before treating the picks as settled. Ask one question at a time, only for a decision that applies, and recommend an answer grounded in the PRD and journeys.

## 1. Check scope and inputs

If the product has no persistent UI, stop without writing an artifact. Otherwise read `definitions/prd.md` and `definitions/journeys.md`; prompt the user for the missing artifact and stop if either is absent.

For records and cascade, follow [amend mode](../../docs/amend-mode.md). On an increment, update only affected Markdown sections and panels. An identity change re-renders every panel; a deleted journey removes its panels. A change with no affected UI decision or user-visible state needs no drawing.

## 2. Make only relevant picks

Always decide the visual identity once: register, user, feel, signature, accent and semantic colours, neutrals, spacing, fonts, depth, and motion. These values are the source for the SPEC's Product surfaces section and `ui-taste`.

**Register** means the surface's role: **brand** pages introduce or sell the product; **product** screens help people do their work. Choose per surface when both apply.

Add a product section only when it applies:

| Area | Include when | Decide |
|---|---|---|
| Navigation and shell | There is more than one persistent surface or device layout. | Navigation shape, global controls, and device variation. |
| Account and access | Users sign in, recover access, invite others, or have roles. | Entry, recovery, multi-factor authentication, deletion, and invite defaults. |
| Onboarding | A first run, permission, or empty state changes the first journey. | What appears, when, and whether it can be skipped. |
| Settings | Users or organisations can change product behaviour. | Sections, defaults, and scope. |
| Integrations | A journey names an integration. | Where it appears, when it is requested, and failure status. |
| System states | A shared error or unavailable state can occur. | User message and recovery path. Keep journey-specific failures in journey branches. |
| Help and support | Users need a support route. | Documentation, contact, status, and changelog surfaces. |
| Compliance touchpoints | The PRD names a user-facing legal, privacy, or regulated constraint. | Consent, export, deletion, age, or residency surface. |

State consciously omitted areas in the summary as `not applicable` with the reason.

## 3. Write the picks

Draft outside the accepted body. When settled, write `definitions/mockups.md`, add `C-001` or the matching change record, and commit it with the drawing.

<mockups-template>

## Sources

`definitions/prd.md`
`definitions/journeys.md`
`definitions/mockups.html`

## Summary

The visual identity, navigation shape, and product sections included. List any omitted area as `not applicable` and why.

## Visual identity

| Field | Picked |
|---|---|
| Register | |
| Who | |
| Feel | |
| Signature | |
| Accent + ramp | |
| Neutrals | |
| Spacing base | |
| Fonts | |
| Depth & motion | |

## Product sections

| Area | Decision | Constraint or source |
|---|---|---|

## Panel inventory

| Panel id | Renders | Viewport | What it locks |
|---|---|---|---|

Every row is an `id` in `definitions/mockups.html`. Every user-visible journey step or branch that names a Panel ID appears once here. A background or external action has no panel row.

## What the drawing changed

| Finding | Artifact amended | Change |
|---|---|---|

## Rejected alternatives

| Alternative | Why rejected |
|---|---|

## Open questions

Questions deferred to `to-spec` or not yet settled.

</mockups-template>

## 4. Draw and inspect

Build the panel inventory before HTML. Include each user-visible journey step and branch with a Panel ID, applicable onboarding and system states, and stress states that matter for the product: empty, populated, loading, failure, long content, and the smallest supported viewport. Show the inventory before drawing. Ask for agreement only if it exposes a new, unresolved design choice or the user asked for a checkpoint; otherwise proceed under existing authorization.

Write one self-contained `definitions/mockups.html`: no build step, framework, CDN, or network request. Use the recorded identity as CSS custom properties, real journey data, visible annotations, and stable panel IDs that match the inventory. Use layout techniques that behave at real viewport sizes and include a visible focus state.

Open every panel in a real browser at the required viewports. Check overflow, contrast, distinct states, action reachability, annotations, and at least one complete critical journey. Then walk the drawing with the user. If it changes a PRD or journey decision, amend that current body and its change record before redrawing. When settled, prompt `pick-harness-shape` if applicable, then `to-spec`.
