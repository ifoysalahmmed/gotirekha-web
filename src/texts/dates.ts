import { timeZone } from './locale.js';

const DAY_MS = 86_400_000;

const dayParts = new Intl.DateTimeFormat('en-GB', {
  timeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const toUtc = (date: string): number =>
  Date.UTC(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
  );

const fromUtc = (time: number): string =>
  new Date(time).toISOString().slice(0, 10);

export const today = (now = Date.now()): string => {
  const parts = dayParts.formatToParts(now);

  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('year')}-${part('month')}-${part('day')}`;
};

export const daysBetween = (from: string, to: string): number =>
  Math.round((toUtc(to) - toUtc(from)) / DAY_MS);

export const addDays = (date: string, days: number): string =>
  fromUtc(toUtc(date) + days * DAY_MS);

export const addMonths = (date: string, months: number): string => {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7)) - 1 + months;
  const day = Number(date.slice(8, 10));
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  return fromUtc(Date.UTC(year, month, Math.min(day, lastDay)));
};

export const laterDate = (first: string, second: string): string =>
  first > second ? first : second;
