import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppRoutes } from '../../../app/routes/app_routes';
import { AppTheme } from '../../../app/theme/app_theme';
import { PublicLayout } from '../../../shared/layouts/public_layout';

export function LoginPage() {
  const navigation = useNavigation<any>();

  const handleLogin = () => {
    // Replicate pushReplacementNamed in Flutter by resetting/replacing current screen
    navigation.reset({
      index: 0,
      routes: [{ name: AppRoutes.dashboard }],
    });
  };

  return (
    <PublicLayout activeRoute={AppRoutes.login}>
      <View style={styles.container}>
        <View style={styles.loginCard}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Click below to authenticate and access the dashboard area.</Text>
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Go to dashboard</Text>
          </Pressable>
        </View>
      </View>
    </PublicLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: AppTheme.colors.background,
  },
  loginCard: {
    width: '100%',
    maxWidth: 320,
    padding: 24,
    borderWidth: 2,
    borderColor: AppTheme.colors.primary,
    borderRadius: AppTheme.spacing.cardRadius,
    backgroundColor: AppTheme.colors.white,
    alignItems: 'center',
  },
  title: {
    fontSize: AppTheme.typography.fontSizeHeader + 2,
    fontWeight: '700',
    color: AppTheme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: AppTheme.typography.fontSizeBody - 1,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    height: 48,
    width: '100%',
    backgroundColor: AppTheme.colors.buttonBackground,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: AppTheme.colors.buttonText,
    fontSize: AppTheme.typography.fontSizeBody,
    fontWeight: '700',
  },
});

export default LoginPage;
