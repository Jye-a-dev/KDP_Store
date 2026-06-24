import { StyleSheet, Dimensions } from 'react-native';

const { width: W } = Dimensions.get('window');
export const CARD_W = (W - 48 - 12) / 2;

export const searchStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },

  header: {
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14,
    backgroundColor: '#fff', borderBottomWidth: 2.5, borderBottomColor: '#111',
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#111', marginBottom: 12 },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 2.5, borderColor: '#111', borderRadius: 14,
    backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10,
  },
  inputIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  clearIcon: { fontSize: 14, color: '#999', fontWeight: '900', paddingHorizontal: 4 },

  resultCount: {
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4,
    fontSize: 12, fontWeight: '700', color: '#888', letterSpacing: 0.5,
  },

  grid: {
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24,
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
  },

  // Product card (mini, reused style)
  cardWrap: { width: CARD_W, position: 'relative', marginBottom: 4 },
  cardShadow: {
    position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
    backgroundColor: '#111', borderRadius: 12,
  },
  card: {
    backgroundColor: '#fff', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 12, overflow: 'hidden',
  },
  imgWrap: { width: '100%', aspectRatio: 1, backgroundColor: '#f5f5f5', position: 'relative' },
  img: { width: '100%', height: '100%' },
  imgFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  saleBadge: {
    position: 'absolute', top: 6, right: 6,
    backgroundColor: '#F45B26', borderWidth: 1.5, borderColor: '#111',
    borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2,
  },
  saleBadgeText: { fontSize: 8, fontWeight: '900', color: '#fff' },
  info: { padding: 10 },
  name: { fontSize: 11, fontWeight: '700', color: '#111', lineHeight: 15, marginBottom: 4 },
  price: { fontSize: 13, fontWeight: '900', color: '#111' },
  priceDiscount: { fontSize: 13, fontWeight: '900', color: '#F45B26' },
  priceOriginal: { fontSize: 10, color: '#aaa', textDecorationLine: 'line-through' },

  // States
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 60 },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontSize: 16, fontWeight: '900', color: '#111' },
  emptyDesc: { fontSize: 13, color: '#888' },

  hintWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 60 },
  hintEmoji: { fontSize: 48 },
  hintText: { fontSize: 14, color: '#aaa', fontWeight: '600' },
});
