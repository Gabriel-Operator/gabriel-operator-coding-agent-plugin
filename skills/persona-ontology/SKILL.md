---
name: persona-ontology
description: Define or update a Persona's entities, attributes, and relationships in its app-level assets/ontology.json, and reference that semantic contract from Data Feeds or playbook mappings without migrating runtime data.
metadata:
  author: gabriel-operator
  version: "1.2"
---

# Persona ontology
## Persona operating framework

Read [the source-to-outcome contract](references/persona-framework.md) when
connecting domain evidence and actions. Ontology supplies stable semantics;
Persona Data Feeds acquire validated JSON; Signals explain a change and prepare
declared playbooks; human approvals control effects; accepted outcomes and
attributed cost drive ROI. Keep definitions in model repositories and private
runtime state outside portable Git. Discover `persona-framework`,
`persona-data-feeds`, `persona-signals`, `persona-playbooks`, `persona-ontology`
and `persona-roi` through `gabriel_get_skill_instructions`; load the topics
relevant to the requested work.


Edit **`assets/ontology.json` in the parent Persona app repo**. Each Persona owns one versioned manifest with optional country, audience, language, and terminology variants, shared by Signals, playbooks, state machines and UI. A child workflow, List, or Pipeline repo may reference types but does not own another ontology.

Read [the contract and mapping example](references/contract.md) before changing a definition. Use [the JSON schema](references/ontology.schema.json) for editor validation. The bundled validator additionally checks relationship endpoints, unique identifiers, cardinality, and field references:

```bash
node /path/to/persona-ontology/scripts/validate-ontology.cjs assets/ontology.json
node /path/to/persona-ontology/scripts/validate-ontology.cjs assets/ontology.json assets/data-feeds/example.definition.json
```

Preserve existing type, attribute, relationship, and resource identifiers unless the requested change deliberately breaks the contract. Increment `version` when semantics change; increment the major version for incompatible changes. Set `status: "defined"` only after the author has supplied the domain semantics. Empty placeholders are valid; do not invent domain attributes to fill them.

Definitions contain no entity instances, row IDs, credentials, grants, runs, or instance snapshots. Explicit individual targeting may contain authenticated account IDs; treat that author-only metadata as sensitive. Leave existing JSON/List/Mongo storage and state-machine mutation rules intact. New objects may optionally use `entityType`, `attributes`, and `relations`; existing rows require no migration. Refer to the parent's ontology using the logical entity/attribute identifiers, never a subscriber's runtime IDs.

Data Feed `ontology` references describe how returned JSON projects onto entity attributes. Data Feeds still return JSON without persistence. A separate authorized playbook mapping chooses the List and invokes existing mutation paths. Context may select a replacement semantic model as well as display terminology. Common concepts retain stable identifiers; wire keys and enum values are never translated.

After edits, validate every affected feed reference and the Persona's existing checks. Immutable saved feed revisions pin the parent ontology's Git revision; deliberately save a new feed revision to adopt a changed contract. The runtime loader lives in `server/src/services/persona-ontology/persona-ontology.service.ts`; programmatic discovery and a future authorized storage adapter live in `persona-ontology-query.ts`. Instance query execution remains a future extension. Feed output, downstream mappings and signal evaluations use their captured context-selected model.

The contextual viewer is implemented across Data Feeds, Signals, and Playbooks. Read [contextual view declarations and evidence](references/contextual-views.md) when adding mappings or explaining a run. Reuse `OntologyViewer` and the authorized `/chat-app/ontology/view` endpoint. The Persona publishing editor can update the owner’s Git-backed contract with a version increase and current-head check; consumer chat views are read-only. Never fabricate coverage from a resource name, infer historical changes from current values, or add instance data to the contract just to make the graph look populated.

## Context-aware authoring

Read [context variants and coding-agent operations](references/context-variants.md) before adding targeting, model snapshots, or terminology. Use the shared validator and deterministic preview CLI; do not implement a second matcher in a child repo.

Gateway authoring requires a workspace token with `digital-twin:admin` and persona ownership. Use `gabriel_get_ontology`, then `gabriel_validate_ontology`, `gabriel_preview_ontology`, optional `gabriel_translate_ontology`, and `gabriel_save_ontology` with the returned `expectedHeadSha`. Save creates a Git candidate; use existing workspace validation, isolated candidate evaluation, and publishing to activate it. Read resolved/history views through `gabriel_get_ontology_view` or persona-bound `persona_get_ontology` with `digital-twin:app:read`.

The input/reasoning/output behavior layer, Jev decision integration, and framework registry are parked. Ontology provides semantics and vocabulary; do not add routing authority or framework prompts to this manifest.

## Evidence-backed ROI

For a standard Persona app, include the domain ROI/Impact sidebar destination and connect it to the same landing calculator definitions via `publishedConfig.roiMonitoring`. Read [the ROI algorithm and evidence contract](../chat-app-builder/references/roi-evidence.md) or Gateway topic `persona-roi`: map committed output/List fields to the parent ontology, capture the semantic revision at execution, deduplicate stable identities, preserve acceptance/withdrawal boundaries and measure value with explicit runner baselines or evidenced economic rules. Credits/tokens/top-up funding are distinct; never sum them as one cost or call a budget/row count cash savings. Missing evidence/currency conversion keeps financial ROI unknown. Validate the model and real runner ROI before publication.

ROI/Impact is sidebar-only. Use canonical `agents` (existing Kai `grocery-agents`) metadata as the standalone target; never display an ROI tab beside Meet/Coach.


## Required playbook team protocol

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, reviewer, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.


### Finalization and review evidence

Task outputs may declare `output.ontology` projections and `recordOutputs` mappings. Each mapping uses JSON pointers, an existing List/pipeline resource key and a permitted create/update/delete operation. Map actual accepted values; updates/deletes require an observed runtime record ID. The server prepares encrypted intents and commits them only after final judging through existing authorization and exact-effect approval. Native action steps retain their original action-boundary controls. Do not claim a generated draft has been persisted or economically accepted.

Coordinator-directed revisions preserve the reviewed goal and capability envelope. Rejected drafts, accepted versions and source provenance remain auditable. The memory steward selects bounded facts/decisions/lessons from accepted evidence; server-copied values retain artifact/version references. Reuse requires finalized successful work with compatible actor/workspace/team/ontology semantics. Quality exceptions retain history without promoting new facts. Use the authenticated run UI to inspect saved evidence, provide human scores and reasons for every criterion, and review improvement drafts. Mock suites are not human reference results. Feedback drafts require renewed confirmation; persistence, accounting and authority failures cannot be waived as quality exceptions.

Real navigation and transformations require owned work products. An opaque capability that cannot enforce individual effect boundaries blocks confirmation with `TEAM_CAPABILITY_GOVERNANCE_REQUIRED`; replace it with governed tools rather than approving around the restriction.
