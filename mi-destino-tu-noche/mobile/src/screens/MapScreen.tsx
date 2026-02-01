// MapScreen.tsx - Mapa Interactivo
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.icon}>🗺️</Text>
        <Text style={styles.text}>Mapa Interactivo</Text>
        <Text style={styles.subtext}>Configura react-native-maps con tu API key de Google</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  icon: { fontSize: 80 },
  text: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 20 },
  subtext: { fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center' },
});
