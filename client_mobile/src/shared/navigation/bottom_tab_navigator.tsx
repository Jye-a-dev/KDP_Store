import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppRoutes } from '../../app/routes/app_routes';
import { DashboardPage } from '../../features/dashboard/pages/dashboard_page';
import { ProductDetailPage } from '../../features/product/pages/product_detail_page';
import { SearchPage } from '../../features/search/pages/search_page';
import { CartPage } from '../../features/cart/pages/cart_page';
import { ProfilePage } from '../../features/profile/pages/profile_page';
import { OrdersPage } from '../../features/profile/pages/orders_page';
import { ShippingAddressPage } from '../../features/profile/pages/shipping_address_page';
import { useCart } from '../../features/cart/controllers/cart_context';

// ─── Stack Navigators ─────────────────────────────────────────────────────────
// Each stack uses unique screen names to avoid React Navigation conflicts.

const HomeStack = createNativeStackNavigator();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeDashboard" component={DashboardPage} />
      {/* ProductDetail accessible from Home tab */}
      <HomeStack.Screen name="HomeProductDetail" component={ProductDetailPage} />
    </HomeStack.Navigator>
  );
}

const SearchStack = createNativeStackNavigator();
function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchMain" component={SearchPage} />
      {/* ProductDetail accessible from Search tab */}
      <SearchStack.Screen name="SearchProductDetail" component={ProductDetailPage} />
    </SearchStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfilePage} />
      <ProfileStack.Screen name="ProfileOrders" component={OrdersPage} />
      <ProfileStack.Screen name="ProfileShippingAddress" component={ShippingAddressPage} />
    </ProfileStack.Navigator>
  );
}

// ─── Tab Icon ─────────────────────────────────────────────────────────────────

function TabIcon({
  emoji, label, focused, badgeCount,
}: { emoji: string; label: string; focused: boolean; badgeCount?: number }) {
  return (
    <View style={tabIconStyles.wrap}>
      {focused && <View style={tabIconStyles.activeDot} />}
      <View style={[tabIconStyles.iconWrap, focused && tabIconStyles.iconWrapActive]}>
        <Text style={tabIconStyles.emoji}>{emoji}</Text>
        {badgeCount != null && badgeCount > 0 && (
          <View style={tabIconStyles.badge}>
            <Text style={tabIconStyles.badgeText}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
          </View>
        )}
      </View>
      <Text style={[tabIconStyles.label, focused && tabIconStyles.labelActive]}>{label}</Text>
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', width: 60, paddingTop: 2 },
  activeDot: {
    position: 'absolute', top: -6, width: 20, height: 3,
    backgroundColor: '#F8DE22', borderRadius: 2, borderWidth: 1, borderColor: '#111',
  },
  iconWrap: {
    width: 42, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: '#111' },
  emoji: { fontSize: 18 },
  label: { fontSize: 10, fontWeight: '700', color: '#aaa', marginTop: 2, letterSpacing: 0.3 },
  labelActive: { color: '#111', fontWeight: '900' },
  badge: {
    position: 'absolute', top: -4, right: -6,
    backgroundColor: '#F45B26', borderWidth: 1.5, borderColor: '#fff',
    borderRadius: 10, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { fontSize: 8, fontWeight: '900', color: '#fff' },
});

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  const { totalCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 2.5,
          borderTopColor: '#111',
          height: 72,
          paddingBottom: 10,
          paddingTop: 4,
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name={AppRoutes.tabHome}
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="TRANG CHỦ" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={AppRoutes.tabSearch}
        component={SearchStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔍" label="TÌM KIẾM" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={AppRoutes.tabCart}
        component={CartPage}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🛒" label="GIỎ HÀNG" focused={focused} badgeCount={totalCount} />
          ),
        }}
      />
      <Tab.Screen
        name={AppRoutes.tabProfile}
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="TÀI KHOẢN" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
