'use client';

interface TopicsCloudProps {
  topics: string[];
}

export const TopicsCloud = ({ topics }: TopicsCloudProps) => {
  return (
    <div className="space-y-3">
      {topics.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No topics recorded.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium"
            >
              🏷️ {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
