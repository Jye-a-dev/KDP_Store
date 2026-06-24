export const AppTheme = {
  colors: {
    primary: '#111114',
    background: '#ffffff',
    text: '#111114',
    textSecondary: '#667085',
    border: '#e5e7eb',
    cardBorder: '#111114',
    cardBackground: '#ffffff',
    white: '#ffffff',
    buttonBackground: '#111114',
    buttonText: '#ffffff',
  },
  typography: {
    fontSizeTitle: 23,
    fontSizeSubtitle: 18,
    fontSizeHeader: 20,
    fontSizeBody: 16,
    fontFamily: undefined, // Uses system default fonts unless specified
  },
  spacing: {
    padding: 16,
    margin: 16,
    cardRadius: 14,
  },
} as const;
