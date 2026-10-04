---
name: asset-library
description: Maintain a signed-in user's Git-backed generated asset library and Remotion movie manifests.
---

# Asset Library

## Offline assets

Read [the embedded runtime contract](references/offline-runtime-v1.md). Keep downloaded source files, generated local artifacts, cloud uploads, and Git manifest exports distinct. Store local metadata and checksums in the device repository. Do not call a manifest reference offline-ready unless its bytes were prepared locally, and do not upload generated artifacts until the user explicitly chooses an online action or synchronization path.

This repository stores a user's versioned asset-library manifests. Runtime media
files remain in the app's private storage; Git stores stable JSON references,
metadata, movie timelines, render records, and sync status.

## Using this skill in coding agents

Gabriel Operator skills are designed for Claude Code, Codex, Cursor, Hermes, OpenClaw, and any agent that supports skill packs. Work in the git-backed asset-library repository connected to your Gabriel account.

### Install the skill pack

| Agent | Install |
|-------|---------|
| **Claude Code** | Copy `server/skills/asset-library/` into `.claude/skills/asset-library/` |
| **Codex** | `codex plugin marketplace add Gabriel-Operator/gabriel-operator-coding-agent-plugin --sparse .agents/plugins` then install the Gabriel Operator plugin |
| **Cursor** | Copy `server/skills/asset-library/` to `.cursor/skills/asset-library/` (project) or `~/.cursor/skills/asset-library/` (global) |
| **Hermes / generic CLI** | `cp -R server/skills/asset-library ./your-asset-repo/` |
| **OpenClaw** | Copy `server/skills/asset-library/` into your OpenClaw workspace skills directory, then `openclaw gateway connect --url https://your-openclaw-gateway` |
| **Gabriel Operator monorepo** | `cp -R server/skills/asset-library ./your-git-repo/` |

Gabriel scaffolds this tree automatically when you connect Git for your personal asset library.

### Modify with your coding agent

1. Open your git-backed asset-library repository.
2. Tell your agent: *"Read `SKILL.md` and update the manifest files — `assets/library-index.json`, `assets/generated-media/<assetId>/asset.json`, `movies/projects/<movieProjectId>/project.json` — for \<describe the change\>. Do not commit raw large media binaries."*
3. Keep asset and movie IDs stable; increment `revision` on movie project saves.
4. Commit and push to the default branch.

**Example prompts:**
- *"Add a new generated-media asset entry referencing an existing app-proxied URL."*
- *"Extend the movie timeline with a new scene and background audio track."*
- **OpenClaw:** *"Update the asset-library manifest JSON for this change, keep IDs stable, and commit without adding raw media binaries."*

Movie rendering and export run in the Gabriel UI after manifests sync via Git — there is no separate CLI run step for this skill.

## Canonical Files

```text
assets/library-index.json
assets/generated-media/<assetId>/asset.json
movies/index.json
movies/projects/<movieProjectId>/project.json
movies/renders/<movieRenderId>/render.json
```

## Rules

- One repository belongs to one signed-in user.
- Keep asset and movie IDs stable.
- Do not commit raw large media binaries in v1.
- Use app-authenticated URLs or private Blob paths in manifests.
- Page-level `assets/chat-config.json` never stores this repo binding or user movie drafts.

---

## Movie Project Schema

All movie editor state is stored in `movies/projects/<id>/project.json`.
The renderer is Remotion at **30 fps**. All time values are in **frames** unless
noted otherwise.

### Top-level: `MovieProject`

```jsonc
{
  "id": "string",           // stable UUID — never change after creation
  "pageId": "string",       // the digital-twin agent this project belongs to
  "userId": "string",       // owner
  "name": "string",         // display name shown in the editor
  "revision": 1,            // integer, incremented on every save (optimistic concurrency)
  "preset": "landscape_16_9",  // canvas size — see Presets below
  "scenes": [...],          // ordered array of video/image clips
  "audioTracks": [...],     // array of background audio tracks
  "overlays": [...],        // array of text overlays (rendered on top of all scenes)
  "gitSyncStatus": "synced",   // "synced" | "failed" | "pending" — set by server
  "gitSyncedAt": "2026-06-09T14:00:00.000Z",
  "gitSyncError": null,
  "createdAt": "2026-06-09T13:00:00.000Z",
  "updatedAt": "2026-06-09T14:00:00.000Z"
}
```

### Presets

| Value | Resolution | Use |
|-------|-----------|-----|
| `landscape_16_9` | 1920 × 1080 | YouTube, desktop |
| `vertical_9_16` | 1080 × 1920 | Instagram Reels, TikTok |
| `square_1_1` | 1080 × 1080 | Instagram feed |

---

### `MovieScene` (one entry in `scenes[]`)

Scenes are played back in array order. The rendered canvas background is `#050505`.

```jsonc
{
  "id": "scene_<uuid>",     // stable, prefixed with "scene_"
  "assetId": "string",      // ID from the asset library (may be empty for URL imports)
  "type": "video",          // "video" | "image"
  "url": "https://...",     // direct media URL (app-proxied or pre-signed S3)
  "title": "Intro clip",    // optional display label in the timeline
  "thumbnailUrl": "https://...",   // optional poster frame URL
  "durationInFrames": 150,  // how long this scene plays (frames at 30 fps = 5 s)
  "fit": "cover",           // "cover" | "contain"  (default: "cover")
  "trimStartInFrames": 0,   // frames to skip at the start of the source media
  "trimEndInFrames": null,  // frame in the source to stop at (null = play to end)
  "muted": false,           // video only — mute the scene's native audio
  "volume": 1,              // video only — 0.0–1.0 (default 1)
  "playbackRate": 1,        // 0.25–4.0 (default 1)
  "transitionIn": "fade",   // transition FROM the previous scene — see Transitions
  "transitionInFrames": 15  // overlap duration with previous scene (default 15 = 0.5 s)
}
```

**Transition mechanics:** when `transitionIn` is set on scene N, Remotion overlaps
scene N with scene N-1 by `transitionInFrames` frames. The total timeline duration
shrinks by that overlap. `transitionIn` on the **first** scene is always ignored.

#### Transition values

| Value | Effect |
|-------|--------|
| `"none"` | Hard cut (default) |
| `"fade"` | Cross-fade |
| `"slide-left"` | New scene slides in from the right |
| `"slide-right"` | New scene slides in from the left |

---

### `MovieAudioTrack` (one entry in `audioTracks[]`)

Audio tracks are independent of scenes and span the full composition timeline.

```jsonc
{
  "id": "audio_<uuid>",     // stable, prefixed with "audio_"
  "assetId": "string",
  "type": "audio",          // always "audio"
  "url": "https://...",
  "title": "Background music",
  "startInFrames": 0,       // frame at which playback begins on the timeline
  "durationInFrames": 900,  // how many frames the track occupies on the timeline
  "trimStartInFrames": 0,   // frames to skip at the start of the source file
  "trimEndInFrames": null,  // frame in the source to stop at
  "volume": 0.8,            // 0.0–1.0 (default 1)
  "muted": false,
  "playbackRate": 1,        // 0.25–4.0
  "loop": false             // loop the audio if durationInFrames > source length
}
```

---

### `MovieTextOverlay` (one entry in `overlays[]`)

Text overlays are rendered above all scenes for the duration of their Sequence.

```jsonc
{
  "id": "overlay_<uuid>",   // stable, prefixed with "overlay_"
  "text": "Hello world",    // displayed string (supports newlines)
  "position": "bottom",     // vertical anchor — "top" | "center" | "bottom"
  "startInFrames": 30,      // frame at which the overlay appears
  "durationInFrames": 90,   // how long it is visible (3 s at 30 fps)

  // Typography
  "color": "#ffffff",       // CSS color string (default: "#ffffff")
  "fontSize": 64,           // px (default: 64)
  "fontFamily": "Arial, sans-serif",
  "fontWeight": 700,        // 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  "fontStyle": "normal",    // "normal" | "italic"
  "textAlign": "center",    // "left" | "center" | "right"
  "letterSpacing": 0,       // px (default: 0)
  "lineHeight": 1.2,        // unitless (default: 1.2)
  "textShadow": true,       // adds "0 2px 10px rgba(0,0,0,0.8)" drop shadow

  // Background chip
  "background": "rgba(0,0,0,0.6)",  // CSS color; omit or null for no background
  "backgroundPadding": 8,           // px (vertical; horizontal = 2× this value)
  "backgroundRadius": 4,            // px border-radius

  // Entrance animation (plays at start of the overlay's Sequence)
  "animation": "fade-in",           // see Overlay Animations below
  "animationDuration": 15,          // frames (default: 15 = 0.5 s)

  // Exit animation (plays at end of the overlay's Sequence)
  "exitAnimation": "fade-out",      // see Overlay Exit Animations below
  "exitAnimationDuration": 15       // frames (default: 15 = 0.5 s)
}
```

**Position layout:** each position uses `AbsoluteFill` with `7%` padding and
`justifyContent` mapping: `top` → `flex-start`, `center` → `center`,
`bottom` → `flex-end`. The text block is horizontally centred within the canvas.

#### Overlay entrance animations

| Value | Effect |
|-------|--------|
| `"none"` | Appears instantly |
| `"fade-in"` | Opacity 0 → 1 |
| `"slide-up"` | Slides up from below + fade in |
| `"slide-down"` | Slides down from above + fade in |
| `"zoom-in"` | Scale 0.5 → 1 + fade in |
| `"typewriter"` | Characters revealed left-to-right over `animationDuration` frames |

#### Overlay exit animations

| Value | Effect |
|-------|--------|
| `"none"` | Disappears instantly |
| `"fade-out"` | Opacity 1 → 0 |
| `"slide-up"` | Slides upward + fade out |
| `"slide-down"` | Slides downward + fade out |
| `"zoom-out"` | Scale 1 → 0.5 + fade out |

---

## Render Schema

Render records are written to `movies/renders/<id>/render.json`.

```jsonc
{
  "id": "string",
  "pageId": "string",
  "userId": "string",
  "projectId": "string",
  "projectRevision": 3,
  "preset": "landscape_16_9",
  "snapshot": { /* full MovieProject at the moment render was triggered */ },
  "status": "completed",     // "queued" | "rendering" | "completed" | "failed"
  "progress": 100,           // 0–100
  "thumbnailUrl": "https://...",
  "error": null,             // error message string if status === "failed"
  "gitSyncStatus": "synced",
  "gitSyncedAt": "2026-06-09T14:30:00.000Z",
  "gitSyncError": null,
  "createdAt": "2026-06-09T14:20:00.000Z",
  "updatedAt": "2026-06-09T14:30:00.000Z",
  "completedAt": "2026-06-09T14:30:00.000Z"
}
```

---

## `movies/index.json`

Lightweight stub list used for fast project and render listings.

```jsonc
{
  "schemaVersion": 1,
  "projects": [
    {
      "id": "string",
      "name": "string",
      "preset": "landscape_16_9",
      "revision": 3,
      "updatedAt": "2026-06-09T14:00:00.000Z"
    }
  ],
  "renders": [
    {
      "id": "string",
      "projectId": "string",
      "status": "completed",
      "preset": "landscape_16_9",
      "completedAt": "2026-06-09T14:30:00.000Z"
    }
  ]
}
```

---

## Duration formula

```
totalDuration = max(
  sum(scene.durationInFrames) - sum(actualTransitionOverlaps),
  max(audioTrack.startInFrames + audioTrack.durationInFrames),
  max(overlay.startInFrames + overlay.durationInFrames)
)
```

`actualTransitionOverlap` for scene N = `transitionInFrames` if `transitionIn !== "none"`, else 0. First scene always has 0 overlap regardless of its `transitionIn` value.
