'use client'

import { useState } from 'react'
import { Search, Plus, Edit, Trash2, X, Copy, BarChart3, Tag, Calendar, Users, Ticket, Check } from 'lucide-react'

interface Cupon {
  id: number
  establecimiento_id: number
  establecimiento_nombre: string
  codigo: string
  titulo: string
  descripcion: string
  tipo_descuento: 'porcentaje' | 'monto_fijo' | '2x1' | 'gratis' | 'combo'
  valor_descuento: number | null
  consumo_minimo: number
  aplica_a: string
  descripcion_condiciones: string
  max_usos_total: number | null
  max_usos_por_usuario: number
  usos_actuales: number
  fecha_inicio: string
  fecha_fin: string
  dias_validos: string[]
  activo: boolean
  destacado: boolean
  color_fondo: string
  total_canjes: number
  total_usados: number
}

const establecimientosOptions = [
  { id: 1, nombre: 'Andrés Carne de Res' },
  { id: 2, nombre: 'La Octava' },
  { id: 3, nombre: 'Café Velvet' },
  { id: 4, nombre: 'Theatron' },
  { id: 5, nombre: 'Carmen' },
  { id: 6, nombre: 'El Cielo' },
]

const initialCupones: Cupon[] = [
  { id: 1, establecimiento_id: 1, establecimiento_nombre: 'Andrés Carne de Res', codigo: 'ANDRES20', titulo: '20% de descuento', descripcion: 'Válido en toda la carta de platos principales', tipo_descuento: 'porcentaje', valor_descuento: 20, consumo_minimo: 50000, aplica_a: 'comida', descripcion_condiciones: 'No acumulable con otras ofertas', max_usos_total: 200, max_usos_por_usuario: 1, usos_actuales: 87, fecha_inicio: '2026-01-01', fecha_fin: '2026-03-31', dias_validos: ['lunes','martes','miercoles','jueves','viernes'], activo: true, destacado: true, color_fondo: '#FF6B35', total_canjes: 87, total_usados: 64 },
  { id: 2, establecimiento_id: 1, establecimiento_nombre: 'Andrés Carne de Res', codigo: 'ANDRES2X1', titulo: '2x1 en Cócteles', descripcion: 'Aplica en cócteles de la casa', tipo_descuento: '2x1', valor_descuento: null, consumo_minimo: 0, aplica_a: 'bebidas', descripcion_condiciones: 'Solo jueves a sábado', max_usos_total: 100, max_usos_por_usuario: 1, usos_actuales: 42, fecha_inicio: '2026-01-15', fecha_fin: '2026-02-15', dias_validos: ['jueves','viernes','sabado'], activo: true, destacado: false, color_fondo: '#8B5CF6', total_canjes: 42, total_usados: 35 },
  { id: 3, establecimiento_id: 5, establecimiento_nombre: 'Carmen', codigo: 'CARMEN15', titulo: '$15.000 de descuento', descripcion: 'En consumos superiores a $80.000', tipo_descuento: 'monto_fijo', valor_descuento: 15000, consumo_minimo: 80000, aplica_a: 'todo', descripcion_condiciones: '', max_usos_total: 150, max_usos_por_usuario: 1, usos_actuales: 23, fecha_inicio: '2026-01-01', fecha_fin: '2026-03-15', dias_validos: ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'], activo: true, destacado: true, color_fondo: '#10B981', total_canjes: 23, total_usados: 18 },
  { id: 4, establecimiento_id: 6, establecimiento_nombre: 'El Cielo', codigo: 'CIELOFREE', titulo: 'Postre gratis', descripcion: 'Postre de la casa gratis con cualquier plato principal', tipo_descuento: 'gratis', valor_descuento: null, consumo_minimo: 60000, aplica_a: 'postres', descripcion_condiciones: 'Solo viernes y sábado', max_usos_total: 50, max_usos_por_usuario: 1, usos_actuales: 12, fecha_inicio: '2026-01-20', fecha_fin: '2026-02-10', dias_validos: ['viernes','sabado'], activo: true, destacado: true, color_fondo: '#F59E0B', total_canjes: 12, total_usados: 8 },
]

const TIPO_DESCUENTO_LABELS: Record<string, string> = {
  porcentaje: '% Descuento',
  monto_fijo: '$ Fijo',
  '2x1': '2x1',
  gratis: 'Gratis',
  combo: 'Combo',
}

const DIAS_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const DIAS_LABELS: Record<string, string> = { lunes: 'Lun', martes: 'Mar', miercoles: 'Mié', jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom' }

function formatDescuento(cupon: Cupon): string {
  switch (cupon.tipo_descuento) {
    case 'porcentaje': return `${cupon.valor_descuento}%`
    case 'monto_fijo': return `$${(cupon.valor_descuento || 0).toLocaleString()}`
    case '2x1': return '2×1'
    case 'gratis': return 'GRATIS'
    case 'combo': return 'COMBO'
    default: return ''
  }
}

function daysRemaining(fechaFin: string): number {
  return Math.ceil((new Date(fechaFin).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function CuponPreview({ cupon }: { cupon: Partial<Cupon> }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-700" style={{ background: `linear-gradient(135deg, ${cupon.color_fondo || '#FF6B35'}22, ${cupon.color_fondo || '#FF6B35'}08)` }}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl font-black" style={{ color: cupon.color_fondo || '#FF6B35' }}>
              {cupon.tipo_descuento === 'porcentaje' && `${cupon.valor_descuento || 0}% OFF`}
              {cupon.tipo_descuento === 'monto_fijo' && `$${(cupon.valor_descuento || 0).toLocaleString()} OFF`}
              {cupon.tipo_descuento === '2x1' && '2×1'}
              {cupon.tipo_descuento === 'gratis' && 'GRATIS'}
              {cupon.tipo_descuento === 'combo' && 'COMBO'}
            </div>
            <p className="font-semibold text-white mt-1">{cupon.titulo || 'Título del cupón'}</p>
            <p className="text-sm text-gray-400 mt-1">{cupon.descripcion || 'Descripción del cupón'}</p>
          </div>
          <div className="bg-dark px-3 py-1.5 rounded-lg border border-gray-700">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Código</p>
            <p className="font-mono font-bold text-sm" style={{ color: cupon.color_fondo || '#FF6B35' }}>{cupon.codigo || 'CODIGO'}</p>
          </div>
        </div>
        {(cupon.consumo_minimo || 0) > 0 && (
          <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-800">
            Consumo mínimo: ${(cupon.consumo_minimo || 0).toLocaleString()} COP
          </p>
        )}
      </div>
    </div>
  )
}

export default function CuponesPage() {
  const [data, setData] = useState<Cupon[]>(initialCupones)
  const [search, setSearch] = useState('')
  const [estFilter, setEstFilter] = useState('Todos')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [showStats, setShowStats] = useState<number | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Form state
  const [fEstId, setFEstId] = useState(1)
  const [fCodigo, setFCodigo] = useState('')
  const [fTitulo, setFTitulo] = useState('')
  const [fDescripcion, setFDescripcion] = useState('')
  const [fTipoDesc, setFTipoDesc] = useState<string>('porcentaje')
  const [fValorDesc, setFValorDesc] = useState('')
  const [fConsumoMin, setFConsumoMin] = useState('')
  const [fAplicaA, setFAplicaA] = useState('todo')
  const [fCondiciones, setFCondiciones] = useState('')
  const [fMaxTotal, setFMaxTotal] = useState('')
  const [fMaxUsuario, setFMaxUsuario] = useState('1')
  const [fFechaInicio, setFFechaInicio] = useState(new Date().toISOString().split('T')[0])
  const [fFechaFin, setFFechaFin] = useState('')
  const [fDias, setFDias] = useState<string[]>(DIAS_SEMANA)
  const [fActivo, setFActivo] = useState(true)
  const [fDestacado, setFDestacado] = useState(false)
  const [fColor, setFColor] = useState('#FF6B35')

  const filteredData = data.filter(c => {
    const matchSearch = c.titulo.toLowerCase().includes(search.toLowerCase()) || c.codigo.toLowerCase().includes(search.toLowerCase())
    const matchEst = estFilter === 'Todos' || c.establecimiento_nombre === estFilter
    return matchSearch && matchEst
  })

  const totalCanjes = data.reduce((acc, c) => acc + c.total_canjes, 0)
  const cuponesActivos = data.filter(c => c.activo).length

  const resetForm = () => {
    setFEstId(1); setFCodigo(''); setFTitulo(''); setFDescripcion(''); setFTipoDesc('porcentaje')
    setFValorDesc(''); setFConsumoMin(''); setFAplicaA('todo'); setFCondiciones(''); setFMaxTotal('')
    setFMaxUsuario('1'); setFFechaInicio(new Date().toISOString().split('T')[0]); setFFechaFin('')
    setFDias(DIAS_SEMANA); setFActivo(true); setFDestacado(false); setFColor('#FF6B35')
  }

  const openNew = () => { setEditingId(null); resetForm(); setShowModal(true) }

  const openEdit = (cupon: Cupon) => {
    setEditingId(cupon.id); setFEstId(cupon.establecimiento_id); setFCodigo(cupon.codigo)
    setFTitulo(cupon.titulo); setFDescripcion(cupon.descripcion); setFTipoDesc(cupon.tipo_descuento)
    setFValorDesc(cupon.valor_descuento?.toString() || ''); setFConsumoMin(cupon.consumo_minimo?.toString() || '')
    setFAplicaA(cupon.aplica_a); setFCondiciones(cupon.descripcion_condiciones)
    setFMaxTotal(cupon.max_usos_total?.toString() || ''); setFMaxUsuario(cupon.max_usos_por_usuario.toString())
    setFFechaInicio(cupon.fecha_inicio); setFFechaFin(cupon.fecha_fin); setFDias(cupon.dias_validos)
    setFActivo(cupon.activo); setFDestacado(cupon.destacado); setFColor(cupon.color_fondo)
    setShowModal(true)
  }

  const handleSave = () => {
    if (!fCodigo.trim() || !fTitulo.trim() || !fFechaFin) return
    const estNombre = establecimientosOptions.find(e => e.id === fEstId)?.nombre || ''
    
    if (editingId) {
      setData(prev => prev.map(c => c.id === editingId ? { ...c, establecimiento_id: fEstId, establecimiento_nombre: estNombre, codigo: fCodigo.toUpperCase(), titulo: fTitulo, descripcion: fDescripcion, tipo_descuento: fTipoDesc as any, valor_descuento: fValorDesc ? parseFloat(fValorDesc) : null, consumo_minimo: parseFloat(fConsumoMin) || 0, aplica_a: fAplicaA, descripcion_condiciones: fCondiciones, max_usos_total: fMaxTotal ? parseInt(fMaxTotal) : null, max_usos_por_usuario: parseInt(fMaxUsuario) || 1, fecha_inicio: fFechaInicio, fecha_fin: fFechaFin, dias_validos: fDias, activo: fActivo, destacado: fDestacado, color_fondo: fColor } : c))
    } else {
      setData(prev => [...prev, { id: Date.now(), establecimiento_id: fEstId, establecimiento_nombre: estNombre, codigo: fCodigo.toUpperCase(), titulo: fTitulo, descripcion: fDescripcion, tipo_descuento: fTipoDesc as any, valor_descuento: fValorDesc ? parseFloat(fValorDesc) : null, consumo_minimo: parseFloat(fConsumoMin) || 0, aplica_a: fAplicaA, descripcion_condiciones: fCondiciones, max_usos_total: fMaxTotal ? parseInt(fMaxTotal) : null, max_usos_por_usuario: parseInt(fMaxUsuario) || 1, usos_actuales: 0, fecha_inicio: fFechaInicio, fecha_fin: fFechaFin, dias_validos: fDias, activo: fActivo, destacado: fDestacado, color_fondo: fColor, total_canjes: 0, total_usados: 0 }])
    }
    setSaveSuccess(true); setTimeout(() => { setSaveSuccess(false); setShowModal(false) }, 1000)
  }

  const handleDelete = (id: number) => { setData(prev => prev.filter(c => c.id !== id)); setShowDeleteConfirm(null) }

  const copyCode = (code: string) => { navigator.clipboard?.writeText(code); setCopiedCode(code); setTimeout(() => setCopiedCode(null), 2000) }

  const toggleDia = (dia: string) => {
    setFDias(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cupones</h1>
          <p className="text-gray-400">Crea y gestiona cupones de descuento para los establecimientos</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Nuevo Cupón</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center"><Ticket className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold">{data.length}</p><p className="text-xs text-gray-500">Total cupones</p></div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center"><Check className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold">{cuponesActivos}</p><p className="text-xs text-gray-500">Activos</p></div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center"><Users className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold">{totalCanjes}</p><p className="text-xs text-gray-500">Canjes totales</p></div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center"><BarChart3 className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold">{totalCanjes > 0 ? Math.round((data.reduce((a, c) => a + c.total_usados, 0) / totalCanjes) * 100) : 0}%</p><p className="text-xs text-gray-500">Tasa de uso</p></div>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" className="input pl-10" placeholder="Buscar por título o código..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input w-auto" value={estFilter} onChange={(e) => setEstFilter(e.target.value)}>
            <option value="Todos">Todos los establecimientos</option>
            {establecimientosOptions.map(e => <option key={e.id} value={e.nombre}>{e.nombre}</option>)}
          </select>
        </div>
      </div>

      {/* Cupones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredData.map((cupon) => {
          const days = daysRemaining(cupon.fecha_fin)
          const usagePercent = cupon.max_usos_total ? (cupon.usos_actuales / cupon.max_usos_total) * 100 : 0
          const isExpired = days < 0
          
          return (
            <div key={cupon.id} className={`card relative overflow-hidden ${!cupon.activo || isExpired ? 'opacity-60' : ''}`}>
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: cupon.color_fondo }} />
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black" style={{ backgroundColor: cupon.color_fondo + '20', color: cupon.color_fondo }}>
                    {formatDescuento(cupon)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{cupon.titulo}</h3>
                    <p className="text-sm text-gray-500">{cupon.establecimiento_nombre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {cupon.destacado && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">⭐</span>}
                  {!cupon.activo && <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Inactivo</span>}
                  {isExpired && <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Expirado</span>}
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-3">{cupon.descripcion}</p>

              {/* Code */}
              <div className="flex items-center gap-2 mb-3">
                <code className="bg-dark px-3 py-1.5 rounded-lg font-mono text-sm font-bold tracking-wider" style={{ color: cupon.color_fondo }}>{cupon.codigo}</code>
                <button onClick={() => copyCode(cupon.codigo)} className="p-1.5 hover:bg-dark rounded-lg transition-colors" title="Copiar código">
                  {copiedCode === cupon.codigo ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>

              {/* Usage bar */}
              {cupon.max_usos_total && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{cupon.usos_actuales} / {cupon.max_usos_total} canjes</span>
                    <span>{Math.round(usagePercent)}%</span>
                  </div>
                  <div className="h-1.5 bg-dark rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${usagePercent}%`, backgroundColor: cupon.color_fondo }} />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {days > 0 ? `${days}d restantes` : 'Expirado'}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {cupon.total_usados} usados</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowStats(cupon.id)} className="p-1.5 hover:bg-dark rounded-lg" title="Estadísticas"><BarChart3 className="w-4 h-4 text-gray-400" /></button>
                  <button onClick={() => openEdit(cupon)} className="p-1.5 hover:bg-dark rounded-lg" title="Editar"><Edit className="w-4 h-4 text-gray-400" /></button>
                  <button onClick={() => setShowDeleteConfirm(cupon.id)} className="p-1.5 hover:bg-dark rounded-lg" title="Eliminar"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="card text-center py-12">
          <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay cupones creados aún</p>
          <button onClick={openNew} className="btn-primary mt-4">Crear primer cupón</button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Nuevo'} Cupón</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Form */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Establecimiento *</label>
                      <select className="input" value={fEstId} onChange={(e) => setFEstId(parseInt(e.target.value))}>
                        {establecimientosOptions.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Código único *</label>
                      <input type="text" className="input uppercase font-mono" placeholder="EJ: REST20OFF" value={fCodigo} onChange={(e) => setFCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} maxLength={20} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Título del cupón *</label>
                    <input type="text" className="input" placeholder="Ej: 20% de descuento en toda la carta" value={fTitulo} onChange={(e) => setFTitulo(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Descripción</label>
                    <textarea className="input min-h-[80px]" placeholder="Detalles del cupón..." value={fDescripcion} onChange={(e) => setFDescripcion(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Tipo de descuento *</label>
                      <select className="input" value={fTipoDesc} onChange={(e) => setFTipoDesc(e.target.value)}>
                        <option value="porcentaje">% Porcentaje</option>
                        <option value="monto_fijo">$ Monto fijo</option>
                        <option value="2x1">2×1</option>
                        <option value="gratis">Producto gratis</option>
                        <option value="combo">Combo especial</option>
                      </select>
                    </div>
                    {(fTipoDesc === 'porcentaje' || fTipoDesc === 'monto_fijo') && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">{fTipoDesc === 'porcentaje' ? 'Porcentaje (%)' : 'Monto (COP)'}</label>
                        <input type="number" className="input" placeholder={fTipoDesc === 'porcentaje' ? '20' : '15000'} value={fValorDesc} onChange={(e) => setFValorDesc(e.target.value)} />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Consumo mínimo (COP)</label>
                      <input type="number" className="input" placeholder="0" value={fConsumoMin} onChange={(e) => setFConsumoMin(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Aplica a</label>
                      <select className="input" value={fAplicaA} onChange={(e) => setFAplicaA(e.target.value)}>
                        <option value="todo">Todo el menú</option>
                        <option value="comida">Solo comida</option>
                        <option value="bebidas">Solo bebidas</option>
                        <option value="postres">Solo postres</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Condiciones adicionales</label>
                      <input type="text" className="input" placeholder="No acumulable con otras ofertas" value={fCondiciones} onChange={(e) => setFCondiciones(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Máx usos totales</label>
                      <input type="number" className="input" placeholder="Sin límite" value={fMaxTotal} onChange={(e) => setFMaxTotal(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Máx usos por usuario</label>
                      <input type="number" className="input" placeholder="1" value={fMaxUsuario} onChange={(e) => setFMaxUsuario(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Fecha inicio *</label>
                      <input type="date" className="input" value={fFechaInicio} onChange={(e) => setFFechaInicio(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Fecha fin *</label>
                      <input type="date" className="input" value={fFechaFin} onChange={(e) => setFFechaFin(e.target.value)} />
                    </div>
                  </div>

                  {/* Days selector */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Días válidos</label>
                    <div className="flex flex-wrap gap-2">
                      {DIAS_SEMANA.map(dia => (
                        <button key={dia} type="button" onClick={() => toggleDia(dia)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${fDias.includes(dia) ? 'bg-primary text-white' : 'bg-dark text-gray-500 hover:text-white'}`}>
                          {DIAS_LABELS[dia]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Color del cupón</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={fColor} onChange={(e) => setFColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                        <div className="flex gap-1.5">
                          {['#FF6B35', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'].map(c => (
                            <button key={c} type="button" onClick={() => setFColor(c)} className={`w-7 h-7 rounded-full border-2 transition-all ${fColor === c ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer self-end pb-1"><input type="checkbox" className="w-4 h-4 accent-primary" checked={fActivo} onChange={(e) => setFActivo(e.target.checked)} /><span className="text-sm">Activo</span></label>
                    <label className="flex items-center gap-2 cursor-pointer self-end pb-1"><input type="checkbox" className="w-4 h-4 accent-primary" checked={fDestacado} onChange={(e) => setFDestacado(e.target.checked)} /><span className="text-sm">Destacado</span></label>
                  </div>
                </div>

                {/* Right: Preview */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-400">Vista previa</h3>
                  <CuponPreview cupon={{ codigo: fCodigo, titulo: fTitulo, descripcion: fDescripcion, tipo_descuento: fTipoDesc as any, valor_descuento: fValorDesc ? parseFloat(fValorDesc) : null, consumo_minimo: fConsumoMin ? parseFloat(fConsumoMin) : 0, color_fondo: fColor }} />
                  <div className="bg-dark rounded-xl p-3">
                    <p className="text-xs text-gray-500">El cupón aparecerá en la página del establecimiento y, si es destacado, también en la sección de cupones del home.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center gap-3 p-6 border-t border-gray-800 shrink-0">
              <div>{saveSuccess && <span className="text-green-400 text-sm">✅ Guardado</span>}</div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">Cancelar</button>
                <button onClick={handleSave} className="btn-primary">{editingId ? 'Guardar' : 'Crear Cupón'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStats !== null && (() => {
        const cupon = data.find(c => c.id === showStats)
        if (!cupon) return null
        return (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-dark-lighter rounded-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-lg font-bold">📊 Estadísticas: {cupon.codigo}</h2>
                <button onClick={() => setShowStats(null)} className="p-2 hover:bg-dark rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <CuponPreview cupon={cupon} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-dark rounded-xl p-4 text-center"><p className="text-2xl font-bold">{cupon.total_canjes}</p><p className="text-xs text-gray-500">Canjes totales</p></div>
                  <div className="bg-dark rounded-xl p-4 text-center"><p className="text-2xl font-bold">{cupon.total_usados}</p><p className="text-xs text-gray-500">Usados en local</p></div>
                  <div className="bg-dark rounded-xl p-4 text-center"><p className="text-2xl font-bold">{cupon.total_canjes > 0 ? Math.round((cupon.total_usados / cupon.total_canjes) * 100) : 0}%</p><p className="text-xs text-gray-500">Tasa de uso</p></div>
                  <div className="bg-dark rounded-xl p-4 text-center"><p className="text-2xl font-bold">{cupon.max_usos_total ? cupon.max_usos_total - cupon.usos_actuales : '∞'}</p><p className="text-xs text-gray-500">Restantes</p></div>
                </div>
                <div className="bg-dark rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">Progreso de uso</p>
                  {cupon.max_usos_total ? (
                    <>
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(cupon.usos_actuales / cupon.max_usos_total) * 100}%`, backgroundColor: cupon.color_fondo }} /></div>
                      <p className="text-xs text-gray-500 mt-1">{cupon.usos_actuales} de {cupon.max_usos_total} ({Math.round((cupon.usos_actuales / cupon.max_usos_total) * 100)}%)</p>
                    </>
                  ) : <p className="text-sm text-gray-500">Sin límite de usos</p>}
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Delete Confirm */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">¿Eliminar cupón?</h3>
            <p className="text-gray-400 text-sm mb-6">Se eliminarán todos los datos de canjes asociados.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">Cancelar</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
