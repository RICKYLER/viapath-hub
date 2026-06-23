import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { UserCheck, TrendingUp, Star } from "lucide-react";

import { RoleBadge } from "@/components/RoleBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import type { UserRole } from "@/context/types";

const roles: UserRole[] = ["client", "worker"];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAppContext();
  const [role, setRole] = useState<UserRole>("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("Tagum City, Davao del Norte");

  const passwordError =
    password && confirmPassword && password !== confirmPassword ? "Passwords do not match." : "";
  const canSubmit = Boolean(name && email && location && password && confirmPassword && !passwordError);

  const submit = () => {
    if (!canSubmit) return;

    const user = register({ name, email, role, location });
    navigate({ to: user.role === "client" ? "/client/dashboard" : "/worker/dashboard" });
  };

  return (
    <div className="page-shell section-gap grid gap-12 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:items-start py-16 lg:py-24">
      {/* Left Column: Branding, Eyebrow & Platform Benefits */}
      <section className="space-y-8">
        <div className="space-y-4">
          <span className="eyebrow">Create an account</span>
          <h1 className="title-display text-balance tracking-tighter leading-[0.95] font-bold text-foreground">
            Start as a client or <br />
            a local service worker.
          </h1>
          <p className="body-copy max-w-xl text-muted-foreground leading-relaxed">
            ViaPathHub connects you with vetted professionals in Tagum City. Sign up below to join the marketplace ecosystem.
          </p>
        </div>

        {/* Cohesive line icon benefits list */}
        <ul className="space-y-4 text-sm text-muted-foreground border-t border-border/10 pt-6">
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel/30 border border-border/10 text-primary">
              <UserCheck size={14} />
            </span>
            <span>Client: Browse, verify, and book local experts in a few clicks.</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel/30 border border-border/10 text-primary">
              <TrendingUp size={14} />
            </span>
            <span>Worker: Showcase skills, earn income, and build a local client base.</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel/30 border border-border/10 text-primary">
              <Star size={14} />
            </span>
            <span>Ecosystem: Transparent ratings, reviews, and secure connection management.</span>
          </li>
        </ul>
      </section>

      {/* Right Column: Double-Bezel Registration Form */}
      <section className="relative p-1 bg-panel/30 border border-border/10 rounded-[2.5rem] shadow-xl shadow-foreground/5">
        <div className="bg-card p-6 sm:p-8 rounded-[calc(2.5rem-4px)] border border-border/10 space-y-6">
          
          {/* Form Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Register</h2>
              <p className="text-xs text-muted-foreground mt-1">Setup your profile and account settings.</p>
            </div>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-4 py-1.5 text-xs font-semibold text-foreground transition-all duration-300 hover:bg-muted"
            >
              Login
            </Link>
          </div>

          {/* Segmented Tab Switcher replacing the outer cards */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground/80">Account Type</Label>
            <div className="grid grid-cols-2 p-1 bg-surface border border-border/60 rounded-full gap-1">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`py-2 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                  role === "client" 
                    ? "bg-card text-foreground shadow-sm border border-border/10 font-bold" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Client Account
              </button>
              <button
                type="button"
                onClick={() => setRole("worker")}
                className={`py-2 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                  role === "worker" 
                    ? "bg-card text-foreground shadow-sm border border-border/10 font-bold" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Worker Account
              </button>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold text-foreground/80">Full name</Label>
              <Input 
                id="name" 
                placeholder="Juan Dela Cruz" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                className="bg-surface/50 border-border/60 focus:bg-surface focus:ring-1 focus:ring-primary transition-all rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(event) => setEmail(event.target.value)} 
                className="bg-surface/50 border-border/60 focus:bg-surface focus:ring-1 focus:ring-primary transition-all rounded-xl"
              />
            </div>
            
            {/* Password Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground/80">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Create password" 
                  value={password} 
                  onChange={(event) => setPassword(event.target.value)} 
                  className="bg-surface/50 border-border/60 focus:bg-surface focus:ring-1 focus:ring-primary transition-all rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-xs font-semibold text-foreground/80">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="bg-surface/50 border-border/60 focus:bg-surface focus:ring-1 focus:ring-primary transition-all rounded-xl"
                />
              </div>
            </div>
            
            {passwordError && (
              <p className="text-xs font-semibold text-destructive px-1">{passwordError}</p>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs font-semibold text-foreground/80">Location</Label>
              <Input 
                id="location" 
                placeholder="Tagum City, Davao del Norte" 
                value={location} 
                onChange={(event) => setLocation(event.target.value)} 
                className="bg-surface/50 border-border/60 focus:bg-surface focus:ring-1 focus:ring-primary transition-all rounded-xl"
              />
            </div>
          </div>

          {/* Button-in-Button Action CTA */}
          <Button 
            size="lg" 
            className="group relative w-full inline-flex items-center justify-between rounded-full bg-primary py-6 px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer" 
            onClick={submit} 
            disabled={!canSubmit}
          >
            <span>Create {role} account</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/>
              </svg>
            </span>
          </Button>

        </div>
      </section>
    </div>
  );
}
