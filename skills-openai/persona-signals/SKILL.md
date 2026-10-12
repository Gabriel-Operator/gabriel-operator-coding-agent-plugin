---
name: persona-signals
description: Draft disabled Persona Signal presets that explain domain changes through List fields, ontology projections and declared playbook actions.
---

# Persona Signals

Work in the user-selected local model repository. Author definitions and synthetic
examples for review; preserve existing IDs and unknown fields. Do not request or
store credentials, import participant rows, call remote APIs, enable runtime
monitoring, execute playbooks, publish or deploy. Runtime activation belongs to
Gabriel Operator or separately authorized live tooling after review.

Read [the operating framework](references/persona-framework.md). Inspect actual
List fields, ontology and declared actions before defining a condition. Draft
`signalPresets` only on a Chat App workspace automations data point, and mirror
`assets/chat-app.json` exactly into `publishedConfig.chatApp`. Presets use stable
id/title, optional portable sourceListRef, declared command actionId and optional
configuration: events, watchedFields, record/filtered_count evaluationScope,
condition clauses, refreshSteps/actionSteps and optional ontology projection.

Every preset starts disabled; saving an authored definition does not activate a
runner check or schedule. Record the intended evidence and approval boundary.
A condition can prepare a playbook; it cannot approve payment, introductions or
other effects. Runtime observations, enabled state and history stay outside Git.
