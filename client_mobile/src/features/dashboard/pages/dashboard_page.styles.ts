import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
export const CARD_W = (SCREEN_W - 48 - 12) / 2;

// ─── ProductCard styles ──────────────────────────────────────────────────────

export const pcStyles = StyleSheet.create({
  wrap: { width: CARD_W, marginBottom: 16, position: 'relative' },
  shadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#111', borderRadius: 14,
  },
  card: {
    backgroundColor: '#fff', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 14, overflow: 'hidden',
  },
  imgWrap: { width: '100%', aspectRatio: 1, backgroundColor: '#f5f5f5', position: 'relative' },
  img: { width: '100%', height: '100%' },
  imgFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: '#F8DE22', borderWidth: 1.5, borderColor: '#111',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  badgeText: { fontSize: 9, fontWeight: '900', color: '#111', letterSpacing: 0.5 },
  saleBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: '#F45B26', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
    borderWidth: 1.5, borderColor: '#111',
  },
  saleText: { fontSize: 9, fontWeight: '900', color: '#fff' },
  info: { padding: 10 },
  name: { fontSize: 12, fontWeight: '700', color: '#111', lineHeight: 16, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { fontSize: 13, fontWeight: '900', color: '#111' },
  priceDiscount: { fontSize: 13, fontWeight: '900', color: '#F45B26' },
  priceOriginal: { fontSize: 10, fontWeight: '600', color: '#999', textDecorationLine: 'line-through' },
});

// ─── CategoryChip styles ─────────────────────────────────────────────────────

export const catStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 2, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 12, fontWeight: '800', color: '#111' },
});

// ─── Banner styles ───────────────────────────────────────────────────────────

export const bannerStyles = StyleSheet.create({
  wrap: { position: 'relative' },
  shadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#111', borderRadius: 16,
  },
  card: {
    backgroundColor: '#F8DE22', borderWidth: 3, borderColor: '#111',
    borderRadius: 16, padding: 20, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  left: { flex: 1, gap: 8 },
  sub: { fontSize: 10, fontWeight: '900', color: '#111', letterSpacing: 2 },
  title: { fontSize: 20, fontWeight: '900', color: '#111', lineHeight: 24 },
  codePill: {
    alignSelf: 'flex-start', backgroundColor: '#111',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8,
  },
  codeText: { fontSize: 13, fontWeight: '900', color: '#F8DE22', letterSpacing: 2 },
  emoji: { fontSize: 56, marginLeft: 16 },
});

// ─── Dashboard styles ────────────────────────────────────────────────────────

export const dashStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 2, borderBottomColor: '#111',
  },
  greeting: { fontSize: 18, fontWeight: '900', color: '#111' },
  subGreeting: { fontSize: 12, color: '#666', fontWeight: '500', marginTop: 2 },
  logoutBtn: {
    backgroundColor: '#111', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  logoutText: { color: '#F8DE22', fontSize: 12, fontWeight: '900' },

  brandStrip: {
    backgroundColor: '#111', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 8, gap: 10,
  },
  brandText: { color: '#F8DE22', fontSize: 13, fontWeight: '900', letterSpacing: 3 },
  brandDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#F8DE22' },
  brandSub: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 2, opacity: 0.7 },

  scroll: { flex: 1 },

  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '900', color: '#111', letterSpacing: 1.5, marginBottom: 14 },
  sectionCount: { fontSize: 12, fontWeight: '600', color: '#888' },

  chipRow: { flexDirection: 'row', paddingBottom: 4 },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
  },

  loadingWrap: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  loadingText: { fontSize: 13, color: '#666', fontWeight: '600' },
  emptyWrap: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 14, color: '#888', fontWeight: '600' },
});
