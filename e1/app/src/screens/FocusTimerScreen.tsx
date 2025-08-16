import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FocusTimerScreen() {
  const [seconds, setSeconds] = useState(25 * 60);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus</Text>
      <Text style={styles.timer} accessibilityLabel="Focus timer countdown">{mm}:{ss}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0B', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFFFFF', fontSize: 20, marginBottom: 12 },
  timer: { color: '#FFFFFF', fontSize: 72, fontWeight: '700' },
});