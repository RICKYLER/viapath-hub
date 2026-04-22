import { createFileRoute } from "@tanstack/react-router";
import { ChatInterface } from "@/components/ChatInterface";
import { DashboardShell } from "@/layouts/DashboardShell";
import { useAppContext } from "@/context/AppContext";

export const Route = createFileRoute("/worker/chat/$clientId")({
  component: WorkerChatRoute,
});

function WorkerChatRoute() {
  const { clientId } = Route.useParams();
  const { bookings, user } = useAppContext();
  
  // Find the client name from bookings
  const booking = bookings.find(b => b.clientId === clientId);
  const clientName = booking?.clientName || "Client";

  if (!user) {
    return (
      <DashboardShell 
        title="Chat" 
        eyebrow="Communication" 
        description="Connect with your clients."
      >
        <div className="surface-panel p-6 text-sm text-muted-foreground">
          Unable to load chat.
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      eyebrow="Communication"
      title={`Chat with ${clientName}`}
      description="Coordinate job specifics and scheduling with your client."
    >
      <div className="max-w-3xl mx-auto">
        <ChatInterface 
          recipientId={clientId}
          recipientName={clientName}
          currentUserId={user.id}
          initialMessages={[
            {
              id: '1',
              senderId: clientId,
              senderName: clientName,
              content: `Hi! I have a question about the service.`,
              timestamp: '10:00 AM',
              isMe: false
            }
          ]}
        />
      </div>
    </DashboardShell>
  );
}
