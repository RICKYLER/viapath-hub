import { createFileRoute } from "@tanstack/react-router";

import { MyJobsPage } from "@/pages/MyJobsPage";

export const Route = createFileRoute("/worker/jobs")({
  head: () => ({
    meta: [
      { title: "My Jobs | ViaPathHub" },
      { name: "description", content: "Track current and upcoming service jobs on ViaPathHub." },
    ],
  }),
  component: MyJobsPage,
});
