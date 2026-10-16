---
name: persona-builder
description: Interview the user and author a local Gabriel AI Persona draft covering page copy, list schema, pipeline stages, optional team-agent graph, review-only workflow, and deterministic requirement/eval specification. Use when the user wants to design a new persona in files they control. Produces local drafts only and does not publish, provision, authenticate, or call remote services.
---

# Persona Builder

## Persona operating framework

Use `persona-framework` to connect the domain's ontology, Data Feeds, disabled
Signals, reviewed playbooks and ROI definitions. The specialist skills in this
package cover those draft contracts. Read
[the shared operating contract](references/persona-framework.md) before adding
connections. Keep source provenance, semantic identity, approval boundary and
accepted outcome measurable; optional capabilities remain explicit when not
configured. Append the catalog/ontology/monitoring draft files relevant to the
confirmed requirements rather than inventing live providers or realized ROI.

When a requested draft includes a landing page or prototype, put all persona
copy, subtitles, artwork references, sample activities, form options and initiation
prompts in its model definitions. Platform templates supply layout and interactions;
do not propose hard-coded English or a platform persona-defaults dictionary.
Distinguish the portrait used by AI preview headings from the brand logo. Include
both audience tabs, mobile menus, confirmation/error states and stable option IDs
in the translation handoff. Live generation and publishing still require the
authorized live builder workflow; this review pack remains draft-only.

For workspace-enabled prototypes, distinguish the mandatory workspace metadata step from optional personal questions and from provisioning status. Draft owner Retry and automatic recovery after setup reaches ready. Opening a page must not provision runner Git or show its setup dialog; that belongs to explicit AI Resources actions or actual command preflight.

Design one Gabriel AI Persona as local draft files for human review.

This public skill covers the same draft files as `digital-twin-page`,
`list-builder`, `pipeline-builder`, and `team-agents`. It does not create live
Gabriel resources. Live create, git bind, and publish stay in Gabriel Operator
after the user reviews these files.

## Public authoring boundary

- Work only in the repository the user explicitly selects.
- Write local draft files only. Do not commit, push, publish, deploy, or run.
- Do not request, infer, copy, or store passwords, API keys, access tokens, cookies, or session data.
- Do not call remote APIs, open Gabriel Operator in a browser, or sync live records.
- Do not add real personal, confidential, financial, or authentication data.
- Use placeholder ids such as `page_example`. Do not invent production database ids.
- If the user asks to provision, publish, or authenticate, refuse and point them to Gabriel Operator.

## Interview

Collect, propose, confirm, then write files. Do not dump empty JSON and stop.

1. Ask what the persona does if the user did not already describe it.
2. Extract explicit requirements and unresolved acceptance questions. Propose a title, short description, visibility (`private` default), list columns, pipeline stages, whether a team-agent graph or a review-only workflow is needed, and what deterministic evidence would prove the confirmed behavior. Never invent acceptance criteria.
3. Confirm the proposal.
4. Write the files below.
5. Summarize the files changed and note that live create/publish is a separate user action.

## Canonical files

```text
assets/chat-config.json
assets/list.json
assets/pipeline.json
assets/team-agent.json
assets/task-orchestration.json
assets/workflow.json
assets/persona-evals.json
```

Write `chat-config.json`, `list.json`, and `pipeline.json` for every new persona.
Write team-agent and workflow files only when the confirmed proposal includes them.
Preserve unknown fields and stable ids when a file already exists.

`persona-evals.json` remains a local review draft in this skill. It does not run tests or authorize publication.

## Page copy (`assets/chat-config.json`)

Supported fields only: `pageProfile.title`, `pageProfile.description`,
`pageProfile.longDescription`, `pageProfile.profilePicture`,
`pageProfile.bannerImage`, `pageProfile.bannerType`, `pageProfile.tags`,
`pageProfile.category`, `pageProfile.subcategory`, `publishedConfig.name`,
`publishedConfig.firstMessage`, `publishedConfig.systemPrompt`.

Keep conversational instructions clear and non-deceptive. Do not claim tools,
connectors, or live data this draft cannot provide.

```json
{
  "schemaVersion": 1,
  "pageId": "page_example",
  "publishedConfig": {
    "name": "Assistant",
    "firstMessage": "How can I help?",
    "systemPrompt": "Answer using the material supplied by the user."
  },
  "pageProfile": {
    "title": "Assistant",
    "description": "A helpful digital twin",
    "tags": []
  },
  "updatedAt": 0
}
```

## List schema (`assets/list.json`)

Edit schema only. Do not import or write live records. Column types: `text`,
`number`, `boolean`, `date`, `select`. Use `options` only on `select` columns.

Additional lists, if requested, go in `assets/lists/<slug>.json` with the same shape.

```json
{
  "schemaVersion": 1,
  "listId": "list_example",
  "list": {
    "id": "list_example",
    "name": "Example List",
    "description": "Review-only list schema",
    "collectionId": "collection_example",
    "columns": [
      {
        "key": "title",
        "label": "Title",
        "type": "text",
        "required": true
      }
    ]
  },
  "commitMessage": "Draft list schema"
}
```

## Pipeline (`assets/pipeline.json`)

One pipeline is one state-machine draft. Stages are metadata. Transitions are
allowed moves. Do not run the machine or modify live records.

```json
{
  "schemaVersion": 1,
  "pageId": "page_example",
  "pipelineId": "pipe_example",
  "pipeline": {
    "id": "pipe_example",
    "pageId": "page_example",
    "name": "Example Pipeline",
    "collectionId": "collection_example",
    "columns": [
      {
        "id": "col_title",
        "key": "title",
        "label": "Title",
        "type": "text",
        "required": true,
        "order": 1
      }
    ],
    "stages": [
      {
        "id": "stage_new",
        "name": "New",
        "type": "start",
        "description": "Initial stage"
      },
      {
        "id": "stage_done",
        "name": "Done",
        "type": "end",
        "description": "Completed stage"
      }
    ],
    "transitions": [
      {
        "id": "tr_start_to_done",
        "name": "Complete",
        "fromStageId": "stage_new",
        "toStageId": "stage_done",
        "trigger": "manual"
      }
    ]
  },
  "taskIds": [],
  "commitMessage": "Draft pipeline definition"
}
```

## Team agent (optional)

Edit `assets/team-agent.json` and `assets/task-orchestration.json` only.
Use declarative local nodes and edges. Do not add browser automation, desktop
control, shell execution, credentials, or live connector secrets.

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

```json
{
  "schemaVersion": 1,
  "mappings": [],
  "commitMessage": "Draft task orchestration"
}
```

## Workflow (optional)

Edit `assets/workflow.json` only. Supported review-only steps: `navigate`
(with `disableBrowser: true` and empty `url`), `wait`, `llm`, `confirmation`,
`api_output`. If the user needs any other action, describe it in the handoff
instead of adding it.

Keep every step field at the step root. Give each step a unique `stepId` and
sequential `step_number`.

## Quality specification (`assets/persona-evals.json`)

Map each owner-confirmed requirement to typed implementation locators and reciprocal scenario ids. Include golden, incomplete-input, adversarial, approval, and rejection cases. Use deterministic assertion types for outputs, decisions, forbidden tools, list fields, pipeline stages, artifacts, and external side-effect boundaries. A subjective `rubric` may be advisory only.

Connector fixtures must contain fictional deterministic outputs. They are test data, not credentials, and this public skill never dispatches them. Preserve explicit safety boundaries from the brief, such as “draft but never send,” “propose but never book,” and “never pay/change/delete without approval.”

```json
{
  "schemaVersion": 1,
  "requirements": [{
    "id": "example-outcome",
    "category": "command_outcome",
    "description": "The command returns the confirmed result.",
    "implementedBy": [{ "kind": "command", "resourceRef": "command.example" }],
    "verifiedBy": ["example-golden", "example-adversarial"]
  }],
  "suites": [{
    "id": "production-readiness",
    "requiredForProduction": true,
    "mode": "mock",
    "cases": []
  }]
}
```

## Finish

Validate JSON syntax, unique ids, and transition/edge references locally.
Report the files changed. Tell the user these are drafts until they create and
publish the persona in Gabriel Operator.

## Live create in Gabriel Operator

This review pack does not collect tokens or call Gateway. For a live persona:

1. Sign up at https://gabrieloperator.com/signup
2. Open **Workspace → Dashboard** and copy a Gabi token from the **Gateway API key** pill
3. Connect GitHub on the same account
4. Connect that token to ChatGPT/Codex MCP (`Authorization: Bearer gabi_…`) or `GABRIEL_TOKEN`
5. Use the live Persona Builder pack, not this local-draft skill

Live audio generation is text-to-speech. Music generation is a separate text-to-music capability on the Capabilities and pipeline step, next to Audio generation. Its provider list is Lyria, Suno, ElevenLabs Music, Beatoven, and Apiframe Music, stored as chatCommandSettings.music and chatCommandModels.music. Course narration uses the speech provider.

Do not request, store, or use the token inside this skill.

## UI fallback for live configure

If the user needs a live setting this pack cannot draft in files (Composio keys,
Arcade/Nango/Scalekit, GitHub connect, voice BYOK), send them to the UI after a
real page exists. Do not collect those secrets here.

Personal workspace (same destination as **Configure** on the persona page):

https://gabrieloperator.com/workspace/edit-persona/{pageId}

- Composio keys: `?tab=simulated-world` then expand **MCP connectors**. Add the key, Save, enable toolkits. Do not ask them to Connect Gmail/Sheets on Edit Persona.
- Runner OAuth: from the persona chat click **Connect** / **Connected**, or open https://gabrieloperator.com/workspace/ai-resources?pageId={pageId}. On **Connected toolkits**, click Connect on each card. Canvas then uses those connections. They can also Connect when Canvas asks. Screenshot: https://gabrieloperator.com/assets/docs/ai-resources-connected-toolkits.jpg
- GitHub: https://gabrieloperator.com/workspace/developer-settings

Give the full URL. Name the tab and the control.

## Authenticated Persona app draft

Draft the signed-in app as `assets/chat-app.json` (schema version 3, `runtimeDataPolicy: definitions_only`) and mirror the same object in `publishedConfig.chatApp` with its stable `chatAppRef`. Home’s first/default `coach` tab is Meet Persona: an `assistant-panel` backed by a named workspace/coach data point, review-only coach settings, read-only evidence and optional goals. Put only domain records/results/decisions in Home tabs. Playbooks belongs in the sidebar, milestones/goals in the Coach control, and routines/Signals/Schedule in Signals. Never duplicate any of those utility managers as Home tabs or panels. The primary sidebar is Home, named chat history/playbooks, Signals, Data Feed and Media. Avoid extra top-level Coach, Goals, Connections, To-Dos, Canvas or Mobile destinations unless requested. Preserve the theme, avatar, locale, human approvals and existing sessions; never use public sample runs as private records. Guided commands use a stepper experience and real declared commands. Validate the JSON, references and exact mirror locally. List the Home/Coach/sidebar checks for the user’s later live verification. This remains a local draft: do not authenticate, invoke Gateway, provision, run or publish it from this public skill.

## Drafting ROI mappings

Include a standalone domain ROI/Impact sidebar destination in a signed-in Persona design and link its monitoring profile to the public calculator. Map committed List/workflow fields to parent ontology attributes, declare accepted outcomes and stable identities, and record evidence/provenance requirements. Use explicit user time baselines or separately evidenced monetary amounts. Tokens and credits are usage; top-ups are funding and must not be counted again as consumption. Missing evidence, prices or currency conversion leaves financial ROI unknown. Use Gateway topic `persona-roi` for the maintained algorithm when an authorized coding environment is available. This skill remains draft-only; it does not authorize accessing private records, executing workflows or publishing.

Draft a single Signals panel with inner Signals/Planning controls, without duplicate outer Signals/Routines tabs. Use the persona portrait as the Meet/Coach tab prefix.

ROI/Impact is sidebar-only. Use canonical `agents` (existing Kai `grocery-agents`) metadata as the standalone target; never display an ROI tab beside Meet/Coach.

ROI setup places one optional planning baseline below its title, ahead of the metric cards: use a slim themed collapsible, concise single-line labels with full question help, aligned controls and explicit saving. Never duplicate it below the charts. Default to collapsed, preview the same editable values on the right, and mark unsaved drafts clearly.


## Persona workspace instances

Read [Persona Workspaces](references/persona-workspaces.md) or fetch gateway topic `persona-workspaces` for switching, sharing and subscriber editing. A workspace is an instance of the existing persona, not a new public persona, business company or harness workspace. Use `personaWorkspaceId` throughout data, immutable execution authority, tokens/credits, ontology-backed ROI and agent keys. Owners manage definitions/team within author policy; Members operate shared records/playbooks using owner access and credits. Private Coach/profile/memory and credentials remain per actor. Invitations join an existing workspace and create no personal workspace or branches.

For workspace changes, follow the [workspace validation and frontend packaging contract](references/persona-workspaces.md#validation): run the disposable Lane browser/API test in the platform checkout, verify both Docker frontend input lists for imported shared contracts, and distinguish local fixture coverage from real invitation delivery, account registration and model generation.


## Command governance and cost handoff

For slash-command authoring, read [command governance and estimated cost](references/command-governance.md). Report warnings and the selected review profile with cost comparisons before handing off the command.


## Required playbook team protocol

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, reviewer, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.


## Shared community activity flagship

Read [the community activity loop contract](../persona-framework/references/community-activity-loop.md) when authoring a family-activity or school-workshop persona. One pinned workflow package owns both landing-chat journeys and the signed-in command, including translated questions, artwork references and copy. The model owns market sources, country variants, disabled Signal presets and occurrence/ROI definitions. Country follows the saved area; language changes presentation only. Include every pinned feed in the inspected Observe stages. Preserve source candidates, missing permissions and unknown cost. A proposal, publication or RSVP does not prove that families met. Two distinct adult-managed family profiles and the configured school delivery evidence determine the outcome; corrections can withdraw confirmation. Author the contextual team for authenticated human review; local definitions and mock tests cannot manufacture confirmation or activate feeds, Signals, publication or external effects.
