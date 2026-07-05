import { Summary, Settings } from './types';

const SUMMARIES_KEY = 'ai_meeting_summaries';
const SETTINGS_KEY = 'ai_meeting_settings';

export const summaryStorage = {
  getAll: (): Summary[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(SUMMARIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getById: (id: string): Summary | null => {
    const summaries = summaryStorage.getAll();
    return summaries.find((s) => s.id === id) || null;
  },

  save: (summary: Summary): void => {
    if (typeof window === 'undefined') return;
    const summaries = summaryStorage.getAll();
    const existingIndex = summaries.findIndex((s) => s.id === summary.id);
    if (existingIndex > -1) {
      summaries[existingIndex] = summary;
    } else {
      summaries.push(summary);
    }
    localStorage.setItem(SUMMARIES_KEY, JSON.stringify(summaries));
  },

  delete: (id: string): void => {
    if (typeof window === 'undefined') return;
    const summaries = summaryStorage.getAll();
    const filtered = summaries.filter((s) => s.id !== id);
    localStorage.setItem(SUMMARIES_KEY, JSON.stringify(filtered));
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SUMMARIES_KEY);
  },
};

export const settingsStorage = {
  get: (): Settings => {
    if (typeof window === 'undefined') {
      return {
        apiKey: '',
        theme: 'system',
        defaultExportFormat: 'pdf',
      };
    }
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data
        ? JSON.parse(data)
        : {
            apiKey: '',
            theme: 'system',
            defaultExportFormat: 'pdf',
          };
    } catch {
      return {
        apiKey: '',
        theme: 'system',
        defaultExportFormat: 'pdf',
      };
    }
  },

  save: (settings: Settings): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SETTINGS_KEY);
  },
};
