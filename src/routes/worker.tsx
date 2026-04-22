import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/worker")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }

    if (!context.auth.hasRole("worker")) {
      throw redirect({ to: context.auth.getHomePath() });
    }
  },
  component: WorkerLayout,
});

function WorkerLayout() {
  return <Outlet />;
}
