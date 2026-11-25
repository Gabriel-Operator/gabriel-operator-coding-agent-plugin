# Reference workflows

These are recipes, not preverified provider tool names. Inspect the user's current MCP and record exact schemas before substituting operations. The automated fixtures use a deterministic MCP stub and never imply live-provider verification.

## Google Sheets row changes

Select spreadsheet + worksheet in fixed read/write arguments. Bind stable record IDs from a dedicated identity column, not a changing array index or row position. Extract rows into declared app fields and map them to an authorized portable List. Poll changes at the effective quota-aware interval. Baseline import produces no historical tasks. Preview changed row → mapped draft/run → accepted List output → conditional update/writeback. Shared inbound updates retain connector ancestry to prevent echoes. Provider-native conditional revisions are required for unattended updates where another writer can race.

## Frame.io review feedback

Use the official Frame.io MCP where available for comments/files/version operations. Its MCP connection does not itself create webhooks. Configure Adobe V4 webhooks separately with Adobe OAuth and workspace/account access; register the signing secret in the installation's webhook configuration. Scope a workspace-wide webhook to the chosen project/resource. Verify `X-Frameio-Request-Timestamp` and `X-Frameio-Signature` against the exact raw body before persisting the receipt. See https://developer.adobe.com/frameio/guides/Webhooks/.

Map a new comment's text, asset ID, author and requested time range into a task. The owner activates the selected video-editing bot and spending limits. The bot reads mapped task fields, updates the video through its reviewed playbook, commits a team asset and exports a new Frame.io version using the installation's declared operation. Preserve the comment/asset/version identity. Keep subsequent feedback pending during the active run. Do not upload again after an uncertain write until the original version is reconciled.

## Instagram comment feedback

Use a supported Instagram Business/Creator account with the necessary Meta app permissions; do not claim support for arbitrary personal-account monitoring. Choose media/account scope and the available comment read/reply operations. If approved Meta webhook delivery exists, verify its app-secret signature and challenge token separately from MCP authentication. Batch webhook entries must retain all comment occurrences. Otherwise use supported authorized polling; visibly disable monitoring when neither method is available.

Map comment text, media ID and selected context into the chosen social/marketing bot's task. The reviewed playbook decides which response or asset update is allowed. Posting/replies remain explicit declared processing actions, rather than treating Instagram as a bidirectional database. Owner activation still applies.

## Webhook configuration

`POST <installation>/webhooks` accepts provider `frameio|meta|composio|hmac`, signing `secret`, `entityId`, `eventPath`, `idPath`, `eventMap` (provider event → normalized declared event), `fields` (normalized field → payload JSON Pointer), and nonempty `scopes:[{path,equals}]`. The response contains the callback URL and, for Meta verification, a one-time verification token. Store them securely. Configure subscriptions at the provider; saving an endpoint is not evidence that the provider is delivering. Managed triggers use standard `webhook-id`, `webhook-timestamp`, `webhook-signature` verification. Generic HMAC uses `X-Connector-Timestamp` and `X-Connector-Signature: sha256=<HMAC(secret,timestamp.rawBody)>` with a five-minute window.
