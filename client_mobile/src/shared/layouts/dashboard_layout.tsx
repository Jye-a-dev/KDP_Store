import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { AppTheme } from '../../app/theme/app_theme';
import { BaseLayout } from './base_layout';

import { useAuth } from '../../features/auth/controllers/auth_context';

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

const styles = StyleSheet.create({
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
