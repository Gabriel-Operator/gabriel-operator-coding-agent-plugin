# Connector result mappings

Discover the selected tool's actual result schema and read an authorized sample before configuring a logical operation. Tool names and an MCP URL do not establish semantics. Keep private samples outside Git; use sanitized examples for package fixtures.

`bind_program_connector` accepts either the existing `resultFields` record of JSON Pointers, or a `resultMapping` expression per logical operation. Argument mappings still live in the installation's pinned connector manifest. A result mapping cannot change tools, resources, account identity, approvals or sharing grants. Changes invalidate effect approvals through the connection grant fingerprint.

Call `preview_result_mapping` with `teamId`, `mapping`, `fixture` and optional sanitized operation `input` before binding. The service makes no provider call and saves no sample. Fixture and input together are limited to 64 KB; output is limited to 256 KB. The returned `mappingFingerprint` identifies the exact mapping previewed. A scoped team setup key supports this operation. The bundled helper is `node scripts/team-manager.cjs call preview_result_mapping sample.json`.

Expressions are JSON objects with an `op`:

| Operation | Required fields | Behavior |
|---|---|---|
| `path` | `path` | Read a safe JSON Pointer; `""` selects the current value. |
| `root` | `path` | Read the original provider result, including inside an array expression. |
| `input` | `path` | Read only the current operation's logical arguments; no credentials or ambient account context. |
| `literal` | `value` | A string, finite number, boolean or null. |
| `object` | `fields` | Build named fields from expressions. |
| `array` | `from`, `map` | Map each array item; optional boolean `where` and `maxItems` (default 100, maximum 1,000). |
| `some` | `from`, `test` | True when one array item satisfies a boolean expression. |
| `coalesce` | `values` | First value that is present and neither null nor an empty string. |
| `equals` | `left`, `right` | Compare scalar values without string coercion. |
| `gt` | `left`, `right` | Compare finite numbers; missing or invalid values are false. |
| `number` | `value` | Convert an explicitly numeric string or finite number; other values are missing. |
| `lowercase` | `value` | Lowercase a string without coercing other types. |
| `email` | `value` | Normalize a single mailbox address, optionally `Name <address>`; multiple addresses and line breaks are rejected. |
| `first` | `from` | Select the first array value; an empty array returns missing. |
| `when` | `test`, `then`, `otherwise` | Evaluate one branch of a strict boolean condition. |
| `present` | `value` | Test for a value other than missing, null or empty string. |
| `all` / `any` | `values` | Boolean conditions; non-booleans are rejected. |
| `not` | `value` | Negate a boolean. |

Inside array `map`, `where` and `some.test`, paths are relative to that item. There is no evaluation, JavaScript, network access or ambient account context. Depth, expression size and total evaluation work are bounded. Oversized arrays fail with a pagination request instead of silently truncating records.

For a tool returning `{ "data": { "items": [...] } }`, an attendee-email projection is:

```json
{
  "op": "object",
  "fields": {
    "emails": {
      "op": "array",
      "from": { "op": "path", "path": "/data/items" },
      "map": { "op": "path", "path": "/email" },
      "maxItems": 30
    }
  }
}
```

Lane's `calendar.upcoming` contract needs `meetings` with stable occurrence ID, start/end timestamps, attendee emails, meeting URL and verified acceptance. Use nested `object`/`array` projections and explicit acceptance conditions supported by the returned schema. Do not turn every event into `accepted: true`, substitute a web page link for a meeting link, or silently omit cancellations. Providers that return partial cancellation records need a compatible resource-reconciliation adapter; a projection alone cannot invent the missing occurrence data. Unsupported semantics stay unavailable.

Gmail results may retain authorized message evidence in the private run. Only explicitly approved brief fields enter shared outputs. Notion write arguments must map the selected destination's real property schema and use the existing page/revision identity; result projection never weakens write concurrency or permits a second publishing path.

For reply detection, compare the provider's returned thread ID with `input /threadId`, find the original `input /afterMessageId` in that thread, then require a newer message from the exact `input /expectedSender`. Exclude sent messages and automatic submissions using the actual returned schema. Use `root` to compare an item against the original sent message and `when` to return `waiting` until a matching reply exists. A missing baseline or partial/paginated thread cannot establish a new reply. Never map `received` as an unconditional literal or treat a provider's successful thread fetch as evidence that a human replied.
