import {
  ApiError,
  type AccessToken,
  type ApiErrorCode,
} from '@gotirekha/schemas';

import {
  announceSignOut,
  apiSettings,
  endSession,
  getToken,
  setToken,
} from './session.js';

export type FailureCode = ApiErrorCode | 'network' | 'timeout';

type Issue = NonNullable<ApiError['issues']>[number];

type Holder = NonNullable<ApiError['holder']>;

interface FailureInit {
  status: number;
  code: FailureCode;
  message: string;
  issues?: Issue[] | undefined;
  holder?: Holder | undefined;
}

export class ApiFailure extends Error {
  readonly status: number;
  readonly code: FailureCode;
  readonly issues: Issue[];
  readonly holder: Holder | null;

  constructor(init: FailureInit) {
    super(init.message);
    this.name = 'ApiFailure';
    this.status = init.status;
    this.code = init.code;
    this.issues = init.issues ?? [];
    this.holder = init.holder ?? null;
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal | undefined;
}

const BASE = '/api/v1/';

const TIMEOUT_MS = 15_000;

const UNREACHABLE = new Set([502, 503, 504]);

const readFailure = async (response: Response): Promise<ApiFailure> => {
  const body: unknown = await response.json().catch(() => null);
  const parsed = ApiError.safeParse(body);

  if (parsed.success) {
    return new ApiFailure({
      status: response.status,
      code: parsed.data.error,
      message: parsed.data.message,
      issues: parsed.data.issues,
      holder: parsed.data.holder,
    });
  }

  return new ApiFailure({
    status: response.status,
    code: UNREACHABLE.has(response.status) ? 'network' : 'internal',
    message: response.statusText,
  });
};

export const request = async (
  path: string,
  options: RequestOptions = {},
  token: string | null = null,
): Promise<unknown> => {
  const headers = new Headers();

  if (token !== null) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeout])
    : timeout;

  let response: Response;

  try {
    response = await fetch(BASE + path, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? null : JSON.stringify(options.body),
      signal,
    });
  } catch (err) {
    if (options.signal?.aborted) {
      throw err;
    }

    if (timeout.aborted) {
      throw new ApiFailure({
        status: 0,
        code: 'timeout',
        message: 'The server took too long to answer.',
      });
    }

    throw new ApiFailure({
      status: 0,
      code: 'network',
      message: 'The server could not be reached.',
    });
  }

  if (!response.ok) {
    throw await readFailure(response);
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json();
};

const requestNewToken = async (): Promise<boolean> => {
  try {
    const issued = (await request(`${apiSettings().authPath}/refresh`, {
      method: 'POST',
    })) as AccessToken;

    setToken(issued.accessToken);

    return true;
  } catch (err) {
    if (err instanceof ApiFailure && err.code === 'unauthorized') {
      endSession('expired');

      return false;
    }

    throw err;
  }
};

const withRefreshLock = (task: () => Promise<boolean>): Promise<boolean> =>
  'locks' in navigator
    ? navigator.locks.request(`gotirekha-${apiSettings().site}-refresh`, task)
    : task();

let refreshing: Promise<boolean> | null = null;

export const refreshAccessToken = (): Promise<boolean> => {
  refreshing ??= withRefreshLock(requestNewToken).finally(() => {
    refreshing = null;
  });

  return refreshing;
};

export const api = async (
  path: string,
  options: RequestOptions = {},
): Promise<unknown> => {
  const token = getToken();

  try {
    return await request(path, options, token);
  } catch (err) {
    if (!(err instanceof ApiFailure) || err.code !== 'unauthorized') {
      throw err;
    }

    if (getToken() === token && !(await refreshAccessToken())) {
      throw err;
    }

    return request(path, options, getToken());
  }
};

export const startSession = async (
  action: string,
  body: unknown,
): Promise<void> => {
  const issued = (await request(`${apiSettings().authPath}/${action}`, {
    method: 'POST',
    body,
  })) as AccessToken;

  setToken(issued.accessToken);
};

export const closeSession = async (): Promise<void> => {
  await request(`${apiSettings().authPath}/sign-out`, {
    method: 'POST',
  });

  announceSignOut();
  endSession('signed_out');
};
