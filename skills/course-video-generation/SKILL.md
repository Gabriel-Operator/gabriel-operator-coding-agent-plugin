---
name: course-video-generation
description: Generate a persona course explainer film with Gemini Omni Flash, Grok, OpenAI Sora, or another registered video provider, and store the file in the persona repository.
metadata:
  author: gabriel-operator
  version: "1.0"
  compatibility: Requires Node.js 18+. Provider API keys are process environment only.
---

# Course video generation

Create the English source film for a persona course, then leave the file in that persona's Git repository. Translated speech is a separate step: read `../course-video-translations/SKILL.md`.

Load this topic from the gateway as `course-video-generation`.

## Where the files live

Write media only under the persona checkout:

```text
assets/course-media/<persona>-course-<slug>-intro.mp4
assets/course-media/<persona>-course-<slug>-intro-picture.mp4
```

`<slug>` is a short course id such as `ai` or `matter`. The picture file is the same film with the audio track removed. Playback asks the app for `/persona-course-media/<persona>/<file>`. The app reads `assets/course-media/` from the persona checkout (`persona-<persona>` under `GO_CHATS_ROOT`, or the sibling `pipelines/go-chats` directory). Where there is no checkout, as in production, it reads the same file from the persona's bound git repository (default branch), so a film plays there only after it is committed and pushed. Each file is kept on disk under its git object id and a push is picked up within about a minute.

Set `introVideo` on every age of the course to that playback URL, in `assets/landing-page.json` and every `assets/landing-page.<language>.json`. Do not leave a `?v=` cache key on the URL.

Never copy the film into the operator marketplace, including `public/assets/` and `public/assets/gabriel-twins/`. Never commit a provider API key, and never write the key into Git, `.env`, or a prompt file.

## Spoken words

The video model does not write the lesson. Take the narration from the authored English course only: title, goal, the correct puzzle choice, why the other choices fail, and the lesson lines already on the page. Discard any audio the video model returns. Fit the English voice to the picture length in the translation skill, or keep the English voice inside the source mp4 when that voice was generated from the same script.

## Provider key

The caller supplies one provider id and its API key for that process. Read the key from the environment variable below. Do not accept a key written into the persona repo.

| Provider id | Key variable | Use |
|---|---|---|
| `gemini-interactions-omni-flash` | `GEMINI_API_KEY` | Image-to-video from the course art. Model `gemini-omni-1.1-flash`. |
| `google-direct-veo31` | `GEMINI_API_KEY` | Veo 3.1. Direct clips are only a few seconds, so stitch beats. |
| `xai-imagine-video` | `XAI_API_KEY` | Grok Imagine video. |
| `sora` | `COMET_API_KEY` | Sora through the shared video gateway. |
| `fal-sora-2` | `FAL_KEY` | Sora 2 on fal.ai. |
| `fal-veo3` | `FAL_KEY` | Veo 3.1 on fal.ai. |
| `fal-kling-video` | `FAL_KEY` | Kling video. |
| `openrouter-video` | `OPENROUTER_API_KEY` | OpenRouter video. |
| `kling`, `veo2`, `hailuo`, `pika`, `luma`, `seedance` | `COMET_API_KEY` | Shared video gateway models. |

Other video ids in `server/src/services/multimodal/provider-registry.ts` are allowed when the user names that provider and supplies its key the same way. Do not invent a provider id.

Gemini Omni accepts an image-to-video task, then one extend of the clip it just made. Each extend is about ten seconds and a chain tops out near forty seconds, so build the minute from separate beats and concatenate them. Prompt the picture for motion only, with no dialogue, narration, captions, or new labels.

## Place a finished film

After the provider returns a file, put it in the persona repo and point the landing page at it:

```bash
node server/skills/course-video-generation/scripts/place-course-media.mjs \
  --persona-root /absolute/path/to/persona-repo \
  --persona boli \
  --slug ai \
  --video /absolute/path/to/ai-intro.mp4 \
  --picture /absolute/path/to/ai-intro-picture.mp4
```

The script refuses a destination inside this marketplace repository. Commit the media in the persona repository, on the same branch as `assets/landing-page.json`.
