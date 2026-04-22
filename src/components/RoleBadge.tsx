import type { UserRole } from "@/context/types";

export function RoleBadge({ role }: { role: UserRole }) {
  return <span className="tag-soft">{role === "client" ? "Client" : "Worker"}</span>;
}
