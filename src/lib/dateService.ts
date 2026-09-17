export const getTodayKey = (timezone: string = 'Asia/Kolkata'): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
};

export const getDateKey = (date: Date, timezone: string = 'Asia/Kolkata'): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

export const isToday = (dateKey: string, timezone: string = 'Asia/Kolkata'): boolean => {
  return dateKey === getTodayKey(timezone);
};
