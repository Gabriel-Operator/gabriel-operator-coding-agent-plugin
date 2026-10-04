---
name: persona-ontology
description: Define or update a Persona's entities, attributes, and relationships in its app-level assets/ontology.json, and reference that semantic contract from Data Feeds or playbook mappings without migrating runtime data.
metadata:
  author: gabriel-operator
  version: "1.1"
---

# Persona ontology

Edit **`assets/ontology.json` in the parent Persona app repo**. Each Persona owns one contract shared across countries, languages, subscribers, Signals, playbooks, state machines, queries, and UI. A child workflow, List, or Pipeline repo may reference types but does not own another ontology.

Read [the contract and mapping example](references/contract.md) before changing a definition. Use [the JSON schema](references/ontology.schema.json) for editor validation. The bundled validator additionally checks relationship endpoints, unique identifiers, cardinality, and field references:

```bash
node /path/to/persona-ontology/scripts/validate-ontology.cjs assets/ontology.json
node /path/to/persona-ontology/scripts/validate-ontology.cjs assets/ontology.json assets/data-feeds/example.definition.json
```

Preserve existing type, attribute, relationship, and resource identifiers unless the requested change deliberately breaks the contract. Increment `version` when semantics change; increment the major version for incompatible changes. Set `status: "defined"` only after the author has supplied the domain semantics. Empty placeholders are valid; do not invent domain attributes to fill them.

Definitions contain no actual people, row IDs, user IDs, credentials, grants, runs, or instance snapshots. Leave existing JSON/List/Mongo storage and state-machine mutation rules intact. New objects may optionally use `entityType`, `attributes`, and `relations`; existing rows require no migration. Refer to the parent's ontology using the logical entity/attribute identifiers, never a subscriber's runtime IDs.

Data Feed `ontology` references describe how returned JSON projects onto entity attributes. Data Feeds still return JSON without persistence. A separate authorized playbook mapping chooses the List and invokes existing mutation paths. Country/language/personalization may alter source workflows and display terminology, while entity and wire-field identifiers stay stable.

After edits, validate every affected feed reference and the Persona's existing checks. Immutable saved feed revisions pin the parent ontology's Git revision; deliberately save a new feed revision to adopt a changed contract. The runtime loader lives in `server/src/services/persona-ontology/persona-ontology.service.ts`; programmatic discovery and a future authorized storage adapter live in `persona-ontology-query.ts`. Query execution, automatic Signals, and mutation validation remain future extensions.

The contextual viewer is implemented across Data Feeds, Signals, and Playbooks. Read [contextual view declarations and evidence](references/contextual-views.md) when adding mappings or explaining a run. Reuse `OntologyViewer` and the authorized `/chat-app/ontology/view` endpoint. The Persona publishing editor can update the owner’s Git-backed contract with a version increase and current-head check; consumer chat views are read-only. Never fabricate coverage from a resource name, infer historical changes from current values, or add instance data to the contract just to make the graph look populated.
