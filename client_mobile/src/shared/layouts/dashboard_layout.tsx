import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { BaseLayout } from './base_layout';
import { useAuth } from '../../features/auth/controllers/auth_context';
import { styles } from './dashboard_layout.styles';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title = 'Dashboard' }: DashboardLayoutProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const header = (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );

  return (
    <BaseLayout header={header}>
      {children}
    </BaseLayout>
  );
}
