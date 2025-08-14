import { motion } from 'framer-motion';
import { useState } from 'react';

import {
    Award,
    Calendar,
    Download,
    ExternalLink,
    Eye,
    Globe,
    Grid,
    Heart,
    Image,
    List,
    MessageCircle,
    Palette,
    Play,
    Share2,
    Star,
    Users,
    Video,
} from 'lucide-react';
import { BsStars } from 'react-icons/bs';
import { FaPalette, FaPlay } from 'react-icons/fa';
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
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2F2F2F] to-[#000000]">
            {/* Fondo diagonal con gradiente */}
            <div className="absolute inset-0">
                <svg className="h-full w-full" preserveAspectRatio="none">
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
            <motion.div className="absolute inset-0 opacity-15" initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 1 }}>
                <div className="grid h-full grid-cols-12 grid-rows-12">
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
            <div className="relative z-10 container mx-auto flex flex-col items-center justify-between space-y-12 px-6 md:flex-row md:space-y-0">
                {/* Lado izquierdo */}
                <motion.div
                    className="text-left text-white md:w-1/2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
                    }}
                >
                    <motion.h1
                        className="mb-6 text-5xl leading-tight font-extrabold tracking-tight md:text-7xl lg:text-8xl"
                        style={{ textShadow: '0 4px 16px rgba(255, 36, 0, 0.5)' }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { duration: 1 } },
                        }}
                    >
                        <span className="inline-flex items-center gap-3">
                            <FaPalette className="text-[#FF2400]" />
                            Diseñador
                        </span>
                        <span className="relative ml-2 text-[#FF2400]">
                            Gráfico
                            <motion.div
                                className="absolute -inset-2 rounded-md bg-gradient-to-r from-red-600/30 to-gray-700/30 blur-xl"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </span>
                    </motion.h1>

                    <motion.p
                        className="mb-8 max-w-lg text-lg leading-relaxed text-gray-300 md:text-xl"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { duration: 1.5 } },
                        }}
                    >
                        Creando <span className="font-semibold text-[#FF2400]">experiencias visuales</span> únicas que conectan marcas con emociones.
                        Cada diseño cuenta una historia, cada color transmite un sentimiento.
                    </motion.p>

                    <motion.div
                        className="flex flex-col gap-6 sm:flex-row"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { duration: 2 } },
                        }}
                    >
                        <motion.a
                            href="#portfolio"
                            className="rounded-full bg-gradient-to-r from-[#FF2400] via-[#8B0000] to-[#2F2F2F] px-10 py-4 text-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-red-600/40"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <BsStars className="mr-2 inline" />
                            Ver Portfolio
                        </motion.a>

                        <motion.a
                            href="#videos"
                            className="rounded-full border-2 border-white px-10 py-4 text-xl font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <FaPlay className="mr-2 inline" />
                            Ver Videos
                        </motion.a>
                    </motion.div>
                </motion.div>

                {/* Lado derecho */}
                <motion.div
                    className="flex justify-center md:w-1/2 md:justify-end"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                >
                    <div className="w-full max-w-md rounded-3xl border border-[#FF2400]/20 bg-gradient-to-br from-[#FF2400] via-[#333] to-[#1a1a1a] p-6 text-white shadow-2xl transition-transform duration-300 hover:scale-105">
                        <h3 className="mb-3 text-2xl font-bold">¿Listo para crear?</h3>
                        <p className="text-sm text-gray-200">
                            Juntos podemos llevar tu marca al siguiente nivel a través de diseños visualmente impactantes y emocionalmente poderosos.
                        </p>
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
        <section id="quienes-somos" className="bg-[#2F2F2F] px-6 py-24">
            <motion.div
                className="container mx-auto max-w-6xl text-center text-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <motion.h2 className="mb-8 text-5xl font-bold md:text-6xl" variants={fadeIn}>
                    Transformo <span className="text-[#FF6347]">ideas</span> en realidades visuales
                </motion.h2>
                <motion.p className="mx-auto mb-16 max-w-4xl text-xl leading-relaxed text-gray-300" variants={fadeIn}>
                    Con más de 5 años creando identidades visuales impactantes, especializado en branding, diseño editorial, packaging y experiencias
                    digitales. Cada proyecto es una oportunidad de crear algo extraordinario que trascienda lo ordinario.
                </motion.p>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            whileHover={{ scale: 1.05 }}
                            className="rounded-lg bg-white/5 p-6 backdrop-blur-sm"
                        >
                            <div className="mb-2 text-[#FF2400]">{stat.icon}</div>
                            <div className="mb-2 text-4xl font-bold text-[#FF2400] md:text-5xl">{stat.number}</div>
                            <div className="font-medium text-gray-300">{stat.label}</div>
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
            icon: <Palette className="mb-6 h-16 w-16" style={{ color: '#FF2400' }} />,
            title: 'Identidad Visual & Branding',
            description:
                'Desarrollo completo de marca desde el concepto hasta la implementación. Logos, paletas de colores, tipografías y guías de estilo que definen la personalidad única de tu marca.',
            features: ['Diseño de logotipos', 'Manual de marca', 'Aplicaciones corporativas'],
        },
        {
            icon: <Image className="mb-6 h-16 w-16" style={{ color: '#FF2400' }} />,
            title: 'Diseño Editorial & Print',
            description:
                'Creación de materiales impresos que comunican con impacto. Desde revistas y catálogos hasta packaging y material promocional de alta calidad visual.',
            features: ['Revistas y catálogos', 'Packaging creativo', 'Material promocional'],
        },
        {
            icon: <Globe className="mb-6 h-16 w-16" style={{ color: '#FF2400' }} />,
            title: 'Diseño Digital & Web',
            description:
                'Experiencias digitales que cautivan y convierten. Diseño de interfaces, banners, redes sociales y contenido visual optimizado para el mundo digital.',
            features: ['UI/UX Design', 'Redes sociales', 'Banners y ads'],
        },
        {
            icon: <Video className="mb-6 h-16 w-16" style={{ color: '#FF2400' }} />,
            title: 'Motion Graphics & Video',
            description:
                'Animaciones y gráficos en movimiento que dan vida a tus ideas. Desde logos animados hasta videos promocionales con un toque visual único.',
            features: ['Logo animado', 'Videos promocionales', 'Infografías animadas'],
        },
    ];

    return (
    <section id="servicios" className="bg-gradient-to-br from-[#1a1a1a] via-[#2f2f2f] to-[#3e3e3e] px-6 py-24 text-white">
      <motion.div
        className="container mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {/* Título de la sección */}
        <motion.div className="mb-20 text-center" variants={fadeIn}>
          <h2 className="mb-6 text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF2400] via-[#8B0000] to-[#2f2f2f]">
            Mis Servicios
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-300">
            Ofrezco soluciones integrales de diseño que van desde la conceptualización hasta la implementación final, siempre con un enfoque creativo y estratégico.
          </p>
        </motion.div>

        {/* Tarjetas de servicios */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              whileHover={{ y: -12, scale: 1.03 }}
              className="relative overflow-hidden rounded-3xl bg-[#121212] p-8 shadow-xl transition-all duration-300 hover:shadow-red-700/40 group"
            >
              {/* Sombra animada al fondo */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#FF2400]/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 blur-2xl" />

              {/* Contenido */}
              <div className="relative z-10">
                <div className="mb-6 text-[#FF6347] text-4xl">{service.icon}</div>

                <h3 className="mb-4 text-2xl font-semibold text-white">
                  {service.title}
                </h3>

                <p className="mb-6 text-gray-400 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 text-gray-300">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#FF2400] inline-block" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
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

    const filteredProjects = activeFilter === 'todos' ? projects : projects.filter((project) => project.category === activeFilter);

    return (
        <section id="portfolio" className="bg-[#1A1A1A] px-6 py-24">
            <motion.div className="container mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                <motion.div className="mb-16 text-center" variants={fadeIn}>
                    <h2 className="mb-6 text-6xl font-bold text-white">
                        Portfolio <span className="text-[#FF2400]">Destacado</span>
                    </h2>
                    <p className="mx-auto mb-12 max-w-3xl text-xl text-gray-300">
                        Una selección de mis trabajos más representativos, cada uno con su propia historia y desafío creativo único.
                    </p>
                    <div className="mb-8 flex flex-wrap justify-center gap-4">
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveFilter(category)}
                                className={`rounded-full px-6 py-3 font-medium transition-all duration-300 ${
                                    activeFilter === category ? 'bg-[#FF2400] text-white' : 'border-2 border-[#444] text-gray-400 hover:text-white'
                                }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </motion.button>
                        ))}
                    </div>
                    <div className="mb-12 flex justify-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setViewMode('grid')}
                            className={`rounded-lg p-3 transition-colors ${
                                viewMode === 'grid' ? 'bg-[#FF2400] text-white' : 'bg-gray-700 text-gray-300'
                            }`}
                        >
                            <Grid size={20} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setViewMode('list')}
                            className={`rounded-lg p-3 transition-colors ${
                                viewMode === 'list' ? 'bg-[#FF2400] text-white' : 'bg-gray-700 text-gray-300'
                            }`}
                        >
                            <List size={20} />
                        </motion.button>
                    </div>
                </motion.div>
                <div className={`grid gap-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'mx-auto max-w-4xl grid-cols-1'}`}>
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group relative overflow-hidden rounded-2xl bg-gray-800 shadow-2xl transition-all duration-300 hover:shadow-[#FF2400]/20"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-[#FF2400]/80"
                                        >
                                            <ExternalLink size={16} />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-[#FF2400]/80"
                                        >
                                            <Heart size={16} />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-3 flex items-start justify-between">
                                    <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#FF2400]">{project.title}</h3>
                                    <span className="text-sm text-gray-400">{project.year}</span>
                                </div>
                                <p className="mb-4 leading-relaxed text-gray-300">{project.description}</p>
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {project.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="rounded-full border border-[#FF2400]/30 bg-[#FF2400]/30 px-3 py-1 text-xs text-[#FF6347]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-400">
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
                                        className="font-medium text-[#FF2400] hover:text-[#FF6347]"
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
                <motion.div className="mt-16 text-center" variants={fadeIn}>
                    <motion.a
                        href="#portfolio"
                        className="rounded-full bg-[#FF2400] px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-[#FF6347]"
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
        <section id="videos" className="bg-white px-6 py-24">
            <motion.div className="container mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                <motion.div className="mb-16 text-center" variants={fadeIn}>
                    <h2 className="mb-6 text-6xl font-bold text-[#1A1A1A]">
                        Videos & <span className="text-[#FF2400]">Tutoriales</span>
                    </h2>
                    <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
                        Comparto mi conocimiento y proceso creativo a través de videos educativos, tutoriales y behind-the-scenes de mis proyectos.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                            <Play className="h-5 w-5 text-[#FF2400]" />
                            <span className="font-semibold">124K</span> reproducciones totales
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-[#FF2400]" />
                            <span className="font-semibold">8.2K</span> suscriptores
                        </div>
                    </div>
                </motion.div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
                        >
                            <div className="relative">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <motion.a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg"
                                    >
                                        <Play className="ml-1 h-6 w-6 text-[#FF2400]" />
                                    </motion.a>
                                </div>
                                <div className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-sm text-white">{video.duration}</div>
                            </div>
                            <div className="p-6">
                                <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#FF2400]">{video.title}</h3>
                                <p className="mb-4 text-sm leading-relaxed text-gray-600">{video.description}</p>
                                <div className="flex items-center justify-between text-sm text-gray-400">
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
                                        className="font-medium text-[#FF2400] hover:text-[#FF6347]"
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
        <section id="testimonios" className="bg-[#2F2F2F] px-6 py-24">
            <motion.div
                className="container mx-auto max-w-6xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <motion.div className="mb-16 text-center" variants={fadeIn}>
                    <h2 className="mb-6 text-6xl font-bold text-white">
                        Lo que <span className="text-[#FF2400]">dicen</span> mis clientes
                    </h2>
                    <p className="mx-auto max-w-3xl text-xl text-gray-300">
                        La satisfacción de mis clientes es mi mayor recompensa. Descubre cómo mi trabajo ha impactado sus marcas.
                    </p>
                </motion.div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="rounded-2xl bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:shadow-[#FF2400]/20"
                        >
                            <div className="mb-4 flex items-center">
                                <img src={testimonial.image} alt={testimonial.name} className="mr-4 h-12 w-12 rounded-full object-cover" />
                                <div>
                                    <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                            <p className="mb-4 leading-relaxed text-gray-300">{testimonial.quote}</p>
                            <div className="flex items-center gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-[#FF2400] text-[#FF2400]" />
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
    <section id="contactanos" className="bg-white px-6 py-24">
        <motion.div
            className="container mx-auto max-w-4xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
        >
            <motion.h2 className="mb-8 text-6xl font-bold text-[#1A1A1A]" variants={fadeIn}>
                ¡Hagamos algo <span className="text-[#FF2400]">increíble</span> juntos!
            </motion.h2>
            <motion.p className="mb-8 text-xl leading-relaxed text-gray-600" variants={fadeIn}>
                ¿Listo para llevar tu marca al siguiente nivel? Contáctame para discutir tu proyecto y crear algo único.
            </motion.p>
            <motion.a
                href="#contactanos"
                className="rounded-full bg-[#FF2400] px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-[#FF6347]"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 36, 0, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                variants={fadeIn}
            >
                Contáctame Ahora
            </motion.a>
            <motion.div className="mt-16 grid grid-cols-2 items-center gap-8 opacity-60 md:grid-cols-4" variants={staggerContainer}>
                {[1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        className="flex h-16 items-center justify-center rounded bg-gray-200"
                        variants={fadeIn}
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="font-medium text-gray-500">Partner {i}</span>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    </section>
);

const Footer = () => (
    <footer className="bg-[#1A1A1A] px-6 py-12">
        <motion.div
            className="container mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
        >
            <motion.div className="mb-4 text-3xl font-bold text-[#FF2400]" variants={fadeIn}>
                admusProduccion
            </motion.div>
            <motion.p className="mb-8 text-gray-400" variants={fadeIn}>
                Transformando ideas en experiencias visuales únicas.
            </motion.p>
            <motion.div className="mb-8 flex justify-center space-x-6" variants={staggerContainer}>
                {[
                    { icon: <MessageCircle size={24} />, href: '#' },
                    { icon: <Share2 size={24} />, href: '#' },
                    { icon: <Download size={24} />, href: '#' },
                ].map((social, index) => (
                    <motion.a
                        key={index}
                        href={social.href}
                        className="text-gray-400 transition-colors hover:text-[#FF6347]"
                        variants={fadeIn}
                        whileHover={{ scale: 1.2 }}
                    >
                        {social.icon}
                    </motion.a>
                ))}
            </motion.div>
            <motion.div className="mb-8 flex justify-center space-x-6 text-gray-400" variants={staggerContainer}>
                {['Privacidad', 'Términos', 'Contacto'].map((link) => (
                    <motion.a key={link} href="#" className="transition-colors hover:text-[#FF6347]" variants={fadeIn} whileHover={{ scale: 1.1 }}>
                        {link}
                    </motion.a>
                ))}
            </motion.div>
            <motion.div className="border-t border-[#800020] pt-8 text-gray-500" variants={fadeIn}>
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
