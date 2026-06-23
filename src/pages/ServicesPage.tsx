import { Link } from "@tanstack/react-router";
import { Scissors, Wrench, Sparkles, Zap, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    name: "Massage Therapy",
    desc: "Relaxing wellness sessions, deep tissue recovery, and prenatal massage at your home.",
    price: "₱500 / session",
    skills: ["Swedish Massage", "Deep Tissue", "Therapeutic", "Aromatherapy"],
    icon: Activity,
  },
  {
    name: "Nail Technician",
    desc: "Luxury manicures, custom nail art, pedicures, and soothing foot spas at your doorstep.",
    price: "₱250 / service",
    skills: ["Nail Art", "Manicure", "Pedicure", "Gel Polish"],
    icon: Scissors,
  },
  {
    name: "Plumbing",
    desc: "Fix home water leaks, repair kitchen pipes, clear drains, and install new bathroom fixtures.",
    price: "₱350 / project",
    skills: ["Leak Repair", "Drain Cleaning", "Pipe Installation", "Emergency Repairs"],
    icon: Wrench,
  },
  {
    name: "Electrician",
    desc: "Secure electrical wiring, lighting installations, panel upgrades, and socket repairs.",
    price: "₱400 / job",
    skills: ["Home Wiring", "Lighting Setup", "Fault Detection", "Appliance Repair"],
    icon: Zap,
  },
  {
    name: "Cleaning & Housekeeping",
    desc: "General home tidy-up, office space cleaning, deep sanitization, and post-construction cleaning.",
    price: "₱300 / service",
    skills: ["Deep Cleaning", "Office Tidy", "Upholstery Care", "Sanitization"],
    icon: Sparkles,
  },
];

export function ServicesPage() {
  return (
    <div className="page-shell section-gap space-y-12 py-16 lg:py-24">
      {/* Page Header */}
      <section className="space-y-4 max-w-3xl">
        <span className="eyebrow">Service Catalog</span>
        <h1 className="title-display tracking-tighter leading-tight font-bold text-foreground">
          Core service categories in Tagum City.
        </h1>
        <p className="body-copy max-w-2xl text-muted-foreground leading-relaxed">
          We match you with verified, top-rated local professionals across five specialized service sectors. Review rates and book with confidence.
        </p>
      </section>

      {/* Grid Layout */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.name} className="form-panel flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
                  <p className="mt-2 text-xs font-semibold text-primary">{item.price}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/10">
                <div className="flex flex-wrap gap-1.5">
                  {item.skills.map((skill) => (
                    <span key={skill} className="text-[11px] font-semibold text-secondary-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                <Button asChild className="w-full justify-between h-10 rounded-full text-xs font-semibold px-4 cursor-pointer">
                  <Link to="/client/search">
                    <span>Find specialists</span>
                    <ArrowRight size={13} />
                  </Link>
                </Button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
