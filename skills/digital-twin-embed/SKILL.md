---
name: digital-twin-embed
description: Maintain Git-backed Gabriel embed appearance via assets/embed-config.json.
---

# AI Persona Embed Skill

## Offline-first embeds

Read [the embedded runtime contract](references/offline-runtime-v1.md). Persist prepared guided-journey state and form submissions through the local repository when the host is an embedded app. Check action capabilities before enabling them, expose pending/blocked/conflict status, and reserve hosted endpoints for explicit online actions or manual synchronization.

Use this repository to update only the public embed appearance for one Gabriel AI Persona.

## Using this skill in coding agents

Gabriel Operator skills are designed for Claude Code, Codex, Cursor, Hermes, OpenClaw, and any agent that supports skill packs. Work in the git-backed embed repository connected to your AI Persona.

### Install the skill pack

| Agent | Install |
|-------|---------|
| **Claude Code** | Copy `server/skills/digital-twin-embed/` into `.claude/skills/digital-twin-embed/` |
| **Codex** | `codex plugin marketplace add Gabriel-Operator/gabriel-operator-coding-agent-plugin --sparse .agents/plugins` then install the Gabriel Operator plugin |
| **Cursor** | Copy `server/skills/digital-twin-embed/` to `.cursor/skills/digital-twin-embed/` (project) or `~/.cursor/skills/digital-twin-embed/` (global) |
| **Hermes / generic CLI** | `cp -R server/skills/digital-twin-embed ./your-embed-repo/` |
| **OpenClaw** | Copy `server/skills/digital-twin-embed/` into your OpenClaw workspace skills directory, then `openclaw gateway connect --url https://your-openclaw-gateway` |
| **Gabriel Operator monorepo** | `cp -R server/skills/digital-twin-embed ./your-git-repo/` |

Gabriel scaffolds this tree automatically when you connect a Git repository for embed appearance.

### Modify with your coding agent

1. Open the git-backed embed repository.
2. Tell your agent: *"Read `SKILL.md` and `references/embed-contract.json`, then update `assets/embed-config.json` for \<describe the embed change\> — hero copy, themes, backgrounds, conversion blocks, or widget appearance."*
3. Do not edit `assets/chat-config.json`; assistant runtime and page profile belong to the digital-twin-page skill.
4. Validate before committing:
   ```bash
   node scripts/validate-embed-config.js
   ```
5. Commit and push to the default branch.

**Example prompts:**
- *"Update the embed hero headline and CTA button color to match our brand."*
- *"Add a conversion block below the chat widget with a signup link."*
- **OpenClaw:** *"Read references/embed-contract.json, update assets/embed-config.json, and run the embed validator before committing."*

### Sync to Gabriel

1. Run `node scripts/validate-embed-config.js`.
2. Commit and push `assets/embed-config.json` to the default branch.
3. Gabriel pulls the JSON into the page database projection for public embed rendering.

## Source File
- Edit `assets/embed-config.json`.
- Do not edit `assets/chat-config.json`; assistant runtime and page profile are handled by other Git flows.
- Every initial and follow-up change request must be applied to `assets/embed-config.json`.

## Workflow
1. Read `references/embed-contract.json`.
2. Update `assets/embed-config.json`.
3. Run `node scripts/validate-embed-config.js`.
4. Commit and push to the default branch.
5. Gabriel pulls the JSON into the page database projection.

## Rules
- Preserve `schemaVersion` and `pageId`.
- Put appearance fields under `chatEmbedConfig`.
- Do not add API keys, access tokens, private owner ids, or unrelated workflow files.
