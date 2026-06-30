import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { formatModelUrl, get3DHtml } from './product_helpers';

interface Product3DModalProps {
  visible: boolean;
  onClose: () => void;
  productName: string;
  model3dUrl: string;
}

export function Product3DModal({ visible, onClose, productName, model3dUrl }: Product3DModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={modalStyles.container}>
        <View style={modalStyles.header}>
          <Text style={modalStyles.title} numberOfLines={1}>
            3D: {productName}
          </Text>
          <Pressable style={modalStyles.closeBtn} onPress={onClose}>
            <Text style={modalStyles.closeText}>ĐÓNG ×</Text>
          </Pressable>
        </View>

        <View style={modalStyles.webviewWrap}>
          <WebView
            originWhitelist={['*']}
            source={{ html: get3DHtml(formatModelUrl(model3dUrl)) }}
            style={{ flex: 1, backgroundColor: '#f7f9fa' }}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
          />
        </View>
        
        <View style={modalStyles.footer}>
          <Text style={modalStyles.footerText}>
            💡 Vuốt để xoay mô hình • Pinch to zoom (Phóng to/thu nhỏ)
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2.5,
    borderBottomColor: '#111',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111',
    flex: 1,
    marginRight: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeBtn: {
    backgroundColor: '#F8DE22',
    borderWidth: 2,
    borderColor: '#111',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#111',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  closeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111',
  },
  webviewWrap: {
    flex: 1,
    backgroundColor: '#f7f9fa',
  },
  footer: {
    padding: 12,
    borderTopWidth: 2,
    borderTopColor: '#111',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

export default Product3DModal;
