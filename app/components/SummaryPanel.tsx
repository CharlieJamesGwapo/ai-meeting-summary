'use client';

import { useState } from 'react';
import { Summary } from '@/lib/types';

interface SummaryPanelProps {
  summary: Summary;
  children: (tab: string) => React.ReactNode;
  onExport?: (format: 'pdf' | 'markdown' | 'txt') => void;
}

export const SummaryPanel = ({
  summary,
  children,
  onExport,
}: SummaryPanelProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'decisions' | 'actions' | 'details'>('overview');

  const tabs = [
    { id: 'overview', label: '📋 Overview', icon: '📋' },
    { id: 'decisions', label: '🎯 Decisions & Actions', icon: '🎯' },
    { id: 'actions', label: '✅ Action Items', icon: '✅' },
    { id: 'details', label: '📊 Details', icon: '📊' },
  ];

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Summary
        </h2>
        {onExport && (
          <div className="flex gap-2">
            <button
              onClick={() => onExport('pdf')}
              className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              📄 PDF
            </button>
            <button
              onClick={() => onExport('markdown')}
              className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              📝 Markdown
            </button>
            <button
              onClick={() => onExport('txt')}
              className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              📄 Text
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 bg-white dark:bg-gray-950 min-h-96">
        {children(activeTab)}
      </div>
    </div>
  );
};
