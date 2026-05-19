export interface Scenario {
  name: string;
  decisionSignals: string[];
  recommended: string[];
  whyItWorks?: string;
  criticalSequencing?: string;
  watchOuts: string[];
  borderColor: string;
  category: "income" | "market" | "asset" | "venture";
}

export const SCENARIOS: Scenario[] = [
  {
    name: "Mature, profitable private company (stable earnings)",
    decisionSignals: [
      "EBITDA margins stable year-over-year",
      "No major capex cycles",
      "Owner departing",
      "Going concern",
    ],
    recommended: [
      "Capitalization of Earnings (primary) — divide normalized earnings by cap rate.",
      "Guideline Transaction Method (secondary) — market evidence cross-check.",
    ],
    whyItWorks:
      "The Gordon Growth Model equivalent converges with DCF when g is truly constant. Cap of earnings avoids false precision from a 5-year projection when the company won't materially change.",
    watchOuts: [
      "The cap rate is extremely sensitive — 1% change in WACC or growth shifts value by 15–25%.",
      "Verify normalized earnings truly represent sustainable future earning power, not a peak year.",
      "Cross-check the implied multiple (1/cap rate) against GTC multiples — if they diverge by more than 1–2×, revisit assumptions.",
    ],
    borderColor: "border-l-blue-500",
    category: "income",
  },
  {
    name: "High-growth company (uneven near-term cash flows)",
    decisionSignals: [
      "Revenue growing >15%/yr",
      "Significant capex or reinvestment planned",
      "Management projections with support",
      "Company not yet at steady-state margins",
    ],
    recommended: [
      "DCF (FCFF) with 5-year explicit forecast + Gordon Growth terminal value.",
    ],
    watchOuts: [
      "Terminal value typically represents 60–80% of EV — every assumption in the terminal year matters disproportionately.",
      "Revenue projections must be anchored to historical CAGR + industry growth + management track record.",
      "Run sensitivity: WACC ±1%, g ±0.5%. If value range is 2×, your inputs are not well-supported.",
      "Don't use cap of earnings for a company with uneven near-term cash flows — the method assumes constant growth.",
    ],
    borderColor: "border-l-blue-500",
    category: "income",
  },
  {
    name: "Legacy / owner-dependent business",
    decisionSignals: [
      "Revenue would materially decline without the owner",
      "No succession plan",
      "Most customer relationships are personal",
    ],
    recommended: [
      "Cap of earnings with elevated CSRP + key person discount (applied separately, not double-counted).",
    ],
    watchOuts: [
      "Owner compensation normalization is critical — if owner is paid $150K but a replacement GM costs $250K, that $100K adjustment flows directly into normalized earnings.",
      "Key person discount range: 5–25%, supported by facts. Choose ONE mechanism: adjust cash flows, adjust the discount rate (CSRP), OR apply a separate discount — not all three.",
      "GTC comps may not exist for highly personal service businesses — document the search and the gaps.",
    ],
    borderColor: "border-l-blue-500",
    category: "income",
  },
  {
    name: "Minority interest (20–49%)",
    decisionSignals: [
      "Valuing a partial block",
      "No voting control",
      "Cannot force sale or set dividends",
    ],
    recommended: [
      "Going-concern enterprise value (income/market) → apply DLOC if starting from control-level → apply DLOM.",
    ],
    criticalSequencing:
      "DLOC and DLOM are applied multiplicatively, not additively. 20% DLOC then 30% DLOM = 1 − (0.80 × 0.70) = 44% combined reduction, not 50%.",
    watchOuts: [
      "Determine what level of value your methods produce. GPC multiples → minority marketable. GTC M&A multiples → control marketable.",
      "Do not apply DLOC if your method already produces minority-level value.",
      "Assess the interest's actual governance rights — veto rights, board seats, or tag-along rights reduce DLOM.",
    ],
    borderColor: "border-l-green-500",
    category: "market",
  },
  {
    name: "Controlling interest (51–100%)",
    decisionSignals: [
      "Buyer acquires voting control",
      "Ability to set dividends, elect directors",
    ],
    recommended: [
      "Income and/or market approach at control level. No DLOC. DLOM may still apply for non-marketable controlling interest (range: 10–20%).",
    ],
    watchOuts: [
      "A controlling private-company interest is non-marketable even if it is controlling — the company still cannot be sold instantly. Partial DLOM is often warranted.",
      "Distinguish between controlling-marketable (rare — think registered stock) and controlling-non-marketable (the typical private-company situation).",
      "Don't confuse a 51% interest with full control — review the operating agreement or shareholder agreement for minority protections.",
    ],
    borderColor: "border-l-green-500",
    category: "market",
  },
  {
    name: "Cyclical or inconsistent earnings",
    decisionSignals: [
      "High year-to-year earnings variability",
      "Industry with boom/bust cycles",
      "COVID distortion in history",
    ],
    recommended: [
      "Weighted average normalized earnings (weight recent years more heavily) or DCF with scenario analysis.",
    ],
    watchOuts: [
      "Do not use a single-year cap of earnings when years swing dramatically — you will overvalue or undervalue based on the peak or trough you happen to use.",
      "Weighting logic should be tied to facts: if a structural change happened (new customer, new product line, post-COVID normalization), weight post-change years more.",
      "Cross-check: does the weighted average fairly represent what a buyer would pay for this business's future? If not, explain the gap.",
    ],
    borderColor: "border-l-blue-500",
    category: "income",
  },
  {
    name: "Asset-heavy / holding company",
    decisionSignals: [
      "Significant real estate, equipment, or securities portfolio",
      "Operating income is small relative to asset base",
      "Holding company structure",
    ],
    recommended: [
      "ANAV (primary), income approach (secondary/floor check).",
    ],
    watchOuts: [
      "Do not ignore unrecognized intangibles — even asset-heavy companies may have customer relationships, trade names, or assembled workforce with value not on the books.",
      "Real property requires an independent appraisal when the value is material.",
      "Built-in gains tax (IRC §1374 for S-corps, case law for C-corps) may need to be addressed — fact-specific discount ranging from face value to present-value approach depending on likelihood of asset disposition.",
    ],
    borderColor: "border-l-amber-500",
    category: "asset",
  },
  {
    name: "Company with excess cash / non-operating assets",
    decisionSignals: [
      "Cash far above operating working capital needs",
      "Non-operating real estate",
      "Investment accounts",
    ],
    recommended: [
      "Value operating business separately (income approach on operating cash flows), add non-operating assets at FMV.",
    ],
    watchOuts: [
      "Define 'excess' carefully — operating cash is needed for daily operations; excess is the rest. Compare to industry NWC benchmarks.",
      "Non-operating real estate requires a separate appraisal.",
      "Do NOT include returns on excess cash in your DCF projections AND also add excess cash back in the bridge — that's double-counting. Exclude non-operating cash from both the DCF and the beta.",
    ],
    borderColor: "border-l-amber-500",
    category: "asset",
  },
  {
    name: "Related-party expenses / normalization-heavy engagement",
    decisionSignals: [
      "Owner paying below-market rent to family LLC",
      "Family members on payroll",
      "Charitable contributions on P&L",
      "Profit sharing that varies by year",
    ],
    recommended: [
      "Heavy normalization first, then any approach.",
    ],
    watchOuts: [
      "Each adjustment must have a market benchmark source — BLS for compensation, CoStar/LoopNet/broker opinion for rent, board minutes for one-time items.",
      "Apply adjustments consistently across all historical years.",
      "Adjustments flow directly into EBITDA, which is then multiplied. A $100K normalization error on a 5× multiple = $500K error in value.",
    ],
    borderColor: "border-l-blue-500",
    category: "income",
  },
  {
    name: "Pre-revenue or early-stage startup",
    decisionSignals: [
      "No revenue",
      "Pre-product",
      "Seed or angel stage",
    ],
    recommended: [
      "Berkus Method, Scorecard Method, Risk Factor Summation, VC Method, or First Chicago Method (triangulate 2–3).",
    ],
    watchOuts: [
      "The original Berkus $500K/factor cap is outdated — use current regional seed benchmarks (Carta reports median pre-money seed valuation of $16M in Q1 2025).",
      "Scorecard Method starts with a regional average — that benchmark must be current (AngelList, Carta, PitchBook), not a 2010 survey.",
      "In First Chicago: avoid double-counting risk — don't use both heavily distressed scenario probabilities AND an extreme discount rate within each scenario.",
      "VC Method is extremely sensitive to exit multiple assumptions — document the comparable exit.",
    ],
    borderColor: "border-l-purple-500",
    category: "venture",
  },
];
