import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/site/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/forgot-password")({
  head: seo(
    "Reset your password — TwinTech",
    "Request a secure password reset link for your TwinTech customer or staff account.",
  ),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a secure link valid for 30 minutes."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-xl border border-success/40 bg-success-soft p-5">
          <MailCheck className="size-5 text-success" />
          <p className="mt-3 text-sm font-semibold text-success-foreground">Check your inbox</p>
          <p className="mt-1 text-sm text-success-foreground/80">
            If an account exists for that address, a reset link is on its way.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setSent(false)}>
            Send again
          </Button>
        </div>
      ) : (
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="femail">Email</Label>
            <Input id="femail" type="email" required placeholder="you@store.com" />
          </div>
          <Button type="submit" size="lg">
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
