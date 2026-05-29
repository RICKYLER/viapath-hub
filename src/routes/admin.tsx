import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }

    if (!context.auth.hasRole("admin")) {
      throw redirect({ to: context.auth.getHomePath() });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
