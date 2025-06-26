"use client"

import Header from "@/components/header copy"

import { Head, router } from "@inertiajs/react"
import {
  ArrowBack,
  ArrowBackIos,
  ArrowForwardIos,
  Favorite,
  FavoriteBorder,
  Share,
  Send,
  PlayArrow,
  Close,
  YouTube,
  Facebook,
} from "@mui/icons-material"
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import VerifiedIcon from '@mui/icons-material/Verified';
import { useState } from "react"

type Video = {
  id: string
  title: string
  thumbnail: string
  duration: string
  views: string
  likes: string
  url: string
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
  rawData?: Record<string, string>
  location: string
  joinDate: string
  bio: string
  languages: string[]
}

interface PageProps {
  influencer: Influencer
}

// Función para detectar el tipo de plataforma de video
const detectVideoPlatform = (url: string): "youtube" | "tiktok" | "facebook" | "unknown" => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("tiktok.com")) return "tiktok"
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "facebook"
  return "unknown"
}

// Función para extraer ID de YouTube
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

// Función para extraer ID de TikTok
const getTikTokId = (url: string): string | null => {
  const regExp = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/
  const match = url.match(regExp)
  return match ? match[1] : null
}

// Componente TikTok Icon personalizado
const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

// Componente para mostrar imagen o video en modal
const MediaViewer = ({
  media,
  type,
  onClose,
}: {
  media: Video | string
  type: "video" | "image"
  onClose: () => void
}) => {
  const renderContent = () => {
    if (type === "image") {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxHeight: "80vh",
          }}
        >
          <Box
            component="img"
            src={media as string}
            alt="Imagen"
            sx={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: 2,
            }}
          />
        </Box>
      )
    }

    // Para videos
    const video = media as Video
    const platform = detectVideoPlatform(video.url)

    switch (platform) {
      case "youtube":
        const youtubeId = getYouTubeId(video.url)
        return youtubeId ? (
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "12px" }}
          />
        ) : null

      case "tiktok":
        const tiktokId = getTikTokId(video.url)
        return tiktokId ? (
          <iframe
            width="100%"
            height="500"
            src={`https://www.tiktok.com/embed/v2/${tiktokId}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "12px" }}
          />
        ) : null

      case "facebook":
        return (
          <iframe
            width="100%"
            height="500"
            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.url)}&show_text=false&width=560`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "12px" }}
          />
        )

      default:
        return (
          <Box
            sx={{
              height: 500,
              bgcolor: "rgba(42, 42, 42, 0.8)",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
              Formato de video no soportado
            </Typography>
            <Button variant="contained" href={video.url} target="_blank" sx={{ bgcolor: "#ff1744" }}>
              Ver en plataforma original
            </Button>
          </Box>
        )
    }
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "rgba(26, 26, 26, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "rgba(0,0,0,0.3)",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {type === "video" ? (media as Video).title : "Imagen"}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, bgcolor: "rgba(0,0,0,0.2)" }}>
        {renderContent()}
        {type === "video" && (
          <Stack direction="row" spacing={3} mt={2} justifyContent="center">
            <Typography variant="body2" sx={{ color: "#aaa" }}>
              👁️ {(media as Video).views} views
            </Typography>
            <Typography variant="body2" sx={{ color: "#aaa" }}>
              ❤️ {(media as Video).likes} likes
            </Typography>
            <Typography variant="body2" sx={{ color: "#aaa" }}>
              ⏱️ {(media as Video).duration}
            </Typography>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}

const VideoCard = ({ video }: { video: Video }) => {
  const [showPlayer, setShowPlayer] = useState(false)
  const platform = detectVideoPlatform(video.url)

  const getPlatformIcon = () => {
    switch (platform) {
      case "youtube":
        return <YouTube sx={{ color: "#ff0000", fontSize: 20 }} />
      case "tiktok":
        return <TikTokIcon />
      case "facebook":
        return <Facebook sx={{ color: "#1877f2", fontSize: 20 }} />
      default:
        return <PlayArrow sx={{ fontSize: 20 }} />
    }
  }

  return (
    <>
      <Card
        sx={{
          bgcolor: "rgba(42, 42, 42, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 3,
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 15px 35px rgba(255,23,68,0.2)",
            border: "1px solid rgba(255,23,68,0.5)",
          },
        }}
        onClick={() => setShowPlayer(true)}
      >
        <Box sx={{ position: "relative" }}>
          <Box
            component="img"
            src={video.thumbnail}
            alt={video.title}
            sx={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderRadius: "12px 12px 0 0",
            }}
          />

          {/* Play button overlay */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "rgba(255,23,68,0.9)",
              borderRadius: "50%",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 0 20px rgba(255,23,68,0.5)",
              backdropFilter: "blur(10px)",
            }}
          >
            <PlayArrow sx={{ fontSize: 30 }} />
          </Box>

          {/* Platform indicator */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {getPlatformIcon()}
          </Box>

          {/* Duration */}
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              bgcolor: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: 1,
              px: 1,
              py: 0.5,
            }}
          >
            <Typography variant="caption" sx={{ color: "#fff", fontSize: "0.75rem" }}>
              {video.duration}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{
              color: "#fff",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.4,
            }}
          >
            {video.title}
          </Typography>
        </CardContent>
      </Card>

      {showPlayer && <MediaViewer media={video} type="video" onClose={() => setShowPlayer(false)} />}
    </>
  )
}

const ImageCarousel = ({ images, name }: { images: string[]; name: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showViewer, setShowViewer] = useState(false)

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)

  if (!images.length) return null

  return (
    <>
      <Box sx={{ position: "relative", height: 500, overflow: "hidden", borderRadius: 3 }}>
        <Box
          component="img"
          src={images[currentIndex]}
          alt={`${name} - ${currentIndex + 1}`}
          onClick={() => setShowViewer(true)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "all 0.5s ease",
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30%",
            background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
          }}
        />

        {images.length > 1 && (
          <>
            <IconButton
              onClick={prevImage}
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(10px)",
                color: "#ff1744",
                "&:hover": { bgcolor: "rgba(255,23,68,0.2)" },
              }}
            >
              <ArrowBackIos />
            </IconButton>
            <IconButton
              onClick={nextImage}
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(10px)",
                color: "#ff1744",
                "&:hover": { bgcolor: "rgba(255,23,68,0.2)" },
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          </>
        )}

        {images.length > 1 && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {images.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: idx === currentIndex ? "#ff1744" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: idx === currentIndex ? "0 0 10px #ff1744" : "none",
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      {showViewer && <MediaViewer media={images[currentIndex]} type="image" onClose={() => setShowViewer(false)} />}
    </>
  )
}

export default function InfluencerProfile({ influencer }: PageProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const goBack = () => {
    router.get("/influencers")
  }

  return (
    <>
      <Header />

      <Head title={`${influencer.name} - Perfil`} />

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0f 25%, #2a1018 50%, #1a0a0f 75%, #0a0a0a 100%)",
          pb: 4,
        }}
      >
        {/* Header con imagen de portada */}
        <Box sx={{ position: "relative", height: 350, overflow: "hidden" }}>
          <Box
            component="img"
            src={influencer.coverImage}
            alt={influencer.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.6)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))",
            }}
          />

          {/* Botón de regresar */}
          <IconButton
            onClick={goBack}
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              bgcolor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(255,23,68,0.3)" },
            }}
          >
            <ArrowBack />
          </IconButton>

          {/* Botones de acción */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
            }}
          >
            <IconButton
              onClick={() => setIsFavorite(!isFavorite)}
              sx={{
                bgcolor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(10px)",
                color: isFavorite ? "#ff1744" : "#fff",
                "&:hover": { bgcolor: "rgba(255,23,68,0.2)" },
              }}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton
              sx={{
                bgcolor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(10px)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(255,23,68,0.2)" },
              }}
            >
              <Share />
            </IconButton>
          </Stack>
        </Box>

        <Container maxWidth="xl" sx={{ mt: -10, position: "relative", zIndex: 1 }}>
          {/* Información principal */}
          <Card
            sx={{
              bgcolor: "rgba(26, 26, 26, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 3,
              mb: 4,
              overflow: "visible",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Stack direction="row" spacing={3} alignItems="center" mb={3}>
                    <Badge
  overlap="circular"
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  badgeContent={
    influencer.verified ? (
      <VerifiedIcon sx={{ color: "#00ff41", fontSize: 24 }} />
    ) : null
  }
>
                      <Avatar
                        src={influencer.avatar}
                        sx={{
                          width: 120,
                          height: 120,
                          border: "4px solid rgba(255,23,68,0.5)",
                          boxShadow: "0 0 30px rgba(255,23,68,0.3)",
                        }}
                      />
                    </Badge>
                    <Box>
                      <Typography variant="h3" fontWeight="bold" sx={{ color: "#fff", mb: 1 }}>
                        {influencer.name}
                      </Typography>
                      <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}>
                        @{influencer.username}
                      </Typography>
                      <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)", mb: 2, maxWidth: 500 }}>
                        {influencer.bio}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    fullWidth
                    sx={{
                      borderRadius: 25,
                      background: "linear-gradient(45deg, #ff1744 30%, #d50000 90%)",
                      py: 2,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      boxShadow: "0 10px 30px rgba(255,23,68,0.4)",
                      border: "1px solid rgba(255,23,68,0.3)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #d50000 30%, #b71c1c 90%)",
                        boxShadow: "0 15px 40px rgba(255,23,68,0.5)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    CONTACTAR
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tabs de contenido */}
          <Card
            sx={{
              bgcolor: "rgba(26, 26, 26, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 3,
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: "rgba(255,255,255,0.1)" }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                centered
                sx={{
                  "& .MuiTab-root": {
                    color: "rgba(255,255,255,0.6)",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    py: 3,
                    "&.Mui-selected": {
                      color: "#ff1744",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    bgcolor: "#ff1744",
                    height: 3,
                  },
                }}
              >
                <Tab label={`Videos (${influencer.videos.length})`} />
                <Tab label={`Galería (${influencer.gallery.length})`} />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {/* Tab Videos */}
              {activeTab === 0 && (
                <Box>
                  {influencer.videos.length > 0 ? (
                    <Grid container spacing={4}>
                      {influencer.videos.map((video) => (
                        <Grid item xs={12} sm={6} md={4} key={video.id}>
                          <VideoCard video={video} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 8,
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      <PlayArrow sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6">No hay videos disponibles</Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Tab Galería */}
              {activeTab === 1 && (
                <Box>
                  {influencer.gallery.length > 0 ? (
                    <ImageCarousel images={influencer.gallery} name={influencer.name} />
                  ) : (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 8,
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      <Typography variant="h6">No hay imágenes en la galería</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  )
}
