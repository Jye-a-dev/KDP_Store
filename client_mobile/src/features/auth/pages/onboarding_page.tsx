import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
  Pressable,
  Animated,
  Image,
} from 'react-native';
import { useAuth } from '../controllers/auth_context';
import { API_ENDPOINTS, API_BASE_URL } from '../../../core/constants/api_config';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  price: string;
  images_2d: string[];
}

interface PageContent {
  hero_tagline?: string;
  hero_title_normal?: string;
  hero_title_highlight?: string;
  hero_description?: string;
  newsletter_description?: string;
  customer_promo_title?: string;
  customer_promo_desc?: string;
  customer_promo_code?: string;
  customer_promo_badge?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatVND(price: string): string {
  const n = parseFloat(price);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M₫`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K₫`;
  return `${Math.round(n)}₫`;
}

const ACCENT_COLORS = ['#F45B26', '#03AED2', '#F8DE22'];

// ─── Slide Visuals ────────────────────────────────────────────────────────────

function CollageVisual({ products }: { products: Product[] }) {
  if (products.length < 4) {
    return (
      <View style={[vStyles.fallback, { backgroundColor: ACCENT_COLORS[0] }]}>
        <Text style={vStyles.fallbackEmoji}>👕</Text>
      </View>
    );
  }
  return (
    <View style={vStyles.grid}>
      {products.slice(0, 4).map((p, i) => (
        <View key={p.id} style={vStyles.cell}>
          <Image source={{ uri: p.images_2d[0] }} style={vStyles.cellImg} resizeMode="cover" />
          {i === 0 && (
            <View style={vStyles.newBadge}>
              <Text style={vStyles.newBadgeText}>MỚI</Text>
            </View>
          )}
          {i === 1 && (
            <View style={vStyles.priceBadge}>
              <Text style={vStyles.priceBadgeText}>{formatVND(p.price)}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

function HeroVisual({ product }: { product: Product | null }) {
  if (!product) {
    return (
      <View style={[vStyles.fallback, { backgroundColor: ACCENT_COLORS[1] }]}>
        <Text style={vStyles.fallbackEmoji}>📦</Text>
      </View>
    );
  }
  return (
    <View style={vStyles.hero}>
      <Image source={{ uri: product.images_2d[0] }} style={vStyles.heroImg} resizeMode="contain" />
      <View style={vStyles.heroPrice}>
        <Text style={vStyles.heroPriceText}>{formatVND(product.price)}</Text>
      </View>
      <View style={vStyles.heroName}>
        <Text style={vStyles.heroNameText} numberOfLines={1}>{product.name}</Text>
      </View>
      {/* 3D badge */}
      <View style={vStyles.badge3d}>
        <Text style={vStyles.badge3dText}>🔄 XOAY 360°</Text>
      </View>
    </View>
  );
}

function StackedVisual({ products }: { products: Product[] }) {
  if (products.length < 3) {
    return (
      <View style={[vStyles.fallback, { backgroundColor: ACCENT_COLORS[2] }]}>
        <Text style={vStyles.fallbackEmoji}>💳</Text>
      </View>
    );
  }
  const rotations = ['-8deg', '0deg', '8deg'];
  const tops = [10, 0, -10];
  return (
    <View style={vStyles.stackRoot}>
      {products.slice(0, 3).map((p, i) => (
        <View
          key={p.id}
          style={[
            vStyles.stackCard,
            {
              transform: [{ rotate: rotations[i] }],
              zIndex: 3 - i,
              top: tops[i],
            },
          ]}
        >
          <Image source={{ uri: p.images_2d[0] }} style={vStyles.stackImg} resizeMode="contain" />
          <View style={vStyles.stackPrice}>
            <Text style={vStyles.stackPriceText}>{formatVND(p.price)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OnboardingPage() {
  const { width } = useWindowDimensions();
  const { completeOnboarding } = useAuth();

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollValueRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Data state — start empty, fill when API responds
  const [products, setProducts] = useState<Product[]>([]);
  const [content, setContent] = useState<PageContent>({});

  // Fetch in background without blocking render
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      const t0 = Date.now();
      const productsUrl = `${API_BASE_URL}/products?limit=9&page=1`;
      const contentsUrl = API_ENDPOINTS.pageContents;

      console.log('[Onboarding] 🌐 Connecting to server...');
      console.log('[Onboarding] API_BASE_URL =', API_BASE_URL);
      console.log('[Onboarding] Products URL =', productsUrl);
      console.log('[Onboarding] Contents URL =', contentsUrl);

      try {
        const [pRes, cRes] = await Promise.all([
          fetch(productsUrl),
          fetch(contentsUrl),
        ]);
        if (cancelled) return;

        const elapsed = Date.now() - t0;
        console.log(`[Onboarding] ✅ Server responded in ${elapsed}ms`);
        console.log(`[Onboarding] /products → HTTP ${pRes.status} ${pRes.ok ? 'OK' : 'FAIL'}`);
        console.log(`[Onboarding] /page-contents → HTTP ${cRes.status} ${cRes.ok ? 'OK' : 'FAIL'}`);

        if (pRes.ok) {
          const json = await pRes.json();
          const raw: Product[] = (json.data || json) as Product[];
          const withImg = raw.filter(
            (p) => Array.isArray(p.images_2d) && p.images_2d[0],
          );
          console.log(`[Onboarding] 🛍️  Products total=${raw.length}, with image=${withImg.length}`);
          if (withImg.length > 0) {
            console.log('[Onboarding] Sample image URL:', withImg[0].images_2d[0]);
          }
          setProducts(withImg);
        } else {
          console.warn(`[Onboarding] ❌ /products failed: HTTP ${pRes.status}`);
        }

        if (cRes.ok) {
          const c = await cRes.json();
          console.log('[Onboarding] 📄 page-contents keys:', Object.keys(c).join(', '));
          if (!cancelled) setContent(c);
        } else {
          console.warn(`[Onboarding] ❌ /page-contents failed: HTTP ${cRes.status}`);
        }
      } catch (e: any) {
        const elapsed = Date.now() - t0;
        console.error(`[Onboarding] 💥 Fetch failed after ${elapsed}ms`);
        console.error('[Onboarding] Error type:', e?.name);
        console.error('[Onboarding] Error message:', e?.message);
        console.error('[Onboarding] Full error:', e);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  // Scroll listener
  useEffect(() => {
    const id = scrollX.addListener(({ value }) => {
      scrollValueRef.current = value;
      setActiveIndex(Math.round(value / width));
    });
    return () => scrollX.removeListener(id);
  }, [scrollX, width]);

  const goNext = () => {
    const cur = Math.round(scrollValueRef.current / width);
    if (cur < 2) {
      scrollViewRef.current?.scrollTo({ x: (cur + 1) * width, animated: true });
    } else {
      completeOnboarding();
    }
  };

  const goLast = () => {
    scrollViewRef.current?.scrollTo({ x: 2 * width, animated: true });
  };

  // Slide definitions (reactive to content)
  const slidesMeta = [
    {
      badge: '🔥 XU HƯỚNG MỚI',
      title: `${content.hero_title_normal || 'BỨT PHÁ'} ${content.hero_title_highlight || 'MÀU SẮC'}`.toUpperCase(),
      subtitle: content.hero_tagline || 'DROP 01 // XU HƯỚNG ĐỘT PHÁ',
      desc: content.hero_description || 'Khám phá bộ sưu tập thời trang mới nhất, thiết kế táo bạo và chất liệu cao cấp.',
    },
    {
      badge: '📦 CÔNG NGHỆ 3D',
      title: 'XEM SẢN PHẨM\nNHƯ THẬT',
      subtitle: 'TƯƠNG TÁC BABYLON 3D',
      desc: 'Xoay, thu phóng và kiểm tra từng chi tiết sản phẩm dưới dạng 3D thời gian thực trước khi mua.',
    },
    {
      badge: `💳 ${content.customer_promo_badge || 'THÀNH VIÊN'}`,
      title: (content.customer_promo_title || 'ƯU ĐÃI THÀNH VIÊN').toUpperCase(),
      subtitle: `MÃ: ${content.customer_promo_code || 'KDP15'} — ${content.customer_promo_desc || 'GIẢM 15%'}`,
      desc: `${content.newsletter_description || 'Đăng ký thành viên để nhận deal độc quyền, thông báo drop giới hạn và ưu đãi đặc quyền.'}`,
    },
  ];

  // Background color morph
  const backgroundColor = scrollX.interpolate({
    inputRange: [0, width, width * 2],
    outputRange: ACCENT_COLORS,
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.root, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>KDP STORE</Text>
        <Pressable onPress={goLast} style={styles.skipPill}>
          <Text style={styles.skipText}>BỎ QUA</Text>
        </Pressable>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        style={styles.scroll}
      >
        {slidesMeta.map((slide, index) => {
          const range = [(index - 1) * width, index * width, (index + 1) * width];
          const scale = scrollX.interpolate({ inputRange: range, outputRange: [0.88, 1, 0.88], extrapolate: 'clamp' });
          const opacity = scrollX.interpolate({ inputRange: range, outputRange: [0.45, 1, 0.45], extrapolate: 'clamp' });
          const ty = scrollX.interpolate({ inputRange: range, outputRange: [36, 0, 36], extrapolate: 'clamp' });

          return (
            <View key={index} style={[styles.slide, { width }]}>
              {/* Visual */}
              <Animated.View style={[styles.visualWrap, { transform: [{ scale }] }]}>
                <View style={styles.visualShadow} />
                <View style={styles.visualBox}>
                  {index === 0 && <CollageVisual products={products} />}
                  {index === 1 && <HeroVisual product={products[Math.min(2, products.length - 1)] ?? null} />}
                  {index === 2 && <StackedVisual products={products.slice(3, 6)} />}
                </View>
              </Animated.View>

              {/* Text card */}
              <Animated.View style={[styles.card, { opacity, transform: [{ translateY: ty }] }]}>
                <View style={styles.cardShadow} />
                <View style={styles.cardInner}>
                  <View style={styles.badgePill}>
                    <Text style={styles.badgeText}>{slide.badge}</Text>
                  </View>
                  <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>{slide.title}</Text>
                  <Text style={styles.subtitle} numberOfLines={1}>{slide.subtitle}</Text>
                  <Text style={styles.desc} numberOfLines={3}>{slide.desc}</Text>
                </View>
              </Animated.View>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {slidesMeta.map((_, i) => {
            const w = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [8, 28, 8],
              extrapolate: 'clamp',
            });
            const op = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return <Animated.View key={i} style={[styles.dot, { width: w, opacity: op }]} />;
          })}
        </View>

        <View style={styles.btnWrap}>
          <View style={styles.btnShadow} />
          <Pressable style={styles.btn} onPress={goNext}>
            <Text style={styles.btnText}>
              {activeIndex === 2 ? 'BẮT ĐẦU →' : 'TIẾP →'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Visual styles ────────────────────────────────────────────────────────────

const vStyles = StyleSheet.create({
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fallbackEmoji: { fontSize: 72 },

  // Collage
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '50%', height: '50%', borderWidth: 1.5, borderColor: '#111', position: 'relative' },
  cellImg: { width: '100%', height: '100%', backgroundColor: '#f5f5f5' },
  newBadge: { position: 'absolute', top: 6, left: 6, backgroundColor: '#F8DE22', borderWidth: 1.5, borderColor: '#111', paddingHorizontal: 6, paddingVertical: 2 },
  newBadgeText: { fontSize: 9, fontWeight: '900', color: '#111', letterSpacing: 1 },
  priceBadge: { position: 'absolute', bottom: 6, right: 6, backgroundColor: '#111', paddingHorizontal: 6, paddingVertical: 2 },
  priceBadgeText: { fontSize: 9, fontWeight: '900', color: '#fff' },

  // Hero
  hero: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  heroImg: { width: '70%', height: '70%', backgroundColor: '#f9f9f9' },
  heroPrice: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#F8DE22', borderWidth: 2, borderColor: '#111', paddingHorizontal: 10, paddingVertical: 4 },
  heroPriceText: { fontWeight: '900', fontSize: 12, color: '#111' },
  heroName: { position: 'absolute', bottom: 12, left: 12, right: 90, backgroundColor: '#111', paddingHorizontal: 8, paddingVertical: 4 },
  heroNameText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  badge3d: { position: 'absolute', top: 12, left: 12, backgroundColor: '#03AED2', borderWidth: 2, borderColor: '#111', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badge3dText: { fontWeight: '900', fontSize: 10, color: '#111' },

  // Stacked
  stackRoot: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  stackCard: {
    position: 'absolute',
    width: 120, height: 120,
    backgroundColor: '#fff',
    borderWidth: 2.5, borderColor: '#111',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#111', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  stackImg: { width: 88, height: 88, backgroundColor: '#f5f5f5' },
  stackPrice: { position: 'absolute', bottom: -1, left: -1, right: -1, backgroundColor: '#F8DE22', borderTopWidth: 2, borderColor: '#111', alignItems: 'center', paddingVertical: 2 },
  stackPriceText: { fontSize: 9, fontWeight: '900', color: '#111' },
});

// ─── Main styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 12 },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 },
  brand: { fontSize: 18, fontWeight: '900', color: '#111', letterSpacing: 2 },
  skipPill: { backgroundColor: 'rgba(0,0,0,0.12)', borderWidth: 1.5, borderColor: '#111', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  skipText: { fontSize: 12, fontWeight: '900', color: '#111' },
  scroll: { flex: 1 },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, gap: 20 },
  visualWrap: { width: '100%', aspectRatio: 1.4, maxHeight: 240, position: 'relative' },
  visualShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: '#111', borderRadius: 14 },
  visualBox: { flex: 1, borderWidth: 3, borderColor: '#111', borderRadius: 14, overflow: 'hidden' },
  card: { width: '100%', position: 'relative' },
  cardShadow: { position: 'absolute', top: 5, left: 5, right: -5, bottom: -5, backgroundColor: '#111', borderRadius: 14 },
  cardInner: { padding: 20, borderWidth: 3, borderColor: '#111', borderRadius: 14, backgroundColor: '#fff', minHeight: 155 },
  badgePill: { alignSelf: 'flex-start', backgroundColor: '#111', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 10 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  title: { fontSize: 22, fontWeight: '900', color: '#111', letterSpacing: 0.5, lineHeight: 26 },
  subtitle: { fontSize: 11, fontWeight: '800', color: '#555', marginTop: 3, marginBottom: 8 },
  desc: { fontSize: 13, color: '#333', lineHeight: 19, fontWeight: '500' },
  footer: { height: 96, paddingBottom: 32, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 10, borderRadius: 5, backgroundColor: '#111' },
  btnWrap: { width: 140, height: 46, position: 'relative' },
  btnShadow: { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: '#111', borderRadius: 23 },
  btn: { flex: 1, backgroundColor: '#fff', borderWidth: 2.5, borderColor: '#111', borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 14, fontWeight: '900', color: '#111', letterSpacing: 0.5 },
});

export default OnboardingPage;
