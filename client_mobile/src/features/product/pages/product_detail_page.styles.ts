import { StyleSheet, Dimensions } from 'react-native';

const { width: W } = Dimensions.get('window');
export const DETAIL_IMG_H = W;

export const detailStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  // Back header
  backRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10,
    backgroundColor: '#fff', borderBottomWidth: 2, borderBottomColor: '#111',
    gap: 10,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 10, borderWidth: 2, borderColor: '#111',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  backText: { fontSize: 18 },
  backTitle: { fontSize: 15, fontWeight: '900', color: '#111', flex: 1 },

  // Image carousel
  carousel: { width: W, height: DETAIL_IMG_H, backgroundColor: '#f5f5f5' },
  carouselImg: { width: W, height: DETAIL_IMG_H },
  imgFallback: { width: W, height: DETAIL_IMG_H, alignItems: 'center', justifyContent: 'center' },
  imgFallbackText: { fontSize: 72 },

  // Dots
  dotsRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 6, paddingVertical: 12,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd', borderWidth: 1, borderColor: '#ccc' },
  dotActive: { backgroundColor: '#111', width: 20, borderRadius: 4, borderColor: '#111' },

  // Badges over image
  badgeRow: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 6 },
  saleBadge: {
    backgroundColor: '#F45B26', borderWidth: 2, borderColor: '#111',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  saleBadgeText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  tagBadge: {
    backgroundColor: '#F8DE22', borderWidth: 2, borderColor: '#111',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  tagBadgeText: { fontSize: 10, fontWeight: '900', color: '#111' },

  // Content area
  content: { paddingHorizontal: 20, paddingBottom: 120 },

  nameRow: { marginTop: 16, marginBottom: 8 },
  name: { fontSize: 22, fontWeight: '900', color: '#111', lineHeight: 28 },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 16 },
  priceDiscount: { fontSize: 26, fontWeight: '900', color: '#F45B26' },
  priceOriginal: { fontSize: 16, color: '#aaa', textDecorationLine: 'line-through', fontWeight: '600' },
  price: { fontSize: 26, fontWeight: '900', color: '#111' },

  divider: { height: 2, backgroundColor: '#111', marginBottom: 16 },

  // Meta info chips
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 2, borderColor: '#111', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff',
  },
  metaLabel: { fontSize: 11, fontWeight: '700', color: '#666' },
  metaValue: { fontSize: 11, fontWeight: '900', color: '#111' },

  // Description
  sectionTitle: { fontSize: 13, fontWeight: '900', color: '#111', letterSpacing: 1.5, marginBottom: 10 },
  description: { fontSize: 14, color: '#444', lineHeight: 22, fontWeight: '500' },

  // Sticky bottom
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopWidth: 2.5, borderTopColor: '#111',
    paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  addBtn: {
    flex: 1, position: 'relative',
  },
  addBtnShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#111', borderRadius: 14,
  },
  addBtnInner: {
    backgroundColor: '#F8DE22', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  addBtnText: { fontSize: 14, fontWeight: '900', color: '#111', letterSpacing: 0.5 },

  view3dBtn: {
    width: 50, height: 50, borderRadius: 14, borderWidth: 2.5, borderColor: '#111',
    backgroundColor: '#111', alignItems: 'center', justifyContent: 'center',
  },
  view3dText: { fontSize: 22 },

  // Buy Now button
  buyNowWrap: { position: 'relative' },
  buyNowShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#F45B26', borderRadius: 14,
  },
  buyNowBtn: {
    backgroundColor: '#111', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 14, paddingVertical: 16, paddingHorizontal: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  buyNowText: { fontSize: 13, fontWeight: '900', color: '#F8DE22', letterSpacing: 0.5 },

  // Loading / error
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#666', fontWeight: '600' },
  errorText: { fontSize: 16, color: '#F45B26', fontWeight: '700' },
});
