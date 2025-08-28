// hooks/useConversationManagement.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api";

export interface BackendConversation {
  id: string;
  title: string;
  userId?: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  messages: BackendMessage[];
}

export interface BackendMessage {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  type: string;
  context: any;
  metadata: any;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}

export interface ConversationStats {
  conversationId: string;
  messageCount: number;
  firstMessageDate: string;
  lastMessageDate: string;
}

export interface ConversationHistory {
  messages: unknown[];
  hasMore: boolean;
  total: number;
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: {
      title?: string;
      // userId?: string;
    }): Promise<{ conversationId: string }> => {
      const response = await apiClient.post<{ conversationId: string }>(
        "/chat/conversations",
        dto
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useConversations(userId?: string, limit: number = 10) {
  return useQuery({
    queryKey: ["conversations", userId, limit],
    queryFn: async (): Promise<Conversation[]> => {
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);
      params.append("limit", limit.toString());

      // const response = await apiClient.get<Conversation[]>(
      //   `/chat/conversations?${params.toString()}`
      // );
      const response = await apiClient.get<BackendConversation[]>(
        `/chat/conversations?${params.toString()}`
      );
      console.log("Fetched conversations:", response.data); // Debug log
      return response.data;
    },
  });
}

export function useConversationStats(conversationId: string) {
  return useQuery({
    queryKey: ["conversationStats", conversationId],
    queryFn: async (): Promise<ConversationStats> => {
      const response = await apiClient.get<ConversationStats>(
        `/chat/conversations/${conversationId}/stats`
      );
      return response.data;
    },
    enabled: !!conversationId,
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string): Promise<void> => {
      await apiClient.delete(`/chat/conversations/${conversationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useClearConversationHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string): Promise<void> => {
      await apiClient.delete(`/chat/conversations/${conversationId}/messages`);
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: ["conversationHistory", conversationId],
      });
    },
  });
}
