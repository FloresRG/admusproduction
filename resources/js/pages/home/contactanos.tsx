"use client"

import type React from "react"

import { useState } from "react"

export default function Contactanos() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado:", formData)
    alert("¡Gracias por contactarnos! Te responderemos a la brevedad.")
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: "",
    })
  }

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-6 text-red-500">Contáctanos</h2>
        <p className="text-xl text-white/90 max-w-3xl mx-auto">
          Estamos listos para ayudarte a llevar tu proyecto al siguiente nivel. Completa el formulario y nos pondremos
          en contacto contigo a la brevedad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="bg-gradient-to-br from-red-900/80 to-black/80 backdrop-blur-sm rounded-2xl p-10 text-white h-full border border-red-500/20">
            <h3 className="text-3xl font-bold mb-6">Información de Contacto</h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-red-600/30 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">Dirección</h4>
                  <p className="text-white/80">Av. Principal 123, Ciudad de México</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-600/30 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">Teléfono</h4>
                  <p className="text-white/80">+52 55 1234 5678</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-600/30 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">Email</h4>
                  <p className="text-white/80">info@admusproduction.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="text-xl font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-red-600/30 p-3 rounded-full hover:bg-red-600/50 transition-colors duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-red-600/30 p-3 rounded-full hover:bg-red-600/50 transition-colors duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-red-600/30 p-3 rounded-full hover:bg-red-600/50 transition-colors duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-black/60 backdrop-blur-sm rounded-2xl p-10 border border-red-500/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="nombre" className="block text-white font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-red-500/30 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-red-500/30 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="telefono" className="block text-white font-medium mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-red-500/30 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="mb-8">
              <label htmlFor="mensaje" className="block text-white font-medium mb-2">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-red-500/30 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-red-500 transition-colors duration-300 transform hover:scale-[0.98]"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
