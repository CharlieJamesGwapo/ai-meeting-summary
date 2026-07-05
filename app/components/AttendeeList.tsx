'use client';

interface AttendeeListProps {
  attendees: string[];
  duration: string;
}

export const AttendeeList = ({ attendees, duration }: AttendeeListProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Attendees
        </h3>
        {attendees.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No attendees recorded.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {attendees.map((attendee, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm"
              >
                👤 {attendee}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Duration
        </h3>
        <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <span className="text-lg">⏱️</span>
          {duration}
        </p>
      </div>
    </div>
  );
};
