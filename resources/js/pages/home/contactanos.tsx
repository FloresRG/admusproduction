import { Mail, Phone, MapPin } from "lucide-react"

export default function Contactanos() {
  return (
    <section id="contactanos" className="py-16 relative z-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 md:p-12">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            <span className="text-red-500">Contáctanos</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-white">Envíanos un mensaje</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-500 text-white"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-500 text-white"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-500 text-white"
                    placeholder="¿En qué podemos ayudarte?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6 text-white">Información de contacto</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Mail className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Email</h4>
                    <p className="text-gray-300">contacto@admusproduction.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Phone className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Teléfono</h4>
                    <p className="text-gray-300">+123 456 7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Ubicación</h4>
                    <p className="text-gray-300">Av. Principal 123, Ciudad</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-black/40 rounded-lg">
                  <h4 className="text-lg font-medium text-white mb-2">Horario de atención</h4>
                  <p className="text-gray-300">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-300">Sábados: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
