import React, { useState } from 'react';
import {
  StyleSheet,
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

export function RegisterPage() {
  const navigation = useNavigation<any>();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Vui lòng điền đầy đủ các thông tin đăng ký.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(fullName.trim(), email.trim(), password);
    } catch (err: any) {
      setError(err?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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
              {/* Title */}
              <View style={styles.titleWrap}>
                <Text style={styles.title}>ĐĂNG KÝ</Text>
                <View style={styles.titleBar} />
              </View>

              {/* Error */}
              {!!error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
              )}

              {/* Họ và tên */}
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>HỌ VÀ TÊN</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor="#aaa"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

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
                <Text style={styles.label}>MẬT KHẨU</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {/* Confirm Password */}
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>XÁC NHẬN MẬT KHẨU</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              {/* Submit */}
              <View style={styles.btnWrap}>
                <View style={styles.btnShadow} />
                <Pressable style={styles.btn} onPress={handleRegister} disabled={loading}>
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.btnText}>ĐĂNG KÝ TÀI KHOẢN MỚI</Text>}
                </Pressable>
              </View>

              {/* Footer link */}
              <Pressable onPress={() => navigation.navigate(AppRoutes.login)} style={styles.footer}>
                <Text style={styles.footerText}>
                  ĐÃ CÓ TÀI KHOẢN?{' '}
                  <Text style={styles.footerLink}>ĐĂNG NHẬP</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8DE22' },

  stripe: {
    height: 52,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { color: '#F8DE22', fontSize: 16, fontWeight: '900', letterSpacing: 4 },

  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, paddingVertical: 32 },

  cardWrap: { width: '100%', maxWidth: 380, position: 'relative' },
  cardShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#111', borderRadius: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 2.5, borderColor: '#111', borderRadius: 24,
    padding: 28,
  },

  titleWrap: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '900', color: '#111' },
  titleBar: {
    position: 'absolute', bottom: 2, left: 0, width: 64, height: 8,
    backgroundColor: '#F8DE22', zIndex: -1,
  },

  errorBox: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: 'rgba(209,32,82,0.08)',
    borderWidth: 1.5, borderColor: '#D12052',
    borderRadius: 10,
  },
  errorText: { color: '#D12052', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },

  fieldWrap: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '900', color: '#111', letterSpacing: 0.8, marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 2, borderColor: '#111', borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14, fontWeight: '600', color: '#111',
    backgroundColor: '#fafafa',
  },

  btnWrap: { height: 50, marginTop: 8, position: 'relative' },
  btnShadow: {
    position: 'absolute', top: 3, left: 3, right: -3, bottom: -3,
    backgroundColor: '#D12052', borderRadius: 12,
  },
  btn: {
    flex: 1,
    backgroundColor: '#111', borderWidth: 2, borderColor: '#111', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },

  footer: { marginTop: 22, alignItems: 'center' },
  footerText: { fontSize: 11, fontWeight: '700', color: '#555', letterSpacing: 0.5 },
  footerLink: { color: '#D12052', fontWeight: '900', textDecorationLine: 'underline' },
});

export default RegisterPage;
