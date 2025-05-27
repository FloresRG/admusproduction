import type { HTMLAttributes } from "react"

export default function AppLogoIcon(props: HTMLAttributes<HTMLImageElement>) {
  return (
    <div className="relative">
      {/* Logo principal SIN rotación en el formulario */}
      <img
        {...props}
        src="/logo.jpeg"
        alt="Logo"
        className="object-contain rounded-2xl shadow-2xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl filter drop-shadow-lg"
      />

      {/* Efecto de resplandor sutil */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-red-300/10 to-transparent opacity-50"></div>
    </div>
  )
}
