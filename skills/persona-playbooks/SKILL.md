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
