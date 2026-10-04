---
name: application
description: >
  Build and maintain Gabriel Operator Applications — git-backed interactive web apps
  with an app-config.json definition, a full-page index.html (shown in the Applications
  tab), and a compact mcp-app.html that renders as an interactive MCP App iframe inline
  in chat when a slash command completes. Use this skill when building dashboards,
  data visualizers, product pickers, cart viewers, or any result UI tied to a digital
  twin slash command. Each Application reads live pipeline data via its API key.
metadata:
  author: gabriel-operator
  version: "1.0"
  compatibility: Node.js 18+ for scripts. mcp-app.html uses ESM CDN — no bundler needed.
---

# Application Skill

## Offline-first applications

Read [the embedded runtime contract](references/offline-runtime-v1.md). When hosted inside Gabriel mobile or desktop local mode, bind reads and writes to the local repository and render queued, blocked, conflict, and partially available states. CDN modules and live API-key reads still require connectivity, so a fully offline application must package its UI assets and declare only compatible local data/actions.

## Using this skill in coding agents

Gabriel Operator skills are designed for Claude Code, Codex, Cursor, Hermes, OpenClaw, and any agent that supports skill packs. Work in the git-backed Application repository connected to your AI Persona slash command.

### Install the skill pack

| Agent | Install |
|-------|---------|
| **Claude Code** | Copy `server/skills/application/` into `.claude/skills/application/` |
| **Codex** | `codex plugin marketplace add Gabriel-Operator/gabriel-operator-coding-agent-plugin --sparse .agents/plugins` then install the Gabriel Operator plugin |
| **Cursor** | Copy `server/skills/application/` to `.cursor/skills/application/` (project) or `~/.cursor/skills/application/` (global) |
| **Hermes / generic CLI** | `cp -R server/skills/application ./your-app-repo/` |
| **OpenClaw** | Copy `server/skills/application/` into your OpenClaw workspace skills directory, then `openclaw gateway connect --url https://your-openclaw-gateway` |
| **Gabriel Operator monorepo** | `cp -R server/skills/application ./your-git-repo/` |

Gabriel scaffolds this tree when you connect Git to an Application in the AI Persona configure flow.

### Modify with your coding agent

1. Open the git-backed Application repository.
2. Tell your agent: *"Read `SKILL.md` and update `app-config.json`, `mcp-app.html`, and/or `public/index.html` for \<describe the UI change\>. The MCP app renders inline in chat; index.html is the full Applications tab view."*
3. Consult `references/APP-CONFIG-SCHEMA.md` and `references/MCP-APP-GUIDE.md` for data connections and guest SDK usage.
4. Commit and push to the default branch.

**Example prompts:**
- *"Build an MCP app that displays slash-command results as a sortable product table."*
- *"Add a chart to the full-page Applications view using live pipeline data."*
- **OpenClaw:** *"Update app-config.json and mcp-app.html so the inline MCP app renders slash-command results with the new layout."*

### Preview in Gabriel

1. Commit and push your changes to the default branch.
2. **MCP inline view:** Link the Application in a slash command's `resultApp.applicationId`; the updated `mcp-app.html` renders inside chat when the command completes. In development, the server hot-reloads `mcp-app.html` on each request.
3. **Full-page view:** Open the Applications tab on your AI Persona to preview `public/index.html`.
4. In production, push a new commit to pick up cached content after deploy.

## Canonical files

Every Application repository contains:

| File | Purpose |
|------|---------|
| `app-config.json` | Machine-readable definition (schema version, embed config, data connections) |
| `public/index.html` | Full-page embed shown in the Applications tab |
| `mcp-app.html` | Compact inline MCP App iframe shown in chat when a slash command links this app |
| `SKILL.md` | This file — how agents interact with the app |
| `README.md` | Human overview, quick start, and API reference |
| `.env.example` | Environment variable template |

## app-config.json schema

```json
{
  "schemaVersion": 1,
  "id": "<application-id>",
  "name": "My App",
  "version": "1.0.0",
  "embedConfig": {
    "type": "static_files",
    "publicDir": "public",
    "mcpApp": {
      "entrypoint": "mcp-app.html"
    }
  },
  "dataConnections": [
    { "collectionId": "<pipeline-collection-id>", "accessMode": "read" }
  ],
  "slashCommandDefaults": {
    "trigger": "my-command",
    "showOnCompletion": true
  }
}
```

**`embedConfig.type` values:**
- `static_files` — serves `public/` directory (git-backed)
- `raw_html` — inline HTML stored in DB (no git needed)
- `iframe_url` — embeds an external URL
- `external_link` — opens a URL in a new tab

## mcp-app.html — inline MCP App iframe

This file is shown **inside the chat** when a slash command has `resultApp.applicationId` set to this Application. It uses the `@modelcontextprotocol/ext-apps` guest SDK.

### Minimal starter

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  body { font-family: system-ui; background: #18181b; color: #f4f4f5;
         padding: 16px; opacity: 0; transition: opacity 0.15s; }
  body.ready { opacity: 1; }
</style>
</head>
<body>
<div id="root">Waiting…</div>
<script type="module">
import { App } from 'https://cdn.jsdelivr.net/npm/@modelcontextprotocol/ext-apps/+esm';
const app = new App({ name: 'MyApp', version: '1.0.0' });

// Fired when the host delivers the slash command result as tool input
app.ontoolinput = (params) => {
  document.getElementById('root').textContent = JSON.stringify(params.arguments, null, 2);
  document.body.classList.add('ready');
};

await app.connect();
setTimeout(() => document.body.classList.add('ready'), 150);
</script>
</body>
</html>
```

### Guest SDK API

| Method / Callback | Description |
|---|---|
| `app.ontoolinput = (params) => {}` | Called with `params.arguments` containing the slash command result data |
| `await app.callServerTool({ name, arguments })` | Call a Gabriel Operator tool from inside the iframe |
| `await app.sendMessage({ role, content })` | Inject a message into the agent chat, triggering a new turn |
| `await app.connect()` | Establish postMessage connection to host — call after registering handlers |

## Linking an Application to a slash command

In `DigitalTwinAgentsColumn`, open a slash command and use the **Result Application** dropdown to select this Application. This stores `resultApp.applicationId` on the command config.

When the command completes successfully, the host:
1. Fetches `mcp-app.html` from the Application's git repo (or DB)
2. Renders it in a sandboxed iframe below the text response
3. Delivers the command result as `ontoolinput`

## Data API

Applications read live data from connected pipeline collections via their API key.

```javascript
// Inside mcp-app.html or public/index.html
const API_KEY = 'dak_...'; // from Applications > Docs > API Keys
const PAGE_ID = '<pageId>';
const COLLECTION_ID = '<collectionId>';

const res = await fetch(
  `/api/data-api/${PAGE_ID}/${COLLECTION_ID}/records?limit=20`,
  { headers: { Authorization: `Bearer ${API_KEY}` } }
);
const { records } = await res.json();
```

See `references/APP-CONFIG-SCHEMA.md` for the full data API reference.

## Updating the app

Edit `mcp-app.html` directly in the git repo. The server re-reads it on every request in development (hot-reload). In production, content is cached — push a new commit and redeploy to pick up changes.

Edit `public/index.html` (or build to `public/`) for the full-page Applications tab view.
