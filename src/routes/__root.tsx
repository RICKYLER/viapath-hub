import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";

import { AppProviders } from "@/App";
import { AppShell } from "@/layouts/AppShell";
import type { AuthStore } from "@/context/auth-store";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="surface-elevated max-w-md p-8 text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ auth: AuthStore }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ViaPathHub | Local service marketplace" },
      {
        name: "description",
        content: "ViaPathHub connects clients with skilled workers in Tagum City for trusted home, care, and repair services.",
      },
      { name: "author", content: "ViaPathHub" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "ViaPathHub | Local service marketplace" },
      {
        property: "og:description",
        content: "Book reliable local workers or offer flexible services through ViaPathHub.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
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
  return (
    <AppProviders>
      <AppShell>
        <Outlet />
      </AppShell>
    </AppProviders>
  );
}
