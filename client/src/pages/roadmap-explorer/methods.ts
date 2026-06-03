export interface MethodSection {
  label: string;
  body: string;
}

export interface MethodCard {
  group: string;
  name: string;
  sections: MethodSection[];
}

export const METHODS: MethodCard[] = [
  // ── Income Approach ────────────────────────────────────────────────────────
  {
    group: "Income Approach",
    name: "DCF (FCFF) — Discounted Cash Flow to the Firm",
    sections: [
      { label: "What", body: "Projects free cash flows to the firm over a 5-year explicit forecast period, adds a terminal value, and discounts everything at WACC." },
      { label: "FCFF formula", body: "EBIT × (1 − t) + D&A − CAPEX − ΔNWC" },
      { label: "When to use", body: "Uneven near-term cash flows, significant planned capex, company in a growth or transition phase, projections are well-supported by management track record and industry data." },
      { label: "When NOT to use", body: "Stable mature company where cap of earnings is simpler and equally defensible. Don't use DCF to appear more rigorous when the earnings are actually stable." },
      { label: "Terminal value", body: "Gordon Growth Model (FCF × (1+g) / (WACC−g)) is preferred for intrinsic going-concern valuation. Exit multiple is more common in M&A/PE contexts. Cross-check both — convert GGM output to implied exit multiple; convert exit multiple to implied g. If they disagree materially, your assumptions are not internally consistent." },
      { label: "Terminal value warning", body: "TV typically = 60–80% of total EV (Macabacus: ~75% in a 5-yr DCF, ~50% in a 10-yr DCF). Small changes in g or WACC dominate the result. Wall Street Prep flags TV > 85% of EV as a red flag — extend the explicit forecast, add a fade period, or lower g rather than forcing the model with optimistic terminal assumptions." },
      { label: "TV is a steady-state problem", body: "KPMG: only extrapolate from the final forecast year if it represents a true steady state. Private-company terminal years often still contain owner-transition effects, temporary margin expansion, catch-up working capital, or under-modeled maintenance capex. Confirm the final year is normalized BEFORE applying any perpetuity formula — do not force perpetual growth onto an unstable final year." },
      { label: "Long-term growth ceiling", body: "Nominal g cannot exceed long-run economy growth forever (the company would eventually exceed the economy). Damodaran's rule of thumb: g should not exceed the risk-free rate used in the valuation (both embed expected inflation). Using a low Rf while assuming high g creates an inconsistent numerator/denominator that biases value upward. US macro anchor: Fed 2% inflation target + CBO ~1.8% real GDP = high-3% nominal ceiling. Treat as a ceiling, not a default — 2–3% is defensible for ordinary mature businesses." },
      { label: "Growth must be funded", body: "Damodaran identity: g = reinvestment rate × return on invested capital. In stable growth, reinvestment rate = g / stable-period ROIC. A terminal value that assumes perpetual growth while capex merely equals depreciation and working capital needs vanish is internally inconsistent unless real growth is actually zero. Overstated terminal FCF (un-normalized maintenance capex / working capital) is a common source of private-company overvaluation." },
      { label: "Exit multiple embeds growth", body: "A market multiple is not 'objective' — it embeds an implicit long-run growth and return-on-capital expectation (Mercer Capital). CFA Institute: don't use a median peer multiple as a plug; it should reflect growth beyond the terminal year and the likely risk-free environment at exit. Footnotes Analyst: today's peer multiple is conceptually weak as a terminal anchor — prefer forward-priced comparable multiples that roll EV forward to a metric matching the subject's terminal-year state." },
      { label: "Reverse-engineer implied assumptions", body: "Use sensitivity diagnostically. Divide a Gordon Growth TV by terminal EBITDA/EBIT/NOPAT to get an implied multiple and compare to transaction/trading evidence. Translate an exit-multiple TV into an implied perpetual g; if it exceeds an economy-linked ceiling, the multiple is too aggressive. Sensitize terminal margins, tax, capital intensity, and working capital — not just WACC and g." },
      { label: "H-model / fading growth", body: "When the subject is still above mature growth at the end of the explicit forecast, a sudden 'cliff' to terminal g is unrealistic. The H-model assumes the high growth rate declines linearly over a transition period to the stable rate (H = half the transition period). It is a middle ground between a two-stage model and a full multistage forecast — best for growth-stage companies, niche market leaders, and businesses whose competitive advantage erodes gradually. Use a full multistage forecast instead when margins, capex, and working capital also change materially through the transition." },
      { label: "Mid-year convention", body: "Most operating businesses generate cash throughout the year, not just on Dec 31. Mid-year convention discounts Year 1 at 0.5, Year 2 at 1.5, etc. Produces higher value than end-of-year. Use end-of-year for seasonal businesses (heavy Q4 retailers, agricultural)." },
      { label: "Stub period", body: "If valuation date is not Jan 1, adjust the first period fraction and shift all subsequent discount periods accordingly — this resets the entire timeline, not just Year 1." },
      { label: "Equity bridge", body: "Enterprise value ± excess cash, non-operating assets − interest-bearing debt − debt-like items. Watch for deferred revenue (may be working capital OR debt-like depending on fulfillment cost), deferred taxes (discount to PV based on expected reversal, not always face value), and earnouts (ASC 805 fair value at acquisition date)." },
      { label: "Key pitfall", body: "Projecting expenses as % of revenue for 5 years without questioning whether that structure actually holds — especially salary and CAPEX." },
    ],
  },
  {
    group: "Income Approach",
    name: "DCF (FCFE) — Discounted Cash Flow to Equity",
    sections: [
      { label: "What", body: "Projects cash flows available to equity holders directly; discounts at cost of equity. FCFE = Net Income + D&A − CAPEX − ΔNWC + Net Borrowing." },
      { label: "When to use", body: "Stable capital structure, financial services firms, when valuing equity directly." },
      { label: "Key pitfall", body: "FCFE is mathematically equivalent to FCFF/WACC only when capital structure assumptions are perfectly consistent. Use as a cross-check, not a primary method, for most private-company work." },
    ],
  },
  {
    group: "Income Approach",
    name: "Capitalization of Earnings",
    sections: [
      { label: "What", body: "Divides a single normalized earnings figure by a capitalization rate: Value = E / (r − g), where r is the discount rate and g is the long-term sustainable growth rate." },
      { label: "Earnings base — simple average (3–5 yrs)", body: "Use when no directional trend exists and each year is equally representative. Good for mature, steady companies." },
      { label: "Earnings base — weighted average", body: "Use when recent years are more predictive. Common weights: 3-2-1 (most recent = 3) or 4-3-2-1. Must be tied to facts — not applied mechanically." },
      { label: "Earnings base — most-recent / LTM", body: "Use only when a structural break makes older history non-representative — major customer addition/loss, management change, completed turnaround. Rigorous normalization is essential because one period is more vulnerable to one-time effects." },
      { label: "Long-term growth rate", body: "Anchor to long-run nominal GDP (real GDP ~1.8% + inflation ~2% = ~3–4% ceiling for mature US companies per CBO). Industry growth is an overlay, not a substitute. If industry is declining, growth may be below GDP. A single-period cap model is not designed for extraordinary growth — use DCF for that." },
      { label: "Cap rate sanity check", body: "The inverse of the cap rate is the implied earnings multiple. If cap rate = 20%, implied multiple = 5×. Cross-check against GTC multiples for the same industry. If they diverge by more than 1–2×, revisit the discount rate or growth assumption." },
      { label: "Matching rule", body: "Pre-tax earnings → pre-tax cap rate. After-tax earnings → after-tax cap rate. Equity earnings (net income) → cost of equity. Unlevered earnings (EBITDA, EBIT) → WACC-based rate. Violating this matching rule is the most common cap-of-earnings error." },
    ],
  },
  {
    group: "Income Approach",
    name: "Excess Earnings Method (IRS Rev. Rul. 68-609)",
    sections: [
      { label: "What", body: "Hybrid method — values tangible assets at FMV, then capitalizes 'excess earnings' (total earnings minus a fair return on tangible assets) to estimate intangible/goodwill value." },
      { label: "Formula", body: "Goodwill = (Normalized Earnings − [Tangible Asset FMV × Fair Return Rate]) / Cap Rate for Intangibles. Total value = Net Tangible FMV + Goodwill." },
      { label: "When to use", body: "When the assignment specifically requires separating tangible from intangible value; when direct market evidence for intangibles is limited; professional practices (medical, legal, CPA); corroborative method in ANAV work." },
      { label: "Fair return on tangibles", body: "Rev. Rul. 68-609 gives 8–10% as examples only — these are NOT safe harbors. Modern practice derives the rate from market evidence: after-tax cost of debt on collateralizable assets + equity return on riskier tangible components. NACVA examples land in the high-single-digit range for asset-heavy businesses." },
      { label: "Intangible cap rate", body: "Rev. Rul. 68-609 gives 15–20% as examples. Critics note no empirical database supports these rates directly. Should be higher than the business's overall discount rate to reflect that intangibles are riskier than the whole business." },
      { label: "Major controversies", body: "(1) Subjectivity — four key inputs are all judgment-based; small changes produce large swings in goodwill. (2) Conceptual — assumes earnings can be cleanly split between tangible and intangible returns, which is economically questionable. (3) IRS has criticized indiscriminate use, saying it produces 'many improper appraisals.' Use as corroborative or last-resort only." },
      { label: "When IRS/courts accept it", body: "When no better evidence exists; specific intangible valuation problems; some goodwill disputes in business divorce where personal vs. enterprise goodwill must be separated." },
      { label: "When rejected", body: "When better income or market evidence exists; when personal goodwill must be cleanly separated (Florida courts frequently reject it for this reason)." },
    ],
  },

  {
    group: "Income Approach",
    name: "Earnings Quality & Sustainability",
    sections: [
      { label: "Why normalization is not enough", body: "Normalization removes owner-specific, nonrecurring, and nonoperating items, but a carefully normalized EBITDA can still be misleading if the underlying revenue is fragile, concentrated, or requires ever-rising receivables and working capital to sustain. The valuation question is not just whether EBITDA was normalized correctly, but whether the normalized stream will survive under a new owner and convert into cash on ordinary terms." },
      { label: "Four-lens framework", body: "Evaluate earnings quality through four linked lenses: (1) revenue durability, (2) accounts receivable quality, (3) working-capital behavior, (4) cash conversion (DSO). High-quality earnings are recurring, contract/behavior-supported, and backed by operating cash flow. Low-quality earnings are inflated by one-time items, aggressive accounting, weak collectability, or rising accruals that later reverse." },
      { label: "Revenue concentration", body: "Buyers treat a single customer above ~20% of revenue as a serious concern; some sources flag risk at 10–15% for one customer or 25–35% for the top five combined. Severity depends on more than the percentage: a 25% customer under a multi-year agreement with strong payment history differs fundamentally from a 25% customer on informal POs with rising DSO and easy termination. Concentration affects both pricing (lower multiple) and structure (holdbacks, earnouts)." },
      { label: "Contract length & quality", body: "Longer terms support stronger earnings quality. Look beyond whether a contract exists — evaluate remaining term, minimum purchase commitments, renewal windows, termination-for-convenience rights, assignability to a buyer, and side concessions. A 3-year assignable agreement with renewal history is more durable than month-to-month or PO-driven revenue even at identical historical EBITDA." },
      { label: "Churn & retention proxies", body: "For recurring or recurring-adjacent businesses, churn is the best direct measure of earnings persistence; net revenue retention >100% signals expansion. Where formal churn data is absent, use proxies: repeat-customer rate, cohort revenue retention, active-customer counts, reorder frequency, revenue lost from inactive customers, and whether new-customer revenue is merely replacing churned revenue rather than true growth." },
      { label: "AR aging as a signal", body: "Aging reveals how fast revenue turns to cash and how much may be uncollectible (current, 1–30, 31–60, 61–90, 90+ buckets). Directional trends matter more than static levels — a rising share in 60+/90+ buckets signals weaker collection, billing disputes, or aggressive revenue recognition. Deloitte's ASC 326 illustration shows expected credit loss rising from ~0.3% (current) to ~82% (90+ days past due)." },
      { label: "Reserve adequacy", body: "Assess allowance for doubtful accounts alongside aging, not in isolation (Journal of Accountancy): compare bad-debt expense to write-offs, beginning allowance to subsequent write-offs, and allowance-exhaustion rates over time. If overdue receivables rise while the allowance % stays flat, the company may be understating credit loss and overstating earnings — may justify a bad-debt normalization and a haircut to net working capital or value." },
      { label: "Working-capital behavior", body: "Improving EBITDA with deteriorating receivables/inventory/payables often signals lower-quality earnings. Accrual research shows the cash component of earnings is more persistent than the accrual component, so a persistent gap between operating cash flow and reported earnings is a key warning sign. Watch for pre-sale window dressing — delaying vendor payments, cutting inventory purchases, accelerating collections, or channel-stuffing — which improves optics without improving economics and reverses after the reporting date." },
      { label: "Negative working capital can be healthy", body: "Not all unusual working-capital structures are negative. Some retail and subscription businesses structurally run low or negative working capital because they collect before paying suppliers — operational strength, not distress. The test is whether working-capital behavior matches the business model and stays stable. A sharp jump in payables days far beyond historical/industry norms is more concerning than the absolute level." },
      { label: "DSO drift", body: "DSO = (AR / credit sales) × days. The trend matters more than the level — payment norms differ by industry. The same 50-day DSO is healthy if improving from 70 but alarming if drifting up from 35. Sustained upward drift points to slower-paying customers, looser terms, weak collection, or aggressive recognition. Screening ranges: ~30–40 days healthy, 45–60 days friction, 75+ days a red flag — but rely on trend, stated terms, and industry context over universal thresholds." },
      { label: "Forensic screens (Beneish)", body: "The Beneish M-Score includes DSRI (Days' Sales in Receivables Index) and TATA (total accruals to total assets) — both connect directly to receivables behavior and the sustainability of recent earnings. A large rise in receivable days relative to sales can indicate sales manipulation. DSO drift should trigger deeper testing of customer terms, aging, subsequent collections, and revenue cutoff (not every increase is fraud)." },
      { label: "Valuation & structure implications", body: "Earnings-quality findings should change assumptions, not sit as side notes. Concentrated revenue, weak contracts, deteriorating churn, aging AR, or DSO drift support explicit forecast haircuts, higher working-capital investment assumptions, lower selected multiples, or additional CSRP. In transactions they support a lower NWC peg, carved-out old receivables, escrow support, or purchase price tied to customer retention." },
      { label: "Diligence checklist", body: "Top-1/5/10 concentration over 3+ years; contract duration/renewal/assignability/cancellation for major customers; retention and lost-customer bridges where churn data is absent; AR aging by customer vs. subsequent cash receipts; reserve adequacy via allowance-to-aging and write-off comparisons; trend DSO/DPO/cash-conversion-cycle quarterly; compare operating cash flow to net income and adjusted EBITDA; normalize working capital for seasonality before using it in valuation or SPA negotiations." },
    ],
  },

  // ── Market Approach ────────────────────────────────────────────────────────
  {
    group: "Market Approach",
    name: "Guideline Transaction Method (GTC)",
    sections: [
      { label: "What", body: "Derives value from M&A multiples in completed private-company transactions. Primary databases: DealStats (formerly Pratt's Stats), BIZCOMPS, Capital IQ." },
      { label: "Control-level output", body: "GTC multiples reflect control-level prices paid — this makes GTC especially relevant for controlling interest valuations." },
      { label: "DealStats — what MVIC includes/excludes", body: "INCLUDES: noncompete value, assumed interest-bearing liabilities. EXCLUDES: real estate value, earn-outs, employment/consulting agreement values. Implication: if a transaction had a significant earn-out excluded from the reported price, the multiple is biased downward vs. all-in consideration. This is not a footnote — it can materially change your multiple." },
      { label: "DealStats — data quality", body: "Financials are historical reported (not normalized), buyer/seller info may be incomplete, asset-sale vs. stock-sale transactions are pooled unless screened." },
      { label: "Asset sale vs. stock sale", body: "Asset sale: buyer acquires selected assets; cash and AR often retained by seller; liabilities not assumed. Stock sale: buyer acquires entire entity including all liabilities. The same business generates different multiples depending on structure because the numerator (price) represents a different bundle." },
      { label: "Reconciliation method (Willamette)", body: "Apply asset-sale multiple → add excluded assets (cash, AR) → subtract excluded liabilities (AP, accruals) → get MVIC → subtract interest-bearing debt → equity value." },
      { label: "Best practice on structure", body: "Use only asset-sale transactions together, or only stock-sale transactions, and reconcile at the end. Never pool both without adjustment." },
      { label: "SDE vs. EBITDA", body: "SDE = Net income + interest + taxes + D&A + ONE owner's full comp/benefits + personal expenses + nonrecurring items. Captures total economic benefit to one owner-operator. EBITDA = pre-interest, pre-tax, pre-D&A operating profit; does NOT add back owner comp." },
      { label: "When to use SDE vs. EBITDA", body: "SDE for businesses <$5M revenue (BIZCOMPS/Quist standard). EBITDA for larger, manager-run businesses. Key difference: SDE is larger than EBITDA for the same company → SDE multiples are correspondingly lower." },
      { label: "TTM calculation", body: "Full fiscal year + current-year interim − prior-year comparable interim. Example: valuation date Sep 30, 2026; fiscal year-end Dec 31 → TTM = FY2025 + Jan–Sep 2026 − Jan–Sep 2025. Always use matching periods to avoid seasonal distortion." },
      { label: "Transaction-date adjustments", body: "Older transactions reflect market conditions at deal time, not today. If public M&A multiples have contracted since the transaction date (e.g., sector went from 8× to 6.8×), scale the historical multiple: Adjusted = Historical × (Current Sector / Sector at Deal Date). Prioritize transactions from the last 12–24 months." },
      { label: "Multiple selection and percentile", body: "Median outperforms mean in private-company data (prone to outliers). Start at median. Move up if subject is larger, more profitable, higher growth, better diversified, less owner-dependent. Move down for the opposite. Document the selected percentile with specific evidence — not 'conservative judgment.'" },
      { label: "Industry rules of thumb (DealStats / BizBuySell)", body: "DealStats and BizBuySell Insight Reports publish industry-level transaction multiples (SDE, EBITDA, and revenue) by sector and deal-size band. Useful as a screening/sanity anchor against the selected GTC multiple — if the subject's concluded multiple falls far outside the published industry range, document why (size, profitability, growth, concentration). Never a primary method; ASA BVS-V cautions against substantial weight on rules of thumb unless corroborated by other approaches and market evidence." },
      { label: "Effect of earnings quality on selected multiple", body: "Two companies with identical normalized EBITDA should NOT receive the same multiple if one has stronger cash conversion and lower accrual intensity. Customer concentration, weak/short contracts, deteriorating churn proxies, aging AR, and DSO drift all justify selecting below the median, applying holdbacks/earnouts, or assuming a lower net working capital peg. See the Earnings Quality method card and the Normalization tab." },
    ],
  },
  {
    group: "Market Approach",
    name: "Guideline Public Company Method (GPC)",
    sections: [
      { label: "What", body: "Derives multiples from publicly traded comparables. Produces minority marketable value (public trading prices = minority block trading)." },
      { label: "When to use", body: "Larger private companies; robust public comp set with similar economics; controlling interest requires adding control premium afterward." },
      { label: "Selecting comps", body: "Choose industry whose economics, revenue drivers, cyclicality, and cost structure match the subject — not just the closest name. Larger peer sets produce more stable betas and multiples." },
      { label: "Control premium adjustment", body: "If valuing a controlling interest from GPC minority-marketable multiples, add a control premium (typically 25–40%, FactSet Mergerstat/BVR) before applying DLOM if non-marketable." },
      { label: "Regression adjustments", body: "For significant size or margin differences between subject and public comps, consider regression-based adjustment rather than simple percentile selection." },
      { label: "LTM vs. NTM", body: "Forward multiples (NTM) appropriate when company is transitioning and forward estimates are available. LTM is standard otherwise." },
    ],
  },
  {
    group: "Market Approach",
    name: "Rules of Thumb by Industry",
    sections: [
      { label: "Status", body: "Use only as sanity check. Never as primary method (ASA BVS-V explicitly cautions against substantial weight unless supported by other methods and market evidence)." },
      { label: "Accounting / CPA firms", body: "0.75–1.5× revenue (recurring client base commands premium)." },
      { label: "Medical / dental practices", body: "0.4–0.7× revenue or 3–5× EBITDA (specialty-dependent)." },
      { label: "Insurance agencies", body: "1.5–3.0× commissions (book of business multiples)." },
      { label: "HVAC / plumbing / electrical contractors", body: "3–5× SDE or 0.3–0.6× revenue." },
      { label: "Restaurants (full service)", body: "2–4× SDE or 0.3–0.5× revenue." },
      { label: "Fast food / QSR franchise", body: "4–7× EBITDA (brand-dependent)." },
      { label: "SaaS / software", body: "3–8× ARR (growth-rate dependent; NRR >120% commands premium)." },
      { label: "Manufacturing (job shop)", body: "3–5× EBITDA or 0.4–0.6× revenue." },
      { label: "Auto dealerships", body: "Blue sky = 2–5× normalized pre-tax earnings (varies by franchise)." },
      { label: "Construction contractors", body: "2–4× EBITDA (backlog quality matters)." },
      { label: "Law firms", body: "0.5–1.0× revenue (contingency vs. hourly practice)." },
    ],
  },

  // ── Asset Approach ─────────────────────────────────────────────────────────
  {
    group: "Asset Approach",
    name: "Adjusted Net Asset Value (ANAV)",
    sections: [
      { label: "What", body: "Restates every balance sheet item to FMV; adds unrecognized intangibles; deducts contingent liabilities; arrives at net FMV equity." },
      { label: "Primary use", body: "Holding companies, real estate entities, investment companies, distressed businesses. Floor check for operating companies." },
      { label: "Accounts receivable", body: "Adjust book value to net realizable value using aging schedule. Segments: current (minimal haircut), 31–60 days (light reserve), 61–90 days (moderate reserve), >90 days (steep reserve or specific write-off). Base haircut on company's own historical write-off experience — more persuasive than generic industry averages. Override for large disputed balances, related-party receivables, and retainage." },
      { label: "Inventory", body: "Step 1 — Add back LIFO reserve (if applicable) to convert to current cost. Step 2 — Segment by type: finished goods (test vs. NRV = selling price − completion costs − selling costs), raw materials (test vs. replacement cost), slow/obsolete/damaged (steep write-down). Best process: LIFO normalization → obsolescence test → NRV or replacement cost." },
      { label: "PP&E", body: "Match method to asset type. Specialized equipment → cost approach (replacement cost new − physical deterioration − functional obsolescence − economic obsolescence). Marketable general-use assets → sales comparison. Income-producing real estate → income approach (NOI / cap rate). Document why one approach was chosen and not the others." },
      { label: "Intangibles — customer relationships", body: "Multi-period excess earnings method (MPEEM). Requires contributory asset charges." },
      { label: "Intangibles — trade names / trademarks", body: "Relief-from-royalty (select royalty rate from comparable licenses, apply to revenue, discount after-tax savings over economic life)." },
      { label: "Intangibles — proprietary technology", body: "Relief-from-royalty or DCF of incremental cash flows." },
      { label: "Intangibles — non-compete agreements", body: "With-and-without method (value business with vs. without the restriction; discount the lost earnings during agreement period)." },
      { label: "Intangibles — assembled workforce", body: "Cost approach (recruiting + hiring + training + lost productivity during ramp). Not separately recognized under GAAP (ASC 805) but still functions as contributory asset in MPEEM." },
      { label: "Contingent liabilities", body: "Two tests in parallel. (1) GAAP test (ASC 450): Probable + reasonably estimable = accrue; Reasonably possible = disclose; Remote = neither. (2) Economic test: what would a market participant pay given probability-weighted expected loss? Disclose both and explain divergence." },
      { label: "Environmental obligations (ASC 410-30)", body: "Recognize liability for reasonably estimable components of remediation even when total cost is unknown. Practical inputs: site studies, engineering estimates, regulatory requirements, monitoring." },
      { label: "Warranty reserves", body: "Based on historical claims rates. May be debt-like in transactions if underfunded." },
      { label: "Deferred taxes — S-corps (IRC §1374)", body: "5-year recognition period; 21% federal corporate rate on net recognized built-in gain if assets sold during that period. Analyst must identify net unrealized built-in gain at conversion and discount for probability and timing." },
      { label: "Deferred taxes — C-corps", body: "Case law (Estate of Dunn, Jelke, Eisenberg): equity value may be reduced for embedded capital gains tax on appreciated assets. Magnitude depends on premise — immediate liquidation supports larger discount; ongoing operating company may support time-phased PV approach." },
      { label: "Floor check", body: "ANAV is almost always the floor for a going-concern operating company. If your income approach conclusion is below ANAV, revisit your income approach." },
    ],
  },
  {
    group: "Asset Approach",
    name: "Liquidation Value",
    sections: [
      { label: "Orderly liquidation", body: "12–18 months to sell. Higher realization than forced." },
      { label: "Forced liquidation", body: "Immediate sale, auction. Fire-sale pricing." },
      { label: "When to use", body: "Distress, insolvency, bankruptcy contexts only." },
      { label: "Rule", body: "Orderly > Forced always. Clearly document assumed timeline." },
    ],
  },

  // ── Venture / Startup Methods ──────────────────────────────────────────────
  {
    group: "Venture / Startup Methods",
    name: "Berkus Method",
    sections: [
      { label: "Original framework", body: "Up to $500K per factor × 5 factors = $2.5M max. The 5 factors: (1) Sound idea (basic value, reduces concept risk), (2) Prototype (reduces technology risk), (3) Quality management team (reduces execution risk), (4) Strategic relationships (reduces market risk), (5) Product rollout/sales (reduces production/financial risk)." },
      { label: "2016 update (Berkus himself)", body: "The $500K/factor cap is too restrictive for current markets. Adjust maximum per factor to reflect region and sector — a Silicon Valley startup may justify $1.5M/factor; a Nebraska startup may still use $500K. Categories can be customized (e.g., replace market risk with FDA approval risk for medtech)." },
      { label: "Current calibration", body: "Carta reports median pre-money seed valuation of $16M in Q1 2025. A 5-factor Berkus at $500K/factor = $2.5M max, which is far below market. Set the total maximum to match current regional benchmarks." },
      { label: "Appropriate for", body: "Pre-revenue startups that could plausibly reach $20M revenue in 5 years if successful." },
    ],
  },
  {
    group: "Venture / Startup Methods",
    name: "Scorecard Method (Bill Payne)",
    sections: [
      { label: "Start with benchmark", body: "Regional/stage-comparable average pre-money valuation (must be current — use Carta, PitchBook, AngelList, Halo Report)." },
      { label: "Weighted factors", body: "Management team 30% · Size of opportunity 25% · Product/technology 15% · Competition 10% · Marketing/sales/partnerships 10% · Other (need for additional investment, etc.) 10%." },
      { label: "Scoring", body: "Score each factor relative to the average startup: 125% = above average, 75% = below average. Multiply total weighted score by regional benchmark to get pre-money valuation." },
      { label: "Critical step", body: "Benchmark selection is the entire foundation. Stale 2010 survey data ($1.5M average) is not usable in 2025." },
    ],
  },
  {
    group: "Venture / Startup Methods",
    name: "VC Method / First Chicago Method",
    sections: [
      { label: "VC Method mechanics", body: "(1) Estimate exit value: projected revenue/EBITDA at exit × exit multiple. (2) Discount back at required return. (3) Derive pre-money valuation and required ownership %." },
      { label: "Required return by stage", body: "Seed/startup: 50–100%. Early stage: 40–60%. Expansion: 30–50%. Later stage: 25–35%. These high rates reflect NOT just time value but the probability that many portfolio companies fail entirely." },
      { label: "Fund-level dilution", body: "Required initial ownership is higher than terminal ownership because later rounds dilute early investors. Factor expected dilution into the VC calculation." },
      { label: "First Chicago Method", body: "Build 3 scenarios (success/upside, sideways/survival, failure). Value each scenario independently (DCF or exit multiple). Weight by probability. All probabilities must sum to 100%." },
      { label: "Probabilities", body: "Judgmental — driven by stage, traction, competitive dynamics, financing runway. What matters is internal coherence and transparency." },
      { label: "Critical double-counting warning", body: "Do NOT use heavily distressed scenario probabilities AND an extreme discount rate within each scenario. Decide where risk lives: in the probabilities or in the rate — not both." },
    ],
  },
  {
    group: "Venture / Startup Methods",
    name: "Risk Factor Summation",
    sections: [
      { label: "Baseline", body: "Start with regional baseline (same benchmark as Scorecard Method)." },
      { label: "12 risk categories scored −2 to +2", body: "Management · Stage of business · Legislation/political risk · Manufacturing risk · Sales and marketing risk · Funding/capital raising risk · Competition risk · Technology risk · Litigation risk · International risk · Reputation risk · Potential lucrative exit risk." },
      { label: "Scoring scale", body: "+2 = very positive (reduces risk), +1 = positive, 0 = average, −1 = negative, −2 = very negative." },
      { label: "Adjustment per point", body: "$250K is the original convention — but this may be too small or large depending on the benchmark. Calibrate to the benchmark size and explain the convention." },
    ],
  },

  // ── Specialized Engagements ────────────────────────────────────────────────
  {
    group: "Specialized Engagements",
    name: "Personal vs. Enterprise Goodwill",
    sections: [
      { label: "Core distinction", body: "Personal goodwill attaches to an individual — personal reputation, skills, expertise, relationships, and referral network. Enterprise goodwill attaches to the business itself — systems, location, workforce, operating history, institutional customer relationships, and reputation apart from any one owner. The split matters most in divorce litigation, shareholder disputes, and tax-sensitive transaction structuring." },
      { label: "Residual nature of goodwill", body: "Goodwill is not measured directly; it is the residual after total business value is allocated to tangible assets, liabilities, and separately identifiable intangibles. Fail to identify a real intangible and goodwill is overstated; separately value economics already captured elsewhere and goodwill is understated and double-counted (ASC 805 / IFRS 3 identification logic: contractual-legal OR separability criterion)." },
      { label: "Why it matters", body: "Many states treat enterprise goodwill as a divisible marital asset while personal goodwill is excluded or treated separately. In tax/M&A, personal goodwill may in some fact patterns be sold directly by the shareholder rather than as a corporate asset, changing allocation and taxation. Personal-goodwill arguments are strongest when the owner's relationships and reputation have NOT already been transferred to the entity via employment agreements or non-competes — those contracts weaken the personal-goodwill case." },
      { label: "Method — with-and-without", body: "Estimate business value with the key person in place vs. value if that person leaves or competes; the difference represents personal goodwill (or the person-dependent element). Provides a stronger cash-flow-based economic story; often used as primary." },
      { label: "Method — MUM (Multi-Attribute Utility Model)", body: "Structured scoring model: identify factors associated with personal vs. enterprise goodwill, assign weights by importance and existence, and convert scores into a percentage allocation. Common attributes: owner reputation, source of new customers, customer dependence on the owner, workforce size/depth, brand/marketing strength, billing method, location, marketability, business systems. Easier to explain in litigation because the process is explicit and traceable." },
      { label: "Best practice", body: "Use one method as primary and the other as a reasonableness check. The analysis is fact-intensive, not formula-intensive — employment agreements, non-competes, customer dependence, referral structure, institutional branding, and workforce depth often matter as much as the model in determining whether goodwill belongs to the person or the enterprise." },
      { label: "Relationship to Excess Earnings", body: "When personal vs. enterprise goodwill must be cleanly separated, some courts (notably Florida) reject the Excess Earnings Method because it does not split goodwill by ownership. Pair the goodwill analysis with the identifiable-intangible work in ANAV (MPEEM for customer relationships, RFR for trade names, with-and-without for non-competes, cost approach for assembled workforce)." },
    ],
  },
  {
    group: "Specialized Engagements",
    name: "Earnout Valuation",
    sections: [
      { label: "What", body: "An earnout is contingent purchase consideration paid to the seller if the business hits defined post-close performance targets (revenue, EBITDA, customer retention, milestones). It shifts risk back to the seller and is commonly used when buyer and seller disagree on value or when earnings quality / customer concentration is questionable." },
      { label: "Why it appears in valuation", body: "Earnouts bridge a value gap and re-allocate risk. In GTC data, DealStats EXCLUDES earn-outs from reported MVIC — so a deal with a large earnout shows a multiple biased downward vs. all-in consideration. Under ASC 805, contingent consideration is recognized at fair value at the acquisition date and remeasured thereafter; in the DCF equity bridge it is a debt-like contingent obligation." },
      { label: "Valuation logic", body: "Value the earnout as the probability-weighted, present-value of expected contingent payments. For linear targets, scenario-weight the payout across achievement levels; for threshold/option-like structures (all-or-nothing above a hurdle), an option-based framework better captures the asymmetric payoff. Discount at a rate matching the risk of the underlying metric — operating metrics (EBITDA, revenue) carry business risk and warrant a higher rate; purely time/financial contingencies warrant a lower rate." },
      { label: "Key inputs", body: "Performance metric definition and measurement window, target/threshold levels, payout formula (linear vs. capped vs. tiered), probability distribution of outcomes, volatility of the underlying metric (for option-style), and the appropriate discount rate. Tie probabilities to the same forecast used in the DCF — do not let the earnout assume a more optimistic trajectory than the core valuation." },
      { label: "Watch-outs", body: "Avoid double-counting: if customer-retention risk is already reflected in a lower selected multiple or a forecast haircut, do not also assume worst-case earnout non-payment for the same risk. Decide where the risk lives. Keep the earnout valuation consistent with the equity bridge treatment and the GTC adjustment for excluded contingent consideration." },
    ],
  },
  {
    group: "Specialized Engagements",
    name: "ESOP Valuation",
    sections: [
      { label: "What", body: "An Employee Stock Ownership Plan is a qualified retirement plan that invests primarily in employer stock. ESOP transactions require an independent appraisal of the employer securities; the standard of value is fair market value and the engagement is governed by ERISA and DOL oversight." },
      { label: "DOL adequate consideration", body: "Under ERISA, an ESOP may not pay more than 'adequate consideration' for employer stock — fair market value determined in good faith. The DOL's proposed adequate-consideration regulation and enforcement settlements emphasize a documented, well-supported, contemporaneous appraisal and a robust process by the plan trustee. The appraisal must withstand DOL scrutiny: defensible projections, supportable discount rate, and clear treatment of control and marketability for the block being acquired." },
      { label: "Repurchase obligation", body: "ESOP companies carry a repurchase obligation — the future requirement to buy back vested shares from departing/retiring participants. This is a real cash demand that can affect value and must be considered in the financial analysis; it is not a numerical calculator output stored here, but the obligation's existence and sizing assumptions belong in the engagement reasoning." },
      { label: "S-corp ESOP tax benefit", body: "A 100%-ESOP-owned S corporation generally pays no federal income tax on the ESOP's share of earnings, because the ESOP trust is a tax-exempt shareholder and S-corp income passes through to it untaxed. This is a major economic feature of S-corp ESOPs, but it must be analyzed consistently with the standard of value and how a hypothetical buyer would treat it — not assumed as an automatic uplift. See the S-corp / pass-through tax discussion in the WACC tab." },
      { label: "Control & marketability", body: "Level-of-value analysis is central: an ESOP may acquire a controlling or minority block, and the put right (the participant's right to require the company to repurchase shares) materially affects marketability. A reliable put right backed by company capacity reduces DLOM relative to an ordinary non-marketable minority interest." },
      { label: "Watch-outs", body: "Document the trustee's process, the basis for projections, and the discount-rate build-up. Avoid overstating the S-corp tax benefit, and reconcile control/marketability adjustments to the specific block and rights being valued. This card stores the methodology and reasoning only — no numerical engine lives in this app." },
    ],
  },
];
