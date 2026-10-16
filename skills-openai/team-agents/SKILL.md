---
name: team-agents
description: Author review-only Gabriel Page Builder team-agent workflow drafts in assets/team-agent.json and assets/task-orchestration.json. Use when the user explicitly asks to define or revise local nodes, edges, or child-skill mappings. Produces local drafts only and does not deploy, run, authenticate, or invoke endpoints.
---

# Team Agents

Create or update a local Page Builder team-agent endpoint draft for human review.

## Public authoring boundary

- Work only in the repository explicitly selected by the user.
- Edit `assets/team-agent.json` and `assets/task-orchestration.json` only.
- Do not commit, push, publish, deploy, schedule, or run the endpoint.
- Do not call application APIs or include access tokens.
- Do not add credentials, private data, remote scripts, or live connector secrets.
- Do not add browser automation, desktop control, shell execution, or unrestricted tool calls.
- Preserve stable app, endpoint, node, and edge IDs unless the user requests a new draft identity.
- Use only local declarative node and edge metadata. Describe unsupported runtime integrations in the handoff instead of inventing them.

## Canonical files

```text
assets/team-agent.json
assets/task-orchestration.json
```

## Authoring process

1. Read both existing files when present.
2. Preserve `appId`, `endpointId`, endpoint slug, and unknown fields.
3. Keep the start node input contract and final output nodes coherent.
4. Add or revise nodes with stable unique IDs and serializable config only.
5. Wire edges with valid source and target node IDs.
6. Keep `task-orchestration.json` limited to local child-skill references supplied by the user.
7. Validate JSON syntax, unique IDs, and edge references locally.
8. Report changed files and note that deployment and endpoint invocation remain separate user-controlled actions in Gabriel Operator.

Minimal `assets/team-agent.json` shape:

```json
{
  "appId": "app_example",
  "endpointId": "endpoint_example",
  "endpoint": {
    "id": "endpoint_example",
    "slug": "example-endpoint",
    "name": "Example Endpoint",
    "workspace": {
      "nodes": [
        {
          "id": "node_start",
          "type": "start",
          "label": "Start",
          "config": {
            "inputSchema": {
              "type": "object",
              "properties": {}
            }
          }
        },
        {
          "id": "node_output",
          "type": "output",
          "label": "Output",
          "config": {}
        }
      ],
      "edges": [
        {
          "id": "edge_start_output",
          "source": "node_start",
          "target": "node_output"
        }
      ]
    }
  },
  "commitMessage": "Draft team-agent endpoint"
}
```

Minimal `assets/task-orchestration.json` shape:

```json
{
  "schemaVersion": 1,
  "mappings": [],
  "commitMessage": "Draft task orchestration"
}
```


## Command governance and cost handoff

For slash-command authoring, read [command governance and estimated cost](references/command-governance.md). Report warnings and the selected review profile with cost comparisons before handing off the command.


## Required playbook team protocol

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, Process Reviewer, Governance Agent, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Each playbook has a versioned rulebook of stable-ID obligations and prohibitions. The Governance Agent checks every applicable rule at configured review gates and records evidence; missing or uncertain checks require human resolution. Rulebook text cannot grant permissions or replace capability scopes, resource authorization, or exact-effect human approvals enforced by Gabriel's server. The Auditor handles usage and cost, not compliance decisions. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.

When describing a brokered runtime profile in a local draft, `write_bound_record` supports create/update/delete on an approved List/pipeline reference for an `act` task. Draft closed parameters: create uses `{data}`, update uses `{data,recordId}`, delete uses `{recordId}`. It cannot duplicate the task's `recordOutputs` target. Gabriel resolves and validates the private target and awaits exact human approval before dispatch; public previews cannot write. Changed targets, schemas or accepted versions require renewed review. Server receipts retain task/member attribution and verified recovery; a retry cannot replay a completed or uncertain effect. This public authoring skill does not invoke that runtime or manufacture its approvals.
