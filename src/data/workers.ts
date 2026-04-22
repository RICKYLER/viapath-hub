import type { WorkerProfile } from "@/context/types";

const createAvatar = (label: string, tint: string) => {
  const initials = label
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="${tint}" offset="0%" />
          <stop stop-color="#f7e7bb" offset="100%" />
        </linearGradient>
      </defs>
      <rect width="320" height="320" rx="48" fill="url(#bg)" />
      <circle cx="160" cy="124" r="58" fill="#fff7e8" opacity="0.95" />
      <path d="M66 272c24-50 64-75 94-75s70 25 94 75" fill="#fff7e8" opacity="0.95" />
      <text x="160" y="176" text-anchor="middle" font-family="Arial, sans-serif" font-size="74" font-weight="700" fill="#25515d">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const workers: WorkerProfile[] = [
  {
    id: "w1",
    name: "Lina Mae Torres",
    service: "Massage Therapy",
    rating: 4.9,
    location: "Visayan Village, Tagum City, Davao del Norte",
    about: "Certified home-service massage therapist known for calm sessions, post-work recovery, and punctual visits.",
    image: createAvatar("Lina Mae Torres", "#7dd3c7"),
    skills: ["Swedish massage", "Prenatal care", "Home service"],
    verified: true,
    completedJobs: 124,
    responseTime: "Replies in 12 mins",
    lat: 7.4478,
    lng: 125.8094,
  },
  {
    id: "w2",
    name: "Marco Silva",
    service: "Nail Technician",
    rating: 4.9,
    location: "Mankilam, Tagum City",
    about: "Specialist in nail art and manicures with over 5 years of experience in high-end salons.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    skills: ["Nail Art", "Manicure", "Pedicure", "Paraffin Treatment"],
    verified: true,
    completedJobs: 128,
    responseTime: "Replies in 15 mins",
    lat: 7.4650,
    lng: 125.7950,
  },
  {
    id: "w3",
    name: "Rogelio Quiblat",
    service: "Plumbing",
    rating: 4.7,
    location: "Visayan Village, Tagum City",
    about: "Expert plumber specializing in home leak repairs, pipe installations, and maintenance.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    skills: ["Leak Repair", "Pipe Installation", "Drain Cleaning", "Water Heater"],
    verified: true,
    completedJobs: 89,
    responseTime: "Replies in 30 mins",
    lat: 7.4380,
    lng: 125.8220,
  },
  {
    id: "w4",
    name: "Elena Rossi",
    service: "Electrician",
    rating: 4.8,
    location: "Apokon, Tagum City",
    about: "Licensed electrician for residential and commercial electrical systems.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    skills: ["Wiring", "Lighting", "Panel Upgrade", "Electrical Repair"],
    verified: true,
    completedJobs: 56,
    responseTime: "Replies in 1 hour",
    lat: 7.4310,
    lng: 125.8180,
  },
  {
    id: "w5",
    name: "David Chen",
    service: "Cleaning",
    rating: 4.6,
    location: "Magugpo North, Tagum City",
    about: "Professional deep cleaning services for homes and offices.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    skills: ["Deep Cleaning", "Office Cleaning", "Post-Construction", "Upholstery"],
    verified: true,
    completedJobs: 142,
    responseTime: "Replies in 20 mins",
    lat: 7.4550,
    lng: 125.8050,
  },
  {
    id: "w6",
    name: "Sarah Jenkins",
    service: "Massage Therapy",
    rating: 4.9,
    location: "Canocotan, Tagum City",
    about: "Specialist in Swedish and Deep Tissue massage for recovery and stress relief.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    skills: ["Swedish Massage", "Deep Tissue", "Prenatal", "Aromatherapy"],
    verified: true,
    completedJobs: 67,
    responseTime: "Replies in 45 mins",
    lat: 7.4800,
    lng: 125.8300,
  },
  {
    id: "w7",
    name: "Michael Tan",
    service: "Plumbing",
    rating: 4.5,
    location: "Cuambogan, Tagum City",
    about: "Reliable plumber with a focus on quick response and affordable home repairs.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    skills: ["Pipe Repair", "Toilet Installation", "Kitchen Plumbing", "Emergency"],
    verified: true,
    completedJobs: 43,
    responseTime: "Replies in 10 mins",
    lat: 7.4720,
    lng: 125.7880,
  },
  {
    id: "w8",
    name: "Ana Rivera",
    service: "Nail Technician",
    rating: 4.8,
    location: "Busaon, Tagum City",
    about: "Experienced nail tech offering luxury manicures and pedicures at your doorstep.",
    image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop",
    skills: ["Gel Nails", "Acrylic", "Pedicure", "Foot Spa"],
    verified: true,
    completedJobs: 112,
    responseTime: "Replies in 25 mins",
    lat: 7.4100,
    lng: 125.8500,
  },
];

export const serviceTypes = Array.from(new Set(workers.map((worker) => worker.service)));
