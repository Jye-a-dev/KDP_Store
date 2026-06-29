import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
export const CARD_W = (SCREEN_W - 44) / 2; // fits nicely in 2-column layout with 12px gap

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 2.5,
    borderBottomColor: '#111',
    backgroundColor: '#fff',
    gap: 10,
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 18, fontWeight: '700' },
  headerTitle: { flex: 1, fontSize: 15, fontWeight: '900', color: '#111', letterSpacing: 0.5 },

  list: { paddingHorizontal: 16, paddingBottom: 32 },

  // Product Card Styles
  cardWrap: { width: CARD_W, marginBottom: 16, position: 'relative' },
  cardShadow: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    backgroundColor: '#111',
    borderRadius: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 2.5,
    borderColor: '#111',
    borderRadius: 14,
    overflow: 'hidden',
  },
  imgWrap: { width: '100%', aspectRatio: 1, backgroundColor: '#f5f5f5', position: 'relative' },
  img: { width: '100%', height: '100%' },
  imgFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#F8DE22',
    borderWidth: 1.5,
    borderColor: '#111',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { fontSize: 9, fontWeight: '900', color: '#111', letterSpacing: 0.5 },
  
  saleBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F45B26',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#111',
  },
  saleText: { fontSize: 9, fontWeight: '900', color: '#fff' },
  
  info: { padding: 10 },
  name: { fontSize: 12, fontWeight: '700', color: '#111', lineHeight: 16, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { fontSize: 13, fontWeight: '900', color: '#111' },
  priceDiscount: { fontSize: 13, fontWeight: '900', color: '#F45B26' },
  priceOriginal: { fontSize: 10, fontWeight: '600', color: '#999', textDecorationLine: 'line-through' },

  // States
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  loadingText: { fontSize: 14, color: '#666', fontWeight: '600' },
  
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#111', marginTop: 12 },
  emptyDesc: { fontSize: 13, color: '#666', textAlign: 'center', paddingHorizontal: 16 },
  emptyBtnWrap: { position: 'relative', marginTop: 16 },
  emptyBtnShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: '#111',
    borderRadius: 12,
  },
  emptyBtn: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#111',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyBtnText: { color: '#F8DE22', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },
});
