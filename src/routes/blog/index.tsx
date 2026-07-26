import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { Section, SectionHeading } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { posts } from "@/lib/mock-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: seo(
    "TwinTech Blog — Retail, Repair & Payments Field Notes",
    "Operational playbooks for computer stores: repair throughput, inventory planning and ABA PayWay reconciliation.",
  ),
  component: BlogIndex,
});

function BlogIndex() {
  const [featured, ...rest] = posts;
  return (
    <SiteLayout>
      <Section>
        <SectionHeading
          align="left"
          eyebrow="Blog"
          title="Field notes from the shop floor"
          description="What we learn running stores and workshops, written for people who do the same."
        />
        <Link
          to="/blog/$slug"
          params={{ slug: featured.slug }}
          className="surface-panel hover-lift mt-12 block p-8"
        >
          <Badge variant="soft">{featured.category}</Badge>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {featured.excerpt}
          </p>
          <p className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {featured.date}
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> {featured.read}
            </span>
            <span className="flex items-center gap-1 font-medium text-primary">
              Read article <ArrowRight className="size-3.5" />
            </span>
          </p>
        </Link>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {rest.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="surface-panel hover-lift flex h-full flex-col p-6"
            >
              <Badge variant="outline">{p.category}</Badge>
              <h3 className="mt-4 text-base font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
              <p className="mt-5 text-xs text-muted-foreground">{p.date} · {p.read}</p>
            </Link>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
