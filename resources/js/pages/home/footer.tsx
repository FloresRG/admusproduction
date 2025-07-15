export default function Footer() {
    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <div className="md:col-span-2">
                    <div className="mb-6">
                        <svg width="400" height="150" viewBox="0 0 400 150" className="drop-shadow-[0_0_10px_rgba(255,0,0,0.4)]">
                            <image href="/Gflores/logo1.png" x="0" y="0" width="400" height="150" preserveAspectRatio="xMidYMid slice" />
                        </svg>
                    </div>

                    <p className="mb-6 max-w-md text-gray-400">
                        Producción audiovisual y creación de contenido de alta calidad para potenciar tu presencia digital y alcanzar a tu audiencia
                        objetivo.
                    </p>
                    <div className="flex space-x-4">
                        {/* facebbok */}
                        <a
                            href="https://www.facebook.com/admusproductions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 transition-colors duration-300 hover:text-red-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                        </a>
                        {/* instragam */}
                        {/* <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a> */}
                        {/* youtube */}
                        <a
                            href="https://www.youtube.com/@admusproductions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 transition-colors duration-300 hover:text-red-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                        </a>

                        {/* TikTok */}
                        <a
                            href="https://www.tiktok.com/@admusbol"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 transition-colors duration-300 hover:text-red-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.776 0h3.366a5.266 5.266 0 0 0 5.263 5.263v3.386a8.648 8.648 0 0 1-5.263-1.8v7.975a6.54 6.54 0 1 1-6.533-6.536c.207 0 .409.013.61.035v3.454a3.087 3.087 0 1 0 2.557 3.048V0z" />
                            </svg>
                        </a>
                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/59179582395?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 transition-colors duration-300 hover:text-red-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.52 3.48A11.936 11.936 0 0 0 12 0C5.372 0 0 5.373 0 12c0 2.11.551 4.165 1.59 5.98L0 24l6.277-1.636A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.192-1.243-6.192-3.48-8.52zM12 22.154c-1.828 0-3.606-.484-5.162-1.4l-.368-.212-3.726.97.995-3.64-.24-.374A9.945 9.945 0 0 1 2 12c0-5.522 4.478-10 10-10 2.667 0 5.178 1.04 7.07 2.93A9.94 9.94 0 0 1 22 12c0 5.522-4.478 10-10 10zm5.337-7.162c-.234-.117-1.38-.683-1.594-.76-.214-.078-.37-.117-.527.117-.156.234-.605.76-.742.917-.137.156-.273.175-.507.058-.234-.117-.987-.364-1.88-1.158-.695-.618-1.164-1.38-1.3-1.614-.137-.234-.015-.36.103-.477.106-.106.234-.273.352-.41.117-.137.156-.234.234-.39.078-.156.039-.293-.02-.41-.058-.117-.527-1.28-.722-1.753-.195-.468-.394-.405-.527-.41-.137-.007-.293-.009-.449-.009s-.41.058-.625.293c-.214.234-.82.801-.82 1.953s.84 2.267.957 2.426c.117.156 1.654 2.53 4.01 3.544.56.242.996.385 1.336.493.561.18 1.071.155 1.476.094.45-.068 1.38-.562 1.575-1.104.195-.546.195-1.016.137-1.104-.058-.087-.215-.137-.449-.254z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="mb-6 text-xl font-bold text-white">Enlaces rápidos</h3>
                    <ul className="space-y-4">
                        <li>
                            <a href="#" className="text-gray-400 transition-colors duration-300 hover:text-red-500">
                                Inicio
                            </a>
                        </li>
                        <li>
                            <a href="#quienes-somos" className="text-gray-400 transition-colors duration-300 hover:text-red-500">
                                Quiénes Somos
                            </a>
                        </li>
                        <li>
                            <a href="#como-trabajamos" className="text-gray-400 transition-colors duration-300 hover:text-red-500">
                                Cómo Trabajamos
                            </a>
                        </li>
                        <li>
                            <a href="#contactanos" className="text-gray-400 transition-colors duration-300 hover:text-red-500">
                                Contáctanos
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-6 text-xl font-bold text-white">Servicios</h3>
                    <ul className="space-y-4">
                        <li>
                            <a href="#" className="text-gray-400 transition-colors duration-300 hover:text-red-500">
                                Producción de videos
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-400 transition-colors duration-300 hover:text-red-500">
                                Edición profesional
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-400 transition-colors duration-300 hover:text-red-500">
                                Contenido para redes
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-400 transition-colors duration-300 hover:text-red-500">
                                Fotografía comercial
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-12 border-t border-gray-800 pt-8 text-center">
                <p className="text-gray-500">© {new Date().getFullYear()} ADMUS Production. Todos los derechos reservados.</p>
            </div>
        </div>
    );
}
