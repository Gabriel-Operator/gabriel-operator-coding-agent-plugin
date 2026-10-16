---
name: persona-roi
description: Configure Gabriel Persona planning calculators and evidence-backed ROI monitoring from accepted outcomes, captured ontology projections and attributed costs. Use for ROI/Impact definitions and interpretation, not for assigning invented value to generated rows or funding.
---

# Persona ROI calculator and monitoring

Read [the operating framework](references/persona-framework.md) and
[the valuation/evidence contract](references/roi-evidence.md). Inspect the actual
landing calculator, parent ontology, List/workflow outputs and existing
`publishedConfig.roiMonitoring` before adding a metric.

The public calculator illustrates disclosed assumptions. The authenticated
ROI/Impact view measures accepted, committed results. Both reference the same
authored calculator definitions through an actual `calculatorPath`; viewing
a page does not save a baseline or accept an outcome.

Map stable outcome identities and required evidence onto captured ontology
attributes. Deduplicate retries and multiple observations of one result;
preserve correction/withdrawal history. A generated lead, proposed purchase,
budget, preview or sandbox success is not a sale, saving or realized return.

Time value needs the runner's explicit baseline and hourly value, paired
preparation/review effort and matching currency. Monetary differences need
committed comparable baseline/actual amounts at the accepted boundary. Preserve
negative values, unknown costs, currency boundaries and coverage disclosures.
Only known comparable positive investment permits `(value - cost) / cost * 100`.
Keep provider expense, consumed/refunded credits and top-up funding separate.

Use `gabriel_get_persona_roi` or persona-bound `persona_get_roi` for private,
bounded-period runner evidence. Neither accepts outcomes, executes a playbook
nor changes valuation assumptions. Author config through the normal candidate,
evaluation and publication flow. Outcome-based calibration remains a reviewable
proposal; feedback does not authorize autonomous threshold or policy changes.

Add the existing ROI/Impact sidebar destination with registered outcomes
components and `source: "outcomes"` data points. Keep it separate from Home/Coach
tabs. Validate the real calculator path and ontology mappings with the portable
ROI validator, then exercise acceptance, retries, withdrawals, missing/negative
values, currency mismatch and runner/workspace isolation.


## Public planning calculators

For new or updated public calculators, read [compact pricing and ROI](references/compact-calculator.md).
Use three authored calculation assumptions and a single public investment input, capped monthly pricing, Pricing navigation and
the shared deterministic evaluator. Unknown inputs remain null; free plans have no
ROI percentage. `gabriel_calculate_persona_roi` / `persona_calculate_roi` return
planning estimates, never accepted outcomes or measured ROI. Keep the existing
read-only measured tools and historical calculator pins intact.

## Required playbook team protocol

Every slash command and directly runnable saved Canvas playbook owns a human-reviewed schema-v1 `team`. Generate or validate it after defining steps with `gabriel_propose_playbook_team` / `gabriel_validate_playbook_team`, then return the authenticated review URL. Use `gabriel_update_playbook_team` with the current `expectedFingerprint` to save a draft. API/MCP clients cannot confirm, import or manufacture human approval. Activation and new launches fail with `TEAM_REVIEW_REQUIRED` or `TEAM_REVIEW_STALE` until the author/owner confirms.

Define contextual specialist sub-agents with explicit goals, start conditions, outputs, completion criteria, approved stage IDs, hierarchy, recipients and finite invocation/step/time limits. Coordinator, reviewer, scorer, independent judge, auditor and memory steward are always present. Assign one integration owner. Preserve ontology usage, feed revision references, declared record operations, optional recorded Signal triggers and authored outcome metric bindings; missing semantics or capabilities block affected work. Deterministic actions remain tools of the appropriate specialist.

Runtime authority, claims, exact-effect approvals, audit, encrypted artifacts and private memory are server-owned. Delegation never expands permissions. Downstream work consumes accepted versions. Unknown effects require reconciliation; never automatically repeat them. Provider costs and Gabriel credits are separate. A delivered artifact does not prove economic value: capture accepted committed evidence with the producing ontology/calculator pins and saved baseline, preserving unknown costs and coverage gaps. Team/ontology/Signal/calculator changes remain reviewed proposals. Portable Git carries definitions and stable references only.


### Finalization and review evidence

Task outputs may declare `output.ontology` projections and `recordOutputs` mappings. Each mapping uses JSON pointers, an existing List/pipeline resource key and a permitted create/update/delete operation. Map actual accepted values; updates/deletes require an observed runtime record ID. The server prepares encrypted intents and commits them only after final judging through existing authorization and exact-effect approval. Native action steps retain their original action-boundary controls. Do not claim a generated draft has been persisted or economically accepted.

Coordinator-directed revisions preserve the reviewed goal and capability envelope. Rejected drafts, accepted versions and source provenance remain auditable. The memory steward selects bounded facts/decisions/lessons from accepted evidence; server-copied values retain artifact/version references. Reuse requires finalized successful work with compatible actor/workspace/team/ontology semantics. Quality exceptions retain history without promoting new facts. Use the authenticated run UI to inspect saved evidence, provide human scores and reasons for every criterion, and review improvement drafts. Mock suites are not human reference results. Feedback drafts require renewed confirmation; persistence, accounting and authority failures cannot be waived as quality exceptions.

Real navigation and transformations require owned work products. An opaque capability that cannot enforce individual effect boundaries blocks confirmation with `TEAM_CAPABILITY_GOVERNANCE_REQUIRED`; replace it with governed tools rather than approving around the restriction.

For a family activity or school-workshop flagship, read [the community activity loop contract](../persona-framework/references/community-activity-loop.md). It covers shared guided state, scoped refreshable feeds, opt-in Signals, reviewed team execution and adult-confirmed occurrence ROI.

Public pricing widgets expose customer investment only. Outputs (work delivered, time returned and value) are read-only. Author bounded free access for every audience and seven-day trials for paid plans; planning quotes do not change billing. Source fixed forecast assumptions and disclose benchmark limitations, human review, full-use assumptions and negative returns. See the compact-calculator reference.
