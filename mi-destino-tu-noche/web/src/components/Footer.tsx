import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-lighter border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/logo%20mi%20destino%20tu%20noche.png"
                alt="Mi Destino Tu Noche"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-4">
              Descubre los mejores restaurantes, bares y cafés de Colombia. Tu guía definitiva para la vida nocturna y gastronómica.
            </p>
            {/* Logo Asobares con link */}
            <a href="https://asobares.org/" target="_blank" rel="noopener noreferrer" className="inline-block mb-6 hover:opacity-80 transition-opacity">
              <Image
                src="https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/Nuevo%20logo%20Asobares%20-%20Blanco.png"
                alt="Asobares"
                width={140}
                height={45}
                className="h-10 w-auto"
              />
            </a>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/asobares.colombia/" target="_blank" rel="noopener noreferrer" 
                className="p-2 bg-dark hover:bg-primary/20 rounded-lg transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/Asobarescolombia" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-dark hover:bg-primary/20 rounded-lg transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/Asobares" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-dark hover:bg-primary/20 rounded-lg transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explorar */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Explorar</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/buscar?tipo=restaurante" className="text-gray-400 hover:text-white transition-colors">
                  Restaurantes
                </Link>
              </li>
              <li>
                <Link href="/buscar?tipo=bar" className="text-gray-400 hover:text-white transition-colors">
                  Bares
                </Link>
              </li>
              <li>
                <Link href="/buscar?tipo=cafe" className="text-gray-400 hover:text-white transition-colors">
                  Cafés
                </Link>
              </li>
              <li>
                <Link href="/buscar?tipo=discoteca" className="text-gray-400 hover:text-white transition-colors">
                  Discotecas
                </Link>
              </li>
              <li>
                <Link href="/categoria/circulo-gastro" className="text-gray-400 hover:text-white transition-colors">
                  Círculo Gastro ⭐
                </Link>
              </li>
              <li>
                <Link href="/categoria/camara-diversidad" className="text-gray-400 hover:text-white transition-colors">
                  Cámara de la Diversidad 🏳️‍🌈
                </Link>
              </li>
            </ul>
          </div>

          {/* Ciudades */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Ciudades</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/ciudad/bogota" className="text-gray-400 hover:text-white transition-colors">
                  Bogotá
                </Link>
              </li>
              <li>
                <Link href="/ciudad/medellin" className="text-gray-400 hover:text-white transition-colors">
                  Medellín
                </Link>
              </li>
              <li>
                <Link href="/ciudad/cali" className="text-gray-400 hover:text-white transition-colors">
                  Cali
                </Link>
              </li>
              <li>
                <Link href="/ciudad/cartagena" className="text-gray-400 hover:text-white transition-colors">
                  Cartagena
                </Link>
              </li>
              <li>
                <Link href="/ciudad/barranquilla" className="text-gray-400 hover:text-white transition-colors">
                  Barranquilla
                </Link>
              </li>
              <li>
                <Link href="/ciudades" className="text-primary hover:text-primary-light transition-colors">
                  Ver todas →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:soporte@asobares.org" className="hover:text-white transition-colors">
                  soporte@asobares.org
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+573212304589" className="hover:text-white transition-colors">
                  +57 321 230 4589
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span>Colombia</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-dark rounded-xl">
              <div className="text-sm font-medium mb-2">¿Tienes un establecimiento?</div>
              <a 
                href="mailto:soporte@asobares.org"
                className="text-primary hover:text-primary-light text-sm transition-colors"
              >
                Regístralo gratis →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Mi Destino Tu Noche. Todos los derechos reservados.
          </p>
          <a href="https://www.vamosarayar.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            Desarrollado por Rayar!
          </a>
          <div className="flex gap-6 text-sm">
            <Link href="/terminos" className="text-gray-500 hover:text-white transition-colors">
              Términos y condiciones
            </Link>
            <Link href="/privacidad" className="text-gray-500 hover:text-white transition-colors">
              Política de privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
