import type { AuthUser, UserRole } from "@/context/types";

type AuthInput = {
  name?: string;
  email?: string;
  role: UserRole;
  location?: string;
};

type Listener = () => void;

const listeners = new Set<Listener>();

const defaultUsers: Record<UserRole, AuthUser> = {
  client: {
    id: "client-demo",
    name: "Patricia Gomez",
    email: "client@viapathhub.demo",
    role: "client",
    location: "Tagum City, Davao del Norte",
  },
  worker: {
    id: "worker-demo",
    name: "Lina Mae Torres",
    email: "worker@viapathhub.demo",
    role: "worker",
    location: "Visayan Village, Tagum City",
    workerId: "w1",
  },
};

let currentUser: AuthUser | null = null;

const emit = () => {
  listeners.forEach((listener) => listener());
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const authStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return currentUser;
  },
  isAuthenticated() {
    return currentUser !== null;
  },
  hasRole(role: UserRole) {
    return currentUser?.role === role;
  },
  getHomePath(role = currentUser?.role) {
    return role === "worker" ? "/worker/dashboard" : "/client/dashboard";
  },
  login(input: AuthInput) {
    const base = defaultUsers[input.role];
    currentUser = {
      ...base,
      id: input.email ? `${input.role}-${slugify(input.email)}` : base.id,
      name: input.name?.trim() || base.name,
      email: input.email?.trim() || base.email,
      location: input.location?.trim() || base.location,
      workerId: input.role === "worker" ? base.workerId ?? `${slugify(input.name || base.name)}-profile` : undefined,
    };
    emit();
    return currentUser;
  },
  register(input: Required<AuthInput>) {
    currentUser = {
      id: `${input.role}-${Date.now()}`,
      name: input.name.trim(),
      email: input.email.trim(),
      role: input.role,
      location: input.location.trim(),
      workerId: input.role === "worker" ? `worker-${Date.now()}` : undefined,
    };
    emit();
    return currentUser;
  },
  logout() {
    currentUser = null;
    emit();
  },
};

export type AuthStore = typeof authStore;
