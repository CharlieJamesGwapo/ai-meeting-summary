'use client';

import { useState } from 'react';
import { FileUploader } from './FileUploader';

interface TranscriptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TranscriptInput = ({ value, onChange }: TranscriptInputProps) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('paste')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'paste'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          📝 Paste Text
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'upload'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          📁 Upload File
        </button>
      </div>

      {activeTab === 'paste' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          className="w-full h-64 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <FileUploader
          onFileContent={(content) => {
            onChange(content);
            setActiveTab('paste');
          }}
        />
      )}
    </div>
  );
};
