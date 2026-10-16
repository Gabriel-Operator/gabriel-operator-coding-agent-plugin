---
name: persona-framework
description: Draft a domain-specific Persona operating loop linking ontology, Data Feeds, Signals, reviewed playbooks and evidence-backed ROI in local model files.
---

# Persona operating framework

Work in the user-selected local model repository. Author definitions and synthetic
examples for review; preserve existing IDs and unknown fields. Do not request or
store credentials, import participant rows, call remote APIs, enable runtime
monitoring, execute playbooks, publish or deploy. Runtime activation belongs to
Gabriel Operator or separately authorized live tooling after review.

Read [the framework contract](references/contract.md). Design the data, execution
and feedback layers as one source-to-outcome audit. Identify the domain nouns,
approved sources, event conditions, prepared actions, human approval boundary,
accepted result and cost basis. Use the relevant specialist skills below; do
not invent missing sources, permissions, prices or observed returns.

- `persona-ontology`: shared entities, attributes, relationships and context.
- `persona-data-feeds`: schema-validated acquisition and source provenance.
- `persona-signals`: disabled explainable monitoring presets.
- `persona-playbooks`: pinned source/review/mapping/action sequences.
- `persona-roi`: disclosed planning inputs and accepted-evidence monitoring.

Definitions go into the Persona model; runtime grants, enabled state, run IDs,
receipts and actual outcomes remain outside it. Feedback proposes improvements
for review; it never grants its own activation or exact-effect approval.


## Required playbook team protocol

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, reviewer, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.


## Shared community activity flagship

Read [the community activity loop contract](references/community-activity-loop.md) when authoring a family-activity or school-workshop persona. One pinned workflow package owns both landing-chat journeys and the signed-in command, including translated questions, artwork references and copy. The model owns market sources, country variants, disabled Signal presets and occurrence/ROI definitions. Country follows the saved area; language changes presentation only. Include every pinned feed in the inspected Observe stages. Preserve source candidates, missing permissions and unknown cost. A proposal, publication or RSVP does not prove that families met. Two distinct adult-managed family profiles and the configured school delivery evidence determine the outcome; corrections can withdraw confirmation. Author the contextual team for authenticated human review; local definitions and mock tests cannot manufacture confirmation or activate feeds, Signals, publication or external effects.
