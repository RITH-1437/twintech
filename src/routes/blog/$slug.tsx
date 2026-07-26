import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { posts } from "@/lib/mock-data";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.post.title ?? "Article"} — TwinTech Blog` },
      { name: "description", content: loaderData?.post.excerpt ?? "" },
      { property: "og:title", content: loaderData?.post.title ?? "TwinTech Blog" },
      { property: "og:description", content: loaderData?.post.excerpt ?? "" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: BlogDetail,
});

function BlogDetail() {
  const { post } = Route.useLoaderData();
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <SiteLayout>
      <article className="mx-auto w-full max-w-3xl px-6 py-14">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link to="/blog">
            <ArrowLeft /> All articles
          </Link>
        </Button>
        <Badge variant="soft">{post.category}</Badge>
        <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          {post.date}
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {post.read} read
          </span>
        </p>
        <Separator className="my-8" />
        <div className="space-y-5 text-[0.95rem] leading-relaxed text-muted-foreground">
          <p className="text-lg leading-relaxed text-foreground">{post.excerpt}</p>
          <p>
            Most stores discover the same thing within a month of switching: the bottleneck was never
            the technicians. It was the handoffs. A device arrives, gets a paper card, waits for a
            diagnosis, then waits again for someone to call the customer with a quote.
          </p>
          <h2 className="pt-4 text-xl font-semibold tracking-tight text-foreground">
            Make every state change visible
          </h2>
          <p>
            In TwinTech each repair job carries a state, an owner and a timestamp. When a technician
            finishes diagnostics, the quote is generated from parts already reserved in inventory and
            sent to the customer as a signed approval link. Nobody waits for a phone call.
          </p>
          <h2 className="pt-4 text-xl font-semibold tracking-tight text-foreground">
            Reconcile money the same day
          </h2>
          <p>
            Payments through ABA PayWay and KHQR land against the originating order or repair job, so
            end-of-day reconciliation is a review rather than an investigation. Refunds carry the same
            reference and appear in the audit log with the staff account that issued them.
          </p>
          <blockquote className="border-l-2 border-primary bg-primary-soft/60 py-4 pl-5 text-foreground italic">
            Shops that publish repair status to customers see inbound status calls drop by roughly
            two-thirds within the first fortnight.
          </blockquote>
          <p>
            None of this requires more staff. It requires the shop's data to live in one place, with
            each record accountable to a person and a moment in time.
          </p>
        </div>
      </article>

      <div className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-6 py-14">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Keep reading</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="surface-panel hover-lift p-6"
              >
                <Badge variant="outline">{p.category}</Badge>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{p.date} · {p.read}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
