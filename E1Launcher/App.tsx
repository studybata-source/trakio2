/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function Home({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>12:34</Text>
      <View style={styles.todos}>
        <Text style={styles.sectionTitle}>To-Do</Text>
        <Text style={styles.placeholder}>No tasks yet. Tap + to add one.</Text>
      </View>
      <View style={styles.pinned}>
        <TouchableOpacity style={styles.pill}><Text style={styles.pillText}>App 1</Text></TouchableOpacity>
        <TouchableOpacity style={styles.pill}><Text style={styles.pillText}>App 2</Text></TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Text style={styles.link}>Settings</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Drawer')}><Text style={styles.link}>Drawer</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('FocusTimer')}><Text style={styles.link}>Focus</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function Settings() {
  return (
    <View style={styles.page}><Text style={styles.title}>Settings</Text></View>
  );
}

function Drawer() {
  return (
    <View style={styles.page}><Text style={styles.title}>App Drawer</Text></View>
  );
}

function FocusTimer() {
  return (
    <View style={styles.page}><Text style={styles.title}>Focus Timer</Text></View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Drawer" component={Drawer} />
        <Stack.Screen name="FocusTimer" component={FocusTimer} />
      </Stack.Navigator>
    </NavigationContainer>
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
  page: { flex: 1, backgroundColor: '#0B0B0B', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
});
