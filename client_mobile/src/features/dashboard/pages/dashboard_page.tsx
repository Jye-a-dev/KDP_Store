import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppTheme } from '../../../app/theme/app_theme';
import { DashboardLayout } from '../../../shared/layouts/dashboard_layout';

export function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard Page</Text>
      </View>
    </DashboardLayout>
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
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: AppTheme.colors.text,
  },
});

export default DashboardPage;
