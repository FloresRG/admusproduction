import React from 'react';
import { Play, Users, Target, TrendingUp, Mail, Search, Edit, Globe, Eye, Lightbulb } from 'lucide-react';
import Header from '../components/header';



const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center" style={{backgroundColor: '#1A1A1A'}}>
    <div className="absolute inset-0 opacity-20">
      <div className="grid grid-cols-8 grid-rows-8 h-full">
        {[...Array(64)].map((_, i) => (
          <div key={i} className="border border-gray-700"></div>
        ))}
      </div>
    </div>
    
    <div className="relative z-10 container mx-auto px-6 text-center text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
          Marketing <span style={{color: '#FF2400'}}>Digital</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Todas las marcas exitosas tienen una gran presencia en las redes sociales. 
          Que tu hoja sea una de ellas.
        </p>
        <button 
          className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          style={{backgroundColor: '#D70040', color: 'white'}}
        >
          Ver proyectos
        </button>
      </div>
    </div>
    
    {/* Elementos decorativos */}
    <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-30" style={{backgroundColor: '#FF6347'}}></div>
    <div className="absolute bottom-32 right-16 w-32 h-32 rounded-full opacity-20" style={{backgroundColor: '#800020'}}></div>
    <div className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full" style={{backgroundColor: '#FF2400'}}></div>
  </section>
);

const AboutSection = () => (
  <section className="py-20 px-6" style={{backgroundColor: '#2F2F2F'}}>
    <div className="container mx-auto max-w-4xl text-center text-white">
      <h2 className="text-4xl font-bold mb-8">
        Somos una agencia especializada en el manejo de <span style={{color: '#FF6347'}}>redes sociales</span> y creación de campañas digitales.
      </h2>
      <div className="grid md:grid-cols-2 gap-8 text-left">
        <p className="text-lg text-gray-300 leading-relaxed">
          Demostramos una estrategia de marketing integral basada en el estudio y análisis de la propuesta única de valor que ofrece tu 
          producto o servicio, creando anuncios persuasivos que te han resultado a bajo costo posicionando tu negocio al más alto nivel.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed">
          Siempre analizando en tiempo real la interacción con tus seguidores, obteniendo información que nos permite descubrir nuevas 
          oportunidades de crecimiento, renovando constantemente tu estrategia digital, en base a los objetivos de tu negocio.
        </p>
      </div>
    </div>
  </section>
);

const ServicesSection = () => {
  const services = [
    {
      icon: <TrendingUp className="w-12 h-12 mb-4" style={{color: '#FF2400'}} />,
      title: "ESTRATEGIAS DIGITALES",
      description: "Tomando siempre como referencia el embudo de ventas, desarrollamos estrategias integrales adaptadas a cada etapa: TOFU, MOFU Y BOFU."
    },
    {
      icon: <Edit className="w-12 h-12 mb-4" style={{color: '#FF2400'}} />,
      title: "MARKETING DE CONTENIDOS",
      description: "Diseñamos y generamos contenidos atractivos en diferentes formatos para tus redes sociales adaptando la personalidad de cada red social."
    },
    {
      icon: <Target className="w-12 h-12 mb-4" style={{color: '#FF2400'}} />,
      title: "COPYWRITING",
      description: "Desarrollamos los mejores textos que acompañan tus piezas de video y text adaptando la estrategia de marketing establecida y a que desees transmitir a tu público objetivo."
    },
    {
      icon: <Search className="w-12 h-12 mb-4" style={{color: '#FF2400'}} />,
      title: "SEO / SEM",
      description: "Posicionamos tu sitio web en los buscadores principales para que sea visible en las búsquedas más relevantes de tu sector."
    },
    {
      icon: <Mail className="w-12 h-12 mb-4" style={{color: '#FF2400'}} />,
      title: "E-mail Marketing",
      description: "Desarrollamos campañas de email marketing para generar leads calificados y mantener contacto directo con tus clientes potenciales."
    },
    {
      icon: <Lightbulb className="w-12 h-12 mb-4" style={{color: '#FF2400'}} />,
      title: "Campañas Estratégicas",
      description: "Realizamos todo tipo de campañas que te permitan alcanzar tus objetivos comerciales de manera efectiva y medible."
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16" style={{color: '#1A1A1A'}}>
          DENTRO DEL SERVICIO ENCONTRARÁS
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" style={{backgroundColor: '#f8f9fa'}}>
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-xl font-bold mb-4" style={{color: '#8B0000'}}>{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkSection = () => {
  const projects = [
    {
      title: "Campaña Social Media",
      category: "Redes Sociales",
      image: "https://via.placeholder.com/400x300/FF6347/FFFFFF?text=Proyecto+1",
      description: "Estrategia integral para incrementar engagement y conversiones"
    },
    {
      title: "Identidad Visual",
      category: "Branding",
      image: "https://via.placeholder.com/400x300/D70040/FFFFFF?text=Proyecto+2",
      description: "Desarrollo completo de identidad corporativa moderna"
    },
    {
      title: "E-commerce Digital",
      category: "Desarrollo Web",
      image: "https://via.placeholder.com/400x300/800020/FFFFFF?text=Proyecto+3",
      description: "Plataforma de ventas online con integración completa"
    }
  ];

  return (
    <section className="py-20 px-6" style={{backgroundColor: '#2F2F2F'}}>
      <div className="container mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4 text-white">
          Mira nuestro trabajo
        </h2>
        <p className="text-center text-gray-300 mb-16 text-lg">
          Echa un vistazo a algunos de nuestros proyectos más destacados
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-sm font-medium" style={{color: '#FF6347'}}>{project.category}</span>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-300">{project.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button 
            className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{backgroundColor: '#FF2400', color: 'white'}}
          >
            Ver proyectos
          </button>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="py-20 px-6 bg-white">
    <div className="container mx-auto text-center max-w-4xl">
      <h2 className="text-5xl font-bold mb-8" style={{color: '#1A1A1A'}}>
        ¡Queremos ser tu agencia!
      </h2>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        Queremos ayudarte a alcanzar tus objetivos y potenciar tus ideas. 
        Estamos encantados de aprender qué reunión contigo para hacer 
        un diagnóstico gratuito de tu presencia digital y para que nos 
        cuentes de tu proyecto.
      </p>
      <button 
        className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        style={{backgroundColor: '#8B0000', color: 'white'}}
      >
        Ver Contacto
      </button>
      
      {/* Logo grid */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
        {[1,2,3,4,5,6,7,8].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500 font-medium">Logo {i}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 px-6" style={{backgroundColor: '#1A1A1A'}}>
    <div className="container mx-auto text-center">
      <div className="text-3xl font-bold mb-4" style={{color: '#FF2400'}}>
        admusProduccion
      </div>
      <p className="text-gray-400 mb-8">
        Tu aliado estratégico en marketing digital y crecimiento empresarial
      </p>
      <div className="flex justify-center space-x-6 text-gray-400">
        <a href="#" className="hover:text-red-400 transition-colors">Privacidad</a>
        <a href="#" className="hover:text-red-400 transition-colors">Términos</a>
        <a href="#" className="hover:text-red-400 transition-colors">Contacto</a>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-gray-500">
        © 2024 admusProduccion. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

const Marketing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WorkSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Marketing;