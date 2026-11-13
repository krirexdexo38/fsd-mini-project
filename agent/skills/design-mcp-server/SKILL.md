---
description: "Design a new MCP (Model Context Protocol) server and write its contract in definitions/mcp-servers.md. Use when the project is producing shared or out-of-process agent tools, not when it is only consuming an existing server."
---
# Design MCP Server

An MCP (Model Context Protocol) server exposes a public tool contract. Its schemas, errors, permissions, and lifecycle must
work for clients outside this codebase. Read the [MCP design brief](../../docs/agentic-patterns/06_mcp_design_brief.md)
only for the selected branch. Verify the current MCP specification, software development kit (SDK), and target-client support
before making protocol-specific claims.

Ask one unresolved decision at a time and recommend an answer.

## Amend mode

If definitions/mcp-servers.md already carries this server and this is a scoped change, use [amend mode](../../docs/amend-mode.md) and the
C-* ID and affected headings from define. Keep drafts outside the current body. When accepted,
replace only this server's affected section, reconcile contradictions, and append ## Change C-*
with exact Affects: headings. Then name /to-spec.

## 1. Establish the boundary

Read definitions/prd.md when present, plus definitions/journeys.md for channels, integrations,
and unattended actions. Read definitions/harness.md when this follows pick-harness-shape; it sets
the expected tool count, naming, and permissions.

MCP is useful when tools serve several agent frameworks, need an out-of-process boundary, or are a
product for another team. Otherwise use an in-process tool or function and record why. A standalone
server is allowed when the user confirms it; record that the PRD was unavailable.

## 2. Design only the applicable surface

### Transport and auth

- Use stdio for a local process. Standard output carries protocol messages only; diagnostics go to
  standard error.
- Use the current supported HTTP transport for remote consumers. Add legacy transport support only
  for a named client that needs it.
- Use no auth only where the operating-system user is the trust boundary. Use scoped service auth
  for an internal server. Use the current OAuth profile only when users or tenants need delegated
  access. Verify protected-resource discovery, client registration or metadata, and current PKCE
  requirements against the clients you must serve.

### Tools

Design around user-meaningful actions, never a one-to-one proxy for an underlying API. Use
lowercase snake case in **verb_noun** order: create_pull_request, not pull_request_create.
Do not repeat the server name in a tool name.

An idempotent action is safe to repeat with the same input.

For every tool, decide:

| Contract part | Required decision |
|---|---|
| Input | Simple named fields, useful descriptions, and finite validation where possible |
| Output | Published schema and one consistent structured result policy |
| Effects | Explicit read-only, idempotent, destructive, and open-world annotations where the current protocol supports them |
| Permissions | The caller and data scope allowed to use it |
| Failure | A structured, actionable tool error rather than an unhandled exception |

Validate all published schemas at startup. Do not expose a capability in initialization unless the
server implements it. If discovery is paginated, implement a progressing cursor and test it.

### Optional primitives and lifecycle

Add resources only for read-only, addressable data. Add prompts or sampling only for a named
consumer need. Prefer stateless calls. If sessions or a persistent process are needed, record
session ownership, shutdown behavior, cold-start policy, and change notifications for mutable
tool or resource lists.

## 3. Test and operate the contract

Record the MCP protocol and SDK versions you tested. Before requiring a conformance suite, verify
that a compatible runner is available under the project's package manager and in CI, then pin it.
Do not assume npx or a particular third-party runner exists.

The test plan includes the applicable rows below:

| Test | Include when |
|---|---|
| Pinned conformance runner | A supported runner is available for the selected protocol and transport |
| Real-server integration | Always; exercise the actual stdio or HTTP server rather than only mocks |
| Schema and startup validation | Always for published tools |
| Complex or malformed schema fixture | A tool has a complex schema or a past schema failure |
| Fault isolation | More than one server or independently loaded tool surface can fail |
| Auth, session, cursor, or notification tests | That feature is advertised |

If no conformance runner is available, keep the real-server protocol tests and record the gap and
the condition for adding a runner. Do not call that equivalent coverage unless it actually is.

Use structured logs with request/tool identifiers and redact credentials, personal data, and auth
headers. Record the response metadata and reconnect/error behavior needed by the selected clients.

## 4. Save the artifact

Draft outside the committed current body. Once accepted, write definitions/mcp-servers.md with one second-level section per server under the top-level MCP servers heading, then commit it. Its first accepted current body gets the
shared C-001 baseline record. Later changes replace only the current server section and append the
matching C-* record. Do not edit another server's section.

<mcp-design-template>

## {{server-slug}}

### Sources

- definitions/prd.md, definitions/journeys.md, and definitions/harness.md when read
- Current MCP specification, SDK, and client sources used for compatibility claims

### Summary

Transport, auth, tool boundary, result shape, state, and tested protocol version.

### Why MCP

The sharing, boundary, or product need that justified MCP over an in-process tool.

### Transport and auth

**Transport and supported clients:**
**Auth and trust boundary:**
**Compatibility evidence:**

### Tool surface

**Naming convention:** verb_noun, lowercase snake case, no server-name prefix.
**Boundaries and permission model:**

| Tool | Input/output contract | Permission scope | Effects and repeat-call safety | Failure shape |
|---|---|---|---|---|

### Optional primitives and lifecycle

**Resources, prompts, or sampling:**
**State, sessions, startup, shutdown, and change notifications:**
**Capabilities and pagination:**

### Testing and observability

**Protocol and SDK versions tested:**

| Test | Included | Evidence or reason |
|---|---|---|

**Logs, response metadata, redaction, and reconnect behavior:**

### Rejected alternatives

| Alternative | Why rejected |
|---|---|

### Open questions

</mcp-design-template>

## Hand-off

Report the accepted server section and its C-* ID, then name /to-spec. If no PRD exists, also
name /to-prd for the product decision the server should eventually serve.
