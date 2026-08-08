import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
  CircleDollarSign,
  Clock,
  Cpu,
  Headphones,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import repairBench from "@/assets/repair-bench.jpg";
import { SiteLayout } from "@/components/site/site-layout";
import { Section, SectionHeading } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, plans, reviews, services } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TwinTech — Sales, Repair & Inventory Platform for Computer Stores" },
      {
        name: "description",
        content:
          "Run your computer store on TwinTech: inventory with serial tracking, repair workflows, warranties, employees and ABA PayWay payments in one enterprise dashboard.",
      },
      { property: "og:title", content: "TwinTech — Retail OS for computer stores" },
      {
        property: "og:description",
        content:
          "Inventory, repairs, warranties, employees and ABA PayWay payments in one premium dashboard.",
      },
    ],
  }),
  component: LandingPage,
});

const features = [
  {
    icon: Boxes,
    title: "Inventory with serial truth",
    body: "Barcode and QR intake, per-unit serial records, warehouse bins, stock history and asset ownership in one ledger.",
  },
  {
    icon: Wrench,
    title: "Repair workflow engine",
    body: "Intake to handover: diagnostics, quotes, approvals, technician notes and a timeline your customer can follow.",
  },
  {
    icon: CircleDollarSign,
    title: "ABA PayWay & KHQR",
    body: "Scan-to-pay checkout, deep links, refunds and settlement reconciliation with per-transaction audit trails.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty automation",
    body: "Coverage windows calculated per serial, claim intake, replacement tracking and expiry reminders.",
  },
  {
    icon: BarChart3,
    title: "Operational analytics",
    body: "Revenue, repair throughput, technician load, top products and customer growth on live dashboards.",
  },
  {
    icon: Cpu,
    title: "Roles & audit control",
    body: "Granular permissions per staff role with signed activity logs for every price, stock and refund change.",
  },
];

const stats = [
  { value: "18,400+", label: "Units under asset tracking" },
  { value: "42%", label: "Faster repair turnaround" },
  { value: "$4.2M", label: "Processed via ABA PayWay" },
  { value: "99.98%", label: "Platform uptime" },
];

const partners = [
  "ABA Bank",
  "ASUS",
  "Lenovo",
  "Dell",
  "NVIDIA",
  "Samsung",
  "Logitech",
  "Kingston",
];

const reasons = [
  { icon: Zap, title: "Built for counter speed", body: "Every task is two clicks deep. Staff onboard in an afternoon, not a quarter." },
  { icon: Clock, title: "Live status for customers", body: "Automatic SMS and in-app updates at every repair milestone cut inbound calls." },
  { icon: QrCode, title: "Serial-level accountability", body: "Scan a serial to see purchase order, warranty, service history and current owner." },
  { icon: Headphones, title: "Local support in Khmer & English", body: "Onboarding, data migration and an on-call team in the same timezone as your shop." },
];

function LandingPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden="true" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <div className="animate-rise">
            <Badge variant="soft" className="mb-5 py-1">
              <Sparkles /> ABA PayWay & KHQR ready
            </Badge>
            <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              The operating system for <span className="text-primary">computer stores</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              TwinTech unifies sales, inventory, repair services, warranties, employees and online
              payments — so your counter, workshop and back office finally share one source of truth.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link to="/register">
                  Start free trial <ArrowRight />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/admin">View live demo</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xl font-semibold tracking-tight text-foreground">{s.value}</dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="animate-scale-in relative">
            <div className="absolute -inset-6 rounded-4xl bg-primary/10 blur-3xl" aria-hidden="true" />
            <img
              src={heroDashboard}
              alt="TwinTech analytics dashboard showing revenue, top products and customer activity"
              width={1600}
              height={1104}
              className="relative rounded-3xl border border-border bg-card shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Partners */}
      <div className="overflow-hidden border-b border-border bg-card py-7">
        <p className="mb-5 text-center text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Trusted across 120 stores and service partners
        </p>
        <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex shrink-0 items-center gap-14 pr-14">
            {[...partners, ...partners].map((p, i) => (
              <span key={`${p}-${i}`} className="text-base font-semibold whitespace-nowrap text-muted-foreground/70">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <Section id="features">
        <SectionHeading
          eyebrow="Platform"
          title="Everything a computer store runs on"
          description="Six modules that replace the spreadsheets, chat groups and paper job cards your team juggles today."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="surface-panel hover-lift group p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary transition-transform duration-300 group-hover:scale-105">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section id="services" className="border-y border-border bg-card">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <img
              src={repairBench}
              alt="TwinTech technician repairing a laptop at a service bench"
              loading="lazy"
              width={1408}
              height={1008}
              className="rounded-3xl border border-border shadow-md"
            />
          </div>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Repair services"
              title="A workshop that never loses a job card"
              description="Six standard service lines, each with SLA timers, parts reservation and customer-visible progress."
            />
            <div className="mt-8 divide-y divide-border">
              {services.slice(0, 4).map((s) => (
                <div key={s.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-foreground">{s.price}</p>
                    <p className="text-xs text-muted-foreground">{s.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-8" asChild>
              <Link to="/repairs">
                Explore all services <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Why choose */}
      <Section id="why">
        <SectionHeading
          eyebrow="Why TwinTech"
          title="Enterprise depth, counter-level simplicity"
          description="The workflows come from real shop floors in Phnom Penh, not a generic ERP template."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title} className="surface-panel flex gap-4 p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-success-soft text-success">
                <r.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Reviews */}
      <Section className="border-y border-border bg-card">
        <SectionHeading eyebrow="Customer reviews" title="Teams that stopped chasing paperwork" />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="surface-panel hover-lift flex h-full flex-col p-6">
              <div className="flex gap-0.5 text-warning" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={i < r.rating ? "size-4 fill-current" : "size-4 opacity-30"} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section id="pricing">
        <SectionHeading
          eyebrow="Pricing"
          title="Plans that scale with your locations"
          description="Monthly per store. No transaction markup on ABA PayWay settlements."
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
              {plan.featured && (
                <Badge className="absolute -top-3 left-7">Most popular</Badge>
              )}
              <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                {plan.name}
              </h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  ${plan.price}
                </span>
                <span className="text-sm text-muted-foreground">/store/month</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>
              <Button
                variant={plan.featured ? "hero" : "outline"}
                className="mt-6 w-full"
                asChild
              >
                <Link to="/register">{plan.featured ? "Start 14-day trial" : "Choose plan"}</Link>
              </Button>
              <ul className="mt-7 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="border-y border-border bg-card">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Answers before you migrate"
            description="Still unsure? Our team will walk your workflow with you before you commit."
          />
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Contact"
              title="Talk to the TwinTech team"
              description="Tell us about your store setup and we'll prepare a tailored migration plan within one business day."
            />
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="size-4 text-primary" /> #128 Norodom Blvd, Phnom Penh, Cambodia
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Headphones className="size-4 text-primary" /> +855 23 900 128 · Mon–Sat 8:00–20:00
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" /> hello@twintech.dev
              </li>
            </ul>
          </div>
          <form
            className="surface-panel grid gap-4 p-6 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message sent — we'll reply within one business day.");
            }}
          >
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full name
              </label>
              <Input id="name" required placeholder="Sokha Chan" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="store" className="text-sm font-medium text-foreground">
                Store name
              </label>
              <Input id="store" required placeholder="KimTech Computers" />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Work email
              </label>
              <Input id="email" type="email" required placeholder="you@store.com" />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                How can we help?
              </label>
              <Textarea id="message" rows={4} placeholder="We run two stores and a workshop…" />
            </div>
            <Button type="submit" className="sm:col-span-2">
              Send message
            </Button>
          </form>
        </div>
      </Section>
    </SiteLayout>
  );
}
