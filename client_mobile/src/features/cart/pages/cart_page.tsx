import React, { useCallback, useState } from 'react';
import {
  View, Text, FlatList, Image, Pressable, Alert,
  Modal, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../controllers/cart_context';
import { cartStyles, checkoutStyles } from './cart_page.styles';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatVND(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M₫`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K₫`;
  return `${Math.round(n)}₫`;
}

// ─── CartItemRow ─────────────────────────────────────────────────────────────

function CartItemRow({ item }: { item: ReturnType<typeof useCart>['items'][0] }) {
  const { removeItem, updateQty } = useCart();

  return (
    <View style={cartStyles.itemWrap}>
      <View style={cartStyles.itemShadow} />
      <View style={cartStyles.itemCard}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={cartStyles.itemImg} resizeMode="cover" />
        ) : (
          <View style={cartStyles.itemImgFallback}>
            <Text style={{ fontSize: 28 }}>👕</Text>
          </View>
        )}

        <View style={cartStyles.itemInfo}>
          <Text style={cartStyles.itemName} numberOfLines={2}>{item.name}</Text>
          <Text style={cartStyles.itemPrice}>{formatVND(item.price)}</Text>
          {item.originalPrice && item.originalPrice > item.price && (
            <Text style={cartStyles.itemOriginal}>{formatVND(item.originalPrice)}</Text>
          )}

          <View style={cartStyles.qtyRow}>
            <Pressable
              style={[cartStyles.qtyBtn, item.quantity <= 1 && cartStyles.qtyBtnActive]}
              onPress={() => updateQty(item.productId, item.quantity - 1)}
            >
              <Text style={[cartStyles.qtyBtnText, item.quantity <= 1 && cartStyles.qtyBtnTextActive]}>−</Text>
            </Pressable>
            <Text style={cartStyles.qtyVal}>{item.quantity}</Text>
            <Pressable style={cartStyles.qtyBtn} onPress={() => updateQty(item.productId, item.quantity + 1)}>
              <Text style={cartStyles.qtyBtnText}>+</Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={cartStyles.removeBtn} onPress={() => removeItem(item.productId)}>
          <Text style={cartStyles.removeText}>🗑️</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── CheckoutModal ────────────────────────────────────────────────────────────

function CheckoutModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { checkout, totalCount, totalPrice } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [payMethod, setPayMethod] = useState<'COD' | 'VNPAY'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = useCallback(async () => {
    if (!name.trim()) { Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ tên'); return; }
    if (!phone.trim()) { Alert.alert('Thiếu thông tin', 'Vui lòng nhập số điện thoại'); return; }
    if (!address.trim()) { Alert.alert('Thiếu thông tin', 'Vui lòng nhập địa chỉ'); return; }

    setIsSubmitting(true);
    const result = await checkout({
      shipping_name: name.trim(),
      shipping_phone: phone.trim(),
      shipping_address: address.trim(),
      shipping_fee: 30000,
      payment_method: payMethod,
    });
    setIsSubmitting(false);

    if (result.success) {
      onClose();
      Alert.alert(
        '🎉 Đặt hàng thành công!',
        `Mã đơn hàng: #${result.orderId?.slice(0, 8).toUpperCase()}\n\nKDP Store sẽ liên hệ xác nhận trong thời gian sớm nhất.`,
        [{ text: 'OK' }]
      );
      // Reset form
      setName(''); setPhone(''); setAddress('');
    } else {
      Alert.alert('Đặt hàng thất bại', result.error ?? 'Vui lòng thử lại');
    }
  }, [name, phone, address, payMethod, checkout, onClose]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={checkoutStyles.modal}>
          {/* Header */}
          <View style={checkoutStyles.modalHeader}>
            <Text style={checkoutStyles.modalTitle}>ĐẶT HÀNG</Text>
            <Pressable style={checkoutStyles.closeBtn} onPress={onClose}>
              <Text style={checkoutStyles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={checkoutStyles.form} showsVerticalScrollIndicator={false}>
            {/* Order summary */}
            <View style={checkoutStyles.summaryBox}>
              <Text style={checkoutStyles.summaryBoxTitle}>TÓM TẮT ĐƠN HÀNG</Text>
              <View style={checkoutStyles.summaryRow}>
                <Text style={checkoutStyles.summaryLabel}>{totalCount} sản phẩm</Text>
                <Text style={checkoutStyles.summaryVal}>{formatVND(totalPrice)}</Text>
              </View>
              <View style={checkoutStyles.summaryRow}>
                <Text style={checkoutStyles.summaryLabel}>Phí vận chuyển</Text>
                <Text style={checkoutStyles.summaryVal}>30K₫</Text>
              </View>
              <View style={[checkoutStyles.summaryRow, { marginTop: 8 }]}>
                <Text style={[checkoutStyles.summaryLabel, { fontWeight: '900', color: '#111' }]}>Tổng cộng</Text>
                <Text style={checkoutStyles.summaryTotal}>{formatVND(totalPrice + 30000)}</Text>
              </View>
            </View>

            {/* Shipping info */}
            <Text style={checkoutStyles.sectionLabel}>THÔNG TIN GIAO HÀNG</Text>

            <View style={checkoutStyles.fieldWrap}>
              <Text style={checkoutStyles.fieldLabel}>Họ tên người nhận *</Text>
              <TextInput
                style={checkoutStyles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nguyễn Văn A"
                placeholderTextColor="#bbb"
              />
            </View>

            <View style={checkoutStyles.fieldWrap}>
              <Text style={checkoutStyles.fieldLabel}>Số điện thoại *</Text>
              <TextInput
                style={checkoutStyles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="0901234567"
                placeholderTextColor="#bbb"
                keyboardType="phone-pad"
              />
            </View>

            <View style={checkoutStyles.fieldWrap}>
              <Text style={checkoutStyles.fieldLabel}>Địa chỉ nhận hàng *</Text>
              <TextInput
                style={[checkoutStyles.input, checkoutStyles.inputMultiline]}
                value={address}
                onChangeText={setAddress}
                placeholder="123 Đường ABC, Quận X, TP. HCM"
                placeholderTextColor="#bbb"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Payment method */}
            <Text style={checkoutStyles.sectionLabel}>PHƯƠNG THỨC THANH TOÁN</Text>
            <View style={checkoutStyles.payRow}>
              {(['COD', 'VNPAY'] as const).map((method) => (
                <Pressable
                  key={method}
                  style={[checkoutStyles.payOption, payMethod === method && checkoutStyles.payOptionActive]}
                  onPress={() => setPayMethod(method)}
                >
                  <Text style={checkoutStyles.payIcon}>{method === 'COD' ? '💵' : '🏦'}</Text>
                  <Text style={[checkoutStyles.payLabel, payMethod === method && checkoutStyles.payLabelActive]}>
                    {method === 'COD' ? 'Thanh toán khi nhận hàng' : 'VNPAY'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>

          {/* Place order button */}
          <View style={checkoutStyles.footer}>
            <View style={checkoutStyles.footerShadow} />
            <Pressable
              style={[checkoutStyles.orderBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#111" />
              ) : (
                <Text style={checkoutStyles.orderBtnText}>
                  ĐẶT HÀNG — {formatVND(totalPrice + 30000)}
                </Text>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── CartPage ─────────────────────────────────────────────────────────────────

export function CartPage() {
  const { items, totalCount, totalPrice, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (items.length === 0) {
    return (
      <SafeAreaView style={cartStyles.safe}>
        <View style={cartStyles.header}>
          <Text style={cartStyles.headerTitle}>GIỎ HÀNG 🛒</Text>
        </View>
        <View style={cartStyles.emptyWrap}>
          <Text style={cartStyles.emptyEmoji}>🛍️</Text>
          <Text style={cartStyles.emptyTitle}>Giỏ hàng trống</Text>
          <Text style={cartStyles.emptyDesc}>Hãy thêm sản phẩm vào giỏ hàng</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={cartStyles.safe}>
      <View style={cartStyles.header}>
        <Text style={cartStyles.headerTitle}>GIỎ HÀNG 🛒</Text>
        <Pressable style={cartStyles.clearBtn} onPress={() =>
          Alert.alert('Xóa tất cả?', 'Giỏ hàng sẽ được làm trống.', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xóa', style: 'destructive', onPress: clearCart },
          ])
        }>
          <Text style={cartStyles.clearText}>Xóa tất cả</Text>
        </Pressable>
      </View>

      <FlatList
        style={cartStyles.list}
        contentContainerStyle={cartStyles.listContent}
        data={items}
        keyExtractor={(item) => String(item.productId)}
        renderItem={({ item }) => <CartItemRow item={item} />}
        showsVerticalScrollIndicator={false}
      />

      <View style={cartStyles.footer}>
        <View style={cartStyles.summaryRow}>
          <Text style={cartStyles.summaryLabel}>{totalCount} sản phẩm</Text>
          <Text style={cartStyles.summaryTotal}>{formatVND(totalPrice)}</Text>
        </View>
        <View style={cartStyles.checkoutWrap}>
          <View style={cartStyles.checkoutShadow} />
          <Pressable style={cartStyles.checkoutBtn} onPress={() => setShowCheckout(true)}>
            <Text style={cartStyles.checkoutText}>ĐẶT HÀNG NGAY →</Text>
          </Pressable>
        </View>
      </View>

      <CheckoutModal visible={showCheckout} onClose={() => setShowCheckout(false)} />
    </SafeAreaView>
  );
}

export default CartPage;
