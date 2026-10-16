---
name: persona-data-feeds
description: Draft Persona Data Feed catalogs, acquisition contracts, source workflows and ontology projections in a local model repository.
---

# Persona Data Feeds

Work in the user-selected local model repository. Author definitions and synthetic
examples for review; preserve existing IDs and unknown fields. Do not request or
store credentials, import participant rows, call remote APIs, enable runtime
monitoring, execute playbooks, publish or deploy. Runtime activation belongs to
Gabriel Operator or separately authorized live tooling after review.

Read [the feed definition contract](references/definition.md) and
[the operating framework](references/persona-framework.md). Draft
`assets/data-feeds/catalog.json` with schemaVersion 1 and stable workflow resource
keys. Refer to definition/workflow JSON assets under `assets/data-feeds/`, and
set `publishedConfig.dataFeedCatalog` to that path. Source workflows have
schemaVersion 2, matching resourceKey and structure.

Declare one CRUD operation, input/output schemas, exact hostnames and credential
slot descriptors only. Select the acquisition type/mode that the domain needs.
Bind returned JSON to stable ontology attributes and retain provenance. A feed
returns JSON; a separate approved playbook mapping chooses the destination List.
Country/language variants preserve wire keys; individual account targeting and
credentials are runtime-only. Source discovery produces candidates for review,
not automatically approved providers. Do not fabricate runtime feed revisions.


## Required playbook team protocol

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, reviewer, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.


## Shared community activity flagship

Read [the community activity loop contract](../persona-framework/references/community-activity-loop.md) when authoring a family-activity or school-workshop persona. One pinned workflow package owns both landing-chat journeys and the signed-in command, including translated questions, artwork references and copy. The model owns market sources, country variants, disabled Signal presets and occurrence/ROI definitions. Country follows the saved area; language changes presentation only. Include every pinned feed in the inspected Observe stages. Preserve source candidates, missing permissions and unknown cost. A proposal, publication or RSVP does not prove that families met. Two distinct adult-managed family profiles and the configured school delivery evidence determine the outcome; corrections can withdraw confirmation. Author the contextual team for authenticated human review; local definitions and mock tests cannot manufacture confirmation or activate feeds, Signals, publication or external effects.
