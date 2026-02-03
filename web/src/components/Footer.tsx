import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-lighter border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img 
                src="https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/logo%20mi%20destino%20tu%20noche.png" 
                alt="Mi Destino Tu Noche" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-6">
              Descubre los mejores restaurantes, bares y cafés de Colombia. Tu guía definitiva para la vida nocturna y gastronómica.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/midestinotunoche" target="_blank" rel="noopener noreferrer" 
                className="p-2 bg-dark hover:bg-primary/20 rounded-lg transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/midestinotunoche" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-dark hover:bg-primary/20 rounded-lg transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/midestinotunoche" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-dark hover:bg-primary/20 rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
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
                <a href="mailto:contacto@midestinotunoche.com" className="hover:text-white transition-colors">
                  contacto@midestinotunoche.com
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
              <Link 
                href="/registro-negocio"
                className="text-primary hover:text-primary-light text-sm transition-colors"
              >
                Regístralo gratis →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          {/* Asobares Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/Nuevo%20logo%20Asobares%20-%20Blanco.png" 
              alt="Asobares" 
              className="h-16 w-auto"
            />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Mi Destino Tu Noche. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/terminos" className="text-gray-500 hover:text-white transition-colors">
                Términos y condiciones
              </Link>
              <Link href="/privacidad" className="text-gray-500 hover:text-white transition-colors">
                Política de privacidad
              </Link>
            </div>
          </div>
          
          {/* Desarrollado por */}
          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              Desarrollado por{' '}
              <a 
                href="https://www.vamosarayar.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-light transition-colors"
              >
                Rayar!
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
