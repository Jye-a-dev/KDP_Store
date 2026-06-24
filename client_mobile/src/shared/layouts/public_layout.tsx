import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppRoutes, AppRoute } from '../../app/routes/app_routes';
import { BaseLayout } from './base_layout';
import { styles } from './public_layout.styles';

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
