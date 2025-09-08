"use client"

import AppLayout from "@/layouts/app-layout"
import type { PageProps } from "@/types"
import { Head } from "@inertiajs/react"
import { Box, Button, Grid, Paper, Typography, LinearProgress, Chip } from "@mui/material"
import { motion } from "framer-motion"

interface DashboardProps extends PageProps {
  user: {
    name: string
  }
  estadisticas: {
    pendiente: number
    en_revision: number
    publicada: number
  }
}

// Iconos SVG personalizados
const ClockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const EyeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

const BarChartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="12" width="4" height="9" rx="1" />
    <rect x="10" y="8" width="4" height="13" rx="1" />
    <rect x="17" y="4" width="4" height="17" rx="1" />
  </svg>
)

const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
  </svg>
)

const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const AwardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
)

const RocketIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
    <path d="M5 21L12 14L19 21" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
)

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
)

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M7 12l4-4 4 4 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="7" cy="12" r="2" />
    <circle cx="11" cy="8" r="2" />
    <circle cx="15" cy="12" r="2" />
    <circle cx="21" cy="6" r="2" />
  </svg>
)

export default function Dashboard({ user, estadisticas }: DashboardProps) {
  const breadcrumbs = [{ title: "Panel de control", href: "/dashboard" }]

  const totalTareas = estadisticas.pendiente + estadisticas.en_revision + estadisticas.publicada
  const completionRate = totalTareas > 0 ? (estadisticas.publicada / totalTareas) * 100 : 0
  const inProgressRate = totalTareas > 0 ? (estadisticas.en_revision / totalTareas) * 100 : 0

  const statsCards = [
    {
      title: "Tareas Pendientes",
      value: estadisticas.pendiente,
      icon: <ClockIcon />,
      color: "#ff9800",
      bgColor: "#fff3e0",
      description: "Por completar",
      gradient: "linear-gradient(135deg, #ff9800, #f57c00)",
    },
    {
      title: "En Revisión",
      value: estadisticas.en_revision,
      icon: <EyeIcon />,
      color: "#2196f3",
      bgColor: "#e3f2fd",
      description: "Esperando aprobación",
      gradient: "linear-gradient(135deg, #2196f3, #1976d2)",
    },
    {
      title: "Publicadas",
      value: estadisticas.publicada,
      icon: <CheckCircleIcon />,
      color: "#4caf50",
      bgColor: "#e8f5e8",
      description: "Completadas exitosamente",
      gradient: "linear-gradient(135deg, #4caf50, #388e3c)",
    },
    {
      title: "Total de Tareas",
      value: totalTareas,
      icon: <BarChartIcon />,
      color: "#9c27b0",
      bgColor: "#f3e5f5",
      description: "Tareas gestionadas",
      gradient: "linear-gradient(135deg, #9c27b0, #7b1fa2)",
    },
  ]

  const performanceMetrics = [
    {
      label: "Tasa de Finalización",
      value: completionRate,
      color: "#4caf50",
      icon: <TargetIcon />,
    },
    {
      label: "Tareas en Proceso",
      value: inProgressRate,
      color: "#2196f3",
      icon: <TrendingUpIcon />,
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 10 } },
    hover: {
      scale: 1.03,
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      transition: { duration: 0.3 },
    },
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Panel de Control" />

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "2rem 1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background elements */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "60%",
            right: "15%",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "3rem", zIndex: 1 }}
        >
          <motion.img
            src="/Gflores/logo.png"
            alt="Logotipo de Admus Producción"
            className="mb-6 w-24 drop-shadow-xl md:w-32"
            initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                color: "white",
                letterSpacing: "0.02em",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                mr: 2,
              }}
            >
              ¡ Hola, {user.name} !
            </Typography>
            <Box sx={{ color: "white", animation: "bounce 2s infinite" }}>
              <RocketIcon />
            </Box>
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.9)",
              mb: 3,
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              fontWeight: 500,
            }}
          >
            Dashboard de Rendimiento como Influencer
          </Typography>

          {totalTareas > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <Chip
                icon={<AwardIcon />}
                label={`${completionRate.toFixed(1)}% de éxito completado`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                  backdropFilter: "blur(10px)",
                  fontSize: "1rem",
                  height: 40,
                  "& .MuiChip-icon": {
                    color: "white",
                  },
                }}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ width: "100%", maxWidth: 1200, marginBottom: "3rem", zIndex: 1 }}
        >
          <Grid container spacing={3} justifyContent="center">
            {statsCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div variants={item} whileHover="hover">
                  <Paper
                    elevation={12}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      cursor: "default",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Gradient background accent */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: stat.gradient,
                      }}
                    />

                    <Box
                      sx={{
                        color: stat.color,
                        mb: 2,
                        p: 2,
                        borderRadius: "50%",
                        background: `${stat.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {stat.icon}
                    </Box>

                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: "bold",
                        color: stat.color,
                        mb: 1,
                        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {stat.value}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        mb: 1,
                      }}
                    >
                      {stat.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontStyle: "italic",
                      }}
                    >
                      {stat.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Performance Metrics */}
        {totalTareas > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{ width: "100%", maxWidth: 800, marginBottom: "3rem", zIndex: 1 }}
          >
            <Paper
              elevation={12}
              sx={{
                p: 4,
                borderRadius: 4,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                <ChartIcon />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    ml: 2,
                    color: "text.primary",
                  }}
                >
                  Métricas de Rendimiento
                </Typography>
              </Box>

              <Grid container spacing={4}>
                {performanceMetrics.map((metric, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Box
                          sx={{
                            color: metric.color,
                            mr: 2,
                            p: 1,
                            borderRadius: "50%",
                            background: `${metric.color}15`,
                          }}
                        >
                          {metric.icon}
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, flex: 1 }}>
                          {metric.label}
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "bold",
                            color: metric.color,
                          }}
                        >
                          {metric.value.toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={metric.value}
                        sx={{
                          height: 12,
                          borderRadius: 6,
                          bgcolor: `${metric.color}20`,
                          "& .MuiLinearProgress-bar": {
                            bgcolor: metric.color,
                            borderRadius: 6,
                            background: `linear-gradient(90deg, ${metric.color}, ${metric.color}dd)`,
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        )}

        {/* Action Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          style={{ zIndex: 1 }}
        >
          <Button
            variant="contained"
            size="large"
            href="/tareas-personales"
            sx={{
              fontWeight: "bold",
              paddingX: 5,
              paddingY: 2,
              borderRadius: 4,
              background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
              boxShadow: "0 8px 20px rgba(255, 107, 107, 0.4)",
              textTransform: "none",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                background: "linear-gradient(45deg, #ee5a24, #ff6b6b)",
                boxShadow: "0 12px 24px rgba(255, 107, 107, 0.6)",
              },
            }}
          >
            <CalendarIcon />
            Gestionar mis tareas
          </Button>
        </motion.div>

        {/* Motivational Message */}
        {totalTareas === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            style={{ textAlign: "center", marginTop: "3rem", zIndex: 1 }}
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                maxWidth: 500,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Box sx={{ mb: 2, color: "#ffd700" }}>
                <StarIcon />
              </Box>
              <Typography variant="h5" sx={{ color: "text.primary", mb: 2, fontWeight: "bold" }}>
                ¡Comienza tu aventura como influencer!
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                Aún no tienes tareas asignadas. Pronto comenzarás a crear contenido increíble y a conectar con tu
                audiencia. ¡El éxito te espera!
              </Typography>
            </Paper>
          </motion.div>
        )}

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
        `}</style>
      </Box>
    </AppLayout>
  )
}
