import { createFileRoute } from "@tanstack/react-router";
import { MessagesPage } from "@/pages/MessagesPage";

export const Route = createFileRoute("/worker/messages")({
  component: MessagesPage,
});
