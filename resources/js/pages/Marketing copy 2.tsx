import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Users, Target, TrendingUp, Mail, Search, Edit, Globe, Eye, Lightbulb, ArrowRight, Sparkles, Award, CheckCircle, Star, MessageCircle } from 'lucide-react';

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

const floatingAnimation = {
  hidden: { y: 0 },
  visible: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-purple-600/20 to-blue-600/20 animate-pulse"></div>
      </div>

      {/* Animated Grid Background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
      >
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {[...Array(400)].map((_, i) => (
            <motion.div 
              key={i} 
              className="border border-red-500/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.001, duration: 0.5 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-red-500 to-pink-500 opacity-30 blur-xl"
        animate={{ 
          scale: [1, 1.5, 1],
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-25 blur-xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -80, 0],
          y: [0, 80, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between">
        {/* Left Side: Text and Logo */}
        <motion.div
          className="lg:w-1/2 text-left text-white mb-12 lg:mb-0"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Enhanced Logo */}
          <motion.div
            className="mb-12"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 rounded-2xl blur-xl opacity-50"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                <svg width="280" height="100" viewBox="0 0 300 120" className="mx-auto lg:mx-0">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff0066" />
                      <stop offset="50%" stopColor="#ff3366" />
                      <stop offset="100%" stopColor="#cc0044" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <text
                    x="150"
                    y="70"
                    fontFamily="Arial, sans-serif"
                    fontSize="48"
                    fontWeight="900"
                    fill="url(#logoGradient)"
                    textAnchor="middle"
                    filter="url(#glow)"
                  >
                    ADMUS
                  </text>
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={staggerContainer}
          >
            <motion.h1
              className="text-6xl lg:text-8xl font-black mb-8 leading-tight"
              variants={fadeIn}
            >
              <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                MARKETING
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                DIGITAL
              </span>
            </motion.h1>

            <motion.div
              className="flex items-center space-x-4 mb-6"
              variants={fadeIn}
            >
              <motion.div 
                className="flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-red-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-5 h-5 text-red-400" />
                <span className="text-red-200 font-semibold">ADMUS Production</span>
              </motion.div>
            </motion.div>

            <motion.p
              className="text-xl lg:text-2xl mb-12 text-gray-300 max-w-2xl leading-relaxed"
              variants={fadeIn}
            >
              Transformamos ideas en <span className="text-red-400 font-semibold">experiencias digitales extraordinarias</span> que conectan, inspiran y convierten a tu audiencia.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6"
              variants={fadeIn}
            >
              <motion.button
                className="group relative px-8 py-4 text-lg font-bold text-white rounded-full bg-gradient-to-r from-red-600 to-red-500 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative flex items-center justify-center space-x-2">
                  <span>Comenzar Ahora</span>
                  <ArrowRight className="w-5 h-5" />
                </span>
              </motion.button>

              <motion.button
                className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05, borderColor: '#ef4444' }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Portfolio
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side: Enhanced Visual */}
        <motion.div
          className="lg:w-1/2 flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 rounded-3xl blur-2xl opacity-30"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-red-500/20 backdrop-blur-sm"
              variants={floatingAnimation}
              initial="hidden"
              animate="visible"
            >
              <img
                src="/Gflores/fondo.jpeg"
                alt="Marketing Digital"
                className="w-full max-w-lg rounded-2xl shadow-2xl"
              />
              
              {/* Floating Stats */}
              <motion.div
                className="absolute -top-4 -left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+300% ROI</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl"
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>10M+ Alcance</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AboutSection = () => (
  <section id="quienes-somos" className="py-32 px-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-50" />
    
    <motion.div
      className="container mx-auto max-w-7xl relative z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      <div className="text-center mb-20">
        <motion.div
          className="inline-flex items-center space-x-2 bg-red-100 text-red-600 px-6 py-3 rounded-full mb-8"
          variants={fadeIn}
        >
          <Award className="w-5 h-5" />
          <span className="font-semibold">Sobre Nosotros</span>
        </motion.div>

        <motion.h2
          className="text-5xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 bg-clip-text text-transparent"
          variants={fadeIn}
        >
          Tu aliado estratégico en
          <br />
          <span className="text-red-600">marketing digital</span>
        </motion.h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          className="space-y-8"
          variants={staggerContainer}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
            variants={fadeIn}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Estrategias Personalizadas</h3>
                <p className="text-gray-600 leading-relaxed">
                  Creamos estrategias de marketing integrales basadas en un análisis profundo de tu propuesta de valor, diseñando campañas persuasivas que posicionan tu marca al más alto nivel.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
            variants={fadeIn}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Resultados Medibles</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitorizamos en tiempo real las interacciones con tu audiencia, descubriendo oportunidades de crecimiento y optimizando continuamente tu estrategia digital.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          variants={fadeIn}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 rounded-3xl blur-2xl opacity-20 transform rotate-3" />
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white">
            <div className="space-y-8">
              {[
                { number: "500+", label: "Proyectos Exitosos", icon: CheckCircle },
                { number: "98%", label: "Satisfacción Cliente", icon: Star },
                { number: "5 años", label: "Experiencia", icon: Award }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <stat.icon className="w-8 h-8 text-red-400" />
                  <div>
                    <div className="text-3xl font-bold text-white">{stat.number}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </section>
);

const ServicesSection = () => {
  const services = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Estrategias Digitales",
      description: "Desarrollamos estrategias integrales basadas en el embudo de ventas, adaptadas a cada etapa: TOFU, MOFU y BOFU.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Edit className="w-8 h-8" />,
      title: "Marketing de Contenidos",
      description: "Creamos contenido atractivo y personalizado para cada red social, maximizando el impacto de tu marca.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Copywriting",
      description: "Redactamos textos persuasivos que conectan con tu audiencia y refuerzan tu estrategia de marketing.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "SEO / SEM",
      description: "Optimizamos tu presencia en buscadores para que tu marca sea visible en las búsquedas más relevantes.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Marketing",
      description: "Diseñamos campañas de email marketing para generar leads y fidelizar a tus clientes.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Campañas Estratégicas",
      description: "Creamos campañas efectivas y medibles que impulsan tus objetivos comerciales.",
      gradient: "from-yellow-500 to-orange-500"
    },
  ];

  return (
    <section id="servicios" className="py-32 px-6 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-purple-900/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 0, 100, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(100, 0, 255, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <motion.div
        className="container mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="text-center mb-20">
          <motion.div
            className="inline-flex items-center space-x-2 bg-red-500/20 text-red-400 px-6 py-3 rounded-full mb-8 border border-red-500/30"
            variants={fadeIn}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Nuestros Servicios</span>
          </motion.div>

          <motion.h2
            className="text-5xl lg:text-7xl font-black mb-8 text-white"
            variants={fadeIn}
          >
            Servicios que
            <br />
            <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              transforman
            </span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={fadeIn}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl transform transition-transform group-hover:rotate-1" />
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 group-hover:border-red-500/50 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-red-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {service.description}
                </p>
                
                <motion.div
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ x: 5 }}
                >
                  <ArrowRight className="w-5 h-5 text-red-400" />
                </motion.div>
              </div>
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
      title: "Campaña Social Media Revolution",
      category: "Social Media",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Estrategia integral que incrementó el engagement en un 400% y las conversiones en un 250%.",
      stats: "+400% Engagement"
    },
    {
      title: "Identidad Visual Disruptiva",
      category: "Branding",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Rediseño completo de identidad que posicionó la marca como líder en su sector.",
      stats: "+300% Reconocimiento"
    },
    {
      title: "E-commerce NextGen",
      category: "Desarrollo Web",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Plataforma de ventas con IA integrada que aumentó las ventas en un 500%.",
      stats: "+500% Ventas"
    },
  ];

  return (
    <section className="py-32 px-6 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
      <motion.div
        className="container mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="text-center mb-20">
          <motion.div
            className="inline-flex items-center space-x-2 bg-purple-100 text-purple-600 px-6 py-3 rounded-full mb-8"
            variants={fadeIn}
          >
            <Eye className="w-5 h-5" />
            <span className="font-semibold">Portfolio</span>
          </motion.div>

          <motion.h2
            className="text-5xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-gray-900 via-purple-600 to-gray-900 bg-clip-text text-transparent"
            variants={fadeIn}
          >
            Proyectos que
            <br />
            <span className="text-purple-600">inspiran</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500"
              variants={fadeIn}
              whileHover={{ scale: 1.03, y: -10 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <motion.div
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {project.stats}
                </motion.div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {project.description}
                </p>
                
                <motion.button
                  className="flex items-center space-x-2 text-purple-600 font-semibold group-hover:text-purple-700 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <span>Ver proyecto</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center" variants={fadeIn}>
          <motion.button
            className="px-12 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Todos los Proyectos
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

const CTASection = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/companies'); // Ajusta la ruta según tu API
      const data = await response.json();
      setCompanies(data.slice(0, 6)); // Limitar a 6 empresas
    } catch (error) {
      console.error('Error fetching companies:', error);
      // Datos de fallback si no se puede conectar a la API
      setCompanies([
        { id: 1, name: 'Company 1', logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { id: 2, name: 'Company 2', logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { id: 3, name: 'Company 3', logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { id: 4, name: 'Company 4', logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { id: 5, name: 'Company 5', logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { id: 6, name: 'Company 6', logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contactanos" className="py-32 px-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-purple-600/10 to-blue-600/10" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              y: [null, Math.random() * -100 - 100],
              opacity: [0.3, 0.7, 0.3] 
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2 
            }}
          />
        ))}
      </div>

      <motion.div
        className="container mx-auto text-center max-w-6xl relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {/* Main CTA Content */}
        <motion.div
          className="mb-20"
          variants={staggerContainer}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-red-500/20 text-red-400 px-6 py-3 rounded-full mb-8 border border-red-500/30 backdrop-blur-sm"
            variants={fadeIn}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">¡Hablemos!</span>
          </motion.div>

          <motion.h2
            className="text-5xl lg:text-8xl font-black mb-8 text-white leading-tight"
            variants={fadeIn}
          >
            ¡Eleva tu marca
            <br />
            <span className="bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              con nosotros!
            </span>
          </motion.h2>

          <motion.p
            className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto"
            variants={fadeIn}
          >
            Estamos listos para <span className="text-red-400 font-semibold">transformar tu presencia digital</span>. 
            Agenda una consulta gratuita y descubre cómo podemos llevar tu proyecto al siguiente nivel.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={fadeIn}
          >
            <motion.button
              className="group relative px-12 py-6 text-xl font-bold text-white rounded-full bg-gradient-to-r from-red-600 to-pink-600 overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center justify-center space-x-3">
                <span>Contactar Ahora</span>
                <MessageCircle className="w-6 h-6" />
              </span>
            </motion.button>

            <motion.button
              className="px-12 py-6 text-xl font-semibold text-white border-2 border-white/30 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05, borderColor: '#ef4444' }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Casos de Éxito
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Trust Section */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10"
          variants={fadeIn}
        >
          <motion.div
            className="mb-12"
            variants={fadeIn}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Empresas que confían en nosotros
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full" />
          </motion.div>

          {/* Companies Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-24 h-24 bg-white/10 rounded-2xl animate-pulse"
                  variants={fadeIn}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
              variants={staggerContainer}
            >
              {companies.map((company, index) => (
                <motion.div
                  key={company.id}
                  className="group relative"
                  variants={fadeIn}
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 group-hover:border-red-500/50 transition-all duration-300 overflow-hidden flex items-center justify-center">
                    <img 
                      src={company.logo} 
                      alt={company.name}
                      className="max-w-full max-h-full object-contain p-2 filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        // Fallback si la imagen no carga
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=ef4444&color=fff&size=96`;
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Stats Section */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/10"
            variants={staggerContainer}
          >
            {[
              { number: "500+", label: "Clientes Satisfechos", icon: Users },
              { number: "98%", label: "Tasa de Éxito", icon: TrendingUp },
              { number: "24/7", label: "Soporte Continuo", icon: MessageCircle }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-20 px-6 bg-black relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-purple-900/10" />
    
    <motion.div
      className="container mx-auto relative z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      <div className="grid lg:grid-cols-4 gap-12 mb-16">
        {/* Logo and Description */}
        <motion.div
          className="lg:col-span-2"
          variants={fadeIn}
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div className="text-3xl font-bold text-white">
              admus<span className="text-red-400">Produccion</span>
            </div>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Tu aliado estratégico en marketing digital y crecimiento empresarial. 
            Transformamos ideas en experiencias digitales extraordinarias.
          </p>
        </motion.div>

        {/* Services */}
        <motion.div variants={fadeIn}>
          <h4 className="text-white font-bold text-lg mb-6">Servicios</h4>
          <ul className="space-y-3 text-gray-400">
            {['Marketing Digital', 'Desarrollo Web', 'Diseño Gráfico', 'SEO/SEM', 'Redes Sociales'].map((service) => (
              <li key={service}>
                <a href="#" className="hover:text-red-400 transition-colors">
                  {service}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div variants={fadeIn}>
          <h4 className="text-white font-bold text-lg mb-6">Contacto</h4>
          <ul className="space-y-3 text-gray-400">
            <li>hello@admusproduccion.com</li>
            <li>+1 (555) 123-4567</li>
            <li>La Paz, Bolivia</li>
          </ul>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
        variants={fadeIn}
      >
        <div className="text-gray-500 mb-4 md:mb-0">
          © 2025 admusProduccion. Todos los derechos reservados.
        </div>
        <div className="flex space-x-6">
          {['Privacidad', 'Términos', 'Cookies'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-gray-500 hover:text-red-400 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
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