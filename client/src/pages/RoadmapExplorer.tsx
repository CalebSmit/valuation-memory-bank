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

import { SCENARIOS, type Scenario } from "./roadmap-explorer/scenarios";
import { METHODS, type MethodCard } from "./roadmap-explorer/methods";
import { DISCOUNTS, type DiscountTopic } from "./roadmap-explorer/discounts";
import { WACC_COMPONENTS, type WaccCard } from "./roadmap-explorer/wacc";
import { NORMALIZATION_TOPICS, type NormalizationTopic } from "./roadmap-explorer/normalization";
import { STANDARDS, type StandardCard } from "./roadmap-explorer/standards";

// ─── Helpers ────────────────────────────────────────────────────────────────

function matches(haystack: string, q: string) {
  if (!q.trim()) return true;
  return haystack.toLowerCase().includes(q.toLowerCase());
}

function scenarioHaystack(s: Scenario) {
  return [
    s.name,
    s.decisionSignals.join(" "),
    s.recommended.join(" "),
    s.whyItWorks ?? "",
    s.criticalSequencing ?? "",
    s.watchOuts.join(" "),
    s.category,
  ].join(" ");
}

function methodHaystack(m: MethodCard) {
  return [m.group, m.name, ...m.sections.map(s => s.label + " " + s.body)].join(" ");
}

function topicHaystack(t: { name: string; intro?: string; sections: { label: string; body: string }[] }) {
  return [t.name, t.intro ?? "", ...t.sections.map(s => s.label + " " + s.body)].join(" ");
}

function discountHaystack(d: DiscountTopic) {
  return topicHaystack(d) + " " + (d.rangeBadge ?? "");
}

function waccHaystack(w: WaccCard) {
  return [w.name, w.rangeBadge ?? "", ...w.sections.map(s => s.label + " " + s.body)].join(" ");
}

function normHaystack(n: NormalizationTopic) {
  return topicHaystack(n);
}

function standardHaystack(s: StandardCard) {
  return [s.name, s.kind, s.oneLine, ...s.sections.map(x => x.label + " " + x.body)].join(" ");
}

// ─── Section list (shared layout for label/body pairs inside an accordion) ──

function SectionList({ sections }: { sections: { label: string; body: string }[] }) {
  return (
    <div className="space-y-2.5 text-sm">
      {sections.map((s, i) => (
        <div key={i}>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">{s.label}</div>
          <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">{s.body}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function RoadmapExplorer() {
  const [search, setSearch] = useState("");

  const filteredScenarios = useMemo(
    () => SCENARIOS.filter(s => matches(scenarioHaystack(s), search)),
    [search],
  );

  const filteredMethods = useMemo(
    () => METHODS.filter(m => matches(methodHaystack(m), search)),
    [search],
  );

  const methodGroups = useMemo(() => {
    const groups: Record<string, MethodCard[]> = {};
    for (const m of filteredMethods) (groups[m.group] = groups[m.group] ?? []).push(m);
    return groups;
  }, [filteredMethods]);

  const filteredDiscounts = useMemo(
    () => DISCOUNTS.filter(d => matches(discountHaystack(d), search)),
    [search],
  );

  const filteredWacc = useMemo(
    () => WACC_COMPONENTS.filter(w => matches(waccHaystack(w), search)),
    [search],
  );

  const filteredNorm = useMemo(
    () => NORMALIZATION_TOPICS.filter(n => matches(normHaystack(n), search)),
    [search],
  );

  const filteredStandards = useMemo(
    () => STANDARDS.filter(s => matches(standardHaystack(s), search)),
    [search],
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Valuation Methodology Explorer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Practitioner-grade reference for private-company valuation approaches, methods, normalization, and governing authorities.
        </p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search scenarios, methods, discounts, WACC, normalization, standards…"
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="scenarios">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="methods">Methods</TabsTrigger>
          <TabsTrigger value="discounts">Discounts &amp; Premiums</TabsTrigger>
          <TabsTrigger value="wacc">WACC Build-Up</TabsTrigger>
          <TabsTrigger value="normalization">Normalization</TabsTrigger>
          <TabsTrigger value="standards">Standards &amp; Authorities</TabsTrigger>
        </TabsList>

        {/* ─── Scenarios ──────────────────────────────────────────────── */}
        <TabsContent value="scenarios" className="mt-6">
          {filteredScenarios.length === 0 ? (
            <p className="text-sm text-muted-foreground">No scenarios match your search.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredScenarios.map(s => (
                <Card key={s.name} className={`border-l-4 ${s.borderColor}`}>
                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-semibold text-base leading-snug">{s.name}</h3>

                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Decision signals</div>
                      <div className="flex flex-wrap gap-1.5">
                        {s.decisionSignals.map((d, i) => (
                          <Badge key={i} variant="outline" className="text-[11px] font-normal">{d}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Recommended approach</div>
                      <ol className="list-decimal pl-5 text-sm space-y-1 text-foreground/90">
                        {s.recommended.map((r, i) => <li key={i}>{r}</li>)}
                      </ol>
                    </div>

                    {s.whyItWorks && (
                      <div className="text-sm bg-muted/30 border border-border rounded p-2.5">
                        <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">Why it works:</span>
                        {s.whyItWorks}
                      </div>
                    )}

                    {s.criticalSequencing && (
                      <div className="text-sm bg-amber-500/10 border border-amber-500/30 rounded p-2.5">
                        <span className="text-xs uppercase tracking-wide text-amber-300/90 mr-1">Critical sequencing:</span>
                        {s.criticalSequencing}
                      </div>
                    )}

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

        {/* ─── Methods ───────────────────────────────────────────────── */}
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
                      <AccordionContent className="pt-1 pb-3">
                        <SectionList sections={m.sections} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          )}
        </TabsContent>

        {/* ─── Discounts & Premiums ──────────────────────────────────── */}
        <TabsContent value="discounts" className="mt-6 space-y-4">
          {filteredDiscounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No topics match your search.</p>
          ) : (
            filteredDiscounts.map(d => (
              <Card key={d.name}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="font-semibold text-base leading-snug">{d.name}</h3>
                    {d.rangeBadge && (
                      <Badge variant="outline" className="text-xs">{d.rangeBadge}</Badge>
                    )}
                  </div>
                  {d.intro && (
                    <p className="text-sm text-foreground/85 leading-relaxed">{d.intro}</p>
                  )}
                  <SectionList sections={d.sections} />
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* ─── WACC ──────────────────────────────────────────────────── */}
        <TabsContent value="wacc" className="mt-6 space-y-4">
          {filteredWacc.length === 0 ? (
            <p className="text-sm text-muted-foreground">No components match your search.</p>
          ) : (
            filteredWacc.map(w => (
              <Card key={w.name}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="font-semibold text-base">{w.name}</h3>
                    {w.rangeBadge && (
                      <Badge variant="outline" className="text-xs">{w.rangeBadge}</Badge>
                    )}
                  </div>
                  <SectionList sections={w.sections} />
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* ─── Normalization ─────────────────────────────────────────── */}
        <TabsContent value="normalization" className="mt-6 space-y-4">
          {filteredNorm.length === 0 ? (
            <p className="text-sm text-muted-foreground">No topics match your search.</p>
          ) : (
            filteredNorm.map(n => (
              <Card key={n.name}>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-base">{n.name}</h3>
                  {n.intro && (
                    <p className="text-sm text-foreground/85 leading-relaxed">{n.intro}</p>
                  )}
                  <Accordion type="single" collapsible defaultValue={n.sections[0]?.label}>
                    <AccordionItem value="detail" className="border-0">
                      <AccordionTrigger className="text-xs uppercase tracking-wide text-muted-foreground py-2 hover:no-underline">
                        Detail
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 pb-2">
                        <SectionList sections={n.sections} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* ─── Standards & Authorities ───────────────────────────────── */}
        <TabsContent value="standards" className="mt-6">
          {filteredStandards.length === 0 ? (
            <p className="text-sm text-muted-foreground">No authorities match your search.</p>
          ) : (
            <Accordion type="multiple" className="space-y-2">
              {filteredStandards.map(s => (
                <AccordionItem key={s.name} value={s.name} className="border rounded-md px-3">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start gap-3 text-left flex-1">
                      <Badge variant="outline" className={`shrink-0 text-[10px] uppercase tracking-wide ${s.badgeClass}`}>
                        {s.kind}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{s.oneLine}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-3">
                    <SectionList sections={s.sections} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
