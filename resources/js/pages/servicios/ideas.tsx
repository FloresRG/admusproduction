
export default function Ideas() {
  return (
    <div className="container mx-auto px-4">
      {/* Encabezado */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 mb-6 drop-shadow-lg">
          Plasmamos tus ideas
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          Un equipo de profesionales apasionados por la producción audiovisual y la creación de contenido que deja huella.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            iconPath: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
            title: "Guiones Originales",
            text: "Más de 10 años de experiencia en la industria audiovisual, trabajando con marcas reconocidas a nivel nacional e internacional.",
          },
          {
            iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
            title: "Creatividad",
            text: "Enfoque creativo y estratégico para desarrollar contenido que conecta con tu audiencia y genera resultados tangibles.",
          },
          {
            iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
            title: "Producción",
            text: "Utilizamos equipos de última generación y técnicas avanzadas para asegurar la mejor calidad en cada proyecto.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-black/60 backdrop-blur-md p-10 rounded-2xl border border-red-500/30 ring-1 ring-white/10 hover:ring-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white text-center mb-4">{item.title}</h3>
            <p className="text-white/80 text-center text-base leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
