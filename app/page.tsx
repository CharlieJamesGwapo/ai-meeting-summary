'use client';

import { useState, useEffect } from 'react';
import { Summary, SummaryResponse } from '@/lib/types';
import { summaryStorage, settingsStorage } from '@/lib/storage';
import { generateId, formatDate } from '@/lib/utils';
import { summarizeTranscript } from '@/lib/openai';
import {
  exportToPDF,
  exportToMarkdown,
  exportToText,
} from '@/lib/export';
import { TranscriptInput } from './components/TranscriptInput';
import { SummarizeButton } from './components/SummarizeButton';
import { SaveButton } from './components/SaveButton';
import { SummaryPanel } from './components/SummaryPanel';
import { EditSummary } from './components/EditSummary';
import { KeyDecisions } from './components/KeyDecisions';
import { ActionItems } from './components/ActionItems';
import { AttendeeList } from './components/AttendeeList';
import { TopicsCloud } from './components/TopicsCloud';
import { SentimentAnalysis } from './components/SentimentAnalysis';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load theme on mount
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      setError('Please enter a transcript to summarize.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const settings = settingsStorage.get();
      if (!settings.apiKey) {
        throw new Error(
          'OpenAI API key is not set. Please go to Settings to add your API key.'
        );
      }

      const response = await summarizeTranscript({
        transcript,
        apiKey: settings.apiKey,
      });

      const newSummary: Summary = {
        id: generateId(),
        transcript,
        summary: response.summary,
        keyDecisions: response.keyDecisions,
        actionItems: response.actionItems,
        attendees: response.attendees,
        topics: response.topics,
        sentiment: response.sentiment,
        duration: response.duration,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setSummary(newSummary);
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to summarize transcript'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (summary) {
      summaryStorage.save(summary);
      setError('');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSave = (updated: Summary) => {
    setSummary(updated);
    setIsEditing(false);
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
      setError('Failed to export summary');
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Sticky Input */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Meeting Summary
              </h1>

              <TranscriptInput value={transcript} onChange={setTranscript} />

              {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              <SummarizeButton
                onClick={handleSummarize}
                disabled={!transcript.trim()}
                isLoading={isLoading}
              />

              {summary && (
                <>
                  <SaveButton
                    onClick={handleSave}
                    disabled={false}
                  />
                  <button
                    onClick={handleEdit}
                    className="w-full px-6 py-3 rounded-lg font-medium bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                </>
              )}

              {summary && (
                <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                  <p>Summarized: {formatDate(summary.createdAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary Display */}
          <div className="lg:col-span-2">
            {summary && !isEditing ? (
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
            ) : summary && isEditing ? (
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-950">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Edit Summary
                </h2>
                <EditSummary
                  summary={summary}
                  onSave={handleEditSave}
                  onCancel={() => setIsEditing(false)}
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-lg p-8 text-center">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Enter a transcript and click "Summarize" to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
