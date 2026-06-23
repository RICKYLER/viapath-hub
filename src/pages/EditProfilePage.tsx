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
  const [skillsList, setSkillsList] = useState<string[]>(profile?.skills ?? ["Home service", "Flexible schedule", "Quick replies"]);
  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(skillsList.filter((s) => s !== skill));
  };

  const submit = () => {
    updateWorkerProfile({
      about,
      location,
      service,
      skills: skillsList,
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
        
        {/* Interactive Skill Tag Manager */}
        <div className="space-y-3">
          <Label>Skills & Specialties</Label>
          <div className="flex flex-wrap gap-2 p-3 bg-surface border border-border/60 rounded-xl min-h-[50px]">
            {skillsList.map((skill) => (
              <span key={skill} className="tag-soft flex items-center gap-1.5 py-1 px-3 font-semibold text-xs rounded-full">
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer font-bold text-xs"
                >
                  ×
                </button>
              </span>
            ))}
            {skillsList.length === 0 && (
              <span className="text-xs text-muted-foreground italic my-auto">No skills added yet.</span>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add skill (e.g. Deep Tissue, Repair, Piping)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="bg-surface/50 border-border/60 rounded-xl"
            />
            <Button type="button" onClick={handleAddSkill} className="rounded-xl px-4 cursor-pointer">
              Add
            </Button>
          </div>
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
