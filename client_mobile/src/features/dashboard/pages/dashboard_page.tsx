import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../auth/controllers/auth_context';
import { API_BASE_URL } from '../../../core/constants/api_config';
import { AppRoutes } from '../../../app/routes/app_routes';
import { pcStyles, catStyles, bannerStyles, dashStyles, CARD_W } from './dashboard_page.styles';

// ─── Types ─────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  price: string;
  discount_price?: string | null;
  images_2d: string[];
  badge?: string | null;
  is_published: boolean;
}

interface Category {
  id: number;
  name: string;
  image_url?: string | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatVND(price: string | number): string {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(n)) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M₫`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K₫`;
  return `${Math.round(n)}₫`;
}

function getGreeting(name: string): string {
  const h = new Date().getHours();
  const prefix = h < 12 ? 'Chào buổi sáng' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  return `${prefix}, ${name.split(' ').pop()}!`;
}

// ─── ProductCard ────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  const navigation = useNavigation<any>();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const imgUri = Array.isArray(product.images_2d) ? product.images_2d[0] : product.images_2d;
  const hasDiscount = product.discount_price && parseFloat(product.discount_price) > 0;

  return (
    <Animated.View
      style={[
        pcStyles.wrap,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }] },
      ]}
    >
      <View style={pcStyles.shadow} />
      <Pressable
        style={pcStyles.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => navigation.navigate('HomeProductDetail', { productId: product.id, productName: product.name })}
      >
        {/* Image */}
        <View style={pcStyles.imgWrap}>
          {imgUri ? (
            <Image source={{ uri: imgUri }} style={pcStyles.img} resizeMode="cover" />
          ) : (
            <View style={pcStyles.imgFallback}>
              <Text style={{ fontSize: 32 }}>👕</Text>
            </View>
          )}
          {/* Badge */}
          {product.badge && (
            <View style={pcStyles.badge}>
              <Text style={pcStyles.badgeText}>{product.badge}</Text>
            </View>
          )}
          {hasDiscount && (
            <View style={pcStyles.saleBadge}>
              <Text style={pcStyles.saleText}>SALE</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={pcStyles.info}>
          <Text style={pcStyles.name} numberOfLines={2}>{product.name}</Text>
          <View style={pcStyles.priceRow}>
            {hasDiscount ? (
              <>
                <Text style={pcStyles.priceDiscount}>{formatVND(product.discount_price!)}</Text>
                <Text style={pcStyles.priceOriginal}>{formatVND(product.price)}</Text>
              </>
            ) : (
              <Text style={pcStyles.price}>{formatVND(product.price)}</Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── CategoryChip ───────────────────────────────────────────────────────────

const CAT_COLORS = ['#F45B26', '#03AED2', '#F8DE22', '#9B59B6', '#2ECC71', '#E74C3C'];

function CategoryChip({
  cat,
  idx,
  selected,
  onPress,
}: {
  cat: Category;
  idx: number;
  selected: boolean;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const color = CAT_COLORS[idx % CAT_COLORS.length];

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.93, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[
          catStyles.chip,
          selected && { backgroundColor: '#111', borderColor: '#111' },
          !selected && { backgroundColor: '#fff', borderColor: '#111' },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={[catStyles.dot, { backgroundColor: selected ? '#F8DE22' : color }]} />
        <Text style={[catStyles.label, selected && { color: '#fff' }]}>{cat.name}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Banner ─────────────────────────────────────────────────────────────────

function PromoBanner() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.03, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={bannerStyles.wrap}>
      <View style={bannerStyles.shadow} />
      <View style={bannerStyles.card}>
        <View style={bannerStyles.left}>
          <Text style={bannerStyles.sub}>THÀNH VIÊN MỚI</Text>
          <Text style={bannerStyles.title}>Giảm 15%{'\n'}đơn đầu tiên</Text>
          <View style={bannerStyles.codePill}>
            <Text style={bannerStyles.codeText}>KDP15</Text>
          </View>
        </View>
        <Animated.Text style={[bannerStyles.emoji, { transform: [{ scale: pulse }] }]}>
          🎁
        </Animated.Text>
      </View>
    </View>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const headerAnim = useRef(new Animated.Value(-80)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products?limit=20&page=1&sort_by=created_at&sort_order=DESC`),
        fetch(`${API_BASE_URL}/categories?limit=50`),
      ]);

      if (pRes.ok) {
        const pData = await pRes.json();
        const list: Product[] = (pData.data ?? pData) as Product[];
        setProducts(list.filter((p) => p.is_published));
      }

      if (cRes.ok) {
        const cData = await cRes.json();
        const catList: Category[] = (cData.data ?? cData) as Category[];
        setCategories(catList.filter((c) => (c as any).parent_id === null).slice(0, 8));
      }
    } catch (e) {
      console.error('[Dashboard] fetch error:', e);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const filteredProducts = selectedCat
    ? products.filter((p) => (p as any).category_id === selectedCat)
    : products;

  return (
    <SafeAreaView style={dashStyles.safe}>
      {/* ── Header ── */}
      <Animated.View style={[dashStyles.header, { transform: [{ translateY: headerAnim }], opacity: headerOpacity }]}>
        <View>
          <Text style={dashStyles.greeting}>
            {user ? getGreeting(user.full_name) : 'Xin chào!'}
          </Text>
          <Text style={dashStyles.subGreeting}>Khám phá xu hướng mới nhất</Text>
        </View>
      </Animated.View>

      {/* ── KDP Brand strip ── */}
      <View style={dashStyles.brandStrip}>
        <Text style={dashStyles.brandText}>KDP STORE</Text>
        <View style={dashStyles.brandDot} />
        <Text style={dashStyles.brandSub}>NEW ARRIVALS</Text>
      </View>

      <ScrollView
        style={dashStyles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#111" />
        }
      >
        {/* ── Promo Banner ── */}
        <View style={dashStyles.section}>
          <PromoBanner />
        </View>

        {/* ── Category Chips ── */}
        {categories.length > 0 && (
          <View style={dashStyles.section}>
            <Text style={dashStyles.sectionTitle}>DANH MỤC</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={dashStyles.chipRow}>
              <View style={{ marginRight: 4 }}>
                <CategoryChip
                  cat={{ id: 0, name: 'Tất cả' }}
                  idx={-1}
                  selected={selectedCat === null}
                  onPress={() => setSelectedCat(null)}
                />
              </View>
              {categories.map((cat, idx) => (
                <View key={cat.id} style={{ marginRight: 4 }}>
                  <CategoryChip
                    cat={cat}
                    idx={idx}
                    selected={selectedCat === cat.id}
                    onPress={() => setSelectedCat(cat.id === selectedCat ? null : cat.id)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Products Grid ── */}
        <View style={dashStyles.section}>
          <View style={dashStyles.sectionRow}>
            <Text style={dashStyles.sectionTitle}>SẢN PHẨM MỚI</Text>
            <Text style={dashStyles.sectionCount}>{filteredProducts.length} sản phẩm</Text>
          </View>

          {isLoading ? (
            <View style={dashStyles.loadingWrap}>
              <ActivityIndicator size="large" color="#111" />
              <Text style={dashStyles.loadingText}>Đang tải...</Text>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View style={dashStyles.emptyWrap}>
              <Text style={dashStyles.emptyEmoji}>🛍️</Text>
              <Text style={dashStyles.emptyText}>Không có sản phẩm</Text>
            </View>
          ) : (
            <View style={dashStyles.grid}>
              {filteredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </View>
          )}
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default DashboardPage;
