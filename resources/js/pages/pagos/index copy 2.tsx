import React, { useEffect, useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import {
    Box,
    Paper,
    CircularProgress,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    IconButton,
    InputAdornment,
    Chip,
    Stack,
    Typography,
    Tooltip,
} from '@mui/material';
import {
    DataGrid,
    GridToolbar,
    GridColDef,
} from '@mui/x-data-grid';
import { esES as dataGridEsES } from '@mui/x-data-grid/locales';
import {
    Search,
    Add,
    CloudUpload,
    FilterList,
    Clear,
    Download,
    Visibility,
    Description,
    AttachFile,
    Business,
    Event,
    Label,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useDropzone } from 'react-dropzone';
import { format,parseISO } from 'date-fns';
import axios from 'axios';
import { styled } from '@mui/material/styles';

// Define breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', url: '/' },
    { label: 'Pagos', url: '/pagos' },
];

// Types
interface Comprobante {
    id: number;
    comprobante: string;
    detalle: string;
    glosa: string;
    tipo: string;
    created_at: string;
    company_associations: Array<{
        company: {
            id: number;
            name: string;
            contrato: string;
            monto_mensual: string;
        };
        mes: string;
    }>;
}

interface Company {
    id: number;
    name: string;
}

interface FilterOptions {
    search: string;
    company: string;
    dateFrom: Date | null;
    dateTo: Date | null;
    tipo: string;
}

// Update the columns definition with icons and better formatting
const columns: GridColDef[] = [
    {
        field: 'comprobante',
        headerName: 'Comprobante',
        width: 150,
        renderHeader: () => (
            <Stack direction="row" spacing={1} alignItems="center">
                <AttachFile />
                <Typography>Comprobante</Typography>
            </Stack>
        ),
        renderCell: (params) => (
            <Tooltip title="Ver comprobante">
                <IconButton
                    color="primary"
                    onClick={() => window.open(`/storage/${params.value}`, '_blank')}
                >
                    <Visibility />
                </IconButton>
            </Tooltip>
        ),
    },
    {
        field: 'detalle',
        headerName: 'Detalle',
        width: 200,
        flex: 1,
        renderHeader: () => (
            <Stack direction="row" spacing={1} alignItems="center">
                <Description />
                <Typography>Detalle</Typography>
            </Stack>
        ),
    },
    {
        field: 'glosa',
        headerName: 'Glosa',
        width: 200,
        flex: 1,
        renderHeader: () => (
            <Stack direction="row" spacing={1} alignItems="center">
                <Label />
                <Typography>Glosa</Typography>
            </Stack>
        ),
    },
 {
        field: 'mes',
        headerName: 'mes',
        width: 200,
        flex: 1,
        renderHeader: () => (
            <Stack direction="row" spacing={1} alignItems="center">
                <Label />
                <Typography>mes</Typography>
            </Stack>
        ),
    },
    {
        field: 'company_associations',
        headerName: 'Compañías',
        width: 300,
        flex: 1,
        renderHeader: () => (
            <Stack direction="row" spacing={1} alignItems="center">
                <Business />
                <Typography>Compañías</Typography>
            </Stack>
        ),
        renderCell: (params) => (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {params.value.map((assoc: any, index: number) => (
                    <Tooltip
                        key={`${assoc.company.id}-${params.row.id}-${index}-${assoc.mes}`}
                        title={
                            <Stack spacing={1}>
                                <Typography variant="caption">
                                    Contrato: {assoc.company.contrato}
                                </Typography>
                                <Typography variant="caption">
                                    Monto: ${assoc.company.monto_mensual}
                                </Typography>
                                <Typography variant="caption">
                                    Mes: {assoc.mes}
                                </Typography>
                            </Stack>
                        }
                    >
                        <Chip
                            label={assoc.company.name}
                            size="small"
                            variant="outlined"
                            sx={{ margin: '2px' }}
                        />
                    </Tooltip>
                ))}
            </Stack>
        ),
    },
];

// Define styled components
const StyledDropzone = styled('div')(({ theme }) => ({
    border: '2px dashed #cccccc',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
    '&:hover': {
        borderColor: theme.palette.primary.main,
    },
}));

const FilterSection = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
}));

export default function Pagos() {
    const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [detalle, setDetalle] = useState('');
    const [glosa, setGlosa] = useState('');
    const [companyId, setCompanyId] = useState<string>('');
    const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
    const [mes, setMes] = useState('');
    const [message, setMessage] = useState<string>('');
    const [loadingForm, setLoadingForm] = useState<boolean>(false);
    const [linkId, setLinkId] = useState<number>(1);

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        search: '',
        company: '',
        dateFrom: null,
        dateTo: null,
        tipo: '',
    });

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });

    // Load initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [comprobantesRes, companiesRes] = await Promise.all([
                    axios.get('/comprobantes'),
                    axios.get('/api/companies')
                ]);
                setComprobantes(comprobantesRes.data);
                setCompanies(companiesRes.data);
            } catch (error) {
                console.error('Error loading data:', error);
                setMessage('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Función para manejar la carga de archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setComprobanteFile(e.target.files[0]);
        }
    };

    // Función para manejar el envío del formulario de creación
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingForm(true);

        try {
            const formData = new FormData();
            formData.append('comprobante', comprobanteFile);
            formData.append('detalle', detalle);
            formData.append('glosa', glosa);
            formData.append('company_id', companyId);
            formData.append('mes', mes);
            formData.append('link_id', linkId.toString());

            // Ensure we're sending a valid date
            const currentDate = new Date();
            formData.append('fecha', format(currentDate, 'yyyy-MM-dd HH:mm:ss'));

            await axios.post('/comprobante', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Refresh comprobantes list
            const response = await axios.get('/comprobantes');
            setComprobantes(response.data);

            // Reset form
            setDetalle('');
            setGlosa('');
            setCompanyId('');
            setMes('');
            setComprobanteFile(null);
            setOpenForm(false);
            setMessage('Comprobante creado exitosamente');
        } catch (error: any) {
            console.error('Error:', error);
            setMessage('Error al crear el comprobante');
        } finally {
            setLoadingForm(false);
        }
    };

    // Dropzone configuration
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
        onDrop: (acceptedFiles) => {
            setComprobanteFile(acceptedFiles[0]);
        },
    });

    // Filter logic
    const filteredComprobantes = useMemo(() => {
        return comprobantes.filter((comprobante) => {
            const matchesSearch = comprobante.detalle
                .toLowerCase()
                .includes(filterOptions.search.toLowerCase()) ||
                comprobante.glosa
                    .toLowerCase()
                    .includes(filterOptions.search.toLowerCase());

            const matchesCompany = !filterOptions.company ||
                comprobante.company_associations.some(
                    (assoc) => assoc.company.id.toString() === filterOptions.company
                );

            const matchesDate =
                (!filterOptions.dateFrom ||
                    new Date(comprobante.created_at) >= filterOptions.dateFrom) &&
                (!filterOptions.dateTo ||
                    new Date(comprobante.created_at) <= filterOptions.dateTo);

            const matchesTipo = !filterOptions.tipo ||
                comprobante.tipo === filterOptions.tipo;

            return matchesSearch && matchesCompany && matchesDate && matchesTipo;
        });
    }, [comprobantes, filterOptions]);

    // Export data
    const handleExport = () => {
        const csvContent = filteredComprobantes
            .map((item) => {
                return [
                    item.detalle,
                    item.glosa,
                    item.tipo,
                    format(new Date(item.created_at), 'dd/MM/yyyy'),
                    item.company_associations
                        .map((assoc) => assoc.company.name)
                        .join(', '),
                ].join(',');
            })
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comprobantes-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <CircularProgress />
            </AppLayout>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setOpenForm(!openForm)}
                        >
                            {openForm ? 'Cancelar' : 'Nuevo Comprobante'}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={handleExport}
                        >
                            Exportar
                        </Button>
                    </Stack>
                </Box>

                {/* Filter Section */}
                <FilterSection>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <TextField
                            label="Buscar"
                            variant="outlined"
                            size="small"
                            value={filterOptions.search}
                            onChange={(e) =>
                                setFilterOptions((prev) => ({
                                    ...prev,
                                    search: e.target.value,
                                }))
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Compañía</InputLabel>
                            <Select
                                value={filterOptions.company}
                                onChange={(e) =>
                                    setFilterOptions((prev) => ({
                                        ...prev,
                                        company: e.target.value,
                                    }))
                                }
                                label="Compañía"
                            >
                                <MenuItem value="">Todas</MenuItem>
                                {companies.map((company) => (
                                    <MenuItem key={company.id} value={company.id}>
                                        {company.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <DatePicker
                            label="Desde"
                            value={filterOptions.dateFrom}
                            onChange={(date) =>
                                setFilterOptions((prev) => ({
                                    ...prev,
                                    dateFrom: date,
                                }))
                            }
                            slotProps={{ textField: { size: 'small' } }}
                        />
                        <DatePicker
                            label="Hasta"
                            value={filterOptions.dateTo}
                            onChange={(date) =>
                                setFilterOptions((prev) => ({
                                    ...prev,
                                    dateTo: date,
                                }))
                            }
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </Stack>
                </FilterSection>

                {/* Form Section */}
                {openForm && (
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Nuevo Comprobante
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <StyledDropzone {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {isDragActive ? (
                                        <Typography>Suelta el archivo aquí...</Typography>
                                    ) : (
                                        <Stack alignItems="center" spacing={1}>
                                            <CloudUpload fontSize="large" color="primary" />
                                            <Typography>
                                                Arrastra un archivo o haz clic para seleccionar
                                            </Typography>
                                            {comprobanteFile && (
                                                <Chip
                                                    label={comprobanteFile.name}
                                                    onDelete={() => setComprobanteFile(null)}
                                                />
                                            )}
                                        </Stack>
                                    )}
                                </StyledDropzone>

                                <TextField
                                    label="Detalle"
                                    value={detalle}
                                    onChange={(e) => setDetalle(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    label="Glosa"
                                    value={glosa}
                                    onChange={(e) => setGlosa(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Compañía</InputLabel>
                                    <Select
                                        value={companyId}
                                        onChange={(e) => setCompanyId(e.target.value)}
                                        label="Compañía"
                                    >
                                        {companies.map((company) => (
                                            <MenuItem key={`${company.id}-${company.name}`} value={company.id}>
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
                                    margin="normal"
                                    required
                                />
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Link ID</InputLabel>
                                    <Select
                                        value={linkId}
                                        onChange={(e) => setLinkId(Number(e.target.value))}
                                        label="Link ID"
                                    >
                                        <MenuItem value={1}>Link 1</MenuItem>
                                        <MenuItem value={2}>Link 2</MenuItem>
                                    </Select>
                                </FormControl>

                                <div style={{ marginTop: '20px' }}>
                                    {loadingForm ? (
                                        <CircularProgress />
                                    ) : (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={!comprobanteFile || !detalle || !glosa || !companyId || !mes || !linkId}
                                        >
                                            Crear Comprobante
                                        </Button>
                                    )}
                                </div>
                            </Stack>
                        </form>
                    </Paper>
                )}

                {/* Data Grid */}
                <Paper>
                    <DataGrid
                        rows={filteredComprobantes}
                        columns={columns}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10, 25, 50, 100]}
                        loading={loading}
                        autoHeight
                        getRowId={(row) => `${row.id}-${row.created_at}`}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 },
                            },
                        }}
                        localeText={dataGridEsES.components.MuiDataGrid.defaultProps.localeText}
                        sx={{
                            '& .MuiDataGrid-toolbarContainer': {
                                padding: 2,
                                gap: 2
                            },
                            '& .MuiDataGrid-row': {
                                minHeight: '80px !important'
                            },
                            '& .MuiDataGrid-cell': {
                                whiteSpace: 'normal',
                                lineHeight: 'normal',
                                padding: 1
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: (theme) => theme.palette.grey[100]
                            }
                        }}
                    />
                </Paper>

                <Snackbar
                    open={message !== ''}
                    message={message}
                    autoHideDuration={6000}
                    onClose={() => setMessage('')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
            </AppLayout>
        </LocalizationProvider>
    );
}
