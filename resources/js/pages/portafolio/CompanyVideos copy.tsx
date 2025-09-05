'use client';

import Header from '@/components/header copy';
import { Head, Link } from '@inertiajs/react';
import { ArrowBack } from '@mui/icons-material';
import { Box, Card, Container, Grid, IconButton, Typography } from '@mui/material';
import Footer from '../home/footer';

// Define las interfaces para los datos que llegan de Laravel
interface LinkData {
    id: number;
    link: string;
    detalle: string;
}

interface CompanyLinkComprobante {
    id: number;
    link: LinkData | null;
}

interface CompanyProps {
    id: number;
    name: string;
    logo: string;
    description: string;
    link_comprobantes: CompanyLinkComprobante[];
}

interface CompanyVideosProps {
    company: CompanyProps;
}

// 🐛 Función auxiliar mejorada para obtener la URL de incrustación de TikTok
const getEmbedUrl = (tiktokUrl: string): string => {
    try {
        const url = new URL(tiktokUrl);
        // La incrustación de TikTok funciona mejor con la URL completa
        // Extraemos el ID del video de la URL resuelta por Laravel
        const pathParts = url.pathname.split('/');
        const videoId = pathParts.pop() || pathParts.pop(); // Manejar el caso de slash final

        if (videoId) {
            return `https://www.tiktok.com/embed/v2/${videoId}`;
        }
    } catch (e) {
        console.error('URL de TikTok inválida:', tiktokUrl);
    }
    return ''; // Retorna una cadena vacía si no se puede generar la URL de incrustación
};

export default function CompanyVideos({ company }: CompanyVideosProps) {
    const { name, link_comprobantes } = company;

    return (
        <>
            <Header />
            <Box sx={{ height: '64px', bgcolor: 'rgba(0, 0, 0, 0.95)', zIndex: 75 }} />

            <Head title={`Videos de ${name} | Portafolio`} />

            <Box sx={{ py: 6 }}>
                <Container maxWidth="lg">
                    <Link href="/tiktok" style={{ textDecoration: 'none' }}>
                        <IconButton
                            sx={{
                                color: '#fff',
                                mb: 4,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(5px)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,23,68,0.8)',
                                },
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                    </Link>

                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h2" fontWeight="bold" sx={{ color: '#fff', mb: 2 }}>
                            Videos para {name}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Aquí puedes ver todos los videos de TikTok realizados para esta empresa.
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {link_comprobantes.length > 0 ? (
                            link_comprobantes.map(
                                (companyLink) =>
                                    companyLink.link && (
                                        <Grid item xs={12} sm={6} md={4} key={companyLink.link.id}>
                                            <Card
                                                sx={{
                                                    height: 450, // Ajusta la altura para el video
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    bgcolor: '#000',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    position: 'relative',
                                                }}
                                            >
                                                {/* Aquí incrustamos el video */}
                                                <Box
                                                    sx={{
                                                        p: 1, // Espacio interior para el video
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <iframe
                                                        src={getEmbedUrl(companyLink.link.link)}
                                                        title={`Video de TikTok para ${name}`}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 'none' }}
                                                        allowFullScreen
                                                    />
                                                </Box>
                                            </Card>
                                        </Grid>
                                    ),
                            )
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" sx={{ color: 'rgba(255,255,255,0.7)', mt: 4 }}>
                                    No hay videos de TikTok disponibles para esta empresa.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Box>

            <div className="bg-black">
                <Footer />
            </div>
        </>
    );
}