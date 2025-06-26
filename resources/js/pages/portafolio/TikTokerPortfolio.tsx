"use client"

import Header from "@/components/header copy"
import { Head, Link } from "@inertiajs/react"
import { Favorite, FavoriteBorder, Visibility, Search } from "@mui/icons-material"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material"
import { useState } from "react"
import Footer from "../home/footer"

type Video = {
  id: number
  title: string
  url: string
  thumbnail: string
  views: number
  likes: number
  comments: number
  duration: string
}

type Influencer = {
  id: number
  name: string
  username: string
  followers: string
  category: string
  description: string
  avatar: string
  coverImage: string
  verified: boolean
  engagement: string
  rating: string
  specialties: string[]
  videos: Video[]
  gallery: string[]
  price?: string
  availability?: "available" | "busy" | "offline"
  rawData?: Record<string, string | number>
}

interface PageProps {
  influencers: Influencer[]
}

export default function TikTokerPortfolio({ influencers }: PageProps) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  // Función para filtrar influencers
  const filteredInfluencers = influencers.filter((inf) => {
    const matchesSearch =
      inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.category.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  return (
    <>
      <Header />
      <Box
        sx={{
          height: "64px",
          bgcolor: "rgba(0, 0, 0, 0.95)",
          zIndex: 75,
        }}
      />

      <Head title="Catálogo de Influencers" />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0f 25%, #2a1018 50%, #1a0a0f 75%, #0a0a0a 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          {/* Header con texto estilizado */}
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
              position: "relative",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #ff1744 30%, #d50000 70%, #ff6b35 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(255,23,68,0.3)",
                mb: 2,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                letterSpacing: "0.1em",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "120%",
                  height: "120%",
                  background: "radial-gradient(ellipse, rgba(255,23,68,0.1) 0%, transparent 70%)",
                  zIndex: -1,
                },
              }}
            >
              ⚡ CATÁLOGO DE INFLUENCERS
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontWeight: "300",
                letterSpacing: "0.05em",
              }}
            >
              CONECTA CON LOS MEJORES CREADORES DIGITALES
            </Typography>
          </Box>

          {/* Barra de búsqueda minimalista */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <TextField
              placeholder="Buscar influencers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#666", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: 400,
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  bgcolor: "rgba(255,255,255,0.05)",
                  borderRadius: 25,
                  color: "#fff",
                  fontSize: "0.9rem",
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.1)",
                    borderWidth: 1,
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255,23,68,0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff1744",
                    borderWidth: 1,
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "8px 14px",
                  "&::placeholder": {
                    color: "#666",
                    fontSize: "0.9rem",
                  },
                },
              }}
            />
          </Box>

          {/* Grid de Influencers */}
          <Grid container spacing={3}>
            {filteredInfluencers.map((inf) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={inf.id}>
                <Card
                  sx={{
                    height: 320, // Altura fija para todas las cards
                    borderRadius: 3,
                    background: "rgba(26, 26, 26, 0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(255,23,68,0.2)",
                      border: "1px solid rgba(255,23,68,0.5)",
                      background: "rgba(26, 26, 26, 0.9)",
                    },
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  {/* Imagen de portada */}
                  <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
                    <Box
                      component="img"
                      src={inf.gallery.length > 0 ? inf.gallery[0] : inf.coverImage}
                      alt={inf.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                    />

                    {/* Overlay gradient */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "60%",
                        background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                      }}
                    />

                    {/* Botón de favorito */}
                    <IconButton
                      onClick={() => toggleFavorite(inf.id)}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(10px)",
                        color: favorites.has(inf.id) ? "#ff1744" : "#fff",
                        width: 36,
                        height: 36,
                        "&:hover": {
                          bgcolor: "rgba(255,23,68,0.2)",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      {favorites.has(inf.id) ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                    </IconButton>
                  </Box>

                  {/* Contenido de la Card */}
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Avatar y nombre */}
                    <Box>
                      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <Avatar
                          src={inf.avatar}
                          sx={{
                            width: 50,
                            height: 50,
                            border: "2px solid rgba(255,23,68,0.5)",
                            boxShadow: "0 0 15px rgba(255,23,68,0.2)",
                          }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                              color: "#fff",
                              fontSize: "1.1rem",
                              lineHeight: 1.2,
                              mb: 0.5,
                            }}
                          >
                            {inf.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255,255,255,0.6)",
                              fontSize: "0.85rem",
                            }}
                          >
                            @{inf.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {/* Botón de acción */}
                    <Link href={`/influencers/${inf.id}`}>
                      <Button
                        variant="contained"
                        startIcon={<Visibility />}
                        fullWidth
                        sx={{
                          borderRadius: 25,
                          textTransform: "none",
                          fontWeight: "bold",
                          fontSize: "0.95rem",
                          background: "linear-gradient(45deg, #ff1744 30%, #d50000 90%)",
                          py: 1.5,
                          boxShadow: "0 8px 25px rgba(255,23,68,0.3)",
                          border: "1px solid rgba(255,23,68,0.3)",
                          "&:hover": {
                            background: "linear-gradient(45deg, #d50000 30%, #b71c1c 90%)",
                            boxShadow: "0 12px 30px rgba(255,23,68,0.4)",
                            transform: "translateY(-2px)",
                            border: "1px solid rgba(255,23,68,0.6)",
                          },
                        }}
                      >
                        VER PERFIL
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Mensaje cuando no hay resultados */}
          {filteredInfluencers.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "#aaa",
              }}
            >
              <Search sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" mb={2}>
                No se encontraron influencers
              </Typography>
              <Typography variant="body1">Intenta con otro término de búsqueda</Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Footer con fondo negro */}
      <div className="bg-black">
        <Footer />
      </div>
    </>
  )
}
