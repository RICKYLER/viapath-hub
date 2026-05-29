import { createFileRoute } from "@tanstack/react-router";

import { AdminDashboardPage } from "@/pages/AdminDashboardPage";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | ViaPathHub" },
      { name: "description", content: "Review ViaPathHub demo marketplace activity, bookings, and worker verification." },
    ],
  }),
  component: AdminDashboardPage,
});
