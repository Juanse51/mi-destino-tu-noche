'use client'

import { useState, useRef } from 'react'
import { Search, Plus, Edit, Trash2, Eye, Filter, X, Upload, ImagePlus, Camera } from 'lucide-react'

interface FotoGaleria {
  id: string
  url: string
  url_thumbnail: string
  titulo: string
  orden: number
  es_principal: boolean
}

interface Establecimiento {
  id: number
  nombre: string
  slug: string
  ciudad: string
  tipo: string
  valoracion: number
  estado: string
  verificado: boolean
  destacado: boolean
  imagen: string
  logo_url: string | null
  galeria: FotoGaleria[]
}

const initialEstablecimientos: Establecimiento[] = [
  { id: 1, nombre: 'Andrés Carne de Res', slug: 'andres-carne-de-res', ciudad: 'Bogotá', tipo: 'Restaurante', valoracion: 4.8, estado: 'activo', verificado: true, destacado: true, imagen: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100', logo_url: null, galeria: [
    { id: 'f1', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', url_thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200', titulo: 'Interior', orden: 0, es_principal: true },
    { id: 'f2', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', url_thumbnail: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200', titulo: 'Plato', orden: 1, es_principal: false },
  ]},
  { id: 2, nombre: 'La Octava', slug: 'la-octava', ciudad: 'Cali', tipo: 'Bar', valoracion: 4.6, estado: 'activo', verificado: true, destacado: false, imagen: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100', logo_url: null, galeria: [] },
  { id: 3, nombre: 'Café Velvet', slug: 'cafe-velvet', ciudad: 'Armenia', tipo: 'Café', valoracion: 4.7, estado: 'activo', verificado: false, destacado: false, imagen: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100', logo_url: null, galeria: [] },
  { id: 4, nombre: 'Theatron', slug: 'theatron', ciudad: 'Bogotá', tipo: 'Discoteca', valoracion: 4.5, estado: 'pendiente', verificado: false, destacado: false, imagen: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=100', logo_url: null, galeria: [] },
  { id: 5, nombre: 'Carmen', slug: 'carmen', ciudad: 'Medellín', tipo: 'Restaurante', valoracion: 4.9, estado: 'activo', verificado: true, destacado: true, imagen: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100', logo_url: null, galeria: [] },
  { id: 6, nombre: 'El Cielo', slug: 'el-cielo', ciudad: 'Bogotá', tipo: 'Restaurante', valoracion: 4.9, estado: 'activo', verificado: true, destacado: true, imagen: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100', logo_url: null, galeria: [] },
]

const tipos = ['Todos', 'Restaurante', 'Bar', 'Café', 'Discoteca']
const ciudades = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Armenia']
const estados = ['Todos', 'activo', 'pendiente', 'inactivo']

function ImageUploader({ label, currentUrl, onUpload, onRemove, shape = 'rect', hint }: { label: string; currentUrl: string | null; onUpload: (file: File) => void; onRemove: () => void; shape?: 'rect' | 'circle'; hint?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    onUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      {label && <label className="block text-sm text-gray-400 mb-2">{label}</label>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {preview ? (
        <div className="relative group">
          <div className={`overflow-hidden border-2 border-gray-700 ${shape === 'circle' ? 'w-32 h-32 rounded-full mx-auto' : 'w-full h-48 rounded-xl'}`}>
            <img src={preview} alt={label} className="w-full h-full object-cover" />
          </div>
          <div className={`absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 ${shape === 'circle' ? 'rounded-full' : 'rounded-xl'}`}>
            <button type="button" onClick={() => inputRef.current?.click()} className="p-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors" title="Cambiar"><Camera className="w-5 h-5" /></button>
            <button type="button" onClick={() => { setPreview(null); onRemove() }} className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors" title="Eliminar"><Trash2 className="w-5 h-5" /></button>
          </div>
        </div>
      ) : (
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 ${dragOver ? 'border-primary bg-primary/10' : 'border-gray-700 hover:border-gray-500'} ${shape === 'circle' ? 'w-32 h-32 rounded-full mx-auto' : 'w-full h-48 rounded-xl'}`}>
          <Upload className="w-6 h-6 text-gray-500" />
          <span className="text-xs text-gray-500 text-center px-2">{hint || 'Arrastra o haz clic'}</span>
        </div>
      )}
    </div>
  )
}

function GalleryManager({ fotos, onChange }: { fotos: FotoGaleria[]; onChange: (fotos: FotoGaleria[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const addPhotos = (files: FileList) => {
    const newFotos: FotoGaleria[] = []
    Array.from(files).forEach((file, i) => {
      if (!file.type.startsWith('image/')) return
      const url = URL.createObjectURL(file)
      newFotos.push({ id: `new_${Date.now()}_${i}`, url, url_thumbnail: url, titulo: file.name.replace(/\.[^/.]+$/, ''), orden: fotos.length + i, es_principal: fotos.length === 0 && i === 0 })
    })
    onChange([...fotos, ...newFotos])
  }

  const removePhoto = (id: string) => {
    const updated = fotos.filter(f => f.id !== id)
    if (updated.length > 0 && !updated.some(f => f.es_principal)) updated[0].es_principal = true
    onChange(updated)
  }

  const setPrincipal = (id: string) => onChange(fotos.map(f => ({ ...f, es_principal: f.id === id })))

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length > 0) addPhotos(e.dataTransfer.files) }

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">Galería de Fotos <span className="text-gray-600">({fotos.length}/20)</span></label>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && addPhotos(e.target.files)} />
      {fotos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
          {fotos.map((foto) => (
            <div key={foto.id} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-700">
              <img src={foto.url_thumbnail || foto.url} alt={foto.titulo} className="w-full h-full object-cover" />
              {foto.es_principal && <div className="absolute top-1.5 left-1.5 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PRINCIPAL</div>}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {!foto.es_principal && <button type="button" onClick={() => setPrincipal(foto.id)} className="p-1.5 bg-blue-500 rounded-lg hover:bg-blue-600" title="Hacer principal"><Eye className="w-3.5 h-3.5" /></button>}
                <button type="button" onClick={() => removePhoto(foto.id)} className="p-1.5 bg-red-500 rounded-lg hover:bg-red-600" title="Eliminar"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-3 py-6 ${dragOver ? 'border-primary bg-primary/10' : 'border-gray-700 hover:border-gray-500'}`}>
        <ImagePlus className="w-6 h-6 text-gray-500" />
        <div className="text-center">
          <span className="text-sm text-gray-400">Arrastra fotos aquí o haz clic para seleccionar</span>
          <p className="text-xs text-gray-600 mt-1">JPG, PNG, WebP • Máx 10MB c/u • Hasta 20 fotos</p>
        </div>
      </div>
    </div>
  )
}

export default function EstablecimientosPage() {
  const [data, setData] = useState<Establecimiento[]>(initialEstablecimientos)
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState('Todos')
  const [ciudadFilter, setCiudadFilter] = useState('Todas')
  const [estadoFilter, setEstadoFilter] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [activeModalTab, setActiveModalTab] = useState<'info' | 'media'>('info')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [formNombre, setFormNombre] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formTipo, setFormTipo] = useState('Restaurante')
  const [formCiudad, setFormCiudad] = useState('Bogotá')
  const [formDireccion, setFormDireccion] = useState('')
  const [formDescripcion, setFormDescripcion] = useState('')
  const [formTelefono, setFormTelefono] = useState('')
  const [formWhatsapp, setFormWhatsapp] = useState('')
  const [formInstagram, setFormInstagram] = useState('')
  const [formActivo, setFormActivo] = useState(true)
  const [formVerificado, setFormVerificado] = useState(false)
  const [formDestacado, setFormDestacado] = useState(false)
  const [formLogo, setFormLogo] = useState<string | null>(null)
  const [formGaleria, setFormGaleria] = useState<FotoGaleria[]>([])

  const filteredData = data.filter(est => {
    const matchSearch = est.nombre.toLowerCase().includes(search.toLowerCase())
    const matchTipo = tipoFilter === 'Todos' || est.tipo === tipoFilter
    const matchCiudad = ciudadFilter === 'Todas' || est.ciudad === ciudadFilter
    const matchEstado = estadoFilter === 'Todos' || est.estado === estadoFilter
    return matchSearch && matchTipo && matchCiudad && matchEstado
  })

  const generateSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const openNew = () => {
    setEditingId(null); setFormNombre(''); setFormSlug(''); setFormTipo('Restaurante'); setFormCiudad('Bogotá')
    setFormDireccion(''); setFormDescripcion(''); setFormTelefono(''); setFormWhatsapp(''); setFormInstagram('')
    setFormActivo(true); setFormVerificado(false); setFormDestacado(false); setFormLogo(null); setFormGaleria([])
    setActiveModalTab('info'); setShowModal(true)
  }

  const openEdit = (est: Establecimiento) => {
    setEditingId(est.id); setFormNombre(est.nombre); setFormSlug(est.slug); setFormTipo(est.tipo); setFormCiudad(est.ciudad)
    setFormDireccion(''); setFormDescripcion(''); setFormTelefono(''); setFormWhatsapp(''); setFormInstagram('')
    setFormActivo(est.estado === 'activo'); setFormVerificado(est.verificado); setFormDestacado(est.destacado)
    setFormLogo(est.logo_url); setFormGaleria(est.galeria); setActiveModalTab('info'); setShowModal(true)
  }

  const handleSave = () => {
    if (!formNombre.trim()) return
    const slug = formSlug || generateSlug(formNombre)
    if (editingId) {
      setData(prev => prev.map(est => est.id === editingId ? { ...est, nombre: formNombre, slug, tipo: formTipo, ciudad: formCiudad, estado: formActivo ? 'activo' : 'inactivo', verificado: formVerificado, destacado: formDestacado, logo_url: formLogo, galeria: formGaleria, imagen: formGaleria.find(f => f.es_principal)?.url_thumbnail || est.imagen } : est))
    } else {
      setData(prev => [...prev, { id: Date.now(), nombre: formNombre, slug, ciudad: formCiudad, tipo: formTipo, valoracion: 0, estado: formActivo ? 'activo' : 'pendiente', verificado: formVerificado, destacado: formDestacado, imagen: formGaleria[0]?.url_thumbnail || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100', logo_url: formLogo, galeria: formGaleria }])
    }
    setSaveSuccess(true); setTimeout(() => { setSaveSuccess(false); setShowModal(false) }, 1200)
  }

  const handleDelete = (id: number) => { setData(prev => prev.filter(est => est.id !== id)); setShowDeleteConfirm(null) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Establecimientos</h1>
          <p className="text-gray-400">Gestiona los establecimientos de la plataforma</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Nuevo</button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" className="input pl-10" placeholder="Buscar establecimientos..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters ? 'border-primary text-primary' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}>
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-800">
            <div><label className="block text-sm text-gray-400 mb-2">Tipo</label><select className="input" value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>{tipos.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="block text-sm text-gray-400 mb-2">Ciudad</label><select className="input" value={ciudadFilter} onChange={(e) => setCiudadFilter(e.target.value)}>{ciudades.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm text-gray-400 mb-2">Estado</label><select className="input" value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>{estados.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
          </div>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
              <th className="pb-3 font-medium">Establecimiento</th>
              <th className="pb-3 font-medium">Ciudad</th>
              <th className="pb-3 font-medium">Tipo</th>
              <th className="pb-3 font-medium">Fotos</th>
              <th className="pb-3 font-medium">Valoración</th>
              <th className="pb-3 font-medium">Estado</th>
              <th className="pb-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((est) => (
              <tr key={est.id} className="border-b border-gray-800/50 hover:bg-dark/50">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={est.imagen} alt={est.nombre} className="w-10 h-10 rounded-lg object-cover" />
                      {est.logo_url && <img src={est.logo_url} alt="logo" className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-dark-lighter object-cover" />}
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {est.nombre}
                        {est.verificado && <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">✓</span>}
                        {est.destacado && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">⭐</span>}
                      </p>
                      <p className="text-sm text-gray-500">/{est.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-gray-300">{est.ciudad}</td>
                <td className="py-4 text-gray-300">{est.tipo}</td>
                <td className="py-4"><span className={`text-sm ${est.galeria.length > 0 ? 'text-green-400' : 'text-gray-600'}`}>📷 {est.galeria.length}</span></td>
                <td className="py-4"><span className="flex items-center gap-1"><span className="text-yellow-400">⭐</span>{est.valoracion}</span></td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${est.estado === 'activo' ? 'bg-green-500/20 text-green-400' : est.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{est.estado}</span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { openEdit(est); setActiveModalTab('media') }} className="p-2 hover:bg-dark rounded-lg" title="Fotos"><ImagePlus className="w-4 h-4 text-blue-400" /></button>
                    <button onClick={() => openEdit(est)} className="p-2 hover:bg-dark rounded-lg" title="Editar"><Edit className="w-4 h-4 text-gray-400" /></button>
                    <button onClick={() => setShowDeleteConfirm(est.id)} className="p-2 hover:bg-dark rounded-lg" title="Eliminar"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && <div className="text-center py-12"><p className="text-gray-400">No se encontraron establecimientos</p></div>}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Nuevo'} Establecimiento</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex border-b border-gray-800 shrink-0">
              <button onClick={() => setActiveModalTab('info')} className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeModalTab === 'info' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-white'}`}>📋 Información General</button>
              <button onClick={() => setActiveModalTab('media')} className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeModalTab === 'media' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-white'}`}>📷 Logo y Fotos</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {activeModalTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm text-gray-400 mb-2">Nombre *</label><input type="text" className="input" placeholder="Nombre del establecimiento" value={formNombre} onChange={(e) => { setFormNombre(e.target.value); if (!editingId) setFormSlug(generateSlug(e.target.value)) }} /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Slug</label><input type="text" className="input" placeholder="nombre-del-establecimiento" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm text-gray-400 mb-2">Tipo *</label><select className="input" value={formTipo} onChange={(e) => setFormTipo(e.target.value)}><option>Restaurante</option><option>Bar</option><option>Café</option><option>Discoteca</option></select></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Ciudad *</label><select className="input" value={formCiudad} onChange={(e) => setFormCiudad(e.target.value)}><option>Bogotá</option><option>Medellín</option><option>Cali</option><option>Cartagena</option><option>Armenia</option></select></div>
                  </div>
                  <div><label className="block text-sm text-gray-400 mb-2">Dirección *</label><input type="text" className="input" placeholder="Dirección completa" value={formDireccion} onChange={(e) => setFormDireccion(e.target.value)} /></div>
                  <div><label className="block text-sm text-gray-400 mb-2">Descripción</label><textarea className="input min-h-[100px]" placeholder="Descripción del establecimiento" value={formDescripcion} onChange={(e) => setFormDescripcion(e.target.value)} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><label className="block text-sm text-gray-400 mb-2">Teléfono</label><input type="text" className="input" placeholder="+57 300 123 4567" value={formTelefono} onChange={(e) => setFormTelefono(e.target.value)} /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">WhatsApp</label><input type="text" className="input" placeholder="573001234567" value={formWhatsapp} onChange={(e) => setFormWhatsapp(e.target.value)} /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Instagram</label><input type="text" className="input" placeholder="@usuario" value={formInstagram} onChange={(e) => setFormInstagram(e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-primary" checked={formActivo} onChange={(e) => setFormActivo(e.target.checked)} /><span className="text-sm">Activo</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-primary" checked={formVerificado} onChange={(e) => setFormVerificado(e.target.checked)} /><span className="text-sm">Verificado</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-primary" checked={formDestacado} onChange={(e) => setFormDestacado(e.target.checked)} /><span className="text-sm">Destacado</span></label>
                  </div>
                </div>
              )}
              {activeModalTab === 'media' && (
                <div className="space-y-8">
                  <div className="bg-dark rounded-xl p-5">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm">🏷️</span>Logo del Restaurante</h3>
                    <p className="text-sm text-gray-500 mb-4">Se muestra como icono junto al nombre. Recomendado: cuadrado, mín 200×200px.</p>
                    <ImageUploader label="" currentUrl={formLogo} onUpload={(file) => { const r = new FileReader(); r.onload = (e) => setFormLogo(e.target?.result as string); r.readAsDataURL(file) }} onRemove={() => setFormLogo(null)} shape="circle" hint="Logo (PNG, JPG)" />
                  </div>
                  <div className="bg-dark rounded-xl p-5">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><span className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center text-sm">🖼️</span>Galería de Fotos</h3>
                    <p className="text-sm text-gray-500 mb-4">Sube fotos del lugar, comida, ambiente, etc. La primera será la imagen principal visible en listados.</p>
                    <GalleryManager fotos={formGaleria} onChange={setFormGaleria} />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center gap-3 p-6 border-t border-gray-800 shrink-0">
              <div>{saveSuccess && <span className="text-green-400 text-sm flex items-center gap-1">✅ Guardado correctamente</span>}</div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-dark">Cancelar</button>
                <button type="button" onClick={handleSave} className="btn-primary">{editingId ? 'Guardar Cambios' : 'Crear Establecimiento'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-lighter rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">¿Eliminar establecimiento?</h3>
            <p className="text-gray-400 text-sm mb-6">Esta acción no se puede deshacer. Se eliminarán todas las fotos, valoraciones y datos asociados.</p>
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
