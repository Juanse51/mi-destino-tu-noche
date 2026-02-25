import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { ciudadesApi } from '../api/client';

const { width } = Dimensions.get('window');

export default function CiudadesScreen() {
  const navigation = useNavigation<any>();
  const { data: ciudades } = useQuery({ queryKey: ['ciudades'], queryFn: () => ciudadesApi.getAll() });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🏙️ Ciudades</Text>
        <Text style={styles.subtitle}>Explora establecimientos por ciudad</Text>
        <View style={styles.grid}>
          {(ciudades || []).map((ciudad: any) => (
            <TouchableOpacity key={ciudad.id} style={styles.card} onPress={() => navigation.navigate('Ciudad', { slug: ciudad.slug, nombre: ciudad.nombre })}>
              <View style={styles.imageContainer}>
                {ciudad.imagen_url ? (<Image source={{ uri: ciudad.imagen_url }} style={styles.image} />) : (<View style={styles.placeholder}><Text style={{ fontSize: 32 }}>🏙️</Text></View>)}
              </View>
              <Text style={styles.nombre}>{ciudad.nombre}</Text>
              <Text style={styles.count}>{ciudad.total_establecimientos} lugares</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginTop: 20 },
  subtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 6, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  card: { width: (width - 48) / 2, backgroundColor: '#1A1A2E', borderRadius: 16, margin: 6, overflow: 'hidden' },
  imageContainer: { width: '100%', height: 100 },
  image: { width: '100%', height: '100%' },
  placeholder: { width: '100%', height: '100%', backgroundColor: '#252540', justifyContent: 'center', alignItems: 'center' },
  nombre: { fontSize: 15, fontWeight: 'bold', color: '#FFF', paddingHorizontal: 12, paddingTop: 10 },
  count: { fontSize: 12, color: '#9CA3AF', paddingHorizontal: 12, paddingBottom: 12, marginTop: 2 },
});
