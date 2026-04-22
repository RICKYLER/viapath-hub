import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    navigate({ to: user.role === "client" ? "/client/dashboard" : "/worker/dashboard" });
  };

  return (
    <div className="page-shell section-gap grid gap-6 lg:grid-cols-[0.9fr_minmax(0,0.7fr)] lg:items-center">
      <section className="space-y-5">
        <span className="eyebrow">Welcome back</span>
        <h1 className="title-display text-balance">Enter the marketplace with a client or worker demo account.</h1>
        <p className="body-copy max-w-xl">
          This MVP uses mock authentication only. Choose a role, add your preferred name, and jump straight into the ViaPathHub experience.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="soft" size="lg" onClick={() => { login({ role: "client" }); navigate({ to: "/client/dashboard" }); }}>
            Demo as client
          </Button>
          <Button variant="outline" size="lg" onClick={() => { login({ role: "worker" }); navigate({ to: "/worker/dashboard" }); }}>
            Demo as worker
          </Button>
        </div>
      </section>

      <section className="form-panel space-y-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Login</h2>
          <p className="text-sm text-muted-foreground">No password validation yet — this is a front-end MVP flow.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="worker">Worker</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Display name</Label>
          <Input id="name" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>

        <Button className="w-full" size="lg" onClick={submit}>
          Continue to app
        </Button>
      </section>
    </div>
  );
}
