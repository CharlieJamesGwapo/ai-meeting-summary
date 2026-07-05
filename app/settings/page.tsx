'use client';

import { useEffect, useState } from 'react';
import { settingsStorage } from '@/lib/storage';
import { Settings } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    apiKey: '',
    theme: 'system',
    defaultExportFormat: 'pdf',
  });
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loaded = settingsStorage.get();
    setSettings(loaded);
  }, []);

  const handleSave = () => {
    settingsStorage.save(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!mounted) {
    return <div className="flex-1 bg-white dark:bg-gray-950 p-8">Loading...</div>;
  }

  return (
    <div className="flex-1 bg-white dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          ⚙️ Settings
        </h1>

        <div className="space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">💡 Client-side Storage</p>
            <p>
              All data is stored locally in your browser. No data is sent to any
              server. Clear your browser data to delete all summaries.
            </p>
          </div>

          {/* OpenAI API Key */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) =>
                setSettings({ ...settings, apiKey: e.target.value })
              }
              placeholder="sk-..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Get your API key from{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  theme: e.target.value as 'light' | 'dark' | 'system',
                })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Default Export Format */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Default Export Format
            </label>
            <select
              value={settings.defaultExportFormat}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultExportFormat: e.target.value as
                    | 'pdf'
                    | 'markdown'
                    | 'txt',
                })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF</option>
              <option value="markdown">Markdown</option>
              <option value="txt">Text</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                saved
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saved ? '✅ Saved!' : '💾 Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
