import {
  Alert,
  Button,
  createTheme,
  Input,
  InputWrapper,
  Modal,
  PasswordInput,
  rem,
  type CSSVariablesResolver,
  type MantineColorsTuple,
} from '@mantine/core';

import { t } from '../texts/t.js';

const controlHeights: Partial<Record<string, string>> = {
  xs: rem(32),
  sm: rem(40),
  md: rem(48),
};

const SHEET_MOTION_MS = 240;

const controlHeight = (size: string | undefined): string | undefined =>
  controlHeights[size ?? 'sm'];

const emerald: MantineColorsTuple = [
  '#E3F3EC',
  '#C8E8D9',
  '#9DD6BC',
  '#6FC29D',
  '#41AB7F',
  '#1F9268',
  '#0B7A55',
  '#075C40',
  '#064A34',
  '#043527',
];

const neutral: MantineColorsTuple = [
  '#F6F7F5',
  '#EEF0EE',
  '#E2E6E3',
  '#D5DAD6',
  '#B8BFBA',
  '#8A928D',
  '#59615C',
  '#3F4743',
  '#262D29',
  '#101613',
];

const danger: MantineColorsTuple = [
  '#FDECEA',
  '#FAD3CF',
  '#F3A9A2',
  '#EA7D73',
  '#DC5347',
  '#C8352A',
  '#B42318',
  '#8F1C13',
  '#6D150F',
  '#4C0F0A',
];

const warning: MantineColorsTuple = [
  '#FDF0E1',
  '#FADCBB',
  '#F4BE86',
  '#EC9F55',
  '#DD802C',
  '#C76814',
  '#B45309',
  '#8A3C06',
  '#6A2E05',
  '#4A2003',
];

const info: MantineColorsTuple = [
  '#E7EDFB',
  '#CDDAF6',
  '#A7BDEF',
  '#7F9EE6',
  '#5B81DE',
  '#4269D7',
  '#2F5BD3',
  '#1E3F9E',
  '#173180',
  '#10235C',
];

export const theme = createTheme({
  primaryColor: 'emerald',
  primaryShade: 6,
  colors: {
    emerald,
    gray: neutral,
    red: danger,
    danger,
    warning,
    info,
  },
  black: '#101613',
  white: '#FFFFFF',
  fontFamily: "'Geist Variable', system-ui, sans-serif",
  fontFamilyMonospace: "'Geist Mono Variable', ui-monospace, monospace",
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(15),
    lg: rem(18),
    xl: rem(22),
  },
  lineHeights: {
    xs: '1.3333',
    sm: '1.4286',
    md: '1.4667',
    lg: '1.4444',
    xl: '1.3636',
  },
  headings: {
    fontWeight: '600',
    sizes: {
      h1: {
        fontSize: rem(28),
        lineHeight: '1.2857',
      },
      h2: {
        fontSize: rem(22),
        lineHeight: '1.3636',
      },
      h3: {
        fontSize: rem(18),
        lineHeight: '1.4444',
      },
    },
  },
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  radius: {
    xs: rem(8),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24),
  },
  defaultRadius: 'md',
  shadows: {
    xs: '0 0 0 1px #E2E6E3',
    sm: '0 0 0 1px #E2E6E3',
    md: '0 6px 24px rgba(16, 22, 19, 0.10)',
    lg: '0 -10px 34px rgba(16, 22, 19, 0.12)',
    xl: '0 24px 60px rgba(16, 22, 19, 0.18)',
  },
  focusRing: 'auto',
  respectReducedMotion: true,
  cursorType: 'pointer',
  components: {
    Button: Button.extend({
      vars: (_theme, props) => ({
        root: {
          '--button-height': controlHeight(props.size),
        },
      }),
    }),
    Input: Input.extend({
      vars: (_theme, props) => ({
        wrapper: {
          '--input-height': controlHeight(props.size),
          '--input-fz': props.size === 'md' ? rem(16) : undefined,
        },
      }),
    }),
    InputWrapper: InputWrapper.extend({
      styles: {
        label: {
          fontWeight: 600,
        },
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        visibilityToggleFocusable: true,
        visibilityToggleButtonProps: {
          'aria-label': t('password.show'),
        },
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        centered: true,
        radius: 'lg',
        shadow: 'xl',
        transitionProps: {
          transition: 'fade-down',
          duration: SHEET_MOTION_MS,
        },
      },
      styles: {
        title: {
          fontSize: rem(18),
          fontWeight: 600,
          lineHeight: rem(26),
        },
      },
    }),
    Alert: Alert.extend({
      vars: (_theme, props) => {
        const color = props.color ?? 'emerald';

        return {
          root: {
            '--alert-bg': `var(--mantine-color-${color}-0)`,
            '--alert-color': `var(--mantine-color-${color}-7)`,
          },
        };
      },
      styles: {
        message: {
          color: 'var(--alert-color)',
          fontSize: rem(13),
          fontWeight: 500,
          lineHeight: rem(19),
        },
      },
    }),
  },
});

export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--mantine-color-placeholder': 'var(--mantine-color-gray-6)',
    '--mantine-color-default-border': 'var(--mantine-color-gray-5)',
    '--mantine-color-anchor': 'var(--mantine-color-emerald-7)',
  },
  dark: {},
});
