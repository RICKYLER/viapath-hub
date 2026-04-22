import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/AppContext";
import { DashboardShell } from "@/layouts/DashboardShell";

export function EditProfilePage() {
  const { user, getWorkerById, updateWorkerProfile } = useAppContext();
  const profile = useMemo(() => (user?.workerId ? getWorkerById(user.workerId) : undefined), [getWorkerById, user?.workerId]);
  const [about, setAbout] = useState(profile?.about ?? "");
  const [location, setLocation] = useState(profile?.location ?? user?.location ?? "Tagum City, Davao del Norte");
  const [service, setService] = useState(profile?.service ?? "Cleaning");
  const [skills, setSkills] = useState(profile?.skills.join(", ") ?? "Home service, Flexible schedule, Quick replies");
  const [saved, setSaved] = useState(false);

  const submit = () => {
    updateWorkerProfile({
      about,
      location,
      service,
      skills: skills.split(",").map((item) => item.trim()).filter(Boolean),
    });
    setSaved(true);
  };

  return (
    <DashboardShell
      eyebrow="Edit profile"
      title="Keep your worker profile marketplace-ready"
      description="Update your service description, location coverage, and skills so more clients can book with confidence."
    >
      <section className="form-panel space-y-5">
        <div className="space-y-2">
          <Label htmlFor="service">Primary service</Label>
          <Input id="service" value={service} onChange={(event) => setService(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={location} onChange={(event) => setLocation(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <Input id="skills" value={skills} onChange={(event) => setSkills(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="about">About</Label>
          <Textarea id="about" rows={6} value={about} onChange={(event) => setAbout(event.target.value)} />
        </div>
        <Button size="lg" onClick={submit}>Save profile</Button>
        {saved ? <p className="text-sm font-medium text-success">Profile saved in mock context state.</p> : null}
      </section>
    </DashboardShell>
  );
}
