import { StyleSheet } from 'react-native';
import { AppTheme } from '../../app/theme/app_theme';

export const styles = StyleSheet.create({
  headerContainer: {
    height: 70,
    paddingHorizontal: 16,
    backgroundColor: AppTheme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: AppTheme.typography.fontSizeHeader,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  logoutButton: {
    height: 36,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: AppTheme.colors.primary,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: AppTheme.typography.fontSizeBody - 2,
    fontWeight: '600',
    color: AppTheme.colors.primary,
  },
});
