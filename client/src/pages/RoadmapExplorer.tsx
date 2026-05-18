import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";

// ─── Content data ───────────────────────────────────────────────────────────

interface Scenario {
  name: string;
  description: string;
  recommended: string[];
  watchOuts: string[];
  borderColor: string;
  category: "income" | "market" | "asset" | "venture";
}

const SCENARIOS: Scenario[] = [
  {
    name: "Mature, profitable private company (stable earnings)",
    description: "Predictable earnings stream, established business with consistent margins.",
    recommended: [
      "Capitalization of Earnings (primary) — ideal for stable, predictable earnings.",
      "Guideline Transaction Method (GTC) (secondary) — provides market evidence.",
    ],
    watchOuts: [
      "Don't over-project growth.",
      "Verify normalized earnings are truly representative of future performance.",
    ],
    borderColor: "border-l-blue-500",
    category: "income",
  },
  {
    name: "High-growth private company / startup",
    description: "Rapidly growing business with non-linear cash flow patterns.",
    recommended: [
      "DCF with multiple scenarios.",
      "Berkus / Scorecard / VC Method if pre-revenue.",
    ],
    watchOuts: [
      "Projections must be anchored in evidence.",
      "Terminal value dominates — be conservative with the growth rate.",
    ],
    borderColor: "border-l-blue-500",
    category: "income",
  },
  {
    name: "Legacy / owner-dependent business",
    description: "Long-tenured business where one or two individuals drive value.",
    recommended: [
      "Cap of Earnings with elevated CSRP.",
      "Consider a key person discount.",
    ],
    watchOuts: [
      "Normalize owner comp heavily.",
      "Assess what happens to the business without the owner.",
      "GTC comps may not exist for this size and dependency profile.",
    ],
    borderColor: "border-l-blue-500",
    category: "income",
  },
  {
    name: "Minority interest (20–49%)",
    description: "Non-controlling equity stake with limited governance rights.",
    recommended: [
      "Going-concern approach (income or market) first.",
      "Then apply DLOC and DLOM.",
    ],
    watchOuts: [
      "Don't apply DLOC if method already produces a minority-level value.",
      "Document whether the interest has any control attributes (board seat, veto, etc).",
    ],
    borderColor: "border-l-green-500",
    category: "market",
  },
  {
    name: "Controlling interest (51–100%)",
    description: "Majority equity stake with effective control over operations and dividends.",
    recommended: [
      "Income and/or Market approach at the control level.",
      "No DLOC.",
    ],
    watchOuts: [
      "May still need DLOM if not marketable (non-marketable controlling interest).",
      "Distinguish between marketable controlling and non-marketable controlling.",
    ],
    borderColor: "border-l-green-500",
    category: "market",
  },
  {
    name: "Company with inconsistent / cyclical earnings",
    description: "Earnings swing materially year over year due to industry, project mix, or one-offs.",
    recommended: [
      "Weighted average normalized earnings (weight recent years higher).",
      "Or DCF with scenario analysis.",
    ],
    watchOuts: [
      "Do not simply use the most recent year.",
      "Document why the weighting is appropriate.",
    ],
    borderColor: "border-l-blue-500",
    category: "income",
  },
  {
    name: "Asset-heavy / holding company",
    description: "Real estate, investment portfolio, or pure holding company with little goodwill.",
    recommended: [
      "Asset approach (ANAV) as primary.",
      "Income approach as secondary.",
    ],
    watchOuts: [
      "Do not ignore intangibles.",
      "Get independent appraisals for real property and significant equipment.",
    ],
    borderColor: "border-l-amber-500",
    category: "asset",
  },
  {
    name: "Company with excess cash or non-operating assets",
    description: "Balance sheet has cash, securities, or real estate beyond operating needs.",
    recommended: [
      "Separate operating company value from non-operating assets.",
      "Add the two together at the equity bridge.",
    ],
    watchOuts: [
      "Define 'excess' carefully — working capital requirement must be documented.",
      "Non-operating real estate requires a separate appraisal.",
    ],
    borderColor: "border-l-amber-500",
    category: "asset",
  },
  {
    name: "Company with significant related-party expenses",
    description: "Owner-driven business with non-arm's-length rents, mgmt fees, or compensation.",
    recommended: [
      "Normalize aggressively before any income or market approach.",
    ],
    watchOuts: [
      "Management may resist adjustments.",
      "Each adjustment requires a market-rate benchmark with a source.",
    ],
    borderColor: "border-l-blue-500",
    category: "income",
  },
  {
    name: "Pre-revenue or early-stage startup",
    description: "No revenue history yet; valuation rests on team, product, and market assumptions.",
    recommended: [
      "Berkus Method.",
      "Scorecard Method.",
      "VC / First Chicago Method.",
    ],
    watchOuts: [
      "Income approach is not supportable without revenue history.",
      "Valuations are highly speculative and must be clearly disclosed.",
    ],
    borderColor: "border-l-purple-500",
    category: "venture",
  },
];

interface MethodCard {
  group: string;
  name: string;
  what: string;
  whenToUse: string;
  whenNotToUse: string;
  keyInputs: string;
  keyRisks?: string;
  tip?: string;
}

const METHODS: MethodCard[] = [
  // Income Approach
  {
    group: "Income Approach",
    name: "DCF (FCFF)",
    what: "Projects free cash flows to the firm and discounts at WACC.",
    whenToUse: "Uneven growth, capital-intensive business, projections are well-supported.",
    whenNotToUse: "Stable earnings where cap of earnings is simpler and equally supportable.",
    keyInputs: "Revenue/expense projections, CAPEX, working capital changes, WACC.",
    keyRisks: "Terminal value sensitivity, projection bias.",
    tip: "Stress test your WACC ±1% and your terminal growth ±0.5% — if the range is too wide, your inputs need more support.",
  },
  {
    group: "Income Approach",
    name: "DCF (FCFE)",
    what: "Projects free cash flows to equity holders and discounts at cost of equity.",
    whenToUse: "Stable capital structure, financial services firms.",
    whenNotToUse: "When capital structure is complex or changing.",
    keyInputs: "Net income, CAPEX, debt changes, cost of equity.",
    tip: "FCFE is mathematically equivalent to FCFF/WACC if done correctly — use it as a cross-check.",
  },
  {
    group: "Income Approach",
    name: "Capitalization of Earnings / Cash Flow",
    what: "Divides a single normalized earnings figure by a cap rate (= discount rate − long-term growth rate).",
    whenToUse: "Stable, mature business with predictable earnings.",
    whenNotToUse: "High-growth, pre-revenue, or highly cyclical businesses.",
    keyInputs: "Normalized earnings base, discount rate, long-term growth rate.",
    keyRisks: "Cap rate is very sensitive to both components — a 1% change in either shifts value by 15–25%.",
    tip: "Verify your cap rate implicitly — if it implies a P/E that looks unreasonable versus the industry, reconsider your inputs.",
  },
  {
    group: "Income Approach",
    name: "Excess Earnings Method",
    what: "Hybrid method that separates returns on tangible assets from goodwill. Capitalizes 'excess earnings' to value intangibles.",
    whenToUse: "Professional service firms (medical practices, law firms, accounting firms); any engagement where goodwill quantification is required.",
    whenNotToUse: "Manufacturing or asset-heavy companies where tangible assets dominate.",
    keyInputs: "Tangible asset FMV, fair return on tangible assets, normalized earnings, cap rate.",
    tip: "The choice of return rate on tangible assets is highly contested — use a rate that reflects the risk of those assets specifically, not the overall company risk.",
  },
  // Market Approach
  {
    group: "Market Approach",
    name: "Guideline Transaction Method (GTC)",
    what: "Derives value from multiples observed in actual M&A transactions of comparable private companies (DealStats, Pratt's Stats).",
    whenToUse: "Control interest valuations where private transaction data exists.",
    whenNotToUse: "Companies so unique that no comparable transactions exist; very small companies (< $500K revenue) where data is sparse.",
    keyInputs: "Transaction multiples (EV/EBITDA, EV/Revenue, EV/SDE), TTM financials of subject.",
    keyRisks: "Transaction data quality; older transactions may not reflect current market.",
    tip: "Always verify the transaction data quality — DealStats entries vary in reliability. Check whether the multiple is enterprise or equity.",
  },
  {
    group: "Market Approach",
    name: "Guideline Public Company Method (GPC)",
    what: "Derives value from multiples of publicly traded comparable companies (Capital IQ, Bloomberg).",
    whenToUse: "Larger private companies; when public comps are abundant and similar.",
    whenNotToUse: "Small businesses where public companies are fundamentally different in size and risk profile.",
    keyInputs: "Public company multiples (EV/EBITDA, EV/Revenue, P/E), subject financials.",
    keyRisks: "Size adjustment needed; liquidity differences.",
    tip: "Apply a control premium if valuing a controlling interest from a minority-marketable base, and then DLOM if non-marketable. The order of adjustments matters.",
  },
  {
    group: "Market Approach",
    name: "Rules of Thumb",
    what: "Industry-specific multiples (e.g., 1× revenue for accounting firms, 0.5× revenue for auto repair).",
    whenToUse: "As a sanity check only.",
    whenNotToUse: "Never as a primary method.",
    keyInputs: "Industry rule-of-thumb multiple, subject revenue/earnings.",
    keyRisks: "Rules of thumb reflect broad averages and ignore company-specific factors entirely.",
    tip: "If your conclusion is wildly outside the rule of thumb for the industry, understand why before concluding.",
  },
  // Asset Approach
  {
    group: "Asset Approach",
    name: "Adjusted Net Asset Value (ANAV)",
    what: "Adjusts each balance sheet asset and liability to FMV and computes net equity.",
    whenToUse: "Holding companies, real estate entities, investment companies, distressed businesses.",
    whenNotToUse: "Operating companies with significant unrecognized goodwill (ANAV would severely understate value).",
    keyInputs: "FMV of each asset class (AR, inventory, PP&E, intangibles), FMV of liabilities.",
    tip: "ANAV is almost always the floor for a going-concern company — if your income approach is below ANAV, something is wrong.",
  },
  {
    group: "Asset Approach",
    name: "Liquidation Value (Orderly / Forced)",
    what: "Estimates proceeds from selling assets in an orderly (12-18 months) or forced (immediate) sale.",
    whenToUse: "Distressed, insolvency, or bankruptcy contexts.",
    whenNotToUse: "Going-concern businesses.",
    keyInputs: "Orderly vs. forced sale prices for each asset class; wind-down costs.",
    tip: "Orderly liquidation always exceeds forced liquidation. Document your assumed timeline clearly.",
  },
  {
    group: "Asset Approach",
    name: "Excess Earnings (as asset approach variant)",
    what: "When goodwill must be explicitly valued as a balance sheet item (e.g., for purchase price allocation support).",
    whenToUse: "Purchase price allocation; when goodwill must appear as a separately quantified asset.",
    whenNotToUse: "Going-concern conclusions where goodwill doesn't need explicit isolation.",
    keyInputs: "Tangible asset FMV, fair return on tangible assets, normalized earnings, cap rate.",
    tip: "Uses the same mechanics described in the Income Approach Excess Earnings card.",
  },
  // Venture
  {
    group: "Venture / Startup Methods",
    name: "Berkus Method",
    what: "Assigns up to $500K (or $1M in some versions) of value to each of 5 qualitative factors: (1) Sound idea, (2) Prototype, (3) Quality management team, (4) Strategic relationships, (5) Product rollout or sales. Max value typically $2–2.5M.",
    whenToUse: "Pre-revenue startups with a demonstrable concept.",
    whenNotToUse: "Post-revenue startups where DCF or VC Method is more appropriate.",
    keyInputs: "Qualitative scores on the 5 Berkus factors.",
    keyRisks: "Highly subjective; requires detailed documentation.",
  },
  {
    group: "Venture / Startup Methods",
    name: "Scorecard Method",
    what: "Benchmarks the startup against an average pre-money valuation for similar companies in the region/stage, then adjusts up or down based on weighted qualitative factors (team 30%, market 25%, product 15%, competition 10%, marketing 10%, other 10%).",
    whenToUse: "Pre-revenue angel-stage companies.",
    whenNotToUse: "Mature startups with revenue.",
    keyInputs: "Regional pre-money benchmark, qualitative factor scores.",
    tip: "The average pre-money benchmark itself requires research — AngelList, PitchBook, or regional angel data.",
  },
  {
    group: "Venture / Startup Methods",
    name: "VC Method / First Chicago",
    what: "Estimates future exit value (typically 5-year revenue × exit multiple), discounts back to present at a required VC rate of return (often 30–70%). First Chicago variant uses probability-weighted scenarios (success/sideways/failure).",
    whenToUse: "Post-revenue startups; when an exit event is foreseeable.",
    whenNotToUse: "Pre-revenue without any traction signal.",
    keyInputs: "Projected revenue at exit, exit multiple (EV/Revenue), required rate of return.",
  },
  {
    group: "Venture / Startup Methods",
    name: "Risk Factor Summation",
    what: "Adjusts a base value (often from Berkus or regional averages) by ±$250K for each of 12 risk factors: management, stage, legislation, manufacturing, sales, funding, competition, technology, litigation, international, reputation, and potential lucrative exit.",
    whenToUse: "Pre-revenue; when multiple risk dimensions need explicit scoring.",
    whenNotToUse: "When a single dominant risk overwhelms the multi-factor framework.",
    keyInputs: "Base value, 12 risk factor scores.",
  },
];

interface DiscountCard {
  name: string;
  range: string;
  body: string;
}

const DISCOUNTS: DiscountCard[] = [
  {
    name: "DLOM (Discount for Lack of Marketability)",
    range: "10–25% for non-marketable controlling; 25–45% for minority.",
    body:
      "Methods: Restricted stock studies (pre-IPO studies show discounts of 25–45% historically; restricted stock studies show 20–35%), Longstaff option model, Finnerty average-strike put model, Mandelbaum 9 factors. Key factors that INCREASE DLOM: small company size, no dividend history, no put right, transfer restrictions, poor financial condition.",
  },
  {
    name: "DLOC (Discount for Lack of Control)",
    range: "20–35% (inverse of control premium).",
    body:
      "Derived as the inverse of the control premium (if control premium = 33%, DLOC = 1 − 1/1.33 = 25%). Apply when using enterprise-level multiples and valuing a minority interest. Do NOT apply if method already produces a minority-level value.",
  },
  {
    name: "Control Premium",
    range: "25–40% above minority marketable value.",
    body:
      "Source: Mergerstat/BVR Control Premium Study. The control premium and DLOC are inverses of each other. Used when building up from a minority marketable value to a control value.",
  },
  {
    name: "Key Person Discount",
    range: "0–20%.",
    body:
      "Factors: Does the business depend on one individual? Is there a management team? Is there life insurance in place? Would clients follow the key person if they left? Higher discount for more dependency.",
  },
  {
    name: "Customer Concentration Discount",
    range: "Often embedded in CSRP (0–2%) rather than separate.",
    body:
      "If >40% of revenue comes from one customer, this warrants explicit attention. Loss of that customer could impair value by 30–50%. May be addressed via a higher CSRP rather than as a stand-alone discount.",
  },
  {
    name: "Normalization Adjustments",
    range: "Not a discount — a pre-valuation step.",
    body:
      "Categories: (1) Owner/officer comp to market rate; (2) Related-party rent to market rate; (3) Personal expenses through business; (4) Non-recurring items (PPP, ERTC, one-time gains/losses); (5) Discretionary items (charitable contributions, personal travel). Each adjustment must have a source and rationale.",
  },
];

interface WaccCard {
  name: string;
  source: string;
  range: string;
  note?: string;
}

const WACC_COMPONENTS: WaccCard[] = [
  {
    name: "Risk-Free Rate",
    source: "US Treasury 20-year yield as of valuation date.",
    range: "Typical recent range: 3–5%.",
    note: "Use the rate on the effective date, not today's rate.",
  },
  {
    name: "Equity Risk Premium (ERP)",
    source: "Duff & Phelps / Kroll Cost of Capital Navigator, Damodaran (historical or implied).",
    range: "Typical: 4.5–6.5%.",
    note: "Duff & Phelps publishes a recommended ERP annually.",
  },
  {
    name: "Beta",
    source: "Damodaran's industry beta table (unlevered betas by sector).",
    range: "Typical: 0.7–1.5 unlevered; higher levered.",
    note: "Must be re-levered for subject company's capital structure using the Hamada equation.",
  },
  {
    name: "Size Premium",
    source: "Duff & Phelps CRSP Decile Size Premia tables (deciles 1–10).",
    range: "2–7% for micro-cap companies.",
    note: "Private companies without observable equity are often placed in deciles 9–10.",
  },
  {
    name: "Company-Specific Risk Premium (CSRP)",
    source: "Judgment-based; documented factor by factor.",
    range: "0–5% total is typical.",
    note: "Common factors: management depth, customer concentration, product concentration, geographic concentration, regulatory exposure, key person dependency.",
  },
  {
    name: "Cost of Debt",
    source: "Actual rate from loan agreements, or synthetic rating using Damodaran's interest coverage → credit rating → credit spread table.",
    range: "Varies with credit quality; apply after-tax: Kd × (1 − t).",
  },
  {
    name: "Capital Structure",
    source: "Industry target (Damodaran), book value, or market value.",
    range: "Industry target is most common for private companies.",
    note: "Document why the chosen structure is appropriate.",
  },
  {
    name: "WACC Formula",
    source: "Build-up summary.",
    range: "WACC = Ke × (E/V) + Kd × (1 − t) × (D/V)",
    note: "Where Ke = Rf + ERP × β + size premium + CSRP, and V = E + D.",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function matches(haystack: string, q: string) {
  if (!q.trim()) return true;
  return haystack.toLowerCase().includes(q.toLowerCase());
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function RoadmapExplorer() {
  const [search, setSearch] = useState("");

  const filteredScenarios = useMemo(() =>
    SCENARIOS.filter(s =>
      matches(s.name + " " + s.description + " " + s.recommended.join(" ") + " " + s.watchOuts.join(" "), search),
    ), [search]);

  const filteredMethods = useMemo(() =>
    METHODS.filter(m =>
      matches(m.name + " " + m.what + " " + m.whenToUse + " " + m.whenNotToUse + " " + m.keyInputs + " " + (m.tip ?? "") + " " + (m.keyRisks ?? "") + " " + m.group, search),
    ), [search]);

  const filteredDiscounts = useMemo(() =>
    DISCOUNTS.filter(d => matches(d.name + " " + d.body + " " + d.range, search)),
    [search]);

  const filteredWacc = useMemo(() =>
    WACC_COMPONENTS.filter(w => matches(w.name + " " + w.source + " " + w.range + " " + (w.note ?? ""), search)),
    [search]);

  const methodGroups = useMemo(() => {
    const groups: Record<string, MethodCard[]> = {};
    for (const m of filteredMethods) {
      (groups[m.group] = groups[m.group] ?? []).push(m);
    }
    return groups;
  }, [filteredMethods]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Valuation Methodology Explorer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          An interactive reference guide to private-company valuation approaches, methods, and adjustments.
        </p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search scenarios, methods, discounts, WACC…"
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="scenarios">
        <TabsList>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="methods">Methods</TabsTrigger>
          <TabsTrigger value="discounts">Discounts &amp; Premiums</TabsTrigger>
          <TabsTrigger value="wacc">WACC Build-Up</TabsTrigger>
        </TabsList>

        {/* Scenarios */}
        <TabsContent value="scenarios" className="mt-6">
          {filteredScenarios.length === 0 ? (
            <p className="text-sm text-muted-foreground">No scenarios match your search.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredScenarios.map(s => (
                <Card key={s.name} className={`border-l-4 ${s.borderColor}`}>
                  <CardContent className="p-5 space-y-3">
                    <div>
                      <h3 className="font-semibold text-base">{s.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Recommended approach</div>
                      <ol className="list-decimal pl-5 text-sm space-y-1 text-foreground/90">
                        {s.recommended.map((r, i) => <li key={i}>{r}</li>)}
                      </ol>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Watch-outs</div>
                      <ul className="list-disc pl-5 text-sm space-y-1 text-foreground/80">
                        {s.watchOuts.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Methods */}
        <TabsContent value="methods" className="mt-6 space-y-6">
          {Object.keys(methodGroups).length === 0 ? (
            <p className="text-sm text-muted-foreground">No methods match your search.</p>
          ) : (
            Object.entries(methodGroups).map(([group, items]) => (
              <div key={group}>
                <h2 className="font-medium text-foreground mb-2">{group}</h2>
                <Accordion type="multiple" className="space-y-1">
                  {items.map(m => (
                    <AccordionItem key={m.name} value={m.name} className="border rounded-md px-3">
                      <AccordionTrigger className="text-sm hover:no-underline">
                        <span className="text-left">{m.name}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 pb-3 space-y-2 text-sm">
                        <p><span className="text-muted-foreground font-medium">What:</span> {m.what}</p>
                        <p><span className="text-muted-foreground font-medium">When to use:</span> {m.whenToUse}</p>
                        <p><span className="text-muted-foreground font-medium">When NOT to use:</span> {m.whenNotToUse}</p>
                        <p><span className="text-muted-foreground font-medium">Key inputs:</span> {m.keyInputs}</p>
                        {m.keyRisks && <p><span className="text-muted-foreground font-medium">Key risks:</span> {m.keyRisks}</p>}
                        {m.tip && (
                          <p className="text-foreground/90 bg-muted/40 border border-border rounded p-2 text-xs">
                            <span className="font-medium">Tip — </span>{m.tip}
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          )}
        </TabsContent>

        {/* Discounts */}
        <TabsContent value="discounts" className="mt-6">
          {filteredDiscounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No discounts match your search.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredDiscounts.map(d => (
                <Card key={d.name}>
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-base">{d.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">{d.range}</Badge>
                    <p className="text-sm text-foreground/85 leading-relaxed">{d.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* WACC */}
        <TabsContent value="wacc" className="mt-6">
          {filteredWacc.length === 0 ? (
            <p className="text-sm text-muted-foreground">No components match your search.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredWacc.map(w => (
                <Card key={w.name}>
                  <CardContent className="p-5 space-y-2">
                    <h3 className="font-semibold text-base">{w.name}</h3>
                    <div className="text-sm space-y-1.5">
                      <p>
                        <span className="text-muted-foreground font-medium">Source: </span>
                        {w.source}
                      </p>
                      <p>
                        <span className="text-muted-foreground font-medium">Typical: </span>
                        {w.range}
                      </p>
                      {w.note && (
                        <p className="text-foreground/80 italic">{w.note}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
