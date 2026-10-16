---
name: workflow-builder
description: Author and validate review-only Gabriel Operator workflow definitions in assets/workflow.json. Use only when the user explicitly asks to create or update a Gabriel workflow draft in a repository they control. Produces local files only; it does not deploy, run, authenticate to external services, or perform external actions.
compatibility: Requires Node.js 18+ only when running the bundled local validator.
---

# Workflow Builder

Create or update a local, reviewable Gabriel Operator workflow definition. This
public OpenAI skill is intentionally limited to workflow authoring and validation.

## Safety and authorization boundary

- Work only in the repository and workflow file the user explicitly identifies.
- Treat all generated workflows as drafts until the user reviews them in Gabriel Operator.
- Do not deploy, run, schedule, commit, push, or publish a workflow.
- Do not access external accounts, restricted resources, or authentication challenges.
- Do not collect, request, infer, copy, or store credentials, session data, private keys, or access tokens.
- Do not add instructions that evade service restrictions, usage limits, or authorization checks.
- Do not add actions that create, modify, delete, send, submit, upload, or otherwise change external state.
- Do not add arbitrary network requests, database writes, shell execution, code execution, desktop control, or third-party connector calls.
- Use only the supported authoring actions listed below. If the requested workflow needs another action, describe the missing step in the handoff instead of fabricating it.

## Supported public-authoring actions

This reduced package supports these browserless, review-oriented action types:

- `navigate` — required workflow initializer; must use `disableBrowser: true` and an empty `url`.
- `wait` — a bounded delay represented in the draft.
- `llm` — a text reasoning or transformation step with no external side effect.
- `confirmation` — an explicit human review checkpoint.
- `api_output` — maps earlier draft outputs into a named structured result.

The full Gabriel Operator editor supports additional actions, but they are outside
this public authoring-only skill.

## Authoring workflow

1. Read the existing `assets/workflow.json` when it exists.
2. Confirm that the user requested a Gabriel workflow draft and supplied the target repository.
3. Summarize the proposed steps before editing when the request is ambiguous or consequential.
4. Edit only `assets/workflow.json` and keep existing stable identifiers unless the user requests a new workflow.
5. Keep every step field at the step root. Never add an `arguments`, `params`, `options`, `input`, `config`, or `data` wrapper around a step.
6. Give every step a unique `stepId`, sequential `step_number`, concise `label`, and structured `intent`.
7. Validate the draft locally:

   ```bash
   node scripts/validate-workflow.mjs assets/workflow.json
   ```

8. Report the changed file, validation result, and any unsupported runtime actions the user must configure separately in Gabriel Operator.

## Canonical file

```text
assets/workflow.json
```

Minimal shape:

```json
{
  "actionId": "<existing-action-id-or-empty-for-a-new-draft>",
  "structure": {
    "name": "workflow-draft",
    "actionName": "Workflow Draft",
    "baseUrl": "",
    "screenshotEnabled": false,
    "parameters": {
      "execute": []
    },
    "groups": [],
    "steps": [
      {
        "step_number": 1,
        "stepId": "step-a1b2c",
        "action_type": "navigate",
        "disableBrowser": true,
        "url": "",
        "selectors": [],
        "label": "Initialize browserless workflow",
        "intent": "**Input:** No external inputs. **Processing:** Initializes a browserless Gabriel workflow draft. **Output:** No external action is performed.",
        "timestamp": 0
      }
    ]
  },
  "commitMessage": "Draft workflow definition"
}
```

## Step requirements

Every step must include:

- `step_number` — sequential integer starting at `1`;
- `stepId` — unique `step-` identifier followed by five lowercase hexadecimal characters;
- `action_type` — one of the supported public-authoring actions;
- `label` — short human-readable name;
- `intent` — describes input, processing, and output without including sensitive data;
- `timestamp` — numeric timestamp or `0` for a static template.

The first step must always be the browserless `navigate` initializer shown above.

## Variable references

Later steps may reference explicitly exported values from earlier steps using:

```text
{{step-a1b2c.variableName}}
```

Do not place confidential values in templates. Use descriptive placeholders only.

## Human review

Use `confirmation` when the draft requires a deliberate human decision. A
confirmation step does not authorize deployment or external execution in this
public skill.

Example:

```json
{
  "step_number": 3,
  "stepId": "step-c0ffe",
  "action_type": "confirmation",
  "label": "Review generated summary",
  "intent": "**Input:** Uses the non-sensitive summary from the previous reasoning step. **Processing:** Pauses for human review. **Output:** Exposes the review answer for later draft logic.",
  "userPrompt": "Does this summary accurately reflect the supplied material?",
  "confirmationConfig": {
    "answerMode": "yes_no",
    "postAnswer": "continue"
  },
  "timestamp": 0
}
```

## Supporting files

- `references/SCHEMA.md` — supported action shapes and validation rules.
- `references/SAFETY.md` — authoring boundary and handoff requirements.
- `assets/workflow-template.json` — copyable safe starting point.
- `scripts/validate-workflow.mjs` — local deterministic validator; it performs no network operations.


## Command governance and cost handoff

For slash-command authoring, read [command governance and estimated cost](references/command-governance.md). Report warnings and the selected review profile with cost comparisons before handing off the command.


## Required playbook team protocol

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, reviewer, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.


## Shared community activity flagship

Read [the community activity loop contract](../persona-framework/references/community-activity-loop.md) when authoring a family-activity or school-workshop persona. One pinned workflow package owns both landing-chat journeys and the signed-in command, including translated questions, artwork references and copy. The model owns market sources, country variants, disabled Signal presets and occurrence/ROI definitions. Country follows the saved area; language changes presentation only. Include every pinned feed in the inspected Observe stages. Preserve source candidates, missing permissions and unknown cost. A proposal, publication or RSVP does not prove that families met. Two distinct adult-managed family profiles and the configured school delivery evidence determine the outcome; corrections can withdraw confirmation. Author the contextual team for authenticated human review; local definitions and mock tests cannot manufacture confirmation or activate feeds, Signals, publication or external effects.
