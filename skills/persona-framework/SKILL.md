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


## Required playbook team protocol

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, Process Reviewer, Governance Agent, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Each playbook carries a versioned rulebook with stable IDs and domain obligations/prohibitions; its Governance Agent checks the rules at the configured review gates and records evidence, while uncertainty waits for human resolution. Rules do not grant permissions: capability scopes, resource authorization and protected-action approvals remain server-enforced. The Auditor owns cost/usage reconciliation, not compliance. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.


### Finalization and review evidence

Task outputs may declare `output.ontology` projections and `recordOutputs` mappings. Each mapping uses JSON pointers, an existing List/pipeline resource key and a permitted create/update/delete operation. Map actual accepted values; updates/deletes require an observed runtime record ID. The server prepares encrypted intents and commits them only after final judging through existing authorization and exact-effect approval. Native action steps retain their original action-boundary controls. Do not claim a generated draft has been persisted or economically accepted.

Coordinator-directed revisions preserve the reviewed goal and capability envelope. Rejected drafts, accepted versions and source provenance remain auditable. The memory steward selects bounded facts/decisions/lessons from accepted evidence; server-copied values retain artifact/version references. Reuse requires finalized successful work with compatible actor/workspace/team/ontology semantics. Quality exceptions retain history without promoting new facts. Use the authenticated run UI to inspect saved evidence, provide human scores and reasons for every criterion, and review improvement drafts. Mock suites are not human reference results. Feedback drafts require renewed confirmation; persistence, accounting and authority failures cannot be waived as quality exceptions.

Real navigation and transformations require owned work products. An opaque capability that cannot enforce individual effect boundaries blocks confirmation with `TEAM_CAPABILITY_GOVERNANCE_REQUIRED`; replace it with governed tools rather than approving around the restriction.

For a family activity or school-workshop flagship, read [the community activity loop contract](references/community-activity-loop.md). It covers shared guided state, scoped refreshable feeds, opt-in Signals, reviewed team execution and adult-confirmed occurrence ROI.
