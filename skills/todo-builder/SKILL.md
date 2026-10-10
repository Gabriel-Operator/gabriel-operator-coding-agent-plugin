---
name: todo-builder
description: >
  Build, validate, and maintain Git-backed Gabriel Operator personal To-Do
  workspaces by editing assets/todos.json. Use this skill when defining goals,
  boards, and To-Dos that sync from Git into Gabriel Operator and can be
  imported onto any persona.
metadata:
  author: gabriel-operator
  version: "1.0"
  compatibility: Requires Node.js 16+ for validation scripts.
---

# Todo Builder

## Offline routines, schedules, and signals

Read [the embedded runtime contract](references/offline-runtime-v1.md). Goals, tasks, boards, routines, schedule definitions, signal baselines, occurrence IDs, and run checkpoints may be stored locally. Assign one owner device per automation. Desktop runs while its runtime is alive; phones checkpoint on suspension and resume in the active app. Coalesce missed recurrences once and never retry uncertain external side effects without review.

## Using this skill in coding agents

Gabriel Operator skills are designed for Claude Code, Codex, Cursor, Hermes, OpenClaw, and any agent that supports skill packs. Work in the git-backed todos repository connected to your Gabriel personal To-Do workspace.

### Install the skill pack

| Agent | Install |
|-------|---------|
| **Claude Code** | `npx skills add go-code-bot/todo-builder` |
| **Codex** | `codex plugin marketplace add Gabriel-Operator/gabriel-operator-coding-agent-plugin --sparse .agents/plugins` then install the Gabriel Operator plugin |
| **Cursor** | `npx github:go-code-bot/todo-builder add ./my-todos` or copy into `.cursor/skills/todo-builder/` |
| **Hermes / generic CLI** | `npx github:go-code-bot/todo-builder add ./my-todos` |
| **OpenClaw** | `npx skills add go-code-bot/todo-builder` then `openclaw gateway connect --url https://your-openclaw-gateway` |
| **Gabriel Operator monorepo** | `cp -R server/skills/todo-builder ./your-git-repo/` |

Alternative curl installer:

```bash
curl -fsSL https://raw.githubusercontent.com/go-code-bot/todo-builder/main/install.sh | bash
```

### Modify with your coding agent

1. Open the git-backed todos repository.
2. Tell your agent: *"Read `SKILL.md` and update `assets/todos.json` (goals, boards, and To-Dos) for \<describe the change\>."*
3. Validate before committing:
   ```bash
   node scripts/validate-todos.js assets/todos.json
   ```
4. Commit and push to the default branch.

**Example prompts:**
- *"Add a recurring Monday 9:00 To-Do that drafts a weekly status update."*
- *"Rename the Marketing board and add a Review lane."*
- **OpenClaw:** *"Update assets/todos.json, run the validator, and prepare the workspace for Git sync."*

### Sync to Gabriel

1. Run the validator (see above).
2. Commit and push to the default branch.
3. Open To-Dos in Gabriel and **Pull** so `assets/todos.json` projects onto the linked persona page.

## Git-backed todos repositories

When this skill is materialized as a Git repository for one personal workspace,
the repo contains the scaffold plus `assets/todos.json`. The workspace is
**personal to the user** — the same payload can be imported onto any persona
page owned by that user. Runtime runs and comments stay in Gabriel's database;
Git only holds portable definitions.

## Mental Model

- One repository owns one personal To-Do workspace (goals + boards + todos).
- Keep stable `id` values. Renaming titles is fine; do not regenerate ids unless
  you intentionally fork into a new identity.
- Do **not** put `userId`, `pageId`, run status, `lastRun*`, or comments in Git.
- Optional `monitor` on a To-Do enables list-watch / webhook triggers. Include
  `enabled` and `listWatch` only — **never** commit `monitor.webhookToken`
  (Gabriel mints a fresh token on pull/import).
- Optional `executionTarget.type: "workflow"` runs a page-builder workflow
  endpoint (`appId` + `endpointSlug`). Endpoint ids are page-local after import.
- `executionTarget.playbookId` values are page-local. After importing onto a
  different persona, canvas shortcuts may need re-binding in Gabriel.

## Canonical File

Edit:

```text
assets/todos.json
```

Expected wrapper:

```json
{
  "schemaVersion": 1,
  "workspaceId": "todows_example",
  "workspace": {
    "id": "todows_example",
    "name": "Personal To-Dos",
    "goals": [],
    "boards": [],
    "todos": [],
    "checkInSchedule": null
  },
  "commitMessage": "Update todos workspace"
}
```

## Common Edits

Add a To-Do:

1. Append an entry to `workspace.todos[]` with a unique `id`.
2. Set `title`, `promptText`, `scheduleType` (`manual` | `one_time` | `recurring`), and `enabled`.
3. Point `goalId` / `boardId` at existing workspace goal/board ids when relevant.

Add a board lane:

1. Find the board in `workspace.boards[]`.
2. Append `{ "key", "name", "color", "order" }` to `lanes`.

## Validation

```bash
node scripts/validate-todos.js assets/todos.json
```

The validator rejects missing required fields, duplicate ids, invalid schedule
types, and malformed wrappers.

## Triggers and command routines

Runtime To-Dos expose one canonical `trigger`: `manual`, `schedule`, `webhook`, or `list_change`. Existing `scheduleType`, schedule fields, and `monitor` remain readable and are maintained as a compatibility projection. Never commit a generated webhook token. List-change triggers may reference only a declared list owned by the runner and use bounded create/update/delete events and validated scalar conditions.

A persona routine is the same To-Do resource with `executionTarget.type: "command_routine"`, a published Chat App revision, and 1–24 ordered steps. Every step uses a stable declared Chat App action ID, `saved` or `request_at_run` inputs, and an `approvalAfter` gate. Do not store secrets, runtime integration IDs, or raw executable commands. A changed app revision requires review before the routine runs again. Runtime run state, approvals, notifications, and audit history remain outside Git.

Signals and Schedule use `executionTarget.type: "playbook_automation"` at runtime. Do not seed those runner-owned definitions in `assets/todos.json`. A persona may instead publish disabled starter cards as `chatApp.dataPoints[].signalPresets`; configuring a starter creates the runner's ordinary To-Do definition. Signal presets carry only portable list resource keys and declared command action IDs. Their enabled state, field rules, baselines, observations, linked runs, approvals, audit logs, and ROI stay in runtime storage.

## Offline Signals and Schedule

`playbook_automation` definitions remain portable, but `executionOwner` is runtime state and must never be committed to Git. A signal owned by a device watches that device's encrypted local list records, stores the first observation as a baseline without firing actions, suppresses unchanged fingerprints, and runs only locally compatible refresh/action playbooks. Web, SaaS, notification, browser, and other connected steps remain blocked for review. Optional AI judging uses the selected installed local model.

Schedule definitions run on their one selected owner: desktop while the runtime is open and the computer is awake, or mobile while an app shell is active. Missed recurring occurrences coalesce into one catch-up run. Move ownership with the runtime's **Run Signals here** or **Run in cloud** action. The device keeps a transfer inactive until manual sync acknowledges it; a failed or interrupted ownership mutation must never activate local dispatch. Never activate the same definition on multiple runtimes.

## Context-aware ontology

Use the parent persona’s `assets/ontology.json` for Global → country/region → one authenticated audience → language → terminology. Refer to [the ontology skill](../persona-ontology/SKILL.md) for snapshots, stable IDs, validation, preview and gateway/MCP authoring. Child resources reference that contract; stored instances and credentials remain in existing runtime storage. Preserve captured ontology selections during retries and downstream mappings. Saving an ontology candidate is separate from activation.
