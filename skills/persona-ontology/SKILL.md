---
name: persona-ontology
description: Define or update a Persona's entities, attributes, and relationships in its app-level assets/ontology.json, and reference that semantic contract from Data Feeds or playbook mappings without migrating runtime data.
metadata:
  author: gabriel-operator
  version: "1.2"
---

# Persona ontology

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
