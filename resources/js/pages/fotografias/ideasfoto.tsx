export default function IdeasFotografia() {
  const ideas = [
    {
      image: "/Gflores/logo1.png",
      title: "Fotografías de productos",
      text: "Haz que tus productos destaquen y resalta sus mejores características para atraer más clientes.",
    },
    {
      image: "/logo.jpeg",
      title: "Eventos Sociales",
      text: "¡Que tus mejores momentos queden retratados por siempre!",
    },
    {
      image: "/Gflores/logo1.png",
      title: "Fotografía corporativa",
      text: "Muestra qué haces y cómo lo haces en una sesión fotográfica con el personal de tu empresa, destacando tus valores corporativos.",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Encabezado */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 mb-6 drop-shadow-lg">
          Retratamos los mejores momentos
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          Contamos con un equipo de fotógrafos talentosos y creativos siempre listos para hacer brillar tu marca o tu evento.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ideas.map((item, idx) => (
          <div
            key={idx}
            className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-red-500/30 ring-1 ring-white/10 hover:ring-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <div className="mb-6 rounded-xl overflow-hidden shadow-md">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white text-center mb-4">{item.title}</h3>
            <p className="text-white/80 text-center text-base leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
