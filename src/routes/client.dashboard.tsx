import { createFileRoute } from "@tanstack/react-router";

import { ClientDashboardPage } from "@/pages/ClientDashboardPage";

export const Route = createFileRoute("/client/dashboard")({
  head: () => ({
    meta: [
      { title: "Client Dashboard | ViaPathHub" },
      { name: "description", content: "Manage bookings and discover trusted workers on ViaPathHub." },
    ],
  }),
  component: ClientDashboardPage,
});
