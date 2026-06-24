import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppRoutes, AppRoute } from '../../app/routes/app_routes';
import { AppTheme } from '../../app/theme/app_theme';
import { BaseLayout } from './base_layout';

interface PublicLayoutProps {
  children: React.ReactNode;
  activeRoute?: AppRoute;
}

export function PublicLayout({ children, activeRoute = AppRoutes.home }: PublicLayoutProps) {
  return (
    <BaseLayout
      header={<PublicHeader activeRoute={activeRoute} />}
      footer={<PublicFooter />}
    >
      {children}
    </BaseLayout>
  );
}

interface PublicHeaderProps {
  activeRoute: AppRoute;
}

function PublicHeader({ activeRoute }: PublicHeaderProps) {
  const navigation = useNavigation<any>();

  const handlePressHome = () => {
    if (activeRoute !== AppRoutes.home) {
      navigation.navigate(AppRoutes.home);
    }
  };

  const isHome = activeRoute === AppRoutes.home;

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Template Expo</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, isHome && styles.disabledButton]}
          onPress={handlePressHome}
          disabled={isHome}
        >
          <Text style={styles.buttonText}>Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

function PublicFooter() {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>© 2026 Template Expo mobile</Text>
      <Text style={styles.footerText}>Built with Expo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 20, // Stadium border
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
