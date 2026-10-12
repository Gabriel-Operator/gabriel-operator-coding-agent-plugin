---
name: landing-page-translations
description: Pre-generate, validate, and mirror source-revisioned language variants for Git-backed Gabriel landing pages. Use when an authored landing page should ship with cached translations instead of waiting for the first public visitor to generate them.
metadata:
  author: gabriel-operator
  version: "1.5"
  compatibility: Requires Node.js 18+ and tsx.
---

# Landing Page Translations

Inventory the complete renderer before generation. Editable copy for all audience
tabs, mobile menus, prototype screens and forms must be owned by the model;
translating only the page headline/FAQ while the template still renders English
does not complete a translation task. Read the builder's
[model-owned content contract](../landing-page-builder/references/model-owned-content.md).
Keep option IDs, operational commands and media references unchanged; translate
their display labels. Do not add a parallel platform English defaults dictionary.

Generate a compact `localization.translation.generatedTranslations` manifest plus one
JSON asset per language from an authored landing page. The script uses the same
safe-string projection, source revision, merge, and schema validator as the public runtime.

The base `assets/landing-page.json` never contains newly generated full translated pages.
Its entries point to `assets/landing-page.<language>.json`; legacy regional variants use
`assets/landing-page.<regionKey>.<language>.json`, and retired whole-page markets used
`assets/markets/<country>/landing-page.<language>.json`, so the selected language code is always
immediately before `.json`. Per-section region content from `landing-page-regions` lives under
`assets/landing-page/regions/` and is translated by that skill, not by this manifest. New assets are schema version 2 and contain their matching
language, region, source revision, complete translated `landingPage`, optional translated
`chatEmbedConfig`, timestamp, optional market `translationContextRevision`, and a path/source-text-hash translation index. Runtime reads
only the selected asset. Exact revision-matched schema-version-1 assets remain readable;
stale v1 assets are upgraded by this repository tool rather than rebased at runtime.

## Default storage invariant

Treat split language assets as the only writable format. This is not a caller option:

```text
assets/landing-page.json                 authored source + compact manifest only
assets/landing-page.fr.json              complete French asset envelope
assets/landing-page.es.json              complete Spanish asset envelope
assets/landing-page.india.hi.json        complete Hindi asset for region `india`
```

- Never add `page` or `chatEmbedConfig` to a new `generatedTranslations[]` manifest
  entry. Those full values belong inside the referenced language asset.
- Never duplicate English into `landing-page.en.json`; English remains the authored
  source in `landing-page.json`.
- Keep the normalized language code immediately before `.json`. For a region, put the
  region key before the language code.
- Do not create one aggregate translations file or eagerly read every locale file.
  Runtime resolves the manifest first and reads exactly one selected asset.
- If any inline legacy entry is encountered, run `--migrate-inline --apply` before
  considering the repository complete. Read compatibility is not permission to keep
  writing the legacy shape.

Run this for every newly created landing page and after every authored landing-page change,
after the English page is complete and validates. The generator searches Git history for
the authored source revision behind existing assets, recovers unchanged translated strings
by path and source hash, and calls the provider only for new or changed strings. Do not
discard stale assets or start a full regeneration first. For landing-page authoring rules,
read `../landing-page-builder/SKILL.md`.
For parent Persona Git rules, read `../digital-twin-page/SKILL.md`.

## Default language catalogue

An explicit user market or language scope takes precedence over this default. Do not
turn country-specific terminology work into a full-catalogue translation project.
When the user requests English market editions plus selected local languages, pass
only those agreed language codes and defer the rest of the catalogue.

The default target set covers the non-English languages in the maintained web-language
catalogue:

`es,de,ja,fr,pt,ru,it,nl,pl,tr,zh,fa,vi,cs,id,ko,uk,hu,ar,sv,ro,el,da,fi,he,sk,th,bg,hr,nb,lt,sr,sl,ca,et,no,lv`

English (`en`) remains the authored source and is never stored as a generated variant.
`nb` (Norwegian Bokmal) and `no` (Norwegian) are intentionally separate entries. The
generator mirrors the validated general-Norwegian copy into the Bokmal cache key because
translation providers conventionally produce Bokmal for both catalogue entries.

## Generate

When the user requests an existing Codex or Claude CLI subscription, use that
installed, authenticated CLI directly. Their request authorizes sending the safe
translation strings through the named CLI service; no separate OpenRouter approval
or API key is needed. These are cloud subscription services, not on-device inference.
Keep the original task's data and publishing scope. Do not extract login credentials,
switch to API-key billing, bypass CLI permissions, or silently fall back to another
provider. If subscription authentication or limits block a run, preserve its cache
and report the CLI status. Codex and Claude account access are checked with
`codex login status` and `claude auth status`.

From the Gabriel Operator monorepo, using the existing subscription:

```bash
node --import tsx server/skills/landing-page-translations/scripts/generate-landing-translations.ts \
  --repo /absolute/path/to/persona-repo \
  --provider codex \
  --cache /absolute/path/to/resumable-cache.json \
  --language-group-size 3 --max-batch-entries 110 --concurrency 3 \
  --apply
```

Use `--provider claude` for an existing Claude subscription. An optional `--model`
selects a model available to that CLI; otherwise the CLI default is used. The
OpenRouter API model default is never passed to a subscription CLI. The runner uses
an isolated temporary working directory, structured JSON output, no repository tools,
and a filtered environment without API keys. Codex runs read-only with user tool
configuration, plugins and MCP apps disabled; Claude has all tools and MCP servers
disabled. Codex uses the existing ChatGPT sign-in over HTTPS/SSE, with certificate
verification intact. Preserve already configured CA-path environment variables; never
use insecure TLS flags or extract subscription tokens. It never uses a permission-bypass flag. JSON, ids, placeholders, length
budgets, caches, source revisions and child/parent mirroring use the same validation
path as API providers. `--cli-timeout-ms` bounds each request (default six minutes).

For an explicitly authorized API-key provider:


```bash
npx tsx server/skills/landing-page-translations/scripts/generate-landing-translations.ts \
  --repo /absolute/path/to/persona-repo \
  --model openrouter/free \
  --confirm-external \
  --apply
```

Pass `--repo` more than once to deduplicate shared strings across several personas. Use
`--languages fr,de,ja` for a subset. Use `--create-missing` only when the user explicitly
wants a generic landing page created for a Persona that has none; normally author the
page with `landing-page-builder` first.

For on-device generation, use Chrome's translator and a persistent cache:

```bash
npx tsx server/skills/landing-page-translations/scripts/generate-landing-translations.ts \
  --repo /absolute/path/to/persona-repo \
  --provider chrome \
  --cache /absolute/path/to/resumable-cache.json \
  --concurrency 8 \
  --apply
```

Run `--inventory` first when processing a batch of repositories. Chrome language-model
availability varies by installation. Generate its supported languages first, then rerun
only unavailable language codes with an authorized OpenAI-compatible provider and the
same cache. The cache makes both commands resumable and prevents completed strings from
being translated again.

The standalone generator uses an OpenAI-compatible endpoint from
`LANDING_TRANSLATION_API_URL`/`LANDING_TRANSLATION_API_KEY`, falling back to
`CHAT_API_URL`/`CHAT_API_KEY`. For a non-local endpoint it refuses to run unless
`--confirm-external` is present. Obtain explicit authorization before sending private
repository copy to an external provider. A user request to use an existing Codex
or Claude CLI subscription is authorization for that named service and task, not
for a separate OpenRouter, Google Translate, or other API provider. Never put provider keys in Git.

The generator:

- Discovers a linked landing-page child by `landingPageRef.resourceKey`, otherwise uses
  the inline parent page.
- Extracts only runtime-approved human-facing strings. URLs, media, identifiers,
  commands, roles, statuses, design tokens, placeholder-bearing machine strings, and
  localization metadata are excluded.
- Generates base-page and regional-page variants with the exact current source revision.
- Seeds its resumable cache from current and historical language assets, retaining unchanged
  translations and refreshing only the delta introduced by the authored edit.
- Reuses unchanged published copy only after validating the asset, language, path and
  source identity. Previously published wording need not pass a newly tightened provider
  length limit; arbitrary resumable-cache entries and new translations do. That provenance
  is process-local and is never granted by a flag in the cache JSON.
- Retries only rejected length-budget pairs, retaining accepted pairs locally. A bounded
  failure writes a review report without publishing incomplete language assets. It never
  truncates translations to fit the design.
- For market contexts, also seeds unchanged paths from the neutral page's matching source-
  and target-language assets. Cache namespaces include market, source language, locale,
  context revision, and target language; protected glossary terms are tokenized before
  provider calls and restored byte-for-byte afterward.
- Preserves valid unselected cached languages, replaces selected languages, repairs
  translated accent substrings, and validates every complete translated page.
- Writes the compact child `assets/landing-page.json` manifest and each language asset,
  then mirrors the same manifest and assets into the parent Persona repository only after
  all requested variants pass.
- Uses a resumable local cache when `--cache /path/to/cache.json` is supplied.
- Always externalizes selected and retained translations. There is no supported flag
  that writes complete translations back into the base JSON.

This skill translates the base page; it does not decide jurisdictional copy. Whenever a region
needs local tax terms, official portals, credentials, currency, dates, ROI assumptions or
evidence, use `../landing-page-regions/SKILL.md`, which adapts and translates those sections per region.

## Validate without translating

```bash
npx tsx server/skills/landing-page-translations/scripts/generate-landing-translations.ts \
  --repo /absolute/path/to/persona-repo \
  --check
```

`--check` verifies schema validity, unique language/region keys, recomputed current source revisions,
all requested language entries, every referenced asset envelope and complete translated
page, the v2 translation index, and child/parent byte-level mirroring. It makes no model calls and writes nothing. A successful
new-format handoff must contain only `assetPath` manifest entries; if legacy `page` entries
are present, migrate them even though compatibility validation can still read them.

## Split an existing inline cache

Use the deterministic migration mode for repositories created before per-language assets.
It makes no provider or LLM calls and preserves the already translated JSON verbatim:

```bash
npx tsx server/skills/landing-page-translations/scripts/generate-landing-translations.ts \
  --repo /absolute/path/to/persona-repo \
  --migrate-inline \
  --apply
```

Run `--check` afterward. Commit and push the landing-page child first, then the parent
Persona with its mirrored files and updated gitlink.

After validation, commit and push a linked landing-page child first. Then commit and push
the Persona parent. Preserve unrelated working-tree changes; do not sweep them into the
translation commit.

## Automatic audience versions and global country

Use `publishedConfig.personalization` for a global-country baseline plus country,
language, saved-profile/custom or individual authenticated versions of a whole
Persona presentation. Configure it in Chat Publish → Audience versions. It can
change the name, avatar, landing theme/layout, embed appearance and signed-in app.
Read [the presentation contract](../digital-twin-page/references/personalization.md)
for precedence, JSON, hierarchy, trusted profile matching and bounded prompt
generation. Empty country/language lists mean all; global precedes country/language
and the matched authenticated audience. Never expose a country selector in the
public header. Use styled form primitives and `app/components/Select.tsx`.

Prompts adapt editable copy through the existing country generation jobs and
policies; complete layouts are authored validated config. Translations and
generated assets live under their matched variant and cannot use a shared global
translation cache. Preserve human approvals, real-data boundaries and access checks.

## Mobile presentation overlays

`landingPage.localization.mobile` is a final partial copy layer after country and
language resolution. Read [mobile authoring](../landing-page-builder/references/mobile-content.md)
when shortening chat or landing copy for phones. Mobile language/country patches
are bounded metadata; they do not invalidate or replace desktop translation assets
or region sections. Translate newly authored mobile patches separately and preserve
tokens, country terms, amounts and critical approval meaning. Do not duplicate
workflow-owned questions or change execution policies.

## Course films and narration

Course explainer video and translated narration follow this same language order, but the bytes live in the persona repository under `assets/course-media/`, not in the operator marketplace. Read `../course-video-generation/SKILL.md` and `../course-video-translations/SKILL.md`. English stays in the source film. Other languages use the already translated landing copy. Playback is `/persona-course-media/<persona>/<file>`. A landing language generated at runtime also gets that narration through the persona owner's saved speech provider. Audio generation is text-to-speech. Music generation is separate text-to-music (Lyria, Suno, ElevenLabs Music, Beatoven, Apiframe Music) and is not used for these films.
