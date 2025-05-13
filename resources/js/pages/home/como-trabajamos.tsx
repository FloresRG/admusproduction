import { Lightbulb, Edit, Film, Share2 } from "lucide-react"

export default function ComoTrabajamos() {
  return (
    <section id="como-trabajamos" className="py-16 relative z-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 md:p-12">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Cómo <span className="text-red-500">Trabajamos</span>
          </h2>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6 bg-black/40 p-6 rounded-lg">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                <Lightbulb className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">1. Conceptualización</h3>
                <p className="text-gray-300">
                  Trabajamos contigo para entender tu visión y objetivos. Desarrollamos conceptos creativos que capturen
                  la esencia de tu marca.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 bg-black/40 p-6 rounded-lg">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                <Edit className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">2. Pre-producción</h3>
                <p className="text-gray-300">
                  Planificamos cada detalle: guiones, storyboards, locaciones, equipos y cronogramas para asegurar una
                  producción sin contratiempos.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 bg-black/40 p-6 rounded-lg">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                <Film className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">3. Producción y Edición</h3>
                <p className="text-gray-300">
                  Capturamos material de alta calidad y lo transformamos en contenido impactante mediante un proceso de
                  edición meticuloso.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 bg-black/40 p-6 rounded-lg">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                <Share2 className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">4. Distribución y Estrategia</h3>
                <p className="text-gray-300">
                  Te asesoramos sobre las mejores plataformas y estrategias para maximizar el alcance e impacto de tu
                  contenido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
