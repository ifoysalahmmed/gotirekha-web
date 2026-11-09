export type SessionEnd = 'signed_out' | 'expired';

export type Site = 'admin' | 'client';

export interface ApiSettings {
  site: Site;
  authPath: string;
}

type Listener = () => void;

const SIGNED_OUT = 'signed_out';

const listeners = new Set<Listener>();

let settings: ApiSettings | null = null;

let channel: BroadcastChannel | null = null;

let accessToken: string | null = null;

let expired = false;

export const meKey = ['me'] as const;

export const apiSettings = (): ApiSettings => {
  if (settings === null) {
    throw new Error('configureApi must run before the first request');
  }

  return settings;
};

export const getToken = (): string | null => accessToken;

export const setToken = (token: string): void => {
  accessToken = token;
  expired = false;
};

export const sessionExpired = (): boolean => expired;

export const endSession = (end: SessionEnd): void => {
  expired = end === 'expired' && accessToken !== null;
  accessToken = null;

  for (const listener of listeners) {
    listener();
  }
};

export const onSessionEnd = (listener: Listener): (() => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const announceSignOut = (): void => {
  channel?.postMessage(SIGNED_OUT);
};

export const configureApi = (next: ApiSettings): void => {
  if (settings !== null) {
    throw new Error('configureApi runs once');
  }

  settings = next;

  if (!('BroadcastChannel' in window)) {
    return;
  }

  channel = new BroadcastChannel(`gotirekha-${next.site}-session`);
  channel.addEventListener('message', (event: MessageEvent<unknown>) => {
    if (event.data === SIGNED_OUT) {
      endSession('signed_out');
    }
  });
};
