import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './base_layout.styles';

interface BaseLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function BaseLayout({ children, header, footer }: BaseLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {header}
        <View style={styles.content}>{children}</View>
        {footer}
      </View>
    </SafeAreaView>
  );
}
