import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mi Destino Tu Noche | Restaurantes y Bares en Colombia',
  description: 'Descubre los mejores restaurantes, bares y cafés en Colombia. Encuentra tu próximo destino para disfrutar de la mejor gastronomía y vida nocturna.',
  keywords: 'restaurantes, bares, cafés, Colombia, Bogotá, Medellín, Cali, gastronomía, vida nocturna',
  openGraph: {
    title: 'Mi Destino Tu Noche',
    description: 'Descubre los mejores restaurantes y bares en Colombia',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-CFMWVBRDEF" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CFMWVBRDEF');
          `}
        </Script>
        <body className={`${inter.className} bg-dark text-white min-h-screen`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
