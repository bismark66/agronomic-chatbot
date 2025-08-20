import { useMutation } from "@tanstack/react-query";
import { AgroResponse } from "../types";
import { apiClient } from "../lib/api";

interface SendMessageRequest {
  question: string; // Changed to match backend expectation
  sessionId: string;
  images?: string[];
}

// Define the expected response type from your backend
interface BackendResponse {
  question: string;
  answer: string;
  timestamp: string;
}

// Function to transform backend response to AgroResponse
const transformBackendResponse = (
  backendResponse: BackendResponse
): AgroResponse => {
  return {
    text: backendResponse.answer,
  };
};

export function useLLMResponse() {
  return useMutation({
    mutationFn: async ({
      question, // Now matches the interface
      sessionId,
      images,
    }: SendMessageRequest): Promise<AgroResponse> => {
      try {
        // Use your apiClient - now the field names match
        const response = await apiClient.post<BackendResponse>("/chat/ask", {
          question, // No mapping needed now
          // sessionId,
          // images,
        });

        return transformBackendResponse(response.data);
      } catch (error) {
        console.error("Error calling LLM API:", error);

        // Fallback to mock response
        return mockAgroResponse(question); // Use question instead of message
      }
    },
  });
}

// Mock response function
const mockAgroResponse = (question: string): AgroResponse => {
  const isAboutFertilizer =
    question.toLowerCase().includes("fertilizer") ||
    question.toLowerCase().includes("nutrient");
  const isAboutPest =
    question.toLowerCase().includes("pest") ||
    question.toLowerCase().includes("disease");

  let response: AgroResponse = {
    text: `Based on your query about "${question}", I recommend conducting a soil analysis first. This will help determine the specific nutritional needs of your crops and allow for precise fertilizer application.`,
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
