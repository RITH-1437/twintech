import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock, Search, Upload, Wrench } from "lucide-react";
import repairBench from "@/assets/repair-bench.jpg";
import { SiteLayout } from "@/components/site/site-layout";
import { Section, SectionHeading } from "@/components/shared/section";
import { RepairTimeline } from "@/components/shared/repair-timeline";
import { Badge } from "@/components/ui/badge";
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
import { services, timeline } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/repairs/")({
  head: seo(
    "Repair Services & Booking — TwinTech Workshop",
    "Book laptop, desktop and board-level repairs with TwinTech. Transparent pricing, SLA timers and live repair status tracking.",
  ),
  component: RepairsPage,
});

const steps = ["Device details", "Service type", "Drop-off", "Confirm"];

function RepairsPage() {
  const [step, setStep] = useState(0);
  const [ticket, setTicket] = useState("");

  return (
    <SiteLayout>
      <section className="gradient-hero border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
          <div>
            <Badge variant="soft" className="mb-4">
              <Wrench /> Certified workshop
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Repairs with a timeline you can watch
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              Board-level expertise, genuine parts and a status page for every job. Average turnaround
              is 1.8 days across 6,400 completed repairs.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" asChild>
                <a href="#booking">
                  Book a repair <ArrowRight />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#tracking">Track existing job</a>
              </Button>
            </div>
          </div>
          <img
            src={repairBench}
            alt="Technician performing a board-level laptop repair"
            width={1408}
            height={1008}
            className="rounded-3xl border border-border shadow-md"
          />
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Service catalogue"
          title="Fixed-scope services, published prices"
          description="Each service includes diagnostics, a written report and a 90-day repair warranty."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.id} className="surface-panel hover-lift flex h-full flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="soft">{s.price}</Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" /> {s.time}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <Button variant="ghost" size="sm" className="mt-4 self-start px-0" asChild>
                <a href="#booking">
                  Book this service <ArrowRight />
                </a>
              </Button>
            </article>
          ))}
        </div>
      </Section>

      <Section id="booking" className="border-y border-border bg-card">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            align="left"
            eyebrow="Booking"
            title="Reserve a bench slot"
            description="Four steps, under two minutes. You'll receive a ticket ID and an SMS tracking link."
          />
          <div className="surface-panel p-6">
            <ol className="mb-7 flex items-center gap-2" aria-label="Booking progress">
              {steps.map((label, i) => (
                <li key={label} className="flex flex-1 items-center gap-2">
                  <span
                    className={
                      i <= step
                        ? "grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                        : "grid size-7 shrink-0 place-items-center rounded-full border border-border text-xs font-semibold text-muted-foreground"
                    }
                  >
                    {i + 1}
                  </span>
                  <span className="hidden text-xs font-medium text-muted-foreground sm:block">
                    {label}
                  </span>
                  {i < steps.length - 1 && <span className="h-0.5 flex-1 bg-border" />}
                </li>
              ))}
            </ol>

            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (step < steps.length - 1) {
                  setStep(step + 1);
                  return;
                }
                setTicket(`RPR-${Math.floor(2500 + Math.random() * 400)}`);
                toast.success("Repair booked — tracking link sent by SMS");
              }}
            >
              {step === 0 && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="device">Device model</Label>
                    <Input id="device" required placeholder="MacBook Pro 14 M3" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="serial">Serial number</Label>
                    <Input id="serial" placeholder="TTX-4482-KH" />
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="issue">Describe the issue</Label>
                    <Textarea id="issue" rows={3} required placeholder="Screen flickers after 10 minutes…" />
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="photos">Photos (optional)</Label>
                    <label
                      htmlFor="photos"
                      className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-7 text-center transition-colors hover:bg-muted"
                    >
                      <Upload className="size-5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Upload device photos</span>
                      <span className="text-xs text-muted-foreground">PNG or JPG up to 10MB each</span>
                      <input id="photos" type="file" multiple accept="image/*" className="sr-only" />
                    </label>
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="service">Service type</Label>
                    <Select defaultValue="diagnostics">
                      <SelectTrigger id="service">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.title} · {s.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="express">Express (+$25)</SelectItem>
                        <SelectItem value="sla">Business SLA 4h</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Approval ceiling</Label>
                    <Input id="budget" placeholder="$250" />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select defaultValue="central">
                      <SelectTrigger id="branch">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">TwinTech Central · Norodom</SelectItem>
                        <SelectItem value="tk">TwinTech Toul Kork</SelectItem>
                        <SelectItem value="sr">TwinTech Siem Reap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Drop-off date</Label>
                    <Input id="date" type="date" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Preferred time</Label>
                    <Input id="time" type="time" defaultValue="10:00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Mobile number</Label>
                    <Input id="phone" required placeholder="+855 12 345 678" />
                  </div>
                </>
              )}
              {step === 3 && (
                <div className="sm:col-span-2">
                  {ticket ? (
                    <div className="rounded-xl border border-success/40 bg-success-soft p-5">
                      <p className="text-sm font-semibold text-success-foreground">
                        Booking confirmed — ticket {ticket}
                      </p>
                      <p className="mt-1 text-sm text-success-foreground/80">
                        Track progress any time from the tracking panel below or your dashboard.
                      </p>
                      <Button variant="outline" size="sm" className="mt-4" asChild>
                        <Link to="/dashboard/repairs">Open my repairs</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-muted/60 p-5 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">Review & confirm</p>
                      <p className="mt-2">
                        Diagnostics fee is waived if you approve the repair quote. You'll get an SMS
                        with a secure link to approve or decline the estimate.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 sm:col-span-2">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  Back
                </Button>
                <Button type="submit" disabled={Boolean(ticket)}>
                  {step === steps.length - 1 ? "Confirm booking" : "Continue"}
                  <ArrowRight />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Section>

      <Section id="tracking">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Status tracking"
              title="Where is my device?"
              description="Enter a ticket ID to see the live workshop timeline, technician notes and estimated cost."
            />
            <form
              className="mt-7 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Showing latest status for RPR-2481");
              }}
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input defaultValue="RPR-2481" aria-label="Ticket ID" className="h-11 pl-9" />
              </div>
              <Button type="submit" className="h-11">
                Track
              </Button>
            </form>
            <div className="surface-panel mt-6 space-y-3 p-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Device</span>
                <span className="font-medium text-foreground">MacBook Pro 14 M3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Technician</span>
                <span className="font-medium text-foreground">Vireak S.</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estimated cost</span>
                <span className="font-medium text-foreground">$240.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Target handover</span>
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <CalendarDays className="size-3.5" /> Jul 28
                </span>
              </div>
            </div>
          </div>
          <div className="surface-panel p-6">
            <h3 className="mb-6 text-sm font-semibold text-foreground">Repair progress · RPR-2481</h3>
            <RepairTimeline steps={timeline} />
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
