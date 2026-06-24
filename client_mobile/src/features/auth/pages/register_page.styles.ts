import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8DE22' },

  stripe: {
    height: 52,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { color: '#F8DE22', fontSize: 16, fontWeight: '900', letterSpacing: 4 },

  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, paddingVertical: 32 },

  cardWrap: { width: '100%', maxWidth: 380, position: 'relative' },
  cardShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#111', borderRadius: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 2.5, borderColor: '#111', borderRadius: 24,
    padding: 28,
  },

  titleWrap: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '900', color: '#111' },
  titleBar: {
    position: 'absolute', bottom: 2, left: 0, width: 64, height: 8,
    backgroundColor: '#F8DE22', zIndex: -1,
  },

  errorBox: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: 'rgba(209,32,82,0.08)',
    borderWidth: 1.5, borderColor: '#D12052',
    borderRadius: 10,
  },
  errorText: { color: '#D12052', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },

  fieldWrap: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '900', color: '#111', letterSpacing: 0.8, marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 2, borderColor: '#111', borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14, fontWeight: '600', color: '#111',
    backgroundColor: '#fafafa',
  },

  btnWrap: { height: 50, marginTop: 8, position: 'relative' },
  btnShadow: {
    position: 'absolute', top: 3, left: 3, right: -3, bottom: -3,
    backgroundColor: '#D12052', borderRadius: 12,
  },
  btn: {
    flex: 1,
    backgroundColor: '#111', borderWidth: 2, borderColor: '#111', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },

  footer: { marginTop: 22, alignItems: 'center' },
  footerText: { fontSize: 11, fontWeight: '700', color: '#555', letterSpacing: 0.5 },
  footerLink: { color: '#D12052', fontWeight: '900', textDecorationLine: 'underline' },
});
