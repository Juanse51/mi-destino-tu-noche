import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Mi Destino Tu Noche',
  description: 'Política de privacidad de Mi Destino Tu Noche - Asobares Colombia',
}

export default function Privacidad() {
  return (
    <div className="animate-fadeIn pt-20">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Política de <span className="text-gradient">Privacidad</span>
          </h1>
          <p className="text-gray-400 mb-12">Última actualización: abril de 2026</p>

          <div className="space-y-10 text-gray-300 leading-relaxed">

            <div className="bg-dark-lighter rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">1. Quiénes somos</h2>
              <p>
                Mi Destino Tu Noche es una plataforma digital operada por <strong className="text-white">Asobares Colombia</strong> (Asociación de Bares y Restaurantes de Colombia) que sirve como directorio gastronómico y de entretenimiento nocturno en Colombia. Puedes contactarnos en <a href="mailto:soporte@asobares.org" className="text-primary hover:underline">soporte@asobares.org</a>.
              </p>
            </div>

            <div className="bg-dark-lighter rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">2. Información que recopilamos</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Datos de cuenta:</strong> nombre y correo electrónico cuando te registras con Google.</li>
                <li><strong className="text-white">Ubicación aproximada:</strong> detectamos tu ciudad mediante tu dirección IP para mostrarte establecimientos cercanos. No almacenamos coordenadas GPS precisas sin tu permiso explícito.</li>
                <li><strong className="text-white">Favoritos e historial:</strong> los establecimientos que marcas como favoritos y los que visitas dentro de la plataforma.</li>
                <li><strong className="text-white">Valoraciones:</strong> reseñas y puntuaciones que publicas voluntariamente.</li>
                <li><strong className="text-white">Datos de uso:</strong> páginas visitadas, búsquedas realizadas y clics en botones de contacto de establecimientos, con fines estadísticos y de mejora del servicio.</li>
              </ul>
            </div>

            <div className="bg-dark-lighter rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">3. Cómo usamos tu información</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Mostrarte establecimientos relevantes según tu ubicación y preferencias.</li>
                <li>Guardar tus favoritos e historial entre sesiones.</li>
                <li>Mejorar la plataforma mediante análisis estadístico agregado.</li>
                <li>Enviarte comunicaciones relacionadas con el servicio cuando sea necesario.</li>
              </ul>
              <p className="mt-4">No vendemos ni compartimos tus datos personales con terceros con fines comerciales.</p>
            </div>

            <div className="bg-dark-lighter rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">4. Permisos de la aplicación móvil</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Ubicación:</strong> usada únicamente para ordenar los establecimientos por cercanía. Puedes denegar este permiso y la app seguirá funcionando.</li>
                <li><strong className="text-white">Cámara y galería:</strong> solo si subes una foto de perfil o reseña. No accedemos a tus fotos en segundo plano.</li>
                <li><strong className="text-white">Notificaciones:</strong> para alertas opcionales sobre establecimientos o novedades de la plataforma.</li>
              </ul>
            </div>

            <div className="bg-dark-lighter rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">5. Cookies y tecnologías similares</h2>
              <p>
                Usamos cookies de sesión para mantener tu inicio de sesión activo. También usamos Google Analytics para medir el tráfico de forma anónima y agregada. Puedes desactivar las cookies en la configuración de tu navegador, aunque algunas funciones pueden verse afectadas.
              </p>
            </div>

            <div className="bg-dark-lighter rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">6. Almacenamiento y seguridad</h2>
              <p>
                Tus datos se almacenan en servidores seguros de <strong className="text-white">Supabase</strong> (PostgreSQL) con cifrado en tránsito (HTTPS/TLS). Aplicamos medidas técnicas y organizativas para proteger tu información contra acceso no autorizado.
              </p>
            </div>

            <div className="bg-dark-lighter rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">7. Tus derechos</h2>
              <p>Tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Acceder a los datos que tenemos sobre ti.</li>
                <li>Solicitar la corrección o eliminación de tu cuenta y datos.</li>
                <li>Revocar los permisos de ubicación o notificaciones en cualquier momento desde tu dispositivo.</li>
              </ul>
              <p className="mt-4">Para ejercer estos derechos escríbenos a <a href="mailto:soporte@asobares.org" className="text-primary hover:underline">soporte@asobares.org</a>.</p>
            </div>

            <div className="bg-dark-lighter rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">8. Menores de edad</h2>
              <p>
                Mi Destino Tu Noche no está dirigido a menores de 18 años. No recopilamos conscientemente datos de menores. Si eres padre o tutor y crees que tu hijo ha proporcionado información personal, contáctanos para eliminarla.
              </p>
            </div>

            <div className="bg-dark-lighter rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">9. Cambios a esta política</h2>
              <p>
                Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos mediante un aviso en la app o en el sitio web. El uso continuado de la plataforma después de los cambios implica la aceptación de la nueva política.
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-2">¿Tienes preguntas?</h2>
              <p className="text-white/90 mb-4">Contáctanos directamente y te responderemos a la brevedad.</p>
              <a
                href="mailto:soporte@asobares.org"
                className="inline-block bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-colors text-white"
              >
                soporte@asobares.org
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
