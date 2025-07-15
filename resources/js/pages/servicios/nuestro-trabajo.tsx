import { Box, Card, Grid } from '@mui/material';

const tikTokUrls = [
    'https://www.tiktok.com/@scout2015/video/6718335390845095173',
    'https://www.tiktok.com/@scout2015/video/6829267836783971589',
    'https://www.tiktok.com/@scout2015/video/6718335390845095173',
];

function getVideoId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
}

export default function NuestroTrabajo() {
    return (
        <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center text-4xl font-bold text-red-500">Mira nuestro trabajo</h2>
            <h2 className=" text-2xl text-white-500 text-center">Videos mas virales de admus</h2>
            <div className="flex flex-col gap-6 md:flex-row">
                <Box
                    sx={{
                        minHeight: '100vh',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2,
                    }}
                >
                    <Grid container spacing={2} justifyContent="center" alignItems="center" maxWidth="lg">
                        {tikTokUrls.map((url, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: 3,
                                        aspectRatio: '9 / 16',
                                        backgroundColor: '#000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
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
        </div>
    );
}
