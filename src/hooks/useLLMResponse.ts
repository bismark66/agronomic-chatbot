import { useMutation } from "@tanstack/react-query";
import { AgroResponse } from "../types";
import { apiClient } from "../lib/api";

interface SendMessageRequest {
  question: string;
  sessionId: string;
  images?: string[];
}

interface SendFollowUpRequest {
  question: string;
  conversationId: string; // Changed from sessionId to conversationId to match backend
  images?: string[];
}

// Define the expected response type from your backend
interface BackendResponse {
  question: string;
  answer: string;
  conversationId?: string; // Added for follow-up responses
  timestamp: string;
  history?: any[]; // Added for conversation history
}

// Function to transform backend response to AgroResponse
const transformBackendResponse = (
  backendResponse: BackendResponse
): AgroResponse => {
  return {
    text: backendResponse.answer,
    conversationId: backendResponse.conversationId, // Pass through conversation ID
    timestamp: backendResponse.timestamp,
  };
};

export function useLLMResponse() {
  return useMutation({
    mutationFn: async ({
      question,
      sessionId,
      images,
    }: SendMessageRequest): Promise<AgroResponse> => {
      try {
        const response = await apiClient.post<BackendResponse>("/chat/ask", {
          question,
          // sessionId can be used as conversationId if needed
          // conversationId: sessionId, // Uncomment if you want to use sessionId as conversationId
        });

        return transformBackendResponse(response.data);
      } catch (error) {
        console.error("Error calling LLM API:", error);
        return mockAgroResponse(question);
      }
    },
  });
}

// New mutation for follow-up questions
export function useLLMFollowUp() {
  return useMutation({
    mutationFn: async ({
      question,
      conversationId,
      images,
    }: SendFollowUpRequest): Promise<AgroResponse> => {
      try {
        const response = await apiClient.post<BackendResponse>(
          `/chat/follow-up/${conversationId}`,
          {
            question,
          }
        );

        return transformBackendResponse(response.data);
      } catch (error) {
        console.error("Error calling LLM follow-up API:", error);
        return mockAgroResponse(question);
      }
    },
  });
}

// Optional: Mutation to get conversation history
export function useConversationHistory() {
  return useMutation({
    mutationFn: async (conversationId: string): Promise<any> => {
      try {
        const response = await apiClient.get(`/chat/history/${conversationId}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching conversation history:", error);
        return { messages: [] };
      }
    },
  });
}

// Optional: Mutation to clear conversation history
export function useClearConversation() {
  return useMutation({
    mutationFn: async (conversationId: string): Promise<boolean> => {
      try {
        const response = await apiClient.delete(
          `/chat/history/${conversationId}`
        );
        return response.data.success;
      } catch (error) {
        console.error("Error clearing conversation:", error);
        return false;
      }
    },
  });
}

// Mock response function (updated to include conversationId)
const mockAgroResponse = (
  question: string,
  conversationId?: string
): AgroResponse => {
  const isAboutFertilizer =
    question.toLowerCase().includes("fertilizer") ||
    question.toLowerCase().includes("nutrient");
  const isAboutPest =
    question.toLowerCase().includes("pest") ||
    question.toLowerCase().includes("disease");

  let response: AgroResponse = {
    text: `Based on your query about "${question}", I recommend conducting a soil analysis first. This will help determine the specific nutritional needs of your crops and allow for precise fertilizer application.`,
    conversationId: conversationId || "mock-conversation-id",
    timestamp: new Date().toISOString(),
  };

  if (isAboutFertilizer) {
    response.text =
      "Here's a comprehensive fertilizer recommendation based on typical crop requirements:";
    response.tables = [
      {
        headers: ["Nutrient", "Application Rate (kg/ha)", "Timing", "Method"],
        rows: [
          [
            "Nitrogen (N)",
            "120-150",
            "Pre-planting & Mid-season",
            "Broadcast & Side-dress",
          ],
          ["Phosphorus (P)", "60-80", "Pre-planting", "Incorporate into soil"],
          ["Potassium (K)", "80-100", "Pre-planting", "Broadcast"],
          ["Sulfur (S)", "20-30", "Pre-planting", "Mix with other fertilizers"],
        ],
        caption: "Recommended fertilizer application rates for corn production",
      },
    ];
    response.alerts = [
      {
        level: "info",
        message:
          "Always perform soil testing before fertilizer application to avoid over-fertilization.",
      },
    ];
  }

  if (isAboutPest) {
    response.text =
      "Integrated Pest Management (IPM) is the most effective approach for sustainable pest control:";
    response.alerts = [
      {
        level: "warning",
        message:
          "Early detection and prevention are key to effective pest management.",
      },
    ];
  }

  return response;
};