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
