import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput,
  ActivityIndicator, Alert, Modal, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../auth/controllers/auth_context';
import { API_BASE_URL } from '../../../core/constants/api_config';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Address {
  id: string;
  label?: string;
  recipient_name: string;
  phone: string;
  address: string;
  is_default?: boolean;
}

// ─── ShippingAddressPage ──────────────────────────────────────────────────────

export function ShippingAddressPage() {
  const navigation = useNavigation<any>();
  const { user, token } = useAuth();

  // Seed from user.addresses immediately so data shows without network round-trip
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const stored = (user as any)?.addresses;
    return Array.isArray(stored) ? stored : [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state — pre-filled from auth user
  const [label, setLabel] = useState('');
  const [recipientName, setRecipientName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Build headers inline — always fresh token
  const makeHeaders = useCallback(
    () => ({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token],
  );

  // ── Fetch addresses ────────────────────────────────────────────────────────

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}/addresses`, {
        headers: makeHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(Array.isArray(data) ? data : []);
      } else {
        // API endpoint may not exist — keep whatever we seeded from user object
      }
    } catch {
      // keep seeded data on network error
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, makeHeaders]);

  useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

  // ── Add address ────────────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    if (!recipientName.trim()) { Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ tên người nhận'); return; }
    if (!phone.trim()) { Alert.alert('Thiếu thông tin', 'Vui lòng nhập số điện thoại'); return; }
    if (!address.trim()) { Alert.alert('Thiếu thông tin', 'Vui lòng nhập địa chỉ'); return; }

    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user!.id}/addresses`, {
        method: 'POST',
        headers: makeHeaders(),
        body: JSON.stringify({
          label: label.trim() || 'Nhà',
          recipient_name: recipientName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          is_default: isDefault,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setLabel(''); setRecipientName(user?.full_name ?? '');
        setPhone(user?.phone ?? ''); setAddress(''); setIsDefault(false);
        await fetchAddresses();
      } else {
        const j = await res.json().catch(() => ({}));
        Alert.alert('Lỗi', j?.message ?? 'Không thể lưu địa chỉ');
      }
    } catch {
      Alert.alert('Lỗi', 'Lỗi kết nối');
    } finally {
      setIsSaving(false);
    }
  }, [recipientName, phone, address, label, isDefault, user, makeHeaders, fetchAddresses]);

  // ── Delete address ─────────────────────────────────────────────────────────

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Xóa địa chỉ?', 'Địa chỉ này sẽ bị xóa vĩnh viễn.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive', onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/users/${user!.id}/addresses/${id}`, {
              method: 'DELETE', headers: makeHeaders(),
            });
            if (res.ok || res.status === 404) {
              await fetchAddresses();
            }
          } catch { /* silent */ }
        },
      },
    ]);
  }, [user, makeHeaders, fetchAddresses]);

  // ── Set default ────────────────────────────────────────────────────────────

  const handleSetDefault = useCallback(async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/users/${user!.id}/addresses/${id}`, {
        method: 'PATCH',
        headers: makeHeaders(),
        body: JSON.stringify({ is_default: true }),
      });
      await fetchAddresses();
    } catch { /* silent */ }
  }, [user, makeHeaders, fetchAddresses]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <Text style={s.headerTitle}>ĐỊA CHỈ GIAO HÀNG</Text>
        <Pressable style={s.addBtn} onPress={() => setShowForm(true)}>
          <Text style={s.addBtnText}>+ THÊM</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#111" />
          <Text style={s.loadText}>Đang tải địa chỉ...</Text>
        </View>
      ) : addresses.length === 0 ? (
        <View style={s.center}>
          <Text style={{ fontSize: 56 }}>📍</Text>
          <Text style={s.emptyTitle}>Chưa có địa chỉ nào</Text>
          <Text style={s.emptyDesc}>Thêm địa chỉ để đặt hàng nhanh hơn</Text>
          <Pressable style={s.emptyAddBtn} onPress={() => setShowForm(true)}>
            <Text style={s.emptyAddBtnText}>+ THÊM ĐỊA CHỈ MỚI</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView style={s.list} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {addresses.map((addr) => (
            <View key={addr.id} style={s.cardWrap}>
              <View style={s.cardShadow} />
              <View style={[s.card, addr.is_default && s.cardDefault]}>
                <View style={s.cardTopRow}>
                  <View style={s.labelWrap}>
                    <Text style={s.labelText}>{addr.label ?? 'Địa chỉ'}</Text>
                  </View>
                  {addr.is_default && (
                    <View style={s.defaultBadge}>
                      <Text style={s.defaultBadgeText}>MẶC ĐỊNH</Text>
                    </View>
                  )}
                </View>
                <Text style={s.recipientName}>{addr.recipient_name}</Text>
                <Text style={s.phoneText}>📞 {addr.phone}</Text>
                <Text style={s.addressText}>📍 {addr.address}</Text>
                <View style={s.cardActions}>
                  {!addr.is_default && (
                    <Pressable style={s.actionBtn} onPress={() => handleSetDefault(addr.id)}>
                      <Text style={s.actionBtnText}>Đặt mặc định</Text>
                    </Pressable>
                  )}
                  <Pressable style={[s.actionBtn, s.actionBtnDanger]} onPress={() => handleDelete(addr.id)}>
                    <Text style={[s.actionBtnText, s.actionBtnDangerText]}>Xóa</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── Add Address Modal ── */}
      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowForm(false)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <SafeAreaView style={s.modal}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>THÊM ĐỊA CHỈ MỚI</Text>
              <Pressable style={s.closeBtn} onPress={() => setShowForm(false)}>
                <Text style={s.closeText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={s.form} showsVerticalScrollIndicator={false}>
              <Field label="Nhãn (VD: Nhà, Công ty)" value={label} onChangeText={setLabel} placeholder="Nhà" />
              <Field label="Họ tên người nhận *" value={recipientName} onChangeText={setRecipientName} placeholder="Nguyễn Văn A" />
              <Field label="Số điện thoại *" value={phone} onChangeText={setPhone} placeholder="0901234567" keyboardType="phone-pad" />
              <Field label="Địa chỉ đầy đủ *" value={address} onChangeText={setAddress} placeholder="123 Đường ABC, Quận X, TP. HCM" multiline />

              {/* Default toggle */}
              <Pressable style={s.defaultRow} onPress={() => setIsDefault((v) => !v)}>
                <View style={[s.checkbox, isDefault && s.checkboxActive]}>
                  {isDefault && <Text style={s.checkmark}>✓</Text>}
                </View>
                <Text style={s.defaultLabel}>Đặt làm địa chỉ mặc định</Text>
              </Pressable>

              <View style={{ height: 16 }} />
            </ScrollView>

            <View style={s.modalFooter}>
              <View style={s.modalFooterShadow} />
              <Pressable
                style={[s.saveBtn, isSaving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving
                  ? <ActivityIndicator color="#111" />
                  : <Text style={s.saveBtnText}>LƯU ĐỊA CHỈ</Text>
                }
              </Pressable>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Field helper ─────────────────────────────────────────────────────────────

function Field({
  label, value, onChangeText, placeholder, keyboardType, multiline,
}: {
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder?: string; keyboardType?: any; multiline?: boolean;
}) {
  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        style={[s.input, multiline && s.inputMulti]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12,
    borderBottomWidth: 2.5, borderBottomColor: '#111', backgroundColor: '#fff',
    gap: 10,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 10, borderWidth: 2, borderColor: '#111',
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 18 },
  headerTitle: { flex: 1, fontSize: 15, fontWeight: '900', color: '#111', letterSpacing: 0.5 },
  addBtn: {
    backgroundColor: '#F8DE22', borderWidth: 2, borderColor: '#111',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6,
  },
  addBtnText: { fontSize: 12, fontWeight: '900', color: '#111' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
  loadText: { fontSize: 14, color: '#666', fontWeight: '600' },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  emptyDesc: { fontSize: 13, color: '#666', textAlign: 'center' },
  emptyAddBtn: {
    marginTop: 8, backgroundColor: '#111', borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  emptyAddBtnText: { color: '#F8DE22', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },

  list: { flex: 1, padding: 16 },

  cardWrap: { position: 'relative', marginBottom: 16 },
  cardShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#111', borderRadius: 16,
  },
  card: {
    backgroundColor: '#fff', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 16, padding: 16, gap: 6,
  },
  cardDefault: { backgroundColor: '#FFFDE7', borderColor: '#F8DE22' },

  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  labelWrap: {
    backgroundColor: '#111', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  labelText: { fontSize: 11, fontWeight: '900', color: '#F8DE22', letterSpacing: 0.5 },
  defaultBadge: {
    backgroundColor: '#F8DE22', borderWidth: 1.5, borderColor: '#111',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
  },
  defaultBadgeText: { fontSize: 10, fontWeight: '900', color: '#111' },

  recipientName: { fontSize: 16, fontWeight: '900', color: '#111' },
  phoneText: { fontSize: 13, color: '#444', fontWeight: '600' },
  addressText: { fontSize: 13, color: '#444', fontWeight: '600', lineHeight: 18 },

  cardActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: {
    borderWidth: 2, borderColor: '#111', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: '#111' },
  actionBtnDanger: { borderColor: '#F45B26' },
  actionBtnDangerText: { color: '#F45B26' },

  // Modal
  modal: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 2, borderBottomColor: '#111',
  },
  modalTitle: { fontSize: 16, fontWeight: '900', color: '#111', letterSpacing: 0.5 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 8, borderWidth: 2, borderColor: '#111',
    alignItems: 'center', justifyContent: 'center',
  },
  closeText: { fontSize: 14, fontWeight: '900', color: '#111' },

  form: { flex: 1, padding: 20 },
  fieldWrap: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#666', marginBottom: 6, letterSpacing: 0.3 },
  input: {
    borderWidth: 2, borderColor: '#111', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, fontWeight: '600', color: '#111', backgroundColor: '#fff',
  },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },

  defaultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#111',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  checkboxActive: { backgroundColor: '#111' },
  checkmark: { fontSize: 13, color: '#F8DE22', fontWeight: '900' },
  defaultLabel: { fontSize: 14, fontWeight: '700', color: '#111' },

  modalFooter: { position: 'relative', padding: 20, paddingTop: 12 },
  modalFooterShadow: {
    position: 'absolute', top: 17, left: 25, right: -5, bottom: -5,
    backgroundColor: '#111', borderRadius: 14,
  },
  saveBtn: {
    backgroundColor: '#F8DE22', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, fontWeight: '900', color: '#111', letterSpacing: 0.5 },
});

export default ShippingAddressPage;
