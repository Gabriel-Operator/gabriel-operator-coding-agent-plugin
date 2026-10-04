---
name: portable-persona-runtime
description: >
  Package a published Gabriel Persona candidate into a signed Portable Runtime
  bundle and deploy it to NVIDIA DGX Spark or compatible RTX Linux hardware.
  Use after Persona Builder / workspace publish, never from an unpublished branch.
metadata:
  author: gabriel-operator
  version: "1.0.0"
---

# Portable Persona Runtime

## Embedded runtime distinction

Read [the embedded runtime contract](references/offline-runtime-v1.md). The desktop/mobile embedded runtime uses encrypted SQLite and active-device execution. This skill continues to package the signed Docker appliance. State which environment is being targeted and never treat the appliance's MongoDB/Redis services as the phone or desktop embedded database.

This skill orchestrates packaging and device deployment. It does **not** itself
execute the agent. Local execution requires the signed runtime-only appliance.

Keep this distinct from `persona-export`, which is a prompt-only SDK kit and
leaves tools, knowledge, and slash commands hosted.

This skill ships from
[`Gabriel-Operator/portable-persona-runtime`](https://github.com/Gabriel-Operator/portable-persona-runtime).
The canonical development copy lives in the Gabriel Operator monorepo at
`server/skills/portable-persona-runtime/`.

Create the Persona first with
[`Gabriel-Operator/persona-builder`](https://github.com/Gabriel-Operator/persona-builder).
Do not deploy an unpublished moving branch.

## Using this skill in coding agents

Install **this** pack, then connect MCP.

| Agent | Install this skill |
|-------|---------|
| **NPX / Cursor / Windsurf** | `npx skills add Gabriel-Operator/portable-persona-runtime` |
| **Claude Code** | `/plugin marketplace add Gabriel-Operator/portable-persona-runtime` then `/plugin install portable-persona-runtime@portable-persona-runtime` (bundles the `gabriel` MCP server) |
| **Codex** | `codex plugin marketplace add Gabriel-Operator/portable-persona-runtime --sparse .agents/plugins` then install **Portable Persona Runtime** |
| **Grok Build** | `grok plugin marketplace add Gabriel-Operator/portable-persona-runtime` then `grok plugin install portable-persona-runtime --trust` |
| **OpenClaw** | `npx skills add Gabriel-Operator/portable-persona-runtime` then `openclaw gateway connect` |
| **Runtime fallback** | MCP `gabriel_get_skill_instructions` with `{ "topic": "portable-persona-runtime" }` |
| **Gabriel Operator monorepo** | `cp -R server/skills/portable-persona-runtime ./your-workspace/` |

Required MCP (workspace `gabi_` token).

**Claude Code:** the plugin ships `.mcp.json`, so the `gabriel` server is
configured on install. Only export the token, then start a new session:

```bash
export GABRIEL_TOKEN='gabi_...'
```

See [`gabriel-mcp-setup`](https://github.com/Gabriel-Operator/portable-persona-runtime/blob/main/skills/gabriel-mcp-setup/SKILL.md)
if the server does not connect.

**Other agents:** configure it by hand.

```json
{
  "mcpServers": {
    "gabriel": {
      "type": "http",
      "url": "https://gabrieloperator.com/mcp/gateway",
      "headers": {
        "Authorization": "Bearer gabi_<token>"
      }
    }
  }
}
```

Local origin example: `http://localhost:3000/mcp/gateway` (or set
`GABRIEL_MCP_URL` when using the bundled config).

## Prerequisites

- A **published workspace candidate** (`gabriel_publish_workspace`) with passing
  required mock evals.
- Owner consent to deploy to a computer they control.
- Device: DGX Spark Linux ARM64 (first) or RTX Linux x86_64 with 24 GB+ unified
  or dedicated GPU memory.

## Compatibility analysis

Call `gabriel_analyze_portable_runtime` with `{ "pageId": "<id>" }`.

Classify every dependency:

| Class | Meaning |
|---|---|
| `local-capable` | Runs on the appliance with WAN blocked |
| `cloud-required` | Needs consented egress (web, SaaS, Gemini Live, meetings, telephony, cloud media) |
| `licensed` | Missing license or connector credentials |
| `unavailable` | Optional and disabled |

Core chat, knowledge, skills, workflows, lists/pipelines, sandbox, API, and MCP
must be able to start even when optional online capabilities are off.

## Bundle creation

1. Confirm the candidate SHA from `gabriel_get_persona_readiness`.
2. Call `gabriel_create_portable_runtime_bundle`. Never compile from a moving unpublished branch.
3. Download with `gabriel_download_portable_runtime_bundle`.
4. The bundle contains `portable-runtime-manifest.json`, child fingerprints,
   exportable skills, and optional knowledge files. It does **not** contain
   database IDs, device settings, credentials, or model weights.

## Device activation

`gabriel_activate_portable_runtime_device` issues a signed, cacheable offline
lease. Revoke with `gabriel_revoke_portable_runtime_device`. Do not embed
Gabriel or registry credentials in the appliance image.

## Install and deploy

On the device:

```bash
curl -fsSL https://downloads.gabrieloperator.com/portable-runtime/install.sh | bash
gabriel-portable doctor --json
gabriel-portable install
gabriel-portable start
gabriel-portable pair
gabriel-portable deploy ./signed-bundle.json
```

`install.sh` checks `SHA256SUMS` before extracting. The folder URL
`https://downloads.gabrieloperator.com/portable-runtime/` is a file listing, not
the Gabriel repository.

Same-computer desktop pairing uses `~/.gabriel-portable/local-secret`. LAN pairing
prints a code and certificate fingerprint — confirm both in Gabriel Operator
desktop before connecting.

Then run local evals: `gabriel_run_persona_evals` with `"mode": "local"` against
the exact imported candidate. Assertions are not weakened.

## Update / rollback

`gabriel_get_portable_runtime_updates` returns signed update metadata.
`gabriel-portable update` and `gabriel-portable rollback` switch appliance
versions. Jobs must resume from local queues without duplicate side effects.

## Hybrid escalation

Device policy is `offline | local-first | hybrid` and lives on the device, never
in `chat-config.json`. Before any advisor call: minimize context, run PII/secret
detection, show the payload, record consent, and return **text guidance only**.
The cloud advisor must never receive local tool or filesystem authority.

## Owner UI

Use **Deploy to computer** on the Persona SDK panel for device health, capability
class, current candidate revision, update/rollback, and local-eval status.

## MCP tools for this skill

| Tool | Purpose |
|---|---|
| `gabriel_get_persona_readiness` | Confirm the published candidate SHA and eval gates |
| `gabriel_analyze_portable_runtime` | Classify local vs cloud-required capabilities |
| `gabriel_create_portable_runtime_bundle` | Sign a bundle from the published candidate |
| `gabriel_download_portable_runtime_bundle` | Download the signed bundle JSON |
| `gabriel_activate_portable_runtime_device` | Issue a signed offline device lease |
| `gabriel_revoke_portable_runtime_device` | Revoke a device entitlement |
| `gabriel_get_portable_runtime_status` | Device health, candidate revision, local-eval status |
| `gabriel_get_portable_runtime_updates` | Signed update and rollback metadata |
| `gabriel_run_persona_evals` | Run mock suites or `"mode": "local"` against the imported candidate |
| `gabriel_get_skill_instructions` | Load this skill or child topics |

## REST fallback

```bash
AUTH='Authorization: Bearer gabi_<token>'
BASE=https://gabrieloperator.com
PAGE='{pageId}'

curl -sS -H "$AUTH" "$BASE/api/gateway/pages/$PAGE/portable-runtime/compatibility"
curl -sS -X POST -H "$AUTH" -H 'Content-Type: application/json' \
  "$BASE/api/gateway/pages/$PAGE/portable-runtime/bundles"
```
