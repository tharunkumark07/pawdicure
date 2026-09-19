/**
 * PAWdiCURE Centralized Time & Date Utilities
 * Ensures consistent handling of user local timezone, time-aware greetings,
 * and reliable daily care cycle dates across Home, Timeline, Calendar, Stats & Reminders.
 */

// Detect user's configured or browser timezone safely
export const getUserTimezone = (fallback: string = 'Asia/Kolkata'): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || fallback;
  } catch {
    return fallback;
  }
};

/**
 * Returns YYYY-MM-DD for the specified date in user's timezone
 */
export const getUserLocalDate = (date: Date = new Date(), timezone: string = getUserTimezone()): string => {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
};

/**
 * Returns formatted local time string like "6:15 PM" or "10:30 AM"
 */
export const getUserLocalTime = (date: Date = new Date(), timezone: string = getUserTimezone()): string => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
};

/**
 * Extracts current hour (0-23) in the user's timezone
 */
export const getUserLocalHour = (date: Date = new Date(), timezone: string = getUserTimezone()): number => {
  try {
    const hourStr = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    }).format(date);
    const parsed = parseInt(hourStr, 10);
    return isNaN(parsed) ? date.getHours() : (parsed === 24 ? 0 : parsed);
  } catch {
    return date.getHours();
  }
};

export type GreetingPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Strict time period determination:
 * 05:00–11:59: morning
 * 12:00–16:59: afternoon
 * 17:00–20:59: evening
 * 21:00–04:59: night
 */
export const getGreetingPeriod = (date: Date = new Date(), timezone: string = getUserTimezone()): GreetingPeriod => {
  const hour = getUserLocalHour(date, timezone);
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

/**
 * Checks if a given YYYY-MM-DD string is today in the user's timezone
 */
export const isToday = (dateKey: string, timezone: string = getUserTimezone()): boolean => {
  return dateKey === getUserLocalDate(new Date(), timezone);
};

/**
 * Checks if a given YYYY-MM-DD string was yesterday
 */
export const isYesterday = (dateKey: string, timezone: string = getUserTimezone()): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateKey === getUserLocalDate(yesterday, timezone);
};

/**
 * Human-readable date label: "Today", "Yesterday", or "Saturday, Sep 19"
 */
export const formatDateLabel = (dateKey: string, timezone: string = getUserTimezone()): string => {
  if (isToday(dateKey, timezone)) return 'Today';
  if (isYesterday(dateKey, timezone)) return 'Yesterday';

  try {
    const [y, m, d] = dateKey.split('-').map(Number);
    if (!y || !m || !d) return dateKey;
    const dateObj = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(dateObj);
  } catch {
    return dateKey;
  }
};

/**
 * Formats a millisecond timestamp or ISO date to display time (e.g. "6:15 PM")
 */
export const formatActivityTime = (
  timestamp: number | string | Date,
  timezone: string = getUserTimezone()
): string => {
  try {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
    if (isNaN(date.getTime())) return 'Just now';
    return getUserLocalTime(date, timezone);
  } catch {
    return 'Just now';
  }
};

/**
 * Generates a stable, time-aware & context-aware greeting without random fluttering.
 * Stable for the current date + period.
 */
export interface TimeAwareGreeting {
  headline: string;
  subtitle: string;
  period: GreetingPeriod;
  periodLabel: string;
  icon: string;
}

export const getTimeAwareGreeting = (
  userName: string,
  petName: string,
  careProgressPercent: number = 0,
  activityCount: number = 0,
  timezone: string = getUserTimezone()
): TimeAwareGreeting => {
  const period = getGreetingPeriod(new Date(), timezone);
  const safePetName = (petName || 'your pet').trim();
  const safeUserName = (userName || 'Friend').trim();

  // Create stable seed from today's date string
  const todayKey = getUserLocalDate(new Date(), timezone);
  const dateHash = todayKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  let headline = '';
  let subtitle = '';
  let periodLabel = 'Morning';
  let icon = '☀️';

  switch (period) {
    case 'morning': {
      periodLabel = 'Morning';
      icon = '☀️';
      const morningHeadlines = [
        `Good morning, ${safeUserName}! ☀️`,
        `Rise and shine, ${safeUserName}! 🐾`,
      ];
      headline = morningHeadlines[dateHash % morningHeadlines.length];

      if (activityCount > 0) {
        subtitle = `${safePetName}'s day is already off to an active start!`;
      } else {
        subtitle = `Ready for a fresh, healthy day with ${safePetName}?`;
      }
      break;
    }

    case 'afternoon': {
      periodLabel = 'Afternoon';
      icon = '🌤️';
      const afternoonHeadlines = [
        `Good afternoon, ${safeUserName}! 🌤️`,
        `Hey ${safeUserName}, hope your day is going great! 🐾`,
      ];
      headline = afternoonHeadlines[dateHash % afternoonHeadlines.length];

      if (activityCount >= 2) {
        subtitle = `${safePetName}'s afternoon is humming along nicely.`;
      } else {
        subtitle = `${safePetName}'s day is underway. Let's see how they're doing.`;
      }
      break;
    }

    case 'evening': {
      periodLabel = 'Evening';
      icon = '🌅';
      const eveningHeadlines = [
        `Good evening, ${safeUserName}! 🌅`,
        `Winding down with ${safePetName}, ${safeUserName}? ❤️`,
      ];
      headline = eveningHeadlines[dateHash % eveningHeadlines.length];

      if (careProgressPercent >= 75) {
        subtitle = `${safePetName} had a great day! Just a little evening care left.`;
      } else {
        subtitle = `Time to wind down and check off ${safePetName}'s evening care.`;
      }
      break;
    }

    case 'night': {
      periodLabel = 'Night';
      icon = '🌙';
      const nightHeadlines = [
        `Good night, ${safeUserName}! 🌙`,
        `Peaceful night, ${safeUserName}. 💤`,
      ];
      headline = nightHeadlines[dateHash % nightHeadlines.length];

      if (careProgressPercent >= 90) {
        subtitle = `${safePetName}'s care is all wrapped up for tonight. Sweet dreams!`;
      } else {
        subtitle = `Before calling it a night, there's still a care task for ${safePetName}.`;
      }
      break;
    }
  }

  return {
    headline,
    subtitle,
    period,
    periodLabel,
    icon,
  };
};

/**
 * Parses any time string (e.g. "07:00 AM", "7:00 AM", "14:30", "6:15 pm", "08:00")
 * into total minutes from midnight (0..1439) for consistent chronological sorting.
 */
export const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const cleaned = timeStr.trim().toUpperCase();

  // Match 12-hour format: "08:30 AM" or "8:30PM" or "8 AM"
  const match12 = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (match12) {
    let hour = parseInt(match12[1], 10);
    const minute = match12[2] ? parseInt(match12[2], 10) : 0;
    const isPM = match12[3] === 'PM';
    if (hour === 12) {
      hour = isPM ? 12 : 0;
    } else if (isPM) {
      hour += 12;
    }
    return (hour % 24) * 60 + minute;
  }

  // Match 24-hour format: "14:30" or "08:00"
  const match24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hour = parseInt(match24[1], 10);
    const minute = parseInt(match24[2], 10);
    return (hour % 24) * 60 + minute;
  }

  // Fallback try parse
  const parts = cleaned.split(':');
  if (parts.length >= 2) {
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return (h % 24) * 60 + m;
  }

  return 0;
};

/**
 * Formats minutes from midnight into 12-hour AM/PM string, e.g. "07:30 AM"
 */
export const formatMinutesTo12Hour = (minutes: number): string => {
  const safeMinutes = ((minutes % 1440) + 1440) % 1440;
  let hour = Math.floor(safeMinutes / 60);
  const min = safeMinutes % 60;
  const isPM = hour >= 12;
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const padHour = String(displayHour).padStart(2, '0');
  const padMin = String(min).padStart(2, '0');
  return `${padHour}:${padMin} ${isPM ? 'PM' : 'AM'}`;
};

/**
 * Standardizes any time string into a clean "07:30 AM" format
 */
export const standardizeTimeFormat = (timeStr: string): string => {
  if (!timeStr) return '08:00 AM';
  const mins = parseTimeToMinutes(timeStr);
  return formatMinutesTo12Hour(mins);
};

/**
 * Checks if a recurring routine item is scheduled on a given date (YYYY-MM-DD)
 */
export const isRoutineItemScheduledOnDate = (
  repeatType: string,
  repeatDays?: number[],
  dateKey?: string,
  timezone: string = getUserTimezone()
): boolean => {
  if (!dateKey) {
    dateKey = getUserLocalDate(new Date(), timezone);
  }

  if (repeatType === 'every_day' || repeatType === 'Daily') return true;

  try {
    const [y, m, d] = dateKey.split('-').map(Number);
    if (!y || !m || !d) return true;
    const dateObj = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    const dayOfWeek = dateObj.getUTCDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat

    switch (repeatType) {
      case 'weekdays':
        return dayOfWeek >= 1 && dayOfWeek <= 5;
      case 'weekends':
        return dayOfWeek === 0 || dayOfWeek === 6;
      case 'selected_days':
      case 'custom':
      case 'Weekly':
        if (Array.isArray(repeatDays) && repeatDays.length > 0) {
          return repeatDays.includes(dayOfWeek);
        }
        return true;
      case 'once':
      case 'None':
        // If 'once', check if date matches or defaults to today
        return true;
      default:
        return true;
    }
  } catch {
    return true;
  }
};

/**
 * Determines real-time computed status of a scheduled routine activity:
 * 'completed' | 'skipped' | 'cancelled' | 'due' | 'upcoming' | 'missed'
 */
export const computeRoutineItemStatus = (
  scheduledTime: string,
  dateKey: string,
  existingStatus?: string,
  timezone: string = getUserTimezone()
): 'upcoming' | 'due' | 'completed' | 'missed' | 'skipped' | 'cancelled' => {
  if (existingStatus === 'completed') return 'completed';
  if (existingStatus === 'skipped') return 'skipped';
  if (existingStatus === 'cancelled') return 'cancelled';

  const todayKey = getUserLocalDate(new Date(), timezone);

  // If viewing a future date, it's upcoming
  if (dateKey > todayKey) return 'upcoming';

  // If viewing a past date and not completed/skipped, it's missed
  if (dateKey < todayKey) return 'missed';

  // For Today: compute based on current minutes from midnight
  const currentMinutes = getUserLocalHour(new Date(), timezone) * 60 + new Date().getMinutes();
  const scheduledMinutes = parseTimeToMinutes(scheduledTime);

  // Due window: from 30 minutes before up to 45 minutes after scheduled time
  const isDueWindow =
    currentMinutes >= scheduledMinutes - 30 && currentMinutes <= scheduledMinutes + 45;

  if (isDueWindow) return 'due';
  if (currentMinutes < scheduledMinutes - 30) return 'upcoming';
  return 'missed'; // Past due window today without completion
};

