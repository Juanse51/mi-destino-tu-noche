import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const transportes = [
  { nombre: 'BERLINAS', region: 'Andina', instagram: 'berlinasdelfonce', telefono: '6017435050' },
  { nombre: 'Seturcol', region: 'Andina', instagram: 'transporteseturcol', whatsapp: '573244357584' },
  { nombre: 'Cabify', region: 'Andina', instagram: 'cabify_colombia' },
  { nombre: 'Tu bus colombia', region: 'Andina', instagram: 'tubus.co' },
  { nombre: 'Coomotor', region: 'Andina', instagram: 'grupocoomotor' },
  { nombre: 'onika transporte', region: 'Andina', instagram: 'transportesonika' },
  { nombre: 'royal express', region: 'Andina' },
  { nombre: 'colombia travel tours', region: 'Andina', instagram: 'colombia.traveltours' },
  { nombre: 'COOMOFU LTDA', region: 'Andina', instagram: 'coomofu_oficial' },
  { nombre: 'expreso brasilia', region: 'Caribe', instagram: 'expresobrasilia' },
  { nombre: 'Grupo Santorini', region: 'Caribe', instagram: 'gruposantorinico' },
  { nombre: 'SODIS SERVICIO ESPECIAL', region: 'Caribe', instagram: 'sodis_vip' },
  { nombre: 'transguia transportes', region: 'Caribe', instagram: 'transguias_sa' },
  { nombre: 'ESCOTUR', region: 'Orinoquía', instagram: 'escoturssas' },
  { nombre: 'M&c Transportes S A S', region: 'Orinoquía' },
  { nombre: 'coopservices ltda', region: 'Orinoquía' },
  { nombre: 'SITEC S.A.S', region: 'Orinoquía' },
  { nombre: 'Vigía Servicio Especial', region: 'Andina' },
];

export default function TransportesScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const filtered = transportes.filter(t => t.nombre.toLowerCase().includes(search.toLowerCase()) || t.region.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={styles.backText}>← Volver</Text></TouchableOpacity>
        <Text style={styles.title}>🚌 Transportes</Text>
        <Text style={styles.subtitle}>Movilízate por Colombia</Text>

        <View style={styles.searchBar}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput placeholder="Buscar..." placeholderTextColor="#6B7280" style={styles.searchInput} value={search} onChangeText={setSearch} />
        </View>

        <Text style={styles.count}>{filtered.length} servicios</Text>

        {filtered.map((t, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}><Text style={{ fontSize: 22 }}>🚌</Text></View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{t.nombre}</Text>
                <Text style={styles.cardRegion}>📍 {t.region}</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              {t.whatsapp && (<TouchableOpacity style={[styles.btn, { backgroundColor: '#25D366' }]} onPress={() => Linking.openURL('https://wa.me/' + t.whatsapp)}><Text style={styles.btnText}>💬 WhatsApp</Text></TouchableOpacity>)}
              {t.telefono && (<TouchableOpacity style={[styles.btn, { backgroundColor: '#3B82F6' }]} onPress={() => Linking.openURL('tel:' + t.telefono)}><Text style={styles.btnText}>📞 Llamar</Text></TouchableOpacity>)}
              {t.instagram && (<TouchableOpacity style={[styles.btn, { backgroundColor: '#E1306C' }]} onPress={() => Linking.openURL('https://www.instagram.com/' + t.instagram)}><Text style={styles.btnText}>📷</Text></TouchableOpacity>)}
            </View>
          </View>
        ))}
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
  subtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 6 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', marginHorizontal: 20, marginTop: 16, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 15 },
  count: { color: '#9CA3AF', fontSize: 13, paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  card: { backgroundColor: '#1A1A2E', borderRadius: 16, marginHorizontal: 20, marginBottom: 12, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(59,130,246,0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  cardRegion: { fontSize: 13, color: '#60A5FA', marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
});
