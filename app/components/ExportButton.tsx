'use client';

import { useState } from 'react';

interface ExportButtonProps {
  onExport: (format: 'pdf' | 'markdown' | 'txt') => void;
}

export const ExportButton = ({ onExport }: ExportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors flex items-center justify-center gap-2"
      >
        📥 Export
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10">
          <button
            onClick={() => {
              onExport('pdf');
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800"
          >
            📄 PDF
          </button>
          <button
            onClick={() => {
              onExport('markdown');
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800"
          >
            📝 Markdown
          </button>
          <button
            onClick={() => {
              onExport('txt');
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            📄 Text
          </button>
        </div>
      )}
    </div>
  );
};
