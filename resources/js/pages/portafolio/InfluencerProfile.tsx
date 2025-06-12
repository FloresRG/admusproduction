import { Head } from '@inertiajs/react';
import { 
    ArrowBackIos, 
    ArrowForwardIos, 
    Favorite, 
    FavoriteBorder, 
    Group, 
    TrendingUp, 
    Verified, 
    Share,
    PlayArrow,
    Instagram,
    Twitter,
    YouTube,
    Facebook,
    WhatsApp,
    Email,
    LocationOn,
    CalendarToday,
    Star,
    StarBorder,
    Send,
    ArrowBack
} from '@mui/icons-material';
import { 
    Avatar, 
    Badge, 
    Box, 
    Button, 
    Card, 
    CardContent, 
    Chip, 
    Container, 
    Grid, 
    IconButton, 
    LinearProgress, 
    Stack, 
    Typography,
    Tabs,
    Tab,
    TextField,
    Rating,
    Divider,
    Paper
} from '@mui/material';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import Header from '@/components/header copy';

type SocialNetwork = {
    platform: string;
    username: string;
    url: string;
    followers?: string;
};

type Video = {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: string;
    likes: string;
    url: string;
};

type Review = {
    id: number;
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
};

type Package = {
    id: string;
    name: string;
    description: string;
    price: string;
    duration: string;
    features: string[];
    popular?: boolean;
};

type Influencer = {
    id: number;
    name: string;
    username: string;
    followers: string;
    category: string;
    description: string;
    avatar: string;
    coverImage: string;
    verified: boolean;
    engagement: string;
    rating: string;
    specialties: string[];
    videos: Video[];
    gallery: string[];
    socialNetworks: SocialNetwork[];
    location: string;
    joinDate: string;
    bio: string;
    packages: Package[];
    reviews: Review[];
    totalReviews: number;
    responseTime: string;
    languages: string[];
    availability?: 'available' | 'busy' | 'offline';
};

interface PageProps {
    influencer: Influencer;
}

const AvailabilityChip = ({ status }: { status: string }) => {
    const colors = {
        available: { bg: '#00ff41', text: 'EN LÍNEA', glow: '0 0 10px #00ff41' },
        busy: { bg: '#ff6b35', text: 'OCUPADO', glow: '0 0 10px #ff6b35' },
        offline: { bg: '#666', text: 'OFFLINE', glow: '0 0 10px #666' },
    };

    const config = colors[status as keyof typeof colors] || colors.available;

    return (
        <Chip
            label={config.text}
            size="small"
            sx={{
                bgcolor: config.bg,
                color: '#000',
                fontWeight: 'bold',
                fontSize: '0.7rem',
                height: 24,
                boxShadow: config.glow,
                '& .MuiChip-label': { px: 1.5 },
            }}
        />
    );
};

const SocialIcon = ({ platform }: { platform: string }) => {
    const icons = {
        instagram: <Instagram />,
        twitter: <Twitter />,
        youtube: <YouTube />,
        facebook: <Facebook />,
        tiktok: <TikTok />,
    };
    
    return icons[platform.toLowerCase() as keyof typeof icons] || <Share />;
};

const ImageCarousel = ({ images, name }: { images: string[]; name: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    if (!images.length) return null;

    return (
        <Box sx={{ position: 'relative', height: 400, overflow: 'hidden', borderRadius: 3 }}>
            <Box
                component="img"
                src={images[currentIndex]}
                alt={`${name} - ${currentIndex + 1}`}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'all 0.5s ease',
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                }}
            />

            {images.length > 1 && (
                <>
                    <IconButton
                        onClick={prevImage}
                        sx={{
                            position: 'absolute',
                            left: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: '#ff1744',
                            '&:hover': { bgcolor: 'rgba(255,23,68,0.2)' },
                        }}
                    >
                        <ArrowBackIos />
                    </IconButton>
                    <IconButton
                        onClick={nextImage}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: '#ff1744',
                            '&:hover': { bgcolor: 'rgba(255,23,68,0.2)' },
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
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    {images.map((_, idx) => (
                        <Box
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: idx === currentIndex ? '#ff1744' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: idx === currentIndex ? '0 0 10px #ff1744' : 'none',
                            }}
                        />
                    ))}
                </Stack>
            )}
        </Box>
    );
};

const VideoCard = ({ video }: { video: Video }) => (
    <Card
        sx={{
            bgcolor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(255,23,68,0.2)',
                border: '1px solid #ff1744',
            },
        }}
    >
        <Box sx={{ position: 'relative' }}>
            <Box
                component="img"
                src={video.thumbnail}
                alt={video.title}
                sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'rgba(255,23,68,0.8)',
                    borderRadius: '50%',
                    width: 50,
                    height: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                }}
            >
                <PlayArrow sx={{ fontSize: 24 }} />
            </Box>
            <Chip
                label={video.duration}
                size="small"
                sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.8)',
                    color: '#fff',
                    fontSize: '0.7rem',
                }}
            />
        </Box>
        <CardContent sx={{ p: 2 }}>
            <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                    color: '#fff',
                    mb: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}
            >
                {video.title}
            </Typography>
            <Stack direction="row" spacing={2}>
                <Typography variant="caption" sx={{ color: '#aaa' }}>
                    {video.views} views
                </Typography>
                <Typography variant="caption" sx={{ color: '#aaa' }}>
                    {video.likes} likes
                </Typography>
            </Stack>
        </CardContent>
    </Card>
);

const PackageCard = ({ pkg }: { pkg: Package }) => (
    <Card
        sx={{
            bgcolor: pkg.popular ? 'linear-gradient(145deg, #ff1744, #d50000)' : '#2a2a2a',
            border: pkg.popular ? 'none' : '1px solid #444',
            borderRadius: 3,
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: pkg.popular ? '0 20px 40px rgba(255,23,68,0.3)' : '0 8px 25px rgba(255,255,255,0.1)',
            },
        }}
    >
        {pkg.popular && (
            <Chip
                label="MÁS POPULAR"
                sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#00ff41',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    boxShadow: '0 0 15px #00ff41',
                }}
            />
        )}
        <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mb: 1 }}>
                {pkg.name}
            </Typography>
            <Typography variant="body2" sx={{ color: pkg.popular ? '#fff' : '#ccc', mb: 2 }}>
                {pkg.description}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: pkg.popular ? '#fff' : '#00ff41', mb: 1 }}>
                {pkg.price}
            </Typography>
            <Typography variant="caption" sx={{ color: pkg.popular ? '#fff' : '#aaa', mb: 2, display: 'block' }}>
                {pkg.duration}
            </Typography>
            <Stack spacing={1} mb={3}>
                {pkg.features.map((feature, idx) => (
                    <Stack key={idx} direction="row" alignItems="center" spacing={1}>
                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: pkg.popular ? '#fff' : '#00ff41',
                            }}
                        />
                        <Typography variant="body2" sx={{ color: pkg.popular ? '#fff' : '#ccc' }}>
                            {feature}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
            <Button
                variant="contained"
                fullWidth
                sx={{
                    bgcolor: pkg.popular ? '#fff' : '#ff1744',
                    color: pkg.popular ? '#ff1744' : '#fff',
                    fontWeight: 'bold',
                    borderRadius: 25,
                    py: 1.5,
                    '&:hover': {
                        bgcolor: pkg.popular ? '#f5f5f5' : '#d50000',
                    },
                }}
            >
                CONTRATAR
            </Button>
        </CardContent>
    </Card>
);

const ReviewCard = ({ review }: { review: Review }) => (
    <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #444', borderRadius: 2, mb: 2 }}>
        <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar src={review.avatar} sx={{ width: 40, height: 40 }} />
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#fff' }}>
                        {review.user}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#aaa' }}>
                        {review.date}
                    </Typography>
                </Box>
                <Rating value={review.rating} size="small" readOnly />
            </Stack>
            <Typography variant="body2" sx={{ color: '#ccc' }}>
                {review.comment}
            </Typography>
        </CardContent>
    </Card>
);

export default function InfluencerProfile({ influencer }: PageProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    const goBack = () => {
        router.get('/influencers');
    };

    return (
        <>
        <Header />

            <Head title={`${influencer.name} - Perfil`} />

            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0f 25%, #2a1018 50%, #1a0a0f 75%, #0a0a0a 100%)',
                    pb: 4,
                }}
            >
                {/* Header con imagen de portada */}
                <Box sx={{ position: 'relative', height: 300, overflow: 'hidden' }}>
                    <Box
                        component="img"
                        src={influencer.coverImage}
                        alt={influencer.name}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.7)',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))',
                        }}
                    />
                    
                    {/* Botón de regresar */}
                    <IconButton
                        onClick={goBack}
                        sx={{
                            position: 'absolute',
                            top: 20,
                            left: 20,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: '#fff',
                            '&:hover': { bgcolor: 'rgba(255,23,68,0.7)' },
                        }}
                    >
                        <ArrowBack />
                    </IconButton>

                    {/* Botones de acción */}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                        }}
                    >
                        <IconButton
                            onClick={() => setIsFavorite(!isFavorite)}
                            sx={{
                                bgcolor: 'rgba(0,0,0,0.7)',
                                color: isFavorite ? '#ff1744' : '#fff',
                                '&:hover': { bgcolor: 'rgba(255,23,68,0.2)' },
                            }}
                        >
                            {isFavorite ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                        <IconButton
                            sx={{
                                bgcolor: 'rgba(0,0,0,0.7)',
                                color: '#fff',
                                '&:hover': { bgcolor: 'rgba(255,23,68,0.2)' },
                            }}
                        >
                            <Share />
                        </IconButton>
                    </Stack>
                </Box>

                <Container maxWidth="xl" sx={{ mt: -8, position: 'relative', zIndex: 1 }}>
                    {/* Información principal */}
                    <Card
                        sx={{
                            bgcolor: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: 3,
                            mb: 4,
                            overflow: 'visible',
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Grid container spacing={4} alignItems="center">
                                <Grid item xs={12} md={8}>
                                    <Stack direction="row" spacing={3} alignItems="center" mb={3}>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            badgeContent={
                                                influencer.verified ? (
                                                    <Verified sx={{ color: '#00ff41', fontSize: 24 }} />
                                                ) : null
                                            }
                                        >
                                            <Avatar
                                                src={influencer.avatar}
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    border: '4px solid #ff1744',
                                                    boxShadow: '0 0 20px rgba(255,23,68,0.5)',
                                                }}
                                            />
                                        </Badge>
                                        <Box>
                                            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                                                <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>
                                                    {influencer.name}
                                                </Typography>
                                                <AvailabilityChip status={influencer.availability || 'available'} />
                                            </Stack>
                                            <Typography variant="h6" sx={{ color: '#aaa', mb: 1 }}>
                                                @{influencer.username}
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                                <Chip
                                                    label={influencer.category}
                                                    sx={{
                                                        bgcolor: '#ff1744',
                                                        color: '#fff',
                                                        fontWeight: 'bold',
                                                    }}
                                                />
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <LocationOn sx={{ fontSize: 16, color: '#aaa' }} />
                                                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                                                        {influencer.location}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <CalendarToday sx={{ fontSize: 16, color: '#aaa' }} />
                                                    <Typography variant="body2" sx={{ color: '#aaa' }}>
                                                        Desde {influencer.joinDate}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                            <Typography variant="body1" sx={{ color: '#ccc', mb: 2 }}>
                                                {influencer.bio}
                                            </Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                {influencer.languages.map((lang, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={lang}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#333',
                                                            color: '#fff',
                                                            border: '1px solid #555',
                                                        }}
                                                    />
                                                ))}
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={2}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<Send />}
                                            sx={{
                                                borderRadius: 25,
                                                background: 'linear-gradient(45deg, #ff1744 30%, #d50000 90%)',
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold',
                                                boxShadow: '0 0 20px rgba(255,23,68,0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #d50000 30%, #b71c1c 90%)',
                                                },
                                            }}
                                        >
                                            CONTACTAR
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            startIcon={<WhatsApp />}
                                            sx={{
                                                borderRadius: 25,
                                                borderColor: '#00ff41',
                                                color: '#00ff41',
                                                py: 1.5,
                                                '&:hover': {
                                                    bgcolor: 'rgba(0,255,65,0.1)',
                                                    borderColor: '#00ff41',
                                                },
                                            }}
                                        >
                                            WhatsApp
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Divider sx={{ bgcolor: '#333', my: 3 }} />

                            {/* Métricas */}
                            <Grid container spacing={3}>
                                <Grid item xs={6} md={3}>
                                    <Box textAlign="center">
                                        <Group sx={{ fontSize: 32, color: '#00ff41', mb: 1 }} />
                                        <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
                                            {influencer.followers}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#aaa' }}>
                                            Seguidores
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Box textAlign="center">
                                        <TrendingUp sx={{ fontSize: 32, color: '#ff1744', mb: 1 }} />
                                        <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
                                            {influencer.engagement}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#aaa' }}>
                                            Engagement
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Box textAlign="center">
                                        <Star sx={{ fontSize: 32, color: '#ffd700', mb: 1 }} />
                                        <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
                                            {influencer.rating}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#aaa' }}>
                                            Rating ({influencer.totalReviews} reviews)
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Box textAlign="center">
                                        <Email sx={{ fontSize: 32, color: '#2196f3', mb: 1 }} />
                                        <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
                                            {influencer.responseTime}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#aaa' }}>
                                            Tiempo de respuesta
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Redes sociales */}
                    <Card sx={{ bgcolor: '#1a1a1a', border: '1px solid #333', borderRadius: 3, mb: 4 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mb: 2 }}>
                                🔗 Redes Sociales
                            </Typography>
                            <Grid container spacing={2}>
                                {influencer.socialNetworks.map((social, idx) => (
                                    <Grid item xs={6} md={3} key={idx}>
                                        <Paper
                                            sx={{
                                                bgcolor: '#2a2a2a',
                                                border: '1px solid #444',
                                                borderRadius: 2,
                                                p: 2,
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: '#333',
                                                    transform: 'translateY(-2px)',
                                                },
                                            }}
                                        >
                                            <Box sx={{ color: '#ff1744', mb: 1 }}>
                                                <SocialIcon platform={social.platform} />
                                            </Box>
                                            <Typography variant="body2" fontWeight="bold" sx={{ color: '#fff' }}>
                                                {social.platform}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#aaa' }}>
                                                @{social.username}
                                            </Typography>
                                            {social.followers && (
                                                <Typography variant="caption" sx={{ color: '#00ff41', display: 'block' }}>
                                                    {social.followers}
                                                </Typography>
                                            )}
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Tabs de contenido */}
                    <Card sx={{ bgcolor: '#1a1a1a', border: '1px solid #333', borderRadius: 3 }}>
                        <Box sx={{ borderBottom: 1, borderColor: '#333' }}>
                            <Tabs
                                value={activeTab}
                                onChange={(_, newValue) => setActiveTab(newValue)}
                                sx={{
                                    '& .MuiTab-root': {
                                        color: '#aaa',
                                        fontWeight: 'bold',
                                        '&.Mui-selected': {
                                            color: '#ff1744',
                                        },
                                    },
                                    '& .MuiTabs-indicator': {
                                        bgcolor: '#ff1744',
                                    },
                                }}
                            >
                                <Tab label="Videos" />
                                <Tab label="Galería" />
                                <Tab label="Paquetes" />
                                <Tab label="Reseñas" />
                            </Tabs>
                        </Box>

                        <CardContent sx={{ p: 3 }}>
                            {/* Tab Videos */}
                            {activeTab === 0 && (
                                <Grid container spacing={3}>
                                    {influencer.videos.map((video) => (
                                        <Grid item xs={12} sm={6} md={4} key={video.id}>
                                            <VideoCard video={video} />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* Tab Galería */}
                            {activeTab === 1 && (
                                <ImageCarousel images={influencer.gallery} name={influencer.name} />
                            )}

                            {/* Tab Paquetes */}
                            {activeTab === 2 && (
                                <Grid container spacing={3}>
                                    {influencer.packages.map((pkg) => (
                                        <Grid item xs={12} md={4} key={pkg.id}>
                                            <PackageCard pkg={pkg} />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* Tab Reseñas */}
                            {activeTab === 3 && (
                                <Box>
                                    {influencer.reviews.map((review) => (
                                        <ReviewCard key={review.id} review={review} />
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Container>
            </Box>
                    
        </>
    );
}