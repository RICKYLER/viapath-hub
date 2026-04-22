import { createFileRoute } from "@tanstack/react-router";
import { ChatInterface } from "@/components/ChatInterface";
import { DashboardShell } from "@/layouts/DashboardShell";
import { useAppContext } from "@/context/AppContext";

export const Route = createFileRoute("/client/chat/$workerId")({
  component: ClientChatRoute,
});

function ClientChatRoute() {
  const { workerId } = Route.useParams();
  const { getWorkerById, user } = useAppContext();
  const worker = getWorkerById(workerId);

  if (!worker || !user) {
    return (
      <DashboardShell title="Chat">
        <div className="surface-panel p-6 text-sm text-muted-foreground">
          Unable to load chat.
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      eyebrow="Communication"
      title={`Chat with ${worker.name}`}
      description="Discuss job details, requirements, and timing directly with your service professional."
    >
      <div className="max-w-3xl mx-auto">
        <ChatInterface 
          recipientId={worker.id}
          recipientName={worker.name}
          currentUserId={user.id}
          initialMessages={[
            {
              id: '1',
              senderId: worker.id,
              senderName: worker.name,
              content: `Hi ${user.name}! Thanks for reaching out. How can I help you today?`,
              timestamp: '10:00 AM',
              isMe: false
            }
          ]}
        />
      </div>
    </DashboardShell>
  );
}
