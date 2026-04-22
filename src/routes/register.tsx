import { createFileRoute, redirect } from "@tanstack/react-router";

import { RegisterPage } from "@/pages/RegisterPage";

export const Route = createFileRoute("/register")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated()) {
      throw redirect({ to: context.auth.getHomePath() });
    }
  },
  head: () => ({
    meta: [
      { title: "Register | ViaPathHub" },
      { name: "description", content: "Create a ViaPathHub demo client or worker account." },
    ],
  }),
  component: RegisterPage,
});
