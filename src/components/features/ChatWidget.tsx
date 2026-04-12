import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Paperclip, User, Bot, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { 
  createChatSession, 
  getActiveChatSession, 
  addMessage, 
  isAgentOnline 
} from "@/lib/chat";
import { ChatSession } from "@/types/chat";

export const ChatWidget = () => {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState("");
  const [agentOnline, setAgentOnline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAgentOnline(isAgentOnline());
    const interval = setInterval(() => {
      setAgentOnline(isAgentOnline());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user && open) {
      const activeSession = getActiveChatSession(user.id);
      if (activeSession) {
        setSession(activeSession);
      } else {
        const newSession = createChatSession(user.id);
        setSession(newSession);
      }
    }
  }, [user, open]);

  useEffect(() => {
    if (session && open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [session?.messages, open, minimized]);

  const handleSend = () => {
    if (!message.trim() || !session) return;

    addMessage(session.id, message, 'user');
    setMessage("");

    // Refresh session
    setTimeout(() => {
      if (user) {
        const updated = getActiveChatSession(user.id);
        setSession(updated);
      }
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-chaos-purple to-chaos-red hover:from-chaos-red hover:to-chaos-pink text-white p-4 rounded-full shadow-lg neon-box-glow transition-all hover:scale-110 group"
      >
        <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        {agentOnline && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-chaos-darker animate-pulse"></span>
        )}
      </button>
    );
  }

  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-chaos-dark border-2 border-chaos-purple rounded-lg shadow-xl w-80 animate-in slide-in-from-bottom-5">
        <div className="flex items-center justify-between p-4 border-b border-chaos-purple/30">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-chaos-purple" />
            <span className="font-neon font-bold">Support Chat</span>
            {agentOnline && (
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMinimized(false)}
              className="p-1 hover:bg-chaos-purple/20 rounded transition-all"
            >
              <ChevronDown className="w-5 h-5 rotate-180" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-chaos-red/20 rounded transition-all"
            >
              <X className="w-5 h-5 text-chaos-red" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-chaos-dark border-2 border-chaos-purple rounded-lg shadow-xl w-96 h-[600px] flex flex-col animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-chaos-purple/30 bg-gradient-to-r from-chaos-purple/20 to-chaos-red/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-chaos-purple" />
            {agentOnline && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-chaos-dark animate-pulse"></span>
            )}
          </div>
          <div>
            <h3 className="font-neon font-bold">CHAOS Support</h3>
            <p className="text-xs text-gray-400">
              {agentOnline ? '🟢 Agents online' : '🔴 Currently offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMinimized(true)}
            className="p-1 hover:bg-chaos-purple/20 rounded transition-all"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-chaos-red/20 rounded transition-all"
          >
            <X className="w-5 h-5 text-chaos-red" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-chaos-darker/50">
        {!isAuthenticated ? (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">Please sign in to chat with support</p>
          </div>
        ) : session ? (
          <>
            {session.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user' 
                    ? 'bg-chaos-purple' 
                    : msg.sender === 'agent'
                    ? 'bg-chaos-cyan'
                    : 'bg-chaos-red'
                }`}>
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className={`flex-1 max-w-[80%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block rounded-lg px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-chaos-purple text-white'
                      : 'bg-chaos-dark border border-gray-700'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    {msg.attachment && (
                      <div className="mt-2 p-2 bg-chaos-darker rounded border border-gray-700">
                        <p className="text-xs text-chaos-cyan">{msg.attachment.name}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3 animate-pulse" />
            <p className="text-gray-400">Loading chat...</p>
          </div>
        )}
      </div>

      {/* Input */}
      {isAuthenticated && (
        <div className="p-4 border-t border-chaos-purple/30">
          <div className="flex items-end gap-2">
            <button className="p-2 hover:bg-chaos-purple/20 rounded-lg transition-all">
              <Paperclip className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full bg-chaos-darker border-2 border-chaos-purple/30 focus:border-chaos-cyan rounded-lg px-3 py-2 outline-none resize-none text-sm"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="bg-chaos-purple hover:bg-chaos-red disabled:bg-gray-700 text-white p-2 rounded-lg transition-all disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
};
