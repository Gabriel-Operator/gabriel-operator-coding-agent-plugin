---
name: persona-ontology
description: Draft a Persona semantic contract with stable entities, attributes, relationships and contextual vocabulary in local assets/ontology.json.
---

# Persona ontology

Work in the user-selected local model repository. Author definitions and synthetic
examples for review; preserve existing IDs and unknown fields. Do not request or
store credentials, import participant rows, call remote APIs, enable runtime
monitoring, execute playbooks, publish or deploy. Runtime activation belongs to
Gabriel Operator or separately authorized live tooling after review.

Read [the semantic contract](references/contract.md), and validate against
[the schema](references/ontology.schema.json). Maintain one parent
`assets/ontology.json` shared by feeds, Signals, playbooks and ROI. Preserve
existing identifiers; change semantic version deliberately when meaning changes.
Country/audience/language selection may change model/vocabulary, never actor
identity or authorization. Wire keys and enum values are not translated.

Define the domain's entities and relationships from supplied requirements; do
not invent instances to populate a graph. A feed projection validates JSON
against selected semantics; a separate approved mapping retains the existing
List/state-machine mutation path. Captured semantic snapshots belong to runtime
measurement, not the ontology draft. Read the operating framework when linking
these layers. The bundled validator can inspect explicitly selected local
files; it does not query instances or activate a candidate.


## Required playbook team protocol

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, reviewer, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.
