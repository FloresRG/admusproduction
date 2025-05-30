import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/pages/home/footer"
import { BarChart3, CheckCircle, Lightbulb, Settings, Target, TrendingUp, Users, Zap } from "lucide-react"

export default function Consultoria() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section Mejorado */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-red-500/20 blur-3xl"></div>
          <div className="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-red-800/20 blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/50"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-900/30 px-4 py-2 text-sm text-red-200 backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-400"></div>
              Transformación empresarial
            </div>

            <h1 className="mb-8 text-6xl leading-tight font-bold text-white md:text-7xl">
              Consultorías
              <span className="block bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                AdMus
              </span>
            </h1>

            <p className="mb-10 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
              Transformamos tu negocio con soluciones estratégicas personalizadas. Nuestro equipo de expertos te
              acompaña en cada paso hacia el éxito empresarial sostenible.
            </p>

            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-700 to-red-900 px-8 py-4 text-lg text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-800 hover:to-red-950 hover:shadow-xl"
              >
                Ver proyectos
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-red-700/50 px-8 py-4 text-lg text-white backdrop-blur-sm transition-all duration-300 hover:border-red-700 hover:bg-red-900/20"
              >
                Cotización gratuita
              </Button>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center sm:text-left">
                <div className="mb-2 text-3xl font-bold text-white">10+</div>
                <div className="text-sm text-gray-400">Años de experiencia</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="mb-2 text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Proyectos exitosos</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="mb-2 text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-400">Satisfacción garantizada</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section Mejorado */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-900/30 px-4 py-2 text-sm font-medium text-red-200">
              <Target className="h-4 w-4" />
              Nuestros Servicios
            </div>
            <h2 className="mb-6 text-5xl font-bold text-white">Te brindamos soluciones</h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
              En AdMus ofrecemos servicios de consultoría especializados para impulsar tu empresa hacia nuevos niveles
              de eficiencia y rentabilidad sostenible.
            </p>
          </div>

          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:gap-12">
            <div className="group relative overflow-hidden rounded-3xl bg-gray-900 p-8 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-gradient-to-br from-red-500/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 to-red-900 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">Consultorías especializadas</h3>
                <p className="mb-6 text-lg leading-relaxed text-gray-300">
                  Cada proyecto necesita soluciones personalizadas y especializadas. Encuentra la solución a todas tus
                  necesidades empresariales en un solo lugar.
                </p>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    className="border-red-700 text-red-400 transition-all duration-300 hover:bg-red-900 hover:text-white"
                  >
                    Conocer más
                  </Button>
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-red-700"></div>
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="h-2 w-2 rounded-full bg-red-300"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-gray-900 p-8 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-gradient-to-br from-red-500/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 to-red-900 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">Capacitaciones empresariales</h3>
                <p className="mb-6 text-lg leading-relaxed text-gray-300">
                  ¡Nos encanta enseñar! Hemos capacitado a miles de profesionales de todas las industrias para ser
                  usuarios eficientes de las mejores prácticas empresariales.
                </p>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    className="border-red-700 text-red-400 transition-all duration-300 hover:bg-red-900 hover:text-white"
                  >
                    Ver programas
                  </Button>
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-red-700"></div>
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="h-2 w-2 rounded-full bg-red-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Mira nuestro trabajo</h2>
            <p className="text-xl text-gray-300">Echa un vistazo al interior de nuestro Portafolio</p>
          </div>

          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden border-0 bg-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:transform hover:shadow-xl">
              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-red-800 to-red-950">
                <div className="absolute inset-0 bg-black/20"></div>
                <BarChart3 className="relative z-10 h-16 w-16 text-white" />
              </div>
              <CardHeader className="p-6">
                <CardTitle className="mb-2 text-xl text-white">Optimización de Procesos</CardTitle>
                <CardDescription className="text-gray-400">
                  Análisis y mejora de procesos empresariales para maximizar la eficiencia operativa.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden border-0 bg-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:transform hover:shadow-xl">
              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-red-800 to-red-950">
                <div className="absolute inset-0 bg-black/20"></div>
                <TrendingUp className="relative z-10 h-16 w-16 text-white" />
              </div>
              <CardHeader className="p-6">
                <CardTitle className="mb-2 text-xl text-white">Estrategia de Crecimiento</CardTitle>
                <CardDescription className="text-gray-400">
                  Desarrollo de planes estratégicos para impulsar el crecimiento sostenible del negocio.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden border-0 bg-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:transform hover:shadow-xl">
              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-red-800 to-red-950">
                <div className="absolute inset-0 bg-black/20"></div>
                <Lightbulb className="relative z-10 h-16 w-16 text-white" />
              </div>
              <CardHeader className="p-6">
                <CardTitle className="mb-2 text-xl text-white">Innovación Digital</CardTitle>
                <CardDescription className="text-gray-400">
                  Transformación digital y adopción de nuevas tecnologías para modernizar tu empresa.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden border-0 bg-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:transform hover:shadow-xl">
              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-red-800 to-red-950">
                <div className="absolute inset-0 bg-black/20"></div>
                <Settings className="relative z-10 h-16 w-16 text-white" />
              </div>
              <CardHeader className="p-6">
                <CardTitle className="mb-2 text-xl text-white">Gestión Operativa</CardTitle>
                <CardDescription className="text-gray-400">
                  Optimización de la gestión operativa y administrativa para mejorar la productividad.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden border-0 bg-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:transform hover:shadow-xl">
              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-red-800 to-red-950">
                <div className="absolute inset-0 bg-black/20"></div>
                <Zap className="relative z-10 h-16 w-16 text-white" />
              </div>
              <CardHeader className="p-6">
                <CardTitle className="mb-2 text-xl text-white">Consultoría Express</CardTitle>
                <CardDescription className="text-gray-400">
                  Soluciones rápidas y efectivas para problemas empresariales urgentes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden border-0 bg-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:transform hover:shadow-xl">
              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-red-800 to-red-950">
                <div className="absolute inset-0 bg-black/20"></div>
                <Target className="relative z-10 h-16 w-16 text-white" />
              </div>
              <CardHeader className="p-6">
                <CardTitle className="mb-2 text-xl text-white">Planificación Estratégica</CardTitle>
                <CardDescription className="text-gray-400">
                  Desarrollo de planes estratégicos a largo plazo para alcanzar objetivos empresariales.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-white">¡Queremos ser tu consultor de confianza!</h2>
            <p className="mb-8 text-xl leading-relaxed text-gray-300">
              Queremos ayudarte a alcanzar tus objetivos y potenciar tus ideas. Estaremos encantados de agendar una
              reunión contigo para hacer un diagnóstico gratuito de tu empresa o para que nos cuentes de tu proyecto.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-red-700 px-8 py-3 text-lg text-white hover:bg-red-800">
                Cotización gratuita
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-red-700 px-8 py-3 text-lg text-white hover:bg-red-900"
              >
                Agendar reunión
              </Button>
            </div>
          </div>

          {/* Client Logos Section */}
          <div className="mt-16">
            <p className="mb-8 text-center text-lg text-gray-400">Empresas que confían en AdMus</p>
            <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-4 lg:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex h-16 items-center justify-center rounded-lg bg-gray-900 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="font-semibold text-gray-500">Logo {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-16 text-center text-4xl font-bold text-white">¿Por qué elegir AdMus?</h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Experiencia comprobada",
                  description: "Más de 10 años ayudando a empresas a alcanzar sus objetivos.",
                },
                {
                  title: "Soluciones personalizadas",
                  description: "Cada proyecto es único y merece una solución a medida.",
                },
                {
                  title: "Equipo multidisciplinario",
                  description: "Profesionales especializados en diferentes áreas empresariales.",
                },
                {
                  title: "Resultados medibles",
                  description: "Establecemos KPIs claros para medir el éxito de cada proyecto.",
                },
                {
                  title: "Acompañamiento continuo",
                  description: "Te acompañamos durante todo el proceso de implementación.",
                },
                {
                  title: "Innovación constante",
                  description: "Siempre actualizados con las últimas tendencias del mercado.",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 rounded-lg p-6 transition-colors hover:bg-gray-900"
                >
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600" />
                  <div>
                    <h3 className="mb-2 font-semibold text-white">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer con fondo negro */}
      <div className="bg-black">
        <Footer />
      </div>
    </div>
  )
}
