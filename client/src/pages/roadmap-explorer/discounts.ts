export interface DiscountSection {
  label: string;
  body: string;
}

export interface DiscountTopic {
  name: string;
  rangeBadge?: string;
  intro?: string;
  sections: DiscountSection[];
}

export const DISCOUNTS: DiscountTopic[] = [
  {
    name: "DLOM — Discount for Lack of Marketability",
    rangeBadge: "10–25% controlling · 25–45% minority",
    intro:
      "Measures the value reduction when the subject interest is less readily saleable than the marketable value used as the base. DLOM is a level-of-value adjustment — not a generic haircut. It only applies when prior valuation steps produced a marketable value and the subject interest is non-marketable.",
    sections: [
      { label: "Level of value prerequisite", body: "Public company trading multiples → minority marketable. M&A transaction multiples → control marketable. A restricted stock study DLOM naturally adjusts from marketable minority to non-marketable minority. If your starting point is control marketable, DLOC comes first, then DLOM." },

      { label: "Restricted stock — Silber (1991)", body: "69 transactions, 1981–1988. Mean discount ~33.8%. Key finding: discount varies systematically by issuer characteristics. Larger companies, better cash flow, stronger market profile → lower DLOM. Larger restricted blocks, weaker issuers → higher DLOM. Introduced regression framework linking DLOM to observable variables." },
      { label: "Restricted stock — Moroney", body: "Mean ~35.6%. Reflects older 2-year restriction periods. Wide range — poor standalone support without additional comparability analysis." },
      { label: "Restricted stock — Maher", body: "Mean ~35.4%. Same era as Moroney, same limitations." },
      { label: "Restricted stock — FMV Opinions / Stout", body: "230 transactions. Mean 22.3%, median 20.1%. Lower-DLOM factors: profitable, dividend-paying, larger placement, registration rights, higher trading volume, stronger balance sheet. Higher-DLOM factors: small company, lower-priced stock, weak equity cap, large block relative to trading market. Modern Stout database allows transaction-level filtering — use it rather than averages." },
      { label: "Restricted stock — MPI", body: "Management Planning Inc., 1980–1996. Mean 27.1%. Post-2000 data ~14.6% (attributed to SEC shortening Rule 144 holding periods). Shows how restriction period duration affects DLOM materially." },
      { label: "Modern standard", body: "Do NOT use study averages in isolation. 'Get behind the data' — compare the subject interest to the specific transaction characteristics that drove variation in the studies. Characterize the subject on: size, profitability, dividends, block size relative to market, registration rights, trading volume, restriction period." },

      { label: "Pre-IPO — Emory", body: "1980–2000 compilation. Mean ~46%, median ~47%. Widely cited but heavily criticized." },
      { label: "Pre-IPO — Willamette", body: "Broadly similar range; different selection criteria." },
      { label: "Pre-IPO — Valuation Advisors", body: "Large database, filterable by time to IPO. Useful for anchoring DLOM to a hypothesized liquidity horizon." },
      { label: "Why pre-IPO studies are problematic", body: "(1) Survivorship bias — only successful IPOs included; failed companies excluded, inflating apparent discount. (2) Value creation bias — company may be fundamentally different (larger, more profitable) at IPO than at the pre-IPO transaction date. (3) IPO underpricing — if IPO shares are themselves underpriced vs. aftermarket, the calculated pre-IPO discount is exaggerated. (4) IRS Job Aid is explicitly skeptical of pre-IPO studies as primary DLOM support." },

      { label: "Option model — Longstaff", body: "Treats marketability as value of a lookback option (ability to sell at highest price during restriction period). Key inputs: volatility, restriction period. Criticism: assumes perfect market timing → produces upper-bound estimate. Use as a ceiling, not a central estimate." },
      { label: "Option model — Finnerty average-strike put", body: "Uses average-strike put framework. Formula: DLOM = 1 − 2·N(−σ·√T / 2). More realistic than Longstaff. But capped at ~32.3% regardless of how extreme the inputs. Can understate DLOM in very illiquid, high-risk situations. Note: Finnerty has a later revised version — identify which you're using." },
      { label: "Option model — Asian puts", body: "Similar to Finnerty. Distinction from Finnerty relates to measurement convention (average vs. current price). Main criticism: all option models reduce marketability to volatility + time; real DLOM also depends on transfer restrictions, buyer universe, info rights, transaction costs." },

      { label: "Mandelbaum v. Commissioner (T.C. Memo 1995-255)", body: "Facts: gift tax valuation of Big M, Inc. (private family-owned retailer). Parties stipulated freely traded values; court decided only the DLOM. Holding: 30% marketability discount applied on all relevant valuation dates." },
      { label: "The Mandelbaum 9 factors", body: "(1) Private vs. public sales of comparable stock. (2) Financial statement analysis. (3) Dividend/distribution history and capacity. (4) Nature and outlook of company and industry. (5) Management depth and quality. (6) Degree of control in the transferred shares. (7) Transfer restrictions (charter, agreement, law). (8) Holding period / prospects for liquidity event. (9) Cost of a public offering / flotation costs." },
      { label: "Mandelbaum caution", body: "Some factors overlap with the base value analysis (e.g., financial performance, management quality may already be reflected in multiples). Explain why applying these factors does not double-count company risk already embedded in the pre-DLOM value." },

      { label: "Triangulation (best practice)", body: "(1) Empirical restricted stock evidence (Stout/FMV transaction database, filtered for subject characteristics). (2) One or more option models as reasonableness bounds. (3) Qualitative Mandelbaum factor analysis tied to specific facts. Controlling interests warrant lower DLOM than minority interests — typically 10–20% vs. 25–45% for minority." },

      { label: "Typical ranges", body: "Non-marketable minority interest in small private company: 25–45%. Non-marketable controlling interest: 10–20%. Interest with put right or registration rights: lower end. Interest with severe transfer restrictions, no distributions, long expected hold: higher end." },
    ],
  },

  {
    name: "DLOC — Discount for Lack of Control",
    rangeBadge: "20–35% typical (inverse of control premium)",
    intro:
      "Applied when valuation methods produce control-level value but the subject interest is a minority block lacking governance rights. Always understand which level of value your methods produced before applying DLOC.",
    sections: [
      { label: "Traditional 3-level model", body: "Control Marketable (top) · Marketable Minority (middle — the 'as-if-freely-traded' benchmark; analogous to public market trading) · Non-Marketable Minority (bottom)." },
      { label: "Modern 4-level model", body: "Adds Strategic Control Value above Financial Control — reflects synergies available to strategic buyers, not just governance rights. Observed public acquisition premiums often reflect strategic value. Do NOT automatically apply a strategic-control premium to a private-company standalone valuation." },
      { label: "How methods map to levels", body: "GPC (public trading multiples) → Minority Marketable. GTC (private M&A transactions) → Control Marketable (typically). Income approach (normalized cash flows with discretionary adjustments) → Control Marketable (typically)." },
      { label: "Mathematical relationship", body: "DLOC = 1 − (1 / (1 + CP)) where CP = control premium. Examples: 25% CP → 20% DLOC; 30% CP → 23.1% DLOC; 40% CP → 28.6% DLOC. Intuition: a 25% premium is measured upward from $100 minority = $125 control. DLOC = $25/$125 = 20%, not 25%." },
      { label: "FactSet Mergerstat / BVR Control Premium Study", body: "Leading empirical source. Covers acquisitions of 50.01%+ of public companies. Updated quarterly. Filter by industry, time period, buyer type. Focus on closed deals." },
      { label: "Mergerstat Review", body: "Annual publication with broader deal set (includes announced + closed). ValuSource/NACVA offer Excel-exportable databases." },
      { label: "Typical control premium range", body: "Historical median control premiums ~27–45% (NACVA). Mean 35–60% (influenced by outliers). Practical working range often cited as 25–40%." },
      { label: "Strategic vs. financial buyer", body: "Strategic buyers average ~41.9% premium vs. ~34.2% for financial buyers (FactSet/Mergerstat data). If subject would only attract financial buyers, use financial-buyer premium range." },
      { label: "Critical caution", body: "Observed takeover premiums embed strategic synergies, auction pressure, and acquirer-specific factors. A blanket all-industry control premium → DLOC conversion for a private company minority interest can overstate the adjustment. Filter empirically and document why the selected premium applies to your subject. Negative premiums exist in the data — screen for comparability." },
      { label: "Order with DLOM", body: "DLOC first, then DLOM, multiplicatively. Example: $1,000 control × (1 − 23.1% DLOC) × (1 − 30% DLOM) = $1,000 × 0.769 × 0.70 = $538. Combined discount = 46.2%, NOT 23.1% + 30% = 53.1%." },
      { label: "When DLOC does NOT apply", body: "If your method already produces minority-level value (e.g., GPC trading multiples → don't also apply DLOC). If the interest has meaningful governance protections (veto rights, drag-along, board seat) that increase effective control." },
    ],
  },

  {
    name: "Control Premium",
    rangeBadge: "25–40% practical working range",
    sections: [
      { label: "Range", body: "25–40% is the practical working range; mean observations can be higher due to outliers and strategic value." },
      { label: "Sources", body: "FactSet Mergerstat/BVR Control Premium Study (closed deals), Mergerstat Review." },
      { label: "Filters", body: "Industry, buyer type (strategic vs. financial), time period, deal size." },
      { label: "Caution", body: "Mean values overstate typical premiums because of outlier strategic deals. Median is more robust. And even median industry premiums may embed strategic synergies irrelevant to a standalone private-company valuation." },
    ],
  },

  {
    name: "Key Person Discount",
    rangeBadge: "5–25% — fact-specific",
    intro:
      "A reduction in value reflecting the risk that a critical individual's departure (death, disability, resignation) would materially impair earnings, growth, or transferability.",
    sections: [
      { label: "Factors that INCREASE risk", body: "Customer or supplier relationships are personal, not institutional · Key person owns proprietary knowledge, formulas, or creative capacity not documented · Key person is the primary salesperson for a significant portion of revenue · No succession plan exists · Management depth is thin — no one can step into the role." },
      { label: "Factors that REDUCE or ELIMINATE risk", body: "Management team capable of running the business independently · Customer relationships are institutional (multi-contact, long-term contracts, corporate accounts) · Documented processes, SOPs, and systems · Key person has a non-compete and/or employment agreement in place · Key man life insurance covers the exposure." },
      { label: "Method 1 — Explicit discount", body: "Apply % reduction to concluded value. Most common in practice. Range cited: 5–25%. Must be supported by specific facts — not boilerplate. Tax Court has accepted 10% in cases like Estate of Mitchell and Estate of Yeager where facts supported it." },
      { label: "Method 2 — Discount/cap rate adjustment (CSRP)", body: "Increase discount rate or capitalization rate through company-specific risk premium. Key pitfall: a '20% key person discount' added to a 20% discount rate does NOT reduce value by 20% — it can cut value by 50% (McKonly & Asbury example). The math is not intuitive." },
      { label: "Method 3 — Income differential (most rigorous)", body: "(1) Establish normalized earnings with key person in place. (2) Estimate earnings without key person — model revenue attrition, margin compression, higher replacement costs, recruiting, training loss. (3) Define recovery period (how long until a replacement is effective). (4) Discount the lost earnings stream and compute as % of baseline value." },
      { label: "Choose ONE mechanism", body: "Do not layer all three approaches. Pick the mechanism that best fits the facts and document where the risk is captured." },
      { label: "Key man life insurance as cross-check", body: "Sizing methods: (1) Salary multiple — typically 5–10× annual compensation, ~7× as common rule of thumb. (2) Replacement cost — recruiting + relocation + training + ramp-period lost income. (3) Contribution to earnings — % of profit attributable to key person × replacement/recovery period. Limitation: insurance amounts may be constrained by affordability, not full economic exposure. Use as a floor or corroborating data point." },
      { label: "Avoid double-counting", body: "If you increased the discount rate for key person risk in CSRP, do NOT also apply a separate key person discount to the concluded value. Document clearly where the risk is captured." },
    ],
  },

  {
    name: "Customer Concentration Discount / CSRP Component",
    rangeBadge: "Often embedded in CSRP (0–2%)",
    sections: [
      { label: "Embedded vs. standalone", body: "Not always a separate discount — often embedded in CSRP." },
      { label: "Thresholds", body: "If >40% of revenue from one customer: explicitly assess probability of loss and model the earnings impact. If top-3 customers = >60% of revenue: document separately, consider whether GTC comps reflect similar concentration." },
      { label: "Diligence questions", body: "Are there written contracts? What are the renewal terms? Is there a personal relationship with the owner vs. an institutional relationship with the company?" },
    ],
  },

  {
    name: "Normalization Adjustments (overview)",
    rangeBadge: "Pre-valuation step",
    sections: [
      { label: "Five categories", body: "(1) Owner/officer compensation to market rate. (2) Related-party rent to market rate. (3) Personal expenses through the business. (4) Non-recurring items (PPP, ERTC, one-time gains/losses). (5) Discretionary items (charitable contributions, excess bonuses)." },
      { label: "Standard for each adjustment", body: "Must have a source, an amount, and a documented rationale. See the Normalization tab for full detail." },
    ],
  },
];
