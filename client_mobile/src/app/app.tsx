
import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { View, Text, Animated, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRoutes } from './routes/app_routes';
import { LoginPage } from '../features/auth/pages/login_page';
import { RegisterPage } from '../features/auth/pages/register_page';
import { OnboardingPage } from '../features/auth/pages/onboarding_page';
import { AuthProvider, useAuth } from '../features/auth/controllers/auth_context';
import { CartProvider } from '../features/cart/controllers/cart_context';
import { MainTabNavigator } from '../shared/navigation/bottom_tab_navigator';
import { splashStyles, adminStyles } from './app.styles';
import { Easing } from 'react-native';

const Stack = createNativeStackNavigator();

// ─── Splash Screen ────────────────────────────────────────────────────────────

function KDPSplash({ onFinish }: { onFinish: () => void }) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.timing(tagOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(900),
      Animated.timing(exitOpacity, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start(() => onFinish());
  }, []);

  return (
    <Animated.View style={[splashStyles.root, { opacity: exitOpacity }]}>
      <Animated.View style={[splashStyles.logoWrap, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
        <View style={splashStyles.logoShadow} />
        <View style={splashStyles.logoCard}>
          <View style={splashStyles.kBadge}>
            <Text style={splashStyles.kText}>K</Text>
          </View>
          <View style={splashStyles.dpRow}>
            <Text style={splashStyles.dpText}>DP</Text>
          </View>
          <View style={splashStyles.storeBadge}>
            <Text style={splashStyles.storeText}>STORE</Text>
          </View>
        </View>
      </Animated.View>
      <Animated.Text style={[splashStyles.tagline, { opacity: tagOpacity }]}>
        THỜI TRANG · 3D · PHONG CÁCH
      </Animated.Text>
      <View style={splashStyles.strip}>
        <Text style={splashStyles.stripText}>KDP STORE</Text>
      </View>
    </Animated.View>
  );
}

// ─── Admin redirect ───────────────────────────────────────────────────────────

function AdminRedirectScreen() {
  const { logout } = useAuth();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={adminStyles.root}>
      <View style={adminStyles.stripe}>
        <Text style={adminStyles.stripeText}>KDP STORE — ADMIN</Text>
      </View>
      <View style={adminStyles.card}>
        <View style={adminStyles.cardShadow} />
        <View style={adminStyles.cardInner}>
          <Text style={adminStyles.emoji}>🔐</Text>
          <Text style={adminStyles.title}>Tài khoản Admin</Text>
          <Text style={adminStyles.desc}>
            Trình duyệt web đã được mở để đến trang quản trị KDP Store.
          </Text>
          <Animated.View style={{ transform: [{ scale: pulse }], width: '100%' }}>
            <Text
              style={adminStyles.linkBtn}
              onPress={() => Linking.openURL('https://kdp-store-pi.vercel.app/')}
            >
              Mở lại Admin Dashboard →
            </Text>
          </Animated.View>
          <Text style={adminStyles.logoutBtn} onPress={() => logout()}>
            Đăng xuất
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── AppNavigator ─────────────────────────────────────────────────────────────

function AppNavigator() {
  const { isLoading, hasCompletedOnboarding, isAuthenticated, user, token } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  // Auth guard: admin → open web
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      Linking.openURL('https://kdp-store-pi.vercel.app/');
    }
  }, [isAuthenticated, user]);

  // Phase 1: Splash
  if (!splashDone) {
    return <KDPSplash onFinish={() => setSplashDone(true)} />;
  }

  // Phase 2: Wait for AsyncStorage hydration
  if (isLoading) {
    return <View style={splashStyles.root} />;
  }

  // Phase 3: Admin screen
  if (isAuthenticated && user?.role === 'admin') {
    return <AdminRedirectScreen />;
  }

  // Phase 4: Auth flow or main app
  return (
    <NavigationContainer>
      {!hasCompletedOnboarding ? (
        // Onboarding (one-time)
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={AppRoutes.onboarding} component={OnboardingPage} />
        </Stack.Navigator>
      ) : !isAuthenticated ? (
        // Auth stack
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={AppRoutes.login} component={LoginPage} />
          <Stack.Screen name={AppRoutes.register} component={RegisterPage} />
        </Stack.Navigator>
      ) : (
        // Main app with bottom tabs
        <MainTabNavigator />
      )}
    </NavigationContainer>
  );
}

// ─── CartAwareProvider (reads auth, passes to CartProvider) ─────────────────

function CartAwareProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  return (
    <CartProvider userId={user?.id} token={token ?? undefined}>
      {children}
    </CartProvider>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartAwareProvider>
          <AppNavigator />
        </CartAwareProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

export default App;
