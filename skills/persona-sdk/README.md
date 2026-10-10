# Gabriel Persona SDK Kit

Embed your Gabriel AI persona anywhere — your backend, a Claude agent, a Codex sandbox, an MCP client — using a key that reaches **only this persona**.

The persona itself (its model, system prompt, tools, knowledge) keeps running on Gabriel; this kit is the connection. That means your Composio connections, meeting tools, and knowledge stay live, and revoking the key instantly cuts access.

## Quick start

```bash
cp .env.example .env    # paste your Persona Token (GABRIEL_API_KEY)
npx tsx examples/chat.ts
```

## Contents

| Path | What it is |
|---|---|
| `typescript/` | `@gabriel-operator/persona-sdk` source — typed, zero-dependency client. Prefer `npm install @gabriel-operator/persona-sdk`; this copy is the offline fallback (`npm run build` → ESM+CJS+types) |
| `python/` | `gabriel_persona` package — same surface for Python |
| `examples/chat.ts` | Basic chat + conversation continuation |
| `examples/stream.ts` | Token streaming |
| `examples/realtime.ts` | Realtime WebSocket conversation, cancellation, and platform subscriptions |
| `examples/python-realtime.py` | Python realtime client using the optional WebSocket dependency |
| `examples/openai-compat.ts` | Official OpenAI SDK pointed at your persona (no Gabriel SDK needed) |
| `examples/claude-agent-tool.ts` | Persona as a tool inside a Claude agent |
| `examples/mcp.json` | One-block MCP config for Claude Code / Claude Desktop / Cursor |
| `SKILL.md` | Instructions for coding agents working in this kit |

Want the persona fully on your own model keys? Download the separate **export bundle** from the persona's SDK tab — it contains a portable `agent.json` plus Claude Agent SDK and Mastra scaffolds.

## Security

- The credential is a **Persona Token**: it cannot list, configure, or touch anything else in the workspace. It is not the workspace Gateway key from Dashboard or Developer Settings.
- Keep the long-lived token server-side. Browser apps should receive only a 60-second, single-use realtime client secret from your backend.
- Revoke/rotate tokens anytime from Chat Publish → SDK / API Integration → Persona Token, or Via Coding Agent → SDK.

## HTTP, SSE, and WebSocket

- HTTP remains authoritative for normal requests, media, files, and batch speech/transcription.
- Existing Chat Completions and Responses streaming use SSE; `GET /api/v1/events` adds resumable `gabriel.*` platform events.
- `POST /api/v1/realtime/client_secrets` mints a one-time credential for the text/event WebSocket at `/api/v1/realtime`.

The WebSocket protocol is an OpenAI Realtime-compatible subset for text, tools, cancellation, and Gabriel platform events. Realtime audio is not claimed or supported.

## Context-aware ontology through MCP

Install `@modelcontextprotocol/client` for the MCP examples. Run `npx tsx examples/ontology.ts` with a Persona Token carrying `digital-twin:app:read` to read its resolved model and vocabulary. The token binds the persona automatically; no workspace identifier or author targeting is returned.

For owner authoring use `examples/ontology-authoring.ts candidate.json` with a separate `GABRIEL_WORKSPACE_TOKEN` carrying `digital-twin:admin` and `GABRIEL_PAGE_ID`. This reads the head, validates the candidate and previews Global/English. Add `--save` to write a candidate using the captured head; it never activates a release. Use existing isolated candidate evaluation and workspace publishing afterwards. Do not substitute a Persona Token for the workspace credential. The SDK chat API remains unchanged.
