import type { FieldError } from 'react-hook-form';
import { z } from 'zod';

import { t } from './t.js';

export const setZodTexts = (): void => {
  z.config({
    customError: (issue) => {
      if (issue.code === 'too_small' && issue.origin === 'string') {
        const minimum = Number(issue.minimum);

        return minimum === 1
          ? t('error.required')
          : t('error.tooShort', {
              count: minimum,
            });
      }

      if (issue.code === 'too_big' && issue.origin === 'string') {
        return t('error.tooLong', {
          count: Number(issue.maximum),
        });
      }

      return t('error.checkValue');
    },
  });
};

export const fieldErrorText = (
  error: FieldError | undefined,
  hint: string,
): string | undefined => {
  if (error === undefined) {
    return undefined;
  }

  return error.message === undefined || error.message === t('error.checkValue')
    ? hint
    : error.message;
};
