import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Clock, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import type { UserRole } from "@/context/types";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [role, setRole] = useState<UserRole>("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = () => {
    const user = login({ role, name, email });
    navigate({ to: user.role === "admin" ? "/admin/dashboard" : user.role === "client" ? "/client/dashboard" : "/worker/dashboard" });
  };

  return (
    <div className="page-shell section-gap grid gap-12 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:items-center py-16 lg:py-24">
      {/* Left Column: Branding, Value Prop & Features List */}
      <section className="space-y-8">
        <div className="space-y-4">
          <span className="eyebrow">Welcome back</span>
          <h1 className="title-display text-balance tracking-tighter leading-[0.95] font-bold text-foreground">
            Enter the marketplace <br />
            with a demo account.
          </h1>
          <p className="body-copy max-w-xl text-muted-foreground leading-relaxed">
            Skip password verification and jump straight into the ViaPathHub experience. Select a role and enter mock credentials to begin.
          </p>
        </div>

        {/* Cohesive line icon benefits list */}
        <ul className="space-y-4 text-sm text-muted-foreground border-t border-border/10 pt-6">
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel/30 border border-border/10 text-primary">
              <Sparkles size={14} />
            </span>
            <span>Vetted local experts in Tagum City.</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel/30 border border-border/10 text-primary">
              <Clock size={14} />
            </span>
            <span>Secure appointments booked in under a minute.</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel/30 border border-border/10 text-primary">
              <Shield size={14} />
            </span>
            <span>Flexible scheduling and secure transaction matching.</span>
          </li>
        </ul>
      </section>

      {/* Right Column: Double-Bezel Login Form */}
      <section className="relative p-1 bg-panel/30 border border-border/10 rounded-[2.5rem] shadow-xl shadow-foreground/5">
        <div className="bg-card p-6 sm:p-8 rounded-[calc(2.5rem-4px)] border border-border/10 space-y-6">
          
          {/* Form Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Login</h2>
              <p className="text-xs text-muted-foreground mt-1">Mock auth flow for demo purposes.</p>
            </div>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-4 py-1.5 text-xs font-semibold text-foreground transition-all duration-300 hover:bg-muted"
            >
              Register
            </Link>
          </div>

          {/* Segmented Tab Switcher replacing dropdown */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground/80">Account Role</Label>
            <div className="grid grid-cols-3 p-1 bg-surface border border-border/60 rounded-full gap-1">
              {(["client", "worker", "admin"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 text-xs font-semibold rounded-full capitalize transition-all duration-300 cursor-pointer ${
                    role === r 
                      ? "bg-card text-foreground shadow-sm border border-border/10 font-bold" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold text-foreground/80">Display name</Label>
              <Input 
                id="name" 
                placeholder="Your name" 
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
          </div>

          {/* Button-in-Button Submit & Quick Demo Login Link */}
          <div className="space-y-3">
            <Button 
              className="group relative w-full inline-flex items-center justify-between rounded-full bg-primary py-6 px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              onClick={submit}
            >
              <span>Continue to app</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/>
                </svg>
              </span>
            </Button>

            <button 
              type="button"
              onClick={() => {
                const defaultNames = { client: "Demo Client", worker: "Demo Worker", admin: "Demo Admin" };
                const defaultEmails = { client: "client@demo.com", worker: "worker@demo.com", admin: "admin@demo.com" };
                login({ role, name: defaultNames[role], email: defaultEmails[role] });
                navigate({ to: role === "admin" ? "/admin/dashboard" : role === "client" ? "/client/dashboard" : "/worker/dashboard" });
              }}
              className="text-xs text-primary font-bold hover:underline w-full text-center py-2 cursor-pointer transition-colors"
            >
              Quick login with demo {role} credentials
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
