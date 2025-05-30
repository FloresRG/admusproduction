import { useState } from 'react';

const imageList = [
  {
    id: 1,
    title: 'Sesión de producto',
    imageUrl: '/Gflores/logo1.png',
  },
  {
    id: 2,
    title: 'Evento corporativo',
    imageUrl: '/Gflores/imagen1.jpg',
  },
  {
    id: 3,
    title: 'Backstage sesión moda',
    imageUrl: '/Gflores/imagen1.jpg',
  },
  {
    id: 4,
    title: 'Retrato profesional',
    imageUrl: '/Gflores/logo2.png',
  },
  {
    id: 5,
    title: 'Ambiente y branding',
    imageUrl: 'admus.jpeg',
  },
];

export default function NuestroTrabajoFoto() {
  const [currentImage, setCurrentImage] = useState(imageList[0]);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Mira nuestro trabajo</h2>

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          {/* Miniaturas */}
          <div className="w-full md:w-1/3 grid grid-cols-3 gap-5">
            {imageList.map((image) => (
              <button
                key={image.id}
                onClick={() => setCurrentImage(image)}
                className={`focus:outline-none rounded-lg overflow-hidden border-4 transition-transform duration-300 ${
                  currentImage.id === image.id
                    ? 'border-red-600 scale-105 shadow-xl'
                    : 'border-transparent hover:border-red-500 hover:scale-105'
                }`}
                style={{ aspectRatio: '1 / 1' }}
                aria-label={`Ver imagen: ${image.title}`}
              >
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {/* Imagen destacada */}
          <div className="w-full md:w-2/3 flex flex-col items-center">
            <img
              src={currentImage.imageUrl}
              alt={currentImage.title}
              className="w-full max-h-[520px] rounded-2xl object-contain shadow-xl"
            />
            <h3 className="mt-6 text-3xl font-semibold text-gray-900">{currentImage.title}</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
