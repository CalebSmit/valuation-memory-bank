// Analyst guidance questions keyed by step title.
// Steps in roadmap-seed-data.ts whose title appears here get a pre-populated
// JSON array of prompting questions when a new project is created.

export const ROADMAP_GUIDANCE_QUESTIONS: Record<string, string[]> = {
  // ── PHASE 1 — Engagement Setup ──────────────────────────────────────────
  "Define standard of value (FMV, Fair Value, Investment Value)": [
    "What is the purpose of this engagement — estate tax, buy-sell, gift, financial reporting, litigation, or other? The purpose dictates the standard.",
    "Who is the hypothetical buyer and seller under this standard? Are they arm's length and fully informed?",
    "Is this a Fair Market Value engagement, or has the client or governing document specified a different standard (Fair Value per state statute, Investment Value to a specific buyer)? If different, why?",
  ],
  "Define interest being valued (%, controlling vs. minority)": [
    "What exact ownership percentage is being valued? Is there a shareholders' agreement, operating agreement, or buy-sell agreement that defines the interest?",
    "Does this interest carry voting control? Can the holder force a sale, set distributions, or hire/fire management?",
    "Does the controlling/minority determination affect which approach you will use, or which multiples you will apply?",
  ],
  "Define premise of value (going concern, liquidation)": [
    "Is the business a viable going concern — profitable, with reasonable prospects? Or are there signs of distress that would make liquidation the more appropriate premise?",
    "If going concern: does the company have positive normalized cash flows? If not, can you still support a going concern conclusion and how?",
    "For this engagement, will you use orderly liquidation, forced liquidation, or going concern? Document why.",
  ],
  "Confirm effective valuation date": [
    "What is the exact effective date? Is it specified by a contract, a tax return, a triggering event, or chosen by the client?",
    "Do you have market data, treasury rates, and financial statements that are contemporaneous with that specific date? If the date is mid-year, do you need stub-period financial data?",
    "Are there any material events between the valuation date and today (acquisitions, lawsuits, economic shocks) that must be excluded from the analysis as post-valuation-date events?",
  ],
  "Identify purpose and intended use": [
    "Who will receive and rely on this report — the client, the IRS, a court, a lender, a buyer? Does the intended user affect the scope or reporting requirements?",
    "Does the purpose impose a specific standard of care — USPAP compliance, ASA BVS, AICPA SSVS? Which standards govern this engagement?",
    "Is this a full appraisal, calculation engagement, or estimate of value? What level of documentation does that scope require?",
  ],
  "Note professional standards to follow (USPAP, ASA BVS, AICPA SSVS)": [
    "Is USPAP compliance required? If so, are you complying with Standards Rule 9 (development) and 10 (reporting)?",
    "Does the engagement require an ASA designation or AICPA SSVS compliance? If so, document which standards apply.",
    "What are the specific certification and limiting condition requirements under the applicable standards? Have you drafted those?",
  ],

  // ── PHASE 2 — Company & Industry Research ───────────────────────────────
  "Obtain and review historical financial statements (3–5 years)": [
    "What level of financial statements did you receive — compiled, reviewed, or audited? Does the level of assurance affect your reliance on the numbers?",
    "How many years of history did you receive? Is 3 years sufficient given the earnings pattern, or do you need more history to identify trends?",
    "Did you identify any significant year-to-year swings in revenue, gross margin, or EBITDA? What caused them?",
  ],
  "Obtain tax returns (verify against financials)": [
    "Do the tax returns reconcile to the financial statements for the same periods? Are there material differences, and if so, why?",
    "Did the tax returns reveal any items not on the financial statements — officer loans, related-party transactions, non-deductible expenses?",
    "Is the entity a C-corp, S-corp, partnership, or LLC? How does the tax structure affect the blended tax rate and the earnings base?",
  ],
  "Review balance sheet and footnotes": [
    "Are there off-balance-sheet items — operating leases pre-ASC 842, contingent liabilities, personal guarantees, or related-party notes?",
    "What is the composition of assets? Are there significant non-operating assets (excess cash, real estate, investments) that need to be separated from the operating business?",
    "Does the balance sheet support the equity bridge from enterprise value to equity value? What debt must be subtracted?",
  ],
  "Document business model, revenue streams, customer base": [
    "What percentage of revenue is recurring versus project-based? Is revenue contract-driven (long-term) or transactional (repeat but not guaranteed)?",
    "How does the company price its products or services — cost-plus, market-based, negotiated? Does it have pricing power?",
    "How dependent is revenue on economic cycles, commodity prices, or regulatory requirements?",
  ],
  "Identify top customers and concentration risk": [
    "What percentage of revenue comes from the top customer? Top 3 customers? Top 10? Compare to industry norms.",
    "Are there written contracts with key customers? What are the terms — duration, renewal, exclusivity, volume commitments?",
    "If the largest customer was lost, what would happen to revenue and EBITDA? Would the company remain viable?",
  ],
  "Identify key person dependencies": [
    "Is there one individual whose relationships, knowledge, or skills are critical to maintaining revenue? Would customers follow that person if they left?",
    "Is there a documented succession plan? Is there a management team capable of running the business without the key person?",
    "Does the company carry key man life insurance? If so, what is the coverage amount relative to the indicated value?",
  ],
  "Research industry (NAICS/SIC, growth rate, Porter's Five Forces)": [
    "What is the 4-digit NAICS or SIC code for this company? Does it compete in one industry or multiple?",
    "What is the industry's projected 5-year CAGR? What is driving growth or decline — regulation, demographics, technology, commodity prices?",
    "How do Porter's Five Forces apply — how high are barriers to entry, how fragmented is competition, how much power do customers and suppliers have?",
  ],
  "Research economic conditions at valuation date (regional Fed, FOMC)": [
    "What was the Federal Funds rate, 20-year Treasury yield, and inflation rate on or near the valuation date? Source these from Federal Reserve publications.",
    "Did the regional Federal Reserve Beige Book report any conditions — labor tightness, input cost pressures, credit availability — specific to this company's geography?",
    "How do the macro conditions at the valuation date affect your discount rate, growth rate, and risk premium selections?",
  ],
  "Assess competitive position and moat": [
    "Does the company have a durable competitive advantage — proprietary technology, switching costs, brand, cost structure, or regulatory protection?",
    "How would a new competitor enter this market? What would it cost, and how long would it take to match this company's position?",
    "Has the company's market share grown, held steady, or declined over the past 3 years? What does that say about its competitive position?",
  ],

  // ── PHASE 3 — Financial Normalization ───────────────────────────────────
  "Identify all non-recurring items (one-time gains/losses, government credits)": [
    "Did the company receive PPP loans, ERTC credits, FFCRA reimbursements, or other government credits during the historical period? In which years and in what amounts?",
    "Were there any one-time gains or losses — asset sales, insurance proceeds, litigation settlements, executive bonuses tied to a specific event?",
    "For each non-recurring item: is it truly non-recurring, or does it reflect a pattern? Document the rationale for each removal.",
  ],
  "Normalize owner/officer compensation to market rate": [
    "What is the total compensation (W-2 wages + benefits + perks + distributions treated as comp) of all owners and family members employed by the business?",
    "What would an arm's length manager with equivalent responsibilities earn in this market? What source are you using — BLS, MGMA, RMA, industry salary surveys?",
    "Is the adjustment an addition (owner was overpaid) or a deduction (owner was underpaid and a replacement would cost more)? Show the math.",
  ],
  "Adjust related-party expenses (rent, management fees) to market": [
    "Does the company pay rent to a related party (owner, family member, related entity)? Is the rent above or below market? What market rate source supports your adjustment?",
    "Are there management fees, consulting fees, or royalties paid to related parties? Are they at arm's length, or are they vehicles for profit extraction?",
    "Document each related-party adjustment with the actual amount, the market rate benchmark, the source, and the net adjustment.",
  ],
  "Remove personal expenses run through the business": [
    "Are there personal vehicles, personal travel, club memberships, family payroll, or personal insurance on the books? What are the specific line items and amounts?",
    "Did management disclose these in the management interview or board minutes? Are they documented?",
    "For each personal expense removed: where does it appear on the income statement, and what is the after-tax impact on normalized earnings?",
  ],
  "Normalize working capital to operating levels": [
    "What is the company's normalized working capital requirement as a percentage of revenue or in dollar terms? How did you calculate it?",
    "Is there excess cash on the balance sheet — cash above the operating working capital requirement? How much, and how will you treat it (add to equity value separately)?",
    "Are there non-operating assets (investment accounts, loans to shareholders, owned real estate not used in operations) that need to be pulled out of the operating NWC calculation?",
  ],
  "Document each adjustment with rationale and source": [
    "For every normalization adjustment you are making, do you have a written rationale tied to a specific source — a line item on a financial statement, a market data source, or a board minute?",
    "Have you built a normalization schedule showing: year, adjustment item, amount, and rationale? Is it in a format that a reviewer could audit?",
    "Could each adjustment withstand IRS scrutiny or peer review? If not, which ones need more support?",
  ],
  "Calculate normalized EBITDA, EBIT, and net income for each year": [
    "What is normalized EBITDA for each of the 3–5 historical years after all adjustments? Show the bridge from reported to normalized for each year.",
    "Is EBITDA the right earnings base for market approach multiples in this industry, or is SDE, EBIT, or gross profit more commonly used in the transaction databases you are using?",
    "Which year's (or weighted average of years') normalized earnings will serve as the income base for the capitalization method or as the last historical year for the DCF?",
  ],
  "Determine blended tax rate (federal + state)": [
    "What is the entity type — C-corp, S-corp, LLC, partnership? How does that affect the applicable tax rate?",
    "What is the applicable federal corporate rate? What is the state income or franchise tax rate in this jurisdiction? Are there any tax credits or NOL carryforwards that affect the effective rate?",
    "Is the blended tax rate you are applying consistent with the tax rate implied by the historical financials after normalization? If not, why?",
  ],
  "Select earnings base (single year, weighted average, or projection)": [
    "Are earnings stable and predictable — in which case a single normalized year or simple average is defensible? Or are earnings trending, in which case a weighted average (heavier on recent years) or DCF is more appropriate?",
    "If using a weighted average: what weights are you applying (e.g., 1-2-3 or 1-2-4) and why do those weights reflect the earnings trend?",
    "If using a projection as the earnings base: is the projection supported by management's history of accuracy? Has the company consistently hit its projections?",
  ],

  // ── PHASE 4 — Income Approach ───────────────────────────────────────────
  "Select method: DCF vs. Capitalization of Earnings": [
    "Are earnings expected to be stable and grow at a roughly constant rate — suggesting cap of earnings? Or are there near-term growth investments, planned capex, or uneven cash flows that make a multi-period DCF more appropriate?",
    "For the Dordt PPE engagement, the team chose DCF because the company was in a growth phase with uneven near-term cash flows (website revamp, equipment CAPEX spike). Is your company in a similar situation, or is it more mature and stable?",
    "If you select cap of earnings: what single earnings figure best represents the company's sustainable, long-run earning power?",
  ],
  "Build revenue and expense projections (if DCF)": [
    "What is your revenue growth rate assumption for the near-term forecast period (years 1–3) and the later period (years 4–5)? How is each rate supported — by management projections, industry CAGR, historical CAGR, or analyst judgment?",
    "Are you projecting individual expense line items, or using expense structure as a percentage of revenue? If using % of revenue, which historical years are you averaging and why?",
    "Does your projected EBITDA margin expand, contract, or stay flat versus historical? Is that margin trend consistent with the company's competitive position and management's initiatives?",
  ],
  "Calculate CAPEX and working capital changes (if DCF)": [
    "Did you separate maintenance CAPEX from growth CAPEX? What is the maintenance CAPEX as a % of revenue, and what are the specific growth investments planned?",
    "How are you projecting NWC — as a flat % of revenue, or using cash conversion cycle (DSO, DIO, DPO)? The CCC approach is more precise for companies with significant AR or inventory.",
    "Is the company's NWC increasing or decreasing over the forecast period? A growing company typically consumes NWC; a maturing company may release it.",
  ],
  "Develop WACC or discount rate": [
    "Are you using CAPM + size premium + CSRP (build-up method) or a pure CAPM approach? For small private companies, the build-up method (Duff & Phelps) is more common.",
    "What is your cost of equity, cost of debt, and target capital structure? Do these reflect the company's actual situation or the industry norm?",
    "Does your WACC make intuitive sense — i.e., is it consistent with the risk profile you described in the industry and company analysis? A low-risk, profitable distributor should have a lower WACC than a startup.",
  ],
  "Risk-free rate (20-yr Treasury at valuation date)": [
    "What was the 20-year US Treasury yield on or immediately before the valuation date? Source this from the Federal Reserve H.15 release or US Treasury website.",
    "Why use the 20-year Treasury rather than the 10-year? (The 20-year better matches the long investment horizon implied by a going concern DCF.)",
    "Document the exact rate and date observed.",
  ],
  "Equity risk premium (ERP)": [
    "What ERP source are you using — Duff & Phelps/Kroll Cost of Capital Navigator, Damodaran's implied ERP, or a historical premium? What is the specific published figure?",
    "If using Duff & Phelps: are you using the recommended ERP for the valuation date, not the current ERP? The ERP can change materially year to year.",
    "Is this a supply-side or demand-side ERP? Document the distinction.",
  ],
  "Beta / size premium": [
    "What industry are you using for the beta lookup on Damodaran's website? Is the subject company's risk profile consistent with the industry average?",
    "What is the unlevered beta? How did you re-lever it using the Hamada equation for the subject company's capital structure?",
    "What CRSP decile does this company fall into based on market cap of equity (or estimated equity value)? What is the size premium from Duff & Phelps for that decile?",
  ],
  "Company-specific risk premium (CSRP)": [
    "List every company-specific risk factor you identified. For each: what is the risk, how severe is it, and what basis points of premium does it justify?",
    "For the Dordt PPE engagement, CSRP was supported by customer concentration (top 10 = 37% of sales), key person risk (family-owned, succession pressure), and single-geography exposure. What are your company's specific factors?",
    "Does your total CSRP fall within the 0–5% range typically seen in practice? If it is above 5%, can you defend each component?",
  ],
  "Cost of debt (synthetic or actual)": [
    "Does the company have existing debt? If so, what is the actual interest rate? Is it at market, or is it legacy debt at a rate that no longer reflects current market conditions?",
    "If using a synthetic rating: what is the company's interest coverage ratio (EBIT / interest expense)? What credit rating does Damodaran's table imply, and what spread does that add to the risk-free rate?",
    "What is the after-tax cost of debt: Kd × (1 − blended tax rate)?",
  ],
  "Capital structure (book, market, or industry target)": [
    "Are you using book value capital structure, market value capital structure, or industry target capital structure? For private companies, industry target is common — what is the source (Damodaran by industry)?",
    "What is the target debt-to-total-capital ratio? Is the subject company's actual leverage materially different from the industry target, and does that affect your WACC?",
    "Run a WACC sensitivity: if D/TC shifts from 20% to 30%, how much does WACC change?",
  ],
  "Select long-term growth rate (for terminal value or cap rate)": [
    "What long-term nominal GDP growth rate are you using as your ceiling? (Typical: 2.0–2.5% real + 2.0–2.5% inflation = 3–4% nominal)",
    "Is the company's industry growing faster or slower than GDP? Does the company have a specific competitive position that allows it to grow faster than its industry long-term?",
    "For the Dordt PPE engagement, a 3.5% LT growth rate was selected based on industry CAGR (4.6%) tempered by the company's regional concentration and competition. How would you support your selected rate?",
  ],
  "Calculate terminal value": [
    "Are you using the Gordon Growth Model (FCF / (WACC − g)) or an exit multiple (EBITDA × multiple at terminal year)? If exit multiple, what multiple and what is the source?",
    "What percentage of your total enterprise value comes from the terminal value? If it exceeds 75%, your assumptions in WACC and g are driving most of the value — are they well-supported?",
    "Run a two-way sensitivity table: WACC on one axis, g on the other, enterprise value as the output. What is the range?",
  ],
  "Bridge from enterprise value to equity value (±cash, debt, non-operating assets)": [
    "What items are you adding back to enterprise value — excess cash, non-operating real estate, other non-operating assets? How did you determine the 'excess' threshold for cash?",
    "What interest-bearing debt is being subtracted — long-term debt, current portion of LTD, capital leases? Are there any off-balance-sheet obligations?",
    "After the bridge, does the implied equity value sanity-check against the balance sheet? Is the implied book-to-market ratio reasonable for the industry?",
  ],
  "Perform sensitivity analysis (WACC ±1%, growth ±0.5%)": [
    "Build a sensitivity table with WACC on one axis (−1%, base, +1%) and LT growth on the other (−0.5%, base, +0.5%). What is the range of enterprise values?",
    "Does the sensitivity range support your conclusion, or does it reveal that a small assumption change dramatically alters the outcome? If the latter, which assumption needs more support?",
    "Present the sensitivity range as a sanity check: does it bracket the indicated values from the market and asset approaches?",
  ],

  // ── PHASE 5 — Market Approach ───────────────────────────────────────────
  "Determine method: GTC vs. GPC": [
    "Is the interest being valued a controlling interest? If yes, GTC (private transaction data) is generally more appropriate because it reflects actual control-level prices paid.",
    "Is the company large enough and does a robust public comp set exist? GPC requires 5+ publicly traded companies with genuinely similar economics.",
    "Will you use GTC only, GPC only, or both? If both, how will you weight the two sets of indicated values?",
  ],
  "Search transaction database (DealStats, Pratt's Stats, Capital IQ)": [
    "Which database are you using — DealStats, BizComps, Pratt's Stats, Capital IQ, or another? What are the pros and cons of that database for this specific industry?",
    "What SIC or NAICS code did you use to screen? Did you include adjacent codes, and if so, why are those transactions comparable?",
    "What date range, revenue range, and profitability screen did you apply? Document all criteria before looking at results.",
  ],
  "Select comparable transactions (justify inclusions/exclusions)": [
    "How many transactions came back from your initial screen? How many did you include in the final comp set after qualitative review?",
    "For each exclusion: what was the specific reason — product mismatch, extreme outlier multiple, data quality concern, date too old?",
    "For each inclusion: what makes this transaction comparable to the subject — similar revenue model, similar end markets, similar size, similar geography?",
  ],
  "Calculate TTM metrics (EBITDA, Revenue, Gross Profit, SDE)": [
    "Is the subject company's fiscal year-end aligned with the valuation date? If not, did you calculate trailing twelve months (TTM) financials as of the valuation date, not the most recent fiscal year end?",
    "For this subject: is EBITDA, Revenue, Gross Profit, or SDE the most relevant earnings metric? What do the transactions in your comp set most commonly use?",
    "Did you apply your normalized financials (post all adjustments) to the multiples, not the reported financials?",
  ],
  "Select multiples (justify percentile vs. median)": [
    "What is the median, 25th percentile, and 75th percentile of the multiple across your comp set? Where does the subject company's financial profile (margins, growth, size, risk) suggest it should fall relative to the median?",
    "Is the subject company a better or worse business than the median comparable? Be specific: higher margins, faster growth, stronger customer relationships, or more risk, more concentration, lower margins?",
    "Document your multiple selection with a clear written rationale: 'We selected the Xth percentile because...'",
  ],
  "Weight multiples (EBITDA, Revenue, GP, SDE)": [
    "Are you using one multiple type or weighting multiple types (e.g., 50% EBITDA, 50% Revenue)? What is the rationale for the weighting?",
    "Is EBITDA the most reliable metric for this subject, or is it distorted (near-zero, highly variable)? If distorted, which metric is more reliable?",
    "Show the indicated value under each multiple separately before weighting. Does the weighted average make intuitive sense?",
  ],

  // ── PHASE 6 — Asset Approach ────────────────────────────────────────────
  "Determine if asset approach is applicable (holding companies, real estate, distressed)": [
    "Is this company an operating business with significant goodwill and intangible value, or is it primarily an asset-holding entity? The answer determines whether asset approach is primary or just a floor check.",
    "Is the going concern income approach value materially above the ANAV? If so, the ANAV serves as a floor but is not the primary indicator.",
    "Are there specific assets that require independent appraisal — real property, significant equipment, intangibles? Have those appraisals been obtained or are they being estimated?",
  ],
  "Calculate excess earnings / goodwill (if applicable)": [
    "If using the excess earnings method: what rate of return are you applying to tangible assets, and what is the source for that rate?",
    "How much goodwill does the excess earnings method imply? Does that amount seem reasonable relative to the income and market approach conclusions?",
    "Is the excess earnings method being used as a check or as a primary indicator? The IRS and most practitioners consider it a secondary method.",
  ],

  // ── PHASE 7 — DLOM & Discounts ──────────────────────────────────────────
  "Determine if interest requires DLOM (minority or non-marketable controlling)": [
    "Is the interest being valued a minority interest? If yes, DLOM almost certainly applies — marketability is absent for a private minority block.",
    "Is this a controlling interest? Even controlling interests in private companies can warrant a partial DLOM (non-marketable controlling interest) — typically 10–20%.",
    "Is there any put right, registration right, or redemption agreement that provides the holder with a means of exit? Such rights reduce DLOM.",
  ],
  "Select DLOM method(s): restricted stock studies, option models, Mandelbaum": [
    "Which DLOM methods will you use? At minimum, cite one empirical study (restricted stock or pre-IPO) and consider one analytical model or qualitative framework.",
    "Which restricted stock studies did you review — Silber, Stout, FMV Opinions, Management Planning, Moroney? What were the average discounts reported in studies relevant to this company's size and trading profile?",
    "Are you using an option model (Longstaff, Finnerty, Asian put)? If so, what inputs — stock price volatility, expected holding period, dividend yield — and how did you determine those inputs for a private company?",
  ],
  "Score Mandelbaum factors (if applicable)": [
    "Score each of the nine Mandelbaum factors for this company: (1) private vs. public information availability, (2) transfer restrictions, (3) financial statement quality, (4) redemption policy, (5) dividend/distribution history, (6) buyer-seller relationship, (7) management depth, (8) value and transferability of the interest, (9) prospects for a liquidity event. Does each factor push DLOM up or down?",
    "What is the net direction of the Mandelbaum scoring — do most factors increase or decrease DLOM relative to the base from the empirical studies?",
    "Document your DLOM conclusion: what range does the evidence support, and where in that range did you land and why?",
  ],
  "Determine if DLOC applies (minority interest not already at minority level)": [
    "Did your income and market approaches produce enterprise value (control-level) or minority-level value? If control-level, and you are valuing a minority interest, you must either apply DLOC or use methods that already reflect minority-level pricing.",
    "What is the implied DLOC from the inverse of the control premium? If the control premium is 30%, DLOC = 1 − (1/1.30) = 23.1%.",
    "Are DLOC and DLOM being applied sequentially (as they should be), or are you double-counting? Walk through the level of value chart explicitly.",
  ],

  // ── PHASE 8 — Reconciliation & Conclusion ───────────────────────────────
  "Weigh each approach (justify weights with rationale)": [
    "What weight are you giving to each approach — income, market, asset? Write the rationale in plain English: why is the income approach given the most weight? What limitations does the market approach have in this situation?",
    "For the Dordt PPE engagement: DCF was given 50%, GTC 40%, ANAV 10% (floor check). The income approach was weighted highest because the company had well-supported projections; GTC was strong because comparable transaction data existed; ANAV was a floor only. How does your company compare?",
    "If two approaches produce widely different values, do not simply average them. Understand why they diverge and address the divergence in your rationale.",
  ],
  "Perform sanity checks (implied EV/EBITDA, revenue multiple vs. market)": [
    "What is the implied EV/EBITDA from your income approach conclusion? Does it fall within the range observed in the market approach? If not, explain why.",
    "What is the implied EV/Revenue multiple? Is it consistent with the industry rule of thumb for this sector?",
    "If a sophisticated buyer were to acquire this company at your concluded value, what IRR would they earn over a 5-year hold? Does that IRR seem reasonable for the risk profile?",
  ],

  // ── PHASE 9 — Report & Review ───────────────────────────────────────────
  "Draft financial analysis and normalization section": [
    "Have you presented a normalized income statement for each historical year, with a clear column showing reported → adjusted → normalized? Is each adjustment line-itemized with its rationale?",
    "Did you explain the methodology for selecting the earnings base — single year, weighted average, or forecast — and why it best represents sustainable earning power?",
    "Have you addressed any unusual or large adjustments that a reader might question? Pre-empt the obvious objection.",
  ],
  "Internal review / QC check": [
    "Has a second person reviewed the normalization adjustments for completeness and defensibility?",
    "Does the equity bridge foot — i.e., enterprise value ± all bridge items = concluded equity value?",
    "Is the DLOM/DLOC section consistent with the level of value framework? Have you confirmed the order of operations?",
  ],
};
