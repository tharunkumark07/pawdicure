import { getUserLocalDate, getUserTimezone, isToday as checkIsToday } from './timeUtils';

export const getTodayKey = (timezone: string = getUserTimezone()): string => {
  return getUserLocalDate(new Date(), timezone);
};

export const getDateKey = (date: Date, timezone: string = getUserTimezone()): string => {
  return getUserLocalDate(date, timezone);
};

export const isToday = (dateKey: string, timezone: string = getUserTimezone()): boolean => {
  return checkIsToday(dateKey, timezone);
};

