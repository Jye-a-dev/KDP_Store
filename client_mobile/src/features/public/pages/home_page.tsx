import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppRoutes } from '../../../app/routes/app_routes';
import { AppTheme } from '../../../app/theme/app_theme';
import { PublicLayout } from '../../../shared/layouts/public_layout';

export function HomePage() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation<any>();

  // Replicate Flutter's LayoutBuilder logic for card size
  const cardWidth = width < 330 ? width - 32 : 298;

  const handlePressCard = () => {
    navigation.navigate(AppRoutes.login);
  };

  return (
    <PublicLayout activeRoute={AppRoutes.home}>
      <View style={styles.container}>
        <Pressable
          style={({ pressed }) => [
            styles.card,
            { width: cardWidth },
            pressed && styles.cardPressed,
          ]}
          onPress={handlePressCard}
        >
          <Text style={styles.title}>Template for Expo</Text>
          <Text style={styles.subtitle}>Mẫu folder cho Expo</Text>
        </Pressable>
      </View>
    </PublicLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingBottom: 45,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: AppTheme.colors.background,
  },
  card: {
    paddingTop: 17,
    paddingHorizontal: 7,
    paddingBottom: 24, // Added padding at the bottom for balance
    borderWidth: 2,
    borderColor: AppTheme.colors.cardBorder,
    borderRadius: AppTheme.spacing.cardRadius,
    backgroundColor: AppTheme.colors.cardBackground,
  },
  cardPressed: {
    opacity: 0.8,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: AppTheme.typography.fontSizeTitle,
    fontWeight: '400',
    lineHeight: 24,
    color: AppTheme.colors.text,
  },
  subtitle: {
    fontSize: AppTheme.typography.fontSizeSubtitle,
    fontWeight: '400',
    lineHeight: 20,
    marginTop: 4,
    paddingLeft: 11,
    color: AppTheme.colors.text,
  },
});
export default HomePage;
