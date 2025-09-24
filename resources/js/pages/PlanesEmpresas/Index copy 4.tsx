import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Avatar,
    Tooltip,
    Fade,
    Divider,
    Stack,
    useTheme,
    alpha
} from '@mui/material';
import {
    Search as SearchIcon,
    PictureAsPdf as PdfIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Comment as CommentIcon,
    Business as BusinessIcon,
    Category as CategoryIcon,
    Person as PersonIcon,
    CheckCircle as CheckIcon
} from '@mui/icons-material';

type Empresa = {
    id: number;
    name: string;
    influencer: string | null;
    category_name: string;
    paquete_nombre: string;
};

type Comentario = {
    id: number;
    contenido: string;
    user?: { name: string };
};

type PlanEmpresa = {
    id: number | null;
    empresa_id: number;
    tiktok_mes: string;
    tiktok_semana: string;
    facebook_mes: string;
    facebook_semana: string;
    instagram_mes: string;
    instagram_semana: string;
    mensajes: string;
    empresa: Empresa;
    comentarios?: Comentario[];
};

type Props = {
    planes: PlanEmpresa[];
};

const Index = ({ planes }: Props) => {
    const theme = useTheme();
    const [formPlanes, setFormPlanes] = useState<PlanEmpresa[]>(planes);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);
    const [commentText, setCommentText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingCommentText, setEditingCommentText] = useState('');

    const handleChange = (planId: number | null, field: keyof PlanEmpresa, value: string) => {
        const updated = formPlanes.map((plan) => (plan.id === planId ? { ...plan, [field]: value } : plan));
        setFormPlanes(updated);
    };

    const handleBlur = (plan: PlanEmpresa) => {
        router.post('/planes-empresas/save', plan, {
            preserveScroll: true,
        });
    };

    const openCommentForm = (planId: number | null) => {
        setCurrentPlanId(planId);
        setCommentText('');
        setShowCommentForm(true);
    };

    const closeCommentForm = () => {
        setShowCommentForm(false);
        setCurrentPlanId(null);
        setCommentText('');
    };

    const submitComment = () => {
        if (!commentText.trim() || !currentPlanId) return;

        router.post(
            '/comentarios-planes',
            {
                contenido: commentText,
                plan_empresa_id: currentPlanId,
            },
            {
                onSuccess: () => {
                    setFormPlanes((prev) =>
                        prev.map((plan) =>
                            plan.id === currentPlanId
                                ? {
                                      ...plan,
                                      comentarios: [
                                          ...(plan.comentarios || []),
                                          {
                                              id: Date.now(),
                                              contenido: commentText,
                                              user: { name: 'Tú' },
                                          },
                                      ],
                                  }
                                : plan,
                        ),
                    );
                    closeCommentForm();
                },
            },
        );
    };

    const saveCommentEdit = (comentarioId: number, contenido: string, planId: number | null) => {
        if (!contenido.trim() || !planId) {
            setEditingCommentId(null);
            return;
        }

        router.post(
            '/comentarios-planes/update',
            {
                id: comentarioId,
                contenido,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFormPlanes((prev) =>
                        prev.map((plan) => {
                            if (plan.id === planId) {
                                return {
                                    ...plan,
                                    comentarios: plan.comentarios?.map((comentario) =>
                                        comentario.id === comentarioId ? { ...comentario, contenido } : comentario,
                                    ),
                                };
                            }
                            return plan;
                        }),
                    );
                    setEditingCommentId(null);
                },
            },
        );
    };

    const filteredPlanes = formPlanes.filter((plan) => 
        plan.empresa.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSocialMediaColor = (platform: string) => {
        switch (platform) {
            case 'tiktok': return '#000000';
            case 'facebook': return '#1877F2';
            case 'instagram': return '#E4405F';
            default: return theme.palette.primary.main;
        }
    };

    return (
        <AppLayout>
            <Head title="Planes de Empresas" />
            
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 700,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2
                        }}
                    >
                        Planes de Empresas
                    </Typography>
                    
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<PdfIcon />}
                            onClick={() => window.open('/planes-empresas/pdf', '_blank')}
                            sx={{
                                background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #388E3C, #4CAF50)',
                                },
                                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3
                            }}
                        >
                            Generar PDF
                        </Button>
                        
                        <TextField
                            variant="outlined"
                            placeholder="Buscar por empresa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                    '&:hover': {
                                        backgroundColor: theme.palette.background.paper,
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: theme.palette.background.paper,
                                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                                    }
                                },
                                minWidth: 300
                            }}
                        />
                    </Stack>
                </Box>

                {/* Main Table */}
                <Card 
                    elevation={0}
                    sx={{ 
                        borderRadius: 4,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        overflow: 'hidden'
                    }}
                >
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell 
                                        sx={{ 
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            color: theme.palette.primary.main,
                                            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <BusinessIcon fontSize="small" />
                                            <span>Empresa</span>
                                        </Stack>
                                    </TableCell>
                                    {[
                                        { key: 'TikTok (Mes)', color: '#000000' },
                                        { key: 'TikTok (Semana)', color: '#000000' },
                                        { key: 'Facebook (Mes)', color: '#1877F2' },
                                        { key: 'Facebook (Semana)', color: '#1877F2' },
                                        { key: 'Instagram (Mes)', color: '#E4405F' },
                                        { key: 'Instagram (Semana)', color: '#E4405F' },
                                        { key: 'Mensajes', color: theme.palette.info.main }
                                    ].map((header) => (
                                        <TableCell 
                                            key={header.key}
                                            sx={{ 
                                                backgroundColor: alpha(header.color, 0.05),
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                color: header.color,
                                                borderBottom: `2px solid ${alpha(header.color, 0.1)}`,
                                                minWidth: 120
                                            }}
                                        >
                                            {header.key}
                                        </TableCell>
                                    ))}
                                    <TableCell 
                                        sx={{ 
                                            backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            color: theme.palette.secondary.main,
                                            borderBottom: `2px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                                            minWidth: 200
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <CommentIcon fontSize="small" />
                                            <span>Comentarios</span>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPlanes.map((plan, index) => (
                                    <TableRow 
                                        key={plan.empresa_id}
                                        sx={{ 
                                            '&:hover': { 
                                                backgroundColor: alpha(theme.palette.action.hover, 0.04),
                                                transition: 'background-color 0.2s ease'
                                            },
                                            '&:nth-of-type(even)': {
                                                backgroundColor: alpha(theme.palette.action.hover, 0.02)
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ py: 2, minWidth: 250 }}>
                                            <Card 
                                                variant="outlined"
                                                sx={{ 
                                                    p: 2, 
                                                    borderRadius: 2,
                                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                    backgroundColor: alpha(theme.palette.background.paper, 0.5)
                                                }}
                                            >
                                                <Typography 
                                                    variant="subtitle2" 
                                                    component="a"
                                                    href={`/empresas/${plan.empresa_id}/seguimiento-videos`}
                                                    sx={{ 
                                                        color: theme.palette.primary.main,
                                                        textDecoration: 'none',
                                                        fontWeight: 600,
                                                        fontSize: '0.9rem',
                                                        '&:hover': { 
                                                            textDecoration: 'underline',
                                                            color: theme.palette.primary.dark
                                                        },
                                                        display: 'block',
                                                        mb: 1
                                                    }}
                                                >
                                                    {plan.empresa.name}
                                                </Typography>
                                                
                                                <Stack spacing={0.5}>
                                                    <Chip
                                                        icon={<CategoryIcon />}
                                                        label={plan.empresa.category_name}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ 
                                                            fontSize: '0.7rem',
                                                            height: 22,
                                                            borderColor: alpha(theme.palette.info.main, 0.3),
                                                            color: theme.palette.info.main
                                                        }}
                                                    />
                                                    <Chip
                                                        label={`Plan: ${plan.empresa.paquete_nombre}`}
                                                        size="small"
                                                        variant="filled"
                                                        sx={{ 
                                                            fontSize: '0.7rem',
                                                            height: 22,
                                                            backgroundColor: alpha(theme.palette.success.main, 0.1),
                                                            color: theme.palette.success.main
                                                        }}
                                                    />
                                                    {plan.empresa.influencer && (
                                                        <Chip
                                                            icon={<PersonIcon />}
                                                            label={plan.empresa.influencer}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ 
                                                                fontSize: '0.7rem',
                                                                height: 22,
                                                                fontStyle: 'italic',
                                                                borderColor: alpha(theme.palette.warning.main, 0.3),
                                                                color: theme.palette.warning.main
                                                            }}
                                                        />
                                                    )}
                                                </Stack>
                                            </Card>
                                        </TableCell>

                                        {[
                                            { field: 'tiktok_mes', color: '#000000' },
                                            { field: 'tiktok_semana', color: '#000000' },
                                            { field: 'facebook_mes', color: '#1877F2' },
                                            { field: 'facebook_semana', color: '#1877F2' },
                                            { field: 'instagram_mes', color: '#E4405F' },
                                            { field: 'instagram_semana', color: '#E4405F' },
                                            { field: 'mensajes', color: theme.palette.info.main }
                                        ].map(({ field, color }) => (
                                            <TableCell key={field} sx={{ py: 2 }}>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    value={plan[field as keyof PlanEmpresa] || ''}
                                                    onChange={(e) => handleChange(plan.id, field as keyof PlanEmpresa, e.target.value)}
                                                    onBlur={() => handleBlur(plan)}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            fontSize: '0.85rem',
                                                            '&:hover fieldset': {
                                                                borderColor: alpha(color, 0.5),
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: color,
                                                                boxShadow: `0 0 0 2px ${alpha(color, 0.1)}`,
                                                            },
                                                        },
                                                    }}
                                                />
                                            </TableCell>
                                        ))}

                                        <TableCell sx={{ py: 2, minWidth: 250 }}>
                                            <Box>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    onClick={() => openCommentForm(plan.id)}
                                                    size="small"
                                                    sx={{
                                                        mb: 2,
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                                        '&:hover': {
                                                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                                        },
                                                        boxShadow: `0 3px 15px ${alpha(theme.palette.primary.main, 0.3)}`
                                                    }}
                                                >
                                                    Agregar
                                                </Button>

                                                <Paper 
                                                    variant="outlined"
                                                    sx={{ 
                                                        maxHeight: 200, 
                                                        overflow: 'auto',
                                                        borderRadius: 2,
                                                        backgroundColor: alpha(theme.palette.background.default, 0.5),
                                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                                    }}
                                                >
                                                    <Box sx={{ p: 2 }}>
                                                        {plan.comentarios && plan.comentarios.length > 0 ? (
                                                            <Stack spacing={2}>
                                                                {plan.comentarios.map((comentario, idx) => (
                                                                    <Fade in={true} key={comentario.id}>
                                                                        <Card 
                                                                            variant="outlined"
                                                                            sx={{ 
                                                                                p: 1.5,
                                                                                borderRadius: 2,
                                                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                                                backgroundColor: theme.palette.background.paper,
                                                                                '&:hover': {
                                                                                    boxShadow: `0 2px 8px ${alpha(theme.palette.action.hover, 0.15)}`
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                                                <Avatar 
                                                                                    sx={{ 
                                                                                        width: 24, 
                                                                                        height: 24, 
                                                                                        fontSize: '0.7rem',
                                                                                        backgroundColor: theme.palette.primary.main
                                                                                    }}
                                                                                >
                                                                                    {(comentario.user?.name || 'A').charAt(0)}
                                                                                </Avatar>
                                                                                <Typography 
                                                                                    variant="caption" 
                                                                                    sx={{ 
                                                                                        fontWeight: 600,
                                                                                        color: theme.palette.text.primary
                                                                                    }}
                                                                                >
                                                                                    {comentario.user?.name || 'Anónimo'}
                                                                                </Typography>
                                                                            </Stack>
                                                                            
                                                                            {editingCommentId === comentario.id ? (
                                                                                <TextField
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    fullWidth
                                                                                    multiline
                                                                                    autoFocus
                                                                                    value={editingCommentText}
                                                                                    onChange={(e) => setEditingCommentText(e.target.value)}
                                                                                    onBlur={() => saveCommentEdit(comentario.id, editingCommentText, plan.id)}
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                                                            e.preventDefault();
                                                                                            saveCommentEdit(comentario.id, editingCommentText, plan.id);
                                                                                        } else if (e.key === 'Escape') {
                                                                                            setEditingCommentId(null);
                                                                                        }
                                                                                    }}
                                                                                    sx={{
                                                                                        '& .MuiOutlinedInput-root': {
                                                                                            fontSize: '0.8rem',
                                                                                            borderRadius: 1.5
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <Tooltip title="Click para editar">
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        onClick={() => {
                                                                                            setEditingCommentId(comentario.id);
                                                                                            setEditingCommentText(comentario.contenido);
                                                                                        }}
                                                                                        sx={{
                                                                                            cursor: 'pointer',
                                                                                            fontSize: '0.8rem',
                                                                                            lineHeight: 1.4,
                                                                                            '&:hover': {
                                                                                                backgroundColor: alpha(theme.palette.action.hover, 0.08),
                                                                                                borderRadius: 1,
                                                                                                px: 1,
                                                                                                py: 0.5,
                                                                                                ml: -1,
                                                                                                mr: -1
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        {comentario.contenido}
                                                                                    </Typography>
                                                                                </Tooltip>
                                                                            )}
                                                                        </Card>
                                                                    </Fade>
                                                                ))}
                                                            </Stack>
                                                        ) : (
                                                            <Typography 
                                                                variant="caption" 
                                                                sx={{ 
                                                                    color: theme.palette.text.disabled,
                                                                    fontStyle: 'italic',
                                                                    textAlign: 'center',
                                                                    display: 'block'
                                                                }}
                                                            >
                                                                Sin comentarios
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Paper>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>

                {/* Comment Modal */}
                <Dialog 
                    open={showCommentForm} 
                    onClose={closeCommentForm}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 4,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                            overflow: 'hidden'
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            color: 'white',
                            py: 3,
                            position: 'relative'
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                                <CommentIcon />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Agregar Comentario
                            </Typography>
                        </Stack>
                        <IconButton
                            onClick={closeCommentForm}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'rgba(255,255,255,0.8)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    color: 'white'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    
                    <DialogContent sx={{ p: 3, mt: 2 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={6}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Escribe tu comentario aquí..."
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.primary.main,
                                        borderWidth: 2,
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    fontSize: '0.95rem',
                                    lineHeight: 1.5
                                }
                            }}
                        />
                    </DialogContent>
                    
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button
                            onClick={closeCommentForm}
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={submitComment}
                            variant="contained"
                            startIcon={<CheckIcon />}
                            disabled={!commentText.trim()}
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                '&:hover': {
                                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                },
                                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                '&:disabled': {
                                    background: alpha(theme.palette.action.disabled, 0.12),
                                    color: theme.palette.action.disabled
                                }
                            }}
                        >
                            Guardar

                        </Button>
                    </DialogActions>
                </Dialog>
                
            </Container>
        </AppLayout>
    );
};

export default Index;