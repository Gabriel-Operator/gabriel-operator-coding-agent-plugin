---
name: persona-integrations
description: Configure a Gabriel AI Persona's chat and voice integrations, connection ownership, Mastra speech providers, vision inputs, and connection tests through the live integration registry. Use for persona tools, channels, browsers, sandbox execution, and agent files; infrastructure provisioning is separate.
metadata:
  author: gabriel-operator
  version: "1.0"
---

# Persona integrations

Use the live registry rather than assuming that a provider name implies every capability. Load `gabriel_list_integrations` (REST: `GET /api/agent-gateway/integrations`) before configuring a provider. A descriptor separates STT, TTS, native realtime speech, call transport, execution, desktop control, browser viewing, and file operations. Workspace rollout flags and host requirements can make an implemented adapter unavailable.

Use an existing AI Persona gateway session, or create one with target type `digital_twin`. Configure non-secret `integrationBindings`, `mastraVoiceConfig`, `multimodalUnderstanding`, and `liveVisionConfig` with `gabriel_update_twin_config`. See [configuration](references/configuration.md) for the wire shapes.

## Connections and identity

- Each integration is disabled initially. Authors enable it, select `author` or `runner` ownership, and restrict tools and chat/voice contexts.
- Author-owned connections are shared only through published bindings. Runner-owned accounts are private to that runner and persona. Never substitute an author's account when a runner connection is missing.
- Users enter API keys, OAuth tokens, and service-account material in the existing connection UI. Never request credentials in chat, write them into portable definitions, or print them in results. References are opaque and must be rebound after import into another account or persona.
- Connect and test through Edit/Create Persona or AI Resources. A saved connection is pending until an authenticated provider operation succeeds. `gabriel_test_integration` takes the persona `sessionId` and owned `connectionId`; it can make a small provider request or briefly create and clean up a sandbox.
- Missing, revoked, expired, and incompatible connections produce a setup/reconnect result. Do not claim an integration is connected because its SDK constructor loaded or its name appears in a catalog.

## Chat, voice, and vision

Chat and voice use the same integration resolver, connection policy, and tool permissions. Existing call runtimes remain available; select `voiceProvider: "mastra"` explicitly for the new runtime.

Pipeline voice combines a speech-input provider, the persona agent, a speech-output provider, and a LiveKit connection. Native realtime voice is offered only by the installed SDK's actual realtime adapters. Inworld speech input/output and native realtime are provided by separate exports of the installed `@mastra/voice-inworld` package.

Use a declared vision-capable model. Image and video understanding are independent of media generation. Video models can receive native video; other vision models receive bounded timestamped frame samples. Live camera and screen input start only when the caller enables sharing, sample at one frame per second, and clear when sharing stops. `analyze_visual_context` reads a current frame or browser/desktop screenshot; never describe a missing or expired frame as current.

## Tools and execution

The registry covers channels, search/research, voice, browsers, sandbox tools, and agent files. Database, observability, framework, deployment, and authentication-framework additions are outside this skill.

File bindings and connections default to read-only; writes require both to permit writes. Preserve the user's chosen provider and path boundaries. BrowserViewer views a connected source browser; it is not an independent automation engine. E2B Desktop uses an actual screenshot/action/observation loop, with output files retained under the run's artifact directory.

For GitHub, use inspection tools for a one-off PR request. Subscribe only when the user requests monitoring. Subscriptions persist, check every five minutes, and add meaningful changes to the user's persona chat; unchanged state stays quiet.

Workflow LLM-agent nodes can set `personaPageId` and `integrationRefs` to use a subset of that persona's published integrations. They cannot expand its tools or connection permissions.

## Offline execution

Remote providers need connectivity. Local Docker, Apple Container, and AgentFS providers still require a separately installed device execution adapter; a hosted connection alone does not install one. Report these dependencies in portable compatibility results. Do not claim that a phone or offline device can run hosted SDK adapters.
