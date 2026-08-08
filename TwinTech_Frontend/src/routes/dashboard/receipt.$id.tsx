import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Download, Mail, ScanLine } from "lucide-react";
import { CustomerPage } from "@/components/dash/workspace-page";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { currency, currencyPrecise, payWayPayments } from "@/lib/mock-data";
import { seo } from "@/lib/seo";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";

export const Route = createFileRoute("/dashboard/receipt/$id")({
  head: seo(
    "Payment receipt — TwinTech",
    "ABA PayWay receipt with transaction reference, authorisation code, fees and settlement batch.",
  ),
  loader: ({ params }) => {
    const payment = payWayPayments.find((p) => p.tran === params.id);
    if (!payment) throw notFound();
    return payment;
  },
  component: Receipt,
  errorComponent: () => (
    <CustomerPage title="Payment receipt" crumb="Receipt">
      <EmptyState
        icon={ScanLine}
        title="We couldn't load this receipt"
        description="The payment record failed to load. Try again in a moment or contact support with the reference."
      />
    </CustomerPage>
  ),
  notFoundComponent: () => (
    <CustomerPage title="Payment receipt" crumb="Receipt">
      <EmptyState
        icon={ScanLine}
        title="Receipt not found"
        description="No PayWay transaction matches this reference on your account."
        action={
          <Button asChild variant="outline">
            <Link to="/dashboard/payments">Back to payment history</Link>
          </Button>
        }
      />
    </CustomerPage>
  ),
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function Receipt() {
  const payment = Route.useLoaderData();

  return (
    <CustomerPage
      title={`Receipt ${payment.tran}`}
      crumb="Receipt"
      description={`${payment.method} · ${payment.at}`}
      actions={
        <>
          <Button variant="outline" asChild>
            <Link to="/dashboard/payments">
              <ArrowLeft /> All payments
            </Link>
          </Button>
          <Button variant="outline" onClick={() => toast.success("Receipt emailed to you")}>
            <Mail /> Email copy
          </Button>
          <Button onClick={() => toast.success("PDF receipt downloaded")}>
            <Download /> Download PDF
          </Button>
        </>
      }
    >
      <div className="surface-panel mx-auto w-full max-w-xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              ABA PayWay
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {currency(payment.amount)}
            </p>
          </div>
          <StatusBadge status={payment.status} />
        </div>
        <Separator className="my-5" />
        <Row label="Transaction reference" value={payment.tran} />
        <Row label="Authorisation code" value={payment.authCode} />
        <Row label="Payment method" value={payment.method} />
        <Row label="Order" value={payment.order} />
        <Row label="Paid by" value={payment.customer} />
        <Row label="Captured" value={payment.at} />
        <Separator className="my-5" />
        <Row label="Gross amount" value={currency(payment.amount)} />
        <Row label="Processing fee" value={currencyPrecise(payment.fee)} />
        <Row label="Net settled" value={currencyPrecise(payment.net)} />
        <Row label="Settlement batch" value={payment.batch} />
        <Separator className="my-5" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          TwinTech Co., Ltd · Street 271, Phnom Penh · VAT TIN K001-901234567. This receipt is issued
          for a payment processed through ABA PayWay. Keep it for warranty and tax purposes.
        </p>
      </div>
    </CustomerPage>
  );
}