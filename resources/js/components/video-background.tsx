'use client';

import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
    src: string;
    type?: string;
    fallbackImage?: string;
}

export default function VideoBackground({
    src,
    type = '../../../public/Gflores/video1.mp4', // Tipo por defecto para videos mp4
    fallbackImage = '../../../public/Gflores/imagen1.jpg', // Ruta de imagen en 'public'
}: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Intentar reproducir el video automáticamente
        if (videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.warn('Reproducción automática no permitida:', error);
                // No hacemos nada, el usuario tendrá que interactuar con la página primero
            });
        }
    }, []);

    return (
        <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
            <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline poster={fallbackImage}>
                <source src={src} type={type} />
                {/* Mensaje para navegadores que no soportan video */}
                Tu navegador no soporta el elemento de video.
            </video>
        </div>
    );
}
