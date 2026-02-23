'use client'

import { useState } from 'react'
import Link from 'next/link'

type Categoria = 'todos' | 'festivo' | 'concierto' | 'festival' | 'feria' | 'cultural' | 'deporte';
type Mes = 'todos' | 'ene' | 'feb' | 'mar' | 'abr' | 'may' | 'jun' | 'jul' | 'ago' | 'sep' | 'oct' | 'nov' | 'dic';

interface Evento {
  fecha: string;
  nombre: string;
  lugar: string;
  ciudad: string;
  categoria: Categoria;
  mes: Mes;
  destacado?: boolean;
}

const eventos: Evento[] = [
  // Enero
  { fecha: '4-12 Ene', nombre: 'Cartagena XX Festival de Música', lugar: 'Varios escenarios', ciudad: 'Cartagena', categoria: 'festival', mes: 'ene', destacado: true },
  { fecha: '5 Ene', nombre: 'Día de Reyes (Festivo)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'ene' },
  { fecha: '12 Ene', nombre: 'Festivo', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'ene' },
  { fecha: '20 Ene', nombre: 'Avenged Sevenfold', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'ene' },
  { fecha: '21 Ene', nombre: 'Leiva', lugar: 'Teatro Jorge Eliécer Gaitán', ciudad: 'Bogotá', categoria: 'concierto', mes: 'ene' },
  { fecha: '23-25 Ene', nombre: 'Bad Bunny', lugar: 'Estadio Atanasio Girardot', ciudad: 'Medellín', categoria: 'concierto', mes: 'ene', destacado: true },
  { fecha: '29 Ene - 1 Feb', nombre: 'Festival Centro', lugar: 'Varios escenarios', ciudad: 'Bogotá', categoria: 'festival', mes: 'ene' },
  { fecha: '30-31 Ene', nombre: 'Hermanos Gutiérrez', lugar: 'Varios', ciudad: 'Bogotá / Medellín', categoria: 'concierto', mes: 'ene' },
  // Febrero
  { fecha: '7 Feb', nombre: 'Esteman y Daniela Spalla', lugar: 'Palacio de los Deportes', ciudad: 'Bogotá', categoria: 'concierto', mes: 'feb' },
  { fecha: '10 Feb', nombre: 'My Chemical Romance', lugar: 'Vive Claro', ciudad: 'Bogotá', categoria: 'concierto', mes: 'feb', destacado: true },
  { fecha: '13 Feb', nombre: 'Festival Ondas: Ivy Queen y Villano Antillano', lugar: 'Parque Simón Bolívar', ciudad: 'Bogotá', categoria: 'festival', mes: 'feb' },
  { fecha: '13-14 Feb', nombre: 'Alejandro Sanz', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'feb' },
  { fecha: '14 Feb', nombre: 'Festival Ondas: The Cardigans', lugar: 'Parque Simón Bolívar', ciudad: 'Bogotá', categoria: 'festival', mes: 'feb' },
  { fecha: '15 Feb', nombre: 'Doja Cat', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'feb', destacado: true },
  { fecha: '17 Feb', nombre: 'Devendra Banhart', lugar: 'Teatro Colón', ciudad: 'Bogotá', categoria: 'concierto', mes: 'feb' },
  { fecha: '18 Feb', nombre: 'Kali Uchis', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'feb', destacado: true },
  { fecha: '19 Feb', nombre: 'Festival Ondas: Arde Bogotá y Silvestre y la Naranja', lugar: 'Parque Simón Bolívar', ciudad: 'Bogotá', categoria: 'festival', mes: 'feb' },
  { fecha: '20-21 Feb', nombre: 'CORE Medellín (Tomorrowland Presents)', lugar: 'Parque Norte', ciudad: 'Medellín', categoria: 'festival', mes: 'feb', destacado: true },
  { fecha: '22 Feb', nombre: 'Juliana y la Orquesta de Lucho Bermúdez', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'feb' },
  { fecha: '28 Feb', nombre: 'Hugel', lugar: 'Varios', ciudad: 'Bogotá / Medellín', categoria: 'concierto', mes: 'feb' },
  // Marzo
  { fecha: '4-6 Mar', nombre: 'Rüfüs Du Sol', lugar: 'Varios', ciudad: 'Medellín / Bogotá', categoria: 'concierto', mes: 'mar' },
  { fecha: '7 Mar', nombre: 'Kapo', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'mar' },
  { fecha: '11 Mar', nombre: 'Miguel Bosé', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'mar' },
  { fecha: '14 Mar', nombre: 'Jason Mraz', lugar: 'Royal Center', ciudad: 'Bogotá', categoria: 'concierto', mes: 'mar' },
  { fecha: '19 Mar', nombre: 'Marina / Tom Morello', lugar: 'Royal Center / Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'mar' },
  { fecha: '20-22 Mar', nombre: 'Festival Estéreo Picnic', lugar: 'Parque Simón Bolívar', ciudad: 'Bogotá', categoria: 'festival', mes: 'mar', destacado: true },
  { fecha: '23 Mar', nombre: 'Festivo (San José)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'mar' },
  { fecha: '23 Mar', nombre: '31 Minutos', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'mar' },
  { fecha: '28 Mar', nombre: 'Los Bunkers', lugar: 'Royal Center', ciudad: 'Bogotá', categoria: 'concierto', mes: 'mar' },
  // Abril
  { fecha: '2 Abr', nombre: 'Jueves Santo (Festivo)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'abr' },
  { fecha: '3 Abr', nombre: 'Viernes Santo (Festivo)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'abr' },
  { fecha: '10 Abr', nombre: 'Crudo Means Raw', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'abr' },
  { fecha: '11-19 Abr', nombre: 'Carnaval de Bogotá', lugar: 'Calles de Bogotá', ciudad: 'Bogotá', categoria: 'cultural', mes: 'abr' },
  { fecha: '16-19 Abr', nombre: 'Grupo Frontera', lugar: 'Varios', ciudad: 'Bogotá / Medellín', categoria: 'concierto', mes: 'abr' },
  { fecha: '17-23 Abr', nombre: 'Rawayana', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'abr' },
  { fecha: '18 Abr', nombre: 'Dream Theater', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'abr' },
  { fecha: '19-20 Abr', nombre: 'Milo J', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'abr' },
  { fecha: '22 Abr', nombre: 'Laura Pausini', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'abr' },
  { fecha: '25 Abr', nombre: 'Ryan Castro', lugar: 'Estadio Atanasio Girardot', ciudad: 'Medellín', categoria: 'concierto', mes: 'abr', destacado: true },
  { fecha: '26-27 Abr', nombre: 'Megadeth', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'abr', destacado: true },
  // Mayo
  { fecha: '1 May', nombre: 'Día del Trabajo (Festivo)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'may' },
  { fecha: '2 May', nombre: 'Korn', lugar: 'Coliseo MedPlus', ciudad: 'Bogotá', categoria: 'concierto', mes: 'may' },
  { fecha: '2 May', nombre: 'Festival La Solar', lugar: 'Unidad Deportiva Atanasio Girardot', ciudad: 'Medellín', categoria: 'festival', mes: 'may', destacado: true },
  { fecha: '7-9 May', nombre: 'Mon Laferte', lugar: 'Varios', ciudad: 'Bogotá / Medellín', categoria: 'concierto', mes: 'may' },
  { fecha: '12-14 May', nombre: 'Bogotá Fashion Week', lugar: 'Varios escenarios', ciudad: 'Bogotá', categoria: 'cultural', mes: 'may' },
  { fecha: '15 May', nombre: 'Natalia Lafourcade', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'may' },
  { fecha: '16 May', nombre: 'Ed Sheeran', lugar: 'Vive Claro', ciudad: 'Bogotá', categoria: 'concierto', mes: 'may', destacado: true },
  { fecha: '18 May', nombre: 'Festivo (Ascensión)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'may' },
  { fecha: '22-23 May', nombre: 'Baum Festival', lugar: 'Corferias', ciudad: 'Bogotá', categoria: 'festival', mes: 'may', destacado: true },
  { fecha: '28-30 May', nombre: 'Soda Stereo - Ecos', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'may', destacado: true },
  // Junio
  { fecha: '4 Jun', nombre: 'Pomme', lugar: 'Teatro Colsubsidio', ciudad: 'Bogotá', categoria: 'concierto', mes: 'jun' },
  { fecha: '5 Jun', nombre: 'Fito Páez', lugar: 'Plaza de Toros', ciudad: 'Manizales', categoria: 'concierto', mes: 'jun' },
  { fecha: '6 Jun', nombre: 'Fito Páez / PULP', lugar: 'Varios', ciudad: 'Cali / Bogotá', categoria: 'concierto', mes: 'jun' },
  { fecha: '8 Jun', nombre: 'Festivo (Corpus Christi)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'jun' },
  { fecha: '9 Jun', nombre: 'Fito Páez', lugar: 'La Macarena', ciudad: 'Medellín', categoria: 'concierto', mes: 'jun' },
  { fecha: '12 Jun', nombre: 'Fito Páez', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'jun' },
  { fecha: '15 Jun', nombre: 'Festivo (Sagrado Corazón)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'jun' },
  { fecha: '22 Jun', nombre: 'Festivo (San Pedro y San Pablo)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'jun' },
  { fecha: '25 Jun-6 Jul', nombre: 'Festival Iberoamericano de Teatro', lugar: 'Varios escenarios', ciudad: 'Bogotá', categoria: 'cultural', mes: 'jun' },
  // Julio
  { fecha: '16 Jul', nombre: 'Rosalía', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'jul', destacado: true },
  { fecha: '20 Jul', nombre: 'Día de la Independencia (Festivo)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'jul' },
  // Agosto
  { fecha: '7 Ago', nombre: 'Batalla de Boyacá (Festivo)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'ago' },
  { fecha: '8 Ago', nombre: 'Paulo Londra', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'ago' },
  { fecha: '14-23 Ago', nombre: 'Morat (6 fechas)', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'ago', destacado: true },
  { fecha: '17 Ago', nombre: 'Festivo (Asunción)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'ago' },
  // Septiembre
  { fecha: '5 Sep', nombre: 'Helloween', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'sep' },
  { fecha: '18 Sep', nombre: 'Carlos Vives', lugar: 'Néctar Arena', ciudad: 'Ibagué', categoria: 'concierto', mes: 'sep' },
  { fecha: '20-26 Sep', nombre: 'Festival de Cine de Bogotá', lugar: 'Varios escenarios', ciudad: 'Bogotá', categoria: 'cultural', mes: 'sep' },
  { fecha: '25-27 Sep', nombre: 'Carlos Vives', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'sep' },
  // Octubre
  { fecha: '2-3 Oct', nombre: 'Tool', lugar: 'Por confirmar', ciudad: 'Bogotá', categoria: 'concierto', mes: 'oct', destacado: true },
  { fecha: '19 Oct', nombre: 'Festivo (Día de la Raza)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'oct' },
  { fecha: '29 Oct', nombre: 'Luis Miguel', lugar: 'Movistar Arena', ciudad: 'Bogotá', categoria: 'concierto', mes: 'oct', destacado: true },
  { fecha: '31 Oct', nombre: 'Halloween', lugar: '', ciudad: 'Nacional', categoria: 'cultural', mes: 'oct' },
  // Noviembre
  { fecha: '2 Nov', nombre: 'Festivo (Todos los Santos)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'nov' },
  { fecha: '16 Nov', nombre: 'Festivo (Independencia de Cartagena)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'nov' },
  // Diciembre
  { fecha: '7-9 Dic', nombre: 'Día de las Velitas / Inmaculada Concepción', lugar: '', ciudad: 'Nacional', categoria: 'cultural', mes: 'dic' },
  { fecha: '25 Dic', nombre: 'Navidad (Festivo)', lugar: '', ciudad: 'Nacional', categoria: 'festivo', mes: 'dic' },
  { fecha: '31 Dic', nombre: 'Año Nuevo', lugar: '', ciudad: 'Nacional', categoria: 'cultural', mes: 'dic' },
];

const categoriaConfig: Record<string, { label: string; color: string; emoji: string }> = {
  todos: { label: 'Todos', color: '#0073FF', emoji: '📅' },
  festivo: { label: 'Festivos', color: '#EF4444', emoji: '🔴' },
  concierto: { label: 'Conciertos', color: '#8B5CF6', emoji: '🎤' },
  festival: { label: 'Festivales', color: '#F59E0B', emoji: '🎪' },
  feria: { label: 'Ferias', color: '#10B981', emoji: '🎡' },
  cultural: { label: 'Cultural', color: '#EC4899', emoji: '🎭' },
  deporte: { label: 'Deportes', color: '#06B6D4', emoji: '⚽' },
};

const meses = [
  { key: 'todos', label: 'Todo el año' },
  { key: 'ene', label: 'Ene' }, { key: 'feb', label: 'Feb' }, { key: 'mar', label: 'Mar' },
  { key: 'abr', label: 'Abr' }, { key: 'may', label: 'May' }, { key: 'jun', label: 'Jun' },
  { key: 'jul', label: 'Jul' }, { key: 'ago', label: 'Ago' }, { key: 'sep', label: 'Sep' },
  { key: 'oct', label: 'Oct' }, { key: 'nov', label: 'Nov' }, { key: 'dic', label: 'Dic' },
];

export default function CalendarioPage() {
  const [catFiltro, setCatFiltro] = useState<Categoria>('todos');
  const [mesFiltro, setMesFiltro] = useState<Mes>('todos');

  const filtrados = eventos.filter(e => {
    if (catFiltro !== 'todos' && e.categoria !== catFiltro) return false;
    if (mesFiltro !== 'todos' && e.mes !== mesFiltro) return false;
    return true;
  });

  // Agrupar por mes
  const mesOrden = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const mesNombres: Record<string, string> = {
    ene: 'Enero', feb: 'Febrero', mar: 'Marzo', abr: 'Abril',
    may: 'Mayo', jun: 'Junio', jul: 'Julio', ago: 'Agosto',
    sep: 'Septiembre', oct: 'Octubre', nov: 'Noviembre', dic: 'Diciembre'
  };

  const agrupados: Record<string, Evento[]> = {};
  filtrados.forEach(e => {
    if (!agrupados[e.mes]) agrupados[e.mes] = [];
    agrupados[e.mes].push(e);
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-dark" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            📅 Calendario Colombia 2026
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Eventos, festivales, conciertos y fechas especiales
          </p>
        </div>
      </section>

      {/* Filtros por categoría */}
      <section className="sticky top-16 z-40 bg-dark/95 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {Object.entries(categoriaConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setCatFiltro(key as Categoria)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  catFiltro === key
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-dark-lighter/50 text-gray-400 hover:text-white hover:bg-dark-lighter'
                }`}
                style={catFiltro === key ? { backgroundColor: cfg.color } : {}}
              >
                <span>{cfg.emoji}</span>
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filtros por mes */}
      <section className="bg-dark border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {meses.map((m) => (
              <button
                key={m.key}
                onClick={() => setMesFiltro(m.key as Mes)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  mesFiltro === m.key
                    ? 'bg-primary text-white'
                    : 'text-gray-500 hover:text-white hover:bg-dark-lighter/50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Leyenda */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          {Object.entries(categoriaConfig).filter(([k]) => k !== 'todos').map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
              {cfg.label}
            </div>
          ))}
        </div>
      </section>

      {/* Eventos */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-400 mb-6">{filtrados.length} eventos encontrados</p>

        {mesOrden.filter(m => agrupados[m]).map(mes => (
          <div key={mes} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-lg text-lg">
                {mesNombres[mes]}
              </span>
              <span className="text-gray-600 text-sm font-normal">{agrupados[mes].length} eventos</span>
            </h2>

            <div className="space-y-3">
              {agrupados[mes].map((evento, i) => {
                const cfg = categoriaConfig[evento.categoria];
                return (
                  <div
                    key={i}
                    className={`group relative flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-dark-lighter/60 ${
                      evento.destacado ? 'bg-dark-lighter/40 border border-gray-700/50' : ''
                    }`}
                  >
                    {/* Línea de color */}
                    <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />

                    {/* Fecha */}
                    <div className="w-24 flex-shrink-0">
                      <span className="text-sm font-bold text-white">{evento.fecha}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-semibold ${evento.destacado ? 'text-lg text-white' : 'text-white/90'}`}>
                          {evento.nombre}
                        </h3>
                        {evento.destacado && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">⭐ Destacado</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        {evento.lugar && <span className="text-gray-400">{evento.lugar}</span>}
                        <span className="text-gray-500">📍 {evento.ciudad}</span>
                      </div>
                    </div>

                    {/* Badge categoría */}
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 hidden sm:block"
                      style={{ backgroundColor: cfg.color + '25', color: cfg.color }}
                    >
                      {cfg.emoji} {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtrados.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">No se encontraron eventos con estos filtros</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center bg-dark-lighter rounded-2xl p-10 border border-gray-800">
          <h2 className="text-2xl font-bold mb-3">¿Tienes un evento?</h2>
          <p className="text-gray-400 mb-6">Publica tu evento en nuestro calendario y llega a miles de personas.</p>
          <a
            href="https://wa.me/573212304589?text=Hola%2C%20quiero%20publicar%20un%20evento%20en%20el%20calendario%20de%20Mi%20Destino%20Tu%20Noche."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark rounded-xl font-semibold transition-colors"
          >
            💬 Contáctanos
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-6">
        <a href="https://www.vamosarayar.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
          Desarrollado por Rayar!
        </a>
      </div>
    </div>
  )
}
