import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Image, Pressable, FlatList,
  ActivityIndicator, Dimensions, NativeSyntheticEvent, NativeScrollEvent,
  Alert, Animated, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../auth/controllers/auth_context';
import { useCart } from '../../cart/controllers/cart_context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { API_ENDPOINTS } from '../../../core/constants/api_config';
import { detailStyles, DETAIL_IMG_H } from './product_detail_page.styles';

const { width: W } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  price: string;
  discount_price?: string | null;
  description?: string | null;
  images_2d: string[];
  badge?: string | null;
  stock: number;
  condition?: string | null;
  sku: string;
  model_3d_url?: string | null;
  is_published: boolean;
  category_id?: number | null;
}

// ─── ProductDetailPage ────────────────────────────────────────────────────────

export function ProductDetailPage() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ ProductDetail: { productId: number; productName?: string } }, 'ProductDetail'>>();
  const { productId, productName } = route.params;

  const { user } = useAuth();
  const { addItem, items } = useCart();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const addAnim = useRef(new Animated.Value(1)).current;

  // Read liked state from AsyncStorage
  useEffect(() => {
    (async () => {
      if (!user?.id) return;
      try {
        const stored = await AsyncStorage.getItem(`@kdp_wishlist_${user.id}`);
        const wishlist: number[] = stored ? JSON.parse(stored) : [];
        setIsLiked(wishlist.includes(productId));
      } catch (e) {
        console.error('[Wishlist] Read error:', e);
      }
    })();
  }, [user?.id, productId]);

  const toggleWishlist = async () => {
    if (!user?.id) return;
    try {
      const stored = await AsyncStorage.getItem(`@kdp_wishlist_${user.id}`);
      let wishlist: number[] = stored ? JSON.parse(stored) : [];

      if (wishlist.includes(productId)) {
        wishlist = wishlist.filter((id) => id !== productId);
        setIsLiked(false);
      } else {
        wishlist.push(productId);
        setIsLiked(true);
      }

      await AsyncStorage.setItem(`@kdp_wishlist_${user.id}`, JSON.stringify(wishlist));
    } catch (e) {
      console.error('[Wishlist] Toggle error:', e);
    }
  };

  // Fetch product detail
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_ENDPOINTS.product(productId));
        if (!res.ok) throw new Error('Không tải được sản phẩm');
        const data: ProductDetail = await res.json();
        setProduct(data);
      } catch (e: any) {
        setError(e.message ?? 'Lỗi không xác định');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [productId]);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setActiveImg(idx);
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    const effectivePrice = product.discount_price && parseFloat(product.discount_price) > 0
      ? parseFloat(product.discount_price)
      : parseFloat(product.price);
    const originalPrice = parseFloat(product.price);

    await addItem({
      productId: product.id,
      name: product.name,
      price: effectivePrice,
      originalPrice: originalPrice !== effectivePrice ? originalPrice : undefined,
      image: product.images_2d?.[0],
    }, 1);

    // Bounce animation
    Animated.sequence([
      Animated.spring(addAnim, { toValue: 0.92, useNativeDriver: true }),
      Animated.spring(addAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();

    Alert.alert('🛒 Đã thêm vào giỏ!', product.name, [{ text: 'OK' }]);
  }, [product, addItem]);

  const handleBuyNow = useCallback(async () => {
    if (!product) return;
    const effectivePrice = product.discount_price && parseFloat(product.discount_price) > 0
      ? parseFloat(product.discount_price)
      : parseFloat(product.price);
    const originalPrice = parseFloat(product.price);
    await addItem({
      productId: product.id,
      name: product.name,
      price: effectivePrice,
      originalPrice: originalPrice !== effectivePrice ? originalPrice : undefined,
      image: product.images_2d?.[0],
    }, 1);
    // Navigate to Cart tab
    navigation.navigate('TabCart');
  }, [product, addItem, navigation]);

  const handleView3D = useCallback(async () => {
    if (!product?.slug) {
      Alert.alert('Lỗi', 'Không thể mở mô hình 3D cho sản phẩm này.');
      return;
    }
    const webUrl = `https://kdp-store-pi.vercel.app/products/${product.slug}`;
    try {
      await Linking.openURL(webUrl);
    } catch {
      Alert.alert('Lỗi', 'Không thể mở trình duyệt.');
    }
  }, [product?.slug]);


  const cartQty = items.find((i) => i.productId === productId)?.quantity ?? 0;

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={detailStyles.safe}>
        <View style={detailStyles.backRow}>
          <Pressable style={detailStyles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={detailStyles.backText}>←</Text>
          </Pressable>
          <Text style={detailStyles.backTitle} numberOfLines={1}>{productName ?? 'Chi tiết'}</Text>
        </View>
        <View style={detailStyles.loadingWrap}>
          <ActivityIndicator size="large" color="#111" />
          <Text style={detailStyles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={detailStyles.safe}>
        <View style={detailStyles.backRow}>
          <Pressable style={detailStyles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={detailStyles.backText}>←</Text>
          </Pressable>
          <Text style={detailStyles.backTitle}>Lỗi</Text>
        </View>
        <View style={detailStyles.loadingWrap}>
          <Text style={{ fontSize: 48 }}>😕</Text>
          <Text style={detailStyles.errorText}>{error ?? 'Không tìm thấy sản phẩm'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasDiscount = product.discount_price && parseFloat(product.discount_price) > 0;
  const images = product.images_2d?.length > 0 ? product.images_2d : [];

  return (
    <SafeAreaView style={detailStyles.safe}>
      {/* Back header */}
      <View style={detailStyles.backRow}>
        <Pressable style={detailStyles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={detailStyles.backText}>←</Text>
        </Pressable>
        <Text style={detailStyles.backTitle} numberOfLines={1}>{product.name}</Text>
        <Pressable style={detailStyles.heartBtn} onPress={toggleWishlist}>
          <Text style={[detailStyles.heartText, isLiked && { color: '#F45B26' }]}>
            {isLiked ? '❤️' : '🤍'}
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        {/* ── Image Carousel ── */}
        <View style={{ position: 'relative' }}>
          {images.length > 0 ? (
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              keyExtractor={(_, i) => String(i)}
              renderItem={({ item: uri }) => (
                <Image source={{ uri }} style={detailStyles.carouselImg} resizeMode="contain" />
              )}
            />
          ) : (
            <View style={detailStyles.imgFallback}>
              <Text style={detailStyles.imgFallbackText}>👕</Text>
            </View>
          )}

          {/* Badges */}
          <View style={detailStyles.badgeRow}>
            {hasDiscount && (
              <View style={detailStyles.saleBadge}>
                <Text style={detailStyles.saleBadgeText}>SALE</Text>
              </View>
            )}
            {product.badge && (
              <View style={detailStyles.tagBadge}>
                <Text style={detailStyles.tagBadgeText}>{product.badge}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Dots */}
        {images.length > 1 && (
          <View style={detailStyles.dotsRow}>
            {images.map((_, i) => (
              <View key={i} style={[detailStyles.dot, i === activeImg && detailStyles.dotActive]} />
            ))}
          </View>
        )}

        {/* ── Content ── */}
        <View style={detailStyles.content}>
          {/* Name */}
          <View style={detailStyles.nameRow}>
            <Text style={detailStyles.name}>{product.name}</Text>
          </View>

          {/* Price */}
          <View style={detailStyles.priceRow}>
            {hasDiscount ? (
              <>
                <Text style={detailStyles.priceDiscount}>
                  {formatVND(product.discount_price!)}
                </Text>
                <Text style={detailStyles.priceOriginal}>
                  {formatVND(product.price)}
                </Text>
              </>
            ) : (
              <Text style={detailStyles.price}>{formatVND(product.price)}</Text>
            )}
          </View>

          <View style={detailStyles.divider} />

          {/* Meta chips */}
          <View style={detailStyles.metaRow}>
            <View style={detailStyles.metaChip}>
              <Text style={detailStyles.metaLabel}>Kho</Text>
              <Text style={detailStyles.metaValue}>{product.stock > 0 ? `${product.stock} cái` : 'Hết hàng'}</Text>
            </View>
            {product.condition && (
              <View style={detailStyles.metaChip}>
                <Text style={detailStyles.metaLabel}>Tình trạng</Text>
                <Text style={detailStyles.metaValue}>{product.condition}</Text>
              </View>
            )}
            <View style={detailStyles.metaChip}>
              <Text style={detailStyles.metaLabel}>SKU</Text>
              <Text style={detailStyles.metaValue}>{product.sku}</Text>
            </View>
            {cartQty > 0 && (
              <View style={[detailStyles.metaChip, { backgroundColor: '#F8DE22', borderColor: '#111' }]}>
                <Text style={detailStyles.metaLabel}>Trong giỏ</Text>
                <Text style={detailStyles.metaValue}>{cartQty} cái</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {product.description ? (
            <>
              <Text style={detailStyles.sectionTitle}>MÔ TẢ SẢN PHẨM</Text>
              <Text style={detailStyles.description}>{product.description}</Text>
            </>
          ) : null}
        </View>
      </ScrollView>

      {/* ── Sticky Footer ── */}
      <View style={detailStyles.footer}>
        <Animated.View style={[detailStyles.addBtn, { transform: [{ scale: addAnim }] }]}>
          <View style={detailStyles.addBtnShadow} />
          <Pressable
            style={[detailStyles.addBtnInner, product.stock === 0 && { backgroundColor: '#ccc' }]}
            onPress={handleAddToCart}
            disabled={product.stock === 0}
          >
            <Text style={detailStyles.addBtnText}>
              {product.stock === 0 ? 'HẾT HÀNG' : '🛒 THÊM VÀO GIỎ'}
            </Text>
          </Pressable>
        </Animated.View>

        {product.stock > 0 && (
          <View style={detailStyles.buyNowWrap}>
            <View style={detailStyles.buyNowShadow} />
            <Pressable style={detailStyles.buyNowBtn} onPress={handleBuyNow}>
              <Text style={detailStyles.buyNowText}>⚡ MUA LIỀN</Text>
            </Pressable>
          </View>
        )}

        {product.model_3d_url ? (
          <Pressable style={detailStyles.view3dBtn} onPress={handleView3D}>
            <Text style={detailStyles.view3dText}>🔮</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatVND(price: string | number): string {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(n)) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M₫`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K₫`;
  return `${Math.round(n)}₫`;
}

export default ProductDetailPage;
