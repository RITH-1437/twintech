import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { Section, SectionHeading } from "@/components/shared/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { faqs, plans } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: seo(
    "Pricing — TwinTech Store Management Plans",
    "Simple per-store pricing for TwinTech: inventory, repairs, warranties and ABA PayWay payments with no transaction markup.",
  ),
  component: PricingPage,
});

const comparison = [
  { feature: "Serial & barcode tracking", counter: true, growth: true, ent: true },
  { feature: "Repair workflow & SLA timers", counter: true, growth: true, ent: true },
  { feature: "ABA PayWay + KHQR checkout", counter: true, growth: true, ent: true },
  { feature: "Purchase orders & suppliers", counter: false, growth: true, ent: true },
  { feature: "Revenue & repair analytics", counter: false, growth: true, ent: true },
  { feature: "Custom roles & permissions", counter: false, growth: false, ent: true },
  { feature: "Signed audit log export", counter: false, growth: false, ent: true },
];

function PricingPage() {
  return (
    <SiteLayout>
      <Section>
        <SectionHeading
          eyebrow="Pricing"
          title="Priced per store, not per transaction"
          description="Every plan includes unlimited products, unlimited repair jobs and free ABA PayWay settlement reconciliation."
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.featured
                  ? "surface-panel relative border-primary/40 p-7 shadow-lg ring-1 ring-primary/20"
                  : "surface-panel p-7"
              }
            >
              {plan.featured && <Badge className="absolute -top-3 left-7">Most popular</Badge>}
              <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                {plan.name}
              </h2>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  ${plan.price}
                </span>
                <span className="text-sm text-muted-foreground">/store/month</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>
              <Button variant={plan.featured ? "hero" : "outline"} className="mt-6 w-full" asChild>
                <Link to="/register">Start 14-day trial</Link>
              </Button>
              <ul className="mt-7 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="surface-panel mt-14 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Feature
                </th>
                {plans.map((p) => (
                  <th
                    key={p.name}
                    className="px-5 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5 text-foreground">{row.feature}</td>
                  {[row.counter, row.growth, row.ent].map((v, i) => (
                    <td key={i} className="px-5 py-3.5">
                      {v ? (
                        <Check className="size-4 text-success" aria-label="Included" />
                      ) : (
                        <span className="text-muted-foreground" aria-label="Not included">
                          —
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="border-t border-border bg-card">
        <SectionHeading eyebrow="FAQ" title="Pricing questions" />
        <Accordion type="single" collapsible className="mx-auto mt-10 max-w-3xl">
          {faqs.slice(0, 4).map((f, i) => (
            <AccordionItem key={f.q} value={`p-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </SiteLayout>
  );
}
