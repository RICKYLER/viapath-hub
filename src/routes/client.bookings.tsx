import { createFileRoute } from "@tanstack/react-router";

import { MyBookingsPage } from "@/pages/MyBookingsPage";

export const Route = createFileRoute("/client/bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings | ViaPathHub" },
      { name: "description", content: "Review all scheduled ViaPathHub client bookings." },
    ],
  }),
  component: MyBookingsPage,
});
