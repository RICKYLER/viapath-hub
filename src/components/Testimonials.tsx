import React from 'react';
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria Santos",
    role: "Homeowner",
    content: "ViaPathHub made it so easy to find a reliable plumber in Tagum. I booked Rogelio, and he arrived exactly on time. Truly a time-saver!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    name: "Lina Mae Torres",
    role: "Massage Therapist",
    content: "As a skilled worker, I used to struggle to find consistent clients. Now, the platform brings them to me. I love the flexible schedule it offers.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  },
  {
    name: "Jhovan Bautista",
    role: "Business Owner",
    content: "The verified profiles and rating system give me peace of mind. I know I'm hiring quality labor every time I use the app.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  }
];

export function Testimonials() {
  return (
    <section className="space-y-6 py-10">
      <div className="text-center space-y-2">
        <span className="eyebrow">User Stories</span>
        <h2 className="title-section">What our community says</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <article key={i} className="surface-elevated p-6 relative group hover:-translate-y-1 transition-transform duration-300">
            <Quote className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/20 transition-colors" size={40} />
            
            <div className="flex gap-1 mb-4">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={14} className="fill-accent text-accent" />
              ))}
            </div>
            
            <p className="text-sm italic leading-relaxed text-muted-foreground mb-6">
              "{t.content}"
            </p>
            
            <div className="flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover border border-border/50" />
              <div>
                <h4 className="font-bold text-foreground text-sm">{t.name}</h4>
                <p className="text-xs text-primary font-medium">{t.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
