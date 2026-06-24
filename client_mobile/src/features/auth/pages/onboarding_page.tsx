import React, { useRef, useState, useEffect } from 'react';
import {
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
import { styles, vStyles } from './onboarding_page.styles';

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

export default OnboardingPage;
