import { useState } from 'react';

const videoList = [
  {
    id: 1,
    title: 'Spot Publicitario',
    youtubeId: 'oyir9gmMh-w',
    thumbnail: 'https://img.youtube.com/vi/oyir9gmMh-w/hqdefault.jpg',
  },
  {
    id: 2,
    title: 'Video Corporativo',
    youtubeId: 'TTfYcGKXb-U',
    thumbnail: 'https://img.youtube.com/vi/TTfYcGKXb-U/hqdefault.jpg',
  },
  {
    id: 3,
    title: 'Agrupacion Claros',
    youtubeId: 'cMyF_xjvK-k',
    thumbnail: 'https://img.youtube.com/vi/cMyF_xjvK-k/hqdefault.jpg',
  },
];

export default function NuestroTrabajo() {
  const [currentVideo, setCurrentVideo] = useState(videoList[0]);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-red-500 mb-10 text-center">Mira nuestro trabajo</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Lista de miniaturas */}
        <div className="w-full md:w-1/3 space-y-4">
          {videoList.map((video) => (
            <div
              key={video.id}
              onClick={() => setCurrentVideo(video)}
              className={`cursor-pointer rounded-lg overflow-hidden border hover:border-red-500 transition-all ${
                currentVideo.id === video.id ? 'border-red-600' : 'border-white/10'
              }`}
            >
              <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover" />
              <div className="bg-black/70 text-white p-2 text-sm text-left">{video.title}</div>
            </div>
          ))}
        </div>

        {/* Reproductor de video */}
        <div className="w-full md:w-2/3">
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-lg border border-white/10">
            <iframe
              key={currentVideo.youtubeId}
              src={`https://www.youtube.com/embed/${currentVideo.youtubeId}`}
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-xl"
            />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">{currentVideo.title}</h3>
        </div>
      </div>
    </div>
  );
}
