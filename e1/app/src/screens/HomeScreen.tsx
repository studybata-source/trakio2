import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../App';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const time = useMemo(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), []);

  return (
    <View style={styles.container}>
      <Text style={styles.time} accessibilityLabel="Current time">{time}</Text>

      <View style={styles.todos}>
        <Text style={styles.sectionTitle}>To-Do</Text>
        <Text style={styles.placeholder}>No tasks yet. Tap + to add one.</Text>
      </View>

      <View style={styles.pinned}>
        <TouchableOpacity style={styles.pill} accessibilityRole="button" accessibilityLabel="Pinned app 1">
          <Text style={styles.pillText}>App 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pill} accessibilityRole="button" accessibilityLabel="Pinned app 2">
          <Text style={styles.pillText}>App 2</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} accessibilityLabel="Open Settings">
          <Text style={styles.link}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Drawer')} accessibilityLabel="Open App Drawer">
          <Text style={styles.link}>Drawer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0B', paddingHorizontal: 20, paddingTop: 64 },
  time: { color: '#FFFFFF', fontSize: 64, fontWeight: '700' },
  todos: { marginTop: 32, marginBottom: 24 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, marginBottom: 8 },
  placeholder: { color: '#BDBDBD' },
  pinned: { marginTop: 'auto', gap: 12, marginBottom: 32 },
  pill: { height: 60, borderRadius: 16, backgroundColor: '#111', justifyContent: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  pillText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  link: { color: '#BDBDBD', textDecorationLine: 'underline' },
});