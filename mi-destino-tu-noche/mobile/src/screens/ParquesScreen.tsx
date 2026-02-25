import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const parques = [
  { nombre: 'Parque del Café', direccion: 'Montenegro, Quindío', descripcion: 'Parque temático destacando la cultura cafetera colombiana, inaugurado en 1995.', instagram: 'parquedelcafeoficial', telefono: '6067417400' },
  { nombre: 'Salitre Mágico', direccion: 'Cl 63 #60-80, Bogotá', descripcion: 'Parque de atracciones con 30 atracciones mecánicas junto al Parque Simón Bolívar.', instagram: 'salitremagico', telefono: '6019156050' },
  { nombre: 'Fundación Parque Jaime Duque', direccion: 'Tocancipá, Cundinamarca', descripcion: 'Parque temático dedicado a la recreación familiar.', instagram: 'parquejaimeduque', whatsapp: '573146959022' },
  { nombre: 'Panaca Quindío', direccion: 'Km 7, Vía Panaca, Quimbaya, Quindío', descripcion: 'Parque temático agropecuario con experiencias de naturaleza y animales.', instagram: 'panacaparque' },
  { nombre: 'Piscilago | Parque Acuático', direccion: 'Vía Bogotá-Girardot, Km 105, Nilo', descripcion: 'Parque acuático y zoológico con toboganes y piscinas de olas.', instagram: 'piscilagocol' },
  { nombre: 'Mundo Aventura', direccion: 'Cra. 71d #1-14 Sur, Bogotá', descripcion: 'Parque de diversiones en el sur de Bogotá con atracciones para todas las edades.', instagram: 'mundo_aventura' },
  { nombre: 'Multiparque', direccion: 'Auto. Norte #224-60, Usaquén, Bogotá', descripcion: 'Parque de diversiones al norte de Bogotá con atracciones familiares.', instagram: 'multiparquecol' },
  { nombre: 'Parque Nacional del Chicamocha', direccion: 'Km 54 Vía Bucaramanga-San Gil, Santander', descripcion: 'Parque temático en el cañón del Chicamocha con teleférico y actividades extremas.', instagram: 'parquenacionaldelchicamocha' },
  { nombre: 'Hacienda Nápoles', direccion: 'Km 165 Autopista Medellín-Bogotá, Puerto Triunfo', descripcion: 'Parque temático con zoológico y parque acuático en Antioquia.', instagram: 'haciendanapoles' },
];

export default function ParquesScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const filtered = parques.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.direccion.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={styles.backText}>← Volver</Text></TouchableOpacity>
        <Text style={styles.title}>🎢 Parques de Diversiones</Text>
        <Text style={styles.subtitle}>Los mejores parques temáticos y de diversiones de Colombia</Text>

        <View style={styles.searchBar}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput placeholder="Buscar parque..." placeholderTextColor="#6B7280" style={styles.searchInput} value={search} onChangeText={setSearch} />
        </View>

        <Text style={styles.count}>{filtered.length} parques</Text>

        {filtered.map((p, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.iconBox}><Text style={{ fontSize: 24 }}>🎢</Text></View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{p.nombre}</Text>
                <Text style={styles.cardDir}>📍 {p.direccion}</Text>
              </View>
            </View>
            {p.descripcion ? <Text style={styles.cardDesc}>{p.descripcion}</Text> : null}
            <View style={styles.cardActions}>
              {p.instagram && (
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#E1306C' }]} onPress={() => Linking.openURL('https://www.instagram.com/' + p.instagram)}>
                  <Text style={styles.btnText}>📷 Instagram</Text>
                </TouchableOpacity>
              )}
              {p.telefono && (
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#10B981' }]} onPress={() => Linking.openURL('tel:' + p.telefono)}>
                  <Text style={styles.btnText}>📞 Llamar</Text>
                </TouchableOpacity>
              )}
              {p.whatsapp && (
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#25D366' }]} onPress={() => Linking.openURL('https://wa.me/' + p.whatsapp)}>
                  <Text style={styles.btnText}>💬 WhatsApp</Text>
                </TouchableOpacity>
              )}
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
  subtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', marginHorizontal: 20, marginTop: 16, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 15 },
  count: { color: '#9CA3AF', fontSize: 13, paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  card: { backgroundColor: '#1A1A2E', borderRadius: 16, marginHorizontal: 20, marginBottom: 12, padding: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 50, height: 50, borderRadius: 14, backgroundColor: 'rgba(34,197,94,0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  cardDir: { fontSize: 13, color: '#4ADE80', marginTop: 3 },
  cardDesc: { fontSize: 13, color: '#9CA3AF', marginTop: 10, lineHeight: 20 },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
});
