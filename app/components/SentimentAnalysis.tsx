'use client';

interface SentimentAnalysisProps {
  tone: string;
  score: number;
}

const getToneEmoji = (tone: string) => {
  switch (tone.toLowerCase()) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😕';
    case 'neutral':
      return '😐';
    default:
      return '😐';
  }
};

const getToneColor = (tone: string) => {
  switch (tone.toLowerCase()) {
    case 'positive':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    case 'negative':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    case 'neutral':
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
  }
};

export const SentimentAnalysis = ({ tone, score }: SentimentAnalysisProps) => {
  const percentage = Math.round(score * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{getToneEmoji(tone)}</span>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Overall Tone</p>
          <p className={`text-lg font-semibold capitalize px-3 py-1 rounded inline-block ${getToneColor(tone)}`}>
            {tone}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sentiment Score
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {percentage}%
          </p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              score > 0.6
                ? 'bg-green-500'
                : score > 0.3
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
