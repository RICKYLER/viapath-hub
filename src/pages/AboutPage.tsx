import { Shield, Sparkles, Target, Users } from "lucide-react";

export function AboutPage() {
  return (
    <div className="page-shell section-gap space-y-16 py-16 lg:py-24">
      {/* Hero Section */}
      <section className="space-y-4 max-w-3xl">
        <span className="eyebrow">Our Vision</span>
        <h1 className="title-display tracking-tighter leading-tight font-bold text-foreground">
          Empowering local services, building digital paths.
        </h1>
        <p className="body-copy max-w-2xl text-muted-foreground leading-relaxed text-lg">
          ViaPathHub is a dedicated service marketplace MVP designed for Tagum City, Davao del Norte. We bridging the gap between skilled workers seeking flexible employment and local residents booking trusted help.
        </p>
      </section>

      {/* Grid of Core Pillars */}
      <section className="grid gap-6 md:grid-cols-2">
        <article className="form-panel p-6 space-y-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Target size={20} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Technopreneurship Concept</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ViaPathHub was conceived as a local digital solution to address the fragmentation of booking local freelancers in Tagum City. Instead of chasing leads in unvetted Facebook groups, clients can access qualified workers instantly.
          </p>
        </article>

        <article className="form-panel p-6 space-y-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Users size={20} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Empowering Local Work</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We provide local plumbers, electricians, massage therapists, cleaners, and nail techs with a secure platform to showcase their skills, set flexible service fees, build a client base, and earn stable income.
          </p>
        </article>

        <article className="form-panel p-6 space-y-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Shield size={20} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Trust & Verification</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Safety and accountability are central to our marketplace. We verify worker credentials, police clearances, and barangay records, displaying clear badges on profiles to foster a trustworthy matchmaking environment.
          </p>
        </article>

        <article className="form-panel p-6 space-y-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles size={20} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Sleek User Experience</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ViaPathHub is engineered with clean aesthetics, quick loading times, responsive dashboard panels, and direct messaging channels, providing an premium experience on both mobile and desktop viewports.
          </p>
        </article>
      </section>
    </div>
  );
}
