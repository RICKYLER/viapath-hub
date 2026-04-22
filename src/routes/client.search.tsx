import { createFileRoute } from "@tanstack/react-router";

import { SearchWorkersPage } from "@/pages/SearchWorkersPage";

export const Route = createFileRoute("/client/search")({
  head: () => ({
    meta: [
      { title: "Search Workers | ViaPathHub" },
      { name: "description", content: "Filter skilled local workers by service type and location." },
    ],
  }),
  component: SearchWorkersPage,
});
