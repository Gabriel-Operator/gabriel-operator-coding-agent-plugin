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
