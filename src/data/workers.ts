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
  },
  {
    id: "w2",
    name: "Jessa Ann Cabrera",
    service: "Nail Technician",
    rating: 4.8,
    location: "Apokon, Tagum City, Davao del Norte",
    about: "Mobile nail artist for events, gel polish, classic manicure, and quick weekend appointments.",
    image: createAvatar("Jessa Ann Cabrera", "#f3b86b"),
    skills: ["Gel polish", "Soft gel extensions", "Home appointments"],
    verified: true,
    completedJobs: 98,
    responseTime: "Replies in 18 mins",
  },
  {
    id: "w3",
    name: "Rogelio Quiblat",
    service: "Plumbing",
    rating: 4.7,
    location: "Magugpo East, Tagum City, Davao del Norte",
    about: "Handles leaks, clogged drains, and faucet replacements for homes and sari-sari stores.",
    image: createAvatar("Rogelio Quiblat", "#73b8f0"),
    skills: ["Leak repair", "Pipe fitting", "Emergency visits"],
    verified: true,
    completedJobs: 176,
    responseTime: "Replies in 9 mins",
  },
  {
    id: "w4",
    name: "Arvin Jay Dela Cruz",
    service: "Electrical",
    rating: 4.8,
    location: "Mankilam, Tagum City, Davao del Norte",
    about: "Trusted electrician for breaker issues, lighting setup, and safe residential maintenance.",
    image: createAvatar("Arvin Jay Dela Cruz", "#b1d27e"),
    skills: ["Outlet repair", "Lighting install", "Safety checks"],
    verified: true,
    completedJobs: 141,
    responseTime: "Replies in 14 mins",
  },
  {
    id: "w5",
    name: "Marites Padilla",
    service: "Cleaning",
    rating: 4.9,
    location: "La Filipina, Tagum City, Davao del Norte",
    about: "Detailed cleaner for apartments, move-outs, and routine condo upkeep with eco-safe supplies.",
    image: createAvatar("Marites Padilla", "#f09eb5"),
    skills: ["Deep cleaning", "Move-out prep", "Eco supplies"],
    verified: true,
    completedJobs: 133,
    responseTime: "Replies in 22 mins",
  },
  {
    id: "w6",
    name: "Krizel Panganiban",
    service: "Massage Therapy",
    rating: 4.6,
    location: "Magdum, Tagum City, Davao del Norte",
    about: "Sports and recovery-focused therapist serving athletes, office workers, and seniors around Tagum.",
    image: createAvatar("Krizel Panganiban", "#7dbfd4"),
    skills: ["Sports massage", "Trigger point", "Senior care"],
    verified: true,
    completedJobs: 76,
    responseTime: "Replies in 25 mins",
  },
  {
    id: "w7",
    name: "Bernard Solis",
    service: "Plumbing",
    rating: 4.5,
    location: "Pandapan, Tagum City, Davao del Norte",
    about: "Weekend-ready plumber for kitchen sink concerns, shower fittings, and water line troubleshooting.",
    image: createAvatar("Bernard Solis", "#89b3ff"),
    skills: ["Drain unclogging", "Water line check", "Fixture install"],
    verified: false,
    completedJobs: 64,
    responseTime: "Replies in 31 mins",
  },
  {
    id: "w8",
    name: "Rhea Joy Almazan",
    service: "Nail Technician",
    rating: 4.7,
    location: "San Miguel, Tagum City, Davao del Norte",
    about: "Reliable nail tech for natural sets, bridal prep, and group bookings in homes or small salons.",
    image: createAvatar("Rhea Joy Almazan", "#f3a38f"),
    skills: ["Bridal nails", "Natural set care", "Group bookings"],
    verified: true,
    completedJobs: 89,
    responseTime: "Replies in 16 mins",
  },
];

export const serviceTypes = Array.from(new Set(workers.map((worker) => worker.service)));
