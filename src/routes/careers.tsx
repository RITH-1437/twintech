import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Globe2, HeartHandshake, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { Section, SectionHeading } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/careers")({
  head: seo(
    "Careers at TwinTech — Build Retail Software in Phnom Penh",
    "Join TwinTech: engineering, service operations and customer success roles across Cambodia.",
  ),
  component: CareersPage,
});

const openings = [
  { title: "Senior Frontend Engineer", team: "Product", location: "Phnom Penh · Hybrid" },
  { title: "Backend Engineer (Payments)", team: "Platform", location: "Phnom Penh · Hybrid" },
  { title: "Implementation Consultant", team: "Success", location: "Phnom Penh · On-site" },
  { title: "Board Repair Specialist", team: "Service Ops", location: "Siem Reap · On-site" },
  { title: "Inventory Operations Analyst", team: "Service Ops", location: "Phnom Penh · On-site" },
  { title: "Customer Success Lead", team: "Success", location: "Remote · Khmer/English" },
];

function CareersPage() {
  return (
    <SiteLayout>
      <Section>
        <SectionHeading
          eyebrow="Careers"
          title="Work on software people use standing up"
          description="Our users are behind a counter with a customer waiting. That constraint makes the work sharp."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Sparkles, title: "Real users, daily", body: "Ship on Tuesday, watch it used on the sales floor Wednesday." },
            { icon: HeartHandshake, title: "Health & family cover", body: "Full medical for you and two dependents." },
            { icon: Globe2, title: "Learning budget", body: "$1,200 a year for courses, certs and conferences." },
            { icon: Briefcase, title: "Hardware allowance", body: "Pick your machine — we build them in-house." },
          ].map((b) => (
            <div key={b.title} className="surface-panel p-6">
              <b.icon className="size-5 text-primary" />
              <h3 className="mt-4 text-sm font-semibold text-foreground">{b.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-card">
        <SectionHeading align="left" eyebrow="Open roles" title={`${openings.length} positions open`} />
        <div className="mt-8 divide-y divide-border">
          {openings.map((o) => (
            <div key={o.title} className="flex flex-wrap items-center justify-between gap-4 py-5">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{o.title}</h3>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{o.team}</Badge> {o.location}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/contact">Apply now</Link>
              </Button>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
