export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (date: Date | number): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return d.toLocaleString('en-US', options);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
};

export const extractTimeFromTranscript = (text: string): string => {
  // Look for patterns like "1 hour", "30 minutes", "1 hour 30 minutes", etc.
  const hourMatch = text.match(/(\d+)\s*hour/i);
  const minuteMatch = text.match(/(\d+)\s*minute/i);

  let duration = '';

  if (hourMatch) {
    duration = `${hourMatch[1]} hour${hourMatch[1] !== '1' ? 's' : ''}`;
  }

  if (minuteMatch) {
    if (duration) {
      duration += ` ${minuteMatch[1]} minute${minuteMatch[1] !== '1' ? 's' : ''}`;
    } else {
      duration = `${minuteMatch[1]} minute${minuteMatch[1] !== '1' ? 's' : ''}`;
    }
  }

  return duration || 'unknown';
};

export const extractAttendeesFromTranscript = (text: string): string[] => {
  // Look for patterns like "Attendees: Name1, Name2" or "Present: Name1, Name2"
  const attendeesMatch = text.match(
    /(?:attendees?|present):\s*([^\n]+)/i
  );

  if (!attendeesMatch) {
    return [];
  }

  return attendeesMatch[1]
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
};

export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter((c) => typeof c === 'string').join(' ');
};
