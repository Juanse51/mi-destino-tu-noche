import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const establecimientos = {
  alojamiento: ['Hilton Bogotá', 'Four Seasons', 'Alojamientos Turísticos ERSAGUER', 'La Gloria Reserva Forestal', 'Viajero Hostels', 'Hotel Zen-sual', 'Hyatt Place', 'Four Points by Sheraton', 'Sofitel Bogotá Victoria Regia', 'Grand Hyatt Bogotá', 'Bogotá Plaza Hotel', 'Habitel Hotels', 'Salvio 93', 'GHL Hotels', 'Germán Morales', 'W Bogotá Hotel', 'Novotel Parque de la 93', 'Aloft Bogotá Airport', 'Blue Doors', 'Hotel Rosales Plaza'],
  agencias: ['Bogotay Travel', 'Consentidos por Naturaleza', 'Territorio Colombia', '360 Colombia', 'Global Trip', 'Innova Travel', 'Wakaroo Travel', 'Banana Travel', 'Viaja Ya', 'Aquamarine Agencia de viajes', 'Samor Experiencias'],
  bares: ['Bar Chiquita', 'Caffa Colombia', 'Tejo La Embajada', 'Cat Coffee'],
};

const catMeta: Record<string, { label: string; emoji: string; color: string }> = {
  alojamiento: { label: 'Alojamiento', emoji: '🏨', color: '#8B5CF6' },
  agencias: { label: 'Agencias de viajes', emoji: '✈️', color: '#3B82F6' },
  bares: { label: 'Bares y restaurantes', emoji: '🍸', color: '#EC4899' },
};

export default function DiversidadScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={styles.backText}>← Volver</Text></TouchableOpacity>
        <Text style={styles.title}>🏳️‍🌈 Cámara de la Diversidad</Text>
        <Text style={styles.subtitle}>Empresas afiliadas - Espacios inclusivos LGBTIQ+ en Bogotá</Text>

        <View style={styles.searchBar}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput placeholder="Buscar..." placeholderTextColor="#6B7280" style={styles.searchInput} value={search} onChangeText={setSearch} />
        </View>

        {Object.entries(establecimientos).map(([cat, items]) => {
          const meta = catMeta[cat];
          const filtered = items.filter(n => n.toLowerCase().includes(search.toLowerCase()));
          if (filtered.length === 0) return null;
          return (
            <View key={cat} style={styles.section}>
              <Text style={styles.sectionTitle}>{meta.emoji} {meta.label} ({filtered.length})</Text>
              {filtered.map((nombre, i) => (
                <View key={i} style={styles.card}>
                  <View style={[styles.avatar, { backgroundColor: meta.color + '30' }]}>
                    <Text style={[styles.avatarText, { color: meta.color }]}>{nombre.charAt(0)}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{nombre}</Text>
                    <Text style={[styles.cardCat, { color: meta.color }]}>{meta.emoji} {meta.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          );
        })}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  backBtn: { paddingHorizontal: 20, paddingTop: 12 },
  backText: { color: '#9CA3AF', fontSize: 14 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginTop: 12 },
  subtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', marginHorizontal: 20, marginTop: 16, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 15 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', borderRadius: 14, padding: 14, marginBottom: 8 },
  avatar: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '600', color: '#FFF' },
  cardCat: { fontSize: 12, marginTop: 2 },
});
