import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/client")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }

    if (!context.auth.hasRole("client")) {
      throw redirect({ to: context.auth.getHomePath() });
    }
  },
  component: ClientLayout,
});

function ClientLayout() {
  return <Outlet />;
}
