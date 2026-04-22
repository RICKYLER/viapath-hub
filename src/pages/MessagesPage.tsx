import React from 'react';
import { Link } from "@tanstack/react-router";
import { MessageSquare, User } from "lucide-react";
import { DashboardShell } from "@/layouts/DashboardShell";
import { useAppContext } from "@/context/AppContext";

export function MessagesPage() {
  const { user, bookings, clientBookings, workerBookings } = useAppContext();

  // For MVP, conversations are derived from bookings
  const relevantBookings = user?.role === 'client' ? clientBookings : workerBookings;
  
  // Get unique counterparts (workers if client, clients if worker)
  const conversations = Array.from(new Set(relevantBookings.map(b => 
    user?.role === 'client' ? b.workerId : b.clientId
  ))).map(id => {
    const booking = relevantBookings.find(b => 
      (user?.role === 'client' ? b.workerId : b.clientId) === id
    );
    return {
      id,
      name: user?.role === 'client' ? booking?.workerName : booking?.clientName,
      lastMessage: "Click to view conversation",
      role: user?.role === 'client' ? 'Worker' : 'Client'
    };
  });

  return (
    <DashboardShell
      eyebrow="Communication"
      title="Messages"
      description="Stay in touch with your service professionals and manage job details."
    >
      <div className="space-y-3">
        {conversations.length > 0 ? (
          conversations.map((conv) => {
            const isClient = user?.role === 'client';
            
            return isClient ? (
              <Link 
                key={conv.id}
                to="/client/chat/$workerId"
                params={{ workerId: conv.id }}
                className="block surface-panel p-4 transition-all hover:bg-muted/50 border border-border/50 group"
              >
                <ConversationCard conv={conv} />
              </Link>
            ) : (
              <Link 
                key={conv.id}
                to="/worker/chat/$clientId"
                params={{ clientId: conv.id }}
                className="block surface-panel p-4 transition-all hover:bg-muted/50 border border-border/50 group"
              >
                <ConversationCard conv={conv} />
              </Link>
            );
          })
        ) : (
          <div className="surface-panel p-10 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <MessageSquare size={24} />
            </div>
            <p className="text-sm text-muted-foreground">No active conversations found. Start a chat from your bookings or worker profiles.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

function ConversationCard({ conv }: { conv: any }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
        <User size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground truncate">{conv.name}</h3>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {conv.role}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
      </div>
      <div className="flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
        <MessageSquare className="text-primary" size={20} />
        <span className="text-[10px] font-semibold text-primary">Chat</span>
      </div>
    </div>
  );
}
