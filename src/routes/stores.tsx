import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { Section, SectionHeading } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stores } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/stores")({
  head: seo(
    "Store Locator — TwinTech Branches in Cambodia",
    "Find TwinTech sales counters, repair workshops and warranty desks in Phnom Penh, Siem Reap and Battambang.",
  ),
  component: StoresPage,
});

function StoresPage() {
  return (
    <SiteLayout>
      <Section>
        <SectionHeading
          eyebrow="Store locator"
          title="Visit a TwinTech counter"
          description="Every branch shares the same inventory, warranty and repair history."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-4">
            {stores.map((s) => (
              <div key={s.name} className="surface-panel flex flex-wrap items-start gap-5 p-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <MapPin className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-foreground">{s.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{s.address}</p>
                  <p className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" /> {s.hours}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="size-3.5" /> {s.phone}
                    </span>
                  </p>
                  <p className="mt-3 flex flex-wrap gap-1.5">
                    {s.services.map((sv) => (
                      <Badge key={sv} variant="outline">
                        {sv}
                      </Badge>
                    ))}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  <Navigation /> Directions
                </Button>
              </div>
            ))}
          </div>
          <div className="surface-panel grid-lines relative min-h-[420px] overflow-hidden">
            <div className="absolute inset-0 bg-primary/5" aria-hidden="true" />
            {[
              { top: "28%", left: "42%", label: "Central" },
              { top: "38%", left: "56%", label: "Toul Kork" },
              { top: "62%", left: "34%", label: "Siem Reap" },
              { top: "72%", left: "62%", label: "Battambang" },
            ].map((pin) => (
              <span
                key={pin.label}
                className="absolute flex flex-col items-center"
                style={{ top: pin.top, left: pin.left }}
              >
                <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
                  <MapPin className="size-4" />
                </span>
                <span className="mt-1.5 rounded-md bg-card px-2 py-0.5 text-[11px] font-medium text-foreground shadow-sm">
                  {pin.label}
                </span>
              </span>
            ))}
            <p className="absolute bottom-4 left-4 text-xs text-muted-foreground">
              Interactive map preview · Cambodia
            </p>
          </div>
        </div>
        <div className="mt-10 text-center">
          <Button variant="outline" asChild>
            <Link to="/repairs">Book a repair at your nearest branch</Link>
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}
