import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/pages/AboutPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | ViaPathHub" },
      { name: "description", content: "Learn about the mission, concept, and verification procedures behind ViaPathHub in Tagum City." },
    ],
  }),
  component: AboutPage,
});
