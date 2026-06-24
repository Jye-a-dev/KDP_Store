import { StyleSheet } from 'react-native';
import { AppTheme } from '../../app/theme/app_theme';

export const styles = StyleSheet.create({
  headerContainer: {
    height: 70,
    paddingLeft: 16,
    paddingRight: 14,
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
  buttonContainer: {
    height: 40,
    justifyContent: 'center',
  },
  button: {
    height: 40,
    paddingHorizontal: 18,
    backgroundColor: AppTheme.colors.buttonBackground,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: AppTheme.colors.buttonText,
    fontSize: AppTheme.typography.fontSizeBody - 1,
    fontWeight: '700',
  },
  footerContainer: {
    height: 68,
    paddingHorizontal: 16,
    backgroundColor: AppTheme.colors.white,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    color: AppTheme.colors.textSecondary,
    fontSize: AppTheme.typography.fontSizeBody - 1,
  },
});
