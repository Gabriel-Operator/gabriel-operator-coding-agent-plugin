---
name: persona-organization-map
description: Add or update a zoomable business organization map for a new or existing Gabriel Persona, using the Chat App JSON DSL to connect departments and processes to registered playbooks.
---

# Persona organization map

## Workspace edits from Coach or Try with Agents

Use the selected workspace connector for workspace-owned edits. Read
`persona_get_workspace_definitions` first for permissions, assets, revision and
Git branch. `persona_coach_update_organization_map` saves narrow marker/scene
changes through the same Git transaction as `persona_update_workspace_definitions`.
It supports authored maps even when the workspace has no `organization` overlay;
never require domain setup just because that optional metadata is absent.

Existing definition permissions apply: source editing requires the workspace owner
and app-write scope. Operational member grants do not grant whole-repository write
access. The server uses its configured repository writer, returns no credentials,
and never publishes a shared persona template through a workspace token. A remote
agent needs the connector and authorization, not a local clone. An installed skill
provides instructions, not credentials or permissions.

Preserve IDs, parent relationships, profile scenes, room positions and action
bindings. Pass the current expectedRevision, verify the returned Git receipt,
then read back the saved map. Conflicts require a fresh read. Coach chooses tools
from natural language; never ask the person to name a tool. Ask for missing field
values using visible labels. Voice may rename/add/move markers and explain the
map; background replacement requires text and an image attachment or image URL.

Keep the standalone Chat App, its chat-config mirror and generated local manifest
fingerprint aligned. Activate the committed snapshot before claiming completion,
then invalidate page definitions so both the map and later navigation refresh.
Local preview artwork must not override a committed workspace map. Tool discovery
must use the same resolved app as the page. Classify compiled Coach reads and
service-gated editors explicitly in native governance, never trust foreign MCP
annotations as equivalent provenance.

## Scene loading and complete zoom artwork

Give each department/sub-department its own `scene`, and each process a distinct
`scene`. The map has exactly three semantic levels: company campus, department
interior and process workspace. Playbook markers and the no-playbooks state appear
in the process workspace; selecting a playbook opens its details in place and does
not add a fourth zoom level. `detailScene` remains accepted for older model files,
but current maps do not render or preload it. Never reuse the campus or an unrelated
room to claim a completed image set. Older maps may still inherit scenes as a
graceful fallback.

Preserve `sourceProcessId` aliases when projecting scenes. Older models may still
contain `detailScene` or `scenes["<process-id>:detail"]`; retain those fields for
compatibility, but do not create, project, preload or render a fourth-level scene.
Generated workspace plans include one distinct room for each process.
Generation remains explicit; navigation and preloading never purchase images.

The frontend coalesces authenticated scene reads, caches decoded images within
account/workspace/definition scope, and preloads the next visible rooms from
bootstrap, list view and marker hover/focus. The backend caches only validated
revision-keyed bytes after current access and active-map checks. GitHub binary
reads use a bounded directory index and a checksum-verified blob request instead
of cloning all persona media for each image; other Git providers retain the
existing reader. Keep browser
cache variation on account and workspace request headers. Recreated React objects
must not invalidate identical scene content; actual definition changes must.
Do not fade scene images or remount the image plane on every drill-down. While a
cold scene loads, keep new pins hidden until the matching background is decoded.
Verify warm navigation separately from cold network/bootstrap startup; never
claim a guaranteed millisecond cold load without measurement.

To review uncommitted model artwork locally, explicitly set
`PERSONA_ORGANIZATION_MAP_PREVIEW=local` with `NODE_ENV=development` and
`GO_CHATS_ROOT` pointing at the local persona checkout parent. The dashboard
preview matches the bound full Git origin, reads only its contained model, and
intersects map actions with the existing app's offered commands. Workspace domain
and department selection remain in force. Only enabled maps can be previewed;
production never uses this override. Production adoption still requires the model
assets and reviewed workspace template revision to be published normally.


Use this for a conceptual Google Maps-like view of an organization, its departments,
processes and playbooks. It includes replaceable building/interior scenes and an
optional end-to-end value-chain perspective. It is a web workspace visualization:
it needs no coordinates for real places, Google service, credentials or new workflow.

Read the persona's `assets/chat-app.json`, `assets/chat-config.json` and registered
commands. Preserve its existing layout, actions, resource identity and runtime data.
Add the optional `chatApp.organizationMap` to an existing version 3 Chat App; do not
enable it on unrelated personas. Maps are disabled by default even when a draft
definition is present: only `organizationMap.enabled: true` activates the header
button, list/map switch and map view. Supply the persona organization scene before
activation; validators reject an enabled map without that image definition. Use
`chat-app-builder` for a version migration.

## JSON contract

```json
{
  "organizationMap": {
    "schemaVersion": 1,
    "enabled": false,
    "title": "Restaurant operations",
    "description": "Explore departments and the processes supported by playbooks.",
    "defaultProfileModeId": "operator",
    "nodes": [
      { "id": "restaurant", "kind": "organization", "label": "Restaurant" },
      { "id": "marketing", "kind": "department", "parentId": "restaurant", "label": "Marketing", "profileModeIds": ["operator"], "position": { "x": 50, "y": 45 } },
      { "id": "event-campaigns", "kind": "process", "parentId": "marketing", "label": "Event campaigns", "actionIds": ["run-event-campaign"] }
    ],
    "profileScenes": {
      "operator": { "imageUrl": "assets/organization-map/operator-campus.webp", "alt": "Restaurant operator campus" }
    },
    "connections": []
  }
}
```

- Exactly one `organization`; a `department` belongs to it or another department,
  and every `process` belongs to a department. Allow up to six department levels,
  reject cycles, and use unique stable slugs (at most 48 characters).
  The three semantic levels are company campus (department markers), department
  interior (process markers), and process workspace (playbook markers and
  selected playbook details). Selecting a playbook opens its inspector in place.
- Up to 100 nodes. `label` and map `title` are at most 120 characters; optional
  `description` is at most 1000. Optional `position: { x, y }` is relative to the
  parent scene image, each coordinate between 10 and 90. Omit it for automatic placement.
  Optional `color` is a six-digit hex marker color.
- When a persona has multiple active profile modes, register them first in
  `publishedConfig.peopleMatchingConfig.profileExperience.modes`, then use those
  exact mode IDs in map definitions. `defaultProfileModeId` selects the preview
  view when no profile is active. `profileScenes` may provide an organization
  scene per mode, and `profileModeIds` scopes a node and all its descendants to
  one or more modes. The workspace's active mode is applied by the shared renderer;
  connections and value chains that cross into a hidden branch are omitted.
  Nodes without a mode restriction are shared. An unknown active mode shows only
  shared nodes rather than exposing another profile's branch.
  A profile mode describes who is viewing the map; it is not an organization or
  department. Keep one organization root, scope its real department children to
  the relevant mode, and show all departments for that mode as the first marker
  layer. Use `profileScenes` for a different campus image. If modes only express
  preferences and share the same operating structure, share the same department
  nodes instead of duplicating them.
- Only processes bind `actionIds` (up to 30 unique entries). Reference existing
  `chatApp.actions` command IDs offered by a `playbook-list` component. Never bind
  workflow database IDs, raw commands, external URLs or invented actions.
- Optional `connections` (up to 200) use `{ from, to, label? }` between declared
  node IDs. Sibling connections render as paths with optional labels. For a handoff
  between departments, connect departments; for one within a department, connect
  its processes. A connection describes work, never an execution dependency.
- Marker counts resolve only from the current workspace's available playbook
  catalogue and deduplicate shared action IDs. A registered playbook represents
  available automation, not a successful run or a fully automated department.
  Empty areas stay visible with zero playbooks. Unplaced registered playbooks
  remain accessible below the map and in the list.

When explicitly enabled, the shared header discovers the existing Playbooks destination and shows its
marker button between notifications and the chat-sidebar button on every workspace
page. New Run opens the existing list. List / Organization map controls sit before the
Playbooks / Executions tabs and remain available in either tab; selecting a view
returns to Playbooks. The header marker is visibly selected in map mode. The map uses `playbookView=map` and optional `mapNode=<node-id>` alongside
the existing `appView`, `appTab` and `sectionTab` navigation parameters. No new
sidebar destination is needed. Playbook details offer the original Run action and
the existing How it works / Simulation inspector, including its normal empty state
when no simulation is registered. How it works and Simulation each open only their
requested view, without Loop / Simulation tabs, in a closable drawer that slides
over the left map viewport. Keep the right details panel visible and interactive,
including its Run and preview buttons. Position the drawer absolutely inside the
map viewport, with reduced-motion support and no backdrop covering the details;
never put the preview in normal document flow below the map. An empty process
stays at level 3 with a clear no-playbooks marker and no Run action. The map supports panning, semantic zoom, marker
selection, breadcrumbs and the existing Run launcher. A single marker click enters
a department or process; a playbook click opens details without starting a run. Opening it never runs a command.

## Process maps

A process map documents how one unit of the organization works, for the people in the
company: what it is for, when it is used, how a person uses it today, and a swimlane of
who does what. Every unit on the map can have one: the organization, a department, a
process, down to the playbook-backed processes. The admin Organization map page
(Admin Settings → Organization map) opens on **Process maps**, then offers the same unit's
**Playbooks** (the loop and simulation diagram of each registered playbook), **Apps**, **Ontology**,
**Data lists**, **Signals** and **Data feeds** as tabs.

Author `chatApp.processMaps` at the top level of the Chat App, next to `organizationMap`
(not inside it), keyed by the organization map node ID. See
[process-map.json](references/process-map.json) for a complete example with two variants.

```json
{
  "processMaps": {
    "event-campaigns": {
      "summary": "What the unit is for.",
      "basis": "authored",
      "whenUsed": "When it is used.",
      "howPeopleUseIt": "How a person inside the company uses it today.",
      "evidence": ["Where this was learned from"],
      "lanes": [{ "id": "owner", "label": "Owner or manager", "role": "Restaurant", "kind": "person" }],
      "phases": [{ "id": "request", "label": "Request" }],
      "variants": [{
        "id": "standard", "label": "Standard",
        "steps": [{ "id": "ask", "label": "Describe the event", "laneId": "owner", "phaseId": "request", "kind": "start" }],
        "flows": []
      }]
    }
  }
}
```

- **Lanes** are who or what carries out the steps (up to 12): `kind` is `person`, `team`,
  `playbook` or `system`; `role` is optional. **Phases** are the columns read left to right
  (up to 8), such as Request, Review and decision, Outcome.
- Up to 6 **variants** share the lanes and phases (for example Standard and Urgent). Each has
  up to 60 **steps** and 150 **flows**. A step belongs to one lane and one phase, and each
  lane-and-phase cell holds one step. `kind` is `step`, `decision`, `start` or `end`.
  A flow connects two different steps; `label` names a branch such as Approved or Declined,
  and `kind: "loop"` draws a dashed route back (for example Needs context).
- A step that runs a registered playbook sets `actionId` to a declared command action;
  the page then offers to open that playbook.
- Place steps so a flow never has to pass through another step in the same phase: put the
  next step in the next phase unless it is on the adjacent lane. Keep each step label under
  80 characters and put the detail in `description`.
- `basis` says where the content came from. Use `playbook` when it is read from a
  playbook's own definition (pipeline stages, workflow steps, the loop in
  `assets/command-playgrounds.json`) and `authored` otherwise. Name the sources in
  `evidence`.
- Never present a guess as how people work today. For a unit with no registered playbook
  and no source material, write a typical routine as an `authored` starting point, say so
  in the `summary`, and leave `howPeopleUseIt` out until someone confirms it.
- Process maps are documentation only. They never start a run, change a pipeline or
  alter a playbook, and they are not part of the app served to people using the persona:
  the admin page reads them through the author-only organization catalog. Edit them in the
  persona's `assets/chat-app.json`, run `node scripts/build-chat-app.js`, then use Pull
  and replace and Check for updates so a workspace shows the change. The page has no
  diagram editor.

The Playbooks tab's **How it works** canvas uses the pinned
`assets/command-playgrounds.json` manifest, separate from the unit's process map
and the Simulation. Give every mapped command a loop with the labels and
`runtimeNodeIds` of its registered stages, including actual human review gates.
Validate the manifest and open the canvas in the accepted workspace revision.

The shared **Apps** tab in Admin Settings and Team Detail → Context is a live
read of ready connector assignments on actual Canvas playbook cards. The admin
view relates command cards to the selected unit's actions and standalone Canvas
playbooks to the team's linked unit. Team Detail uses the same unit scope and
limits the results to that team's canvas.
Do not author a static app list for this tab. A provider mentioned in landing
copy, a published feed definition, or an account with no usable assignment does
not belong in it.

## Replace the visual world for another domain

The built-in fallback is a generic isometric building illustration. No restaurant
asset, domain label or action is hard-coded into the renderer. A persona may set
`scenes.organization`, `scenes.department`, `scenes.process` and `scenes.playbook`;
any hierarchy node may override its own `scene`. Each scene is:

```json
{ "imageUrl": "assets/organization-map/factory.webp", "alt": "A cutaway factory campus", "aspectRatio": 1.5 }
```

Store persona artwork in its own model repository under `assets/organization-map/`.
Use repository-relative `imageUrl` values as above (one plain filename, PNG/JPEG/
WebP/AVIF, at most 8 MB). The authenticated map image route resolves only images
declared by the active map, using the model revision pinned to that workspace's
accepted template and normal persona/workspace access checks. Workspace image requests read the model
repository at the source revision paired with its accepted template; reviewed
template updates advance that pin, including image-only changes. Never put persona artwork, colors,
coordinates or domain-specific layout JSON in the platform's source/public tree.
The platform supplies the renderer and neutral fallback only. Hosted HTTPS assets
and existing `/images/...` raster URLs remain supported for compatibility. The
image plane preserves the authored aspect ratio, and pins use its percentage
coordinates while panning and zooming. Scopes without their own image inherit the nearest ancestor scene. If an image
fails, try the next inherited scene before the generic building view. Constrain
panning and zooming so image edges cannot expose an empty canvas. Navigation and
actions remain available even when every scene fails.

Suggest a coherent set of artwork for the actual domain: campus/exterior,
department interiors and process workspaces, using the same architectural camera
and materials. For example a factory, hospital, corporate headquarters or logistics
hub can look entirely different while sharing this renderer. Generate or accept
replacement images through the available image tool; inspect them before placing
pins. Keep labels, people counts, automation counts and playbook controls out of
baked artwork: render those from definitions/runtime so they stay accurate and
translatable. A department-specific room belongs on that node, not on every
unrelated department through a global default.

## End-to-end perspectives

Optional `valueChains` is an array of `{ id, label, description?, nodeIds }`.
`nodeIds` orders existing department/process nodes across organizational boundaries.
Use it for supply chains, procure-to-pay, order-to-cash or a domain operating cycle.
The Buildings / End-to-end value chain switch reuses the same node IDs, available
playbook counts, drill-down, Run and simulation actions. A stage with no mapped
registered action is explicitly uncovered. Coverage is counted by distinct stages
with available playbooks, not reported as a percentage of measured automation.

Maximum 12 perspectives, 2–40 unique stage node IDs each. The full definition is
bounded to 100 hierarchy nodes and 200 descriptive connections. These are authoring
bounds, not event-volume benchmarks. Prefer focused views with a small set of
visible buildings/rooms; use perspectives to avoid a single unreadable network.
The authored sequence is a navigation aid, not a mandatory workflow or discovered
event log. Never invent cycle times, bottlenecks, process variants, realized ROI or
simulation results from playbook registration alone. Actual operational analytics
needs authorized events and object relationships from the persona's existing
ontology, Data Feeds, executions and outcome evidence.

## Workspace domains and generated scenes

For an enabled persona with workspaces, load [persona-workspaces](../persona-workspaces/SKILL.md)
as well. Domain, selected departments/sub-departments and generated scenes belong
to each workspace, rather than the public persona or a global domain switch.
Create Workspace and the first workspace onboarding step offer a Domain picker,
department selection and custom department hierarchy. Owners can change them in
Workspace settings; members cannot. A name-only API create still gets the default
domain without purchasing images. Existing workspaces retain their authored map
until an owner saves domain setup. Existing workspaces use pinned persona
definitions: after the authored map and its scene assets are published, use
Workspace settings → Check for updates to pull and adopt the map in one action.
The update preserves workspace custom settings, while the persona-authored map
definition and scene references always come from the reviewed published source.
Overlapping non-map edits are preserved from the workspace; invalid dependencies
or unsafe concurrent edits return an explicit error rather than silently losing data.

The persona definition's `chatApp.organizationMap.enabled` remains the opt-in. Only
explicitly enabled personas offer the workspace map toggle or header button.
An owner cannot activate maps through workspace metadata on a disabled persona.
Enable only the persona the user requested; never turn maps on for every persona
as part of a shared renderer change. Each persona owns its map DSL and scene files
in its own model repository. Archer is the active restaurant example; Chakri is
the active circular-materials example with an eleven-scene generated asset set.
Keep those layouts in their model repositories rather than copying
persona-specific nodes, colors, pins, value chains or image paths into platform
source.

### Release gate: local map versus production map

A local map preview proves only that the current checkout can render. Production
cannot see dirty or untracked files in a persona model repository, even when
Workspace settings → Check for updates reports that the workspace matches the
latest published revision. That status refers to the latest published persona
revision, not the developer's local checkout. Do not treat a local map as
production-ready until its DSL and every referenced scene image are committed
and pushed to the model repository's tracked branch.

Before handing off a map change, refresh that repository's remote-tracking refs
and run:

```sh
node server/skills/persona-organization-map/scripts/check-publication.cjs /path/to/persona-model
```

The check requires an explicitly enabled map, existing repository-local image
references, a clean worktree and a branch with no unpublished or missing upstream
commits. If publication was not authorized, report the exact local files and
state that production adoption is pending; never report that the map is live.
After an authorized push, use Workspace settings → Check for updates on the
author's workspace, confirm the returned source revision, and verify the map
button, all scenes and single-click drill-down in the target production persona.
For subscriber workspaces, the persona author must publish first; their owner
then checks for updates to adopt that released revision.

Author optional `publishedConfig.personaWorkspaces.organizationDefaultDomain`
and `organizationDomains` using the [domain blueprint example](references/workspace-domain.json).
Built-ins cover restaurant, retail, manufacturing, professional services, software,
general and a custom named domain. Authored templates can override these or add
domains (up to 12 authored templates). Each template has schemaVersion 1, id,
label, description, departments and optional scenes keyed by organization,
process or a declared node ID. Each department has id, label, optional parentId
and description, and processes with stable id/label and optional sourceProcessId.
That sourceProcessId refers to a process in the persona's authored map: the
workspace projection keeps only its current registered command actions offered
by a playbook-list. A blueprint never creates playbooks or grants capabilities.
Cross-persona and cross-workspace sharing are not implemented by this contract.

An accepted blueprint is saved with the workspace and retained across author
template changes until the owner selects a different domain. Owners select up
to 32 departments and may add up to 12 custom departments or sub-departments;
selected children must include their ancestors. Domain templates are editable
starting models, not discovered processes or a claim of regulatory compliance.

Scenes come from workspace-generated assets, then domain template overrides,
then the same-domain persona scenes. A different domain uses the neutral campus
at `/images/organization-maps/generic/campus.svg` until its own scenes are supplied.
Never reuse restaurant rooms for an unrelated domain. Managed generated-image
URLs under `/api/chat/generate/media/` are supported alongside HTTPS and public
raster assets. Other arbitrary SVG uploads are not accepted.

Image generation is explicit and paid: the creation checkbox or settings action
uses the existing image capability and workspace-owner credits. Generate a campus,
one interior for each selected department and sub-department, and one process room
for every process, with coherent framing/materials. Match the image to the exact
child count and marker center percentages, rather than reusing an unrelated room. The durable
queue reports progress and publishes scenes as a new workspace revision. An owner
retry resumes saved scene checkpoints for the unchanged selection; do not retry
paid generation automatically. Keep the usable map while generation is pending
or fails, and preserve old scene/domain snapshots for captured runs. Never start
image generation on a display read, member navigation, or a template update.

See [workspace domain implementation](references/workspace-domains.md)
for API payloads, activation and verification.

For the Celonis research and the distinction between authored coverage, operational
process mining and orchestration, read the platform note
`docs/architecture/persona-organization-map-celonis.md` when available.

## Model-only authoring and artwork

For a persona whose domain map is already supported by the shared renderer, make
the change in that persona's model repository: add `organizationMap` to
`assets/chat-app.json`, mirror the full Chat App projection to
`assets/chat-config.json` with the builder, and put all persona-specific artwork
under `assets/organization-map/`. Do not add persona IDs, domain labels, map
nodes, marker colors/positions, handoffs, image paths, public image copies or
domain-specific branching to `app/` or `server/src`. Change platform source only
when a reusable renderer or model-contract capability is missing; implement it
generically and keep the actual persona definition and assets in the model repo.

Use Codex's subscription image-generation tool for authored map artwork when it
is available. Generate a coherent campus image, a distinct scene for each
department, and a distinct process workspace for each process that needs its own
final zoom level. Prompts must leave labels, numbers, pins, connections, controls
and readable signage out of the image. Save selected raster files into the
persona's model repo before referencing them. If the subscription image tool is
unavailable, leave the opt-in false and ask before using any API/CLI fallback;
never claim placeholder or generic fallback artwork is the generated domain
scene. Inspect the artwork and compare every authored pin coordinate and
connection to visible image landmarks before activation.

## Apply and validate

The restaurant JSON in the skill references is a renderer test/example, not a
second source of truth for Archer's live map. For any live persona, read and edit
that persona's own `assets/chat-app.json`; keep its map images under
`assets/organization-map/` in the same model repository. This keeps subsequent
persona maps model-only changes when the shared renderer already supports the
required behavior.

1. Keep `enabled: false` (or omit it) while preparing the hierarchy and images.
   Activate only the requested persona with `enabled: true` after its scene assets
   are configured. The reference examples explicitly opt in; do not copy their
   activation to another persona by default.
   Author the hierarchy for the persona's actual domain. Name the processes with
   existing automation and useful neighboring departments; describe uncovered areas
   accurately. Map only the playbooks already registered for that persona.
2. Mirror the complete `chatApp` into `assets/chat-config.json` →
   `publishedConfig.chatApp`, preserving `chatAppRef.resourceKey`. Add source copy to
   the app's existing localization dictionary when translations are maintained.
3. Run the platform's current
   `server/skills/chat-app-builder/scripts/build-chat-app.js` with the persona
   repository as cwd, then run it again with `--check`. It mirrors the full Chat
   App and refreshes the model fingerprint without changing dependencies. A
   persona repository may contain an older copy of this script that rejects newer
   shared fields such as `organizationMap`; use the current platform builder
   rather than deleting valid fields to satisfy a stale copy.
4. Verify list/map switching, header access from several pages, zoom in and out,
   empty/unplaced areas, counts against the catalogue, browser navigation, mobile
   layout and that Run uses the original action with its normal input/approval flow.

Keep the portable definition in Git. Workspace membership, private records,
credentials, approvals and execution results stay in their existing runtime stores.
Only publish or push when requested. This map currently renders in the shared web
shell; it does not add a native Flutter map renderer.

### Delivering a model change to production

A Git push and a platform deployment do not advance an existing persona's
published definition pin or its subscribers' accepted workspace revisions.
After the authorized model push, use **Workspace settings → Check for updates**.
For the persona author who also owns that workspace, this one action reads the
latest Git published definition, pulls its exact commit through the supported
publication service, reviews the workspace merge and automatically applies the
update while preserving workspace custom settings, including image-only pin
changes. Persona-authored maps always replace stale map data. It refreshes the
running app; a separate Git pull or Apply click is unnecessary. Subscriber workspace
owners can adopt already published revisions but cannot publish the author's Git
changes. Members cannot trigger an update. Quality-schema-v2 personas retain
their candidate release approvals; an unapproved source revision produces an
explicit blocker rather than being silently activated. The separate review/apply
APIs remain available to callers that explicitly want to inspect or resolve other
conflicts.

The combined REST action is `POST /api/agent-configs/user/pages/{pageId}/persona-workspaces/{id}/template-updates/check`
with `{ expectedRevision }`. The separate review/apply APIs remain available for
callers that deliberately want a preview. Verify the updated workspace
uses the intended source revision and that its map button, background images and
department/process drill-down work. Preserve the owner's domain selections and
map opt-out; do not generate images or run playbooks during this delivery check.
A public page can overlay the latest Git content while a workspace still uses an
older accepted pin. A successful combined check must not report up to date after
a failed source read or pull. Inspect its explicit error before changing rendering
code or repeatedly redeploying the platform. Existing platform versions without
the combined action require an owner Git pull followed by workspace review/apply.

## Preserve presentation when projecting a workspace

Domain departments and processes support optional `color` and `position: {x,y}`;
templates support `connections` and `valueChains` with the same bounds and meaning
as the map DSL. Preserve these fields and source process aliases when building a
workspace map. Prune missing endpoints after department selection. Render detailed
connections between visible ancestor markers when zoomed out, then their individual
process endpoints when zoomed in. Keep arrow direction and handoff labels visible.
Each parent department has a stable color; child markers inherit the nearest color
unless explicitly overridden, including playbook and empty-state markers.

Review every visible marker against its background before activation: room counts,
pin centers, connections, the next interior and each process scene must agree.
An uncovered process stays in its own room and shows No registered playbooks.
Never add a playbook merely to make an empty map look populated. Existing
restaurant defaults and generation prompt provenance are documented in the platform
workspace-domain implementation and artwork-v2 manifest.
