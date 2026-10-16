---
name: persona-playbooks
description: Connect Gabriel Persona playbooks to Signals, pinned Data Feeds, ontology validation, reviewed persistence and outcome evidence. Use when authoring or replaying a domain workflow, while distinguishing portable definitions from captured Canvas runtime state.
---

# Persona playbooks

Read [the framework contract](references/persona-framework.md), existing command
definitions and the actual execution surface. A playbook prepares a repeatable
domain decision; it does not grant new tool, workspace or payment authority.

Keep three forms distinct: an authored operator workflow in its bound child
`assets/workflow.json`; a pipeline transition using that workflow with existing
guard/persistence contracts; and a captured Canvas playbook with runtime identity,
parameter contract and pinned definition version. Do not invent an
`assets/playbooks.json` import format or commit run/approval/output snapshots.

Choose the authorized source, pin its Data Feed revision, validate its returned
JSON/ontology and review the output. A separate approved mapping writes to the
declared portable List/pipeline target using existing mutation APIs. Preserve
saved output and semantic context on retries. Uncertain external mutations need
recovery review; a dynamic replay does not carry an old exact-effect approval
onto a changed plan.

Gateway supports `gabriel_list_canvas_playbooks`, `gabriel_get_canvas_playbook`,
`gabriel_upsert_canvas_playbook` and `gabriel_run_canvas_playbook` for authorized
managed personas. Authored Canvas DAGs use a stable `resourceKey`, sequential
chunks and `approvalPolicy: "every_stage"`. Data Feed chunks declare
`executionDefinition.executionType: "data_feed"`; persistence chunks use
`executionType: "list_mapping"`. Both require reviewer-visible inputs, source
pins, `requiresApproval: true` and `autoApprove: false`.

Persona-bound MCP uses enabled `persona_list_commands`/`persona_run_command`,
or the Coach's curated command/app-action tools. Discover current schemas and
allowed actions; do not promise a persona-wide authoring tool to a runner key.
Saving a definition is not a completed execution or realized ROI.

Capture the signal/source evidence, ontology selection, reviewed plan, approval,
execution receipt and committed outcome as one trace. Accepted/withdrawn outcomes
feed `roiMonitoring`; provider usage and failed work remain part of attributed
cost. Put Playbooks in the standard sidebar and keep human approvals visible.
Use `workflow-builder`, `team-agents` or `pipeline-builder` for the actual
authoring primitive, and candidate/functional evaluations before activation.


## Required playbook team protocol

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, Process Reviewer, Governance Agent, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Each playbook has a versioned rulebook of stable-ID obligations and prohibitions. The Governance Agent checks every applicable rule at configured review gates and records its verdict with concrete evidence; missing or uncertain checks require human resolution. Rulebook instructions are semantic checks, not permission grants. Capability envelopes, resource access and exact-effect human approvals remain enforced at server boundaries. The Auditor owns usage and cost reconciliation, not compliance decisions. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.


### Finalization and review evidence

Task outputs may declare `output.ontology` projections and `recordOutputs` mappings. Each mapping uses JSON pointers, an existing List/pipeline resource key and a permitted create/update/delete operation. Map actual accepted values; updates/deletes require an observed runtime record ID. The server prepares encrypted intents and commits them only after final judging through existing authorization and exact-effect approval. Native action steps retain their original action-boundary controls. Do not claim a generated draft has been persisted or economically accepted.

Coordinator-directed revisions preserve the reviewed goal and capability envelope. Rejected drafts, accepted versions and source provenance remain auditable. The memory steward selects bounded facts/decisions/lessons from accepted evidence; server-copied values retain artifact/version references. Reuse requires finalized successful work with compatible actor/workspace/team/ontology semantics. Quality exceptions retain history without promoting new facts. Use the authenticated run UI to inspect saved evidence, provide human scores and reasons for every criterion, and review improvement drafts. Mock suites are not human reference results. Feedback drafts require renewed confirmation; persistence, accounting and authority failures cannot be waived as quality exceptions.

Real navigation and transformations require owned work products. An opaque capability that cannot enforce individual effect boundaries blocks confirmation with `TEAM_CAPABILITY_GOVERNANCE_REQUIRED`; replace it with governed tools rather than approving around the restriction.

For a family activity or school-workshop flagship, read [the community activity loop contract](../persona-framework/references/community-activity-loop.md). It covers shared guided state, scoped refreshable feeds, opt-in Signals, reviewed team execution and adult-confirmed occurrence ROI.
