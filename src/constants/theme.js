// Central design tokens — import these everywhere instead of hardcoding
// colors/spacing/sizes directly in each screen. This is what keeps every
// screen visually consistent instead of drifting apart over time.

export const COLORS = {
  background: '#1E1E2E',
  surface: '#2A2A3C',
  surfaceAlt: '#242436',
  border: '#3A3A4C',
  borderSubtle: '#22222E',

  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#777777',
  textFaint: '#666666',

  primary: '#6C5CE7',
  success: '#00B894',
  danger: '#FF6B6B',

  onboardingBg: '#151B2B',
  accentGreen: '#00C897',
};



// A fixed spacing scale — every margin/padding in the app should be one of
// these values. Prevents "13px here, 14px there" drift between screens.
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,   // standard screen side padding
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const FONT = {
  xs: 11,
  sm: 12,
  base: 13,
  md: 14,
  lg: 15,
  xl: 16,
  xxl: 18,
  title: 22,
  display: 32,
};

export const SHADOW = {
  fab: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
};