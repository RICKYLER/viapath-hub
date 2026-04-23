import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { Link } from '@tanstack/react-router';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  action?: {
    label: string;
    link: string;
    params?: any;
  };
}

const CHAT_STORAGE_KEY = 'viapath_assistant_messages';

export const ServiceMatchmaker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { workers, user } = useAppContext();

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    } else {
      setMessages([
        {
          id: '1',
          text: user
            ? `Hi ${user.name}! I'm your ViaPathHub Assistant. What service are you looking for in Tagum City today?`
            : "Hi! I'm your ViaPathHub Assistant. Even without an account, I can help you find services! Would you like to find a professional or register to start booking?",
          sender: 'bot',
        },
      ]);
    }
  }, [user]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const clearChat = () => {
    const initialMsg: Message = {
      id: '1',
      text: "Chat cleared! How can I help you now?",
      sender: 'bot',
    };
    setMessages([initialMsg]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let responseText = "I can help you find someone! Try searching for 'Plumbing', 'Massage', or 'Cleaning'. You can also ask about 'Safety' or 'Payments'.";
      let action: { label: string; link: string; params?: any } | undefined;

      // Expanded intelligence logic
      if (lowerInput.includes('plumb') || lowerInput.includes('plum') || lowerInput.includes('tubero')) {
        const plumber = workers.find(w => w.service === 'Plumbing');
        responseText = "I found expert plumbers like Rogelio in Visayan Village and Michael in Cuambogan. They are highly rated for quick repairs!";
        if (plumber) {
          action = { label: "View Profiles", link: "/client/workers" as any, params: {} };
        }
      } else if (lowerInput.includes('mass') || lowerInput.includes('masege') || lowerInput.includes('hilot')) {
        const therapist = workers.find(w => w.service === 'Massage Therapy');
        responseText = "Lina Mae Torres is a certified DOH licensed therapist in Tagum. She offers home services and post-work recovery sessions.";
        if (therapist) {
          action = { label: "View Lina's Profile", link: "/client/workers/$workerId", params: { workerId: therapist.id } };
        }
      } else if (lowerInput.includes('elect') || lowerInput.includes('kuryente') || lowerInput.includes('light')) {
        const electrician = workers.find(w => w.service === 'Electrician');
        responseText = "Elena Rossi is our top-rated electrician in Apokon. She is licensed for residential and commercial electrical systems.";
        if (electrician) {
          action = { label: "View Elena's Profile", link: "/client/workers/$workerId", params: { workerId: electrician.id } };
        }
      } else if (lowerInput.includes('clean') || lowerInput.includes('limpyo')) {
        const cleaner = workers.find(w => w.service === 'Cleaning');
        responseText = "David Chen in Magugpo North specializes in professional deep cleaning and upholstery. Perfect for homes and offices!";
        if (cleaner) {
          action = { label: "View David's Profile", link: "/client/workers/$workerId", params: { workerId: cleaner.id } };
        }
      } else if (lowerInput.includes('safe') || lowerInput.includes('trust') || lowerInput.includes('verify') || lowerInput.includes('badge')) {
        responseText = "ViaPathHub prioritizes your safety. Look for the Blue Badges on profiles which indicate ID Verification, Police Clearance, and Barangay Clearance.";
        action = { label: "How Safety Works", link: "/" as any, params: {} };
      } else if (lowerInput.includes('pay') || lowerInput.includes('price') || lowerInput.includes('money') || lowerInput.includes('gcash')) {
        responseText = "We support GCash, Maya, and Credit Cards. All payments are held in Escrow, meaning we only pay the worker once you confirm the job is done.";
        action = { label: "View Payment Options", link: "/client/bookings" as any, params: {} };
      } else if (lowerInput.includes('escrow') || lowerInput.includes('guarantee')) {
        responseText = "Our Escrow Guarantee ensures your money is safe. If a worker doesn't show up or the work is poor, we can help with refunds before funds are released.";
      } else if (lowerInput.includes('barangay') || lowerInput.includes('location') || lowerInput.includes('near')) {
        responseText = "You can filter workers by Tagum barangays like Mankilam, Apokon, and Visayan Village on the search page.";
        action = { label: "Search by Barangay", link: "/client/workers" as any, params: {} };
      } else if (lowerInput.includes('book') || lowerInput.includes('sched')) {
        if (!user) {
          responseText = "To book a worker, you'll need to create a free account first! It only takes a minute.";
          action = { label: "Register Now", link: "/register" as any, params: {} };
        } else {
          responseText = "You can manage all your bookings in your Dashboard. You'll see the status of each job there.";
          action = { label: "Go to My Bookings", link: "/client/bookings" as any, params: {} };
        }
      } else if (lowerInput.includes('cancel')) {
        responseText = "To cancel a booking, just go to your Bookings list and click the 'Cancel' button on the specific job card.";
        action = { label: "View My Bookings", link: "/client/bookings" as any, params: {} };
      } else if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('help')) {
        responseText = "I'm here to help you find the best services in Tagum City! Ask me about 'Cleaning', 'Plumbing', or how our 'Escrow Guarantee' works.";
      } else if (lowerInput.includes('thank')) {
        responseText = "You're very welcome! Let me know if you need anything else for your home today.";
      }

      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: responseText, sender: 'bot', action }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] max-h-[500px] bg-card border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">ViaPath Assistant</p>
                <p className="text-[10px] opacity-80 flex items-center gap-1">
                  <Sparkles size={10} /> AI Matchmaker
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button onClick={clearChat} variant="ghost" size="icon" className="h-7 w-7 hover:bg-white/10 text-white/70" title="Clear Chat">
                <X size={14} className="rotate-45" />
              </Button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {!user && (
            <div className="bg-primary/5 p-3 border-b border-primary/10 flex items-center justify-between gap-2">
              <p className="text-[10px] font-medium text-primary uppercase tracking-tight">Create an account to book workers</p>
              <div className="flex gap-1">
                <Button asChild variant="link" size="sm" className="h-6 text-[10px] p-0 px-2">
                  <Link to="/register">Login</Link>
                </Button>
                <Button asChild variant="default" size="sm" className="h-6 text-[10px] p-0 px-2 rounded-full">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            </div>
          )}

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-2 max-w-[85%]", msg.sender === 'user' ? "ml-auto flex-row-reverse" : "")}>
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1", msg.sender === 'bot' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                  {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="space-y-2">
                  <div className={cn("p-3 rounded-2xl text-sm shadow-sm", msg.sender === 'bot' ? "bg-muted rounded-tl-none text-foreground" : "bg-primary text-primary-foreground rounded-tr-none")}>
                    {msg.text}
                  </div>
                  {msg.action && (
                    <Button asChild size="sm" variant="outline" className="w-full text-xs h-8 bg-background/50 border-primary/20 hover:border-primary/40">
                      <Link to={msg.action.link as any} params={msg.action.params}>
                        {msg.action.label}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                  <Bot size={14} />
                </div>
                <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2 bg-muted/30">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a service..."
              className="h-9 text-sm bg-background"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
              <Send size={16} />
            </Button>
          </form>
        </div>
      )}


      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-95",
          isOpen ? "bg-muted text-muted-foreground rotate-90" : "bg-primary text-primary-foreground hover:scale-105"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background animate-pulse" />
        )}
      </button>
    </div>
  );
};
