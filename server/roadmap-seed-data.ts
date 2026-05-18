export interface RoadmapSeedStep {
  title: string;
  whyThisMatters: string;
}

export interface RoadmapSeedPhase {
  title: string;
  steps: RoadmapSeedStep[];
}

export const ROADMAP_SEED_PHASES: RoadmapSeedPhase[] = [
  {
    title: "Engagement Setup",
    steps: [
      { title: "Define standard of value (FMV, Fair Value, Investment Value)", whyThisMatters: "The standard of value determines the hypothetical buyer/seller construct and directly affects which methods and adjustments apply. Fair Market Value (the most common standard) assumes an arm's length transaction between a willing buyer and seller, both fully informed, with no compulsion to buy or sell." },
      { title: "Define interest being valued (%, controlling vs. minority)", whyThisMatters: "Whether you are valuing a 100% controlling interest or a 20% minority stake fundamentally changes the applicable valuation methods, the relevance of control premiums, and whether DLOM and DLOC adjustments apply. This determination must be documented before any analysis begins." },
      { title: "Define premise of value (going concern, liquidation)", whyThisMatters: "Going concern assumes the business will continue to operate, which supports income and market approaches. A liquidation premise assumes an orderly or forced sale of assets, which caps value at net realizable asset values. The premise shapes every method selection downstream." },
      { title: "Confirm effective valuation date", whyThisMatters: "All market data, financial statements, risk rates, and economic conditions must reflect the valuation date — not today. Treasury rates, market multiples, and economic conditions at the effective date must be documented and sourced." },
      { title: "Identify purpose and intended use", whyThisMatters: "The purpose (estate tax, buy-sell, financial reporting, litigation, etc.) affects professional standards that apply, the level of scrutiny expected, and disclosure requirements. An estate tax appraisal under IRS Rev. Rul. 59-60 has different obligations than a buy-sell engagement." },
      { title: "Note professional standards to follow (USPAP, ASA BVS, AICPA SSVS)", whyThisMatters: "USPAP, ASA Business Valuation Standards, and AICPA SSVS each impose specific obligations around independence, scope, disclosure, and reporting. Knowing which standards govern the engagement prevents omissions that could expose the analyst to liability." },
    ],
  },
  {
    title: "Company & Industry Research",
    steps: [
      { title: "Obtain and review historical financial statements (3–5 years)", whyThisMatters: "A 3–5 year history allows the analyst to identify trends, spot anomalies, and build a normalized earnings base. Single-year snapshots miss cyclicality and one-time events that distort value conclusions." },
      { title: "Obtain tax returns (verify against financials)", whyThisMatters: "Tax returns often reveal owner perks, related-party transactions, and revenue/expense items not prominent in compiled financials. Reconciling tax returns to financial statements is a core quality check." },
      { title: "Review balance sheet and footnotes", whyThisMatters: "Off-balance-sheet items, contingent liabilities, lease obligations, and intangible assets not on the books can materially affect value. The balance sheet determines the equity bridge from enterprise to equity value." },
      { title: "Document business model, revenue streams, customer base", whyThisMatters: "Understanding how the company earns revenue — recurring vs. project-based, contract terms, pricing power, customer stickiness — is foundational to projecting future cash flows and assessing business risk." },
      { title: "Identify top customers and concentration risk", whyThisMatters: "If more than 20–25% of revenue comes from a single customer, that concentration is a company-specific risk that must be quantified, either in a higher CSRP or a separate concentration discount. Loss of a key customer can permanently impair value." },
      { title: "Identify key person dependencies", whyThisMatters: "A business that would materially decline without its owner or one or two key employees carries key person risk. This is addressed via a key person discount (typically 5–20%) and is closely tied to management depth and succession planning." },
      { title: "Research industry (NAICS/SIC, growth rate, Porter's Five Forces)", whyThisMatters: "Industry-level data informs the long-term growth rate used in cap rates and DCF terminal values, and contextualizes the company's competitive position. IBISWorld, First Research, and BLS data are common sources." },
      { title: "Research economic conditions at valuation date (regional Fed, FOMC)", whyThisMatters: "Risk-free rates, credit spreads, inflation expectations, and macroeconomic conditions must be documented as of the valuation date. Federal Reserve Beige Books and FOMC statements are contemporaneous primary sources." },
      { title: "Assess competitive position and moat", whyThisMatters: "Competitive advantages — proprietary technology, brand, switching costs, cost structure — support higher margins and lower risk. A company with no defensible moat warrants a higher company-specific risk premium." },
    ],
  },
  {
    title: "Financial Normalization",
    steps: [
      { title: "Identify all non-recurring items (one-time gains/losses, government credits)", whyThisMatters: "Non-recurring items such as PPP loan forgiveness, ERTC credits, litigation settlements, and asset sale gains distort the earnings base. Each must be identified, quantified, and removed to arrive at a normalized, maintainable earnings stream." },
      { title: "Normalize owner/officer compensation to market rate", whyThisMatters: "Owners often over- or under-compensate themselves relative to what an arm's-length manager would earn. Excess compensation flows through as a normalization addition to earnings; below-market compensation requires a deduction. Use BLS, MGMA, or industry survey data to benchmark." },
      { title: "Adjust related-party expenses (rent, management fees) to market", whyThisMatters: "Rent paid to a related-party landlord at above- or below-market rates must be adjusted to the market rate to reflect true operating economics. The same applies to management fees, consulting fees, and loans to/from related parties." },
      { title: "Remove personal expenses run through the business", whyThisMatters: "Personal vehicles, club memberships, travel, and family payroll that benefit the owner rather than the business inflate expenses and suppress earnings. Each item must be documented with a clear rationale tied to specific line items." },
      { title: "Normalize working capital to operating levels", whyThisMatters: "Excess cash and non-operating assets are separated from the working capital analysis. The normalized working capital balance is used in DCF free cash flow calculations and in the equity bridge." },
      { title: "Document each adjustment with rationale and source", whyThisMatters: "Every normalization adjustment must be defensible. In litigation, IRS audit, or peer review contexts, an undocumented adjustment is the same as a wrong adjustment. Source each item to a line in the financial statements or a specific data source." },
      { title: "Calculate normalized EBITDA, EBIT, and net income for each year", whyThisMatters: "Normalized EBITDA, EBIT, and net income are the inputs to market multiples (GTC, GPC) and the capitalization method. Present all three so the analyst can select the most appropriate earnings base for each method." },
      { title: "Determine blended tax rate (federal + state)", whyThisMatters: "The tax rate is applied to convert pre-tax earnings to after-tax cash flows in the income approach. Use the effective federal rate plus the applicable state corporate or pass-through rate; document the source and computation." },
      { title: "Select earnings base (single year, weighted average, or projection)", whyThisMatters: "The choice of earnings base — most recent year, weighted average (e.g., 3-year weighted), or a projection — must be justified by the company's earnings pattern. Stable earnings support a single-year cap; volatile or trending earnings may require a weighted average or DCF." },
    ],
  },
  {
    title: "Income Approach",
    steps: [
      { title: "Select method: DCF vs. Capitalization of Earnings", whyThisMatters: "DCF is appropriate when earnings are expected to grow unevenly or when projections are well-supported. Capitalization of Earnings is appropriate for stable, mature businesses where a single normalized period reasonably represents future earning power. The choice must be documented." },
      { title: "Build revenue and expense projections (if DCF)", whyThisMatters: "DCF projections must be anchored to historical performance, industry growth rates, and company-specific factors. Projections that depart significantly from the historical record require explicit support. A 5-year projection period is typical." },
      { title: "Calculate CAPEX and working capital changes (if DCF)", whyThisMatters: "Free cash flow to the firm subtracts capital expenditures and adds/subtracts changes in net working capital. Using net income alone without these adjustments overstates free cash flow." },
      { title: "Develop WACC or discount rate", whyThisMatters: "The discount rate converts projected cash flows to a present value. Every component of WACC must be sourced: risk-free rate from the Treasury, ERP from Duff & Phelps/Kroll or Damodaran, beta from industry data, size premium from Duff & Phelps CRSP tables." },
      { title: "Risk-free rate (20-yr Treasury at valuation date)", whyThisMatters: "The 20-year Treasury yield as of the valuation date is the conventional risk-free rate for private company DCF. Do not use current rates — use the rate that prevailed on the effective valuation date." },
      { title: "Equity risk premium (ERP)", whyThisMatters: "The ERP compensates equity investors for the systematic risk of equities over the risk-free rate. Duff & Phelps/Kroll publishes annually recommended ERPs; Damodaran provides both historical and implied ERPs." },
      { title: "Beta / size premium", whyThisMatters: "Beta measures systematic risk (market sensitivity). For private companies, use industry-level unlevered betas from Damodaran and re-lever for the subject's capital structure. Add the size premium from Duff & Phelps CRSP deciles based on the company's equity size." },
      { title: "Company-specific risk premium (CSRP)", whyThisMatters: "The CSRP is a judgment-based premium (typically 0–5%) that captures risk not otherwise reflected in the model: management depth, customer concentration, geographic concentration, product obsolescence, or regulatory exposure. Every component must be explicitly documented." },
      { title: "Cost of debt (synthetic or actual)", whyThisMatters: "Use the company's actual debt rate if available and at market. If not, use a synthetic rating derived from the interest coverage ratio (Damodaran's rating table) and add the appropriate credit spread to the risk-free rate. Apply (1 − tax rate) for after-tax cost." },
      { title: "Capital structure (book, market, or industry target)", whyThisMatters: "The weights used in WACC must be appropriate for the subject company. Industry capital structure (Damodaran) is often the most defensible for private companies without observable market value of equity." },
      { title: "Select long-term growth rate (for terminal value or cap rate)", whyThisMatters: "The terminal growth rate should not exceed long-run GDP growth (2–3%) for mature companies. Inflation-based rates (2–2.5%) are common. A growth rate that exceeds GDP implies the company will eventually be larger than the economy, which is irrational." },
      { title: "Calculate terminal value", whyThisMatters: "The Gordon Growth Model (terminal value = FCF / (WACC − g)) typically represents 60–80% of total enterprise value in a DCF. Small changes in WACC or g have large effects. Document the method (Gordon Growth vs. exit multiple) and sources." },
      { title: "Bridge from enterprise value to equity value (±cash, debt, non-operating assets)", whyThisMatters: "Enterprise value is the value of the entire capitalized earnings stream. To arrive at equity value, add non-operating assets (excess cash, real estate) and subtract interest-bearing debt. This bridge must match the balance sheet used in normalization." },
      { title: "Document all assumptions with sources", whyThisMatters: "Reviewers and courts expect each assumption to be traceable to a specific published source. An assumption stated without a source carries no evidentiary weight." },
      { title: "Perform sensitivity analysis (WACC ±1%, growth ±0.5%)", whyThisMatters: "Sensitivity analysis illustrates how value changes under different assumptions and provides the analyst a defensible range. It demonstrates that the conclusion is not a single-point guess but a considered estimate within a reasonable range." },
    ],
  },
  {
    title: "Market Approach",
    steps: [
      { title: "Determine method: GTC vs. GPC", whyThisMatters: "Guideline Transaction Companies (GTC) use private transaction data (DealStats, Pratt's Stats) and are well-suited for control interests. Guideline Public Companies (GPC) use publicly traded comparables and are better for larger companies with robust public comp sets. The choice must be documented." },
      { title: "Search transaction database (DealStats, Pratt's Stats, Capital IQ)", whyThisMatters: "Transaction databases contain actual M&A prices paid, which reflect the multiples willing buyers paid in arm's-length transactions. The search must be documented with screening criteria so a reviewer can replicate it." },
      { title: "Document screening criteria (SIC/NAICS, size, profitability, date range)", whyThisMatters: "Screening criteria determine which transactions are included and excluded. Undocumented screening invites criticism. Typical screens: same 2-4 digit SIC code, revenue within 2–3× of subject, profitable, transaction within 5 years of valuation date." },
      { title: "Select comparable transactions (justify inclusions/exclusions)", whyThisMatters: "Selecting the final comp set requires judgment. Inclusions and exclusions must be individually justified — not just by screening criteria but by qualitative similarity to the subject. Accepting every database result without analysis is a common failure mode." },
      { title: "Calculate TTM metrics (EBITDA, Revenue, Gross Profit, SDE)", whyThisMatters: "Trailing twelve months (TTM) metrics provide the most current picture of performance and allow apples-to-apples comparison between the subject and comparables. Gross Profit and SDE are critical for small business transactions where owner compensation is embedded." },
      { title: "Select multiples (justify percentile vs. median)", whyThisMatters: "The analyst must justify whether to use the median, a quartile, or a specific percentile. A subject that outperforms peers warrants a multiple above the median; an underperformer warrants below. This decision must be explicitly explained." },
      { title: "Weight multiples (EBITDA, Revenue, GP, SDE)", whyThisMatters: "No single multiple is always best. EBITDA multiples are most common for profitable companies; Revenue multiples are used when EBITDA is near zero; SDE multiples are standard for small, owner-operated businesses. The weighting rationale must be documented." },
      { title: "Calculate indicated value", whyThisMatters: "Apply selected multiples to the subject's TTM metrics and compute the indicated values. Average or weight the results per the analyst's rationale. Document the math transparently." },
    ],
  },
  {
    title: "Asset Approach",
    steps: [
      { title: "Determine if asset approach is applicable (holding companies, real estate, distressed)", whyThisMatters: "The asset approach is the primary method for holding companies, real estate entities, and distressed businesses. For going-concern operating companies with significant goodwill, the asset approach typically serves only as a floor check." },
      { title: "Adjust accounts receivable to FMV (bad debt reserve)", whyThisMatters: "Not all accounts receivable are collectable. Aged receivables over 90 days often require a reserve. A realistic bad debt adjustment is required to reflect what a buyer would pay for the receivable balance." },
      { title: "Adjust inventory to FMV (aging, obsolescence)", whyThisMatters: "Inventory is carried at cost but may be worth less than book if aging, obsolete, or slow-moving. A physical count observation and aging analysis are recommended. Replacement cost and net realizable value are the two FMV bases." },
      { title: "Adjust PP&E to FMV (replacement cost or market data)", whyThisMatters: "Book value of property, plant, and equipment reflects cost less depreciation, not market value. An independent appraisal or cost approach (replacement cost new less depreciation) is required to reflect what a buyer would pay." },
      { title: "Adjust intangibles (if separately identifiable)", whyThisMatters: "Intangible assets not on the books — customer lists, trade names, non-competes — may have significant value and must be identified and valued separately under ASC 805 or for FMV purposes. Unrecognized intangibles cause the asset approach to understate value." },
      { title: "Adjust non-operating assets (excess cash, real estate)", whyThisMatters: "Excess cash above the operating working capital requirement and any real estate not used in operations are non-operating assets. They are valued separately and added to the operating enterprise value in the equity bridge." },
      { title: "Adjust liabilities to FMV (above/below market debt)", whyThisMatters: "Debt at above- or below-market interest rates must be adjusted to reflect the present value of contractual cash flows at current market rates. Below-market rate debt is more valuable to the holder and must be reflected as a premium over face value." },
      { title: "Calculate net tangible FMV equity", whyThisMatters: "Sum the FMV adjustments to assets and liabilities to arrive at the adjusted net asset value (ANAV), which represents the tangible floor of equity value." },
      { title: "Calculate excess earnings / goodwill (if applicable)", whyThisMatters: "The excess earnings method isolates goodwill by capitalizing earnings in excess of a fair return on tangible assets. It is appropriate for professional service firms and businesses where intangible goodwill is a significant driver of value." },
      { title: "Document all FMV adjustments with sources", whyThisMatters: "Each FMV adjustment must cite an appraiser, market data source, or published methodology. Undocumented adjustments carry no weight in IRS review, litigation, or peer review." },
    ],
  },
  {
    title: "DLOM & Discounts",
    steps: [
      { title: "Determine if interest requires DLOM (minority or non-marketable controlling)", whyThisMatters: "DLOM (Discount for Lack of Marketability) compensates for the inability to quickly convert an interest to cash without a price concession. Minority interests in private companies almost always require DLOM. Controlling interests may also require a partial DLOM if not readily marketable." },
      { title: "Select DLOM method(s): restricted stock studies, option models, Mandelbaum", whyThisMatters: "No single DLOM method is definitive. Restricted stock studies (Stout, FMV Opinions, Mercer) show discounts on illiquid shares of public companies. Option models (Longstaff, Finnerty, Asian put) provide an economic framework. Mandelbaum factors provide a qualitative scoring overlay." },
      { title: "Score Mandelbaum factors (if applicable)", whyThisMatters: "The IRS-recognized Mandelbaum case identified nine factors affecting DLOM: private vs. public company information, business restrictions on transfer, financial statement quality, company's redemption policy, dividend history, relationship between buyer and seller, management depth, value of the underlying stock, and prospects for a liquidity event." },
      { title: "Select DLOM percentage and document rationale", whyThisMatters: "Typical DLOM ranges: 10–25% for controlling interests with some marketability constraints; 25–45% for minority interests in small private companies. The selected rate must be supported by the weight of evidence from studies and factors, not selected arbitrarily." },
      { title: "Determine if DLOC applies (minority interest not already at minority level)", whyThisMatters: "DLOC (Discount for Lack of Control) is applied when enterprise value is derived from control-level data (e.g., GPC or control transaction multiples) and then applied to a minority interest. Typical DLOC: 20–35%. Do not apply DLOC if the underlying method already produces minority-level value (e.g., GTC multiples from minority sales)." },
      { title: "Document control premium sources if applicable", whyThisMatters: "When building up from a minority marketable value to a control value, a control premium is added. Source control premiums from Mergerstat/BVR Control Premium Study. Typical range: 25–40%. The control premium and DLOC are arithmetically related." },
    ],
  },
  {
    title: "Reconciliation & Conclusion",
    steps: [
      { title: "Weigh each approach (justify weights with rationale)", whyThisMatters: "The reconciliation weights the indicated values from each approach based on the quality and quantity of evidence, the applicability of each method to the subject, and the reliability of inputs. Weights must be justified — not assigned mechanically." },
      { title: "Calculate weighted indication of value (pre-discount)", whyThisMatters: "The weighted average of the income, market, and asset approach conclusions produces the pre-discount enterprise or equity value. Show all arithmetic transparently." },
      { title: "Apply DLOM to arrive at controlling/non-marketable equity value", whyThisMatters: "DLOM is applied after reconciliation to convert the indicated marketable value to a non-marketable value. The order of operations matters: conclude controlling value, then apply DLOM if applicable." },
      { title: "Calculate value of the specific interest (e.g. 51% × total equity)", whyThisMatters: "The final step is to apply the pro-rata ownership percentage to the total equity value, then verify whether any minority or premium adjustments are needed beyond the pro-rata share." },
      { title: "Round to appropriate precision", whyThisMatters: "A conclusion of $4,234,781 implies false precision. Private company valuations are typically rounded to the nearest $10,000 or $25,000 to communicate that the conclusion is an estimate, not a measurement." },
      { title: "Perform sanity checks (implied EV/EBITDA, revenue multiple vs. market)", whyThisMatters: "Back-solve the implied multiples from your conclusion and compare them to market data. If your implied EV/EBITDA is 12× in a market where comparable transactions averaged 5×, your conclusion needs to be reconsidered." },
      { title: "Document conclusion of value", whyThisMatters: "The conclusion paragraph must state the standard of value, premise of value, effective date, interest being valued, and the concluded value. It is the key opinion of the entire engagement." },
    ],
  },
  {
    title: "Report & Review",
    steps: [
      { title: "Draft engagement overview / letter of transmittal", whyThisMatters: "The letter of transmittal introduces the engagement, identifies the client, states the purpose and effective date, and identifies the analyst. It is typically one of the first sections a reviewer or IRS examiner reads." },
      { title: "Draft company description section", whyThisMatters: "A well-documented company description demonstrates that the analyst understands the business and provides the factual foundation for the valuation conclusions. It should cover history, ownership, operations, and competitive position." },
      { title: "Draft industry and economic analysis", whyThisMatters: "Industry and economic analysis demonstrates that the analyst considered the environment in which the company operates. It links macro and industry conditions to the specific risk premiums and growth rates used in the valuation." },
      { title: "Draft financial analysis and normalization section", whyThisMatters: "This section presents the historical financial statements, documents each normalization adjustment, and derives the normalized earnings base used in the valuation. Every adjustment must appear here with its source." },
      { title: "Draft each approach section", whyThisMatters: "Each approach section (income, market, asset) must fully explain the method, document all inputs and sources, show the calculations, and explain the indicated value. A reviewer should be able to replicate your work from this section alone." },
      { title: "Draft reconciliation and conclusion", whyThisMatters: "The reconciliation section explains why each approach was weighted as it was and walks the reader through the logic of the final conclusion. It is often the most closely scrutinized section." },
      { title: "Add all assumptions and limiting conditions", whyThisMatters: "Standard limiting conditions protect the analyst by disclosing the scope of work, reliance on management representations, and limitations of the analysis. USPAP requires specific language." },
      { title: "Add certifications (USPAP compliance if applicable)", whyThisMatters: "A signed certification is required under USPAP for appraisers. It certifies that the analysis is the analyst's own, that compensation is not contingent on the conclusion, and that the analyst has no undisclosed interests." },
      { title: "Internal review / QC check", whyThisMatters: "A second-partner or senior review catches errors, unsupported assumptions, and logical inconsistencies before the report leaves the firm. One of the most common causes of IRS challenge is a conclusion that was never reviewed internally." },
      { title: "Deliver report", whyThisMatters: "Final delivery completes the engagement. Document the delivery date, method, and recipients. If delivering electronically, note the format and version." },
    ],
  },
];
