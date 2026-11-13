---
name: ui-taste
description: Apply the approved visual identity to a user interface (UI). Use while building or styling screens, components, dashboards, and pages.
---

# UI taste

Use the product's approved visual identity. A screen should make one task clear, show its real states,
and feel like part of this product rather than a category template.

## Start with the source of truth

Read the SPEC's **Product surfaces** section and `definitions/mockups.md` when present. State one
short design read: the surface, user, register, and intended feel.

Use identity already approved in the user request, task, or product context without asking again. On an
existing surface, reuse its local style. If a persistent product surface still lacks a settled identity,
recommend `to-mockups`; it owns the register, user, feel, signature, palette, type, and spacing. For an
authorized small standalone surface, choose those values concisely, record them in the project's existing
design location, and proceed without forcing the full design chain. Product surfaces favor familiar task
patterns and restrained motion; brand surfaces can make the identity more prominent.

## Apply the core rules

| Area | Apply |
|---|---|
| Hierarchy and space | Give each surface one primary action and keep destructive actions separate. Keep at most three visual levels. Use size, weight, contrast, and the approved spacing scale to group related things and separate unrelated ones. |
| Type and color | Start with readable hierarchy before color. Use the approved font pair, scale, neutrals, accent ramp, and semantic colors. Keep body text at least 16px and line length near 45-75 characters unless the surface needs otherwise. |
| Contrast and input | Meet WCAG AA: 4.5:1 for body text and 3:1 for large text and interactive indicators. Do not use color alone. Keep keyboard focus visible and touch targets at least 44 by 44 pixels where touch applies. |
| States | Every fetch has loading, empty, and error states. Errors explain what happened and a next action without exposing a stack trace. |
| Forms and overlays | Use visible labels, nearby plain-language validation, action-specific buttons, and one-column related fields. Use modals only for destructive confirmation, blocking input, or a focused single task. |
| Motion and depth | Use motion only to explain a state change, respect reduced motion, and use depth to show hierarchy. Read [motion-craft.md](motion-craft.md) for complex motion or gestures. |

Avoid decoration that competes with the task: equal-weight actions, arbitrary spacing, category-stereotype
palette or type choices, and animation without meaning. The approved identity decides what is distinctive;
current design fashion does not.

## Verify in a browser

Before calling UI work done:

- drive the happy path and an empty, error, or narrow-viewport case in a real browser;
- tab through the surface and confirm focus treatment;
- check dark mode when the product provides it;
- say what could not be run instead of claiming visual success.
