import { Box, Card, Grid, Typography } from '@mui/material';

const tikTokUrls = [
    'https://www.tiktok.com/@admusbol/video/7504034170188991750',
    'https://www.tiktok.com/@admusbol/video/7518075774730013957',
    'https://www.tiktok.com/@admusbol/video/7496652676575268101',
];

function getVideoId(url: string): string {
    const cleanUrl = new URL(url);
    const pathParts = cleanUrl.pathname.split('/');
    return pathParts[pathParts.length - 1];
}

export default function NuestroTrabajo() {
    return (
        <div className="container mx-auto px-4 py-10">
            <Typography
                variant="h2"
                sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    mb: 4,
                    fontSize: { xs: '2rem', md: '3rem' },
                    color: '#e53935',
                }}
            >
                Mira nuestro trabajo
            </Typography>
            <Typography
                variant="h5"
                sx={{
                    textAlign: 'center',
                    color: '#ffffff',
                    mb: 6,
                }}
            >
                Videos más virales de Admus
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    p: 2,
                }}
            >
                <Grid container spacing={3} justifyContent="center" maxWidth="lg">
                    {tikTokUrls.map((url, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    boxShadow: 5,
                                    aspectRatio: '9 / 16',
                                    backgroundColor: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                    },
                                }}
                            >
                                <iframe
                                    src={`https://www.tiktok.com/embed/v2/${getVideoId(url)}`}
                                    width="100%"
                                    height="100%"
                                    allowFullScreen
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                                    title={`TikTok video ${index + 1}`}
                                    style={{ border: 'none' }}
                                ></iframe>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    );
}
