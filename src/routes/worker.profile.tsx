import { createFileRoute } from "@tanstack/react-router";

import { EditProfilePage } from "@/pages/EditProfilePage";

export const Route = createFileRoute("/worker/profile")({
  head: () => ({
    meta: [
      { title: "Edit Profile | ViaPathHub" },
      { name: "description", content: "Update your worker profile, skills, and service coverage." },
    ],
  }),
  component: EditProfilePage,
});
