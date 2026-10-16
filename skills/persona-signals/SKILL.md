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


## Required playbook team protocol

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, reviewer, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.


### Finalization and review evidence

Task outputs may declare `output.ontology` projections and `recordOutputs` mappings. Each mapping uses JSON pointers, an existing List/pipeline resource key and a permitted create/update/delete operation. Map actual accepted values; updates/deletes require an observed runtime record ID. The server prepares encrypted intents and commits them only after final judging through existing authorization and exact-effect approval. Native action steps retain their original action-boundary controls. Do not claim a generated draft has been persisted or economically accepted.

Coordinator-directed revisions preserve the reviewed goal and capability envelope. Rejected drafts, accepted versions and source provenance remain auditable. The memory steward selects bounded facts/decisions/lessons from accepted evidence; server-copied values retain artifact/version references. Reuse requires finalized successful work with compatible actor/workspace/team/ontology semantics. Quality exceptions retain history without promoting new facts. Use the authenticated run UI to inspect saved evidence, provide human scores and reasons for every criterion, and review improvement drafts. Mock suites are not human reference results. Feedback drafts require renewed confirmation; persistence, accounting and authority failures cannot be waived as quality exceptions.

Real navigation and transformations require owned work products. An opaque capability that cannot enforce individual effect boundaries blocks confirmation with `TEAM_CAPABILITY_GOVERNANCE_REQUIRED`; replace it with governed tools rather than approving around the restriction.

For a family activity or school-workshop flagship, read [the community activity loop contract](../persona-framework/references/community-activity-loop.md). It covers shared guided state, scoped refreshable feeds, opt-in Signals, reviewed team execution and adult-confirmed occurrence ROI.
