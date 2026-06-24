import { StyleSheet } from 'react-native';
import { AppTheme } from '../../app/theme/app_theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
  },
});
