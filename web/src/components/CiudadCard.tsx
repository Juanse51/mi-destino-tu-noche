import Link from 'next/link'

interface Ciudad {
  nombre: string
  slug: string
  imagen?: string
  total?: number
}

export default function CiudadCard({ ciudad }: { ciudad: Ciudad }) {
  const { nombre, slug, imagen, total } = ciudad
  const defaultImage = 'https://images.unsplash.com/photo-1536086845232-47c1b118f3f4?w=400'

  return (
    <Link href={`/ciudad/${slug}`} className="group">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden card-hover">
        <img
          src={imagen || defaultImage}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
            {nombre}
          </h3>
          <p className="text-sm text-gray-400">{total || 0} lugares</p>
        </div>
      </div>
    </Link>
  )
}
