import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Users, Target, TrendingUp, Mail, Search, Edit, Globe, Eye, Lightbulb } from 'lucide-react';
import Header from '../components/header'; // Adjust path as needed

// Animation variants for Framer Motion
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
};

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] via-[#2F2F2F] to-[#000000] overflow-hidden">
      {/* Diagonal Background Split */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="diagonalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2400" />
              <stop offset="100%" stopColor="#D70040" />
            </linearGradient>
          </defs>
          <polygon points="0,0 100%,0 0,100%" fill="url(#diagonalGradient)" fillOpacity="0.8" />
        </svg>
      </div>

      {/* Background Grid */}
      <motion.div
        className="absolute inset-0 opacity-15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
      >
        <div className="grid grid-cols-12 grid-rows-12 h-full">
          {[...Array(144)].map((_, i) => (
            <div key={i} className="border border-[#800020]" />
          ))}
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-10 left-16 w-40 h-40 rounded-full bg-[#FF6347] opacity-20"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-16 right-24 w-56 h-56 rounded-full bg-[#800020] opacity-15"
        animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-10 h-10 rounded-full bg-[#FF2400]"
        animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side: Text and Logo */}
        <motion.div
          className="md:w-1/2 text-left text-white mb-8 md:mb-0"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Logo with Glow Effect */}
          <motion.div
            className="mb-8"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <svg width="250" height="120" viewBox="0 0 300 150" className="mx-auto md:mx-0">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF2400" />
                  <stop offset="100%" stopColor="#8B0000" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path d="M80 20 L150 20 L190 130 L120 130 Z" fill="url(#logoGradient)" filter="url(#glow)" />
              <text
                x="150"
                y="120"
                fontFamily="Arial, sans-serif"
                fontSize="60"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
                filter="url(#glow)"
              >
                ADMUS
              </text>
            </svg>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
            style={{ textShadow: '0 4px 12px rgba(139, 0, 0, 0.5)' }}
            variants={fadeIn}
          >
             MARKETING<span className="text-[#FF2400]">DIGITAL </span>
          </motion.h1>
          <motion.h2
            className="text-3xl md:text-4xl font-semibold mb-6 text-white"
            variants={fadeIn}
          >
           ADMUS   <span className="text-[#FF6347]">Production</span> 
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl mb-8 text-gray-200 max-w-lg leading-relaxed"
            variants={fadeIn}
          >
            Creamos contenido audiovisual y estrategias digitales que conectan, inspiran y convierten.
          </motion.p>
          <motion.a
            href="#quienes-somos"
            className="inline-block px-8 py-4 text-lg font-bold text-white rounded-full bg-[#D70040] hover:bg-[#FF6347] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            style={isHovered ? { boxShadow: '0 0 20px rgba(255, 99, 71, 0.7)' } : {}}
            variants={fadeIn}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Comienza Ahora
          </motion.a>
        </motion.div>

        {/* Right Side: GIF */}
        <motion.div
          className="md:w-1/2 flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <img
            src="/Gflores/fondo.jpeg"
            alt="Marketing Animation"
            className="w-full max-w-md rounded-lg shadow-2xl border-4 border-[#FF2400] hover:scale-105 transition-transform duration-300"
            style={{ boxShadow: '0 0 25px rgba(255, 36, 0, 0.5)' }}
          />
        </motion.div>
      </div>
    </section>
  );
};

const AboutSection = () => (
  <section id="quienes-somos" className="py-24 px-6 bg-[#2F2F2F]">
    <motion.div
      className="container mx-auto max-w-5xl text-center text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold mb-10"
        variants={fadeIn}
      >
        Somos tu aliado en <span className="text-[#FF6347]">marketing digital</span>
      </motion.h2>
      <div className="grid md:grid-cols-2 gap-12 text-left">
        <motion.p
          className="text-lg text-gray-300 leading-relaxed"
          variants={fadeIn}
        >
          Creamos estrategias de marketing integrales basadas en un análisis profundo de tu propuesta de valor, diseñando campañas persuasivas que posicionan tu marca al más alto nivel con un enfoque eficiente y rentable.
        </motion.p>
        <motion.p
          className="text-lg text-gray-300 leading-relaxed"
          variants={fadeIn}
        >
          Monitorizamos en tiempo real las interacciones con tu audiencia, descubriendo oportunidades de crecimiento y optimizando continuamente tu estrategia digital para alinearlas con los objetivos de tu negocio.
        </motion.p>
      </div>
    </motion.div>
  </section>
);

const ServicesSection = () => {
  const services = [
    {
      icon: <TrendingUp className="w-12 h-12 mb-4 text-[#FF2400]" />,
      title: "Estrategias Digitales",
      description: "Desarrollamos estrategias integrales basadas en el embudo de ventas, adaptadas a cada etapa: TOFU, MOFU y BOFU.",
    },
    {
      icon: <Edit className="w-12 h-12 mb-4 text-[#FF2400]" />,
      title: "Marketing de Contenidos",
      description: "Creamos contenido atractivo y personalizado para cada red social, maximizando el impacto de tu marca.",
    },
    {
      icon: <Target className="w-12 h-12 mb-4 text-[#FF2400]" />,
      title: "Copywriting",
      description: "Redactamos textos persuasivos que conectan con tu audiencia y refuerzan tu estrategia de marketing.",
    },
    {
      icon: <Search className="w-12 h-12 mb-4 text-[#FF2400]" />,
      title: "SEO / SEM",
      description: "Optimizamos tu presencia en buscadores para que tu marca sea visible en las búsquedas más relevantes.",
    },
    {
      icon: <Mail className="w-12 h-12 mb-4 text-[#FF2400]" />,
      title: "Email Marketing",
      description: "Diseñamos campañas de email marketing para generar leads y fidelizar a tus clientes.",
    },
    {
      icon: <Lightbulb className="w-12 h-12 mb-4 text-[#FF2400]" />,
      title: "Campañas Estratégicas",
      description: "Creamos campañas efectivas y medibles que impulsan tus objetivos comerciales.",
    },
  ];

  return (
    <section id="como-trabajamos" className="py-24 px-6 bg-white">
      <motion.div
        className="container mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-5xl font-bold text-center mb-16 text-[#1A1A1A]"
          variants={fadeIn}
        >
          Nuestros Servicios
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="text-center p-8 rounded-xl bg-gray-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
            >
              {service.icon}
              <h3 className="text-xl font-bold mb-4 text-[#8B0000]">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const WorkSection = () => {
  const projects = [
    {
      title: "Campaña Social Media",
      category: "Redes Sociales",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Estrategia integral para incrementar engagement y conversiones.",
    },
    {
      title: "Identidad Visual",
      category: "Branding",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Desarrollo completo de identidad corporativa moderna.",
    },
    {
      title: "E-commerce Digital",
      category: "Desarrollo Web",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Plataforma de ventas online con integración completa.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#2F2F2F]">
      <motion.div
        className="container mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-5xl font-bold text-center mb-4 text-white"
          variants={fadeIn}
        >
          Nuestro Portafolio
        </motion.h2>
        <motion.p
          className="text-center text-gray-300 mb-16 text-lg"
          variants={fadeIn}
        >
          Descubre algunos de nuestros proyectos más destacados.
        </motion.p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-xl hover:shadow-2xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-sm font-medium text-[#FF6347]">{project.category}</span>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-300">{project.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div className="text-center" variants={fadeIn}>
          <button
            className="px-8 py-4 text-lg font-semibold rounded-full bg-[#FF2400] text-white hover:bg-[#FF6347] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            Ver Más Proyectos
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

const CTASection = () => (
   <section id="contactanos" className="py-24 px-6 bg-white">
    <motion.div
      className="container mx-auto text-center max-w-4xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      <motion.h2
        className="text-5xl font-bold mb-8 text-[#1A1A1A]"
        variants={fadeIn}
      >
        ¡Eleva tu marca con nosotros!
      </motion.h2>
      <motion.p
        className="text-xl text-gray-600 mb-8 leading-relaxed"
        variants={fadeIn}
      >
        Estamos listos para impulsar tu presencia digital. Agenda una consulta gratuita y descubre cómo podemos llevar tu proyecto al siguiente nivel.
      </motion.p>
      <motion.button
        className="px-8 py-4 text-lg font-semibold rounded-full bg-[#8B0000] text-white hover:bg-[#D70040] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        variants={fadeIn}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Contáctanos
      </motion.button>
      {/* Logo Grid */}
      <motion.div
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60"
        variants={staggerContainer}
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="h-24 w-24 rounded-full flex items-center justify-center overflow-hidden"
            variants={fadeIn}
          >
            <img src="https://importadoramiranda.com/images/logo.png" alt={`Partner ${i}`} className="max-w-none max-h-none" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

const Footer = () => (
  <footer className="py-12 px-6 bg-[#1A1A1A]">
    <motion.div
      className="container mx-auto text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      <motion.div
        className="text-3xl font-bold mb-4 text-[#FF2400]"
        variants={fadeIn}
      >
        admusProduccion
      </motion.div>
      <motion.p
        className="text-gray-400 mb-8"
        variants={fadeIn}
      >
        Tu aliado estratégico en marketing digital y crecimiento empresarial.
      </motion.p>
      <motion.div
        className="flex justify-center space-x-6 text-gray-400"
        variants={staggerContainer}
      >
        {['Privacidad', 'Términos', 'Contacto'].map((link) => (
          <motion.a
            key={link}
            href="#"
            className="hover:text-[#FF6347] transition-colors"
            variants={fadeIn}
            whileHover={{ scale: 1.1 }}
          >
            {link}
          </motion.a>
        ))}
      </motion.div>
      <motion.div
        className="mt-8 pt-8 border-t border-[#800020] text-gray-500"
        variants={fadeIn}
      >
        © 2025 admusProduccion. Todos los derechos reservados.
      </motion.div>
    </motion.div>
  </footer>
);
const Marketing = () => {
  return (
    <div className="min-h-screen font-sans">
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