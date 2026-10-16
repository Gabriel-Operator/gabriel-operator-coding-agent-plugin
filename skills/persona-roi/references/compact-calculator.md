# Compact public pricing and ROI

Use this reference when creating or updating a landing-page calculator. The default
is one themed compact section with Pricing navigation, a monthly offer, three
investment slider and read-only forecasts, and daily/weekly/monthly comparisons. Keep
the legacy renderer for unrelated models; do not activate signals or workflows.

## Presentation

Match the surrounding section width, gutters, spacing and the persona's original
heading/number fonts. Highlight required spend on the left and one large estimated
return or time-saved figure on the right. Do not render editable output controls. Briefs, net time returned and value are
read-only results of the selected plan and authored forecast assumptions. Use small Day/Week/Month controls
for comparable cost and return views. Keep explanations, formula details and
coverage notes in How it’s calculated, not repeated throughout the main panel.

The shared investment slider selects an authored ongoing free plan (0) or draft
1×, 2× and 3× paid plan sizes. Paid price and included capacity scale together.
Forecasts use authored defaults, including workload and valuation. Visitors cannot
edit briefs, minutes returned, conversion gain or hourly value. For per-store
plans the public forecast uses the authored store count; paid cycles scale with
plan size. Do not reinterpret output quantities as customer investment.

Every audience has a bounded `offer.free` allowance (`includedUnits`, `allowance`,
optional `unitsPerWorkload` and `benefitFactor` for smaller free work). Free work
cannot exceed the base allowance; a benefit fraction reduces time value for a
smaller basic work unit. Paid offers declare `trialDays: 7` and localized
`trialLabel`. Trial usage is one basic free allowance, not another monthly quota.
Display recurring monthly price after trial; selection does not start a trial or
provision billing/entitlements. Free plans have no ROI ratio.

Research and disclose fixed forecast assumptions with source links, date, task
budget, assisted human review time and capacity-use assumption. A benchmark is
not evidence that this persona delivers the same gain. Keep measured returns
separate, preserve negative scenarios, and use zero attributed sales/proceeds
uplift where no causal evidence exists. Never manufacture positive returns.

Place the allowance beside the result heading. Keep the demo CTA full width at
the bottom. Pointer focus must not draw a rectangular border around controls;
keyboard focus remains visible on the slider thumb or button text.

## Definition

Author `landingPage.roiCalculator` with `methodologyVersion: 2`, `enabled: true`,
an ISO currency, heading/disclaimer and empty `inputs`/`metrics` compatibility
arrays. Add `compact` with `schemaVersion: 1`, `defaultProfileId`, localized `copy`
and one to eight `profiles`. Each profile owns its stable ID, label, one supported
model, exactly three input definitions, offer, positive `unitsPerWorkload`,
disclosed assumptions, signal-to-reviewed-outcome explanation and existing CTA
target. No authored formulas, scripts, CSS or runtime rows are allowed.

Each input declares `id`, `label`, `help`, `defaultValue` (number or null), `min`,
`max`, positive `step` and `format` (number/currency/percent). Workload is a whole
number. Preserve negative savings/profit and distinguish null from explicit zero.
The offer declares `monthlyPrice` (nonnegative or null for a quote), `basis`
(fixed/per_unit), `unit`, `vatIncluded`, positive integer `includedUnits`,
`allowance` and separately quoted `extras`. Fixed-plan workload cannot exceed
the allowance; per-unit price and allowance scale together.

Use one platform-owned model, in this input order:

| Model | Input IDs | Monthly benefit |
|---|---|---|
| time_value | units, minutes_saved, hourly_value | units × unitsPerWorkload × net minutes ÷ 60 × hourly value |
| conversion_profit | units, conversion_uplift, order_profit | eligible sessions × uplift in percentage points ÷ 100 × contribution profit per extra order |
| net_proceeds | units, net_before, net_after | lots/pickups × (net proceeds afterward − beforehand) |

Net = benefit − customer app subscription cost. ROI = net ÷ subscription cost ×
100 only with known benefit and positive cost. No ratio for free plans. Weekly
equivalents are monthly × 12/52; daily equivalents are monthly × 12/365. They
are averages; billing remains monthly. Monetary time value is optional and is
not cash received, a payroll reduction, funding proceeds or provider profitability.
Contribution profit deducts goods, fulfilment, returns and discounts. Net scrap
proceeds include physical operating costs and exclude the separately deducted app
fee. Do not double-count additional orders, repeat purchases or the same saving.

Unsupported benefits start null. Existing baseline minutes are not automatically
minutes saved. Net minutes already include customer review and approval. Do not
fabricate a valuation to produce positive ROI. Source and regional model choices
remain separate from language; translation preserves IDs, models, prices and units.
Use the model's native currency or a dated platform conversion, never relabel a number.

## Read-only planning tools

Gateway: `gabriel_calculate_persona_roi({pageId, profileId?, tierMultiplier?})`.
Persona-bound: `persona_calculate_roi({profileId?, tierMultiplier?})`.
REST: `POST /api/gateway/pages/{pageId}/roi/calculate` with `{profileId?, tierMultiplier?}`.

Optional `tierMultiplier` accepts an authored free plan (0) or 1, 2, 3, defaults to 1 and is returned
with the effective offer and input bounds. It cannot override the base price.
Public widgets and planning interfaces use authored defaults only. Brief counts,
minutes returned, hourly valuation, conversion uplift and proceeds are forecast
parameters; callers cannot edit them. The request accepts only the audience and
investment tier. Output `forecastDefinitions` discloses the three authored
parameters; `inputDefinitions` describes the investment control. Unknown fields,
`inputs` overrides, unsupported profiles and unconfigured free tiers are rejected.
Reads use the authorized published persona/workspace model,
not an unpublished draft, and return `kind: planning_estimate`, model revision,
currency, profile, effective inputs, assumptions, offer, readiness/missing inputs
and daily/weekly/monthly numeric results. They do not run agents, persist baselines,
accept outcomes, consume credits or alter billing.

For example, Paya Home's authored four journeys × nine net minutes ÷ 60 × the fixed
€14.99/hour reference gives €8.99/month time value. A €6.99 subscription gives
about €2.00 net time value and 28.7% time-value ROI. This is an illustrative comparison,
not measured cash savings.

## Measured ROI and release checks

Keep `gabriel_get_persona_roi`, `persona_get_roi` and GET `/pages/{pageId}/roi`
for accepted, captured outcome evidence. Preserve `roiMonitoring.calculatorPath`,
historical snapshots, deduplication and private workspace boundaries. Public
pricing is a reference, never actual spending or outcome acceptance. Keep provider
cost, consumed/refunded credits and top-up funding separate.

Validate calculator assets, source/child mirrors, configured translations,
cross-interface arithmetic, null/zero/negative/free-plan behavior and access
boundaries. Verify each audience's section and Pricing link on desktop/mobile,
with legible track/thumb/text, shared styled controls, keyboard focus and RTL.
Deploy compatible platform support before publishing models with new fields.
