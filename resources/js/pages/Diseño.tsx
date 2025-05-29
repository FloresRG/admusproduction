import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play, Users, Target, TrendingUp, Mail, Search, Edit, Globe, Eye, Lightbulb,
  Palette, Brush, Image, Video, FileText, Award, Calendar, ExternalLink,
  Star, Heart, MessageCircle, Share2, Download, Filter, Grid, List
} from 'lucide-react';
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

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2F2F2F] to-[#000000]">
      {/* Fondo diagonal con gradiente */}
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

      {/* Cuadrícula animada de fondo */}
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

      {/* Elementos decorativos */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            backgroundColor: i % 3 === 0 ? '#FF6347' : i % 3 === 1 ? '#D70040' : '#800020',
            width: Math.random() * 100 + 40,
            height: Math.random() * 100 + 40,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 80 - 40],
            y: [0, Math.random() * 80 - 40],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: Math.random() * 6 + 6,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}

      {/* Contenedor de contenido */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        {/* Lado izquierdo: texto */}
        <motion.div
          className="md:w-1/2 text-left text-white"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
          }}
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight tracking-tight"
            style={{ textShadow: '0 4px 12px rgba(139, 0, 0, 0.5)' }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 1 } },
            }}
          >
            Diseñador <span className="text-[#FF2400] relative">
              Gráfico
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-red-600/20 to-red-400/20 blur-xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 text-gray-200 max-w-lg leading-relaxed"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 1.5 } },
            }}
          >
            Creando experiencias visuales únicas que conectan marcas con emociones. Cada diseño cuenta una historia, cada color transmite un sentimiento.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 2 } },
            }}
          >
            <motion.a
              href="#portfolio"
              className="px-10 py-4 text-xl font-semibold rounded-full bg-[#FF2400] text-white hover:bg-[#FF6347] transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 36, 0, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ver Portfolio
            </motion.a>
            <motion.a
              href="#videos"
              className="px-10 py-4 text-xl font-semibold rounded-full border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Play className="inline mr-2" size={20} />
              Ver Videos
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Lado derecho: Imagen de diseño (sin GIF) */}
        <motion.div
          className="md:w-1/2 flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <div className="w-full max-w-md bg-gradient-to-r from-[#FF2400] via-[#D70040] to-[#800020] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-white text-2xl font-semibold mb-4">¿Listo para crear?</h3>
            <p className="text-white text-sm">Juntos podemos llevar tu marca al siguiente nivel a través de diseños visualmente impactantes y emocionantes.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


const AboutSection = () => {
  const stats = [
    { number: '150+', label: 'Proyectos Completados', icon: <Award size={24} /> },
    { number: '50+', label: 'Clientes Satisfechos', icon: <Users size={24} /> },
    { number: '5+', label: 'Años de Experiencia', icon: <Calendar size={24} /> },
    { number: '20+', label: 'Premios Obtenidos', icon: <Star size={24} /> },
  ];

  return (
    <section id="quienes-somos" className="py-24 px-6 bg-[#2F2F2F]">
      <motion.div
        className="container mx-auto max-w-6xl text-center text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-5xl md:text-6xl font-bold mb-8"
          variants={fadeIn}
        >
          Transformo <span className="text-[#FF6347]">ideas</span> en realidades visuales
        </motion.h2>
        <motion.p
          className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-16"
          variants={fadeIn}
        >
          Con más de 5 años creando identidades visuales impactantes, especializado en branding, diseño editorial, packaging y experiencias digitales. Cada proyecto es una oportunidad de crear algo extraordinario que trascienda lo ordinario.
        </motion.p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg backdrop-blur-sm bg-white/5"
            >
              <div className="text-[#FF2400] mb-2">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold text-[#FF2400] mb-2">{stat.number}</div>
              <div className="text-gray-300 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: <Palette className="w-16 h-16 mb-6" style={{ color: '#FF2400' }} />,
      title: 'Identidad Visual & Branding',
      description: 'Desarrollo completo de marca desde el concepto hasta la implementación. Logos, paletas de colores, tipografías y guías de estilo que definen la personalidad única de tu marca.',
      features: ['Diseño de logotipos', 'Manual de marca', 'Aplicaciones corporativas'],
    },
    {
      icon: <Image className="w-16 h-16 mb-6" style={{ color: '#FF2400' }} />,
      title: 'Diseño Editorial & Print',
      description: 'Creación de materiales impresos que comunican con impacto. Desde revistas y catálogos hasta packaging y material promocional de alta calidad visual.',
      features: ['Revistas y catálogos', 'Packaging creativo', 'Material promocional'],
    },
    {
      icon: <Globe className="w-16 h-16 mb-6" style={{ color: '#FF2400' }} />,
      title: 'Diseño Digital & Web',
      description: 'Experiencias digitales que cautivan y convierten. Diseño de interfaces, banners, redes sociales y contenido visual optimizado para el mundo digital.',
      features: ['UI/UX Design', 'Redes sociales', 'Banners y ads'],
    },
    {
      icon: <Video className="w-16 h-16 mb-6" style={{ color: '#FF2400' }} />,
      title: 'Motion Graphics & Video',
      description: 'Animaciones y gráficos en movimiento que dan vida a tus ideas. Desde logos animados hasta videos promocionales con un toque visual único.',
      features: ['Logo animado', 'Videos promocionales', 'Infografías animadas'],
    },
  ];

  return (
    <section id="servicios" className="py-24 px-6 bg-white">
      <motion.div
        className="container mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div className="text-center mb-20" variants={fadeIn}>
          <h2 className="text-6xl font-bold mb-6 text-[#1A1A1A]">
            Mis Servicios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrezco soluciones integrales de diseño que van desde la conceptualización hasta la implementación final, siempre con un enfoque creativo y estratégico.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-[#f8f9fa]"
            >
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-[#8B0000]">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 rounded-full mr-3 bg-[#FF6347]"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['todos', 'branding', 'editorial', 'digital', 'packaging'];

  const projects = [
    {
      id: 1,
      title: 'Identidad Visual Café Aroma',
      category: 'branding',
     image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
       description: 'Desarrollo completo de identidad visual para cadena de cafeterías premium.',
      tags: ['Logo', 'Branding', 'Packaging'],
      year: '2024',
      likes: 245,
      views: 1200,
    },
    {
      id: 2,
      title: 'Revista Cultural Mestizo',
      category: 'editorial',
       image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
     description: 'Diseño editorial para revista cultural boliviana con enfoque contemporáneo.',
      tags: ['Editorial', 'Layout', 'Tipografía'],
      year: '2024',
      likes: 189,
      views: 890,
    },
    {
      id: 3,
      title: 'App Banking Digital',
      category: 'digital',
     image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
       description: 'Interfaz moderna para aplicación bancaria con enfoque en UX.',
      tags: ['UI/UX', 'Mobile', 'Fintech'],
      year: '2023',
      likes: 312,
      views: 1500,
    },
    {
      id: 4,
      title: 'Packaging Productos Orgánicos',
      category: 'packaging',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Línea de packaging sostenible para productos orgánicos locales.',
      tags: ['Packaging', 'Sostenible', 'Orgánico'],
      year: '2023',
      likes: 278,
      views: 1100,
    },
    {
      id: 5,
      title: 'Branding Tech Startup',
      category: 'branding',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Identidad completa para startup tecnológica emergente.',
      tags: ['Startup', 'Tech', 'Modern'],
      year: '2024',
      likes: 456,
      views: 2100,
    },
    {
      id: 6,
      title: 'Campaña Digital Turismo',
      category: 'digital',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Campaña visual completa para promoción turística de Bolivia.',
      tags: ['Turismo', 'Campaña', 'Bolivia'],
      year: '2023',
      likes: 367,
      views: 1800,
    },
  ];

  const filteredProjects = activeFilter === 'todos' ? projects : projects.filter(project => project.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 px-6 bg-[#1A1A1A]">
      <motion.div
        className="container mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div className="text-center mb-16" variants={fadeIn}>
          <h2 className="text-6xl font-bold mb-6 text-white">
            Portfolio <span className="text-[#FF2400]">Destacado</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Una selección de mis trabajos más representativos, cada uno con su propia historia y desafío creativo único.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map(category => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === category ? 'text-white bg-[#FF2400]' : 'text-gray-400 hover:text-white border-2 border-[#444]'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
          <div className="flex justify-center gap-2 mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#FF2400] text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              <Grid size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-[#FF2400] text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              <List size={20} />
            </motion.button>
          </div>
        </motion.div>
        <div className={`grid gap-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl bg-gray-800 shadow-2xl hover:shadow-[#FF2400]/20 transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-[#FF2400]/80 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-[#FF2400]/80 transition-colors"
                    >
                      <Heart size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#FF2400] transition-colors">{project.title}</h3>
                  <span className="text-sm text-gray-400">{project.year}</span>
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs rounded-full bg-[#FF2400]/30 text-[#FF6347] border border-[#FF2400]/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {project.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {project.views}
                    </span>
                  </div>
                  <motion.a
                    href="#portfolio"
                    whileHover={{ scale: 1.05 }}
                    className="text-[#FF2400] hover:text-[#FF6347] font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Ver más →
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div className="text-center mt-16" variants={fadeIn}>
          <motion.a
            href="#portfolio"
            className="px-10 py-4 text-lg font-semibold rounded-full bg-[#FF2400] text-white hover:bg-[#FF6347] transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 36, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Ver Portfolio Completo
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

const VideoSection = () => {
  const videos = [
    {
      id: 1,
      title: 'Proceso Creativo: Branding desde Cero',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '12:45',
      views: '15.2K',
      likes: '1.2K',
      description: 'Te muestro todo el proceso detrás de la creación de una identidad visual completa.',
      url: 'https://youtube.com/watch?v=example1',
    },
    {
      id: 2,
      title: 'Speed Design: Logo en 30 Minutos',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '8:20',
      views: '28.7K',
      likes: '2.1K',
      description: 'Desafío de velocidad: creando un logo profesional en tiempo récord.',
      url: 'https://youtube.com/watch?v=example2',
    },
    {
      id: 3,
      title: 'Tutorial: Efectos Typography en After Effects',
       thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
       duration: '18:30',
      views: '9.8K',
      likes: '892',
      description: 'Aprende a crear efectos tipográficos impactantes paso a paso.',
      url: 'https://youtube.com/watch?v=example3',
    },
    {
      id: 4,
      title: 'Review: Tendencias de Diseño 2024',
     thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
       duration: '15:12',
      views: '22.1K',
      likes: '1.8K',
      description: 'Análisis completo de las tendencias que están marcando el diseño este año.',
      url: 'https://youtube.com/watch?v=example4',
    },
    {
      id: 5,
      title: 'Behind the Scenes: Sesión de Fotos Producto',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '10:45',
      views: '7.3K',
      likes: '654',
      description: 'Un vistazo detrás de cámaras de una sesión de fotografía de producto.',
      url: 'https://youtube.com/watch?v=example5',
    },
    {
      id: 6,
      title: 'Case Study: Rebranding Completo',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
     duration: '25:18',
      views: '31.5K',
      likes: '2.7K',
      description: 'Caso de estudio: transformación completa de marca de principio a fin.',
       url: 'https://youtube.com/watch?v=example',
    },
  ];

  return (
    <section id="videos" className="py-24 px-6 bg-white">
      <motion.div
        className="container mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div className="text-center mb-16" variants={fadeIn}>
          <h2 className="text-6xl font-bold mb-6 text-[#1A1A1A]">
            Videos & <span className="text-[#FF2400]">Tutoriales</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comparto mi conocimiento y proceso creativo a través de videos educativos, tutoriales y behind-the-scenes de mis proyectos.
          </p>
          <div className="flex justify-center items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-[#FF2400]" />
              <span className="font-semibold">124K</span> reproducciones totales
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF2400]" />
              <span className="font-semibold">8.2K</span> suscriptores
            </div>
          </div>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <motion.a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Play className="w-6 h-6 ml-1 text-[#FF2400]" />
                  </motion.a>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-sm rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-[#FF2400] transition-colors">
                  {video.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{video.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {video.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {video.likes}
                    </span>
                  </div>
                  <motion.a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="text-[#FF2400] hover:text-[#FF6347] font-medium"
                  >
                    Ver video →
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Ana Torres',
      role: 'CEO, Café Aroma',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      quote: 'El trabajo de diseño transformó nuestra marca en algo único y memorable. ¡Superaron todas nuestras expectativas!',
      rating: 5,
    },
    {
      name: 'Carlos Méndez',
      role: 'Director, Revista Mestizo',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      quote: 'Profesionalismo y creatividad en cada detalle. El diseño editorial elevó nuestra publicación a otro nivel.',
      rating: 5,
    },
    {
      name: 'Laura Gómez',
      role: 'Fundadora, EcoProductos',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      quote: 'El packaging sostenible no solo es hermoso, sino que conecta perfectamente con nuestros valores.',
      rating: 4,
    },
  ];

  return (
    <section id="testimonios" className="py-24 px-6 bg-[#2F2F2F]">
      <motion.div
        className="container mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div className="text-center mb-16" variants={fadeIn}>
          <h2 className="text-6xl font-bold mb-6 text-white">
            Lo que <span className="text-[#FF2400]">dicen</span> mis clientes
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            La satisfacción de mis clientes es mi mayor recompensa. Descubre cómo mi trabajo ha impactado sus marcas.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-6 rounded-2xl bg-gray-800 shadow-lg hover:shadow-[#FF2400]/20 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">{testimonial.quote}</p>
              <div className="flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-[#FF2400] fill-[#FF2400]" />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-gray-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
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
        className="text-6xl font-bold mb-8 text-[#1A1A1A]"
        variants={fadeIn}
      >
        ¡Hagamos algo <span className="text-[#FF2400]">increíble</span> juntos!
      </motion.h2>
      <motion.p
        className="text-xl text-gray-600 mb-8 leading-relaxed"
        variants={fadeIn}
      >
        ¿Listo para llevar tu marca al siguiente nivel? Contáctame para discutir tu proyecto y crear algo único.
      </motion.p>
      <motion.a
        href="#contactanos"
        className="px-10 py-4 text-lg font-semibold rounded-full bg-[#FF2400] text-white hover:bg-[#FF6347] transition-all duration-300"
        whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 36, 0, 0.3)' }}
        whileTap={{ scale: 0.95 }}
        variants={fadeIn}
      >
        Contáctame Ahora
      </motion.a>
      <motion.div
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60"
        variants={staggerContainer}
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="h-16 bg-gray-200 rounded flex items-center justify-center"
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-gray-500 font-medium">Partner {i}</span>
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
        Transformando ideas en experiencias visuales únicas.
      </motion.p>
      <motion.div
        className="flex justify-center space-x-6 mb-8"
        variants={staggerContainer}
      >
        {[
          { icon: <MessageCircle size={24} />, href: '#' },
          { icon: <Share2 size={24} />, href: '#' },
          { icon: <Download size={24} />, href: '#' },
        ].map((social, index) => (
          <motion.a
            key={index}
            href={social.href}
            className="text-gray-400 hover:text-[#FF6347] transition-colors"
            variants={fadeIn}
            whileHover={{ scale: 1.2 }}
          >
            {social.icon}
          </motion.a>
        ))}
      </motion.div>
      <motion.div
        className="flex justify-center space-x-6 text-gray-400 mb-8"
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
        className="pt-8 border-t border-[#800020] text-gray-500"
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
      <PortfolioSection />
      <VideoSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Marketing;