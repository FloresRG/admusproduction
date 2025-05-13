import { Camera, Award, Users } from "lucide-react"

export default function QuienesSomos() {
  return (
    <section id="quienes-somos" className="py-16 relative z-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 md:p-12">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Quiénes <span className="text-red-500">Somos</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/40 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Experiencia Creativa</h3>
              <p className="text-gray-300">
                Más de 5 años creando contenido audiovisual de alta calidad para marcas y empresas de todos los tamaños.
              </p>
            </div>

            <div className="bg-black/40 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Calidad Garantizada</h3>
              <p className="text-gray-300">
                Utilizamos equipos de última generación y técnicas avanzadas para asegurar resultados profesionales.
              </p>
            </div>

            <div className="bg-black/40 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Equipo Talentoso</h3>
              <p className="text-gray-300">
                Nuestro equipo está formado por profesionales apasionados y creativos del mundo audiovisual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
