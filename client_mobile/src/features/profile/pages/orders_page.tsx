import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../auth/controllers/auth_context';
import { API_ENDPOINTS } from '../../../core/constants/api_config';
import { StyleSheet } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Order {
  id: string;
  total_amount: string;
  final_amount: string;
  shipping_fee: string;
  shipping_name: string;
  shipping_address: string;
  order_status: string;
  payment_info: { method: string; status: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  created_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatVND(n: string | number): string {
  const val = typeof n === 'string' ? parseFloat(n) : n;
  if (isNaN(val)) return '—';
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M₫`;
  if (val >= 1_000) return `${Math.round(val / 1_000)}K₫`;
  return `${Math.round(val)}₫`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ xử lý', color: '#111', bg: '#F8DE22' },
  confirmed: { label: 'Đã xác nhận', color: '#fff', bg: '#03AED2' },
  shipping: { label: 'Đang giao', color: '#fff', bg: '#F45B26' },
  delivered: { label: 'Đã giao', color: '#fff', bg: '#2ECC71' },
  cancelled: { label: 'Đã hủy', color: '#fff', bg: '#E74C3C' },
};

// ─── OrderCard ────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const statusInfo = STATUS_MAP[order.order_status] ?? { label: order.order_status, color: '#111', bg: '#eee' };
  const shortId = order.id.slice(0, 8).toUpperCase();

  return (
    <View style={styles.cardWrap}>
      <View style={styles.cardShadow} />
      <View style={styles.card}>
        {/* Top row */}
        <View style={styles.cardTop}>
          <Text style={styles.orderId}>#{shortId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
          </View>
        </View>

        {/* Items summary */}
        <Text style={styles.itemsSummary} numberOfLines={2}>
          {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
        </Text>

        <View style={styles.divider} />

        {/* Bottom row */}
        <View style={styles.cardBottom}>
          <Text style={styles.date}>{formatDate(order.created_at)}</Text>
          <Text style={styles.amount}>{formatVND(order.final_amount)}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── OrdersPage ───────────────────────────────────────────────────────────────

export function OrdersPage() {
  const navigation = useNavigation<any>();
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_ENDPOINTS.orders, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Không tải được đơn hàng');
        const data = await res.json();
        const list: Order[] = (data.data ?? data) as Order[];
        setOrders(list);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>ĐƠN HÀNG CỦA TÔI</Text>
      </View>

      {isLoading && (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color="#111" />
          <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
        </View>
      )}

      {!isLoading && error && (
        <View style={styles.centerWrap}>
          <Text style={{ fontSize: 40 }}>😕</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <View style={styles.centerWrap}>
          <Text style={{ fontSize: 56 }}>📦</Text>
          <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
          <Text style={styles.emptyDesc}>Hãy đặt hàng ngay nhé!</Text>
        </View>
      )}

      {!isLoading && orders.length > 0 && (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <OrderCard order={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14,
    backgroundColor: '#fff', borderBottomWidth: 2.5, borderBottomColor: '#111', gap: 12,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 10, borderWidth: 2, borderColor: '#111',
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 18, fontWeight: '900', color: '#111' },
  headerTitle: { fontSize: 17, fontWeight: '900', color: '#111' },

  list: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },

  cardWrap: { position: 'relative', marginBottom: 16 },
  cardShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#111', borderRadius: 14,
  },
  card: {
    backgroundColor: '#fff', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 14, padding: 16,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontSize: 14, fontWeight: '900', color: '#111' },
  statusBadge: {
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1.5, borderColor: '#111',
  },
  statusText: { fontSize: 11, fontWeight: '900' },
  itemsSummary: { fontSize: 12, color: '#555', fontWeight: '500', lineHeight: 18, marginBottom: 12 },
  divider: { height: 1.5, backgroundColor: '#eee', marginBottom: 12 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 12, color: '#888', fontWeight: '600' },
  amount: { fontSize: 16, fontWeight: '900', color: '#F45B26' },

  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 13, color: '#666', fontWeight: '600' },
  errorText: { fontSize: 14, color: '#F45B26', fontWeight: '700' },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  emptyDesc: { fontSize: 13, color: '#888' },
});

export default OrdersPage;
