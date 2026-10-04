---
name: chat-app-builder
description: Author versioned authenticated persona Chat Apps with model-defined navigation, pages, registered components and named data points, backed by authorised pipeline lists and outcomes.
---

# Chat App Builder

## Offline-first rendering

Read [the embedded runtime contract](references/offline-runtime-v1.md). Bind prepared screens and guided journeys to device repositories in local mode. Components and actions must render pending, blocked, conflict, and partially available states from the capability report. Never make connectivity-dependent controls appear successfully completed while offline, and never trigger synchronization merely because connectivity returned.

Use this for the signed-in persona app, independently of the anonymous landing page builder. The reusable web/native renderers contain component implementations; persona navigation, layout, copy and source selection live in `assets/chat-app.json`.

## Authoring workflow

1. Read `assets/chat-config.json`, `assets/chat-app.json`, `references/registry.json` and the effective List/Pipeline schemas. Read `references/chat-app-contract.json`.
2. Retain the resource key, enabled utilities, knowledge-base policy and existing useful modules. Keep enabled `chat-sessions` as the fallback. For v1 use the explicit migration script before authoring pages; do not silently upgrade unrelated personas.
3. Author schema version 2 for read-only insights or version 3 for interactive workspaces, both at the portable root and inside `chatApp`. Use `runtimeDataPolicy: definitions_only`. The optional `chatApp.experience` contract has its own `schemaVersion: 1` and may be added without upgrading the top-level app. New persona Chat Apps default to `experience.sessionMode: "stepper"`; use `"chat"` only for an explicitly requested legacy transcript-first journey.
4. Add named `dataPoints` first, then pages/sections/components referencing them. Add custom navigation as `id: page:<page-id>`, `kind: page`, `pageId: <page-id>`; order it explicitly.
5. Copy `chatApp` exactly into `publishedConfig.chatApp`; preserve `publishedConfig.chatAppRef.resourceKey`. Monitoring remains in `publishedConfig.roiMonitoring`; prices and assumptions remain in the landing-page model.
6. Translate app-owned copy under `localization.translations`, keyed by source-language text. Never translate identifiers, references, fields or numeric configuration. Missing translations fall back to source copy. Use the existing persona presentation theme.
7. Run `node server/skills/chat-app-builder/scripts/validate-chat-app.js <app-file> <chat-config-file>`. The sibling generated `chat-app-model.cjs` is required when copying this validator. It checks the effective local registry schemas when available.
8. Update workspace Chat App fingerprints and `dataPoint` dependency edges to referenced lists. Run the persona's existing build/portability checks. Report validation; publish only within the user's authorised scope.

## Version 2 contract

Start with `references/insights-example.json`. The initial `insights` template is an ordered grid: full/half width on desktop, authored order stacked on native/mobile. Maximum 10 pages, eight sections and 24 components per page. Tables default to 25 rows, capped at 100. Pages may offer a 7/30/90-day default and All time; date binding belongs to each data point.

Registered components: `stat-card`, `table`, `outcome-metrics`, `outcome-trend`, `outcome-baseline`, `outcome-observations`, `outcome-check-in`, `outcome-activity`, `outcome-usage`, `outcome-signals`.

List data points use a portable `listRef` resolved within the persona. Operations: `rows`, `count`, `sum`, `average`. Numeric aggregates require numeric fields. Row queries require an explicit projection. Filters use literal `eq`, `neq`, `in`, `exists`, `gte`, `lte`; schema field types and select options must match. Virtual fields are `$stage`, `$createdAt`, `$updatedAt`; stage requires a declared pipeline binding. Never use runtime pipeline IDs or `_workflowState` paths.

Outcomes data points reference a registered result and, where needed, a measurement profile/metric. They reuse committed execution evidence, baseline, acceptance and check-in services. A list row is not automatically an accepted customer outcome. Preserve unknown values, negative time differences, provenance, coverage and the applicable model revision. Never turn benchmarks into observed savings.

Queries are authorised and scoped on the server to the signed-in runner, even when that runner owns the persona. A custom label cannot remove required evidence disclosures. Reads never provision resources, execute workflows or retry purchases. Owner aggregates/calibration review stay in workspace/company dashboards.

Do not include JavaScript, raw database expressions, arbitrary API URLs, CSS, secrets, credential references, runtime IDs, customer records or uploaded evidence. Components and sources must be registered. Version 2 navigation requires no monitoring configuration for list-backed pages. Anonymous landing pages, compact widgets and evaluation simulations cannot expose runner data.

## Existing shell modules

Built-ins: `chat-sessions`, `matches`, `assets`, `movie-editor`, `meetings`, `ai-resources` (legacy), `connections`, `todos`, `canvas`, `avatar`, `mobile`. The legacy `dashboard` identifier is readable in v1 only with enabled app and monitoring; migration creates `page:dashboard`.

Utilities: `feedback`, `invite`, `settings`, `tryWithAgents` (on unless `enabled: false`). Try with Agents lets runners install this persona as a coding-agent skill (`curl -fsSL <origin>/chat/<slug>/install.sh | bash`), connect with OAuth, or copy MCP/CLI/Skills prompts. Asset tabs: `all`, `images`, `pdfs`, `videos`, `audio`, `other`. Module labels are at most 48 characters; icons use existing registered heroicons, emoji or approved image icons. Capability gates still apply.

`knowledgeBase` remains the fixed footer entry with provisioning mode `managed`, `author`, `runner` or `ask`. Its private Git credentials stay in server storage, never portable app JSON.

## Editing and publication

The Chat App editor provides Pages, Components, Data points and Preview. Preview uses the author's own runner records. Save through `getChatAppEditor` / `saveChatApp(expectedRevision)`; retain the draft on conflicts or failed Git sync. Do not store app definitions in `chatEmbedConfig` or landings. Schema version and resource identity must survive every round trip. Calibration applies only an approved, revision-checked numeric patch through the calculator's owning repository and release workflow.

Build the canonical model with `node scripts/build-chat-app.js`, then verify with `node scripts/build-chat-app.js --check`. This updates only the app projection, its fingerprint and declared list dependency edges. The same scripts ship in the persona scaffold; use the existing workspace publish/release checks afterwards.

## Authenticated start screens and rich results

Use `chatApp.experience` for the authenticated persona journey. It is rendered only by full `/chat/:agentId` and the native persona app shell. Full embeds, compact widgets, anonymous landings and internal playgrounds ignore it. Rendering, restoring, or refreshing it must never run a command.

Set `experience.sessionMode` explicitly. `"stepper"` is the default for newly authored persona Chat Apps: every new, active, resumed, edited, and completed chat session stays in the guided renderer instead of changing to a transcript when messages exist. The server persists the current guided snapshot against the authenticated chat session, and web/native hosts restore that exact snapshot. A completed session remains on its terminal confirmation and next actions; reopening it must not restart steps, re-run a command, or automatically claim the result again. `"chat"` preserves the legacy empty-session-only start screen and allows the normal conversation UI after the first action. Never persist runtime step answers, preview tokens, customer uploads, or session ids in Git; only author the stable mode and journey/action definition.

Experience version 1 supports `guided-upload`, `guided-intake`, `guided-choice` and `guided-prompt`. Define stable actions inside `experience.actions`: `command` references an enabled published slash-command trigger without `/`; `chat` contains a real message to send; `voice` may reference a voice-enabled command. The fresh screen references one primary action and optional secondary actions or suggestions. A guided upload primary action must resolve to a command with a published attachment contract. Intake questions, attachment MIME types and file limits remain owned by that command and must not be copied into the Chat App model.

Command actions may include bounded declarative `arguments`; the server still resolves the declared command and its published input contract. Put translated experience copy in `experience.localization` so schema-version-1 personas can localise the signed-in screen without upgrading the parent Chat App. See [references/experience-example.json](references/experience-example.json).

`appearance.source: landing-page` inherits only semantic palette, typography, background treatment and artwork. Keep titles, opening copy, actions and result mapping in `assets/chat-app.json`. Never copy landing-page demo conversations, sample people, properties, products, events or benchmark values into an authenticated experience.

Rich result views match declared action IDs to one registered source: `assistant-message`, `structured-response`, `bundle-proposal`, `item-search`, `pipeline-result`, `task-summary`, `pipeline-record` or `artifacts`. Templates are `narrative`, `spotlight`, `review`, `card-grid`, `media-gallery` and `timeline`. Map only the normalized fields listed by the source catalog. Existing approval, cart, task and media controls remain authoritative; the presentation must preserve partial, failed, declined, uncertain and waiting states.

Do not include React, Dart, HTML, CSS, arbitrary JSON paths, external APIs, runtime integration IDs or customer records. Preview uses labelled fixtures and disables actions. Save through the same revision-checked Chat App editor and Git publication flow, preserving navigation, pages, monitoring and resource identity.


## Version 3 interactive workspace

Use `template: workspace`, ordered `tabs` with stable `id`, translated `title`, optional `heroicon:*` `icon`, and `sectionIds`, plus `defaultTab`. Each section uses the same responsive component layout. A section may define its own ordered `tabs`, `defaultTab`, and `componentIds` to switch between related views without adding sidebar destinations. The app's default destination remains independent of the page's default tab.

`presentation.sidebar` selects `brand` or `surface`; `secondaryAccent` is an optional six-digit hex colour. These semantic choices inherit the persona theme, never change a public landing demo.

Workspace components: `assistant-panel`, `cart-items`, `record-cards`, `nutrition-summary`, `execution-status`, `playbook-list`, `routine-list`, `signal-list`, `schedule-calendar`, `meal-plan`. Named `source: workspace` data points use registered `provider` values `chat`, `coach`, `cart`, `catalog`, `recipes`, `nutrition`, `meal-plan`, `executions`, `routines`, `automations`, and `goals`. The executions provider supports preferred `view: playbooks` (and legacy `workflows`) for published commands plus `view: executions` for runner-scoped execution history. A section tab may set `heading` so each view can name the same shared panel accurately.

`routine-list` is a runner-scoped projection of ordinary To-Dos whose execution target is `command_routine`. Declare `routine.create`, `routine.update`, `routine.run`, `routine.pause`, and `routine.delete` actions on the component. Each ordered step references a declared command action; do not embed command triggers, workflow IDs, credentials, or executable code in the routine. Routine mutations use the normal To-Do store, scheduler, webhook/list monitor, run lifecycle, approvals, notifications, audit trail, and revision checks.

Use `provider: "automations"` for the Signals destination. Pair `signal-list` and `schedule-calendar` with the same data point and declare the supported `automation.create`, `automation.update`, `automation.run`, `automation.pause`, `automation.delete`, and `automation.test` actions. Signals and Schedule are runner-owned `playbook_automation` To-Dos: Signals react to observed list changes and optional refresh playbooks, while Schedule launches ordered playbooks at a time. Runtime definitions, observations, check history, approvals, and enabled state stay outside Git.

An automations data point may include up to 50 portable `signalPresets`. Each preset is a disabled starter card with a stable slug `id`, `title`, optional `description`, optional `sourceListRef: { kind: "list", resourceKey }`, and optional declared command `actionId`. Add one useful preset for each eligible playbook when the persona should ship with starters. A preset never enables monitoring by itself; the runner must open it, complete its fields, save it, and explicitly enable it. Do not put local list IDs, credentials, sample customer rows, observations, runtime automation IDs, schedules, or history in a preset. If a persona has no eligible playbook, a monitoring-only preset may omit `actionId`.

`actions` declare stable IDs and labels. Components reference action IDs. Command actions reference a declared trigger. Cart add references a catalogue data point; planning save references a meal-plan data point. Author previews cannot mutate. The server validates access, revision, source fields and idempotency. Cart review opens the existing confirmation flow; it never places an order by itself.

Command actions use enabled published commands supported by the normal authenticated chat launcher. The source catalog marks these with `workspaceActionSupported`; portable workflow references still materialise through their existing launcher. Preparing a command returns a durable `launchRequestId`, bound to its runner, persona, arguments and published definitions. Carry it through intake and approval continuations. Preparation is not execution success or purchase approval. Never substitute a new request key to recover an uncertain launch.

Preserve all earlier schema versions and identities on round trips. Publish version 3 only after the matching web/server/native contracts are available. Incomplete integration mapping blocks publication; do not replace it with sample rows or made-up totals.

## Automatic audience versions and global country

Use `publishedConfig.personalization` for a global-country baseline plus country,
language, saved-profile/custom or individual authenticated versions of a whole
Persona presentation. Configure it in Chat Publish → Audience versions. It can
change the name, avatar, landing theme/layout, embed appearance and signed-in app.
Read [the presentation contract](../digital-twin-page/references/personalization.md)
for precedence, JSON, hierarchy, trusted profile matching and bounded prompt
generation. Empty country/language lists mean all; global precedes country/language
and the matched authenticated audience. Never expose a country selector in the
public header. Use styled form primitives and `app/components/Select.tsx`.

Prompts adapt editable copy through the existing country generation jobs and
policies; complete layouts are authored validated config. Translations and
generated assets live under their matched variant and cannot use a shared global
translation cache. Preserve human approvals, real-data boundaries and access checks.
