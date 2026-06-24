import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },

  // Header strip
  headerStrip: {
    backgroundColor: '#111', paddingHorizontal: 20,
    paddingTop: 10, paddingBottom: 20,
  },
  headerTitle: { fontSize: 13, fontWeight: '900', color: '#F8DE22', letterSpacing: 2, marginBottom: 16 },

  // Avatar card
  avatarCard: {
    backgroundColor: '#fff', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 20, marginHorizontal: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    marginTop: -20, // overlap the strip
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 8,
  },
  avatarCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#F8DE22', borderWidth: 2.5, borderColor: '#111',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 26, fontWeight: '900', color: '#111' },
  avatarImage: { width: 64, height: 64, borderRadius: 32, borderWidth: 2.5, borderColor: '#111' },
  userInfo: { flex: 1 },
  userName: { fontSize: 17, fontWeight: '900', color: '#111', marginBottom: 3 },
  userEmail: { fontSize: 12, color: '#666', fontWeight: '500' },
  userPhone: { fontSize: 12, color: '#888', fontWeight: '500', marginTop: 2 },
  roleBadge: {
    alignSelf: 'flex-start', backgroundColor: '#F8DE22',
    borderWidth: 1.5, borderColor: '#111', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3, marginTop: 6,
  },
  roleBadgeText: { fontSize: 9, fontWeight: '900', color: '#111', letterSpacing: 1 },

  // Menu
  menuSection: { paddingHorizontal: 20, marginTop: 24 },
  menuLabel: { fontSize: 11, fontWeight: '900', color: '#888', letterSpacing: 2, marginBottom: 12 },

  menuItem: {
    position: 'relative', marginBottom: 12,
  },
  menuShadow: {
    position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
    backgroundColor: '#111', borderRadius: 14,
  },
  menuRow: {
    backgroundColor: '#fff', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  menuRowDanger: { backgroundColor: '#FFF0EC' },
  menuIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  menuText: { flex: 1, fontSize: 14, fontWeight: '800', color: '#111' },
  menuChevron: { fontSize: 16, color: '#aaa', fontWeight: '700' },
  menuDanger: { color: '#F45B26' },

  // Separator
  separator: { height: 2, backgroundColor: '#111', marginHorizontal: 20, marginVertical: 8 },

  version: {
    textAlign: 'center', fontSize: 11, color: '#bbb',
    fontWeight: '500', marginTop: 24, marginBottom: 8,
  },
});
