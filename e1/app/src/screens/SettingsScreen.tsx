import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.group}>Appearance</Text>
      <Text style={styles.item}>Theme, Font, Text Size, Motion</Text>

      <Text style={styles.group}>Behavior</Text>
      <Text style={styles.item}>App Drawer, Notification Policy, Quick Settings, Exit Lock</Text>

      <Text style={styles.group}>To-Do</Text>
      <Text style={styles.item}>Sync Providers, Auto-Archive, Export</Text>

      <Text style={styles.group}>Advanced</Text>
      <Text style={styles.item}>Grayscale, Screen-time Overlay, Debug</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0B' },
  content: { padding: 20, paddingTop: 64 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginBottom: 24 },
  group: { color: '#FFFFFF', fontSize: 16, marginTop: 16, marginBottom: 6 },
  item: { color: '#BDBDBD' },
});