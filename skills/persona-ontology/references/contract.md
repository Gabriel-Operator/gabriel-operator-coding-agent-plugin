# Contract

The canonical parent file is `assets/ontology.json`. It holds definitions only:

The optional `primitives: ["Source"]` imports the platform's stable Source entity into the effective contract. Do not redeclare `Source` locally when imported. `ontologyEntities()` expands primitives programmatically; the parent file retains one manifest with context-selected model variants. Source attributes include identity/name/URL, provider/access method, regions/languages, capabilities/data types, logical connector/authentication slot references, freshness/quality/reliability/coverage, last check, status, and provenance. Instances and per-user Source audiences live only in private registry Lists. See the workflow action's Source registry reference for registration/evaluation policies.

```json
{
  "schemaVersion": 1,
  "resourceKey": "ontology.persona.example",
  "version": "0.1.0",
  "name": "Example ontology",
  "status": "defined",
  "entities": [
    {"type": "Person", "attributes": {"name": {"type": "string", "required": true}}},
    {"type": "Intent", "attributes": {"kind": {"type": "string"}}}
  ],
  "relationships": [
    {"type": "HAS_INTENT", "from": "Person", "to": "Intent", "direction": "directed", "cardinality": {"from": "one", "to": "many"}}
  ]
}
```

Entity `type`, attribute keys, and relationship `type` are stable machine identifiers. Display descriptions may change. Attribute types are string, number, integer, boolean, object, array, date (ISO date), and datetime (ISO date-time). Optional `required`, `nullable`, and scalar `enum` constrain a mapped attribute. Entity attributes are a named object, not a list. Relationship endpoints must be declared types. Direction is `directed` or `undirected`. Optional cardinality describes source/target multiplicity and target bounds; these are semantic metadata, not a new database enforcement layer.

An optional feed or `PlaybookListMapping` reference:

```json
{
  "ontology": {
    "entityType": "Person",
    "ontologyVersion": "0.1.0",
    "recordsPath": "/results",
    "fields": {"name": "/displayName"}
  }
}
```

`recordsPath` selects one object or an array; an empty pointer selects the complete output. `fields` maps ontology attribute names to JSON pointers relative to each selected result. The loader checks the entity and attributes. Output validation checks selected values without changing keys, coercing types, adding an envelope, or writing records. Optional unreturned attributes are allowed; required attributes referenced by the projection must be present. This is not a full entity-instance validator and does not enforce relationships or every required attribute on partial update/delete output.

The **playbook** separately maps returned fields to an authorized List's column keys. References do not imply the List has identical keys, authorize another owner's storage, bypass a Pipeline gate, or migrate old rows. One feed can be consumed by several independent mappings. Existing feeds without `ontology` are backward compatible. A placeholder with empty attributes cannot yet be used as a mapped attribute contract; ask for domain details when those are needed.

For new stored objects, the optional shape is `{ "id": "...", "entityType": "Person", "attributes": {}, "relations": { "HAS_INTENT": ["..."] } }`. Those IDs are runtime data and never belong in the definition file.

See [contextual views](contextual-views.md) for Signal projections, optional playbook/feed dependency metadata, read-only inspection, and historical evidence limits.

For country, audience, language and terminology variants, read [context variants](context-variants.md).
