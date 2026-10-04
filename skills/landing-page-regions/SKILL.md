---
name: landing-page-regions
description: Author, pre-generate, validate and migrate per-section region content for a Git-backed landing page (jurisdiction terminology and ROI hypotheses), using region profiles, companion prompts and first-visitor runtime generation.
---

# Landing Page Regions

Use this skill when a landing page needs region-specific content: tax, filing and portal terminology (BTW in the Netherlands, VAT in the United Kingdom, GST in India, TVA in France), local examples, or ROI calculator hypotheses expressed in local price levels and currency. Language translation alone cannot do this, because translation never changes numbers or jurisdiction terms.

## How it works

Each landing-page section is adapted per region, then translated per language:

```text
base section (chat-config.json, base language)
  └─ stage 1: region adaptation   platform prompt + companion prompt + region profile
       → regions/<region>/sections/<section>/source.json      (region source language)
  └─ stage 2: translation          existing translation pipeline, never changes numbers
       → regions/<region>/sections/<section>/<language>.json
browser: translated page + region overlays for the visitor's language
```

- Sections are derived automatically for every theme: `root` (root scalars), `<rootKey>` (for example `roiCalculator`, `closing`), and `<themeKey>.<childKey>` (for example `formOperations.useCases`). `localization`, `design` and `capabilityPreview` are never adapted.
- Only sections listed in `regions.json` are adapted. Everything else keeps the page's base translation.
- Every generated file records a revision chain (base section, companion prompt, region context, platform prompt and policy versions). A file whose `adaptationKey` still matches is used as-is; a missing or stale file is regenerated once by the first visitor, shared through the server cache, and committed in a batch. Files pinned with `regeneration: manual` are never regenerated at runtime.
- Visitors from a country without a declared region get an automatic region when `generation.mode` is `auto`. It has no facts: copy terminology may be adapted (marked unreviewed), but ROI numbers stay on the base model until a reviewed profile exists.
- ROI numbers change only when the region profile is `reviewed` and a reference exchange rate is available. The platform then sets the calculator currency and locale; validators keep amounts in bounds, keep equal and yearly (×12) relationships, keep each amount within a plausible range of the converted base value, and require prose amounts to match or scale with the adapted numbers.

## Asset layout

```text
assets/chat-config.json                       base page; localization.regionAdaptation.enabled
assets/landing-page.<language>.json            base translations (unchanged)
assets/landing-page/
  regions.json                                 authored manifest
  prompts/<sectionId>.prompt.md                authored companion prompt (optional per section)
  regions/<region>/profile.json                authored region profile
  regions/<region>/sections/<section>/source.json    generated
  regions/<region>/sections/<section>/<lang>.json    generated
```

Runtime generation writes only `regions/<region>/sections/**`. It never writes `chat-config.json`, prompts or profiles, and never triggers the database-to-Git chat config sync.

## regions.json

```json
{
  "schemaVersion": 1,
  "generation": { "mode": "auto", "model": "gemini-2.5-flash", "inlineWaitMs": 2500, "dailyAutoRegionCap": 10, "dailySectionBudget": 60, "dailyTranslationBudget": 300 },
  "presentation": { "allowRegionOverride": true },
  "sections": {
    "roiCalculator": { "prompt": "assets/landing-page/prompts/roiCalculator.prompt.md", "regeneration": "auto" },
    "formOperations.useCases": { "prompt": "assets/landing-page/prompts/formOperations.useCases.prompt.md" }
  },
  "regions": [
    { "key": "gb", "label": "United Kingdom", "countryCodes": ["GB"], "sourceLanguage": "en", "defaultLanguage": "en", "preGenerateLanguages": ["nl"], "profile": "assets/landing-page/regions/gb/profile.json" }
  ]
}
```

- A two-letter region key must be one of its own countries, so it can never collide with an automatic region.
- A declared region owns its countries even when disabled.
- `?region=<key or country>` previews another region when `allowRegionOverride` is true.

## Region profiles

```json
{
  "schemaVersion": 1,
  "locale": "en-IN",
  "currency": "INR",
  "inheritBaseTranslations": true,
  "glossary": [{ "id": "tax.indirect.term", "term": "GST", "preserve": true, "evidence": ["gstn"] }],
  "facts": [{ "id": "labor.office-admin.hourly-cost", "value": 450, "unit": "INR/hour", "asOf": "2026-06", "evidence": ["gstn"] }],
  "priceLevel": { "indexVsBase": 0.32, "baseCurrency": "EUR" },
  "evidence": [{ "id": "gstn", "title": "GST returns", "publisher": "GSTN", "url": "https://www.gst.gov.in/" }],
  "review": { "status": "reviewed" }
}
```

- `currency` must be the country's CLDR currency unless `currencyOverrideReason` explains otherwise.
- Money facts must use the profile currency. Evidence must use HTTPS.
- Use `inheritBaseTranslations: false` for script variants such as `zh-TW`, whose copy must be region-owned.
- Never invent legal obligations, rates or deadlines. Research official sources, keep the glossary narrow, and set `review.status` to `reviewed` only after a person has checked the profile. Reviewing a profile regenerates its sections.

## Companion prompts

```markdown
---
sectionId: formOperations.useCases
policy: copy
requiredFacts: []
optionalFacts: [tax.indirect.term, tax.return.name, tax.portal.name]
numericExtensions: []
regeneration: auto
---
Replace the indirect-tax return, filing portal and credential names with the target market equivalents.
```

- Prompts are region-agnostic: they describe how the section changes between markets, never a specific market.
- `requiredFacts` blocks generation (the section inherits) until every listed id exists in the profile. Automatic regions have no facts, so prefer `optionalFacts` unless a claim must be evidence-backed.
- `numericExtensions` lets an ROI section also adapt `volume`, `minutes`, `review` or `included_volume`.
- Start from `references/prompt-templates/` (`--scaffold-prompts` does this).

## Commands

Run from `server/`:

```bash
# What exists, what is missing or stale, and which automatic regions were created at runtime
npx tsx skills/landing-page-regions/scripts/generate-landing-page-regions.ts --repo /abs/persona --inventory

# Write template prompts for the sections listed in regions.json that have none yet
npx tsx skills/landing-page-regions/scripts/generate-landing-page-regions.ts --repo /abs/persona --scaffold-prompts

# Pre-generate declared regions (source language plus preGenerateLanguages)
npx tsx skills/landing-page-regions/scripts/generate-landing-page-regions.ts --repo /abs/persona \
  --regions gb,in --languages default --provider gemini --confirm-external --apply

# Validate manifests, profiles, prompts, freshness and ROI rules
npx tsx skills/landing-page-regions/scripts/generate-landing-page-regions.ts --repo /abs/persona --check

# Mark a region's generated sections reviewed after a person checked them
npx tsx skills/landing-page-regions/scripts/generate-landing-page-regions.ts --repo /abs/persona --mark-reviewed gb
```

Providers: `gemini` uses `GEMINI_API_KEY`; `openai` uses an OpenAI-compatible endpoint from `LANDING_TRANSLATION_API_URL` and `LANDING_TRANSLATION_API_KEY`. Any non-local provider requires `--confirm-external`.

## Enabling a persona

1. Author `regions.json`, profiles and prompts in the persona repository.
2. Pre-generate with `--apply`, then run `--check`.
3. In `assets/chat-config.json`, set `publishedConfig.landingPage.localization.regionAdaptation` to `{ "enabled": true }`. A page cannot enable it while it still has `localization.regionalPages`.
4. Commit and push the persona repository (only when asked), then pull the chat config into the platform so the database snapshot cannot restore removed content.

## Invariants

- Translation never changes numbers; region adaptation owns them.
- Numbers change only for reviewed profiles with a reference exchange rate; currency and locale are platform-set.
- Runtime writes are limited to generated section paths and never touch `chat-config.json`.
- Protected glossary terms stay byte-for-byte unchanged in translations.
- A generated section is served only while it keeps the whole landing page valid.

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
