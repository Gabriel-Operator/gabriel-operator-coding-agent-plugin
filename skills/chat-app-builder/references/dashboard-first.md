# Persona Chat App dashboard format

Use this format for a new authenticated Persona app unless the user specifies another layout. Adapt the domain copy and sources; Kai is the composition reference, not a source of another persona's grocery content, private records or identifiers.

## Home owns the workspace

Author an enabled schema-version-3 `assets/chat-app.json` with stable `chat_app.*` identity, `runtimeDataPolicy: definitions_only`, and a Home navigation module pointing to `page:dashboard`. Put `Meet <persona>` in that dashboard as the first tab, with stable id `coach` and `defaultTab: coach`. Its section contains a full-width `assistant-panel` bound to a named `source: workspace, provider: coach` data point. Configure `chatApp.coach.enabled`, `mode: review`, `reviewDataPointIds`, an accurate empty state and `allowedActionIds: []`. Goals may be enabled when appropriate. This is the dashboard review coach, independent of standalone voice coaching or `coachConfig`.

The remaining Home tabs contain only the persona's domain records, results, decisions and impact views. Playbooks/executions belongs to the existing sidebar destination; milestones/goals belongs to the Coach control; routines, Signals and Schedule belongs to Signals. Never show separate Home tabs or panels for any of those utility managers, including renamed aliases such as `buying-playbooks`, `shopping-goals` or `buying-routines`. For legacy-compatible sidebar Playbooks navigation, a canonical `playbooks` or `grocery-playbooks` tab/section may remain in the model as hidden metadata: it is reachable as a standalone sidebar detail view and excluded from the Home strip. Do not rename that hidden destination to force it into Home. Use registered components and declared sources.

A review coach must distinguish a draft, simulation, approval, completed execution and accepted customer outcome. It must not invent data or execute operational commands. Mounting, refreshing, switching tabs or reopening a session must not run a playbook or approve an action. Empty data stays an honest empty state.

## Minimal sidebar

The default primary modules, in order, are Home, the persona's named `chat-sessions` history/launches, Signals, Data Feed, and Media (`assets`). The Signals page owns Signals, Schedule, routines and their existing automation/routine actions. The Data Feed page uses `data-feed-list` with `provider: data-feeds`. Keep the standard settings, credits, knowledge, audit and mobile utilities supplied by the shell. Add other primary destinations only for a concrete user-requested need; do not add Coach, Goals, Connections, To-Dos, Canvas or Mobile as a second set of domain destinations. Existing useful capabilities must remain accessible through their intended dashboard, Signals or shell surfaces.

Minimal structural example (add the registered persona's real sources/actions and the Signals/Data Feed/Media pages before publishing):

```json
{
  "schemaVersion": 3,
  "enabled": true,
  "navigation": {
    "defaultModule": "page:dashboard",
    "modules": [
      {"id":"page:dashboard","kind":"page","pageId":"dashboard","label":"Home","enabled":true},
      {"id":"chat-sessions","label":"Playbooks","enabled":true},
      {"id":"page:signals","kind":"page","pageId":"signals","label":"Signals","enabled":true},
      {"id":"page:data-feed","kind":"page","pageId":"data-feed","label":"Data Feed","enabled":true},
      {"id":"assets","label":"Media","enabled":true}
    ]
  },
  "dataPoints": [{"id":"workspace-coach-chat","source":"workspace","provider":"coach"}],
  "pages": [{
    "id":"dashboard","title":"Your workspace","template":"workspace","defaultTab":"coach",
    "tabs":[{"id":"coach","title":"Meet your persona","sectionIds":["coach"]}],
    "sections":[{"id":"coach","components":[{"id":"coach-chat","type":"assistant-panel","dataPoint":"workspace-coach-chat","width":"full"}]}]
  }]
}
```

This is a layout excerpt, not a complete validated app and not permission to invent commands, list refs or data. The app's enabled review coach and sources, utilities, knowledge policy, Signals and Data Feed pages, registered primary command, localization and exact `publishedConfig.chatApp` mirror are required authoring work. `experience.sessionMode` defaults to `stepper` for the guided command; preserve an explicitly requested free-form mode. Match the public landing theme, avatar and selected language, while keeping public sample content separate from runner data.

## Publication and verification

Run `node scripts/validate-chat-app.js --dashboard-first assets/chat-app.json assets/chat-config.json` from the Persona scaffold and `build-chat-app.js --check`, validate the workspace and publish through its existing flow. Preserve the resource identity and registry/list dependency edges. Schema validation alone does not prove the composition is correct: inspect Home's Coach tab, its conversation/history/New Run/milestones controls, the domain-only Home tabs, sidebar Playbooks, routines under Signals, Signals/Schedule, Data Feed and an existing guided session at desktop and mobile widths. Confirm the coach has read-only scope and no automatic operational launch. Retain sessions, goals, decisions and records.

Gateway agents fetch both `gabriel_get_skill_instructions(topic: chat-app-builder)` and `gabriel_get_skill_instructions(topic: persona-chat-app-layout)`. REST uses `GET /api/gateway/skill-instructions?topic=...`. Update the complete validated app through the existing twin-config operation, then mirror the canonical asset and publish its workspace. No new endpoint, permission or credential is required for this format.

The `--dashboard-first` check is opt-in for this standard format. Keep ordinary structural validation for an explicitly requested alternative or an existing legacy app; do not silently migrate another persona. The check verifies the Home coach provider, review evidence, default destination, minimal primary modules and absence of duplicate Home utility tabs before publication.

The Home tab strip must stay free of Playbooks, Signals, Schedule, routines and milestones/goal managers. Classify them by registered component type, not just title or id. A stale Home deep link to one of those managers must fall back to the normal Home coach; preserve canonical standalone sidebar Playbooks links. Retain all runtime records, sessions, milestones and routines when moving their authored views.

Signals has one shared Signals/Planning panel with its own controls. Do not author another outer Signals/Routines tab strip. The Meet/Coach tab always uses the active persona avatar image as its prefix; generic AI/sparkle icons and the author avatar are inappropriate.

ROI/Impact belongs to the sidebar as a standalone results destination, via hidden canonical `agents` (existing `grocery-agents`) metadata. It must never appear in Home/Coach’s tab strip.

ROI setup places one optional planning baseline below its title, ahead of the metric cards: use a slim themed collapsible, concise single-line labels with full question help, aligned controls and explicit saving. Never duplicate it below the charts. Default to collapsed, preview the same editable values on the right, and mark unsaved drafts clearly.
