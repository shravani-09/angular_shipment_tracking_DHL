import { COLORS, TEXT_COLORS, BG_COLORS } from './colors';
import { SPACING, PADDING, SIZING, MARGIN } from './spacing';

const PADDING_ROW_CLASSES = {
  sm: 'pb-5 border-b border-gray-100',
  md: 'pb-6 border-b border-gray-100',
};

export const BUTTON_STYLES = {
  primary: `shrink-0 ${BG_COLORS.primary} ${COLORS.primary.hover} ${COLORS.primary.active} ${COLORS.black} font-semibold ${PADDING.lg} rounded-xl text-sm transition-all duration-200 shadow hover:shadow-xl focus:outline-none focus:ring-2 ${COLORS.primary.ring}`,
  secondary: `w-full mt-3 ${BG_COLORS.primary} hover:bg-yellow-500 active:bg-yellow-600 ${COLORS.black} font-bold ${PADDING.md} rounded-lg text-sm transition duration-200 shadow-md hover:shadow-lg`,
  text: 'text-sm font-semibold px-4 py-2 rounded hover:bg-gray-100',
};

export const CARD_STYLES = {
  container: `${BG_COLORS.white} rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border ${COLORS.border.light}`,
  padding: 'p-6 sm:p-8',
  row: {
    header: `flex justify-between items-center ${PADDING_ROW_CLASSES.md} ${COLORS.border.light}`,
    divider: `pb-5 ${COLORS.border.light}`,
    section: `pb-6 ${COLORS.border.light}`,
  },
};

export const TYPOGRAPHY = {
  pageTitle: `text-3xl font-bold ${TEXT_COLORS.heading} ${MARGIN.sm}`,
  pageDesc: `text-base ${TEXT_COLORS.subheading}`,
  heading: `text-sm font-semibold ${TEXT_COLORS.heading} ${MARGIN.xl}`,
  sectionLabel: `text-xs font-semibold ${TEXT_COLORS.light} uppercase tracking-wide`,
  sectionLabelDark: `text-xs font-semibold ${TEXT_COLORS.body} uppercase tracking-wide`,
  body: `text-base font-bold ${TEXT_COLORS.heading}`,
  bodySmall: `text-xs ${TEXT_COLORS.body} ${MARGIN.sm}`,
  timestamp: `text-xs ${TEXT_COLORS.light} ${MARGIN.sm}`,
};

export const ICON_STYLES = {
  small: `${SIZING.icon.sm} ${COLORS.secondary.text}`,
  medium: `${SIZING.icon.md} ${COLORS.secondary.text}`,
  success: `${SIZING.icon.sm} ${COLORS.success.text}`,
  large: `w-12 h-12 ${COLORS.gray[400]} shrink-0 mx-4`,
};

export const FLEX_UTILITIES = {
  center: 'flex items-center justify-center',
  between: 'flex justify-between items-center',
  rowStart: 'flex items-start justify-between',
  col: 'flex flex-col',
  colCenter: 'flex flex-col items-center text-center',
};

export const LAYOUT_STYLES = {
  desktop: 'hidden sm:block',
  mobile: 'sm:hidden',
};

export const BADGE_STYLES = {
  container: `text-xs px-2 py-1 rounded-full shrink-0`,
  completed: `bg-yellow-200 text-yellow-800`,
  delayed: `bg-red-100 text-red-700`,
  pending: `bg-gray-200 text-gray-700`,
};

export const INPUT_STYLES = {
  container: 'mb-4',
  label: `block text-sm font-medium ${TEXT_COLORS.body} ${MARGIN.sm}`,
  field: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${COLORS.primary.ring}`,
  error: `text-sm ${COLORS.danger.text}`,
};

export const ERROR_MESSAGE_STYLES = {
  container: `mt-3 rounded-md ${COLORS.danger.lightBg} border ${COLORS.danger.border} ${PADDING.sm}`,
  text: `text-sm ${COLORS.danger.text} font-medium`,
};

export const LOADER_STYLES = {
  container: 'flex justify-center items-center py-8',
  spinner: `h-8 w-8 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin`,
};

export const TIMELINE_STYLES = {
  container: 'relative flex gap-4',
  lineColor: 'absolute left-2.5 top-2 bottom-0 w-1',
  dot: {
    base: 'h-6 w-6 rounded-full border-4 shrink-0 -ml-8 relative',
    completed: 'bg-yellow-400 border-yellow-400',
    delayed: 'bg-red-500 border-red-500',
    pending: 'bg-gray-300 border-gray-300',
  },
  text: {
    label: 'text-sm font-semibold leading-tight',
    subtitle: 'text-xs mt-0.5 font-medium',
    time: 'text-xs mt-1',
  },
};
