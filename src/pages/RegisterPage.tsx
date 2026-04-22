import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

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
  const [location, setLocation] = useState("Tagum City, Davao del Norte");

  const submit = () => {
    const user = register({ name, email, role, location });
    navigate({ to: user.role === "client" ? "/client/dashboard" : "/worker/dashboard" });
  };

  return (
    <div className="page-shell section-gap grid gap-6 lg:grid-cols-[0.85fr_minmax(0,0.75fr)] lg:items-start">
      <section className="space-y-5">
        <span className="eyebrow">Create an account</span>
        <h1 className="title-display text-balance">Start as a client booking services or a worker offering them.</h1>
        <p className="body-copy max-w-xl">
          ViaPathHub is built to solve the local problem of finding reliable service providers and helping workers secure steady flexible income.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {roles.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRole(item)}
              className={item === role ? "surface-elevated p-5 text-left" : "surface-panel p-5 text-left transition-transform duration-300 hover:-translate-y-1"}
            >
              <RoleBadge role={item} />
              <h2 className="mt-4 text-lg font-bold text-foreground">{item === "client" ? "Book trusted workers" : "Grow service income"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {item === "client"
                  ? "Search, compare, and schedule local professionals in just a few taps."
                  : "Showcase skills, receive bookings, and manage appointments from one dashboard."}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="form-panel space-y-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Register</h2>
          <p className="text-sm text-muted-foreground">Choose a role now — you can evolve the business model later when a backend is added.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Juan Dela Cruz" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Tagum City, Davao del Norte" value={location} onChange={(event) => setLocation(event.target.value)} />
        </div>
        <Button size="lg" className="w-full" onClick={submit} disabled={!name || !email || !location}>
          Create {role} account
        </Button>
      </section>
    </div>
  );
}
