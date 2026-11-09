import { ChangePasswordRequest, type Me } from '@gotirekha/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Group,
  Modal,
  PasswordInput,
  Stack,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { applyApiError } from '../api/errors.js';
import { meKey } from '../api/session.js';
import { showDone } from '../feedback/notes.js';
import { t } from '../texts/t.js';

export type ChangePassword = (body: ChangePasswordRequest) => Promise<void>;

const PasswordForm = ChangePasswordRequest.extend({
  repeatPassword: z.string(),
}).refine((values) => values.newPassword === values.repeatPassword, {
  path: ['repeatPassword'],
  error: t('password.mismatch'),
});

type PasswordInputValues = z.input<typeof PasswordForm>;

type PasswordValues = z.output<typeof PasswordForm>;

interface ChangePasswordDialogProps {
  opened: boolean;
  onClose: () => void;
  changePassword: ChangePassword;
}

interface ChangePasswordFormProps {
  onDone: () => void;
  changePassword: ChangePassword;
}

const ChangePasswordForm = ({
  onDone,
  changePassword,
}: ChangePasswordFormProps) => {
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PasswordInputValues, unknown, PasswordValues>({
    resolver: zodResolver(PasswordForm),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
    },
  });

  const passwordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: PasswordValues) =>
      changePassword({
        currentPassword,
        newPassword,
      }),
    onMutate: () => {
      setFormError(null);
    },
    onSuccess: () => {
      queryClient.setQueryData<Me | null>(meKey, (me) =>
        me
          ? {
              ...me,
              defaultPassword: false,
            }
          : me,
      );

      showDone(t('password.changed'));
      onDone();
    },
    onError: (error) => {
      setFormError(
        applyApiError(error, setError, {
          wrong_password: 'currentPassword',
          same_password: 'newPassword',
        }),
      );
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit((values) => {
          passwordMutation.mutate(values);
        })(event);
      }}
    >
      <Stack gap="md">
        {formError === null ? null : (
          <Alert
            color="danger"
            icon={<IconAlertCircle size={20} aria-hidden />}
          >
            {formError}
          </Alert>
        )}

        <PasswordInput
          data-autofocus
          label={t('password.current')}
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />

        <PasswordInput
          label={t('password.new')}
          description={t('password.newHint')}
          autoComplete="new-password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <PasswordInput
          label={t('password.repeat')}
          autoComplete="new-password"
          error={errors.repeatPassword?.message}
          {...register('repeatPassword')}
        />

        <Group justify="flex-end" gap="sm" mt="xs">
          <Button variant="default" onClick={onDone}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={passwordMutation.isPending}>
            {t('password.save')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export const ChangePasswordDialog = ({
  opened,
  onClose,
  changePassword,
}: ChangePasswordDialogProps) => (
  <Modal opened={opened} onClose={onClose} title={t('password.dialogTitle')}>
    <ChangePasswordForm onDone={onClose} changePassword={changePassword} />
  </Modal>
);
