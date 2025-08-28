// hooks/useConversationHistory.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api";
import { ConversationHistory } from "./useConversationManagement";

export interface ConversationHistoryResponse {
  conversationId: string;
  messages: Array<{
    id: string;
    content: string;
    type: string;
    createdAt: string;
    metadata?: {
      processingTime?: number;
      retrievedDocsCount?: number;
      timestamp?: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export function useConversationHistory() {
  return useMutation({
    mutationFn: async (
      conversationId: string
    ): Promise<ConversationHistoryResponse> => {
      try {
        const response = await apiClient.get<ConversationHistoryResponse>(
          `/chat/history/${conversationId}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching conversation history:", error);
        // Return a fallback response with empty messages
        return {
          conversationId,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    },
  });
}

export function useConversationHistoryQuery(
  conversationId: string,
  enabled = true
) {
  return useQuery({
    queryKey: ["conversationHistory", conversationId],
    queryFn: async (): Promise<ConversationHistoryResponse> => {
      const response = await apiClient.get<ConversationHistoryResponse>(
        `/chat/history/${conversationId}`
      );
      return response.data;
    },
    enabled: !!conversationId && enabled,
  });
}

export function usePaginatedConversationHistory(
  conversationId: string,
  limit?: number,
  offset?: number
) {
  return useQuery({
    queryKey: ["conversationHistory", conversationId, limit, offset],
    queryFn: async (): Promise<ConversationHistory> => {
      const params = new URLSearchParams();
      if (limit) params.append("limit", limit.toString());
      if (offset) params.append("offset", offset.toString());

      const response = await apiClient.get<ConversationHistory>(
        `/chat/history/${conversationId}?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!conversationId,
  });
}

export function useClearConversation() {
  return useMutation({
    mutationFn: async (conversationId: string): Promise<boolean> => {
      try {
        const response = await apiClient.delete(
          `/chat/conversations/${conversationId}/messages`
        );
        return response.status === 204;
      } catch (error) {
        console.error("Error clearing conversation:", error);
        return false;
      }
    },
  });
}
