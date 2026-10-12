# Portable configuration

Store this configuration in the persona's `assets/chat-config.json` published configuration. Credential values remain in encrypted server-owned connection records.

```json
{
  "integrationBindings": [
    {
      "integrationId": "tool.tavily",
      "enabled": true,
      "connectionOwner": "runner",
      "allowedTools": ["search"],
      "contexts": ["chat", "voice"],
      "settings": {}
    },
    {
      "integrationId": "filesystem.s3",
      "enabled": true,
      "connectionOwner": "author",
      "connectionId": "int_existing_owned_connection",
      "allowedTools": ["list", "read", "stat"],
      "contexts": ["chat", "voice"],
      "settings": { "readOnly": true }
    }
  ],
  "voiceProvider": "mastra",
  "mastraVoiceConfig": {
    "mode": "pipeline",
    "input": { "integrationId": "voice.deepgram" },
    "output": { "integrationId": "voice.openai" },
    "transport": { "integrationId": "voice.livekit" }
  },
  "multimodalUnderstanding": {
    "image": { "enabled": true, "provider": "mastra", "modelId": "existing-vision-model-reference" },
    "video": { "enabled": true, "provider": "mastra", "modelId": "existing-vision-model-reference" }
  },
  "liveVisionConfig": {
    "enabled": true,
    "camera": true,
    "screen": true,
    "modelId": "existing-vision-model-reference"
  }
}
```

Enable separate voice bindings for each provider referenced by the voice profile, including LiveKit for pipeline calls. Select their ownership and connection policy in the same way as other integrations. A provider ID must come from the live registry, and its capabilities must match its selected role.

Native realtime uses `mode: "realtime"` and a `realtime` selection instead of speech input/output. Model and voice IDs are optional provider settings; use voice discovery and current provider documentation rather than inventing IDs.

## Runtime APIs

- `GET /api/integrations/catalog`: descriptors and rollout availability.
- `GET /api/personas/:pageId/integrations`: published bindings permitted for this actor.
- `GET|POST /api/personas/:pageId/integration-connections`: list or connect.
- `POST /api/personas/:pageId/integration-connections/:connectionId/test`: authenticate and exercise the selected adapter.
- `GET .../:connectionId/voices` and `GET .../:connectionId/models`: provider discovery. Some SDKs accept custom model IDs without a model-list API.
- `DELETE .../:connectionId`: revoke the association and encrypted credentials; active voice/execution sessions using it close.
- `POST /api/personas/:pageId/voice-sessions`: start a call; response selects authenticated LiveKit or WebSocket transport.
- `DELETE /api/personas/:pageId/voice-sessions/:sessionId`: stop and clean up.

The browser and voice worker receive session credentials, never provider keys. Worker credentials are signed for one actor, persona, session, and purpose; they cannot authenticate the general application API.

## Rollout and worker

The operator enables tested adapters with `MASTRA_INTEGRATIONS_ENABLED`, a comma-separated list of registry IDs. `*` enables all adapters on compatible hosts. Keep this deployment setting out of authored persona configuration.

The separate `server/mastra-voice-worker` uses Node >=22.13, `@mastra/livekit` 0.5.0, and LiveKit Agents 1.7.1. Configure its existing LiveKit account and `MASTRA_VOICE_BACKEND_URL`, run `npm ci`, `npm run build`, `npm run download-models`, and `npm start` in the worker directory. The registered agent name is `persona-mastra-voice`. It does not replace the legacy 1.0.43 worker. Speech decoding and sampled-video analysis require the existing FFmpeg/FFprobe runtime.

Model discovery returns defaults from the installed SDK; it does not claim a complete hosted-provider model catalog. Custom model IDs remain supported where the provider accepts them. Native channel account linking occurs in private messages. Live visual frames are isolated by actor/persona/session in ephemeral MongoDB storage so the HTTP, agent, and speech workers can use the same latest frame across backend replicas. Stale frames are unreadable after ten seconds and cleared by runtime maintenance; stopping sharing removes the frame immediately.

Workflow `llm_agent` nodes also accept `visualInputVariable` (an interpolated upload URL, attachment object, or array of at most five image/video uploads) and `visualSessionId` (an interpolated current camera/screen/browser session reference owned by the same actor). Uploads use the persona’s configured understanding model; current frames use its vision model. Both sources can accompany the node prompt. For example, set `visualInputVariable` to `{{start.input.visualUploads}}` and `visualSessionId` to `{{start.input.visualSessionId}}`. Provider credentials remain outside the workflow definition.

Each LiveKit account used by a persona needs a registered `persona-mastra-voice` worker. The start API verifies that its dispatched worker joins and returns an actionable setup error when it does not. Stagehand connections require an explicit browser model and its API key, preventing fallback to execution-host model credentials.
