import { createFileRoute } from "@tanstack/react-router";

import { WorkerDashboardPage } from "@/pages/WorkerDashboardPage";

export const Route = createFileRoute("/worker/dashboard")({
  head: () => ({
    meta: [
      { title: "Worker Dashboard | ViaPathHub" },
      { name: "description", content: "See incoming bookings and manage worker activity on ViaPathHub." },
    ],
  }),
  component: WorkerDashboardPage,
});
