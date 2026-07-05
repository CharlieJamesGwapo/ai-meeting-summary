'use client';

import { useState, useEffect } from 'react';

interface SaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const SaveButton = ({ onClick, disabled = false }: SaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      onClick();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
        disabled
          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          : isSaved
            ? 'bg-green-600 text-white'
            : 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800'
      }`}
    >
      {isSaved ? (
        <>
          ✅ Saved!
        </>
      ) : (
        <>
          💾 Save
        </>
      )}
    </button>
  );
};
