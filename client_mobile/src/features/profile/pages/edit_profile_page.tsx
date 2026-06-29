import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView,
  Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../auth/controllers/auth_context';
import { API_BASE_URL } from '../../../core/constants/api_config';
import { editProfileStyles as styles } from './edit_profile_page.styles';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/png?seed=Felix',
  'https://api.dicebear.com/7.x/adventurer/png?seed=Aneka',
  'https://api.dicebear.com/7.x/adventurer/png?seed=Buster',
  'https://api.dicebear.com/7.x/adventurer/png?seed=Garfield',
  'https://api.dicebear.com/7.x/adventurer/png?seed=Bella',
];

export function EditProfilePage() {
  const navigation = useNavigation<any>();
  const { user, token, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? PRESET_AVATARS[0]);
  const [customUrl, setCustomUrl] = useState(
    user?.avatar_url && !PRESET_AVATARS.includes(user.avatar_url) ? user.avatar_url : ''
  );
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ và tên');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập số điện thoại');
      return;
    }

    setIsSaving(true);
    const finalAvatar = customUrl.trim() ? customUrl.trim() : avatarUrl;

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user!.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim(),
          avatar_url: finalAvatar,
        }),
      });

      if (res.ok) {
        // Sync state & storage locally
        await updateProfile({
          full_name: fullName.trim(),
          phone: phone.trim(),
          avatar_url: finalAvatar,
        });

        Alert.alert('🎉 Thành công', 'Thông tin cá nhân đã được cập nhật!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        const errJson = await res.json().catch(() => ({}));
        Alert.alert('Lỗi', errJson?.message ?? 'Cập nhật thất bại');
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Lỗi kết nối đến máy chủ');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>CHỈNH SỬA THÔNG TIN</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Text style={styles.avatarTitle}>Ảnh đại diện</Text>
            
            <View style={styles.avatarPreviewWrap}>
              <Image
                source={{ uri: customUrl.trim() || avatarUrl }}
                style={styles.avatarPreview}
              />
            </View>

            {/* Presets */}
            <View style={styles.presetsRow}>
              {PRESET_AVATARS.map((url) => {
                const isActive = avatarUrl === url && !customUrl;
                return (
                  <Pressable
                    key={url}
                    style={[styles.presetCircle, isActive && styles.presetCircleActive]}
                    onPress={() => {
                      setAvatarUrl(url);
                      setCustomUrl('');
                    }}
                  >
                    <Image source={{ uri: url }} style={styles.presetImg} />
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Địa chỉ Email</Text>
            <View style={styles.inputWrap}>
              <View style={styles.inputShadow} />
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={user?.email ?? ''}
                editable={false}
              />
            </View>
          </View>

          {/* Full name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Họ và tên</Text>
            <View style={styles.inputWrap}>
              <View style={styles.inputShadow} />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nguyễn Văn A"
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Số điện thoại</Text>
            <View style={styles.inputWrap}>
              <View style={styles.inputShadow} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="09XXXXXXXX"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Custom Avatar URL */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Link ảnh tùy chỉnh (Tùy chọn)</Text>
            <View style={styles.inputWrap}>
              <View style={styles.inputShadow} />
              <TextInput
                style={styles.input}
                value={customUrl}
                onChangeText={setCustomUrl}
                placeholder="https://example.com/avatar.png"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.btnWrap}>
            <View style={styles.btnShadow} />
            <Pressable
              style={styles.btn}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#111" />
              ) : (
                <Text style={styles.btnText}>LƯU THAY ĐỔI</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default EditProfilePage;
