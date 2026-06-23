import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { BriefcaseBusiness, CalendarCheck2, Compass, House, LogOut, MessageSquare, ShieldCheck, UserRound, Menu, X } from "lucide-react";

import { RoleBadge } from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

const publicLinks = [
  { to: "/", label: "Home", icon: House },
  { to: "/services", label: "Services", icon: Compass },
  { to: "/about", label: "About", icon: ShieldCheck },
  { to: "/contact", label: "Contact", icon: UserRound },
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

const adminLinks = [
  { to: "/admin/dashboard", label: "Admin", icon: ShieldCheck },
] as const;

export function Navbar() {
  const location = useLocation();
  const { user, logout } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const links = user ? (user.role === "client" ? clientLinks : user.role === "worker" ? workerLinks : adminLinks) : publicLinks;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo / Brand Name */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <Compass size={18} className="text-primary transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-display text-lg font-bold text-foreground tracking-tight">ViaPathHub</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((item) => {
            const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium transition-colors relative py-2 ${
                  active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-in fade-in zoom-in duration-200" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons / Session Info */}
        <div className="flex items-center gap-3.5 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <RoleBadge role={user.role} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="h-9 gap-1.5 rounded-full text-xs font-semibold px-4 cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Login
              </Link>
              <Button asChild size="sm" className="h-9 rounded-full bg-primary text-primary-foreground font-semibold px-4 cursor-pointer hover:brightness-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile elements */}
          {!user && (
            <Button asChild size="sm" className="h-8 rounded-full bg-primary text-primary-foreground font-semibold px-3 text-[11px] md:hidden cursor-pointer">
              <Link to="/register">Sign Up</Link>
            </Button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all duration-200 hover:bg-surface active:scale-95 md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile Expandable Navigation Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 border-b border-border/40 bg-background/95 backdrop-blur-md px-4 py-4 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5">
            {links.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {user ? (
              <div className="flex items-center justify-between border-t border-border/10 pt-3.5 px-4 mt-2">
                <span className="text-xs text-muted-foreground">Role: {user.role}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="h-8 text-xs rounded-full gap-1"
                >
                  <LogOut size={12} />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 border-t border-border/10 pt-3.5 px-4 mt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 text-center"
                >
                  Login
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
