import { Megaphone, X } from "lucide-react";
import type { Announcement } from "@/context/types";
import { useAppContext } from "@/context/AppContext";

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const { dismissAnnouncement } = useAppContext();

  if (announcements.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {announcements.map((ann) => (
        <div
          key={ann.id}
          className="flex items-start gap-3 rounded-[1.25rem] border border-primary/20 bg-primary/5 px-4 py-3 text-sm"
        >
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Megaphone size={14} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground leading-tight">{ann.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{ann.message}</p>
          </div>
          <button
            type="button"
            onClick={() => dismissAnnouncement(ann.id)}
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            aria-label="Dismiss announcement"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
