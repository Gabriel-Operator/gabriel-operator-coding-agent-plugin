---
name: page-builder
description: >
  Orchestrator skill for generating PageBuilderConfig JSON that powers Gabriel Operator's
  universal app renderer. Covers web apps, mobile apps, and landing pages.
  Routes work to category-specific child skills for components and structural
  concerns.
metadata:
  version: 1.0.0
  author: gabriel-operator
  tags:
    - page-builder
    - config-generation
    - app-builder
    - landing-page
    - web-app
    - mobile-app
  compatibility:
    runtime: server
    requires:
      - server/skills/page-builder/references/SCHEMA.md
      - server/skills/page-builder/references/CROSS-CUTTING.md
      - server/skills/page-builder/references/TEMPLATE.md
      - server/skills/page-builder/references/COMPONENT-REGISTRY.md
      - server/skills/page-builder/references/TEMPLATES-CATALOG.md
---

# Page Builder Orchestrator

## Offline-first pages

Read [the embedded runtime contract](references/offline-runtime-v1.md). Generate pages that can bind to local repositories and capability reports. Actions that are unavailable in the active environment must render blocked or partially available states; mutations must expose pending/conflict state until the user explicitly synchronizes. Package required UI assets for cold offline startup.

Generate complete `PageBuilderConfig` JSON objects that the Gabriel Operator platform
renders into fully functional web apps, mobile apps, and landing pages.

---

## Using this skill in coding agents

Gabriel Operator skills are designed for Claude Code, Codex, Cursor, Hermes, OpenClaw, and any agent that supports skill packs. Work in the git-backed repository connected to your Gabriel Page Builder app.

### Install the skill pack

| Agent | Install |
|-------|---------|
| **Claude Code** | `npx skills add Gabriel-Operator/gabriel-operator-coding-agent-plugin` or copy this folder into `.claude/skills/page-builder/` |
| **Codex** | `codex plugin marketplace add Gabriel-Operator/gabriel-operator-coding-agent-plugin --sparse .agents/plugins` then install the Gabriel Operator plugin (includes `page-builder`) |
| **Cursor** | Copy `server/skills/page-builder/` to `.cursor/skills/page-builder/` (project) or `~/.cursor/skills/page-builder/` (global) |
| **Hermes / generic CLI** | `cp -R server/skills/page-builder ./your-app-repo/` |
| **OpenClaw** | `npx skills add Gabriel-Operator/gabriel-operator-coding-agent-plugin` (bundles page-builder) then `openclaw gateway connect --url https://your-openclaw-gateway` |
| **Gabriel Operator monorepo** | `cp -R server/skills/page-builder ./your-git-repo/` |

There is no dedicated `go-code-bot/page-builder` package yet; the Codex plugin and monorepo copy are the supported install paths.

### Modify with your coding agent

1. Open the git-backed Page Builder app repository (or copy the skill scaffold into your app repo).
2. Tell your agent: *"Read `SKILL.md` and update the PageBuilderConfig JSON — `pages`, `navSections`, `collections`, `endpoints`, `theme`, and related fields — for \<describe your app change\>. Consult child component skills under `components/` and `structural/` before editing."*
3. Use `references/SCHEMA.md` and `references/COMPONENT-REGISTRY.md` for field shapes.
4. Commit and push to the default branch.

**Example prompts:**
- *"Add a dashboard page with a data table bound to the users collection."*
- *"Wire a new POST endpoint and connect it to a form submit event."*
- **OpenClaw:** *"Read SKILL.md and update the PageBuilderConfig JSON for this app — add the requested page, components, and data bindings."*

### Deploy and preview

1. Push your config to the default branch, or update via the app API:
   ```
   GET /api/agent-configs/teams/:teamId/business-units/:businessUnitId/apps/:appId
   PUT /api/agent-configs/teams/:teamId/business-units/:businessUnitId/apps/:appId
   ```
2. Open the app in Gabriel Page Builder to preview pages, navigation, and data bindings live.

---

## When to use

Use this skill when a user asks you to:

- Create, modify, or extend a PageBuilderConfig
- Build a new web app, mobile app, or landing page
- Add pages, components, navigation sections, collections, or endpoints to an
  existing config
- Wire up data bindings, events, or theme settings
- Understand the PageBuilderConfig schema or available component types

---

## PageBuilderConfig overview

A PageBuilderConfig is a single JSON document that fully describes an
application. The renderer reads it and produces a running app with no additional
code.

| Field | Purpose |
|---|---|
| `pages` | Array of `PageDefinition` objects (required, backward compat) |
| `navSections` | Grouped navigation — new source of truth for sidebar/nav |
| `appType` | `'web-app'` \| `'mobile-app'` \| `'landing-page'` |
| `appName` | Display name of the application |
| `theme` | `ThemeConfig` — palette, font, colors |
| `pageTheme` | Named preset theme |
| `colorMode` | `'light'` \| `'dark'` \| `'system'` |
| `collections` | Data collections (like DB tables) |
| `endpoints` | API endpoint definitions |
| `connectors` | External integrations via agents |
| `overrideConfig` | Runtime overrides for templates, components, endpoints |
| `billingProducts` | Stripe billing plans |
| `monitoring` | PostHog / Google Analytics config |
| `googleSignIn` | Google OAuth settings |
| `llm` | Default LLM model config |

See `references/SCHEMA.md` for the complete field-by-field specification.

---

## Component routing table

Every `componentType` maps to exactly one category child skill. When generating
or modifying components, consult the relevant child skill for props, data
binding details, and examples.

| Category Skill | Component Types |
|---|---|
| **component-charts** | `kpi-card`, `line-chart`, `area-chart`, `bar-chart`, `donut-chart` |
| **component-tables** | `table`, `ranking-table`, `pages-table`, `queries-table`, `tracked-topics-table`, `clients-table` |
| **component-content** | `text`, `article-list`, `article-editor`, `data-list` |
| **component-ai-analytics** | `ai-mentions`, `header-summary`, `header-chart`, `insights-list`, `actions-list`, `brand-profile`, `competitors-manager`, `entity-mapper`, `writing-style-guide`, `knowledge-sources`, `sentiment-bar`, `share-of-voice-chart`, `metric-bars`, `response-history`, `status-tags` |
| **component-nav-layout** | `sidebar`, `dashboard-header`, `header-actions`, `filter-bar` |
| **component-landing** | `landing-hero`, `landing-feature`, `landing-trust`, `landing-faq`, `landing-cta`, `landing-footer`, `landing-nav`, `landing-logos`, `landing-search-hero` |
| **component-auth-forms** | `login-form`, `forgot-password-form`, `signup-form`, `signup-left-panel`, `onboarding-step` |
| **component-actions-ui** | `button`, `link`, `action-card`, `quick-action-card`, `project-card`, `card`, `modal`, `form-group` |
| **component-integrations** | `connect-integration`, `connect-banner`, `connections-manager`, `account-info-form` |
| **component-health-audit** | `health-gauges`, `health-gauge`, `web-vitals`, `audit-issues`, `page-audit-header` |
| **component-topics** | `topic-list`, `platform-performance` |

**Total: 68 component types across 11 category skills.**

---

## Structural routing table

Structural concerns span multiple component types. Consult these child skills
for cross-cutting architecture questions.

| Structural Skill | Covers |
|---|---|
| **page-structure** | `NavSection`, `PageDefinition`, routing, grid layouts, page ordering |
| **data-binding** | `DataBinding`, `DataBindingMapping`, `queryConfig`, sources, filters, cached data |
| **event-system** | `ComponentEvent`, `EventAction`, all action types (`navigate`, `api_call`, `call_workflow`, `set_state`, `open_modal`, `submit_form`, `auth_login`, `auth_register`, `auth_forgot_password`, `auth_magic_link`) |
| **collections-endpoints** | `CollectionDefinition`, `EndpointDefinition`, field types, handler types |
| **theme-config** | `ThemeConfig`, `PageTheme`, `ColorMode`, palettes, fonts, color names |
| **app-config** | Billing (`BillingProductConfig`), monitoring, Google sign-in, LLM defaults, `overrideConfig` |
| **template-assembly** | Template manifests, seed data, `linkedCollections`, template IDs |

---

## Step-by-step build guide

Follow these 8 steps when creating a new PageBuilderConfig from scratch:

### Step 1 — Determine app type and theme

Choose `appType` (`web-app`, `mobile-app`, or `landing-page`) and optionally
select a `pageTheme` preset. Set `appName`.

### Step 2 — Define collections

Create `CollectionDefinition` objects for every data entity the app needs.
Each collection has an `id` (UUID), `name`, and `fields` array.

### Step 3 — Define endpoints

Create `EndpointDefinition` objects for API routes. Link them to collections
or agent workflows as needed.

### Step 4 — Set up navigation structure

Create `navSections` to organize pages into sidebar groups. Each section
contains an array of `PageDefinition` objects.

### Step 5 — Build pages and components

For each page, add `ComponentInstance` objects. Use the component routing table
above to find the correct category skill, then consult that skill for required
props and data binding patterns.

### Step 6 — Wire data bindings

For components that display dynamic data, add `dataBinding` with appropriate
`mappings`, `queryConfig`, and `sources`. See the **data-binding** structural
skill.

### Step 7 — Add events and actions

For interactive components, define `events` arrays with `ComponentEvent`
objects. Each event contains `actions` that fire on the trigger. See the
**event-system** structural skill.

### Step 8 — Configure theme and app settings

Set `theme` (palette, font, colors), `colorMode`, billing products, monitoring,
and any `overrideConfig` values.

---

## API endpoint reference

### Save / Update config

```
PUT /api/agent-configs/teams/:teamId/business-units/:businessUnitId/apps/:appId
Content-Type: application/json

Body: PageBuilderConfig
```

### Retrieve config

```
GET /api/agent-configs/teams/:teamId/business-units/:businessUnitId/apps/:appId
```

The response body is the full `PageBuilderConfig` JSON.

---

## ID generation guidance

- **Pages**: Use UUID v4 — e.g. `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`
- **Components**: Use UUID v4 — must be unique within the entire config
- **Collections**: Use UUID v4
- **Endpoints**: Use UUID v4
- **NavSections**: Use UUID v4
- **Events**: Use UUID v4
- **Event actions**: Use UUID v4

Always generate fresh UUIDs. Never reuse IDs across different entities.

---

## Script references

Build and validation scripts are located in the `scripts/` subdirectory of this
skill folder. Consult them for automated config validation and template
generation utilities.
