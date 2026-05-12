import Link from 'next/link'
import { ChevronRight, LucideIcon } from 'lucide-react'

interface Categoria {
  href?: string
  nombre: string
  slug: string
  icono?: string
  IconoComponente?: LucideIcon
  color: string
  descripcion: string
  total: number
  logo?: string
}

export default function CategoriaCard({ categoria }: { categoria: Categoria }) {
  const { nombre, slug, icono, IconoComponente, color, descripcion, total, logo, href } = categoria

  return (
    <Link href={href || `/categoria/${slug}`} className="group">
      <div
        className="relative p-6 rounded-2xl overflow-hidden card-hover h-full"
        style={{ backgroundColor: `${color}15` }}
      >
        <div
          className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity"
          style={{ color }}
        >
          {IconoComponente
            ? <IconoComponente className="w-32 h-32" />
            : <span className="text-8xl">{icono || '⭐'}</span>
          }
        </div>

        <div className="relative z-10">
          {logo ? (
            <div className="w-16 h-16 mb-4 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img src={logo} alt={nombre} className="w-14 h-14 object-contain" />
            </div>
          ) : IconoComponente ? (
            <div className="mb-4">
              <IconoComponente className="w-9 h-9" style={{ color }} />
            </div>
          ) : (
            <span className="text-4xl mb-4 block">{icono}</span>
          )}

          <h3
            className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform"
            style={{ color }}
          >
            {nombre}
          </h3>
          <p className="text-gray-400 text-sm mb-4">{descripcion}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{total >= 0 ? `${total} lugares` : ''}</span>
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
