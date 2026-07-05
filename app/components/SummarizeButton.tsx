'use client';

interface SummarizeButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const SummarizeButton = ({
  onClick,
  disabled = false,
  isLoading = false,
}: SummarizeButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
        disabled || isLoading
          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
      }`}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⏳</span>
          Summarizing...
        </>
      ) : (
        <>
          🤖 Summarize
        </>
      )}
    </button>
  );
};
