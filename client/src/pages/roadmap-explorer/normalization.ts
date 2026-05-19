export interface NormalizationSection {
  label: string;
  body: string;
}

export interface NormalizationTopic {
  name: string;
  intro?: string;
  sections: NormalizationSection[];
}

export const NORMALIZATION_TOPICS: NormalizationTopic[] = [
  {
    name: "Owner / Officer Compensation Normalization",
    intro:
      "Replace actual owner compensation with the market cost a buyer would incur to hire an arm's-length manager to perform the same functions.",
    sections: [
      { label: "Adjustment direction", body: "If owner is overpaid (above market) → ADD BACK to earnings (increases value). If owner is underpaid (below market) → DEDUCT from earnings (decreases value — rare but important)." },
      { label: "What to capture", body: "W-2 wages + bonuses + benefits + personal expenses + excess insurance premiums + family payroll for non-working family members + payroll taxes on all of the above." },
      { label: "Owner's actual functions", body: "Must be documented. If owner serves as CEO, lead salesperson, AND head of operations, the replacement compensation may need to be a composite of multiple roles." },
      { label: "Benchmark — BLS OEWS (bls.gov/oes)", body: "By occupation code, industry, and geography. Best public starting point. Issue: must match occupation to owner's actual duties — not just 'general manager.'" },
      { label: "Benchmark — MGMA", body: "For physician-owner and medical practice valuations. Specialty-specific and productivity-adjusted. Most defensible source for healthcare." },
      { label: "Benchmark — AICPA MAP Survey", body: "For CPA/accounting firm owner normalization. Provides partner compensation and profit-per-partner context." },
      { label: "Benchmark — RMA Statement Studies", body: "Industry-level officer compensation as % of revenue ratio. Useful as a cross-check — not a primary salary source." },
      { label: "Practical methodology", body: "(1) Itemize every form of compensation by category and year. (2) Document owner's actual functions and approximate time allocation. (3) Select appropriate benchmark source(s) for the primary role(s). (4) Conclude a market replacement compensation with associated benefits and payroll taxes. (5) Compute net adjustment: Market comp − actual comp (positive = add-back; negative = deduction). (6) Apply consistently across all historical years." },
      { label: "Value sensitivity", body: "Owner comp flows directly into EBITDA or SDE. A $100K adjustment on a 5× multiple = $500K value impact. This is one of the most consequential normalization decisions." },
    ],
  },

  {
    name: "Related-Party Rent Normalization",
    intro:
      "Operating company may pay rent to a building entity owned by the same owner at above- or below-market rates. This distorts true operating earnings. A buyer would pay market rent — so we normalize to market.",
    sections: [
      { label: "Adjustment direction", body: "Above-market rent → ADD BACK to earnings (earnings were artificially low). Below-market rent → DEDUCT from earnings (earnings were artificially high, must reflect true cost to buyer)." },
      { label: "Benchmark — LoopNet", body: "Current asking rents for comparable spaces. Useful for smaller engagements. Free tier available." },
      { label: "Benchmark — CoStar", body: "Broader market analytics and lease comparables. Stronger evidentiary support when rent adjustment is material." },
      { label: "Benchmark — Broker opinion of value (BOV)", body: "Current local leasing intelligence at lower cost than formal appraisal. Strength depends on broker's local expertise and quality of comparable lease analysis." },
      { label: "Benchmark — Independent USPAP appraisal", body: "Required when rent adjustment is large, contested, or central to the engagement (litigation, IRS review). Highest evidentiary weight." },
      { label: "Adjustment mechanics", body: "Compare actual contract rent to concluded market rent, adjusted for lease structure (NNN vs. gross), tenant improvements, expense obligations, and comparable property characteristics. Dollar-per-square-foot differences get multiplied across the entire space — small $/SF differences can produce large value swings." },
    ],
  },

  {
    name: "Working Capital Normalization",
    intro:
      "The income approach assumes the business is delivered with a normal (arm's-length) level of operating working capital. Excess WC may be added separately in the equity bridge; deficient WC may reduce value.",
    sections: [
      { label: "Operating WC definition", body: "Accounts receivable + inventory + prepaid operating expenses − accounts payable − accrued expenses − other ordinary-course operating liabilities. EXCLUDE: cash, debt, income taxes payable, deferred revenue (evaluate separately)." },
      { label: "Method 1 — Percent of revenue", body: "Step 1: Calculate historical operating NWC / revenue for each year. Step 2: Select normalized rate (average, weighted average, or median depending on trend). Step 3: Forecast NWC = normalized % × projected revenue. Step 4: ΔNWC = year-over-year change (cash outflow when NWC increases). Strength: simple, explainable, aligns with how financial models work. Weakness: can hide changes in underlying drivers; distorted by seasonality or balance-sheet anomalies." },
      { label: "Method 2 — Cash Conversion Cycle (CCC)", body: "CCC = DSO + DIO − DPO. DSO = (AR / Revenue) × 365. DIO = (Inventory / COGS) × 365. DPO = (AP / COGS) × 365. Normalize each ratio to reflect efficient (or expected future) operations, not distorted history. Apply normalized DSO/DIO/DPO to projected revenue and COGS to derive required AR, inventory, and AP balances. Strength: operationally grounded — explains WHY the company needs a given NWC level. Best for: manufacturing, distribution, contracting, any business with significant AR/inventory/payables dynamics." },
      { label: "Dordt PPE engagement example", body: "DSO declining 1 day/year (improving collections), DIO declining 1 day/year (inventory efficiency), DPO increasing 0.5 days/year (stretching payables). This reflects operational improvement over the forecast period, not static history." },
      { label: "Choosing between methods", body: "Use both as complements. Percent-of-revenue = high-level anchor. CCC = operational reasonableness check. In seasonal, fast-growing, or rapidly changing businesses, weight recent normalized periods more heavily." },
    ],
  },

  {
    name: "Non-Recurring Item Identification",
    intro:
      "Remove items that are unusual, not part of ordinary operations, and unlikely to recur. The label 'non-recurring' cannot be used carelessly — if a company has similar 'one-time' events regularly, they may actually be recurring.",
    sections: [
      { label: "PPP Loan Forgiveness", body: "Treatment: non-recurring. Reflects extraordinary pandemic government assistance, not ongoing operating profitability. May be booked as other income, loan forgiveness income, or grant-like income depending on accounting policy election (IRS Rev. Proc. 2021-48 gave timing flexibility). Remove from EBITDA/SDE. No impact on asset approach (it's an income statement item)." },
      { label: "ERTC / Employee Retention Credit", body: "Treatment: non-recurring. COVID-era refundable payroll tax credit under specific eligibility rules. May be embedded in payroll expense reduction, booked as other income, or sitting as a receivable if not yet received. 2025/2026 issue: IRS has imposed processing constraints and identified widespread questionable claims. If a material ERTC receivable remains on the balance sheet, assess collectability risk — may need to be discounted or excluded from the equity bridge. Remove from earnings; address the receivable separately in the balance sheet bridge." },
      { label: "FFCRA Credits", body: "Same category as ERTC — COVID-era government credit, non-recurring. Remove from earnings." },
      { label: "NOL Carryforward tax benefits", body: "One-time in nature if arising from CARES Act or prior C-corp periods. Remove from earnings; may create a deferred tax asset that needs separate balance-sheet treatment." },
      { label: "Profit sharing / discretionary bonuses", body: "If tied to a specific event or management decision rather than an ongoing policy, remove as non-recurring. If they happen every year in similar amounts, they may actually be recurring compensation — normalize to market rate instead of removing entirely." },
      { label: "Charitable contributions", body: "Voluntary, non-operating. Remove unless they are small and recurring as part of company culture (in which case, leave in as an ordinary expense)." },
      { label: "Insurance proceeds", body: "Remove both the unusual loss and the insurance recovery so neither appears in normalized earnings. If excess cash remains on the balance sheet from the recovery, treat as non-operating in the bridge." },
      { label: "Litigation settlements", body: "Remove when arising from a one-time dispute. Do NOT remove if litigation is a recurring feature of the business or industry — that cost may be a normal operating expense." },
      { label: "Gains/losses on asset sales", body: "Capital transaction, not operating performance. Always remove." },
      { label: "Documentation standard", body: "For each non-recurring adjustment: (1) the year(s) affected, (2) the specific line item on the financial statements, (3) the exact amount, (4) the source (board minutes, financial statements, tax returns), (5) the rationale for non-recurring classification. This is what makes each adjustment defensible under IRS review, peer review, or litigation." },
    ],
  },
];
