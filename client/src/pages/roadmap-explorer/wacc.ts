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
      { label: "Synthetic rating (preferred for unrated private cos.)", body: "When the subject has no traded bonds and no agency rating, you cannot observe a market yield, so infer it. Damodaran's two alternatives: (1) infer the spread from recent debt the company placed, or (2) estimate a synthetic rating from financial characteristics — most commonly the interest coverage ratio. Synthetic rating is widely used because it is systematic, transparent, and ties cost of debt to the subject's ability to service debt rather than to stale contractual rates." },
      { label: "Synthetic rating mechanics", body: "Step 1: interest coverage ratio = EBIT / interest expense. Step 2: map the ratio to a synthetic bond rating and default spread using Damodaran's published table. Step 3: pre-tax Kd = risk-free rate (same currency) + default spread. Step 4: after-tax Kd = pre-tax × (1 − marginal tax rate). This is the WACC input." },
      { label: "Damodaran spread table (Jan 2026)", body: "Adding the default spread to Rf yields a pre-tax borrowing cost. For large non-financial firms: coverage 3.0x–4.25x → A3/A-, ~0.89% spread; 2.5x–3.0x → Baa2/BBB, ~1.11% spread. Distressed coverage produces sharply higher spreads — ~5.09% for 1.25x–1.5x and ~8.85% for 0.8x–1.25x." },
      { label: "Use the SMALL-firm table for private cos.", body: "Damodaran publishes a SEPARATE coverage→rating table for smaller firms, which warrant weaker ratings and wider spreads at a given coverage level than large-cap issuers. Defaulting to the large-company schedule for a typical middle-market private business UNDERSTATES default risk and artificially depresses WACC. Evaluate whether the subject is better represented by the small-company version — do not pick the large table just because it is familiar." },
      { label: "Practical adjustments & limitations", body: "Do not apply mechanically. A cyclically distorted EBIT or interest expense can produce an implausible one-year rating — normalize EBIT or use trailing averages. Many private companies carry little or no third-party debt, making current interest expense an incomplete indicator; in that case estimate Kd consistent with the TARGET leverage used in WACC, not the historical borrowing pattern — especially when the subject is underlevered vs. peers or a control buyer would relever after acquisition." },
    ],
  },
  {
    name: "Capital Structure",
    sections: [
      { label: "Options", body: "Book value, market value, industry target (Damodaran by industry)." },
      { label: "Private companies", body: "Industry target is most common because market value of equity is being solved for." },
      { label: "Consistency", body: "Use the same capital structure in beta re-levering, cost of debt, and WACC weighting." },
      { label: "Selection is NOT mechanical — depends on the interest", body: "The right structure depends on the level of value and the owner's rights. For a CONTROLLING interest under fair market value, use the optimal/target structure a hypothetical market participant could implement (a control owner can change financing). For a MINORITY/noncontrolling interest, the company's ACTUAL structure is customary because the holder cannot change leverage (CSH, Santora, BVA Group). Management's stated target may be appropriate when current leverage is only temporarily off course." },
      { label: "Industry averages — common but imperfect", body: "Industry-average structures are widely used because private-company leverage is often idiosyncratic; Financial Edge lists determining capital structure as a distinct WACC step and suggests estimating debt/equity proportions from comparables. But BVA Group warns against relying solely on public guideline companies — test whether the subject could realistically ACHIEVE that leverage. If a private company could only borrow to peer leverage via owner personal guarantees, that incremental debt capacity may belong to the owner, not the business enterprise, and should be excluded." },
      { label: "Optimal ≠ industry median (market participant)", body: "BVA Group: the likely buyer universe matters. If the relevant market participants are private equity, their target leverage may far exceed public norms — a cited survey indicates ~60% debt or ~4.0 turns of EBITDA. A higher debt weight may better reflect market-participant assumptions even if it does not match the median public balance sheet. Reasonableness test: borrowing capacity by asset type (working capital and fixed assets support more debt than goodwill/intangibles), conceptually similar to a WARA framework." },
      { label: "Net cash / negative debt", body: "If cash > debt (net cash position), do NOT use negative debt weights in WACC. Instead: value operating assets using an operating-asset WACC, then add excess cash separately in the equity bridge. Damodaran recommends isolating operating assets and adding non-operating cash afterwards." },
    ],
  },
  {
    name: "S-Corp / Pass-Through Tax Adjustment",
    rangeBadge: "Post-TCJA premium often ~0–9%",
    sections: [
      { label: "The controversy", body: "Pass-through entities (S corps) pay no entity-level federal tax — income passes to owners. Market multiples and discount rates are largely derived from C-corp data, raising the question: when valuing a pass-through, should you apply a hypothetical entity-level tax to cash flows (tax-affecting), and then separately add any pass-through benefit? The IRS S Corporation Valuation Job Aid frames this as fact-and-circumstances dependent." },
      { label: "Legal evolution", body: "Earlier cases (Gross) generally rejected tax-affecting; later cases became more receptive. In Cecil v. Commissioner the Tax Court upheld tax-affecting to determine S-corp share value for gift tax purposes (PwC). Commentaries on Kress and Jones note courts accepting tax-affecting and treating S-corp status as neutral or case-specific rather than as an automatic premium." },
      { label: "Van Vleet SEAM", body: "The S Corporation Economic Adjustment Model first values the company as if it were a C corporation, then calculates an adjustment to an S-corp-equivalent value based on the differential tax economics borne by shareholders (corporate taxes, shareholder taxes, dividend taxation, capital appreciation). Influential in literature and court commentary." },
      { label: "Treharne", body: "Focuses on the investor's allocable cash flows — explicitly modeling the PV of retained cash flow, net cash flow to the investor, double-taxation effects, and tax-rate differentials. QuickRead notes Treharne is the only major model that differentiates value by the amount of cash actually DISTRIBUTED to the shareholder, since the pass-through advantage is partly a function of whether owners receive distributions sufficient to realize the benefit. Limitations: assumes retained cash accumulates without reinvestment return and may not capture value-accretive reinvestment." },
      { label: "TCJA shrank the premium", body: "After TCJA cut the federal corporate rate to 21%, the SEAM-implied pass-through premium narrowed sharply. Weaver notes the implied premium shrank significantly; QuickRead reports Van Vleet showed increases over C-corp-equivalent value of only ~5–9% for some qualifying non-service businesses, and possibly negligible for service businesses. Do not assume pre-TCJA discussions of large S-corp premiums still apply in 2026." },
      { label: "Modern practical view", body: "Hitchner/Weissinger consensus (per QuickRead): there is no broad, automatic S-corp premium today. Framework: (1) value the entity on a TAX-AFFECTED basis using market-derived return data (which originates largely in a C-corp environment); (2) assess whether the specific facts justify an upward equity adjustment, using SEAM or Treharne only if warranted; (3) do not treat S-corp status as an automatic enterprise-level premium without demonstrating how the hypothetical buyer of the interest actually realizes the benefit. Any premium is a matter requiring proof, not a default. Related: ESOP method card (S-corp ESOP tax benefit)." },
    ],
  },
  {
    name: "Distressed Company Discount Rate",
    sections: [
      { label: "Why standard WACC breaks down", body: "For a financially distressed company, a single static WACC and a going-concern perpetuity can misstate value because the capital structure is shifting, the probability of failure is material, and tax shields are uncertain. The discount-rate problem becomes inseparable from the scenario/probability problem." },
      { label: "Adjusted Present Value (APV)", body: "APV separates the value of the unlevered business from the value of financing effects. Value = PV of unlevered FCF at the unlevered cost of capital + PV of tax shields and other financing side effects (less expected costs of financial distress). APV is more defensible than WACC when leverage is changing rapidly or the tax shield is uncertain, because it does not assume a constant debt ratio embedded in a single WACC." },
      { label: "Scenario-weighted enterprise value", body: "Model distinct outcomes — e.g., successful turnaround/going concern, sideways survival, and liquidation/failure — value each independently (going-concern income approach for survival scenarios, ANAV/liquidation value for the failure scenario), and probability-weight them. This mirrors the First Chicago logic and captures the bimodal payoff distress creates." },
      { label: "Avoid double-counting distress risk", body: "Decide where distress risk lives: in the SCENARIO PROBABILITIES or in the DISCOUNT RATE — not both. Using heavily distressed scenario probabilities AND an extreme distress-loaded discount rate within each scenario double-counts the same risk and understates value. This is the same discipline as the First Chicago / key-person double-counting warnings." },
      { label: "Tie to cost of debt", body: "Distress shows up directly in the synthetic rating: very low interest coverage maps to Damodaran's widest spreads (e.g., ~5–9% for sub-1.5x coverage), which raises cost of debt and signals elevated default risk. Reconcile the chosen scenario probabilities with the spread the coverage ratio implies." },
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
