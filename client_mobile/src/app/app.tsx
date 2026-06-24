import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRoutes } from './routes/app_routes';
import { HomePage } from '../features/public/pages/home_page';
import { LoginPage } from '../features/auth/pages/login_page';
import { DashboardPage } from '../features/dashboard/pages/dashboard_page';

const Stack = createNativeStackNavigator();

export function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={AppRoutes.home}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name={AppRoutes.home} component={HomePage} />
          <Stack.Screen name={AppRoutes.login} component={LoginPage} />
          <Stack.Screen name={AppRoutes.dashboard} component={DashboardPage} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

export default App;
