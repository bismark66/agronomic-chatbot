import { useAtom } from 'jotai';
import { sessionsAtom, activeSessionAtom } from '../store/chatStore';
import { ChatSession, Message } from '../types';
import { useMutation } from "@tanstack/react-query";

export function useChatHistory() {
  const [sessions, setSessions] = useAtom(sessionsAtom);
  const [activeSessionId, setActiveSessionId] = useAtom(activeSessionAtom);

  const createSession = (conversationId?: string): string => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      conversationId: conversationId, // Store conversationId with the session
    };

    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    return newSession.id;
  };

  const updateSession = useMutation({
    mutationFn: async ({
      sessionId,
      updates,
    }: {
      sessionId: string;
      updates: Partial<ChatSession>;
    }) => {
      return { sessionId, updates };
    },
    onSuccess: ({ sessionId, updates }) => {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? { ...session, ...updates, updatedAt: new Date() }
            : session
        )
      );
    },
  });

  const deleteSession = useMutation({
    mutationFn: async (sessionId: string) => {
      return sessionId;
    },
    onSuccess: (sessionId) => {
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      if (activeSessionId === sessionId) {
        const remainingSessions = sessions.filter((s) => s.id !== sessionId);
        setActiveSessionId(
          remainingSessions.length > 0 ? remainingSessions[0].id : null
        );
      }
    },
  });

  const addMessage = (sessionId: string, message: Message) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, message],
              updatedAt: new Date(),
            }
          : session
      )
    );
  };

  const updateSessionTitle = (sessionId: string, title: string) => {
    updateSession.mutate({ sessionId, updates: { title } });
  };

  const updateSessionConversationId = (
    sessionId: string,
    conversationId: string
  ) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, conversationId } : session
      )
    );
  };

  const currentSession = sessions.find((s) => s.id === activeSessionId);

  const loadMessagesIntoSession = (
    sessionId: string,
    messages: Message[],
    title: string
  ) => {
    setSessions((prev) => {
      const existingSession = prev.find((s) => s.id === sessionId);
      if (existingSession) {
        // Update existing session
        return prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages, title, updatedAt: new Date() }
            : s
        );
      } else {
        // Create new session
        return [
          ...prev,
          {
            id: sessionId,
            title,
            messages,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      }
    });
    setActiveSessionId(sessionId);
  };

  return {
    sessions,
    currentSession,
    activeSessionId,
    createSession: createSession,
    updateSessionTitle,
    deleteSession: deleteSession.mutate,
    addMessage,
    setActiveSession: setActiveSessionId,
    isCreatingSession: createSession.isPending,
    loadMessagesIntoSession,
    updateSessionConversationId,
  };
}