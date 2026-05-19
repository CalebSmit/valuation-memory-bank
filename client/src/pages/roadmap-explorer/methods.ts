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
      { label: "Terminal value warning", body: "TV typically = 60–80% of total EV. Small changes in g or WACC dominate the result. If TV > 80% of EV, extend the explicit forecast period so the company reaches steady state before the terminal year." },
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
];
