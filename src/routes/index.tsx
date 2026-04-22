import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ViaPathHub | Trusted services in Tagum City" },
      {
        name: "description",
        content: "Find massage therapists, nail technicians, plumbers, electricians, and cleaners in Tagum City with ViaPathHub.",
      },
      { property: "og:title", content: "ViaPathHub | Trusted services in Tagum City" },
      {
        property: "og:description",
        content: "A mobile-first marketplace MVP connecting clients and skilled workers in Tagum City, Davao del Norte.",
      },
    ],
  }),
  component: HomePage,
});
