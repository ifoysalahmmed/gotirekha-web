import { locale, timeZone } from './locale.js';

const timeFormat = new Intl.DateTimeFormat(locale, {
  timeZone,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

const fullTimeFormat = new Intl.DateTimeFormat(locale, {
  timeZone,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
  timeZoneName: 'shortOffset',
});

const dayFormat = new Intl.DateTimeFormat(locale, {
  timeZone,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const dateFormat = new Intl.DateTimeFormat(locale, {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const relativeFormat = new Intl.RelativeTimeFormat(locale, {
  style: 'short',
  numeric: 'auto',
});

const MONTHS_FROM_DAYS = 45;

const YEARS_FROM_DAYS = 548;

const DAYS_PER_MONTH = 30.44;

const DAYS_PER_YEAR = 365.25;

const dayDistanceFormat = new Intl.RelativeTimeFormat(locale, {
  style: 'long',
  numeric: 'auto',
});

const numberFormat = new Intl.NumberFormat(locale);

export const formatTime = (value: string): string =>
  timeFormat.format(Date.parse(value));

export const formatFullTime = (value: string): string =>
  fullTimeFormat.format(Date.parse(value));

export const formatRelativeTime = (value: string, now = Date.now()): string => {
  const seconds = Math.min(0, Math.round((Date.parse(value) - now) / 1000));

  if (seconds > -60) {
    return relativeFormat.format(seconds, 'second');
  }

  if (seconds > -3600) {
    return relativeFormat.format(Math.trunc(seconds / 60), 'minute');
  }

  if (seconds > -86400) {
    return relativeFormat.format(Math.trunc(seconds / 3600), 'hour');
  }

  return relativeFormat.format(Math.trunc(seconds / 86400), 'day');
};

export const formatDay = (value: string): string =>
  dayFormat.format(Date.parse(value));

export const formatDate = (value: string): string =>
  dateFormat.format(
    Date.UTC(
      Number(value.slice(0, 4)),
      Number(value.slice(5, 7)) - 1,
      Number(value.slice(8, 10)),
    ),
  );

export const formatDayDistance = (days: number): string => {
  const size = Math.abs(days);

  if (size < MONTHS_FROM_DAYS) {
    return dayDistanceFormat.format(days, 'day');
  }

  if (size < YEARS_FROM_DAYS) {
    return dayDistanceFormat.format(Math.round(days / DAYS_PER_MONTH), 'month');
  }

  return dayDistanceFormat.format(Math.round(days / DAYS_PER_YEAR), 'year');
};

export const formatNumber = (value: number): string =>
  numberFormat.format(value);

export const formatPhone = (value: string): string =>
  /^\+8801[0-9]{9}$/.test(value)
    ? `+880 ${value.slice(4, 8)}-${value.slice(8)}`
    : value;

export const localSim = (value: string): string =>
  /^8801[0-9]{9}$/.test(value) ? value.slice(2) : value;

export const formatSim = (value: string): string => {
  const local = localSim(value);

  return /^01[0-9]{9}$/.test(local)
    ? `${local.slice(0, 5)}-${local.slice(5)}`
    : value;
};
