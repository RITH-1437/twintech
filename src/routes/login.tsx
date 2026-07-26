import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/site/auth-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: seo(
    "Sign in — TwinTech Customer Portal",
    "Sign in to TwinTech to track orders, repair jobs, warranties, invoices and ABA PayWay payments.",
  ),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to track orders, repairs and invoices."
      footer={
        <>
          New to TwinTech?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            toast.success("Signed in as demo customer");
            navigate({ to: "/dashboard" });
          }, 800);
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required defaultValue="sokha@twintech.dev" />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input id="password" type={show ? "text" : "password"} required defaultValue="demo1234" className="pr-10" />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
          <Checkbox defaultChecked /> Keep me signed in for 30 days
        </label>
        <Button type="submit" size="lg" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <Button variant="outline" size="lg" type="button" asChild>
          <Link to="/admin">Continue to admin demo</Link>
        </Button>
      </form>
    </AuthLayout>
  );
}
