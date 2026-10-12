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
