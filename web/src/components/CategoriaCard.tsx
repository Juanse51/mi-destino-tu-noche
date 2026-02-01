import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Categoria {
  nombre: string
  slug: string
  icono: string
  color: string
  descripcion: string
  total: number
}

export default function CategoriaCard({ categoria }: { categoria: Categoria }) {
  const { nombre, slug, icono, color, descripcion, total } = categoria

  return (
    <Link href={`/categoria/${slug}`} className="group">
      <div 
        className="relative p-6 rounded-2xl overflow-hidden card-hover h-full"
        style={{ backgroundColor: `${color}15` }}
      >
        {/* Background decoration */}
        <div 
          className="absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity"
          style={{ color }}
        >
          {icono}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <span className="text-4xl mb-4 block">{icono}</span>
          <h3 
            className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform"
            style={{ color }}
          >
            {nombre}
          </h3>
          <p className="text-gray-400 text-sm mb-4">{descripcion}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{total} lugares</span>
            <ChevronRight 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
              style={{ color }} 
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
