import type { ApiErrorCode } from '@gotirekha/schemas';

export interface PluralMessage {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

export type Message = string | PluralMessage;

type ErrorKey = `error.${ApiErrorCode | 'network' | 'timeout'}`;

export const sharedMessages = {
  'common.loading': 'Loading',
  'common.tryAgain': 'Try again',
  'common.reload': 'Reload',
  'common.cancel': 'Cancel',
  'common.close': 'Close',
  'common.done': 'Done',
  'common.saveChanges': 'Save changes',
  'common.actions': 'Actions',
  'common.notAvailable': 'N/A',
  'common.never': 'Never',

  'list.range': '{from}–{to} of {total}',
  'list.pages': 'Pages',
  'list.page': 'Page {page}',
  'list.first': 'First page',
  'list.previous': 'Previous page',
  'list.next': 'Next page',
  'list.last': 'Last page',
  'list.clearSearch': 'Clear search',
  'list.filter': '{label}: {value}',
  'list.selectAll': 'Select all on this page',

  'signIn.heading': 'Welcome back',
  'signIn.intro': 'Sign in with your email, username or phone.',
  'signIn.login': 'Email, username or phone',
  'signIn.password': 'Password',
  'signIn.submit': 'Sign in',
  'signIn.expired': 'Your session ended. Sign in again to continue.',

  'password.dialogTitle': 'Change password',
  'password.current': 'Current password',
  'password.new': 'New password',
  'password.newHint': 'At least 8 characters.',
  'password.repeat': 'Repeat new password',
  'password.save': 'Change password',
  'password.changed': 'Password changed. Your other devices were signed out.',
  'password.mismatch': "The two new passwords don't match.",
  'password.show': 'Show password',

  'error.invalid': 'Check the highlighted fields.',
  'error.same_password':
    'Choose a password that differs from your current one and from the default ones.',
  'error.unauthorized': 'Your session ended. Sign in again to continue.',
  'error.wrong_sign_in': 'Wrong sign-in or password.',
  'error.account_disabled': 'This account is turned off.',
  'error.forbidden': "Your role can't do this.",
  'error.wrong_password': "That isn't your current password.",
  'error.already_taken': 'This is already taken.',
  'error.has_objects': 'This still has objects. Move or delete them first.',
  'error.imei_taken': 'This IMEI is already on another object.',
  'error.no_device': 'This object has no device fitted.',
  'error.wrong_code': 'The code is wrong or has expired. Ask for a new one.',
  'error.expired': 'This has expired. Start again.',
  'error.account_cap_reached':
    'The account limit is reached. Remove an account or ask for a higher limit.',
  'error.too_many_tries':
    'Too many tries. Wait up to 15 minutes, then try again.',
  'error.not_found': "This doesn't exist any more. It may have been deleted.",
  'error.internal': 'Something went wrong on our side. Try again in a moment.',
  'error.network':
    "Can't reach the server. Check the connection and try again.",
  'error.timeout': 'The server took too long to answer. Try again.',
  'error.takenUsername': 'This username is already taken.',
  'error.takenEmail': 'This email is already taken.',
  'error.takenPhone': 'This phone number is already taken.',
  'error.required': "This can't be empty.",
  'error.tooShort': {
    one: 'At least {count} character.',
    other: 'At least {count} characters.',
  },
  'error.tooLong': {
    one: 'At most {count} character.',
    other: 'At most {count} characters.',
  },
  'error.checkValue': 'Check this entry.',
} satisfies Record<string, Message> & Record<ErrorKey, Message>;
