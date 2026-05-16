export const COLORS = {
  brand: '#6E6AE8',
  brandLight: '#8A84F0',
  brandGlow: 'rgba(110, 106, 232, 0.3)',

  background: '#FFFFFF',
  card: '#F5F5F7',
  border: '#E5E7EB',
  muted: '#F3F4F6',

  text: {
    primary: '#1D2235',
    secondary: '#667085',
    inverse: '#FFFFFF',
  },

  category: {
    sleep: '#AFCBFF',
    nutrition: '#9DB8A1',
    brain: '#F4C95D',
    movement: '#E8A87C',
    longevity: '#B8A9C9',
  },

  status: {
    success: '#9DB8A1',
    warning: '#F4C95D',
    locked: '#D0D5DD',
  },

  shadow: {
    black: '#000',
    card: 'rgba(0, 0, 0, 0.06)',
  },
} as const;

export const TAB_COLORS = {
  active: COLORS.brand,
  inactive: COLORS.text.secondary,
  background: COLORS.background,
  shadow: COLORS.shadow.black,
} as const;
