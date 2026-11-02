import { apiClient } from './client';

// Schema Interfaces matched with Backend (app/schemas/agent.py & rag.py)

export interface Citation {
  document_id: string;
  chunk_id?: string;
  filename?: string;
  relevance_score?: number;
  content_snippet?: string;
}

export interface AgentQuery {
  query: string;
  limit?: number;
  filters?: Record<string, any>;
}

export interface AgentResponse {
  answer: string;
  citations: Citation[];
  used_tools: string[];
  intent: string;
  errors?: string[]; // Although backend agent adds this to state, maybe the endpoint returns it or we just consume it if there. 
}

export const agentApi = {
  /**
   * Queries the Intelli-CA Agent
   */
  queryAgent: async (request: AgentQuery): Promise<AgentResponse> => {
    const response = await apiClient.post<AgentResponse>('/agent/query', request);
    return response.data;
  },
};
