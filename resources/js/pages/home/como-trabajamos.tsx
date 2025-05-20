"use client"

export default function ComoTrabajamos() {
  const steps = [
    {
      number: "01",
      title: "Planificación",
      description: "Analizamos tus necesidades y objetivos para desarrollar una estrategia personalizada.",
    },
    {
      number: "02",
      title: "Producción",
      description: "Ejecutamos el proyecto con nuestro equipo de profesionales y equipos de última generación.",
    },
    {
      number: "03",
      title: "Edición",
      description: "Aplicamos técnicas avanzadas de edición para crear contenido de alto impacto visual.",
    },
    {
      number: "04",
      title: "Entrega",
      description: "Entregamos el producto final optimizado para las plataformas donde será publicado.",
    },
  ]

  return (
    <div className="container mx-auto px-4 relative">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-6 text-red-500">Cómo Trabajamos</h2>
        <p className="text-xl text-white/90 max-w-3xl mx-auto">
          Nuestro proceso está diseñado para maximizar la eficiencia y garantizar resultados excepcionales en cada
          proyecto.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-red-500/20 h-full hover:bg-black/80 transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl font-bold text-red-600/50 mb-4">{step.number}</div>
              <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
              <p className="text-white/80">{step.description}</p>
            </div>

            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="#DC2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-20 bg-gradient-to-r from-red-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-10 text-white text-center border border-red-500/20">
        <h3 className="text-3xl font-bold mb-4">¿Listo para comenzar tu proyecto?</h3>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
          Contáctanos hoy mismo y descubre cómo podemos ayudarte a alcanzar tus objetivos con contenido audiovisual de
          alta calidad.
        </p>
        <a
          href="#contactanos"
          className="inline-block bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-500 transition-all duration-300 transform hover:scale-105"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("contactanos")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          Contactar ahora
        </a>
      </div>
    </div>
  )
}
