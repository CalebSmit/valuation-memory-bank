/**
 * Canonical valuation report outline.
 *
 * Three-level hierarchy:
 *   level 1 = Part        (top-level section of the report)
 *   level 2 = Section     (subsection inside a Part)
 *   level 3 = Subsection  (granular topic inside a Section)
 *
 * Slugs are stable identifiers — DO NOT rename after release; project content
 * rows reference slugs via project_report_sections.template_slug. To add new
 * sections, append entries with a new unique slug.
 *
 * NOTE: this file is content only. No calculator logic. The outline stores
 * narrative + evidence links for topics like WACC; numerical values still live
 * in external Excel/Sheets models referenced via external_model_references.
 */

export interface ReportSectionTemplateSeed {
  slug: string;
  parentSlug: string | null;
  level: 1 | 2 | 3;
  title: string;
  defaultOrder: number;
  description?: string;
  guidance?: string;
}

export const REPORT_SECTION_TEMPLATES: ReportSectionTemplateSeed[] = [
  // ─── Part 1: Engagement Overview ───────────────────────────────────────────
  { slug: "engagement-overview", parentSlug: null, level: 1, title: "Engagement Overview", defaultOrder: 100,
    description: "Scope of the engagement, standards followed, and identity of the interest being valued." },
  { slug: "engagement-overview.standards-and-compliance", parentSlug: "engagement-overview", level: 2, title: "Standards & Compliance", defaultOrder: 110,
    description: "USPAP, SSVS, IVS, AICPA, NACVA, IRS Revenue Ruling 59-60, etc. — which standards govern this report." },
  { slug: "engagement-overview.valuation-purpose", parentSlug: "engagement-overview", level: 2, title: "Valuation Purpose", defaultOrder: 120,
    description: "Why the valuation was performed: gift/estate tax, ESOP, M&A, litigation, financial reporting, internal planning, etc." },
  { slug: "engagement-overview.valuation-date", parentSlug: "engagement-overview", level: 2, title: "Valuation Date", defaultOrder: 130,
    description: "Effective date of value and how it relates to known/knowable information." },
  { slug: "engagement-overview.ownership-interest-and-level-of-value", parentSlug: "engagement-overview", level: 2, title: "Ownership Interest & Level of Value", defaultOrder: 140,
    description: "Subject interest, percentage, control vs minority, marketable vs non-marketable." },

  // ─── Part 2: Company Overview ──────────────────────────────────────────────
  { slug: "company-overview", parentSlug: null, level: 1, title: "Company Overview", defaultOrder: 200,
    description: "Background on the subject company: what it does, where, and who runs it." },
  { slug: "company-overview.business-model", parentSlug: "company-overview", level: 2, title: "Business Model", defaultOrder: 210 },
  { slug: "company-overview.products-services", parentSlug: "company-overview", level: 2, title: "Products / Services", defaultOrder: 220 },
  { slug: "company-overview.locations-and-operations", parentSlug: "company-overview", level: 2, title: "Locations & Operations", defaultOrder: 230 },
  { slug: "company-overview.management-governance-and-key-personnel", parentSlug: "company-overview", level: 2, title: "Management, Governance & Key Personnel", defaultOrder: 240 },
  { slug: "company-overview.employee-workforce-analysis", parentSlug: "company-overview", level: 2, title: "Employee / Workforce Analysis", defaultOrder: 250 },
  { slug: "company-overview.management-initiatives", parentSlug: "company-overview", level: 2, title: "Management Initiatives", defaultOrder: 260 },
  { slug: "company-overview.company-specific-risks", parentSlug: "company-overview", level: 2, title: "Company-Specific Risks", defaultOrder: 270 },

  // ─── Part 3: Customer Overview ─────────────────────────────────────────────
  { slug: "customer-overview", parentSlug: null, level: 1, title: "Customer Overview", defaultOrder: 300 },
  { slug: "customer-overview.customer-concentration", parentSlug: "customer-overview", level: 2, title: "Customer Concentration", defaultOrder: 310 },
  { slug: "customer-overview.customer-growth-and-retention", parentSlug: "customer-overview", level: 2, title: "Customer Growth & Retention", defaultOrder: 320 },
  { slug: "customer-overview.sales-breakdown", parentSlug: "customer-overview", level: 2, title: "Sales Breakdown", defaultOrder: 330 },
  { slug: "customer-overview.end-market-exposure", parentSlug: "customer-overview", level: 2, title: "End-Market Exposure", defaultOrder: 340 },

  // ─── Part 4: Industry Overview ─────────────────────────────────────────────
  { slug: "industry-overview", parentSlug: null, level: 1, title: "Industry Overview", defaultOrder: 400 },
  { slug: "industry-overview.competitive-landscape", parentSlug: "industry-overview", level: 2, title: "Competitive Landscape", defaultOrder: 410 },
  { slug: "industry-overview.market-positioning", parentSlug: "industry-overview", level: 2, title: "Market Positioning", defaultOrder: 420 },
  { slug: "industry-overview.industry-drivers", parentSlug: "industry-overview", level: 2, title: "Industry Drivers", defaultOrder: 430 },
  { slug: "industry-overview.key-industry-players", parentSlug: "industry-overview", level: 2, title: "Key Industry Players", defaultOrder: 440 },
  { slug: "industry-overview.industry-risk-profile", parentSlug: "industry-overview", level: 2, title: "Industry Risk Profile", defaultOrder: 450 },

  // ─── Part 5: Economic Outlook ──────────────────────────────────────────────
  { slug: "economic-outlook", parentSlug: null, level: 1, title: "Economic Outlook", defaultOrder: 500,
    description: "Macro and regional economic context as of the valuation date." },
  { slug: "economic-outlook.interest-rates-and-cost-of-capital", parentSlug: "economic-outlook", level: 2, title: "Interest Rates & Cost of Capital Environment", defaultOrder: 510 },
  { slug: "economic-outlook.inflation-and-input-costs", parentSlug: "economic-outlook", level: 2, title: "Inflation / Input Cost Trends", defaultOrder: 520 },
  { slug: "economic-outlook.labor-market-trends", parentSlug: "economic-outlook", level: 2, title: "Labor Market Trends", defaultOrder: 530 },
  { slug: "economic-outlook.business-investment-and-capex", parentSlug: "economic-outlook", level: 2, title: "Business Investment / Capital Spending Trends", defaultOrder: 540 },
  { slug: "economic-outlook.regional-economic-conditions", parentSlug: "economic-outlook", level: 2, title: "Regional Economic Conditions", defaultOrder: 550 },
  { slug: "economic-outlook.middle-market-confidence", parentSlug: "economic-outlook", level: 2, title: "Middle-Market Confidence", defaultOrder: 560 },
  { slug: "economic-outlook.expansion-vs-downturn-scenario", parentSlug: "economic-outlook", level: 2, title: "Expansion vs. Downturn Scenario", defaultOrder: 570 },
  { slug: "economic-outlook.industry-and-economic-outlook-conclusion", parentSlug: "economic-outlook", level: 2, title: "Industry & Economic Outlook Conclusion", defaultOrder: 580 },

  // ─── Part 6: Historical Financial Metrics ──────────────────────────────────
  { slug: "historical-financial-metrics", parentSlug: null, level: 1, title: "Historical Financial Metrics", defaultOrder: 600 },
  { slug: "historical-financial-metrics.financial-statement-analysis", parentSlug: "historical-financial-metrics", level: 2, title: "Financial Statement Analysis", defaultOrder: 610 },
  { slug: "historical-financial-metrics.normalizing-adjustments", parentSlug: "historical-financial-metrics", level: 2, title: "Normalizing Adjustments", defaultOrder: 620 },
  { slug: "historical-financial-metrics.nonrecurring-extraordinary-adjustments", parentSlug: "historical-financial-metrics", level: 2, title: "Nonrecurring / Extraordinary Adjustments", defaultOrder: 630 },
  { slug: "historical-financial-metrics.normalized-income-statement", parentSlug: "historical-financial-metrics", level: 2, title: "Normalized Income Statement", defaultOrder: 640 },
  { slug: "historical-financial-metrics.balance-sheet-analysis", parentSlug: "historical-financial-metrics", level: 2, title: "Balance Sheet Analysis", defaultOrder: 650 },
  { slug: "historical-financial-metrics.ttm-financials", parentSlug: "historical-financial-metrics", level: 2, title: "TTM Financials", defaultOrder: 660 },
  { slug: "historical-financial-metrics.roic", parentSlug: "historical-financial-metrics", level: 2, title: "ROIC", defaultOrder: 670 },

  // ─── Part 7: Valuation Approaches ──────────────────────────────────────────
  { slug: "valuation-approaches", parentSlug: null, level: 1, title: "Valuation Approaches", defaultOrder: 700,
    description: "Overview of the three approaches and their application here." },
  { slug: "valuation-approaches.overview", parentSlug: "valuation-approaches", level: 2, title: "Valuation Approaches Overview", defaultOrder: 705 },

  // Income Approach
  { slug: "valuation-approaches.income-approach", parentSlug: "valuation-approaches", level: 2, title: "Income Approach", defaultOrder: 710 },
  { slug: "income-approach.dcf-forecast-rationale", parentSlug: "valuation-approaches.income-approach", level: 3, title: "DCF Forecast Rationale", defaultOrder: 711 },
  { slug: "income-approach.revenue-projections", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Revenue Projections", defaultOrder: 712 },
  { slug: "income-approach.expense-structure-forecast", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Expense Structure Forecast", defaultOrder: 713 },
  { slug: "income-approach.ebit-ebitda-forecast", parentSlug: "valuation-approaches.income-approach", level: 3, title: "EBIT / EBITDA Forecast", defaultOrder: 714 },
  { slug: "income-approach.tax-rate", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Tax Rate / Blended Tax Rate", defaultOrder: 715 },
  { slug: "income-approach.depreciation", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Depreciation", defaultOrder: 716 },
  { slug: "income-approach.capital-expenditures", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Capital Expenditures", defaultOrder: 717 },
  { slug: "income-approach.net-working-capital", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Net Working Capital", defaultOrder: 718 },
  { slug: "income-approach.reinvestment-rate", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Reinvestment Rate", defaultOrder: 719 },
  { slug: "income-approach.fcff-calculation", parentSlug: "valuation-approaches.income-approach", level: 3, title: "FCFF Calculation", defaultOrder: 720,
    description: "Narrative on FCFF build — supporting numbers live in the linked Excel model." },
  { slug: "income-approach.terminal-value", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Terminal Value", defaultOrder: 721 },
  { slug: "income-approach.long-term-growth-rate", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Long-Term Growth Rate", defaultOrder: 722 },
  { slug: "income-approach.mid-year-convention", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Mid-Year Convention / Stub Period", defaultOrder: 723 },
  { slug: "income-approach.present-value-table", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Present Value Table", defaultOrder: 724 },
  { slug: "income-approach.wacc", parentSlug: "valuation-approaches.income-approach", level: 3, title: "WACC", defaultOrder: 725,
    description: "Narrative on WACC selection — calculation lives in the linked external model." },
  { slug: "income-approach.capital-structure", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Capital Structure", defaultOrder: 726 },
  { slug: "income-approach.cost-of-debt", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Cost of Debt", defaultOrder: 727 },
  { slug: "income-approach.credit-rating-analysis", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Credit Rating Analysis", defaultOrder: 728 },
  { slug: "income-approach.synthetic-credit-rating", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Synthetic Credit Rating", defaultOrder: 729 },
  { slug: "income-approach.default-spread", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Default Spread", defaultOrder: 730 },
  { slug: "income-approach.cost-of-equity", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Cost of Equity", defaultOrder: 731 },
  { slug: "income-approach.build-up-method", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Build-Up Method", defaultOrder: 732 },
  { slug: "income-approach.risk-free-rate", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Risk-Free Rate", defaultOrder: 733 },
  { slug: "income-approach.size-premium", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Size Premium", defaultOrder: 734 },
  { slug: "income-approach.company-specific-risk-premium", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Company-Specific Risk Premium", defaultOrder: 735 },
  { slug: "income-approach.discount-rate-support", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Discount Rate Support", defaultOrder: 736 },
  { slug: "income-approach.dcf-value-conclusion", parentSlug: "valuation-approaches.income-approach", level: 3, title: "DCF Value Conclusion", defaultOrder: 737 },
  { slug: "income-approach.sensitivity-analysis", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Sensitivity Analysis", defaultOrder: 738 },
  { slug: "income-approach.wacc-sensitivity", parentSlug: "valuation-approaches.income-approach", level: 3, title: "WACC Sensitivity", defaultOrder: 739 },
  { slug: "income-approach.long-term-growth-sensitivity", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Long-Term Growth Sensitivity", defaultOrder: 740 },
  { slug: "income-approach.scenario-analysis", parentSlug: "valuation-approaches.income-approach", level: 3, title: "Scenario Analysis", defaultOrder: 741 },

  // Market Approach
  { slug: "valuation-approaches.market-approach", parentSlug: "valuation-approaches", level: 2, title: "Market Approach", defaultOrder: 750 },
  { slug: "market-approach.market-method-selection", parentSlug: "valuation-approaches.market-approach", level: 3, title: "Market Method Selection", defaultOrder: 751 },
  { slug: "market-approach.guideline-transaction-method", parentSlug: "valuation-approaches.market-approach", level: 3, title: "Guideline Transaction Method", defaultOrder: 752 },
  { slug: "market-approach.guideline-public-company-method", parentSlug: "valuation-approaches.market-approach", level: 3, title: "Guideline Public Company Method", defaultOrder: 753 },
  { slug: "market-approach.comparable-selection-criteria", parentSlug: "valuation-approaches.market-approach", level: 3, title: "Comparable Selection Criteria", defaultOrder: 754 },
  { slug: "market-approach.transaction-data", parentSlug: "valuation-approaches.market-approach", level: 3, title: "Transaction Data", defaultOrder: 755 },
  { slug: "market-approach.market-multiples", parentSlug: "valuation-approaches.market-approach", level: 3, title: "Market Multiples", defaultOrder: 756 },
  { slug: "market-approach.mvic-revenue", parentSlug: "valuation-approaches.market-approach", level: 3, title: "MVIC / Revenue", defaultOrder: 757 },
  { slug: "market-approach.mvic-gross-profit", parentSlug: "valuation-approaches.market-approach", level: 3, title: "MVIC / Gross Profit", defaultOrder: 758 },
  { slug: "market-approach.mvic-ebitda", parentSlug: "valuation-approaches.market-approach", level: 3, title: "MVIC / EBITDA", defaultOrder: 759 },
  { slug: "market-approach.mvic-sde", parentSlug: "valuation-approaches.market-approach", level: 3, title: "MVIC / SDE", defaultOrder: 760 },
  { slug: "market-approach.multiple-statistics", parentSlug: "valuation-approaches.market-approach", level: 3, title: "Multiple Statistics", defaultOrder: 761 },
  { slug: "market-approach.selected-multiple-rationale", parentSlug: "valuation-approaches.market-approach", level: 3, title: "Selected Multiple Rationale", defaultOrder: 762 },
  { slug: "market-approach.value-indication", parentSlug: "valuation-approaches.market-approach", level: 3, title: "Market Approach Value Indication", defaultOrder: 763 },
  { slug: "market-approach.weighting", parentSlug: "valuation-approaches.market-approach", level: 3, title: "Market Approach Weighting", defaultOrder: 764 },

  // Asset Approach
  { slug: "valuation-approaches.asset-approach", parentSlug: "valuation-approaches", level: 2, title: "Asset Approach", defaultOrder: 770 },
  { slug: "asset-approach.adjusted-net-asset-value-method", parentSlug: "valuation-approaches.asset-approach", level: 3, title: "Adjusted Net Asset Value Method", defaultOrder: 771 },
  { slug: "asset-approach.fair-market-value-adjustments", parentSlug: "valuation-approaches.asset-approach", level: 3, title: "Fair Market Value Adjustments", defaultOrder: 772 },
  { slug: "asset-approach.conclusion", parentSlug: "valuation-approaches.asset-approach", level: 3, title: "Asset Approach Conclusion", defaultOrder: 773 },
  { slug: "asset-approach.excess-earnings-method", parentSlug: "valuation-approaches.asset-approach", level: 3, title: "Excess Earnings Method", defaultOrder: 774 },

  // ─── Part 8: Discounts, Premiums & Reconciliation ──────────────────────────
  { slug: "discounts-premiums-reconciliation", parentSlug: null, level: 1, title: "Discounts, Premiums & Reconciliation", defaultOrder: 800,
    description: "DLOM, control premium analysis, weighting of approaches, and the final value conclusion." },
  { slug: "discounts-premiums.dlom", parentSlug: "discounts-premiums-reconciliation", level: 2, title: "DLOM", defaultOrder: 810 },
  { slug: "discounts-premiums.dlom.restricted-stock-studies", parentSlug: "discounts-premiums.dlom", level: 3, title: "Restricted Stock Studies", defaultOrder: 811 },
  { slug: "discounts-premiums.dlom.mercer-stout-fmv-opinions", parentSlug: "discounts-premiums.dlom", level: 3, title: "Mercer / Stout / FMV Opinions Support", defaultOrder: 812 },
  { slug: "discounts-premiums.dlom.mandelbaum-factors", parentSlug: "discounts-premiums.dlom", level: 3, title: "Mandelbaum Factors", defaultOrder: 813 },
  { slug: "discounts-premiums.control-marketability-considerations", parentSlug: "discounts-premiums-reconciliation", level: 2, title: "Control / Marketability Considerations", defaultOrder: 820 },
  { slug: "discounts-premiums.reconciliation-of-approaches", parentSlug: "discounts-premiums-reconciliation", level: 2, title: "Reconciliation of Approaches", defaultOrder: 830 },
  { slug: "discounts-premiums.approach-weightings", parentSlug: "discounts-premiums-reconciliation", level: 2, title: "Approach Weightings", defaultOrder: 840 },
  { slug: "discounts-premiums.final-equity-value", parentSlug: "discounts-premiums-reconciliation", level: 2, title: "Final Equity Value", defaultOrder: 850 },
  { slug: "discounts-premiums.final-value-conclusion", parentSlug: "discounts-premiums-reconciliation", level: 2, title: "Final Value Conclusion", defaultOrder: 860 },

  // ─── Part 9: Report Closing ────────────────────────────────────────────────
  { slug: "report-closing", parentSlug: null, level: 1, title: "Report Closing", defaultOrder: 900 },
  { slug: "report-closing.statement-of-disinterest", parentSlug: "report-closing", level: 2, title: "Statement of Disinterest", defaultOrder: 910 },
  { slug: "report-closing.certification", parentSlug: "report-closing", level: 2, title: "Certification", defaultOrder: 920 },
  { slug: "report-closing.sources-works-cited", parentSlug: "report-closing", level: 2, title: "Sources / Works Cited", defaultOrder: 930 },
  { slug: "report-closing.appendix-supporting-schedules", parentSlug: "report-closing", level: 2, title: "Appendix / Supporting Schedules", defaultOrder: 940 },
];
