import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VisibilityIcon from '@mui/icons-material/Visibility';

type Company = {
    id: number;
    name: string;
};

type CompanyAssociation = {
    id: number;
    mes: string;
    fecha: string;
    company: Company;
};

type Comprobante = {
    id: number;
    comprobante: string;
    detalle: string;
    glosa: string;
    tipo: string;
    company_associations: CompanyAssociation[];
};

type Props = PageProps<{
    comprobantes: Comprobante[];
}>;

const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const Pagos = ({ comprobantes }: Props) => {
    const mesActual = meses[new Date().getMonth()];

    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<{
        comprobante: File | null;
        detalle: string;
        glosa: string;
        mes: string;
    }>({
        comprobante: null,
        detalle: '',
        glosa: '',
        mes: mesActual,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pagos.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <AppLayout>
            <Box
                sx={{
                    mb: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                    px: 3,
                    py: 2,
                    borderRadius: 2,
                    color: 'white',
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    Listado de tus Pagos
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<UploadFileIcon />}
                    onClick={() => setShowModal(true)}
                    sx={{
                        background: 'linear-gradient(45deg, #00695c 30%, #26a69a 90%)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #004d40 30%, #00897b 90%)',
                        },
                    }}
                >
                    Subir Comprobante
                </Button>
            </Box>

            <TableContainer
                component={Paper}
                elevation={4}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    maxWidth: 900,
                    mx: 'auto', // Centra horizontalmente el contenedor
                    my: 4, // Margen vertical para separación
                }}
            >
                <Table stickyHeader>
                    <TableHead
                        sx={{
                            background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                        }}
                    >
                        <TableRow>
                            <TableCell
                                sx={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    width: 150,
                                    textAlign: 'center',
                                    px: 2,
                                }}
                            >
                                Comprobante
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    width: 200,
                                    textAlign: 'center',
                                    px: 2,
                                }}
                            >
                                Detalle
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    width: 120,
                                    textAlign: 'center',
                                    px: 2,
                                }}
                            >
                                Mes
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    width: 120,
                                    textAlign: 'center',
                                    px: 2,
                                }}
                            >
                                Fecha de Registro
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {comprobantes.map((comp) => {
                            const associations = comp.company_associations;

                            return associations.length > 0 ? (
                                associations.map((assoc, index) => (
                                    <TableRow
                                        key={`${comp.id}-${assoc.id}`}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(33, 203, 243, 0.08)',
                                            },
                                        }}
                                    >
                                        {index === 0 && (
                                            <>
                                                <TableCell rowSpan={associations.length} sx={{ textAlign: 'center', px: 2, py: 1 }}>
                                                    {['jpg', 'jpeg', 'png'].includes(comp.tipo.toLowerCase()) ? (
                                                        <Box
                                                            component="img"
                                                            src={comp.comprobante}
                                                            alt="Vista previa"
                                                            sx={{
                                                                height: 80,
                                                                width: 80,
                                                                borderRadius: 1,
                                                                border: '1px solid #ddd',
                                                                objectFit: 'cover',
                                                                mx: 'auto',
                                                            }}
                                                        />
                                                    ) : comp.tipo.toLowerCase() === 'pdf' ? (
                                                        <Box
                                                            component="iframe"
                                                            src={comp.comprobante}
                                                            title="Vista PDF"
                                                            sx={{
                                                                height: 80,
                                                                width: 80,
                                                                borderRadius: 1,
                                                                border: '1px solid #ddd',
                                                                mx: 'auto',
                                                            }}
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary" textAlign="center">
                                                            Archivo no compatible
                                                        </Typography>
                                                    )}

                                                    <Box mt={1} display="flex" justifyContent="center" alignItems="center">
                                                        <Tooltip title="Ver archivo">
                                                            <IconButton
                                                                href={comp.comprobante}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                size="small"
                                                                color="primary"
                                                            >
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                                                            Ver archivo
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell rowSpan={associations.length} sx={{ verticalAlign: 'middle', px: 2, py: 1 }}>
                                                    {comp.detalle}
                                                </TableCell>
                                            </>
                                        )}

                                        <TableCell
                                            sx={{
                                                textTransform: 'capitalize',
                                                textAlign: 'center',
                                                px: 2,
                                                py: 1,
                                            }}
                                        >
                                            {assoc.mes}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center', px: 2, py: 1 }}>{assoc.fecha}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow
                                    key={comp.id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(33, 203, 243, 0.08)',
                                        },
                                    }}
                                >
                                    <TableCell sx={{ textAlign: 'center', px: 2, py: 1 }}>
                                        {['jpg', 'jpeg', 'png'].includes(comp.tipo.toLowerCase()) ? (
                                            <Box
                                                component="img"
                                                src={comp.comprobante}
                                                alt="Vista previa"
                                                sx={{
                                                    height: 80,
                                                    width: 80,
                                                    borderRadius: 1,
                                                    border: '1px solid #ddd',
                                                    objectFit: 'cover',
                                                    mx: 'auto',
                                                }}
                                            />
                                        ) : comp.tipo.toLowerCase() === 'pdf' ? (
                                            <Box
                                                component="iframe"
                                                src={comp.comprobante}
                                                title="Vista PDF"
                                                sx={{
                                                    height: 80,
                                                    width: 80,
                                                    borderRadius: 1,
                                                    border: '1px solid #ddd',
                                                    mx: 'auto',
                                                }}
                                            />
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                                Archivo no compatible
                                            </Typography>
                                        )}

                                        <Box mt={1} display="flex" justifyContent="center" alignItems="center">
                                            <Tooltip title="Ver archivo">
                                                <IconButton
                                                    href={comp.comprobante}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="small"
                                                    color="primary"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                                                Ver archivo
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ px: 2, py: 1 }}>{comp.detalle}</TableCell>
                                    <TableCell sx={{ textTransform: 'capitalize', px: 2, py: 1 }}>{comp.tipo}</TableCell>

                                    <TableCell colSpan={3} sx={{ textAlign: 'center', px: 2, py: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Sin asociaciones registradas
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal */}
            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ background: 'linear-gradient(90deg, #00695c 0%, #26a69a 100%)', color: 'white' }}>Nuevo Comprobante</DialogTitle>
                <DialogContent dividers sx={{ backgroundColor: '#f9f9f9' }}>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            label="Detalle"
                            fullWidth
                            value={data.detalle}
                            onChange={(e) => setData('detalle', e.target.value)}
                            error={Boolean(errors.detalle)}
                            helperText={errors.detalle}
                        />

                        <FormControl fullWidth margin="normal" error={Boolean(errors.mes)}>
                            <InputLabel id="mes-label">Mes</InputLabel>
                            <Select labelId="mes-label" value={data.mes} label="Mes" onChange={(e) => setData('mes', e.target.value)}>
                                {meses.map((m) => (
                                    <MenuItem key={m} value={m}>
                                        {m.charAt(0).toUpperCase() + m.slice(1)}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.mes && (
                                <Typography variant="caption" color="error">
                                    {errors.mes}
                                </Typography>
                            )}
                        </FormControl>

                        <Box mt={3}>
                            <input
                                type="file"
                                accept=".pdf,image/*"
                                id="file-upload"
                                onChange={(e) => setData('comprobante', e.target.files?.[0] ?? null)}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file-upload">
                                <Box
                                    sx={{
                                        border: `2px dashed ${errors.comprobante ? '#f44336' : '#ccc'}`,
                                        padding: 3,
                                        borderRadius: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: '#fff',
                                        transition: '0.2s',
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0',
                                        },
                                    }}
                                >
                                    {data.comprobante ? (
                                        <>
                                            {data.comprobante.type.startsWith('image/') ? (
                                                <Box
                                                    component="img"
                                                    src={URL.createObjectURL(data.comprobante)}
                                                    alt="Vista previa"
                                                    sx={{
                                                        maxHeight: 150,
                                                        maxWidth: '100%',
                                                        borderRadius: 1,
                                                        mb: 1,
                                                    }}
                                                />
                                            ) : data.comprobante.type === 'application/pdf' ? (
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        height: 150,
                                                        borderRadius: 1,
                                                        overflow: 'hidden',
                                                        mb: 1,
                                                    }}
                                                >
                                                    <embed
                                                        src={URL.createObjectURL(data.comprobante)}
                                                        type="application/pdf"
                                                        width="100%"
                                                        height="150px"
                                                    />
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    Archivo seleccionado: {data.comprobante.name}
                                                </Typography>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <UploadFileIcon sx={{ fontSize: 40, color: '#666' }} />
                                            <Typography variant="body2" color="text.secondary" mt={1}>
                                                Haz clic para seleccionar un archivo PDF o imagen
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </label>

                            {errors.comprobante && (
                                <Typography variant="caption" color="error" display="block" mt={1}>
                                    {errors.comprobante}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setShowModal(false)} startIcon={<CancelIcon />} variant="outlined" color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} startIcon={<SaveIcon />} variant="contained" color="success" disabled={processing}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default Pagos;
