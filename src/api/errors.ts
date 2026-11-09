import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { hasText, t, type SharedKey } from '../texts/t.js';
import { ApiFailure, type FailureCode } from './http.js';

export const failureText = (error: unknown): string =>
  error instanceof ApiFailure ? t(`error.${error.code}`) : t('error.internal');

const issueText = (code: 'invalid' | 'already_taken', path: string): string => {
  if (code === 'invalid') {
    return t('error.checkValue');
  }

  const key = `error.taken${path.charAt(0).toUpperCase()}${path.slice(1)}`;

  return hasText(key) ? t(key as SharedKey) : t('error.already_taken');
};

export const isGone = (error: unknown): boolean =>
  error instanceof ApiFailure && error.code === 'not_found';

export const applyApiError = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: Partial<Record<FailureCode, Path<T>>> = {},
): string | null => {
  if (!(error instanceof ApiFailure)) {
    return failureText(error);
  }

  const field = fields[error.code];

  if (field !== undefined) {
    setError(
      field,
      {
        message: t(`error.${error.code}`),
      },
      {
        shouldFocus: true,
      },
    );

    return null;
  }

  const code = error.code;

  if (code !== 'invalid' && code !== 'already_taken') {
    return failureText(error);
  }

  error.issues.forEach((issue, index) => {
    setError(
      issue.path as Path<T>,
      {
        message: issueText(code, issue.path),
      },
      {
        shouldFocus: index === 0,
      },
    );
  });

  if (error.code === 'already_taken' && error.issues.length > 0) {
    return null;
  }

  return failureText(error);
};
