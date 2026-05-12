'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, User, Heart, LogOut, ChevronDown } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const showLogo = !isHome || scrolled

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isHome
        ? 'bg-dark/95 backdrop-blur-lg border-b border-gray-800/50'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://xzvfwxlgrwzcpofdubmg.supabase.co/storage/v1/object/public/imagenes/logos/logo%20mi%20destino%20tu%20noche.png"
              alt="Mi Destino Tu Noche"
              className={`h-10 w-auto transition-opacity duration-300 ${showLogo ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 font-medium">
            <Link href="/buscar?tipo=bar" className="text-white hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              Bares y Cervecerías
            </Link>
            <Link href="/buscar?tipo=restaurante" className="text-white hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              Gastrobares y Restaurantes
            </Link>
            <Link href="/buscar?tipo=discoteca" className="text-white hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              Discotecas
            </Link>
            <Link href="/otros-planes" className="text-white hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              Otros planes
            </Link>
            <Link href="/ciudades" className="text-white hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              Ciudades
            </Link>
            <Link href="/que-es-mdtn" className="text-white hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              ¿Qué es MDTN?
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {session ? (
              /* Usuario logueado */
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hidden sm:flex items-center gap-2 bg-dark-lighter hover:bg-dark-card px-3 py-2 rounded-lg transition-colors border border-gray-700/50"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="avatar" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-sm font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {session.user?.name?.split(' ')[0] || 'Usuario'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 bg-dark-lighter border border-gray-700/50 rounded-xl shadow-xl w-48 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-700/50 mb-1">
                      <p className="text-sm font-medium truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/favoritos"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-dark transition-colors text-sm"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Heart className="w-4 h-4 text-gray-400" />
                      Mis favoritos
                    </Link>
                    <button
                      onClick={() => { signOut({ callbackUrl: '/' }); setShowUserMenu(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark transition-colors text-sm text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* No logueado */
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Ingresar</span>
              </Link>
            )}

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
            <Link href="/buscar?tipo=bar" className="px-4 py-3 hover:bg-dark rounded-lg transition-colors text-white" onClick={() => setIsMenuOpen(false)}>
              Bares y Cervecerías
            </Link>
            <Link href="/buscar?tipo=restaurante" className="px-4 py-3 hover:bg-dark rounded-lg transition-colors text-white" onClick={() => setIsMenuOpen(false)}>
              Gastrobares y Restaurantes
            </Link>
            <Link href="/buscar?tipo=discoteca" className="px-4 py-3 hover:bg-dark rounded-lg transition-colors text-white" onClick={() => setIsMenuOpen(false)}>
              Discotecas
            </Link>
            <Link href="/otros-planes" className="px-4 py-3 hover:bg-dark rounded-lg transition-colors text-white" onClick={() => setIsMenuOpen(false)}>
              Otros planes
            </Link>
            <Link href="/ciudades" className="px-4 py-3 hover:bg-dark rounded-lg transition-colors text-white" onClick={() => setIsMenuOpen(false)}>
              Ciudades
            </Link>
            <Link href="/que-es-mdtn" className="px-4 py-3 hover:bg-dark rounded-lg transition-colors text-white" onClick={() => setIsMenuOpen(false)}>
              ¿Qué es MDTN?
            </Link>
            <Link href="/favoritos" className="px-4 py-3 hover:bg-dark rounded-lg transition-colors text-white" onClick={() => setIsMenuOpen(false)}>
              Favoritos
            </Link>
            <hr className="border-gray-700 my-2" />
            {session ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-400">
                  Hola, {session.user?.name?.split(' ')[0]} 👋
                </div>
                <button
                  onClick={() => { signOut({ callbackUrl: '/' }); setIsMenuOpen(false) }}
                  className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-left font-medium"
                >
                  🚪 Cerrar sesión
                </button>
              </>
            ) : (
              <Link href="/login" className="px-4 py-3 bg-primary hover:bg-primary-dark rounded-lg transition-colors text-center font-medium" onClick={() => setIsMenuOpen(false)}>
                Iniciar Sesión
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
