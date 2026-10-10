# Contextual ontology views

The viewer projects **one Persona ontology** through a resource definition or recorded execution. It never executes a workflow or queries every stored entity. Web uses `app/components/persona-ontology/OntologyViewer.tsx`; native Persona apps use `mobile/lib/persona_app/ontology_view.dart`. The shared contract is `ontology-view.ts`, resolved by `server/src/services/persona-ontology/ontology-view.service.ts`. GET `/api/agent-configs/user/pages/:pageId/chat-app/ontology/view` accepts `resourceType`, `view`, optional resource/run/revision identities, and the existing operation/country/language/scope/resource filters. All reads require existing Persona access; runs and evaluation evidence remain user-scoped.

Definitions and evidence are separate:

- Feed `ontology` describes returned JSON's projection. Optional `ontologyUsage` may declare **reads only**; external CRUD is not a local entity mutation.
- Signal `source.ontology` describes watched entity attributes, using JSON pointers to fields on the selected list. Actual condition clauses supply the thresholds. Signal observations and downstream playbook effects remain distinct.
- A playbook step's `listMapping.ontology` declares possible persistence through the existing list/state-machine path. Optional `ontologyUsage` declares semantic dependencies, possible operations, or relationship use. Canvas chunks can store it in `executionDefinition` or existing chunk metadata.

Example **author declaration**, not recorded evidence:

```json
{
  "ontologyUsage": [
    {"entityType": "Person", "operation": "read", "fields": {"name": "/name"}, "relationshipType": "HAS_INTENT"}
  ]
}
```

For playbook steps the supported declarations are `read`, `create`, `update`, `delete`, `link`, and `watches`. Feed declarations allow only `read`. Entity, attribute, and relationship identifiers must exist in the parent's ontology; mapping paths are definition metadata, not storage locations or permission grants. Missing metadata appears as “Mapping not configured.” Do not infer operations from names or prompts.

Recorded activity uses existing execution metadata, not a new audit database. `ontologyFeedEvidence` records acquisition start/completion/failure, logical feed revision, pinned ontology Git revision, step identity, projected entity type, and observation count. `dataFeedMappings` already provides recovery targets and committed row IDs; new entries also capture responsible/source steps, operation, entity type, destination owner, and commit timestamps. Acquisition is labeled “Acquired JSON.” Persistence belongs to the **Playbook list mapping** component. Earlier committed rows remain visible after a later failure. Legacy entries with unknown operations are generic “Record commit,” never invented updates.

Signal checks capture the evaluated source/condition definition, existing previous/current values, and clause results. Historical views consume those snapshots; they do not re-evaluate today's records. A match is separate from a recorded action dispatch. Missing historical inputs, missing definition revisions, uninstrumented reads, and uncaptured before/after values stay explicit. Available immutable feed ontology revisions are loaded; mixed or missing revisions use the current model with a limitation.

Views omit credentials, token-like values, unrestricted raw outputs/logs, and other owners' destination records. Do not weaken backend ownership checks for a graph. Public chat has no save/approve/run controls in the viewer. Ontology changes belong only in the owner publishing area or the Persona repository and follow the existing release flow; they do not rewrite old feed pins or migrate stored data.
