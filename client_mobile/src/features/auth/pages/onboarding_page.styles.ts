import { StyleSheet } from 'react-native';

// ─── Visual styles ─────────────────────────────────────────────────────────

export const vStyles = StyleSheet.create({
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

// ─── Main styles ────────────────────────────────────────────────────────────

export const styles = StyleSheet.create({
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
