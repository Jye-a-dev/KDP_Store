import { StyleSheet } from 'react-native';
import { AppTheme } from '../../../app/theme/app_theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingBottom: 45,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: AppTheme.colors.background,
  },
  card: {
    paddingTop: 17,
    paddingHorizontal: 7,
    paddingBottom: 24,
    borderWidth: 2,
    borderColor: AppTheme.colors.cardBorder,
    borderRadius: AppTheme.spacing.cardRadius,
    backgroundColor: AppTheme.colors.cardBackground,
  },
  cardPressed: {
    opacity: 0.8,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: AppTheme.typography.fontSizeTitle,
    fontWeight: '400',
    lineHeight: 24,
    color: AppTheme.colors.text,
  },
  subtitle: {
    fontSize: AppTheme.typography.fontSizeSubtitle,
    fontWeight: '400',
    lineHeight: 20,
    marginTop: 4,
    paddingLeft: 11,
    color: AppTheme.colors.text,
  },
});
