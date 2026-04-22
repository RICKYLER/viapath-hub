import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

interface ChatInterfaceProps {
  recipientId: string;
  recipientName: string;
  currentUserId: string;
  initialMessages?: Message[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  recipientId, 
  recipientName, 
  currentUserId,
  initialMessages = []
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: 'Me',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[500px] surface-panel overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <User size={20} />
        </div>
        <div>
          <h3 className="font-bold text-foreground">{recipientName}</h3>
          <p className="text-xs text-success flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
            Online
          </p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5 scroll-smooth"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex flex-col max-w-[80%]",
              msg.isMe ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div 
              className={cn(
                "px-4 py-2 rounded-2xl text-sm shadow-sm",
                msg.isMe 
                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                  : "bg-surface text-foreground border border-border rounded-tl-none"
              )}
            >
              {msg.content}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}
      </div>

      <form 
        onSubmit={handleSendMessage}
        className="p-4 border-t border-border bg-surface flex gap-2"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" className="shrink-0">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};
