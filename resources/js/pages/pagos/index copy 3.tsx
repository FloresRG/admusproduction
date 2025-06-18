import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CircularProgress,
    IconButton,
    Tooltip,
    Snackbar,
    Stack,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Visibility, CloudUpload } from '@mui/icons-material';
import axios from 'axios';

// Tipos
interface Company {
    id: number;
    name: string;
}

interface CompanyAssociation {
    company: Company;
    mes: string;
}

interface Comprobante {
    id: number;
    comprobante: string;
    detalle: string;
    glosa: string;
    tipo: string;
    company_associations: CompanyAssociation[];
}

// Breadcrumbs
const breadcrumbs = [
    { label: 'Dashboard', url: '/' },
    { label: 'Pagos', url: '/pagos' },
];

export default function Pagos() {
    const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    // Form
    const [detalle, setDetalle] = useState('');
    const [glosa, setGlosa] = useState('');
    const [companyId, setCompanyId] = useState<number | ''>('');
    const [mes, setMes] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [creating, setCreating] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [comprobanteRes, companiesRes] = await Promise.all([
                    axios.get<Comprobante[]>('/comprobantes'),
                    axios.get<Company[]>('/api/companies'),
                ]);
                setComprobantes(comprobanteRes.data);
                setCompanies(companiesRes.data);
            } catch (err) {
                console.error('Error al cargar datos:', err);
                setMessage('Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || companyId === '' || !detalle || !glosa || !mes) {
            setMessage('Por favor completa todos los campos y selecciona un archivo.');
            return;
        }

        setCreating(true);
        const formData = new FormData();
        formData.append('comprobante', file);
        formData.append('detalle', detalle);
        formData.append('glosa', glosa);
        formData.append('company_id', companyId.toString());
        formData.append('mes', mes);
        formData.append('fecha', new Date().toISOString().slice(0, 19).replace('T', ' '));
        formData.append('link_id', '1'); // Si este campo es necesario

        try {
            await axios.post('/comprobante', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Refrescar lista
            const updated = await axios.get<Comprobante[]>('/comprobantes');
            setComprobantes(updated.data);

            // Reset form
            setDetalle('');
            setGlosa('');
            setCompanyId('');
            setMes('');
            setFile(null);
            setMessage('Comprobante creado exitosamente');
        } catch (err) {
            console.error(err);
            setMessage('Error al crear el comprobante');
        } finally {
            setCreating(false);
        }
    };

    const columns = [
        { field: 'detalle', headerName: 'Detalle', flex: 1 },
        { field: 'glosa', headerName: 'Glosa', flex: 1 },
        { field: 'tipo', headerName: 'Tipo', width: 100 },

        {
            field: 'mes',
            headerName: 'Mes',
            width: 120,
            valueGetter: (params: any) => {
                const associations: CompanyAssociation[] = params?.row?.company_associations || [];
                return associations.length > 0 ? associations[0].mes : '—';
            },
        },
        {
            field: 'companies',
            headerName: 'Compañías',
            flex: 1,
            valueGetter: (params: any) => {
                 console.log('params.row.company_associations:', params?.row?.company_associations);
 
                const associations: CompanyAssociation[] = params?.row?.company_associations || [];
                return associations.length > 0
                    ? associations.map((a) => `${a.company.name} (${a.mes})`).join(', ')
                    : '—';
            },
        },

        {
            field: 'ver',
            headerName: 'Archivo',
            width: 80,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
                <Tooltip title="Ver Comprobante">
                    <IconButton
                        onClick={() => window.open(`/storage/${params.row.comprobante}`, '_blank')}
                        color="primary"
                    >
                        <Visibility />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Comprobantes
                </Typography>

                {/* Formulario */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label="Detalle"
                                value={detalle}
                                onChange={(e) => setDetalle(e.target.value)}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Glosa"
                                value={glosa}
                                onChange={(e) => setGlosa(e.target.value)}
                                fullWidth
                                required
                            />
                            <FormControl fullWidth required>
                                <InputLabel id="company-label">Compañía</InputLabel>
                                <Select
                                    labelId="company-label"
                                    value={companyId}
                                    onChange={(e) => setCompanyId(Number(e.target.value))}
                                    label="Compañía"
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        Selecciona una compañía
                                    </MenuItem>
                                    {companies.map((company) => (
                                        <MenuItem key={company.id} value={company.id}>
                                            {company.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Mes"
                                value={mes}
                                onChange={(e) => setMes(e.target.value)}
                                fullWidth
                                required
                                placeholder="Ejemplo: September"
                            />

                            <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
                                {file ? file.name : 'Seleccionar Archivo'}
                                <input
                                    type="file"
                                    hidden
                                    accept="application/pdf,image/*"
                                    onChange={(e) => e.target.files && setFile(e.target.files[0])}
                                />
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={creating || !file || !detalle || !glosa || companyId === '' || !mes}
                            >
                                {creating ? 'Creando...' : 'Crear Comprobante'}
                            </Button>
                        </Stack>
                    </form>
                </Paper>

                {/* Tabla */}
                <Paper>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <DataGrid
                            rows={comprobantes}
                            columns={columns}
                            autoHeight
                            pageSizeOptions={[10, 25, 50, 100]}
                            getRowId={(row) => row.id}
                            disableSelectionOnClick
                            sx={{ fontSize: '0.9rem' }}
                        />
                    )}
                </Paper>

                {/* Snackbar */}
                <Snackbar
                    open={!!message}
                    autoHideDuration={4000}
                    onClose={() => setMessage('')}
                    message={message}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
            </Box>
        </AppLayout>
    );
}
