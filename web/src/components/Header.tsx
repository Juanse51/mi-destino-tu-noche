'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, User, Heart, MapPin } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/90 backdrop-blur-lg border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/logo%20mi%20destino%20tu%20noche.png" 
              alt="Mi Destino Tu Noche" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/buscar" className="text-gray-300 hover:text-white transition-colors">
              Explorar
            </Link>
            <Link href="/buscar?tipo=restaurante" className="text-gray-300 hover:text-white transition-colors">
              Restaurantes
            </Link>
            <Link href="/buscar?tipo=bar" className="text-gray-300 hover:text-white transition-colors">
              Bares
            </Link>
            <Link href="/ciudades" className="text-gray-300 hover:text-white transition-colors">
              Ciudades
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-dark-lighter rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <Link 
              href="/favoritos"
              className="p-2 hover:bg-dark-lighter rounded-lg transition-colors hidden sm:block"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Ingresar</span>
            </Link>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-dark-lighter rounded-lg transition-colors md:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-lighter border-t border-gray-800">
          <nav className="flex flex-col p-4 gap-2">
            <Link 
              href="/buscar" 
              className="px-4 py-3 hover:bg-dark rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              🔍 Explorar
            </Link>
            <Link 
              href="/buscar?tipo=restaurante" 
              className="px-4 py-3 hover:bg-dark rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              🍽️ Restaurantes
            </Link>
            <Link 
              href="/buscar?tipo=bar" 
              className="px-4 py-3 hover:bg-dark rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              🍺 Bares
            </Link>
            <Link 
              href="/ciudades" 
              className="px-4 py-3 hover:bg-dark rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              🏙️ Ciudades
            </Link>
            <Link 
              href="/favoritos" 
              className="px-4 py-3 hover:bg-dark rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              ❤️ Favoritos
            </Link>
            <hr className="border-gray-700 my-2" />
            <Link 
              href="/login" 
              className="px-4 py-3 bg-primary hover:bg-primary-dark rounded-lg transition-colors text-center font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-dark/95 z-50 flex items-start justify-center pt-20">
          <div className="w-full max-w-2xl px-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 flex items-center bg-dark-lighter rounded-xl px-4 py-3 border border-gray-700">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Buscar restaurantes, bares, cafés..."
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                  autoFocus
                />
              </div>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-3 hover:bg-dark-lighter rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick suggestions */}
            <div className="text-sm text-gray-400 mb-4">Búsquedas populares</div>
            <div className="flex flex-wrap gap-2">
              {['Restaurantes Bogotá', 'Bares Medellín', 'Café Cartagena', 'Pizza', 'Sushi', 'Coctelería'].map((term) => (
                <Link
                  key={term}
                  href={`/buscar?q=${encodeURIComponent(term)}`}
                  className="px-4 py-2 bg-dark-lighter hover:bg-dark-card rounded-full text-sm transition-colors"
                  onClick={() => setIsSearchOpen(false)}
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
