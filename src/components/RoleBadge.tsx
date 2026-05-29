import type { UserRole } from "@/context/types";

export function RoleBadge({ role }: { role: UserRole }) {
  const label = role === "client" ? "Client" : role === "worker" ? "Worker" : "Admin";

  return <span className="tag-soft">{label}</span>;
}
