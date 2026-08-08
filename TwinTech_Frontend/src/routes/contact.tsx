import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { Section, SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stores } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: seo(
    "Contact TwinTech — Sales, Support & Store Locations",
    "Reach the TwinTech team for demos, migrations or repair support. Four branches across Cambodia.",
  ),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Contact"
              title="We reply within one business day"
              description="Sales, onboarding and repair support all route through the same team."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Phone, label: "Sales & support", value: "+855 23 900 128" },
                { icon: Mail, label: "Email", value: "hello@twintech.dev" },
                { icon: MessageSquare, label: "Telegram", value: "@twintechkh" },
                { icon: Clock, label: "Hours", value: "Mon–Sat · 8:00–20:00" },
              ].map((c) => (
                <div key={c.label} className="surface-panel p-5">
                  <c.icon className="size-4 text-primary" />
                  <p className="mt-3 text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-sm font-medium text-foreground">{c.value}</p>
                </div>
              ))}
            </div>
          </div>
          <form
            className="surface-panel grid gap-4 p-6 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message received — we'll be in touch shortly.");
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="cname">Full name</Label>
              <Input id="cname" required placeholder="Sokha Chan" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cphone">Phone</Label>
              <Input id="cphone" placeholder="+855 12 345 678" />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="cemail">Email</Label>
              <Input id="cemail" type="email" required placeholder="you@store.com" />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="topic">Topic</Label>
              <Select defaultValue="demo">
                <SelectTrigger id="topic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demo">Request a demo</SelectItem>
                  <SelectItem value="migration">Data migration</SelectItem>
                  <SelectItem value="repair">Repair support</SelectItem>
                  <SelectItem value="billing">Billing question</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="cmsg">Message</Label>
              <Textarea id="cmsg" rows={5} required placeholder="Tell us about your store…" />
            </div>
            <Button type="submit" className="sm:col-span-2">
              Send message
            </Button>
          </form>
        </div>
      </Section>

      <Section id="stores" className="border-t border-border bg-card">
        <SectionHeading eyebrow="Store locator" title="Four branches, one service record" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stores.map((s) => (
            <div key={s.name} className="surface-panel hover-lift p-6">
              <MapPin className="size-4 text-primary" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">{s.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.address}</p>
              <p className="mt-3 text-xs text-muted-foreground">{s.hours}</p>
              <p className="text-xs font-medium text-foreground">{s.phone}</p>
              <p className="mt-3 flex flex-wrap gap-1.5">
                {s.services.map((sv) => (
                  <span key={sv} className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    {sv}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
