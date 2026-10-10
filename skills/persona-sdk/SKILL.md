---
name: persona-sdk
description: Embed one Gabriel AI persona into any codebase or agent via its Persona Token (OpenAI-compatible REST, TypeScript/Python SDK, or MCP).
---

# Gabriel Persona SDK Skill

## Offline-first environment

Read [the embedded runtime contract](references/offline-runtime-v1.md). Persona Token SDK calls are hosted operations and require connectivity. A prepared embedded app may continue with its encrypted local Persona pack, local model, and implemented local operations, but must queue local mutations for an explicit **Sync now** action rather than using the Persona Token in the background.

This kit connects code to **one** Gabriel AI persona. The Persona Token (`gabi_` key in `.env` as `GABRIEL_API_KEY`) is minted separately from the workspace Gateway key: it can chat with, and use the media/command capabilities of, exactly one persona. It cannot list or touch anything else in the owner's Gabriel workspace. Mint it from Chat Publish → SDK / API Integration, Via Coding Agent → SDK, or `POST /api/gateway/pages/{pageId}/persona-keys` using a workspace token.

## What you can build with this kit

- Call the persona from any backend (`typescript/` or `python/` client), including SSE and optional WebSocket support.
- Use any OpenAI SDK unchanged: `baseURL = $GABRIEL_BASE_URL/api/v1`. `model` is optional — the key already identifies the persona; pass a model name (e.g. `claude-sonnet-5`) to override its configured text model, and `temperature`/`max_tokens` map to its chat settings.
- Register the persona as a **tool inside another agent** (Claude, OpenAI, Vercel AI SDK) with the adapters in `typescript/src/adapters.ts`.
- Attach the persona to Claude Code / Claude Desktop / Cursor via MCP: copy `examples/mcp.json`.

## Setup

1. Copy `.env.example` to `.env` and fill in the Persona Token minted from Chat Publish → SDK / API Integration, Via Coding Agent → SDK, or `POST /api/gateway/pages/{pageId}/persona-keys`. Do not paste a workspace Gateway key.
2. TypeScript: `npm install @gabriel-operator/persona-sdk` in your project (same code ships in `typescript/` as an offline fallback — `cd typescript && npm install && npm run build`, or import `typescript/src` directly with tsx/bundlers).
3. Try it: `npx tsx examples/chat.ts`, then `examples/stream.ts`.

## API surface (all under $GABRIEL_BASE_URL/api/v1, Bearer auth)

| Endpoint | Purpose |
|---|---|
| `GET /models` | Persona identity + enabled capabilities |
| `POST /chat/completions` | Chat (OpenAI shape, `stream: true` for SSE). `model` optional — the key identifies the persona; any other model name overrides its text model. `temperature`/`max_tokens` apply per request; `gabriel.config` accepts safe overrides (`systemPrompt`, `firstMessage`, `name`). Response carries `gabriel.sessionId` — send back as `metadata.session_id` to continue a conversation |
| `POST /responses` | OpenAI Responses API shape |
| `POST /images`, `POST /videos`, `GET /videos/:id` | Media generation (when enabled) |
| `POST /audio/speech`, `POST /audio/transcriptions` | TTS / STT (when enabled) |
| `GET /commands`, `POST /commands/:trigger` | The persona's slash commands |
| `GET/POST /sessions`, `GET /sessions/:id/messages` | Session management (per `user` id) |
| `POST /realtime/client_secrets` | Mint a 60-second, single-use credential for `/api/v1/realtime` |
| `GET /events` | Resumable SSE stream for authorized `gabriel.*` platform events |

## Transports

- **HTTP:** authoritative for every endpoint; media files and batch TTS/STT are HTTP-only.
- **SSE:** `chat/completions` emits OpenAI chunks, `responses` emits named Responses events, and `GET /events` emits `gabriel.*` events with `event_id` replay cursors.
- **WebSocket:** `/api/v1/realtime` supports `session.update`, `conversation.item.create`, `response.create`, `response.cancel`, and `gabriel.subscription.create`. It emits the corresponding `session.*`, `conversation.item.*`, `response.*`, `error`, and `gabriel.*` events.

The WebSocket protocol is an OpenAI Realtime-compatible text/event subset, not a full implementation. Realtime audio is not supported. Reconnect with the most recent `event_id`; `gabriel.replay.reset_required` means the cursor is outside the ten-minute/500-event replay window and the client must refresh its HTTP snapshot.

Capabilities vary per persona — call `GET /models` first and only use listed capabilities. Disabled capabilities return 403 `capability_disabled`.

## Rate limits

Requests are rate limited per persona API key and per persona owner (aggregated across every key the owner has minted) when the persona runs on an **internal Gabriel model**. A denied request returns `429 rate_limit_exceeded` with a `Retry-After` header and `X-RateLimit-*` headers. Personas configured with the owner's **own custom model** are exempt from the chat limit — check `retry_after`/`Retry-After` and back off before retrying; do not tight-loop on 429.

## Desktop-local models (owner testing only)

On `POST /chat/completions`, `model` also accepts a desktop-local provider id — `claude-code`, `codex-cli`, `grok-cli`, `gemini-cli`, `mistral-vibe`, `kimi-cli`, or `qwen-code` — to run that one call through the persona owner's own subscription, relayed live via their Gabriel Operator desktop app. Same rate-limit exemption as a custom model. This only works while the owner's desktop app is open and connected on some machine; otherwise the call fails with `503 desktop_local_model_unavailable`. It's meant for the owner testing their own persona, not for traffic from this kit's actual end users — they don't have the owner's desktop app or subscription.

## Rules for coding agents

- Read `.env` for `GABRIEL_API_KEY`, `GABRIEL_BASE_URL`, `GABRIEL_PERSONA_MODEL`; never hardcode or print the key, and never ship it to browser bundles.
- Prefer the `GabrielPersona` client (`typescript/src/index.ts`) over raw fetch when working in this kit.
- Thread `sessionId` between calls that belong to one conversation.
- This key intentionally cannot create/delete personas or reach workspace resources — do not try the `/api/gateway` endpoints with it; they reject persona keys by design.

## Context-aware ontology

Use the parent persona’s `assets/ontology.json` for Global → country/region → one authenticated audience → language → terminology. Refer to [the ontology skill](../persona-ontology/SKILL.md) for snapshots, stable IDs, validation, preview and gateway/MCP authoring. Child resources reference that contract; stored instances and credentials remain in existing runtime storage. Preserve captured ontology selections during retries and downstream mappings. Saving an ontology candidate is separate from activation.
