---
name: digital-twin-page
description: Author review-only Gabriel digital-twin page profile and conversational copy in assets/chat-config.json. Use when the user explicitly asks to update local titles, descriptions, imagery references, first messages, or system instructions. Does not publish, connect services, configure credentials, or run the twin.
---

# Digital Twin Page

Persona presentation copy is owned by its model: header subtitles, audience tabs,
prototype messages, sample activities, artwork references and form options must
not become English literals in a platform theme. Preserve stable option IDs and
use the persona portrait for AI preview headings. Describe complete split-language
coverage in the handoff to the authorized live builder; do not generate or publish
variants through this draft-only pack.

Maintain the local display profile and safe conversational text for one digital
twin page.

## Public authoring boundary

- Work only in the repository explicitly selected by the user.
- Edit `assets/chat-config.json` only.
- Do not commit, push, synchronize, publish, or invoke the twin.
- Do not add or modify connectors, external tools, computers, inboxes, telephony, credentials, access tokens, or private user data.
- Do not place secrets or confidential source material in prompts.
- Do not edit embed appearance; that belongs in `assets/embed-config.json`.

## Supported fields

- `pageProfile.title`
- `pageProfile.description`
- `pageProfile.longDescription`
- `pageProfile.profilePicture`
- `pageProfile.bannerImage`
- `pageProfile.bannerType`
- `pageProfile.tags`
- `pageProfile.category`
- `pageProfile.subcategory`
- `publishedConfig.name`
- `publishedConfig.firstMessage`
- `publishedConfig.systemPrompt`

Preserve all other `publishedConfig` fields unchanged.

## Authoring process

1. Read the existing file and preserve `schemaVersion`, `pageId`, stable IDs, and unknown fields.
2. Change only the requested supported fields.
3. Ensure conversational instructions are clear, non-deceptive, and do not claim unavailable capabilities.
4. Keep image fields as existing references or user-supplied safe placeholders; do not fetch media.
5. Validate JSON syntax locally.
6. Report changed fields and note that publication remains a separate user-controlled action.

Minimal shape:

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

## Authenticated Persona app draft

Draft the signed-in app as `assets/chat-app.json` (schema version 3, `runtimeDataPolicy: definitions_only`) and mirror the same object in `publishedConfig.chatApp` with its stable `chatAppRef`. Home’s first/default `coach` tab is Meet Persona: an `assistant-panel` backed by a named workspace/coach data point, review-only coach settings, read-only evidence and optional goals. Put only domain records/results/decisions in Home tabs. Playbooks belongs in the sidebar, milestones/goals in the Coach control, and routines/Signals/Schedule in Signals. Never duplicate any of those utility managers as Home tabs or panels. The primary sidebar is Home, named chat history/playbooks, Signals, Data Feed and Media. Avoid extra top-level Coach, Goals, Connections, To-Dos, Canvas or Mobile destinations unless requested. Preserve the theme, avatar, locale, human approvals and existing sessions; never use public sample runs as private records. Guided commands use a stepper experience and real declared commands. Validate the JSON, references and exact mirror locally. List the Home/Coach/sidebar checks for the user’s later live verification. This remains a local draft: do not authenticate, invoke Gateway, provision, run or publish it from this public skill.

## Drafting ROI mappings

Include a standalone domain ROI/Impact sidebar destination in a signed-in Persona design and link its monitoring profile to the public calculator. Map committed List/workflow fields to parent ontology attributes, declare accepted outcomes and stable identities, and record evidence/provenance requirements. Use explicit user time baselines or separately evidenced monetary amounts. Tokens and credits are usage; top-ups are funding and must not be counted again as consumption. Missing evidence, prices or currency conversion leaves financial ROI unknown. Use Gateway topic `persona-roi` for the maintained algorithm when an authorized coding environment is available. This skill remains draft-only; it does not authorize accessing private records, executing workflows or publishing.

Draft a single Signals panel with inner Signals/Planning controls, without duplicate outer Signals/Routines tabs. Use the persona portrait as the Meet/Coach tab prefix.

ROI/Impact is sidebar-only. Use canonical `agents` (existing Kai `grocery-agents`) metadata as the standalone target; never display an ROI tab beside Meet/Coach.


## Persona workspace instances

Read [Persona Workspaces](references/persona-workspaces.md) or fetch gateway topic `persona-workspaces` for switching, sharing and subscriber editing. A workspace is an instance of the existing persona, not a new public persona, business company or harness workspace. Use `personaWorkspaceId` throughout data, immutable execution authority, tokens/credits, ontology-backed ROI and agent keys. Owners manage definitions/team within author policy; Members operate shared records/playbooks using owner access and credits. Private Coach/profile/memory and credentials remain per actor. Invitations join an existing workspace and create no personal workspace or branches.

Follow the [workspace validation and packaging contract](references/persona-workspaces.md#validation) for real browser/API isolation checks, Docker shared-module inputs and explicit reporting of untested delivery/model paths.


## Command governance and cost handoff

For slash-command authoring, read [command governance and estimated cost](references/command-governance.md). Report warnings and the selected review profile with cost comparisons before handing off the command.
