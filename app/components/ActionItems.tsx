'use client';

import { ActionItem } from '@/lib/types';

interface ActionItemsProps {
  items: ActionItem[];
  onToggle?: (id: string) => void;
}

const getPriorityEmoji = (priority?: string) => {
  switch (priority) {
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
      return '🟢';
    default:
      return '⚪';
  }
};

export const ActionItems = ({ items, onToggle }: ActionItemsProps) => {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No action items recorded.</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
          >
            <input
              type="checkbox"
              checked={item.completed || false}
              onChange={() => onToggle?.(item.id)}
              className="mt-1 w-5 h-5 accent-blue-600"
            />
            <div className="flex-1">
              <p className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                {item.text}
              </p>
              {item.assignee && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  👤 {item.assignee}
                </p>
              )}
            </div>
            {item.priority && (
              <div className="text-xl" title={item.priority}>
                {getPriorityEmoji(item.priority)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
