import { z } from 'zod';

export const blankAsUndefined = (schema: z.ZodType<string, string>) =>
  z
    .string()
    .trim()
    .transform((value) => (value === '' ? undefined : value))
    .pipe(schema.optional());

export const blankAsNull = (schema: z.ZodType<string, string>) =>
  z
    .string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .pipe(schema.nullable());

export const fieldsClean =
  (...fields: string[]) =>
  (payload: z.core.ParsePayload): boolean =>
    !payload.issues.some((issue) =>
      fields.includes(String(issue.path?.[0] ?? '')),
    );
