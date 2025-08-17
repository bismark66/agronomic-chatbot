import { useAtom } from 'jotai';
import { sessionsAtom, activeSessionAtom } from '../store/chatStore';
import { ChatSession, Message } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useChatHistory() {
  const [sessions, setSessions] = useAtom(sessionsAtom);
  const [activeSessionId, setActiveSessionId] = useAtom(activeSessionAtom);
  const queryClient = useQueryClient();

  const createSession = useMutation({
    mutationFn: async (): Promise<ChatSession> => {
      const newSession: ChatSession = {
        id: crypto.randomUUID(),
        title: `Chat ${sessions.length + 1}`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return newSession;
    },
    onSuccess: (newSession) => {
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    },
  });

  const updateSession = useMutation({
    mutationFn: async ({ sessionId, updates }: { sessionId: string; updates: Partial<ChatSession> }) => {
      return { sessionId, updates };
    },
    onSuccess: ({ sessionId, updates }) => {
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, ...updates, updatedAt: new Date() }
          : session
      ));
    },
  });

  const deleteSession = useMutation({
    mutationFn: async (sessionId: string) => {
      return sessionId;
    },
    onSuccess: (sessionId) => {
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      if (activeSessionId === sessionId) {
        const remainingSessions = sessions.filter(s => s.id !== sessionId);
        setActiveSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
      }
    },
  });

  const addMessage = (sessionId: string, message: Message) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId
        ? {
            ...session,
            messages: [...session.messages, message],
            updatedAt: new Date(),
          }
        : session
    ));
  };

  const updateSessionTitle = (sessionId: string, title: string) => {
    updateSession.mutate({ sessionId, updates: { title } });
  };

  const currentSession = sessions.find(s => s.id === activeSessionId);

  return {
    sessions,
    currentSession,
    activeSessionId,
    createSession: createSession.mutate,
    updateSessionTitle,
    deleteSession: deleteSession.mutate,
    addMessage,
    setActiveSession: setActiveSessionId,
    isCreatingSession: createSession.isPending,
  };
}