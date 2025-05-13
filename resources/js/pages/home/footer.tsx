import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-10 relative z-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-black/80 backdrop-blur-sm rounded-xl p-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">AdmUs Production</h3>
              <p className="text-gray-400">Producción audiovisual profesional para potenciar tu presencia digital.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                    Portafolio
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Servicios</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                    Producción de videos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                    Edición profesional
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                    Marketing de contenidos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                    Animación
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center hover:bg-red-500/40 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-red-500" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center hover:bg-red-500/40 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-red-500" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center hover:bg-red-500/40 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-red-500" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center hover:bg-red-500/40 transition-colors"
                >
                  <Youtube className="w-5 h-5 text-red-500" />
                </a>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-2">Suscríbete</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="px-4 py-2 bg-black/50 border border-gray-700 rounded-l-lg focus:ring-red-500 focus:border-red-500 text-white flex-1"
                  />
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-r-lg transition-colors">
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} AdmUs Production. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
