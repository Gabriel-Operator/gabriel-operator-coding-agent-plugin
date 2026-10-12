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
