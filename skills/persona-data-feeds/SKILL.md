---
name: persona-data-feeds
description: Author and inspect Gabriel Persona Data Feed catalogs, source workflows, acquisition contracts and ontology projections. Use for versioned feed definitions and their connection to consuming playbooks, not for bypassing execution grants or migrating runtime rows.
---

# Persona Data Feeds

Read the existing parent ontology, source registry, feed catalog and consuming
playbook first. Follow [the framework contract](references/persona-framework.md)
and the detailed [feed definition contract](references/definition.md).

Portable catalogs use `assets/data-feeds/catalog.json`, schema version 1 and up
to 50 unique `workflow.*` resource keys. Each entry names its `definition` and
`workflow` JSON assets under `assets/data-feeds/`. The workflow asset uses
schema version 2, the matching resource key and `structure`. Set the parent
`publishedConfig.dataFeedCatalog` to the catalog path. Country/language variants
can refer to additional definition/workflow/copy assets; account targeting and
credentials stay outside the portable bundle.

Choose one operation (`create`, `read`, `update`, `delete`), exact JSON schemas
and service hostnames. The generic types are email, file, transaction, calendar,
message, portal and source. Acquisition modes describe on-demand, push, pull,
watch, scheduled, event-driven, user-requested or device-captured observations;
the consuming playbook owns triggers, consent, checkpoints and repeated runs.

Declare credential slot descriptors only. Runtime Mobile Guardians/grants
supply secrets for the authorized actor, domain, feed revision and playbook.
Public skeleton adoption creates a private pinned revision and strips author
audience targeting. Country/language are presentation/source choices, never
an identity override. Wire keys and ontology IDs remain stable in translation.

The feed returns validated JSON. Use an optional `ontology` projection and
read-only `ontologyUsage` declarations against the parent's selected contract.
Persistence is a separate approved `map_json_to_list`/`list_mapping` stage.
Retain origin, observation identity and saved output on retries; never rerun
an uncertain source mutation just to rebuild a downstream List.

Source feeds return `Source` candidates through the same primitive. A reviewed
mapping registers/evaluates sources in an existing List. An approved source
registry supplies future acquisition; discovery alone does not activate one.

Use `gabriel_list_persona_data_feeds`/`gabriel_get_persona_data_feed`, or the
persona-bound `persona_list_data_feeds`/`persona_get_data_feed`, for already
registered metadata and exact revision contracts. These reads do not import,
adopt, invoke or enable feeds. Authoring/adoption uses the existing authorized
Data Feed REST editor flow. Invocation authority is minted inside a running
playbook, never from these catalog reads.

For source execution stages, load `action-data-feed` and `action-list-mapping`
through `workflow-builder`. Validate the portable bundle, workflow restrictions,
schemas and ontology together, then run isolated candidate evaluations before
activation. Report fixture tests separately from actual provider/Guardian and
source-side effect verification.


## Required playbook team protocol

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, reviewer, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.


### Finalization and review evidence

Task outputs may declare `output.ontology` projections and `recordOutputs` mappings. Each mapping uses JSON pointers, an existing List/pipeline resource key and a permitted create/update/delete operation. Map actual accepted values; updates/deletes require an observed runtime record ID. The server prepares encrypted intents and commits them only after final judging through existing authorization and exact-effect approval. Native action steps retain their original action-boundary controls. Do not claim a generated draft has been persisted or economically accepted.

Coordinator-directed revisions preserve the reviewed goal and capability envelope. Rejected drafts, accepted versions and source provenance remain auditable. The memory steward selects bounded facts/decisions/lessons from accepted evidence; server-copied values retain artifact/version references. Reuse requires finalized successful work with compatible actor/workspace/team/ontology semantics. Quality exceptions retain history without promoting new facts. Use the authenticated run UI to inspect saved evidence, provide human scores and reasons for every criterion, and review improvement drafts. Mock suites are not human reference results. Feedback drafts require renewed confirmation; persistence, accounting and authority failures cannot be waived as quality exceptions.

Real navigation and transformations require owned work products. An opaque capability that cannot enforce individual effect boundaries blocks confirmation with `TEAM_CAPABILITY_GOVERNANCE_REQUIRED`; replace it with governed tools rather than approving around the restriction.

For a family activity or school-workshop flagship, read [the community activity loop contract](../persona-framework/references/community-activity-loop.md). It covers shared guided state, scoped refreshable feeds, opt-in Signals, reviewed team execution and adult-confirmed occurrence ROI.
