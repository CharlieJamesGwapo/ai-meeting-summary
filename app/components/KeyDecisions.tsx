'use client';

interface KeyDecisionsProps {
  decisions: string[];
}

export const KeyDecisions = ({ decisions }: KeyDecisionsProps) => {
  return (
    <div className="space-y-3">
      {decisions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No key decisions recorded.</p>
      ) : (
        decisions.map((decision, index) => (
          <div key={index} className="flex gap-3">
            <div className="text-lg mt-0.5">✅</div>
            <p className="text-gray-700 dark:text-gray-300">{decision}</p>
          </div>
        ))
      )}
    </div>
  );
};
