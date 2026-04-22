import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoginPage } from "@/pages/LoginPage";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated()) {
      throw redirect({ to: context.auth.getHomePath() });
    }
  },
  head: () => ({
    meta: [
      { title: "Login | ViaPathHub" },
      { name: "description", content: "Access the ViaPathHub client or worker demo experience." },
    ],
  }),
  component: LoginPage,
});
