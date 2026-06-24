import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, ScrollView, Image, Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { API_ENDPOINTS } from '../../../core/constants/api_config';
import { AppRoutes } from '../../../app/routes/app_routes';
import { searchStyles, CARD_W } from './search_page.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  price: string;
  discount_price?: string | null;
  images_2d: string[];
  is_published: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatVND(price: string | number): string {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(n)) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M₫`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K₫`;
  return `${Math.round(n)}₫`;
}

// ─── MiniProductCard ─────────────────────────────────────────────────────────

function MiniProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  const imgUri = product.images_2d?.[0];
  const hasDiscount = product.discount_price && parseFloat(product.discount_price) > 0;

  return (
    <Pressable style={searchStyles.cardWrap} onPress={onPress}>
      <View style={searchStyles.cardShadow} />
      <View style={searchStyles.card}>
        <View style={searchStyles.imgWrap}>
          {imgUri ? (
            <Image source={{ uri: imgUri }} style={searchStyles.img} resizeMode="cover" />
          ) : (
            <View style={searchStyles.imgFallback}>
              <Text style={{ fontSize: 28 }}>👕</Text>
            </View>
          )}
          {hasDiscount && (
            <View style={searchStyles.saleBadge}>
              <Text style={searchStyles.saleBadgeText}>SALE</Text>
            </View>
          )}
        </View>
        <View style={searchStyles.info}>
          <Text style={searchStyles.name} numberOfLines={2}>{product.name}</Text>
          {hasDiscount ? (
            <>
              <Text style={searchStyles.priceDiscount}>{formatVND(product.discount_price!)}</Text>
              <Text style={searchStyles.priceOriginal}>{formatVND(product.price)}</Text>
            </>
          ) : (
            <Text style={searchStyles.price}>{formatVND(product.price)}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

// ─── SearchPage ───────────────────────────────────────────────────────────────

export function SearchPage() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.products}?search=${encodeURIComponent(q)}&limit=40`);
      if (res.ok) {
        const data = await res.json();
        const list: Product[] = (data.data ?? data) as Product[];
        setResults(list.filter((p) => p.is_published));
      }
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce 300ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  const goToDetail = (product: Product) => {
    navigation.navigate('SearchProductDetail', {
      productId: product.id,
      productName: product.name,
    });
  };

  return (
    <SafeAreaView style={searchStyles.safe}>
      {/* Header */}
      <View style={searchStyles.header}>
        <Text style={searchStyles.headerTitle}>TÌM KIẾM 🔍</Text>
        <View style={searchStyles.inputWrap}>
          <Text style={searchStyles.inputIcon}>🔍</Text>
          <TextInput
            style={searchStyles.input}
            placeholder="Tìm áo, quần, giày..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Text style={searchStyles.clearIcon}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Loading */}
      {isLoading && (
        <ActivityIndicator size="small" color="#111" style={{ marginTop: 24 }} />
      )}

      {/* Results */}
      {!isLoading && query.trim().length > 0 && (
        <>
          <Text style={searchStyles.resultCount}>
            {results.length > 0 ? `${results.length} kết quả cho "${query}"` : `Không tìm thấy "${query}"`}
          </Text>
          {results.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={searchStyles.grid}>
                {results.map((p) => (
                  <MiniProductCard key={p.id} product={p} onPress={() => goToDetail(p)} />
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={searchStyles.emptyWrap}>
              <Text style={searchStyles.emptyEmoji}>🛍️</Text>
              <Text style={searchStyles.emptyTitle}>Không tìm thấy</Text>
              <Text style={searchStyles.emptyDesc}>Thử từ khóa khác nhé</Text>
            </View>
          )}
        </>
      )}

      {/* Hint when empty query */}
      {!isLoading && query.trim().length === 0 && (
        <View style={searchStyles.hintWrap}>
          <Text style={searchStyles.hintEmoji}>✨</Text>
          <Text style={searchStyles.hintText}>Gõ để tìm sản phẩm KDP Store</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default SearchPage;
