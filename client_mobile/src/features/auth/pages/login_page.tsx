import React, { useState } from 'react';
import {
  Text,
  View,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppRoutes } from '../../../app/routes/app_routes';
import { useAuth } from '../controllers/auth_context';
import { styles } from './login_page.styles';

export function LoginPage() {
  const navigation = useNavigation<any>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ thông tin đăng nhập.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top brand stripe */}
      <View style={styles.stripe}>
        <Text style={styles.brand}>KDP STORE</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Card */}
          <View style={styles.cardWrap}>
            <View style={styles.cardShadow} />
            <View style={styles.card}>
              {/* Title with yellow underline highlight */}
              <View style={styles.titleWrap}>
                <Text style={styles.title}>ĐĂNG NHẬP</Text>
                <View style={styles.titleBar} />
              </View>

              {/* Error */}
              {!!error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
              )}

              {/* Email */}
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>ĐỊA CHỈ EMAIL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ten@viethuong.com"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password */}
              <View style={styles.fieldWrap}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>MẬT KHẨU</Text>
                  <Pressable>
                    <Text style={styles.forgot}>QUÊN MẬT KHẨU?</Text>
                  </Pressable>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {/* Submit */}
              <View style={styles.btnWrap}>
                <View style={styles.btnShadow} />
                <Pressable style={styles.btn} onPress={handleLogin} disabled={loading}>
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.btnText}>ĐĂNG NHẬP VÀO HỆ THỐNG</Text>}
                </Pressable>
              </View>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>HOẶC</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google */}
              <View style={styles.googleWrap}>
                <View style={styles.googleShadow} />
                <Pressable style={styles.googleBtn}>
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleText}>TIẾP TỤC VỚI GOOGLE</Text>
                </Pressable>
              </View>

              {/* Footer link */}
              <Pressable onPress={() => navigation.navigate(AppRoutes.register)} style={styles.footer}>
                <Text style={styles.footerText}>
                  CHƯA CÓ TÀI KHOẢN?{' '}
                  <Text style={styles.footerLink}>ĐĂNG KÝ</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginPage;
