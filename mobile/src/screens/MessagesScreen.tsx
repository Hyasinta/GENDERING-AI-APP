import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function MessagesScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: '800', color: '#1a237e', marginBottom: 6 },
  subtitle: { color: '#666' },
});



