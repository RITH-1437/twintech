import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/site/auth-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: seo(
    "Create your TwinTech account",
    "Start a 14-day TwinTech trial: inventory, repairs, warranties and ABA PayWay payments for your computer store.",
  ),
  component: RegisterPage,
});

function RegisterPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const strength = Math.min(100, password.length * 12 + (/[0-9]/.test(password) ? 16 : 0));
  const label = strength < 40 ? "Weak" : strength < 75 ? "Good" : "Strong";

  return (
    <AuthLayout
      title="Create your account"
      subtitle="14-day trial. No card required, cancel any time."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
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
            toast.success("Account created — welcome to TwinTech");
            navigate({ to: "/dashboard" });
          }, 900);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="first">First name</Label>
            <Input id="first" required placeholder="Sokha" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" required placeholder="Chan" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="remail">Work email</Label>
          <Input id="remail" type="email" required placeholder="you@store.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rphone">Mobile number</Label>
          <Input id="rphone" required placeholder="+855 12 345 678" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rpass">Password</Label>
          <Input
            id="rpass"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
          <div className="flex items-center gap-3">
            <Progress value={strength} className="h-1.5 flex-1" />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        </div>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
          <Checkbox required className="mt-0.5" /> I agree to the TwinTech terms of service and privacy
          policy.
        </label>
        <Button type="submit" size="lg" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
