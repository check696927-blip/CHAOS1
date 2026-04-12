import { ChatSession, ChatMessage, AUTO_RESPONSES } from "@/types/chat";

const CHAT_SESSIONS_KEY = 'chaos_chat_sessions';

export const createChatSession = (userId: string): ChatSession => {
  const session: ChatSession = {
    id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    messages: [
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        content: "Hi there! 👋 I'm here to help. Ask me about shipping, returns, sizing, or anything else!",
        timestamp: new Date()
      }
    ],
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const sessions = getAllChatSessions();
  sessions.push(session);
  localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));

  return session;
};

export const getUserChatSessions = (userId: string): ChatSession[] => {
  const sessions = getAllChatSessions();
  return sessions
    .filter(s => s.userId === userId)
    .map(s => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
      messages: s.messages.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }))
    }))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

export const getActiveChatSession = (userId: string): ChatSession | null => {
  const sessions = getUserChatSessions(userId);
  return sessions.find(s => s.status === 'active') || null;
};

export const getAllChatSessions = (): ChatSession[] => {
  const stored = localStorage.getItem(CHAT_SESSIONS_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const addMessage = (sessionId: string, content: string, sender: 'user' | 'agent' | 'bot', attachment?: ChatMessage['attachment']): void => {
  const sessions = getAllChatSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (session) {
    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender,
      content,
      timestamp: new Date(),
      attachment
    };

    session.messages.push(message);
    session.updatedAt = new Date();

    // Auto-respond if user message
    if (sender === 'user') {
      const autoResponse = findAutoResponse(content);
      if (autoResponse) {
        setTimeout(() => {
          const botMessage: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            sender: 'bot',
            content: autoResponse,
            timestamp: new Date()
          };
          session.messages.push(botMessage);
          localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
        }, 1000);
      } else {
        // No auto-response, offer agent
        setTimeout(() => {
          const botMessage: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            sender: 'bot',
            content: "I don't have a quick answer for that. Would you like me to connect you with a live agent? 🙋‍♂️",
            timestamp: new Date()
          };
          session.messages.push(botMessage);
          localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
        }, 1000);
      }
    }

    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
  }
};

export const findAutoResponse = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  for (const response of AUTO_RESPONSES) {
    if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return response.response;
    }
  }
  
  return null;
};

export const closeSession = (sessionId: string): void => {
  const sessions = getAllChatSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (session) {
    session.status = 'closed';
    session.updatedAt = new Date();
    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
  }
};

export const isAgentOnline = (): boolean => {
  // Simulate agent availability (9am-9pm)
  const hour = new Date().getHours();
  return hour >= 9 && hour < 21;
};
