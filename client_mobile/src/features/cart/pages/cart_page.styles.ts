import { StyleSheet, Dimensions } from 'react-native';

const { width: W } = Dimensions.get('window');

export const cartStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14,
    backgroundColor: '#fff', borderBottomWidth: 2.5, borderBottomColor: '#111',
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#111' },
  clearBtn: {
    backgroundColor: '#F45B26', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1.5, borderColor: '#111',
  },
  clearText: { color: '#fff', fontSize: 11, fontWeight: '900' },

  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 },

  // Item card
  itemWrap: { position: 'relative', marginBottom: 16 },
  itemShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#111', borderRadius: 14,
  },
  itemCard: {
    backgroundColor: '#fff', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center',
  },
  itemImg: { width: 72, height: 72, borderRadius: 10, backgroundColor: '#f5f5f5' },
  itemImgFallback: {
    width: 72, height: 72, borderRadius: 10, backgroundColor: '#f5f5f5',
    alignItems: 'center', justifyContent: 'center',
  },
  itemInfo: { flex: 1, marginLeft: 12, gap: 4 },
  itemName: { fontSize: 13, fontWeight: '800', color: '#111', lineHeight: 18 },
  itemPrice: { fontSize: 14, fontWeight: '900', color: '#F45B26' },
  itemOriginal: { fontSize: 11, color: '#aaa', textDecorationLine: 'line-through' },

  // Qty controls
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: '#111',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  qtyBtnActive: { backgroundColor: '#111' },
  qtyBtnText: { fontSize: 16, fontWeight: '900', color: '#111', lineHeight: 20 },
  qtyBtnTextActive: { color: '#F8DE22' },
  qtyVal: { fontSize: 15, fontWeight: '900', color: '#111', minWidth: 20, textAlign: 'center' },

  // Remove
  removeBtn: {
    width: 30, height: 30, borderRadius: 8, backgroundColor: '#FFF0EC',
    alignItems: 'center', justifyContent: 'center', marginLeft: 8,
    borderWidth: 1.5, borderColor: '#F45B26',
  },
  removeText: { fontSize: 14 },

  // Empty
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  emptyDesc: { fontSize: 13, color: '#888', fontWeight: '500' },

  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopWidth: 2.5, borderTopColor: '#111',
    paddingHorizontal: 20, paddingVertical: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: 14, fontWeight: '700', color: '#666' },
  summaryTotal: { fontSize: 20, fontWeight: '900', color: '#111' },
  checkoutWrap: { position: 'relative' },
  checkoutShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#111', borderRadius: 14,
  },
  checkoutBtn: {
    backgroundColor: '#F8DE22', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  checkoutText: { fontSize: 15, fontWeight: '900', color: '#111', letterSpacing: 1 },
});

// ─── Checkout Modal Styles ────────────────────────────────────────────────────

export const checkoutStyles = StyleSheet.create({
  modal: { flex: 1, backgroundColor: '#FAFAFA' },

  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14,
    backgroundColor: '#fff', borderBottomWidth: 2.5, borderBottomColor: '#111',
  },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  closeBtn: {
    width: 36, height: 36, borderRadius: 10, borderWidth: 2, borderColor: '#111',
    alignItems: 'center', justifyContent: 'center',
  },
  closeText: { fontSize: 14, fontWeight: '900', color: '#111' },

  form: { flex: 1, paddingHorizontal: 20 },

  summaryBox: {
    backgroundColor: '#fff', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 14, padding: 16, marginTop: 20, marginBottom: 8,
  },
  summaryBoxTitle: { fontSize: 11, fontWeight: '900', color: '#888', letterSpacing: 1.5, marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  summaryLabel: { fontSize: 13, color: '#666', fontWeight: '600' },
  summaryVal: { fontSize: 13, fontWeight: '700', color: '#111' },
  summaryTotal: { fontSize: 18, fontWeight: '900', color: '#F45B26' },

  sectionLabel: {
    fontSize: 11, fontWeight: '900', color: '#888', letterSpacing: 2,
    marginTop: 20, marginBottom: 12,
  },

  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 6 },
  input: {
    borderWidth: 2.5, borderColor: '#111', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, fontWeight: '600', color: '#111', backgroundColor: '#fff',
  },
  inputMultiline: { height: 80, textAlignVertical: 'top' },

  payRow: { gap: 10 },
  payOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 2.5, borderColor: '#ddd', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff',
  },
  payOptionActive: { borderColor: '#111', backgroundColor: '#F8DE22' },
  payIcon: { fontSize: 22 },
  payLabel: { fontSize: 13, fontWeight: '700', color: '#888' },
  payLabelActive: { color: '#111', fontWeight: '900' },

  footer: {
    position: 'relative',
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#fff', borderTopWidth: 2.5, borderTopColor: '#111',
  },
  footerShadow: {
    position: 'absolute', top: 21, left: 25, right: -5, bottom: -5,
    backgroundColor: '#111', borderRadius: 14,
  },
  orderBtn: {
    backgroundColor: '#F8DE22', borderWidth: 2.5, borderColor: '#111',
    borderRadius: 14, paddingVertical: 18, alignItems: 'center',
  },
  orderBtnText: { fontSize: 15, fontWeight: '900', color: '#111', letterSpacing: 0.5 },
});

