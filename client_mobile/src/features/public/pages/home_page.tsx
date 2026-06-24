import React from 'react';
import { Text, View, Pressable, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppRoutes } from '../../../app/routes/app_routes';
import { PublicLayout } from '../../../shared/layouts/public_layout';
import { styles } from './home_page.styles';

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

export default HomePage;
