export interface WaccSection {
  label: string;
  body: string;
}

export interface WaccCard {
  name: string;
  rangeBadge?: string;
  sections: WaccSection[];
}

export const WACC_COMPONENTS: WaccCard[] = [
  {
    name: "Build-Up Method vs. CAPM",
    sections: [
      { label: "CAPM", body: "Ke = Rf + β × ERP + size premium + CSRP. Requires a defensible bottom-up beta from public peers." },
      { label: "Build-Up Method", body: "Ke = Rf + ERP + industry risk premium + size premium + CSRP. No beta required. Used when no reliable peer set exists." },
      { label: "Risk of build-up", body: "Can create a 'CAPM inside a build-up wrapper' if the industry premium already embeds beta-related risk — double counting." },
      { label: "Best practice", body: "Compute both and compare. Wide gap often signals a problem in peer selection, capital structure, size premium choice, or CSRP logic. Always document which you used and why." },
    ],
  },
  {
    name: "Hamada Equation and Bottom-Up Beta",
    sections: [
      { label: "Unlevering", body: "βu = βL / [1 + (1 − t) × (D/E)]" },
      { label: "Re-levering", body: "βL = βu × [1 + (1 − t) × (D/E)]" },
      { label: "Steps", body: "(1) Identify comparable public companies. (2) Obtain each peer's levered beta (2-year weekly or 5-year monthly against S&P 500). (3) Compute each peer's D/E ratio at market value. (4) Unlever each peer beta. (5) Average unlevered betas across the peer set. (6) Re-lever at the subject company's target D/E ratio." },
      { label: "Key decision — which D/E?", body: "Use industry-average D/E or subject's actual D/E? If the company is expected to move toward industry average, use industry average consistently in beta, cost of debt, and WACC weights." },
      { label: "Cash-corrected beta", body: "Damodaran publishes unlevered betas corrected for cash. If you are valuing operating assets and adding cash separately in the bridge, use the cash-corrected beta to avoid diluting operating risk." },
      { label: "Conglomerates / mixed businesses", body: "Weight betas by business segment. Use revenue weights when segment value is unavailable. Revenue weighting is imperfect when segment margins and capital intensity differ materially." },
    ],
  },
  {
    name: "Risk-Free Rate",
    rangeBadge: "Recent: 1.5% → 4.5–5%",
    sections: [
      { label: "Source", body: "US Treasury 20-year yield on or immediately before valuation date (Federal Reserve H.15 release or TreasuryDirect.gov)." },
      { label: "Why 20-year", body: "Matches long investment horizon of a going-concern DCF better than 10-year." },
      { label: "Critical date discipline", body: "Use rate at the EFFECTIVE VALUATION DATE, not today. Rates can differ by 100+ bps." },
      { label: "Current range", body: "Has moved from ~1.5% (2021) to ~4.5–5% range (2024–2025). Document the exact date and rate." },
    ],
  },
  {
    name: "Equity Risk Premium (ERP)",
    rangeBadge: "4.5–6.5% recent range",
    sections: [
      { label: "Source — Kroll / Duff & Phelps", body: "Cost of Capital Navigator publishes annually recommended ERP for professional use." },
      { label: "Source — Damodaran", body: "Publishes historical and implied ERP." },
      { label: "Kroll recommended ERP", body: "Published annually; adjust to the ERP that prevailed at the valuation date, not current ERP. Year-to-year changes can be meaningful." },
      { label: "Supply-side vs. demand-side", body: "Kroll/Duff & Phelps uses a supply-side model. Damodaran provides both. Document which you're using." },
      { label: "Typical range", body: "4.5–6.5% in recent years." },
    ],
  },
  {
    name: "Size Premium",
    rangeBadge: "2–7%+ for small / micro-cap",
    sections: [
      { label: "Source", body: "Duff & Phelps/Kroll CRSP Decile Size Premia (in Cost of Capital Navigator / Valuation Handbook). 10 deciles ranked by market cap. Decile 1 = largest. Decile 10 = smallest. Size premia rise as company size declines." },
      { label: "10th decile breakout", body: "10a ≈ $185M–$322M market cap; 10b ≈ $2.5M–$185M market cap (as of 2018 data). The spread between 10a and 10b can be substantial." },
      { label: "Private company circularity problem", body: "You need market value of equity to assign a decile, but you're trying to find that value. Solution: iterative analysis — estimate value → assign decile → recompute rate → repeat until stable." },
      { label: "Alternative size measures (Kroll Risk Premium Report)", body: "Total assets, revenue, EBITDA, employee count, MVIC. These can be easier to support for private companies than inferred equity market cap." },
      { label: "Critical warning", body: "CRSP Decile 10 includes speculative start-ups and distressed firms. If the subject is small but financially healthy, defaulting to Decile 10 or 10b may OVERSTATE required return and understate value. Consider a higher decile or the Risk Premium Report portfolios instead." },
      { label: "Smoothed vs. unsmoothed", body: "Smoothed (regression-based interpolation) is generally preferred when the subject falls between observed portfolio averages. Reduces cliff effects. Unsmoothed (guideline portfolio) is more vulnerable to discontinuities. Default to smoothed." },
    ],
  },
  {
    name: "Company-Specific Risk Premium (CSRP)",
    rangeBadge: "0–5% total; above 5% needs heavy support",
    sections: [
      { label: "Typical range", body: "0–5% total. Above 5% is defensible only with detailed support." },
      { label: "Document as a factor matrix", body: "Each factor row: name · description · whether already captured elsewhere (size, beta, projections) · incremental premium in bps. A single number pulled from air is not defensible." },
      { label: "Example factors", body: "Customer concentration (top customer = 35% of revenue, partially in CSRP, +0.75%); Key person (founder is 1 relationship manager, not in size/beta, +1.0%); Geographic concentration (single-city operations, not in industry risk, +0.5%); Management depth (one senior team member below CEO, partially captured, +0.5%)." },
      { label: "What courts have rejected", body: "Generic statements like 'the company is small,' 'management is weak,' 'industry is competitive' when those risks are already reflected in size premium, peer betas, or forecast assumptions. The double-counting problem is the central judicial concern (Sunbelt, Hintmann Delaware cases)." },
      { label: "Three-bucket discipline", body: "(1) Risks already in market evidence (beta, ERP) → not in CSRP. (2) Risks already modeled in projections (low growth, margin compression) → not in CSRP. (3) Truly incremental, company-specific risks → CSRP." },
    ],
  },
  {
    name: "Cost of Debt",
    sections: [
      { label: "Actual rate", body: "Use actual loan rate if at market terms. If legacy debt at below-market rates, use current market rate." },
      { label: "Synthetic rating", body: "Interest coverage ratio (EBIT/Interest) → Damodaran's coverage-to-credit-rating table → add credit spread to risk-free rate." },
      { label: "After-tax", body: "Kd × (1 − blended tax rate). This is the WACC input." },
    ],
  },
  {
    name: "Capital Structure",
    sections: [
      { label: "Options", body: "Book value, market value, industry target (Damodaran by industry)." },
      { label: "Private companies", body: "Industry target is most common because market value of equity is being solved for." },
      { label: "Consistency", body: "Use the same capital structure in beta re-levering, cost of debt, and WACC weighting." },
      { label: "Net cash / negative debt", body: "If cash > debt (net cash position), do NOT use negative debt weights in WACC. Instead: value operating assets using an operating-asset WACC, then add excess cash separately in the equity bridge. Damodaran recommends isolating operating assets and adding non-operating cash afterwards." },
    ],
  },
  {
    name: "WACC Formula & Internal Consistency",
    sections: [
      { label: "Formula", body: "WACC = Ke × (E/V) + Kd × (1−t) × (D/V). Where Ke = cost of equity (from CAPM or build-up), Kd = cost of debt (pre-tax), t = blended tax rate, E = equity value (target or market), D = debt value, V = E + D." },
      { label: "Consistency checks", body: "WACC must be consistent with: (1) the beta re-levering assumptions, (2) the long-term growth rate (g < WACC always), (3) the capital structure used in projections, (4) the treatment of excess cash." },
    ],
  },
  {
    name: "Long-Term Growth Rate",
    rangeBadge: "2.0–3.5% for mature US businesses",
    sections: [
      { label: "GDP anchor", body: "CBO projects US real GDP growth ~1.8%/yr (2027–2036) + PCE inflation returning to ~2% → nominal growth ceiling ~3.5–4%." },
      { label: "Defensible range", body: "2.0–3.5% for mature US businesses." },
      { label: "Industry as overlay", body: "Industry faster than GDP → may support high end of range, but cap model is not designed for extraordinary growth (use DCF). Industry slower than GDP → may support below-GDP rate." },
      { label: "Implied perpetuity check", body: "Cap rate (r − g) should imply a multiple (1/cap rate) consistent with GTC multiples. If 1/(WACC−g) = 8× but GTC multiples average 5×, something needs reconsidering." },
    ],
  },
];
