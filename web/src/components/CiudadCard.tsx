import Link from 'next/link'
import Image from 'next/image'

interface Ciudad {
  nombre: string
  slug: string
  imagen: string
  total: number
}

export default function CiudadCard({ ciudad }: { ciudad: Ciudad }) {
  const { nombre, slug, imagen, total } = ciudad

  return (
    <Link href={`/ciudad/${slug}`} className="group">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden card-hover">
        <Image
          src={imagen}
          alt={nombre}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-bold text-xl text-primary group-hover:text-white transition-colors">
            {nombre}
          </h3>
          <p className="text-sm text-gray-300 mt-1">{total} lugares</p>
        </div>
      </div>
    </Link>
  )
}
