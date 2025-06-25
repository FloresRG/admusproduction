import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Box, Grid, Typography, Paper, Card, CardContent } from '@mui/material';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Person, Business, Event, Notifications } from '@mui/icons-material'; // Importando íconos de Material UI

// Datos de ejemplo (sustituir con datos reales más tarde)
const dataLineChart = [
    { name: 'Enero', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Febrero', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Marzo', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Abril', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Mayo', uv: 1890, pv: 4800, amt: 2181 },
];

const dataBarChart = [
    { name: 'Semana 1', uv: 4000, amt: 2400 },
    { name: 'Semana 2', uv: 3000, amt: 1398 },
    { name: 'Semana 3', uv: 2000, amt: 9800 },
    { name: 'Semana 4', uv: 2780, amt: 3908 },
];

const dataPieChart = [
    { name: 'Turno A', value: 400 },
    { name: 'Turno B', value: 300 },
    { name: 'Turno C', value: 300 },
];

const dataAreaChart = [
    { name: 'Enero', uv: 4000, pv: 2400 },
    { name: 'Febrero', uv: 3000, pv: 1398 },
    { name: 'Marzo', uv: 2000, pv: 9800 },
    { name: 'Abril', uv: 2780, pv: 3908 },
    { name: 'Mayo', uv: 1890, pv: 4800 },
];

const dataRadarChart = [
    { subject: 'A', A: 120, fullMark: 150 },
    { subject: 'B', A: 130, fullMark: 150 },
    { subject: 'C', A: 100, fullMark: 150 },
    { subject: 'D', A: 150, fullMark: 150 },
    { subject: 'E', A: 90, fullMark: 150 },
];

const countData = [
    { title: 'Usuarios Registrados', count: 1250, icon: <Person /> },
    { title: 'Empresas Activas', count: 80, icon: <Business /> },
    { title: 'Reservas Realizadas', count: 3200, icon: <Event /> },
    { title: 'Notificaciones Pendientes', count: 15, icon: <Notifications /> },
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-2 rounded-xl p-2">
                
                {/* Cartas de conteo */}
                <Grid container spacing={3}>
                    {countData.map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item.title}>
                            <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {item.icon && <Box sx={{ fontSize: 30, color: 'text.primary' }}>{item.icon}</Box>}
                                        <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                                            {item.title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                                        {item.count}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Gráficos */}
                <Grid container spacing={3}>
                    {/* Gráfico de línea */}
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', boxShadow: 1 }}>
                            <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                                Tendencia Mensual
                            </Typography>
                            <ResponsiveContainer width={500} height={500}>
                                <LineChart data={dataLineChart}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="name" stroke="#333" />
                                    <YAxis stroke="#333" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="uv" stroke="#000" />
                                    <Line type="monotone" dataKey="pv" stroke="#555" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Gráfico de barras */}
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', boxShadow: 1 }}>
                            <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                                Comparación Semanal
                            </Typography>
                            <ResponsiveContainer width={500} height={500}>
                                <BarChart data={dataBarChart}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="name" stroke="#333" />
                                    <YAxis stroke="#333" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="uv" fill="#000" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Gráfico de Pie */}
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', boxShadow: 1 }}>
                            <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                                Distribución de Turnos
                            </Typography>
                            <ResponsiveContainer width={500} height={500}>
                                <PieChart>
                                    <Pie
                                        data={dataPieChart}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        fill="#8884d8"
                                        label
                                    >
                                        {dataPieChart.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#000' : '#555'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Gráfico de Área */}
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', boxShadow: 1 }}>
                            <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                                Gráfico de Área
                            </Typography>
                            <ResponsiveContainer width={500} height={500}>
                                <AreaChart data={dataAreaChart}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="name" stroke="#333" />
                                    <YAxis stroke="#333" />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="uv" fill="#000" stroke="#000" />
                                    <Area type="monotone" dataKey="pv" fill="#555" stroke="#555" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Gráfico de Radar */}
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', boxShadow: 1 }}>
                            <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                                Gráfico de Radar
                            </Typography>
                            <ResponsiveContainer width={500} height={500}>
                                <RadarChart outerRadius="80%" data={dataRadarChart}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} />
                                    <Radar name="A" dataKey="A" stroke="#000" fill="#8884d8" fillOpacity={0.6} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </AppLayout>
    );
}
