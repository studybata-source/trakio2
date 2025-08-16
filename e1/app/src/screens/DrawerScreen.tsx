import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DrawerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Drawer</Text>
      <Text style={styles.subtitle}>Enable in Settings to list installed apps.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0B', paddingTop: 64, paddingHorizontal: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#BDBDBD' },
});