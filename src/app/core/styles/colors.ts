export const COLORS = {
  primary: {
    bg: 'bg-yellow-400',
    hover: 'hover:bg-yellow-500',
    active: 'active:bg-yellow-600',
    text: 'text-yellow-400',
    ring: 'focus:ring-yellow-300',
  },
  secondary: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
  },
  success: {
    bg: 'bg-green-600',
    text: 'text-green-600',
    light: 'text-green-500',
  },
  danger: {
    bg: 'bg-red-500',
    text: 'text-red-700',
    light: 'text-red-600',
    lightBg: 'bg-red-50',
    border: 'border-red-200',
  },
  warning: {
    bg: 'bg-yellow-200',
    text: 'text-yellow-800',
  },
  gray: {
    900: 'text-gray-900',
    800: 'text-gray-800',
    700: 'text-gray-700',
    600: 'text-gray-600',
    500: 'text-gray-500',
    400: 'text-gray-400',
    300: 'text-gray-300',
    200: 'bg-gray-200',
    100: 'border-gray-100',
    50: 'bg-gray-50',
    light: 'bg-gray-100',
  },
  white: 'bg-white',
  black: 'text-black',
  transparent: 'bg-transparent',
  border: {
    light: 'border-gray-100',
    medium: 'border-gray-200',
  },
};

export const TEXT_COLORS = {
  heading: COLORS.gray[900],
  subheading: COLORS.gray[600],
  body: COLORS.gray[700],
  light: COLORS.gray[500],
  danger: COLORS.danger.text,
  success: COLORS.success.text,
};

export const BG_COLORS = {
  primary: COLORS.primary.bg,
  white: COLORS.white,
  light: COLORS.gray.light,
  danger: COLORS.danger.lightBg,
  page: COLORS.gray[50],
};

export const BORDER_COLORS = {
  light: COLORS.border.light,
  medium: COLORS.border.medium,
  danger: COLORS.danger.border,
};
