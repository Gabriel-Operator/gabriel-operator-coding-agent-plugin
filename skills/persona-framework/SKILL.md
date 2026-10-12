---
name: persona-framework
description: Design or explain a Gabriel Persona's operating loop across ontology, Data Feeds, Signals, approved playbooks and evidence-backed ROI. Use when connecting these capabilities or assessing which parts a domain needs.
---

# Persona operating framework

Start with the domain, the decision to prepare, the evidence needed, the person
who approves its effects, and the observable outcome. Read the existing model
definitions before proposing new resources. The operating loop is:

**Observe → interpret against ontology → prepare a playbook → human review →
execute → record outcome and cost → review the next decision.**

Read [the definition/runtime contract](references/contract.md) when designing
the connections. The blog describes the product framework; implementation
contracts determine what can actually be configured or executed.

| Capability | Purpose | Skill topic |
| --- | --- | --- |
| Ontology | Stable entities, attributes, relationships and contextual vocabulary | `persona-ontology` |
| Persona Data Feeds | Versioned source operations returning schema-validated JSON | `persona-data-feeds` |
| Persona Signals | Explainable conditions over authorized records that prepare declared actions | `persona-signals` |
| Playbooks | Reviewed sequences, pinned acquisition, mapping and existing execution authority | `persona-playbooks` |
| ROI calculator and monitoring | Planning assumptions plus accepted outcome evidence and comparable cost | `persona-roi` |

Use the topics relevant to the requested domain. A missing configured feed or
metric is an explicit gap, not permission to invent a provider, enable a signal,
claim value or create live resources. Ontology is the shared semantic contract;
it does not replace Lists, pipeline state machines, permissions or execution.

Keep one audit chain: source/revision and observation → selected ontology
context → signal reason → playbook/run and exact-effect approval → committed
result → acceptance/withdrawal → measurement and attributed cost. Preserve its
immutable identities and retries. A source change can invalidate a proposal;
it cannot silently expand approval or rerun an external mutation.

Portable Git contains definitions and references. Runner rows, identities,
credential bindings, grants, enabled signals, approvals, execution receipts and
ROI observations remain in their authorized runtime/workspace. Public examples
contain synthetic data only. Source discovery and improved recommendations
produce reviewable proposals; they do not automatically activate a new source,
rewrite thresholds, change ontology semantics or approve their own actions.

Discover current tool schemas before calling them. Workspace Gateway uses
`gabriel_*` with explicit persona IDs; persona-bound MCP uses `persona_*` and
the authenticated connection's persona. Request the topics using
`gabriel_get_skill_instructions` or `persona_get_skill_instructions`. The
[tool map](references/tool-map.json) lists supported operations. Tool access,
workspace selection and ordinary visibility/password checks still apply.
