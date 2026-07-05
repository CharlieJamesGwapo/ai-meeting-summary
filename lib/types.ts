export interface ActionItem {
  id: string;
  text: string;
  assignee?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface Summary {
  id: string;
  transcript: string;
  summary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  attendees: string[];
  topics: string[];
  sentiment: {
    tone: string;
    score: number;
  };
  duration: string;
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  apiKey: string;
  theme: 'light' | 'dark' | 'system';
  defaultExportFormat: 'pdf' | 'markdown' | 'txt';
}

export interface SummaryRequest {
  transcript: string;
  apiKey: string;
}

export interface SummaryResponse {
  summary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  attendees: string[];
  topics: string[];
  sentiment: {
    tone: string;
    score: number;
  };
  duration: string;
}
