---
name: mobile-app-builder
description: Configure and test a fixed-persona Flutter mobile app from its model repository, including branding and user-owned GitHub builds.
---

# Mobile app builder

## Offline-first acceptance

Read [the embedded runtime contract](references/offline-runtime-v1.md). Configure preparation and locally restored authentication/Persona startup, visible readiness and conflict states, explicit **Sync now**, encrypted backup export, and capability-aware actions. Guided journeys must persist locally. Verify a cold offline launch, installed SQLite3MultipleCiphers and local models, app suspension/checkpointing, and catch-up execution on every supported device target.

Read [the config contract](references/mobile-app-contract.json) and
[the example config](references/persona-app-config.json) before authoring.

## Ownership and configuration

The persona model repository owns the cross-platform
`assets/persona-app-config.json` and artwork under `assets/mobile/`. References
in this skill are documentation/templates,
not a second runtime configuration source. Shared Flutter code stays in `mobile/`
in the marketplace checkout. Do not fork or export the marketplace web/backend.
For an unmigrated repository, the loader still accepts schema-v1
`assets/mobile-app-config.json`; never keep both files in one repository.

Resolve the deployed page ID from the persona's published model or platform.
Do not use the repository UUID or a `persona.*` resource key as a page ID.
If only a resource key is available, keep a clearly named draft until resolved.
Preserve existing chat behavior in `assets/chat-config.json` and web modules in
`chat-app.json`; do not invent a mobile menu schema. The supported preset is
signed-in `persona-chat` with fixed-persona navigation.

Signals and Schedule are defined by the shared Chat App automations contract,
not by a mobile-only manifest. Preserve `signalPresets` and declared automation
actions when preparing a branded app. Verify that draft presets remain disabled,
the overview switch pauses/resumes saved definitions, and the native editor,
history, approvals, and signal ROI use the same runner-owned runtime data as web.

Set stable app identifiers owned by the user. Example identifiers are development
placeholders. Keep GitHub credentials, build bindings, package versions, signing
keys and store secrets out of the persona definition.

## Artwork

Keep character references, generated icon/splash/background PNG masters, prompts
and checksums in versioned model-repo asset directories. Preserve the persona's
identity and requested style. Wings represent Super Connector people matching;
use them only for personas confirmed to perform that function. Do not add wings
as generic assistant decoration or enable matching just to justify artwork.
Current runtime branding accepts accentColor, optional light/dark `branding.theme`
seed palettes from the model repo, and optional inline PNG iconPng. Prepare and
CI expand those seeds into Flutter tokens and fail the build on invalid hex or
contrast. Local prepare also copies landing-page brand colors into the snapshot
config when `branding.theme` is omitted.
Local prepare and GitHub CI also stamp `assets/mobile/<current>/logo.png` and
`splash.png` onto the generated app icon, splash, and in-app login image.
Optimize an icon derivative to the upload limit before embedding `iconPng`;
do not add unsupported iconPath/splashPath/backgroundPath fields.

## Publish UI

With the Persona apps feature flag enabled, open ChatPublishModal → Persona Apps.
Load configuration from persona Git after authorized repository changes, or edit
the no-code fields, review the changed JSON paths and generated JSON, then use
Save and register configuration to synchronize `assets/persona-app-config.json`.
The exported JSON is a draft until saved. Saving registers the manifest to the
Persona; it does not compile or register an app with an external store.
Select a released mobile package and a repository owned by the connected user,
then explicitly Build test app. Builds must never fall back to internal or
marketplace repositories. Current CI produces Android test APKs and iOS simulator
archives; it does not publish to stores or produce installable iPhone releases.

## Local testing

From the marketplace checkout, use an empty output directory:

```bash
./mobile/persona.sh prepare --config /path/to/persona/assets/persona-app-config.json --output /path/to/empty-build --api-url https://gabrieloperator.com
./mobile/persona.sh devices --project /path/to/empty-build
./mobile/persona.sh run --project /path/to/empty-build --device DEVICE_ID
```

The helper requires Flutter 3.41.5. For a physical iPhone, configure the generated
Runner workspace's development team/signing, then from the generated project run:

```bash
flutter run --profile -d DEVICE_ID --target lib/main_persona.dart --dart-define-from-file=bootstrap.json
```

Read `mobile/README.md` for platform prerequisites and manual store signing.
Test sign-in, fixed-persona chat, history, attachments, supported execution,
credits and logout. Report configuration validation separately from compilation
and device acceptance. Local tests use the configured backend and account credits.
