import React, { useCallback, useState } from 'react';
import {
  View, Text, FlatList, Pressable, Image,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../auth/controllers/auth_context';
import { API_BASE_URL } from '../../../core/constants/api_config';
import { styles } from './wishlist_page.styles';

interface Product {
  id: number;
  name: string;
  price: string;
  discount_price?: string | null;
  images_2d: string[] | string;
  badge?: string | null;
  stock: number;
  sku: string;
}

export function WishlistPage() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(`@kdp_wishlist_${user.id}`);
      const wishlistIds: number[] = stored ? JSON.parse(stored) : [];

      if (wishlistIds.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      // Fetch all products to filter (similar to search & main dashboard behavior)
      const res = await fetch(`${API_BASE_URL}/products?limit=10000`);
      if (res.ok) {
        const resData = await res.json();
        const allProducts = (Array.isArray(resData) ? resData : resData.data ?? []) as Product[];
        const filtered = allProducts.filter((p) => wishlistIds.includes(p.id));
        setProducts(filtered);
      }
    } catch (e) {
      console.error('[Wishlist] Error loading:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  // Load when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, [loadWishlist])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadWishlist();
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    const imgUri = formatImages(item.images_2d)[0];

    const hasDiscount = item.discount_price && parseFloat(item.discount_price) > 0;
    const finalPrice = hasDiscount ? parseFloat(item.discount_price!) : parseFloat(item.price);

    return (
      <Pressable
        style={styles.cardWrap}
        onPress={() => navigation.navigate('ProfileProductDetail', {
          productId: item.id,
          productName: item.name,
        })}
      >
        <View style={styles.cardShadow} />
        <View style={styles.card}>
          <View style={styles.imgWrap}>
            {imgUri ? (
              <Image source={{ uri: imgUri }} style={styles.img} resizeMode="cover" />
            ) : (
              <View style={styles.imgFallback}>
                <Text style={{ fontSize: 32 }}>👕</Text>
              </View>
            )}
            
            {/* Badges */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge.toUpperCase()}</Text>
                </View>
              )}
              {hasDiscount && (
                <View style={styles.saleBadge}>
                  <Text style={styles.saleText}>SALE</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <View style={styles.priceRow}>
              {hasDiscount ? (
                <>
                  <Text style={styles.priceDiscount}>{formatVND(finalPrice)}</Text>
                  <Text style={styles.priceOriginal}>{formatVND(item.price)}</Text>
                </>
              ) : (
                <Text style={styles.price}>{formatVND(item.price)}</Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>SẢN PHẨM YÊU THÍCH</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#111" />
          <Text style={styles.loadingText}>Đang tải sản phẩm yêu thích...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 56 }}>❤️</Text>
          <Text style={styles.emptyTitle}>Danh sách trống</Text>
          <Text style={styles.emptyDesc}>Hãy thêm những sản phẩm bạn thích vào đây để xem lại bất cứ lúc nào.</Text>
          <View style={styles.emptyBtnWrap}>
            <View style={styles.emptyBtnShadow} />
            <Pressable
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('TabHome')}
            >
              <Text style={styles.emptyBtnText}>XEM SẢN PHẨM</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderProductCard}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#111']} />
          }
        />
      )}
    </SafeAreaView>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatImages(images2d: any): string[] {
  let list: string[] = [];
  if (Array.isArray(images2d)) {
    list = images2d;
  } else if (typeof images2d === 'string' && images2d.trim()) {
    const trimmed = images2d.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) list = parsed;
      } catch (e) {
        list = [trimmed];
      }
    } else if (trimmed.includes(',')) {
      list = trimmed.split(',').map((img) => img.trim()).filter(Boolean);
    } else {
      list = [trimmed];
    }
  }

  return list.map((img) => {
    if (!img) return '';
    const trimmedImg = img.trim();
    if (trimmedImg.startsWith('/') || trimmedImg.startsWith('uploads/')) {
      const cleanPath = trimmedImg.startsWith('/') ? trimmedImg : `/${trimmedImg}`;
      return `${API_BASE_URL}${cleanPath}`;
    }
    return trimmedImg;
  }).filter(Boolean);
}

function formatVND(price: string | number): string {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(n)) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M₫`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K₫`;
  return `${Math.round(n)}₫`;
}

export default WishlistPage;
