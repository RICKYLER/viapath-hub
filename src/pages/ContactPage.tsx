import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !email || !msg) {
      toast.error("Please fill in all the fields.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent successfully! We'll reply within 24 hours.");
      setName("");
      setEmail("");
      setMsg("");
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="page-shell section-gap grid gap-12 lg:grid-cols-[1fr_minmax(0,1.1fr)] lg:items-start py-16 lg:py-24">
      {/* Left Column: Office Coordinates & FAQ Info */}
      <section className="space-y-8">
        <div className="space-y-4">
          <span className="eyebrow">Contact Support</span>
          <h1 className="title-display tracking-tighter leading-tight font-bold text-foreground">
            Get in touch with our team.
          </h1>
          <p className="body-copy max-w-xl text-muted-foreground leading-relaxed">
            Have questions about how the marketplace matches talents, verifying qualifications, or resolving issues? Drop us a line.
          </p>
        </div>

        {/* Contact details */}
        <div className="space-y-6 pt-6 border-t border-border/10">
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email support</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">support@viapathhub.ph</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Phone size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone support</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">+63 (084) 216-8800</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Office location</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">Magugpo Center, Tagum City, Davao del Norte</p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Column: Contact Form */}
      <section className="relative p-1 bg-panel/30 border border-border/10 rounded-[2.5rem] shadow-xl shadow-foreground/5">
        <div className="bg-card p-6 sm:p-8 rounded-[calc(2.5rem-4px)] border border-border/10 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Send Message</h2>
            <p className="text-xs text-muted-foreground mt-1">Submit your queries directly to our operations board.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="c-name" className="text-xs font-semibold text-foreground/80">Full name</Label>
              <Input 
                id="c-name" 
                placeholder="Juan Dela Cruz" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-surface/50 border-border/60 focus:bg-surface focus:ring-1 focus:ring-primary transition-all rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="c-email" className="text-xs font-semibold text-foreground/80">Email address</Label>
              <Input 
                id="c-email" 
                type="email" 
                placeholder="juan@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="bg-surface/50 border-border/60 focus:bg-surface focus:ring-1 focus:ring-primary transition-all rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="c-msg" className="text-xs font-semibold text-foreground/80">Message</Label>
              <textarea
                id="c-msg"
                placeholder="Tell us what you need help with..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
                className="flex w-full bg-surface/50 border border-border/60 focus:bg-surface focus:ring-1 focus:ring-primary focus-visible:outline-none transition-all rounded-xl px-3 py-2 text-sm text-foreground"
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              disabled={submitting}
              className="group relative w-full inline-flex items-center justify-between rounded-full bg-primary py-6 px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <span>{submitting ? "Sending..." : "Submit message"}</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                <Send size={12} className="text-primary-foreground" />
              </span>
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
