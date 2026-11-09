import { formatNumber } from './format.js';
import { locale } from './locale.js';
import {
  sharedMessages,
  type Message,
  type PluralMessage,
} from './messages.js';

export type SharedKey = keyof typeof sharedMessages;

export type MessageParams = Record<string, string | number>;

export type Translate<K extends string> = (
  key: K,
  params?: MessageParams,
) => string;

let messages: Readonly<Record<string, Message>> = sharedMessages;

const plurals = new Intl.PluralRules(locale);

const pick = (message: PluralMessage, count: string | number | undefined) => {
  if (typeof count !== 'number') {
    return message.other;
  }

  return message[plurals.select(count)] ?? message.other;
};

const translate = (key: string, params: MessageParams = {}): string => {
  const message = messages[key] ?? key;
  const text =
    typeof message === 'string' ? message : pick(message, params.count);

  return text.replace(/\{(\w+)\}/g, (blank, name: string) => {
    const value = params[name];

    if (value === undefined) {
      return blank;
    }

    return typeof value === 'number' ? formatNumber(value) : value;
  });
};

export const hasText = (key: string): boolean => Object.hasOwn(messages, key);

export const t: Translate<SharedKey> = translate;

export const createTexts = <M extends Record<string, Message>>(
  siteMessages: M,
): Translate<SharedKey | Extract<keyof M, string>> => {
  messages = {
    ...sharedMessages,
    ...siteMessages,
  };

  return translate;
};
