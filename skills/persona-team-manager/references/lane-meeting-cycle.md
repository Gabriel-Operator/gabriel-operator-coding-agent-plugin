# Lane: Meeting follow-through reference

The portable candidate is [lane-studio-teams.json](../assets/lane-studio-teams.json). It contains six paused bot references, five handoffs and both playbook kinds. It is a model for review, not a registered or certified live automation. Budget is zero. No account, phone destination, meeting link, email content, Notion page ID or approval ships in it.

Use the current workspace export before merging this model. Preserve existing team IDs and playbooks. Register through the user-facing authoring tools rather than copying database documents or pushing source repositories. Discover each actual MCP operation and map it explicitly; names such as `upcoming`, `search`, `call`, `transcript` and `update` are logical requirements, not invented provider tool names.

## Resources and sequence

1. The owner reviews team background policy, spending and the shared Notion Contacts publisher. Each member separately enrolls. Google Calendar, Gmail and the supported capture adapter use that enrolled member's accounts; Inkbox calls use their permitted phone identity and verified profile destination; shared Notion writes use the restricted app publisher.
2. Poll accepted upcoming meeting occurrences every five minutes. Deduplicate by provider occurrence plus member, and prepare 30 minutes before the meeting. Calendar changes invalidate pending timing; initial discovery establishes a baseline.
3. Missing personal accounts create targeted setup requests in the team conversation. Reconnect and resource consent must be verified before the same checkpoint resumes.
4. The goal researcher matches exact attendee email and looks back 90 days in relevant mail. It may create nested researchers under the root allowance. Produce a brief with citations; keep raw mail private. Only the authorized brief projection enters shared results.
5. The caller uses the member's server-verified phone destination, maximum 180 seconds and one automatic attempt per occurrence. The scribe independently schedules consented meeting capture. Poll for a verified transcript with an operation deadline; neither task keeps compute waiting.
6. The analyst evaluates registered Signal rules with transcript citations. Dispatch accepted follow-up work once per occurrence, preserving duplicate-event receipts.
7. The CRM steward uses explicit attendee-email → Notion-page → Lane-record identity mappings. Never match a person by display name alone. Publish through one Notion path, then update shared Lists, app freshness, Live results and attributed learning.
8. After the first accepted researcher run, capture and review a procedure. Demonstrate a second occurrence with different input, fresh reads and grants. No old call, write or approval may be replayed.

## Lane's existing vocabulary and links

The inspected Lane `list.lane.leads` definition uses `identified`, `qualified`, `contacted`, `responded`, `converted`, `dead`. Preserve these values when mapping Notion statuses. Existing relationship resources are `list.lane.relationship-meetings`, `list.lane.relationship-observations` and `list.lane.relationship-outcomes`; leads use `pipeline.lane.introduction-lifecycle`. Define a separate central Meeting cycles List keyed by member and provider occurrence. Do not turn scheduled meetings into held meetings without capture evidence.

## Delivered runtime and live setup boundary

The native coordinator dispatches registered program bots with captured member identity and shared parent allowances. Workflow and pipeline connector steps resume the same durable operation rather than repeating effects. The meeting scheduler maintains private occurrence receipts, separate owner activation and member enrollment, independent research/capture tracks, accepted Signal occurrences, contact identity mappings and authorized shared List/page publication. Native Inkbox supplies the bounded phone call; no Vapi account is required.

The fixture cycle exercises Calendar → Gmail research → briefing → verified transcript → registered Signal → one Notion write → shared Lists/page with isolated storage. All provider replies, model decisions and meeting times in that cycle are simulated. It does not certify provider account scopes or real media delivery.

Before a live cycle, follow [production setup](production-setup.md): import reviewed definitions through the authoring service, import the team-owned Meeting cycles List, pipeline and app views with the model, select an existing shared page, map actual discovered MCP tools/results, configure shared publishers and exact contact identities, and obtain owner activation and individual enrollment. The sample does not automatically install accounts, activate work or alter Lane's existing pipeline. Its resource file documents the existing pipeline link; typed connector transitions must be authored and pinned through the pipeline's normal editor if used.

Recall’s official MCP does not create meeting bots. The native adapter instead reuses the member’s active AI Resources Recall account for bounded bot scheduling and completed transcript retrieval, retaining a receipt before provider dispatch. Uncertain creation is held without creating another bot. Revocation or cancellation stops scheduled attendance where the provider connection remains available. A supported remote MCP capture adapter or verified transcript source remains an alternative. The cycle verifies authenticated polling results and does not accept unsigned callback bodies as proof of capture.

Live verification requires dedicated test events/emails, approved phone destinations, consenting participants and disposable Notion records. Record actual provider receipts, procedure adoption/reuse and cleanup separately from fixture evidence. No live provider cycle has been run.
