'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Summary } from '@/lib/types';
import { summaryStorage } from '@/lib/storage';
import { formatDate } from '@/lib/utils';
import {
  exportToPDF,
  exportToMarkdown,
  exportToText,
} from '@/lib/export';
import { SummaryPanel } from '@/app/components/SummaryPanel';
import { EditSummary } from '@/app/components/EditSummary';
import { KeyDecisions } from '@/app/components/KeyDecisions';
import { ActionItems } from '@/app/components/ActionItems';
import { AttendeeList } from '@/app/components/AttendeeList';
import { TopicsCloud } from '@/app/components/TopicsCloud';
import { SentimentAnalysis } from '@/app/components/SentimentAnalysis';

export default function SummaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [summary, setSummary] = useState<Summary | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (id) {
      const s = summaryStorage.getById(id);
      if (s) {
        setSummary(s);
      }
    }
  }, [id]);

  const handleSave = (updated: Summary) => {
    summaryStorage.save(updated);
    setSummary(updated);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this summary?')) {
      summaryStorage.delete(id);
      router.push('/history');
    }
  };

  const handleExport = (format: 'pdf' | 'markdown' | 'txt') => {
    if (!summary) return;
    try {
      if (format === 'pdf') {
        exportToPDF(summary);
      } else if (format === 'markdown') {
        exportToMarkdown(summary);
      } else if (format === 'txt') {
        exportToText(summary);
      }
    } catch (err) {
      alert('Failed to export summary');
    }
  };

  if (!mounted) {
    return <div className="flex-1 bg-white dark:bg-gray-950 p-8">Loading...</div>;
  }

  if (!summary) {
    return (
      <div className="flex-1 bg-white dark:bg-gray-950 p-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Summary not found
          </p>
          <Link
            href="/history"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/history"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-4 inline-block"
          >
            ← Back to History
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Summary Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {formatDate(summary.createdAt)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
          >
            {isEditing ? '✕ Cancel' : '✏️ Edit'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            🗑️ Delete
          </button>
          {!isEditing && (
            <div className="col-span-2 flex gap-2">
              <button
                onClick={() => handleExport('pdf')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                📄 PDF
              </button>
              <button
                onClick={() => handleExport('markdown')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                📝 Markdown
              </button>
              <button
                onClick={() => handleExport('txt')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                📄 Text
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-950">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Summary
            </h2>
            <EditSummary
              summary={summary}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <SummaryPanel
            summary={summary}
            onExport={handleExport}
          >
            {(tab) => {
              switch (tab) {
                case 'overview':
                  return (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Summary
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {summary.summary}
                        </p>
                      </div>
                    </div>
                  );

                case 'decisions':
                  return (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Key Decisions
                        </h3>
                        <KeyDecisions decisions={summary.keyDecisions} />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Action Items
                        </h3>
                        <ActionItems
                          items={summary.actionItems}
                          onToggle={(id) => {
                            const updated = {
                              ...summary,
                              actionItems: summary.actionItems.map((item) =>
                                item.id === id
                                  ? { ...item, completed: !item.completed }
                                  : item
                              ),
                            };
                            setSummary(updated);
                            summaryStorage.save(updated);
                          }}
                        />
                      </div>
                    </div>
                  );

                case 'actions':
                  return (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Action Items
                      </h3>
                      <ActionItems
                        items={summary.actionItems}
                        onToggle={(id) => {
                          const updated = {
                            ...summary,
                            actionItems: summary.actionItems.map((item) =>
                              item.id === id
                                ? { ...item, completed: !item.completed }
                                : item
                            ),
                          };
                          setSummary(updated);
                          summaryStorage.save(updated);
                        }}
                      />
                    </div>
                  );

                case 'details':
                  return (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Attendees & Duration
                        </h3>
                        <AttendeeList
                          attendees={summary.attendees}
                          duration={summary.duration}
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Topics Discussed
                        </h3>
                        <TopicsCloud topics={summary.topics} />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Meeting Sentiment
                        </h3>
                        <SentimentAnalysis
                          tone={summary.sentiment.tone}
                          score={summary.sentiment.score}
                        />
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            }}
          </SummaryPanel>
        )}
      </div>
    </div>
  );
}
