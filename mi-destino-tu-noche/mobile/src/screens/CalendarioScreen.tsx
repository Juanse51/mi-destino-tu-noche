import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type Categoria = 'Todos' | 'Festivos' | 'Conciertos' | 'Festivales' | 'Ferias' | 'Cultural' | 'Deportes';

const categorias: { key: Categoria; emoji: string; color: string }[] = [
  { key: 'Todos', emoji: '📅', color: '#FFF' },
  { key: 'Festivos', emoji: '🎉', color: '#EF4444' },
  { key: 'Conciertos', emoji: '🎤', color: '#8B5CF6' },
  { key: 'Festivales', emoji: '🎪', color: '#F59E0B' },
  { key: 'Ferias', emoji: '🎡', color: '#10B981' },
  { key: 'Cultural', emoji: '🎭', color: '#EC4899' },
  { key: 'Deportes', emoji: '⚽', color: '#3B82F6' },
];

const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const eventos = [
  // Enero
  { mes: 0, fecha: '6 Ene', nombre: 'Día de Reyes', lugar: '', ciudad: 'Colombia', cat: 'Festivos', destacado: false },
  { mes: 0, fecha: '17-18 Ene', nombre: 'Bad Bunny - Most Wanted Tour', lugar: 'Estadio Atanasio Girardot', ciudad: 'Medellín', cat: 'Conciertos', destacado: true },
  { mes: 0, fecha: '19 Ene', nombre: 'Bad Bunny - Most Wanted Tour', lugar: 'Estadio Atanasio Girardot', ciudad: 'Medellín', cat: 'Conciertos', destacado: true },
  { mes: 0, fecha: '25 Ene', nombre: 'Avenged Sevenfold', lugar: 'Coliseo Live', ciudad: 'Bogotá', cat: 'Conciertos', destacado: false },
  { mes: 0, fecha: '22-26 Ene', nombre: 'Festival Centro', lugar: 'Centro de Bogotá', ciudad: 'Bogotá', cat: 'Festivales', destacado: true },
  // Febrero
  { mes: 1, fecha: '7 Feb', nombre: 'My Chemical Romance', lugar: 'Coliseo Live', ciudad: 'Bogotá', cat: 'Conciertos', destacado: true },
  { mes: 1, fecha: '14 Feb', nombre: 'San Valentín', lugar: '', ciudad: 'Colombia', cat: 'Festivos', destacado: false },
  { mes: 1, fecha: '15 Feb', nombre: 'Doja Cat', lugar: 'Coliseo Live', ciudad: 'Bogotá', cat: 'Conciertos', destacado: true },
  { mes: 1, fecha: '21 Feb', nombre: 'Kali Uchis', lugar: 'Movistar Arena', ciudad: 'Bogotá', cat: 'Conciertos', destacado: true },
  { mes: 1, fecha: '22 Feb', nombre: 'CORE Medellín (Tomorrowland)', lugar: 'Parque Norte', ciudad: 'Medellín', cat: 'Festivales', destacado: true },
  { mes: 1, fecha: '27 Feb - 1 Mar', nombre: 'Festival Ondas', lugar: 'La Macarena', ciudad: 'Meta', cat: 'Festivales', destacado: false },
  // Marzo
  { mes: 2, fecha: '20-23 Mar', nombre: 'Festival Estéreo Picnic', lugar: 'Briceño 18', ciudad: 'Bogotá', cat: 'Festivales', destacado: true },
  { mes: 2, fecha: '22 Mar', nombre: 'Sabrina Carpenter (FEP)', lugar: 'Briceño 18', ciudad: 'Bogotá', cat: 'Conciertos', destacado: true },
  { mes: 2, fecha: '23 Mar', nombre: 'The Killers (FEP)', lugar: 'Briceño 18', ciudad: 'Bogotá', cat: 'Conciertos', destacado: true },
  { mes: 2, fecha: '21 Mar', nombre: 'Lorde (FEP)', lugar: 'Briceño 18', ciudad: 'Bogotá', cat: 'Conciertos', destacado: false },
  { mes: 2, fecha: '20 Mar', nombre: 'Tyler The Creator (FEP)', lugar: 'Briceño 18', ciudad: 'Bogotá', cat: 'Conciertos', destacado: false },
  { mes: 2, fecha: '24 Mar', nombre: 'Día de San José', lugar: '', ciudad: 'Colombia', cat: 'Festivos', destacado: false },
  // Abril
  { mes: 3, fecha: '5 Abr', nombre: 'Megadeth', lugar: 'Coliseo Live', ciudad: 'Bogotá', cat: 'Conciertos', destacado: false },
  { mes: 3, fecha: '12 Abr', nombre: 'Ryan Castro', lugar: 'Movistar Arena', ciudad: 'Bogotá', cat: 'Conciertos', destacado: false },
  { mes: 3, fecha: '13-20 Abr', nombre: 'Semana Santa', lugar: '', ciudad: 'Colombia', cat: 'Festivos', destacado: true },
  { mes: 3, fecha: '26 Abr', nombre: 'Grupo Frontera', lugar: 'Movistar Arena', ciudad: 'Bogotá', cat: 'Conciertos', destacado: false },
  // Mayo
  { mes: 4, fecha: '1 May', nombre: 'Día del Trabajo', lugar: '', ciudad: 'Colombia', cat: 'Festivos', destacado: false },
  { mes: 4, fecha: '10 May', nombre: 'Ed Sheeran', lugar: 'El Campín', ciudad: 'Bogotá', cat: 'Conciertos', destacado: true },
  { mes: 4, fecha: '16-17 May', nombre: 'Baum Festival', lugar: 'Baum', ciudad: 'Bogotá', cat: 'Festivales', destacado: true },
  { mes: 4, fecha: '24 May', nombre: 'Soda Stereo - Ecos', lugar: 'Coliseo Live', ciudad: 'Bogotá', cat: 'Conciertos', destacado: false },
  { mes: 4, fecha: '30-31 May', nombre: 'Festival La Solar', lugar: '', ciudad: 'Medellín', cat: 'Festivales', destacado: false },
  // Junio
  { mes: 5, fecha: '2 Jun', nombre: 'Día de la Ascensión', lugar: '', ciudad: 'Colombia', cat: 'Festivos', destacado: false },
  { mes: 5, fecha: '14 Jun', nombre: 'PULP', lugar: 'Movistar Arena', ciudad: 'Bogotá', cat: 'Conciertos', destacado: false },
  { mes: 5, fecha: '20-28 Jun', nombre: 'Fito Páez - Gira Colombia', lugar: 'Varias ciudades', ciudad: 'Colombia', cat: 'Conciertos', destacado: false },
  // Julio
  { mes: 6, fecha: '12 Jul', nombre: 'Rosalía', lugar: 'El Campín', ciudad: 'Bogotá', cat: 'Conciertos', destacado: true },
  { mes: 6, fecha: '20 Jul', nombre: 'Día de la Independencia', lugar: '', ciudad: 'Colombia', cat: 'Festivos', destacado: true },
  // Agosto
  { mes: 7, fecha: '7 Ago', nombre: 'Batalla de Boyacá', lugar: '', ciudad: 'Colombia', cat: 'Festivos', destacado: false },
  { mes: 7, fecha: '8-15 Ago', nombre: 'Morat - Gira Colombia', lugar: 'Varias ciudades', ciudad: 'Colombia', cat: 'Conciertos', destacado: true },
  { mes: 7, fecha: '15-17 Ago', nombre: 'Feria de las Flores', lugar: '', ciudad: 'Medellín', cat: 'Ferias', destacado: true },
  // Septiembre
  { mes: 8, fecha: '13 Sep', nombre: 'Helloween', lugar: 'Movistar Arena', ciudad: 'Bogotá', cat: 'Conciertos', destacado: false },
  // Octubre
  { mes: 9, fecha: '4 Oct', nombre: 'Tool', lugar: 'Coliseo Live', ciudad: 'Bogotá', cat: 'Conciertos', destacado: true },
  { mes: 9, fecha: '18 Oct', nombre: 'Luis Miguel', lugar: 'El Campín', ciudad: 'Bogotá', cat: 'Conciertos', destacado: true },
  // Noviembre
  { mes: 10, fecha: '3 Nov', nombre: 'Día de Todos los Santos', lugar: '', ciudad: 'Colombia', cat: 'Festivos', destacado: false },
  { mes: 10, fecha: '11 Nov', nombre: 'Independencia de Cartagena', lugar: '', ciudad: 'Cartagena', cat: 'Festivos', destacado: false },
  // Diciembre
  { mes: 11, fecha: '7-9 Dic', nombre: 'Noche de Velitas y Puente', lugar: '', ciudad: 'Colombia', cat: 'Festivos', destacado: true },
  { mes: 11, fecha: '25 Dic', nombre: 'Navidad', lugar: '', ciudad: 'Colombia', cat: 'Festivos', destacado: false },
  { mes: 11, fecha: '31 Dic', nombre: 'Año Nuevo', lugar: '', ciudad: 'Colombia', cat: 'Festivos', destacado: false },
];

export default function CalendarioScreen() {
  const navigation = useNavigation<any>();
  const [catFiltro, setCatFiltro] = useState<Categoria>('Todos');
  const [mesFiltro, setMesFiltro] = useState<number | null>(null);

  const filtered = eventos.filter(e => {
    if (catFiltro !== 'Todos' && e.cat !== catFiltro) return false;
    if (mesFiltro !== null && e.mes !== mesFiltro) return false;
    return true;
  });

  const grouped: Record<number, typeof eventos> = {};
  filtered.forEach(e => { if (!grouped[e.mes]) grouped[e.mes] = []; grouped[e.mes].push(e); });

  const getCatColor = (cat: string) => categorias.find(c => c.key === cat)?.color || '#FFF';
  const getCatEmoji = (cat: string) => categorias.find(c => c.key === cat)?.emoji || '📅';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={styles.backText}>← Volver</Text></TouchableOpacity>

        <View style={styles.heroSection}>
          <Text style={styles.title}>📅 Calendario 2026</Text>
          <Text style={styles.subtitle}>Conciertos, festivales y eventos en Colombia</Text>
        </View>

        {/* Filtros sticky */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catFilters}>
            {categorias.map(c => (
              <TouchableOpacity key={c.key} onPress={() => setCatFiltro(c.key)} style={[styles.catBtn, catFiltro === c.key && { backgroundColor: getCatColor(c.key) + '30', borderColor: getCatColor(c.key) }]}>
                <Text style={styles.catBtnText}>{c.emoji} {c.key}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mesFilters}>
            <TouchableOpacity onPress={() => setMesFiltro(null)} style={[styles.mesBtn, mesFiltro === null && styles.mesBtnActive]}>
              <Text style={[styles.mesBtnText, mesFiltro === null && styles.mesBtnTextActive]}>Todo</Text>
            </TouchableOpacity>
            {meses.map((m, i) => (
              <TouchableOpacity key={i} onPress={() => setMesFiltro(i)} style={[styles.mesBtn, mesFiltro === i && styles.mesBtnActive]}>
                <Text style={[styles.mesBtnText, mesFiltro === i && styles.mesBtnTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Events */}
        <View style={styles.eventsSection}>
          <Text style={styles.resultCount}>{filtered.length} eventos</Text>
          {Object.keys(grouped).sort((a, b) => Number(a) - Number(b)).map(mesKey => {
            const mesNum = Number(mesKey);
            const mesEventos = grouped[mesNum];
            return (
              <View key={mesNum} style={styles.mesGroup}>
                <View style={styles.mesHeader}>
                  <Text style={styles.mesTitle}>{meses[mesNum]} 2026</Text>
                  <Text style={styles.mesCount}>{mesEventos.length} eventos</Text>
                </View>
                {mesEventos.map((e, i) => (
                  <View key={i} style={[styles.eventCard, e.destacado && styles.eventCardDestacado]}>
                    <View style={styles.eventLeft}>
                      <Text style={styles.eventFecha}>{e.fecha}</Text>
                      <View style={[styles.eventCatBadge, { backgroundColor: getCatColor(e.cat) + '25' }]}>
                        <Text style={[styles.eventCatText, { color: getCatColor(e.cat) }]}>{getCatEmoji(e.cat)} {e.cat}</Text>
                      </View>
                    </View>
                    <View style={styles.eventRight}>
                      <Text style={styles.eventNombre}>{e.destacado ? '⭐ ' : ''}{e.nombre}</Text>
                      {e.lugar ? <Text style={styles.eventLugar}>📍 {e.lugar}</Text> : null}
                      <Text style={styles.eventCiudad}>{e.ciudad}</Text>
                    </View>
                  </View>
                ))}
              </View>
            );
          })}
          {filtered.length === 0 && (
            <View style={styles.empty}><Text style={{ fontSize: 48 }}>🔍</Text><Text style={styles.emptyText}>No hay eventos para este filtro</Text></View>
          )}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  backBtn: { paddingHorizontal: 20, paddingTop: 12 },
  backText: { color: '#9CA3AF', fontSize: 14 },
  heroSection: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 6 },
  filtersContainer: { backgroundColor: '#0F0F1A', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#1A1A2E' },
  catFilters: { paddingHorizontal: 16, paddingVertical: 8 },
  catBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#374151' },
  catBtnText: { color: '#FFF', fontSize: 13, fontWeight: '500' },
  mesFilters: { paddingHorizontal: 16, paddingBottom: 4 },
  mesBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginRight: 6, backgroundColor: '#1A1A2E' },
  mesBtnActive: { backgroundColor: '#7C3AED' },
  mesBtnText: { color: '#9CA3AF', fontSize: 13, fontWeight: '500' },
  mesBtnTextActive: { color: '#FFF' },
  eventsSection: { paddingHorizontal: 20, paddingTop: 16 },
  resultCount: { color: '#9CA3AF', fontSize: 13, marginBottom: 16 },
  mesGroup: { marginBottom: 24 },
  mesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  mesTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  mesCount: { fontSize: 13, color: '#9CA3AF' },
  eventCard: { backgroundColor: '#1A1A2E', borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: 'row' },
  eventCardDestacado: { borderWidth: 1, borderColor: '#F59E0B40' },
  eventLeft: { width: 90, marginRight: 12 },
  eventFecha: { fontSize: 13, fontWeight: 'bold', color: '#FFF' },
  eventCatBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginTop: 6, alignSelf: 'flex-start' },
  eventCatText: { fontSize: 10, fontWeight: '600' },
  eventRight: { flex: 1 },
  eventNombre: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },
  eventLugar: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  eventCiudad: { fontSize: 12, color: '#7C3AED', marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#9CA3AF', fontSize: 14, marginTop: 12 },
});
