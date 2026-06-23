import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/pages/ContactPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | ViaPathHub" },
      { name: "description", content: "Get in touch with the ViaPathHub support and operations board in Tagum City." },
    ],
  }),
  component: ContactPage,
});
