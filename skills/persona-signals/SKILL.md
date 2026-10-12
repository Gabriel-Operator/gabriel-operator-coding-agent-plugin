---
name: persona-signals
description: Define explainable, disabled Signal presets for a Gabriel Persona and connect their conditions to ontology-backed records and declared playbooks. Use for authored monitoring and runner activation boundaries, not for automatically enabling schedules or approving effects.
---

# Persona Signals

Read [the operating contract](references/persona-framework.md), the actual List
columns, declared Chat App actions and ontology. Start from a domain event worth
reviewing, the evidence that explains it, and the permitted response.

Author up to 50 `signalPresets` on a Chat App data point with `source: "workspace"`
and `provider: "automations"`. Each preset has stable `id`/`title`, optional
`description`, `sourceListRef: {kind: "list", resourceKey}`, a declared command
`actionId`, and optional `configuration`. Mirror the complete Chat App exactly
between `assets/chat-app.json` and `publishedConfig.chatApp`.

Configuration declares `events` (`create`, `update`, `delete`), `watchedFields`,
`evaluationScope` (`record` or `filtered_count`), optional cadence, a condition
with `and`/`or` clauses, `refreshSteps`, `actionSteps`, and optional ontology
projection. Clauses use real field keys and supported comparisons. Steps name
declared command actions, saved/request-at-run inputs and approval boundaries;
they do not embed runtime action or List IDs. Use the shared Chat App validator.

Presets are disabled starter definitions. The runner opens, configures, saves
and explicitly enables a runtime Signal. Keep enabled state, checks, event
history, schedules, credentials and account data outside Git. A triggered
condition is evidence for a proposal, never approval for its external effects.

Capture prior/current/diff evidence, selected semantic revision, the condition
result and playbook/run identity. Respect pause/revocation and deduplicate event
delivery. Any refresh or action uses the existing execution and human-review
controls. Feedback can suggest a revised threshold; applying it is a separate
authorized edit, not an automatic consequence of ROI.

Use Gateway `gabriel_update_twin_config` to revision-check authored config;
the ordinary Signals UI and published app actions manage runner checks.
Persona MCP can inspect declared automations via `persona_coach_get_app` and
`persona_coach_query_app` when the Coach and app-read capability are enabled.
Only declared, authorized app actions may change them. The contextual ontology
view uses `resourceType: "signal"`; never fabricate observed coverage from a
preset's title. Signals/routines/schedules belong in the established Signals
sidebar destination, not duplicate Home tabs.
