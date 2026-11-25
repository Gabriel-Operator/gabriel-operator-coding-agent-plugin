# Configure and verify Studio runs

Open **Try with Agents** on the team and connect to the workspace MCP URL shown there. Use OAuth or the workspace access key as the Bearer credential. Call `app_studio_team_manager_skill`, discover `tools/list`, then call `app_studio_list_teams` and `app_studio_get_team`. Confirm the workspace, team, team revision and Canvas placement ID (`botId`). Pass `teamId` to every team tool on the workspace connection. An older team-specific endpoint can infer its team.

## Set the execution model

1. Call `app_studio_playbook_runtime` with `teamId` and `botId`. Read the execution mode, declared targets, current selection, readiness and `bindingOptions`. A target can be declared in the playbook and still lack a compatible, verified connection. If the playbook revision does not declare the requested framework, preview and review a compatible definition revision before binding it.
2. For a provider runtime, use the target and connection from `bindingOptions` with `app_studio_provider_models`. The catalog is specific to the connection, framework and execution mode. Add or repair personal provider connections in **Profile settings → Models and accounts → Playbook provider connections** or from the playbook model editor on the Canvas. Verify the connection and read the catalog again.
3. Use `app_studio_set_playbook_runtime` with `teamId`, `botId`, `target`, `connectionId`, `model`, `expectedTeamRevision` and `expectedConnectionRevision`. Use the provider model ID exactly as returned. Supply the team revision from the runtime inspection and the connection revision from the chosen binding option. For Gabriel Default, use target `gabriel` and omit the provider connection, its revision and the model. If the playbook already uses Gabriel Default, go directly to its model preference.
4. For **Gabriel Harness → Default**, call `app_studio_model_accounts` with the placement. Pass `connectionId` to read that account's catalog. Save a future-run preference using `app_studio_set_model` with `selection: {"mode":"account","connectionId":"…","modelId":"…"}` and the playbook preference's `expectedRevision` if present. `{"mode":"inherit"}` inherits the account defaults. `{"mode":"persona"}` uses the persona model. The runtime binding and the Gabriel Default account preference are separate selections.

Use the IDs exposed for your playbook. Examples include `gabriel` (Gabriel Default), `openai-sdk`, `claude-sdk`, `google-adk` and `cursor-sdk` (frameworks run through Gabriel), plus `openai-hosted`, `claude-managed` and `gemini-hosted` (provider-hosted runtimes). Provider catalogs and supported execution modes can differ across targets. For example, select GPT-6.1 Sol on the requested OpenAI path only when its catalog lists `gpt-6.1-sol`.

For an `approval_required` response, have the signed-in requester open **Coach → Waiting for your approval** in the same workspace and review **Exact request**. After they approve, repeat the same input with the returned `approvalId`. A changed selection, request identity or revision needs a fresh review. Read back the saved selection. It applies to future runs.

## Execution modes and output mappings

Open a placed playbook’s model section on the Canvas, then **Edit playbook model and connection**. **Edit execution mode and output** previews a definition revision before saving. Text and Isolated sandbox can return one text field or keep named results. Realtime voice supplies live audio in team calls. Separate workflow steps can return image, video, or audio assets. Decision returns a typed answer for new revisions. Yes/no becomes true at a probability of at least 0.5, a choice returns the selected label, and a rubric returns a numeric score. Existing Decision definitions can keep their answer record.

Under **Step models and handoffs**, choose from the verified provider’s compatible catalog for each authored reasoning step. The main model is the default and still handles reviews. A step that calls a registered playbook uses the called playbook’s own binding. Installed media workflows show their persona model slots. Their image and video settings come from Edit Persona.

A structured playbook can export fields from accepted steps, for example `finalOutputMappings: { "brief": "/steps/research/summary" }`. Each key must be a declared output. Without mappings the last authored step supplies the result. A called playbook’s `inputMappings` can connect an accepted result to its input, for example `{ "brief": "/steps/research/brief" }`. Inspect the final output and input pointers before changing a field other playbooks depend on. The Canvas diagram shows which steps feed final output. The Simulation execution preview shows the authored route without executing it.

MCP exposes the same setup through `app_studio_playbook_runtime`. Read `inputs`, `steps`, `finalOutputMappings`, `stepModels` and `outputContract`. Use `app_studio_register_playbook` to preview and save definition changes with the current revisions. Use `app_studio_set_playbook_runtime` with optional `stepModels` keyed by supported reasoning step IDs and model IDs from the verified catalog. Supply the full step override map when changing it. Omit it to keep the existing overrides for the same runtime and connection, or send `{}` to clear them.

## Start and verify a run

- Read `app_studio_connection_setup` and complete any account or operation mappings first. Use `app_studio_bind_program_connector` with the current assignment revision and the fields the person is willing to share. A personal connector can return data privately while its configured sharing lets only selected fields reach the parent Work goal. Recover the current mapping and preserve all fields, limits and mappings outside the approved change.
- Use `app_studio_run` to start a Work goal. Pass `teamId`, `goal`, `expectedTeamRevision`, `idempotencyKey` and declared `inputs` as strings. Optionally pass `criteria`, `botId` or `allowedBotIds` and `reviewPlan: true`. After Coach approval and the unchanged retry, save `goalId` and `executionId`. Read the proposal with `app_studio_read_plan` and have an authorized person approve it in **Work**.
- For a bounded direct run of a placed Studio playbook, use `app_studio_start_playbook` with `playbookKey`, `expectedTeamRevision`, `input`, `maxCredits`, `maxModelCalls`, `sharedFields` and an `idempotencyKey`. Keep the limits within the team's budget. After Coach approval, repeat the same call with `approvalId`. Use the returned run ID with `app_studio_get_playbook_run`. Source grants and specific effect approvals apply during execution.
- Follow goal progress with `app_studio_read_execution` using `executionId`, or open the goal in Work. Read `outputs` for accepted playbook results released to Work. For your own run, `app_studio_get_playbook_run` returns `output.fields` on completion. Use `kind: "graph"` to inspect the declared package outputs of an installed graph you started. Treat a credit-limit or connection wait as pending work. Resolve the blocker in Studio and continue the same goal when possible. Use the same idempotency key for retries of the same input.
- Use `app_studio_run_history` with an optional `playbookKey` to identify the recorded adapter and model. In Studio, **Activity → Run history** labels the harness and framework. In MCP, the model entry's `target` identifies that runtime. Report a model as actually used only when the row has state `used`. The `attempted` and `pinned` states describe the attempt or configuration. Confirm the result against the stated evidence and completion criteria.

For Lane's Pilot Research, a bounded read-only example is to summarize RFC 2606 with a citation and send no outreach. Supply the saved playbook's declared fields, such as `pilotId`, `idealCustomer`, `offer` and `testProfile` when present. Use the verified public research connection. Review any requested sharing of `brief` or `evidence` before widening it. Check that the accepted parent result contains the expected evidence as well as checking the child run.

For example, pass these arguments to `app_studio_run`. Replace the team, placement and revision with values read from Studio.

```json
{
  "teamId": "TEAM_ID",
  "botId": "LEAD_RESEARCHER_BOT_ID",
  "goal": "Summarize RFC 2606 and cite the source. Send no outreach.",
  "expectedTeamRevision": 1,
  "idempotencyKey": "pilot-rfc2606-001",
  "reviewPlan": true,
  "inputs": {
    "pilotId": "pilot-rfc2606-001",
    "idealCustomer": "A standards organization with public DNS testing documentation.",
    "offer": "A no-charge evaluation of citation coverage. Send no outreach.",
    "testProfile": "https://www.rfc-editor.org/rfc/rfc2606.html"
  }
}
```

## Integrate an application with curl

Call `app_studio_team_sdk` to discover the selected team's catalog and API path. A member with run access in Work opens **SDK** in Studio to create a separate team API key. The key uses the creator’s current team permissions. Each member can list and revoke their own keys. Copy the API URL from that tab and load the key privately in your shell. Keep it separate from the Try with Agents credential. Use the same team API key for all calls that access its runs.

```bash
curl -sS --fail-with-body "$GABRIEL_TEAM_API_URL/catalog" \
  -H "Authorization: Bearer $GABRIEL_TEAM_API_KEY"

# Set GABRIEL_REQUEST_ID to a unique ID for this request.
# Replace the revision, playbook key and input names with your team's values.
curl -sS --fail-with-body "$GABRIEL_TEAM_API_URL/runs" \
  -H "Authorization: Bearer $GABRIEL_TEAM_API_KEY" \
  -H "Idempotency-Key: $GABRIEL_REQUEST_ID" \
  -H "Content-Type: application/json" \
  -d '{"goal":"Summarize the public source with a citation.","expectedTeamRevision":1,"playbookKeys":["PLAYBOOK_KEY"],"inputs":{"source":"https://www.rfc-editor.org/rfc/rfc2606"},"reviewPlan":true}'

# Open data.url in Studio to review the plan. Set GABRIEL_RUN_ID to data.id.
curl -sS --fail-with-body "$GABRIEL_TEAM_API_URL/runs/$GABRIEL_RUN_ID" \
  -H "Authorization: Bearer $GABRIEL_TEAM_API_KEY"
```

Registered playbooks in the catalog include their revision, input fields and named `outputContract`. When present, `executionMode` describes the runtime profile. In the run detail, follow `data.state` and `data.goalState`. Read `data.result` for the completed goal summary and `data.outputs` for the same accepted playbook fields that Work and `app_studio_read_execution` show. Each output entry identifies the execution, assignment and playbook run. Use `fields[].name` to look up a value. Read `fields[].format` for its type and `fields[].source` for its source pointer when known.

```json
{
  "kind": "program",
  "runId": "PLAYBOOK_RUN_ID",
  "executionId": "GOAL_EXECUTION_ID",
  "assignmentId": "ASSIGNMENT_ID",
  "playbookKey": "eligibility",
  "revision": 2,
  "executionMode": "decision",
  "fields": [{ "name": "answer", "format": "boolean", "value": false }]
}
```

Values retain their JSON types, including `false`, zero and empty collections. Media returns the asset value declared by the playbook. Live call audio stays in the call. Only accepted values released to Work are included. A completed playbook with no approved fields has an empty `fields` array. An installed graph can return a receipt with `receiptOnly: true`; its result remains available through the graph run to authorized users.

The events endpoint appends `/events` to the status path and accepts `?after=<eventId>`. To stop a run, POST to its `/cancel` path and verify its status. Key revocation blocks its future requests. A signed-in member with Work access can still follow the goal in Studio.
