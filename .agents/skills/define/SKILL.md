---
name: define
description: Frame a fuzzy product idea or scoped change, test material assumptions, and route to the next definition artifact. Use for a new product or an increment to an existing product.
---

Frame the idea before authoring artifacts. Inspect the repository and existing definitions before asking. Ask one question at a time, with a recommendation. Ask only when the answer changes scope, cost, proof, or an irreversible decision.

## 1. Identify the change

Check whether `definitions/prd.md` or `definitions/spec.md` exists.

- **Greenfield:** neither exists. Continue below. The first accepted current-design artifact uses baseline `C-001`.
- **Increment:** a PRD or SPEC exists. State what changes, why now, and any affected user
  journey, surface, harness, or module. Choose a tier (`fix`, `internal`, `feature`, or
  `launch`). A `fix` has no `C-*` record or artifact cascade; route it to `diagnose` or
  `test-driven-dev`. For an `internal`, `feature`, or `launch` change, assign the next
  unused `C-*` ID and exact affected headings.

For tiers, records, acceptance, and the downstream cascade, follow [amend mode](../../docs/amend-mode.md). A change that rewrites the Problem Statement or Target User is a pivot; reframe the product rather than treating it as a small increment.

## 2. Resolve material unknowns

Ask only unanswered questions needed to decide:

- the user, customer, and concrete problem;
- the first critical user journey (CUJ): trigger, action, and observable outcome;
- evidence that the problem exists, including competing or manual alternatives;
- constraints that change the promise or delivery, such as money, timing, access, location, security, or regulation; and
- the product surface and any existing technical or brand constraint.

Do not use a fixed interview length. Explore the codebase or documents when they can answer a question.

## 3. State the risk and proof

List material assumptions as value, usability, viability, or feasibility. Rank them by impact and evidence, then test the highest-impact uncertainty first.

Write one testable hypothesis: `We believe [user] has [friction] because [cause]. If [capability], then [measurable behaviour] changes.` Set a kill criterion: the threshold, date, and action if it fails. It becomes the PRD metric, SPEC observability, and later `readout` check.

Choose the smallest useful test: a static mock for value, an interactive prototype for usability, a manually operated service for feasibility, or fake automation behind a real surface. For a high-friction form factor such as native mobile, hardware, or an app-store product, ask whether a cheaper surface can test the same hypothesis before committing.

## 4. Route

- **Market uncertainty:** prompt the user to run `research-market`, then `ideate`, `judge-idea`, and `to-prd`.
- **Known market and clear evidence:** prompt `to-prd` directly.
- **New or changed user behaviour:** after the PRD, prompt `to-journeys`. It supplies branches and end-state proofs for tasks and tests. A `fix` has no definition artifact: use `diagnose` or `test-driven-dev`. An `internal` change with no user-behaviour change can go straight to `to-spec`.
- **Persistent UI:** prompt `to-mockups` after journeys. It records the visual identity and draws the user-visible states.
- **Custom agent system:** prompt `pick-harness-shape` after journeys and any mockups. If the harness is the product's differentiator, let it shape the PRD first.
- **New service, first traffic, migration, or provider re-point:** prompt `to-infrastructure` after the PRD and `go-live` before the irreversible step.

When the applicable definition work is complete, prompt `to-spec` for an `internal`, `feature`, or `launch` change.
