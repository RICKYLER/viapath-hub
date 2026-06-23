import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/pages/ServicesPage";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | ViaPathHub" },
      { name: "description", content: "Explore the core local service matching categories in Tagum City including massage, plumbing, and cleaning." },
    ],
  }),
  component: ServicesPage,
});
