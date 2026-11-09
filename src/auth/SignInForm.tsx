import { SignInRequest } from '@gotirekha/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { failureText } from '../api/errors.js';
import { ApiFailure } from '../api/http.js';
import { meKey, sessionExpired } from '../api/session.js';
import { t } from '../texts/t.js';

type SignInInput = z.input<typeof SignInRequest>;

interface SignInFormProps<T> {
  signIn: (body: SignInRequest) => Promise<T>;
  footer?: ReactNode;
}

export const SignInForm = <T,>({ signIn, footer }: SignInFormProps<T>) => {
  const queryClient = useQueryClient();
  const [expired] = useState(sessionExpired);

  const {
    register,
    handleSubmit,
    resetField,
    setFocus,
    formState: { errors },
  } = useForm<SignInInput, unknown, SignInRequest>({
    resolver: zodResolver(SignInRequest),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: (signedIn) => {
      queryClient.setQueryData(meKey, signedIn);
    },
    onError: (error) => {
      if (error instanceof ApiFailure && error.code === 'wrong_sign_in') {
        resetField('password');
        setFocus('password');
      }
    },
  });

  let notice = null;

  if (signInMutation.isError) {
    notice = (
      <Alert color="danger" icon={<IconAlertCircle size={20} aria-hidden />}>
        {failureText(signInMutation.error)}
      </Alert>
    );
  } else if (expired) {
    notice = (
      <Alert color="info" icon={<IconInfoCircle size={20} aria-hidden />}>
        {t('signIn.expired')}
      </Alert>
    );
  }

  return (
    <Box
      component="form"
      w="100%"
      maw={400}
      noValidate
      onSubmit={(event) => {
        void handleSubmit((values) => {
          signInMutation.mutate(values);
        })(event);
      }}
    >
      <Stack gap={20}>
        <Stack gap={6}>
          <Title order={1}>{t('signIn.heading')}</Title>
          <Text c="dimmed">{t('signIn.intro')}</Text>
        </Stack>

        {notice}

        <TextInput
          size="md"
          label={t('signIn.login')}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          error={errors.login?.message}
          {...register('login')}
        />

        <PasswordInput
          size="md"
          label={t('signIn.password')}
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          size="md"
          fullWidth
          loading={signInMutation.isPending}
        >
          {t('signIn.submit')}
        </Button>

        {footer}
      </Stack>
    </Box>
  );
};
