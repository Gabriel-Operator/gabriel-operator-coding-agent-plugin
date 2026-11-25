# Workspace domains and organization maps

Each persona workspace can own an operating blueprint: domain, selected departments,
sub-departments, and scene images. The public persona supplies the allowed commands
and source process mappings. Choosing another domain changes this workspace's map
and operating context; it does not add capabilities or copy another workspace's data.

The map remains opt-in at the persona level (`chatApp.organizationMap.enabled: true`),
and can be disabled separately by a workspace owner. No map controls appear for a
persona that has not opted in. Archer's existing authored map provides its default
restaurant domain and artwork. Other domains start with neutral artwork, then can
generate their own campus and interiors using the existing image capability.

## Setup and settings

The first workspace step, New Workspace dialog, and Workspace settings share Domain
and department controls. Built-in blueprints cover restaurant, retail/e-commerce,
manufacturing, professional services, software, general business and a named custom
domain. The persona may supply up to 12 additional/overridden templates through
`personaWorkspaces.organizationDomains` and select an `organizationDefaultDomain`.
They are authored starting models, not mined event data or mandated SOPs.

Owners select departments and can add up to 12 custom departments/sub-departments
(32 selected departments total, six department levels). Selecting a child selects
its ancestors; deselecting a parent removes its descendants from the selection.
Department processes come from the accepted blueprint. `sourceProcessId` binds a
blueprint process to the source persona map process, filtered to command actions
already offered by the current persona's playbook-list. Areas without available
playbooks remain visible. Cross-persona/workspace playbook sharing is deferred.

Creation remains compatible with name-only clients: the server chooses a default
blueprint and never purchases images unless `generateImages: true` is supplied.
Existing workspaces without organization metadata retain their original authored
map until their owner saves domain setup. Deployment updates renderer code; existing
workspace definitions update through **Check for updates**. For an author-owned
workspace, this pulls the latest published Git definition and automatically applies
a conflict-free workspace update. Subscriber owners receive already published
changes. Only conflicting custom settings need the separate review/apply step;
quality-gated revisions retain their normal release approval.

## API and persistence

Browser root: `/api/agent-configs/user/pages/:pageId/persona-workspaces`.
Discovery returns `organizationSetup` (map availability, defaultDomainId, templates)
and each workspace's `organization`. Create accepts the following optional field:

```json
{
  "organization": {
    "domainId": "manufacturing",
    "departmentIds": ["marketing", "marketing-demand", "production"],
    "customDepartments": [],
    "mapEnabled": true,
    "generateImages": false
  }
}
```

`PATCH /:id` accepts the same field with the workspace's `expectedRevision` and
ordinary name/description metadata. Domain and map edits are owner-only, strictly
validated and compare-and-set against revision/update stamp. Source activation
cannot be bypassed by setting mapEnabled. Gateway/persona MCP create/update tools
accept the same organization field; first discover available template IDs.

The workspace stores its accepted template snapshot, selection, scenes and artwork
status. Domain/map changes and completed artwork publish new workspace revisions.
Historical revision records retain the previous blueprint and scenes. The pinned
definition loader derives the map and `workspaceContext.domain/departments` from
the selected revision. It preserves portable author instructions, command definitions,
resource IDs, repository pins, billing and approval rules. The runtime prompt adds
a bounded domain/department appendix explicitly treated as user-supplied task data;
it grants no authority and never rewrites the author assets. Original portable assets
remain separate from this runtime projection. Definition updates do not erase the
workspace's domain selection. No migration writes happen on navigation.

## Optional artwork generation

The creation checkbox opts into generation after provisioning. For an existing
saved map, `POST /:id/organization/images` takes `expectedRevision` and a unique
`requestId` (16–100 letters/digits/hyphens). Workspace settings no longer offers this action;
the persona author changes artwork from the map (see below).
The server checks ownership, source map activation, revision and active jobs.
Repeated requests with the same ID return the same status. Changed department
selections must be saved before generation; conflicting edits fail with 409.

The BullMQ worker (`workspace-organization-images`, REDIS_URL) runs at concurrency
two and rechecks workspace execution access before every provider call. It uses
the persona author's configured provider and the workspace owner's credits, creates
one campus, one interior per selected department/sub-department, and one process
room per process. Prompts include the exact child count, labels and marker center percentages.
Generated files use the existing managed-media storage route and asset library.
The creation form shows the complete image count before opting in. A usable template
map remains during generation.

Scene checkpoints are keyed by the domain/selection fingerprint. An explicit retry
after failure reuses completed scenes for that selection. Paid provider calls have
no automatic retries. Queue/provider/credit failures leave a retryable status and
the existing map. Browser polling stops once work finishes; the published revision
invalidates the active workspace definition and updates the map. No provider call
is made when simply opening a workspace or viewing the map.

Scene priority: workspace scenes → template node scenes → same-domain source scenes
→ neutral campus. The renderer inherits ancestor scenes and handles failures. Other
domains never fall back to restaurant-specific imagery. Custom scene uploads are
authored through the template DSL; UI generation is optional. All labels and markers
remain live UI, outside the baked artwork.

### Author-only artwork changes (map Edit button and Coach chip)

Only the persona's author, in their own workspace (`role` owner and
`definitionOwnerUserId` equal to the caller), may generate or change map images.
The map's top-right **Edit images** button and the Coach chip **Generate domain
images** (shown on the map view to the author only) open one dialog: an optional
description of the look (max 500 characters), then progress, then a review.
Images are generated beside the live map as a proposal stored in the workspace's
`organizationImageProposal`; the published `organization`, its revision and
`updatedAt` do not change until the author confirms.

- `GET /:id/organization/artwork` returns `{ canEdit }` (only `canEdit: false` for anyone else), plus the proposal and its previews for the author.
- `POST /:id/organization/artwork` takes a unique `requestId` and optional `prompt`; it queues the proposal job (`kind: 'proposal'` on the same BullMQ queue). One proposal runs at a time; repeating an ID returns the same state.
- `POST /:id/organization/artwork/confirm` publishes the proposal's scenes as one new workspace revision and clears it. It fails with 409 `ORGANIZATION_PROPOSAL_STALE` if the map's departments, markers or domain changed since generation, and 409 `ORGANIZATION_PROPOSAL_NOT_READY` while images are still being made. Repeating it after success is a no-op.
- `POST /:id/organization/artwork/discard` drops the proposal; a discarded run stops buying images.

A failed proposal keeps its finished images; a retry with the same description
reuses them, a changed description starts over. A run with no progress for 20
minutes counts as failed so it can be replaced.


## Verification

Focused tests cover blueprint/schema validation, selected ancestry, nested maps,
same-domain image reuse, foreign-domain fallback, registered-action filtering,
activation, create/settings controls, revision history and conflicts, owner-only
generation, owner billing, access revocation and checkpoint retry. Image provider
tests use mocks; they do not purchase artwork. Verify a local workspace save/reload
and switch between two workspace domains before deployment. Preserve separate
workspaces' records, permissions and captured run revisions.

## Geometry, handoffs and scene depth

Domain departments and their processes can declare `color` and percentage `position`.
Templates can declare `connections` and `valueChains` using their own node IDs. The
projection preserves source colors, positions with the same parent, descriptive
handoffs and end-to-end stage order; `sourceProcessId` remaps source graph endpoints
as well as allowed actions. Selecting fewer departments removes dangling stages
and edges. A detailed handoff is lifted to its visible ancestor departments when
zoomed out, with its direction and label retained. It remains a conceptual handoff,
not an execution dependency.

The bundled restaurant presentation defines six campus buildings, two Marketing
sub-departments, process-specific pin positions and artwork for all existing areas.
Its domain blueprint, marker coordinates/colors, handoffs, scene files and artwork
prompts live in Archer's persona model repository under `assets/organization-map/`.
The authored `personaWorkspaces.organizationDomains` template carries the same
portable layout; `chatApp.organizationMap` carries its registered playbook bindings.
The shared projection has no restaurant artwork/layout import or Archer URL.

Use `imageUrl: "assets/organization-map/kitchen.webp"` for model-owned images.
The authenticated Chat App image route admits only files declared by the active
map, rechecks persona/workspace access and reads the persona model repository at
the source revision pinned with the workspace's accepted template. Reviewed updates
advance this pin, including image-only changes. It never accepts a repository URL
or arbitrary commit from clients.
Raster files are bounded to 8 MB; paths outside that folder and SVG files are
rejected. The browser fetches with the normal workspace/auth headers, releases
blob URLs on scope changes and uses the existing ancestor/neutral fallback when
an image is unavailable.

Workspace-generated scenes retain precedence. Accepted templates and historical
workspace revisions stay pinned; deploy the framework, publish the persona model
assets, then use **Check for updates** to adopt the workspace template update.
Existing accepted domain
blueprints and generated scenes stay intact. Generated images are optional and
never run on a read.
Do not copy model images into the platform public directory as a deployment step.

## Organization map in Admin Settings

When the persona's `organizationMap` is enabled, the author's Admin Settings menu
offers **Organization map**: a tree of every unit with, for the selected unit, its
playbooks and the ontology entities, data lists, signals and feeds they take into
account (a department shows everything below it; anything no unit uses is listed
under **Not on the map**). The relations come from definitions: `actions[].commandId`
(or `command`) → the slash command's workflow → the `pipelineRef`/`pipelineId` of
its steps → the pipeline's list, plus `dataFeedInvocation.feedId`, declared
`listMapping.ontology` / `ontologyUsage`, signal presets' `sourceListRef` and
`actionId`. A process that lists no `actionIds`, a workflow that never names its
pipeline, and a list whose columns the ontology does not describe all show as gaps
there, so wire those in the persona's own files. The author can rename, describe
and add units for their workspace from that page; process `actionIds` stay in the
persona definition.
