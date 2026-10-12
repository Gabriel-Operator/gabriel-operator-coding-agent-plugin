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
