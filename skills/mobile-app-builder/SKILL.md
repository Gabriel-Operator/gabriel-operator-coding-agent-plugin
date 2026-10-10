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

## Context-aware ontology

Use the parent persona’s `assets/ontology.json` for Global → country/region → one authenticated audience → language → terminology. Refer to [the ontology skill](../persona-ontology/SKILL.md) for snapshots, stable IDs, validation, preview and gateway/MCP authoring. Child resources reference that contract; stored instances and credentials remain in existing runtime storage. Preserve captured ontology selections during retries and downstream mappings. Saving an ontology candidate is separate from activation.

## Persona Google Maps configuration

Google Maps configuration is always per persona. Configure it on Edit Persona →
Super Connector → Google Maps, or Publish App → Persona Apps. Never instruct the
user to put Maps keys or a Maps feature flag in a build environment. The shared
editor saves encrypted web/Android/iOS keys and map ID outside portable Git.

Author-only MCP: `gabriel_get_persona_maps_config` and
`gabriel_update_persona_maps_config` (`pageId`, optional `webApiKey`,
`androidApiKey`, `iosApiKey`, `mapId`), requiring `digital-twin:admin`.
GET/PUT `/api/gateway/pages/:pageId/maps-config` expose status/fingerprints and
save keys. Blank key inputs preserve current credentials. Runner discovery reads
only the chosen persona's settings; it cannot change author credentials.

Branded app manifest: `integrations.googleMaps = { enabled: true,
configurationSource: "persona" }`. This portable setting contains no raw key.
The publishing pipeline resolves saved persona settings into its native packaging
snapshot and stamps Android SDK metadata and iOS Info.plist automatically. Local
packaging resolves the same author-only `/maps-config/runtime` endpoint with the
existing Gabriel account authentication; it does not accept Maps environment keys.
Publish an updated mobile package after changing native SDK keys. SDK metadata is
checked through the native persona Maps bridge, not a Dart environment flag.
Web uses an isolated per-persona map frame so SPA navigation cannot reuse a different
persona's Google key. Match visibility, geofence and school gates remain server-owned.
Keep raw keys out of portable repositories, public landing repos, logs and prompts.

### Google photorealistic 3D Maps

Choose `renderMode: "3d"` in the persona's saved Maps configuration (Edit Persona or
Publish App), or pass it to `gabriel_update_persona_maps_config` / PUT
`/api/gateway/pages/:pageId/maps-config`. The default is `"standard"`; omitting the
field preserves the saved value. This opt-in applies to that persona only. Never
enable it globally for Juno or other personas. Masked author settings, browser
runtime settings and the native packaging snapshot all expose the selected mode.

Use Google's actual 3D SDKs: web Maps JavaScript `maps3d`, Android
`play-services-maps3d:0.2.2`, and iOS `GoogleMaps3D` Swift Package pinned to 1.0.0.
Native 3D is experimental; Android needs API 26+ and iOS needs 16+. A 2D switch
remains available. The app generator links the iOS package only for 3D personas,
initializes both SDKs from the saved persona key, registers native platform views,
and stamps Android's `com.google.android.geo.maps3d.API_KEY`. No Maps keys or
feature flags belong in environment variables or public portable repositories.
Changing native configuration requires publishing a new app package.

Draw a terrain-clamped great-circle polygon from the saved center and radius.
Use the same server-scoped activity and approximate adult-profile pins in 2D and
3D. Panning, tilt, or switching views must never broaden a search. Schools retain
school ID and active-profile isolation. Hide all pins during an unsaved area
preview; clear old activity pins immediately after saving an area, ignore stale
callbacks, and reload even when the saved coordinates are unchanged. Category
filters must filter map pins too. Activity markers open their activity details.
Keep Google attribution and SDK errors visible. Never present generated artwork
as an accurate geographic layer. AI image generation is not required for 3D Maps.

Enable billing and the Maps JavaScript API / Maps SDKs / Maps 3D SDKs in the key's
Google Cloud project and apply web referrer, Android package+signing SHA-1 and iOS
bundle restrictions as appropriate. Key presence is not proof of authorization.
Test Neighborhood and Schools on iOS and Android with native controllers, geocoding,
markers, radius previews/saves and mode changes. Report simulator fixture/API tests
separately from live imagery and physical-device coverage; Google authorization
failures must remain explicit blockers for live rendering verification.
