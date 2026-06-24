import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRoutes } from './routes/app_routes';
import { HomePage } from '../features/public/pages/home_page';
import { LoginPage } from '../features/auth/pages/login_page';
import { RegisterPage } from '../features/auth/pages/register_page';
import { OnboardingPage } from '../features/auth/pages/onboarding_page';
import { DashboardPage } from '../features/dashboard/pages/dashboard_page';
import { AuthProvider, useAuth } from '../features/auth/controllers/auth_context';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoading, hasCompletedOnboarding, isAuthenticated } = useAuth();

  if (isLoading) {
    return <KDPLoader />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          // Onboarding Flow: User must complete onboarding first
          <Stack.Screen name={AppRoutes.onboarding} component={OnboardingPage} />
        ) : !isAuthenticated ? (
          // Auth Flow: Login or Register
          <>
            <Stack.Screen name={AppRoutes.login} component={LoginPage} />
            <Stack.Screen name={AppRoutes.register} component={RegisterPage} />
            <Stack.Screen name={AppRoutes.home} component={HomePage} />
          </>
        ) : (
          // Protected Flow: Access Dashboard only
          <Stack.Screen name={AppRoutes.dashboard} component={DashboardPage} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

// ─── KDP Themed Loader ────────────────────────────────────────────────────────

function KDPLoader() {
  const bagY = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Bag bounce loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(bagY, { toValue: -14, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(bagY, { toValue: 0, duration: 380, easing: Easing.in(Easing.bounce), useNativeDriver: true }),
        Animated.delay(200),
      ])
    ).start();

    // Staggered dot pulse
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.delay(600 - delay),
        ])
      );

    Animated.parallel([
      pulse(dot1, 0),
      pulse(dot2, 200),
      pulse(dot3, 400),
    ]).start();
  }, []);

  return (
    <View style={loaderStyles.root}>
      {/* Brand stripe top */}
      <View style={loaderStyles.stripe}>
        <Text style={loaderStyles.stripeText}>KDP STORE</Text>
      </View>

      {/* Center card */}
      <View style={loaderStyles.cardWrap}>
        <View style={loaderStyles.cardShadow} />
        <View style={loaderStyles.card}>
          {/* Animated shopping bag */}
          <Animated.Text style={[loaderStyles.bagIcon, { transform: [{ translateY: bagY }] }]}>
            🛍️
          </Animated.Text>

          <Text style={loaderStyles.tagline}>ĐANG TẢI SẢN PHẨM</Text>

          {/* Pulsing dots */}
          <View style={loaderStyles.dots}>
            {[dot1, dot2, dot3].map((anim, i) => (
              <Animated.View key={i} style={[loaderStyles.dot, { opacity: anim }]} />
            ))}
          </View>
        </View>
      </View>

      {/* Bottom ticker */}
      <View style={loaderStyles.ticker}>
        <Text style={loaderStyles.tickerText}>THỜI TRANG · 3D · PHONG CÁCH</Text>
      </View>
    </View>
  );
}

const loaderStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8DE22', alignItems: 'center', justifyContent: 'center' },

  stripe: { position: 'absolute', top: 0, left: 0, right: 0, height: 52, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  stripeText: { color: '#F8DE22', fontSize: 16, fontWeight: '900', letterSpacing: 4 },

  cardWrap: { position: 'relative', marginTop: 16 },
  cardShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: '#111', borderRadius: 16 },
  card: { width: 220, backgroundColor: '#fff', borderWidth: 3, borderColor: '#111', borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingVertical: 28, gap: 10 },

  bagIcon: { fontSize: 52 },
  tagline: { fontSize: 11, fontWeight: '900', color: '#111', letterSpacing: 1.5, marginTop: 4 },

  dots: { flexDirection: 'row', gap: 8, marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#111' },

  ticker: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  tickerText: { color: '#F8DE22', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
});

const styles = StyleSheet.create({});

export default App;

