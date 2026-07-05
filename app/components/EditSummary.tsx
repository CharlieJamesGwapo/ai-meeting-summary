'use client';

import { useState } from 'react';
import { Summary } from '@/lib/types';

interface EditSummaryProps {
  summary: Summary;
  onSave: (updated: Summary) => void;
  onCancel: () => void;
}

export const EditSummary = ({
  summary,
  onSave,
  onCancel,
}: EditSummaryProps) => {
  const [editedSummary, setEditedSummary] = useState(summary.summary);
  const [editedDecisions, setEditedDecisions] = useState(
    summary.keyDecisions.join('\n')
  );

  const handleSave = () => {
    const updatedSummary: Summary = {
      ...summary,
      summary: editedSummary,
      keyDecisions: editedDecisions
        .split('\n')
        .map((d) => d.trim())
        .filter((d) => d.length > 0),
      updatedAt: Date.now(),
    };
    onSave(updatedSummary);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Summary
        </label>
        <textarea
          value={editedSummary}
          onChange={(e) => setEditedSummary(e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Key Decisions (one per line)
        </label>
        <textarea
          value={editedDecisions}
          onChange={(e) => setEditedDecisions(e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter each decision on a new line..."
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          💾 Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 font-medium transition-colors"
        >
          ✕ Cancel
        </button>
      </div>
    </div>
  );
};
