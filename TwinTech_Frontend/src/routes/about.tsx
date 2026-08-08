import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Eye, Flag, Users } from "lucide-react";
import repairBench from "@/assets/repair-bench.jpg";
import { SiteLayout } from "@/components/site/site-layout";
import { Section, SectionHeading } from "@/components/shared/section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: seo(
    "About TwinTech — Our Story, Mission & Team",
    "TwinTech was built inside a Phnom Penh computer store. Meet the team behind the sales, repair and inventory platform.",
  ),
  component: AboutPage,
});

const team = [
  { name: "Sopheak Ros", role: "Co-founder & CEO", initials: "SR" },
  { name: "Vireak Sam", role: "Head of Service Ops", initials: "VS" },
  { name: "Nita Chea", role: "VP Product", initials: "NC" },
  { name: "Bora Tep", role: "Head of Retail", initials: "BT" },
];

const roles = [
  { title: "Senior Frontend Engineer", location: "Phnom Penh · Hybrid", type: "Full-time" },
  { title: "Implementation Consultant", location: "Phnom Penh · On-site", type: "Full-time" },
  { title: "Board Repair Specialist", location: "Siem Reap · On-site", type: "Full-time" },
  { title: "Customer Success Lead", location: "Remote · Khmer/English", type: "Full-time" },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="gradient-hero border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 text-center">
          <Badge variant="soft" className="mb-5">Since 2019</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            We built TwinTech behind our own service counter
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Two stores, one overflowing repair bench and a spreadsheet nobody trusted. The platform we
            wished existed became the product we now ship to 120 stores.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <img
            src={repairBench}
            alt="TwinTech workshop bench in Phnom Penh"
            loading="lazy"
            width={1408}
            height={1008}
            className="rounded-3xl border border-border shadow-md"
          />
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our story"
              title="From one bench to a platform"
              description="In 2019 we ran a single store on Norodom Boulevard. Repair jobs lived on paper cards, stock lived in a notebook and warranty claims lived in memory."
            />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              We wrote the first version of TwinTech to survive a single busy December. It tracked
              serials, printed job cards and reconciled ABA PayWay settlements at close. By 2022, other
              store owners were asking to use it. Today TwinTech runs sales floors, workshops and
              warehouses across Cambodia — and every feature still starts as a request from a real
              counter.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-y border-border bg-card">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Flag, title: "Mission", body: "Give every independent computer store the operational clarity of an enterprise chain." },
            { icon: Eye, title: "Vision", body: "A regional network of shops where a device's full history follows it wherever it's serviced." },
            { icon: Compass, title: "Principles", body: "Fewer clicks over more features. Auditability over convenience. Local support, always." },
          ].map((item) => (
            <div key={item.title} className="surface-panel p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <item.icon className="size-5" />
              </span>
              <h2 className="mt-5 text-base font-semibold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Team" title="The people behind TwinTech" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.name} className="surface-panel hover-lift p-6 text-center">
              <Avatar className="mx-auto size-16">
                <AvatarFallback className="bg-primary-soft text-base font-semibold text-primary">
                  {m.initials}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{m.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{m.role}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="careers" className="border-t border-border bg-card">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            align="left"
            eyebrow="Careers"
            title="Open roles"
            description="We hire technicians and engineers who like fixing systems as much as machines."
          />
          <div className="divide-y divide-border">
            {roles.map((r) => (
              <div key={r.title} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Users className="size-4 text-primary" /> {r.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.location} · {r.type}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contact">Apply</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
