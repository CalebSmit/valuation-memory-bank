export interface StandardSection {
  label: string;
  body: string;
}

export type StandardKind = "IRS Ruling" | "Tax Court" | "USPAP" | "AICPA" | "ASA";

export interface StandardCard {
  name: string;
  kind: StandardKind;
  badgeClass: string; // tailwind classes for the kind chip
  oneLine: string;
  sections: StandardSection[];
}

export const STANDARDS: StandardCard[] = [
  {
    name: "Revenue Ruling 59-60 (1959)",
    kind: "IRS Ruling",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    oneLine: "Foundational federal authority for valuing closely held business interests for estate/gift tax purposes.",
    sections: [
      { label: "Status", body: "Foundational federal authority for valuing closely held business interests for estate/gift tax purposes. Widely accepted as the conceptual anchor for private-company valuation practice beyond tax." },
      { label: "Fair Market Value definition", body: "'The price at which property would change hands between a willing buyer and a willing seller, neither under compulsion and both with reasonable knowledge of relevant facts.'" },
      { label: "Factor 1 — Nature and history", body: "Nature of the business and history since inception." },
      { label: "Factor 2 — Economic outlook", body: "Economic outlook in general and the specific industry." },
      { label: "Factor 3 — Book value and financial condition", body: "Book value of stock and financial condition of the business." },
      { label: "Factor 4 — Earnings capacity", body: "Earnings capacity of the company." },
      { label: "Factor 5 — Dividend-paying capacity", body: "Dividend-paying capacity." },
      { label: "Factor 6 — Goodwill / intangibles", body: "Whether the enterprise has goodwill or other intangible value." },
      { label: "Factor 7 — Prior sales / block size", body: "Sales of the stock and size of the block being valued." },
      { label: "Factor 8 — Public comparables", body: "Market price of stocks of comparable publicly traded companies." },
      { label: "Modern mapping", body: "Factors 1–2 = company and industry due diligence. Factor 3 = balance sheet and asset approach. Factors 4–5 = normalization and income approach. Factor 6 = intangible/goodwill assessment. Factor 7 = GTC market approach + ownership adjustments. Factor 8 = GPC market approach." },
      { label: "Critical warning", body: "The ruling explicitly warns against 'simply averaging factors such as book value, capitalized earnings, and capitalized dividends' — reconciliation must be reasoned, not mechanical." },
    ],
  },

  {
    name: "USPAP Standards Rules 9 & 10",
    kind: "USPAP",
    badgeClass: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    oneLine: "Development (SR-9) and reporting (SR-10) standards for business appraisals.",
    sections: [
      { label: "Standard 9 — Development", body: "Governs how business appraisals must be developed." },
      { label: "SR-9 key requirements", body: "(1) Properly identify the assignment. (2) Perform sufficient diligence. (3) Analyze all relevant information. (4) Apply approaches and methods necessary for credible results. (5) Explain when an approach is excluded — you cannot simply omit an approach without documented justification." },
      { label: "Standard 10 — Reporting", body: "Governs how business appraisal reports must be presented." },
      { label: "Appraisal Report", body: "Full reporting format. Must summarize information analyzed, procedures followed, and reasoning supporting conclusions. Required when intended users include parties other than the client (tax, litigation, financing, shareholder disputes)." },
      { label: "Restricted Appraisal Report", body: "More limited. Appropriate only when use is restricted to the client. NOT a lighter version for broad external reliance." },
      { label: "Practical implication", body: "If a report will be reviewed by the IRS, a court, a lender, or an opposing expert, you need an Appraisal Report." },
    ],
  },

  {
    name: "ASA Business Valuation Standards (BVS-I through BVS-VIII)",
    kind: "ASA",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    oneLine: "Minimum criteria for developing and reporting business valuations under ASA.",
    sections: [
      { label: "Purpose", body: "Minimum criteria for developing and reporting business valuations. Incorporates relevant portions of USPAP and ASA ethics framework." },
      { label: "BVS-I — Engagement types (older framework)", body: "Appraisal: supports unambiguous opinion of value; all procedures deemed relevant. Limited Appraisal: omits some procedures required in a full appraisal. Calculations: provides approximate indication of value based on limited agreed procedures." },
      { label: "BVS-V — Rules of Thumb", body: "Rules of thumb may provide insight but should not be given substantial weight UNLESS supported by other methods AND evidence that knowledgeable buyers/sellers rely on them. Directly relevant to any engagement where an industry rule of thumb is tempting." },
      { label: "BVS-VIII — Reporting", body: "Report must be presented in a clear and professional manner, allow intended users to understand the work performed and conclusions reached." },
      { label: "Beyond BVS-VIII", body: "More recent ASA standards address intangible asset appraisal and appraisal review — check current ASA publication for the full set." },
    ],
  },

  {
    name: "AICPA SSVS No. 1 (now VS Section 100)",
    kind: "AICPA",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    oneLine: "Standards for AICPA members performing engagements to estimate value.",
    sections: [
      { label: "Applies to", body: "AICPA members performing engagements to estimate value of a business, business ownership interest, security, or intangible asset." },
      { label: "Valuation Engagement", body: "Analyst is free to apply approaches and methods deemed appropriate. Result = Conclusion of Value (single amount or range). Requires fuller development process." },
      { label: "Calculation Engagement", body: "Analyst and client agree in advance on specific approaches, methods, and extent of procedures. Result = Calculated Value. NOT simply a cheaper valuation — it's a different engagement type with different disclosure obligations." },
      { label: "Note on 'Estimate of Value'", body: "Older ASA materials use 'estimate as to value' for limited appraisals. Practitioners sometimes use 'estimate of value' colloquially. Formally under SSVS No. 1, the operative categories are the two above." },
      { label: "Scope definition at the start", body: "Must establish understanding with client about nature, purpose, assumptions, limiting conditions, report type, and standard of value before beginning. Scope definition changes what can be concluded and how it must be reported." },
    ],
  },

  {
    name: "Revenue Ruling 68-609 (1968)",
    kind: "IRS Ruling",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    oneLine: "Foundational IRS source for the 'formula' / Excess Earnings Method — last resort only.",
    sections: [
      { label: "Status", body: "Foundational IRS source for the 'formula' approach (Excess Earnings Method). Restated earlier A.R.M. 34 (1920) authorities." },
      { label: "Key restriction", body: "The formula approach may be used ONLY 'if there is no better basis available for making the determination.' This is a last-resort authority, not a preferred primary method." },
      { label: "The formula", body: "Determine percentage return on average annual value of tangible assets over ≥5 years → subtract from average earnings → capitalize remainder at an appropriate rate = intangible value. Add net tangible FMV → total value indication." },
      { label: "Published example rates (NOT safe harbors)", body: "Return on tangibles: 8–10% when no industry data available. Cap rate for intangibles: 15% (low risk, stable earnings), 20% (higher hazard). The ruling itself says these are examples, not universal rules." },
      { label: "Modern treatment", body: "These percentages reflect 1968 conditions. Current practice derives rates from market evidence — after-tax cost of debt on collateralizable assets + equity return on riskier tangibles. NACVA examples land in the high-single-digit range." },
      { label: "IRS criticism of its own method", body: "IRS training materials have called indiscriminate use of ARM 34 'a source of many improper appraisals.' Courts have accepted the method in limited factual settings but rejected it when better evidence exists." },
    ],
  },

  {
    name: "Mandelbaum v. Commissioner (T.C. Memo 1995-255)",
    kind: "Tax Court",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    oneLine: "Leading DLOM Tax Court case — structured 9-factor framework for marketability discount.",
    sections: [
      { label: "Facts", body: "Gift tax valuation of Big M, Inc., a private family-owned retailer. Parties stipulated the freely traded values — court decided only the DLOM." },
      { label: "Holding", body: "30% marketability discount on all relevant valuation dates." },
      { label: "Why it matters", body: "Not the 30% itself — but the structured, fact-specific analytical framework Judge Laro applied." },
      { label: "Factor 1 — Comparable sales", body: "Private vs. public sales of comparable stock — is there any observable pricing for this company or similar interests?" },
      { label: "Factor 2 — Financial statement analysis", body: "Strength of the balance sheet, profitability, and stability." },
      { label: "Factor 3 — Distribution capacity", body: "Dividend/distribution history and capacity — liquidity available to minority holders." },
      { label: "Factor 4 — Industry outlook", body: "Nature and outlook of company and industry — going concern strength." },
      { label: "Factor 5 — Management", body: "Quality and depth — affects transferability risk." },
      { label: "Factor 6 — Degree of control", body: "More control rights in the transferred shares = less marketability discount." },
      { label: "Factor 7 — Transfer restrictions", body: "Charter, shareholder agreement, operating agreement, statutory restrictions." },
      { label: "Factor 8 — Holding period", body: "Expected time to liquidity — longer expected hold = higher DLOM." },
      { label: "Factor 9 — Flotation cost", body: "Cost of a public offering — what it would cost to achieve liquidity through a public market." },
      { label: "Important caution", body: "Factors 2, 4, and 5 (financial performance, industry outlook, management) may already be embedded in the base value. Applying these to increase DLOM without explaining why they represent incremental non-marketability risk beyond what's already in the multiples is a double-counting vulnerability." },
      { label: "Modern application", body: "Mandelbaum framework paired with empirical restricted stock evidence (Stout database, filtered transactions) and option-model cross-checks. The qualitative analysis explains why the subject falls at the high or low end of the empirical range." },
    ],
  },
];
