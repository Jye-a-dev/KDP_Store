import React from 'react';
import { View, Text, ScrollView, Image, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../auth/controllers/auth_context';
import { AppRoutes } from '../../../app/routes/app_routes';
import { profileStyles } from './profile_page.styles';

// ─── MenuItem ─────────────────────────────────────────────────────────────────

function MenuItem({
  icon, label, onPress, danger = false,
}: { icon: string; label: string; onPress: () => void; danger?: boolean }) {
  return (
    <View style={profileStyles.menuItem}>
      <View style={profileStyles.menuShadow} />
      <Pressable
        style={[profileStyles.menuRow, danger && profileStyles.menuRowDanger]}
        onPress={onPress}
      >
        <Text style={profileStyles.menuIcon}>{icon}</Text>
        <Text style={[profileStyles.menuText, danger && profileStyles.menuDanger]}>{label}</Text>
        <Text style={[profileStyles.menuChevron, danger && profileStyles.menuDanger]}>›</Text>
      </Pressable>
    </View>
  );
}

// ─── ProfilePage ──────────────────────────────────────────────────────────────

export function ProfilePage() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  const initial = user?.full_name?.charAt(0)?.toUpperCase() ?? '?';

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn muốn đăng xuất khỏi KDP Store?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const handlePlaceholder = (feature: string) => {
    Alert.alert(feature, 'Tính năng này sắp ra mắt! 🚀');
  };

  return (
    <SafeAreaView style={profileStyles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header strip */}
        <View style={profileStyles.headerStrip}>
          <Text style={profileStyles.headerTitle}>TÀI KHOẢN · KDP STORE</Text>
        </View>

        {/* Avatar card */}
        <View style={profileStyles.avatarCard}>
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={profileStyles.avatarImage} />
          ) : (
            <View style={profileStyles.avatarCircle}>
              <Text style={profileStyles.avatarInitial}>{initial}</Text>
            </View>
          )}
          <View style={profileStyles.userInfo}>
            <Text style={profileStyles.userName}>{user?.full_name ?? 'Người dùng'}</Text>
            <Text style={profileStyles.userEmail}>{user?.email ?? ''}</Text>
            {user?.phone && <Text style={profileStyles.userPhone}>📞 {user.phone}</Text>}
            <View style={profileStyles.roleBadge}>
              <Text style={profileStyles.roleBadgeText}>
                {user?.role === 'admin' ? '👑 ADMIN' : '🛍️ KHÁCH HÀNG'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Menu: Tài khoản ── */}
        <View style={profileStyles.menuSection}>
          <Text style={profileStyles.menuLabel}>TÀI KHOẢN</Text>
          <MenuItem
            icon="📦"
            label="Đơn hàng của tôi"
            onPress={() => navigation.navigate('ProfileOrders')}
          />
          <MenuItem
            icon="📍"
            label="Địa chỉ giao hàng"
            onPress={() => navigation.navigate('ProfileShippingAddress')}
          />
          <MenuItem
            icon="🔒"
            label="Đổi mật khẩu"
            onPress={() => handlePlaceholder('Đổi mật khẩu')}
          />
        </View>

        {/* ── Menu: Hỗ trợ ── */}
        <View style={profileStyles.menuSection}>
          <Text style={profileStyles.menuLabel}>HỖ TRỢ</Text>
          <MenuItem
            icon="💬"
            label="Chat với KDP Store"
            onPress={() => handlePlaceholder('Chat hỗ trợ')}
          />
          <MenuItem
            icon="⭐"
            label="Đánh giá ứng dụng"
            onPress={() => handlePlaceholder('Đánh giá app')}
          />
        </View>

        <View style={profileStyles.separator} />

        {/* ── Logout ── */}
        <View style={profileStyles.menuSection}>
          <MenuItem icon="🚪" label="Đăng xuất" onPress={handleLogout} danger />
        </View>

        <Text style={profileStyles.version}>KDP Store v1.0.0 · Made with ❤️</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfilePage;
