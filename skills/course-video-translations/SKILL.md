---
name: course-video-translations
description: Generate translated course narration with ElevenLabs or another registered speech provider, using the same region, language, and terminology order as landing-page translations. Audio stays in the persona repository.
metadata:
  author: gabriel-operator
  version: "1.0"
  compatibility: Requires Node.js 18+. Provider API keys are process environment only.
---

# Course video translations

Turn an existing course film into one audio track per landing-page language. The picture stays the silent `*-intro-picture.mp4` from `course-video-generation`. English stays in the source film and is never written as `*.en.mp3`.

Load this topic from the gateway as `course-video-translations`. Generate the film first with `../course-video-generation/SKILL.md`. The wording comes from `../landing-page-translations/SKILL.md`: do not translate again, and do not invent sentences that are not already in that language file.

## Storage

Same idea as split landing pages. The language code is the last part of the name. A region key, when the landing page has one, comes before the language. Terminology comes last.

```text
assets/course-media/<persona>-course-<slug>-intro.mp4                         English picture with English voice
assets/course-media/<persona>-course-<slug>-intro-picture.mp4                silent picture
assets/course-media/<persona>-course-<slug>-intro.<language>.mp3             language track
assets/course-media/<persona>-course-<slug>-intro.<region>.<language>.mp3    region, then language
assets/course-media/<persona>-course-<slug>-intro.<region>.<language>.<terminology>.mp3
assets/course-media/manifest.json                           keys such as "ai:es" and "ai:india.hi"
```

Playback URL: `/persona-course-media/<persona>/<file>`. The app serves that path from the persona checkout. It does not read `public/assets/`.

Resolver order, matching landing pages:

1. `<region>.<language>.<terminology>` when that file is in the manifest
2. `<region>.<language>`
3. `<language>.<terminology>`
4. `<language>`
5. English source film when the language is `en` or no track exists

Do not create a regional or terminology track when the translated landing copy is the same as the language file. `nb` and `no` stay separate when both landing files exist.

Never write these mp3 files into the operator marketplace. Never commit the provider API key.

## What to speak

Read the selected `assets/landing-page.<language>.json` (or `assets/landing-page.<region>.<language>.json`). For each course, speak only text already in that file: the 9–11 title, goal, puzzle prompt, correct choice, hint, lesson lines, then the 12–14 puzzle prompt, correct choice, and hint. Add terminal punctuation when a line has none. Skip English. Skip a file whose course copy matches a track that already exists.

## When a visitor asks for a new language

Saving a landing-page translation for a language that does not yet have course narration also speaks that translation. The server calls `AudioGenerationService` with the persona owner's saved speech provider. Edit Persona does not store the key itself: the key is the owner's audio provider, the same one audio generation already uses, preferring their default speech provider and otherwise their saved ElevenLabs Speech provider. The key is never written into the persona repository or this marketplace.

Audio generation is text-to-speech. Music generation is a separate text-to-music list: Lyria, Suno, ElevenLabs Music, Beatoven, and Apiframe Music. Landing narration uses the speech provider only. Do not use a music provider for these tracks.

The spoken text is the translated course copy already on that landing page. This is text-to-speech. The English film is not transcribed. ElevenLabs receives `language_code` and is retried once without it when that model rejects the code. The mp3 is generated in memory, then committed with an updated `assets/course-media/manifest.json` through the same temporary clone used for landing translations. A copy into the local checkout happens when that folder is writable. Playback keeps using `/persona-course-media/<persona>/<file>` and reads the checkout, so the new language plays after the checkout contains the file. English is skipped. A track that is already present is left in place. A regional translation is stored as `<region>.<language>` and does not replace the plain language track.

The offline script below is for generating a whole catalogue in one run. Its key stays in the process environment.

## Provider key

Pass the provider id and read its key from the environment for that run only.

| Provider id | Key variable | Notes |
|---|---|---|
| `elevenlabs` | `ELEVENLABS_API_KEY` | Default. `POST https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128` with header `xi-api-key`. Try `eleven_v3` with `language_code`, then `eleven_multilingual_v2`. |
| `google-direct-audio` | `GEMINI_API_KEY` | Gemini TTS. Use it when the user asks for the English source voice. |
| `cartesia` | `CARTESIA_API_KEY` | `POST https://api.cartesia.ai/tts/bytes` with header `X-API-Key`. |
| `deepgram` | `DEEPGRAM_API_KEY` | `POST https://api.deepgram.com/v1/speak`. |
| `openai-audio` | `COMET_API_KEY` | OpenAI speech through the shared audio gateway. |
| `fal-minimax-speech`, `fal-chatterbox-tts` | `FAL_KEY` | fal.ai speech. |
| `openrouter-audio` | `OPENROUTER_API_KEY` | OpenRouter audio. |
| `xai-audio` | `XAI_API_KEY` | xAI speech. |

Other audio ids in `server/src/services/multimodal/provider-registry.ts` are allowed when the user names that provider and supplies its key. The script currently calls ElevenLabs. For another implemented provider, call that provider's endpoint with the key from the environment and write the same filenames.

## Generate

```bash
ELEVENLABS_API_KEY="$ELEVENLABS_API_KEY" \
node server/skills/course-video-translations/scripts/generate-course-narration.mjs \
  --persona-root /absolute/path/to/persona-repo \
  --persona boli \
  --provider elevenlabs
```

`--manifest-only` rewrites `manifest.json` from files already in `assets/course-media/` and does not call a provider. The script refuses to write inside this marketplace repository. Commit the mp3 files and the manifest in the persona repository.
