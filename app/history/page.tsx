'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Summary } from '@/lib/types';
import { summaryStorage } from '@/lib/storage';
import { formatDate, truncateText } from '@/lib/utils';

export default function HistoryPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const all = summaryStorage.getAll();
    const sorted = [...all].sort((a, b) => b.createdAt - a.createdAt);
    setSummaries(sorted);
  }, []);

  if (!mounted) {
    return <div className="flex-1 bg-white dark:bg-gray-950 p-8">Loading...</div>;
  }

  return (
    <div className="flex-1 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          📚 Saved Summaries
        </h1>

        {summaries.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-lg p-12 text-center">
            <p className="text-5xl mb-3">📭</p>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No saved summaries yet
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create your first summary
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {summaries.map((summary) => (
              <div
                key={summary.id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-800/20 transition-shadow"
              >
                <Link href={`/summary/${summary.id}`}>
                  <div className="cursor-pointer">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                      {truncateText(summary.summary, 100)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {truncateText(summary.transcript, 150)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(summary.createdAt)}
                      </span>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                        {summary.actionItems.length} action items
                      </span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this summary?')) {
                      summaryStorage.delete(summary.id);
                      setSummaries(summaries.filter((s) => s.id !== summary.id));
                    }
                  }}
                  className="mt-3 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
