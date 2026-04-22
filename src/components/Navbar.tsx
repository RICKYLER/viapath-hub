import { Link, useLocation } from "@tanstack/react-router";
import { BriefcaseBusiness, CalendarCheck2, Compass, House, LogOut, MessageSquare, UserRound } from "lucide-react";

import { RoleBadge } from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

const publicLinks = [
  { to: "/", label: "Home", icon: House },
  { to: "/login", label: "Login", icon: UserRound },
  { to: "/register", label: "Register", icon: BriefcaseBusiness },
] as const;

const clientLinks = [
  { to: "/client/dashboard", label: "Dashboard", icon: House },
  { to: "/client/search", label: "Find workers", icon: Compass },
  { to: "/client/bookings", label: "Bookings", icon: CalendarCheck2 },
  { to: "/client/messages", label: "Messages", icon: MessageSquare },
] as const;

const workerLinks = [
  { to: "/worker/dashboard", label: "Dashboard", icon: House },
  { to: "/worker/jobs", label: "My jobs", icon: CalendarCheck2 },
  { to: "/worker/messages", label: "Messages", icon: MessageSquare },
  { to: "/worker/profile", label: "Edit profile", icon: UserRound },
] as const;

export function Navbar() {
  const location = useLocation();
  const { user, logout } = useAppContext();

  const links = user ? (user.role === "client" ? clientLinks : workerLinks) : publicLinks;

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/88 backdrop-blur-xl">
      <div className="page-shell flex flex-col gap-4 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              <Compass size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-display text-lg font-bold text-foreground">ViaPathHub</p>
              <p className="truncate text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Tagum City service marketplace
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <RoleBadge role={user.role} />
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">Open app</Link>
              </Button>
            )}
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1">
          {links.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={active ? "map-chip" : "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
