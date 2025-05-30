import Header from '../../components/header';
import Footer from '../home/footer';

export default function EventosDigitales() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-900">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-black py-20 text-white">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 -skew-y-12 transform bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4">
                        <div className="text-center">
                            <h1 className="mb-6 bg-gradient-to-r from-white to-red-200 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
                                EVENTOS DIGITALES
                            </h1>
                            <h2 className="mb-6 text-3xl font-bold text-red-300 md:text-4xl">Y EN VIVO</h2>
                            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-200 md:text-2xl">
                                Eventos digitales profesionales y personalizados para ADMUS
                            </p>
                            <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-red-500 to-white"></div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="bg-gray-900 py-20">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-5xl">
                            <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-2xl md:p-12">
                                <p className="mb-12 text-center text-xl leading-relaxed text-gray-300 md:text-2xl">
                                    Creamos, planificamos y organizamos tus eventos virtuales y en vivo. Sabemos que cada evento es único y que las
                                    dificultades técnicas pueden ser agobiantes. Por eso nos encargamos de tu evento digital, considerando tus
                                    objetivos, acompañándote durante todo el proceso.
                                </p>

                                <div className="rounded-xl border border-red-900/30 bg-gradient-to-br from-black to-gray-800 p-8 shadow-xl md:p-10">
                                    <h2 className="mb-10 bg-gradient-to-r from-red-400 to-white bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl">
                                        DENTRO DEL SERVICIO ENCONTRARÁS
                                    </h2>

                                    <div className="grid gap-8 md:grid-cols-2">
                                        <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-lg transition-all duration-300 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/20">
                                            <div className="mb-6 flex items-start">
                                                <div className="mr-4 rounded-lg bg-gradient-to-br from-red-500 to-red-600 p-3 shadow-lg">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-8 w-8 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="text-xl leading-tight font-bold text-white md:text-2xl">
                                                    DISTINTAS PLATAFORMAS PARA EVENTOS DIGITALES
                                                </h3>
                                            </div>
                                            <p className="text-lg leading-relaxed text-gray-300">
                                                Existen diferentes plataformas disponibles para realizar un evento digital, dentro de las cuales
                                                puedes elegir: <span className="font-semibold text-red-400">OBS, Zoom, Streamyard</span> y otros.
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-lg transition-all duration-300 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/20">
                                            <div className="mb-6 flex items-start">
                                                <div className="mr-4 rounded-lg bg-gradient-to-br from-red-500 to-red-600 p-3 shadow-lg">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-8 w-8 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="mb-4 text-xl leading-tight font-bold text-white md:text-2xl">
                                                    INTERACCIÓN EN TIEMPO REAL
                                                </h3>
                                            </div>
                                            <p className="text-lg leading-relaxed text-gray-300">
                                                Todas las opciones permiten la interacción en tiempo real de todos los participantes (ponentes y
                                                público) en diferentes plataformas como{' '}
                                                <span className="font-semibold text-red-400">FB, YouTube, Twitch</span> y más, ¡simultáneamente!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-black py-20">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-6xl">
                            <h2 className="mb-16 bg-gradient-to-r from-red-400 to-white bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl">
                                ¿Por qué elegir ADMUS?
                            </h2>

                            <div className="grid gap-8 md:grid-cols-3">
                                <div className="group text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-lg transition-all duration-300 group-hover:shadow-red-500/50">
                                        <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-white">Tecnología Avanzada</h3>
                                    <p className="text-gray-400">Utilizamos las mejores herramientas del mercado</p>
                                </div>

                                <div className="group text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-lg transition-all duration-300 group-hover:shadow-red-500/50">
                                        <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-white">Soporte 24/7</h3>
                                    <p className="text-gray-400">Acompañamiento completo durante todo el evento</p>
                                </div>

                                <div className="group text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-lg transition-all duration-300 group-hover:shadow-red-500/50">
                                        <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-white">Resultados Garantizados</h3>
                                    <p className="text-gray-400">Eventos exitosos que superan expectativas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="bg-gradient-to-br from-gray-900 to-black py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="mb-8 bg-gradient-to-r from-red-400 to-white bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                            ¿Listo para tu próximo evento digital?
                        </h2>
                        <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-300">Contacta con ADMUS y lleva tus eventos al siguiente nivel</p>
                        <a
                            href="mailto:contacto@admus.com"
                            className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-red-800 hover:shadow-red-500/50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            Contáctanos Ahora
                        </a>
                    </div>
                </section>
            </main>

            <div className="bg-black">
                <Footer />
            </div>
        </div>
    );
}
