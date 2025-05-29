import type { HTMLAttributes } from "react"

export default function AppLogoIcon(props: HTMLAttributes<HTMLImageElement>) {
    return (
        // Aquí agregamos el logo PNG como una imagen
        <img
            {...props} 
            src="/Gflores/logo.png" // Ruta del logo en la carpeta public
            alt="Logo"
            className="h-14 w-14 object-contain" // Estilo (ajustable)
        />
    );
}
