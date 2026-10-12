# Gabriel Operator Plugin

Skills-first plugin for creating Gabriel AI Personas from a Gabi token and authoring Gabriel Operator assets. One repo, multiple client manifests:

| Standard / client | Location |
| --- | --- |
| **Agent Plugins 1.0** | root [`plugin.json`](plugin.json) + `skills/` |
| **Codex / ChatGPT** | [`.codex-plugin/`](.codex-plugin/) + [`.agents/plugins/marketplace.json`](.agents/plugins/marketplace.json) |
| **Cursor** | [`.cursor-plugin/`](.cursor-plugin/) |
| **Claude Code** | [`.claude-plugin/`](.claude-plugin/) |
| **Grok Build** | [`.grok-plugin/`](.grok-plugin/) |

Antigravity, Hermes, OpenClaw, Copilot, and peers consume the same `skills/<name>/SKILL.md` tree (Agent Skills / Agent Plugins layout).

## Included Skills

Version 1.6.0 makes the Persona operating framework explicit: source evidence
and ontology → Signals → reviewed playbooks → committed outcomes → ROI and
reviewable feedback. `persona-framework` routes to `persona-ontology`,
`persona-data-feeds`, `persona-signals`, `persona-playbooks`, and `persona-roi`.
The full coding-agent skills and reduced ChatGPT draft skills describe the same
contracts while retaining their respective live-operation permissions.

Create-from-scratch vs edit-existing:

- `persona-builder` interviews a user and **provisions** a new AI Persona (page, lists, pipeline, workflows, git, team agents, publish). Submodule from [`Gabriel-Operator/persona-builder`](https://github.com/Gabriel-Operator/persona-builder). Also listed as its own marketplace plugin so Codex/Claude/Cursor/Grok can install it without relying on the child-editing skills alone.
- `gabriel-operator` is the gateway bootstrap skill. Submodule from [`Gabriel-Operator/gabriel-operator-skills`](https://github.com/Gabriel-Operator/gabriel-operator-skills).
- `workflow-builder` for browser/API/agent workflow JSON, included as a submodule from `go-code-bot/go-workflow-builder-skills`.
- `team-agents` for Page Builder team-agent endpoint workflows, included as a submodule from `go-code-bot/team-agents`.
- `page-builder` for PageBuilderConfig apps, pages, components, data binding, and events. This is copied into the plugin until a dedicated page-builder skill repository exists.
- `pipeline-builder` for Git-backed pipeline state machines, included as a submodule from `go-code-bot/pipeline-builder`.
- `list-builder` for Git-backed personal data list schemas, included as a submodule from `go-code-bot/list-builder`.
- `digital-twin-page` for Git-backed public chat and digital twin page configuration, included as a submodule from `go-code-bot/go-digital-twin-page-skills`.
- `persona-ontology` for the parent Persona's `assets/ontology.json`, entity/attribute/relationship definitions, and Data Feed semantic references. Includes a standalone local validator.
- `todo-builder` for Git-backed personal To-Do workspaces (`assets/todos.json`). Copied from the Gabriel Operator monorepo until a dedicated public skill repository exists.
- `application` for Applications (`app-config.json`, `mcp-app.html`, Applications tab UI). Copied from the monorepo until a dedicated skill repository exists.
- `digital-twin-embed` for embed appearance (`assets/embed-config.json`). Copied from the monorepo until a dedicated skill repository exists.
- `asset-library` for Git-backed generated asset and Remotion movie manifests. Copied from the monorepo until a dedicated skill repository exists.
- `video-use` edits real video footage by conversation — cuts, color grading, word-level speech-synced captions, and animation overlays (HyperFrames, Remotion, Manim, or PIL). Submodule from the upstream project, [`browser-use/video-use`](https://github.com/browser-use/video-use) (third-party, not a Gabriel Operator skill — vendored as-is since its own `SKILL.md`/`helpers/` layout already matches the Agent Skills convention).

`go-code-bot/go-task-orchestrator-skills` is not included because it is an older `team-agents` package and would duplicate the current `team-agents` skill name.

## Clone With Submodules

```bash
git clone --recurse-submodules https://github.com/Gabriel-Operator/gabriel-operator-coding-agent-plugin.git
```

For an existing clone:

```bash
git submodule update --init --recursive
```

## Install

### Short skills alias (marketing / CLI)

```bash
npx skills add Gabriel-Operator/gabriel-workflow-builder
npx github:Gabriel-Operator/gabriel-cli scaffold persona
```

### Codex / ChatGPT

Create a persona from scratch (install **Persona Builder** from this marketplace, or add the dedicated repo):

```bash
codex plugin marketplace add Gabriel-Operator/persona-builder --sparse .agents/plugins
```

Child JSON authoring for resources that already exist:

```bash
codex plugin marketplace add Gabriel-Operator/gabriel-operator-coding-agent-plugin --sparse .agents/plugins
```

That marketplace lists **Persona Builder** and **Gabriel Operator**. Install Persona Builder for the interview flow; install Gabriel Operator for workflow-builder, list-builder, and the other edit skills.

For OpenAI public-directory review, do not upload the full cross-platform
`skills/workflow-builder/` bundle. Upload the reduced authoring-only bundle at
[`skills-openai/workflow-builder/`](skills-openai/workflow-builder/) as the
`workflow-builder` replacement. It intentionally excludes remote installation,
deployment, execution, credentials, unrestricted integrations, and external
write actions. The full bundle remains available for local/private plugin use.

Public directory: submit via
[platform.openai.com/plugins](https://platform.openai.com/plugins).

### Cursor

Local test:

```bash
ln -s "$(pwd)" ~/.cursor/plugins/local/gabriel-operator
```

Official listing: [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). Team marketplace: Dashboard → Plugins → Import from Repo.

### Claude Code

```text
/plugin marketplace add Gabriel-Operator/persona-builder
/plugin install persona-builder@persona-builder
```

Authoring plugin (edit existing git-backed resources, and Persona Builder when `skills/persona-builder` is present):

```text
/plugin marketplace add Gabriel-Operator/gabriel-operator-coding-agent-plugin
/plugin install persona-builder@gabriel-operator
/plugin install gabriel-operator@gabriel-operator
```

Or:

```bash
npx skills add Gabriel-Operator/gabriel-workflow-builder
# or the full plugin:
npx skills add Gabriel-Operator/gabriel-operator-coding-agent-plugin
```

### Grok Build

```bash
grok plugin marketplace add Gabriel-Operator/persona-builder
grok plugin install persona-builder --trust
```

Authoring plugin:

```bash
grok plugin marketplace add Gabriel-Operator/gabriel-operator-coding-agent-plugin
grok plugin install persona-builder --trust
grok plugin install gabriel-operator --trust
```

Official xAI catalog: open a PR against [xai-org/plugin-marketplace](https://github.com/xai-org/plugin-marketplace) with a SHA-pinned remote source (see repo docs).

### Antigravity

Copy or link `skills/*` into:

- Project: `.agents/skills/`
- Global: `~/.agents/skills/` or `~/.gemini/config/skills/` (CLI paths may differ)

There is no separate Antigravity public plugin submission portal for third-party catalogs.

### Agent Plugins clients (VS Code, Copilot, Kiro, …)

Clients that implement [Agent Plugins](https://agentplugins.org) load root `plugin.json` and discover `skills/*/SKILL.md`.

## Notes

This plugin intentionally bundles skills only. It does not include MCP servers or app connectors yet.

Short skills alias: [`Gabriel-Operator/gabriel-workflow-builder`](https://github.com/Gabriel-Operator/gabriel-workflow-builder). CLI: [`Gabriel-Operator/gabriel-cli`](https://github.com/Gabriel-Operator/gabriel-cli).
