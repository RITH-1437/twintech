import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { RoleProvider } from "@/components/providers/role-provider";
import { ErrorState } from "@/components/shared/error-state";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="gradient-hero flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm tracking-[0.3em] text-primary uppercase">Error 404</p>
        <h1 className="mt-4 text-6xl font-semibold tracking-tight text-foreground">Lost signal</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Back to home
          </Link>
          <Link
            to="/products"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="gradient-hero flex min-h-screen items-center justify-center bg-background px-4">
      <ErrorState
        detail={error.message}
        onRetry={() => {
          void router.invalidate();
          reset();
        }}
      />
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TwinTech — Computer Sales, Repair & Inventory Platform" },
      {
        name: "description",
        content:
          "TwinTech is the enterprise platform for computer stores: inventory, repairs, orders, warranties and ABA PayWay payments in one dashboard.",
      },
      { name: "author", content: "TwinTech" },
      { property: "og:title", content: "TwinTech — Retail OS for computer stores" },
      {
        property: "og:description",
        content: "Sales, inventory, repair workflows, warranties and ABA PayWay payments in one platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="top-right" richColors />
      </RoleProvider>
    </QueryClientProvider>
  );
}
