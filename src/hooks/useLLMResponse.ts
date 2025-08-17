import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { AgroResponse } from '../types';

interface SendMessageRequest {
  message: string;
  sessionId: string;
  images?: string[];
}

// Mock API response for demo purposes
const mockAgroResponse = (message: string): AgroResponse => {
  const isAboutFertilizer = message.toLowerCase().includes('fertilizer') || 
                           message.toLowerCase().includes('nutrient');
  const isAboutPest = message.toLowerCase().includes('pest') || 
                      message.toLowerCase().includes('disease');
  
  let response: AgroResponse = {
    text: `Based on your query about "${message}", I recommend conducting a soil analysis first. This will help determine the specific nutritional needs of your crops and allow for precise fertilizer application.`,
  };

  if (isAboutFertilizer) {
    response.text = "Here's a comprehensive fertilizer recommendation based on typical crop requirements:";
    response.tables = [{
      headers: ['Nutrient', 'Application Rate (kg/ha)', 'Timing', 'Method'],
      rows: [
        ['Nitrogen (N)', '120-150', 'Pre-planting & Mid-season', 'Broadcast & Side-dress'],
        ['Phosphorus (P)', '60-80', 'Pre-planting', 'Incorporate into soil'],
        ['Potassium (K)', '80-100', 'Pre-planting', 'Broadcast'],
        ['Sulfur (S)', '20-30', 'Pre-planting', 'Mix with other fertilizers'],
      ],
      caption: 'Recommended fertilizer application rates for corn production'
    }];
    response.alerts = [{
      level: 'info',
      message: 'Always perform soil testing before fertilizer application to avoid over-fertilization.'
    }];
  }

  if (isAboutPest) {
    response.text = "Integrated Pest Management (IPM) is the most effective approach for sustainable pest control:";
    response.alerts = [{
      level: 'warning',
      message: 'Early detection and prevention are key to effective pest management.'
    }];
  }

  return response;
};

export function useLLMResponse() {
  return useMutation({
    mutationFn: async ({ message, sessionId, images }: SendMessageRequest): Promise<AgroResponse> => {
      // In a real application, this would call your RAG backend
      // For demo purposes, we're using a mock response
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      try {
        // Uncomment this for real API integration:
        // const response = await axios.post('/api/chat', {
        //   message,
        //   sessionId,
        //   images,
        // });
        // return response.data;
        
        return mockAgroResponse(message);
      } catch (error) {
        console.error('Error calling LLM API:', error);
        throw new Error('Failed to get response from AI advisor');
      }
    },
  });
}