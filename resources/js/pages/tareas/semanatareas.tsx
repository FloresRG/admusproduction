'use client';

import {
    AlertCircle,
    Building,
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Circle,
    Clock,
    Edit,
    Filter,
    MoreHorizontal,
    Plus,
    Save,
    Search,
    Tag,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// Types
type Tarea = {
    id: number;
    titulo: string;
    descripcion: string | null;
    prioridad: string | null;
    fecha: string;
    tipo: {
        id: number;
        nombre_tipo: string;
    } | null;
    company: {
        id: number;
        name: string;
    } | null;
    asignados?: Asignado[];
};

type Asignado = {
    id: number;
    user_id: number;
    user_name: string;
    estado: string;
    detalle: string;
};

type TareasSemanaResponse = {
    inicio: string;
    fin: string;
    dias: Record<string, Tarea[]>;
};

type TipoTarea = {
    id: number;
    nombre: string;
};

type Empresa = {
    id: number;
    name: string;
};

type Usuario = {
    id: number;
    name: string;
    email: string;
};

export default function WeeklyTasksImproved() {
    // Estados principales
    const [datosSemana, setDatosSemana] = useState<TareasSemanaResponse | null>(null);
    const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [tipos, setTipos] = useState<TipoTarea[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    // Estados de filtrado
    const [searchTerm, setSearchTerm] = useState('');
    const [filterUser, setFilterUser] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Estados para nueva tarea
    const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
    const [newTaskData, setNewTaskData] = useState({
        titulo: '',
        prioridad: '',
        descripcion: '',
        fecha: '',
        tipo_id: '',
        company_id: '',
    });
    const [asignacionTipo, setAsignacionTipo] = useState<'aleatoria' | 'manual'>('aleatoria');
    const [selectedPasanteId, setSelectedPasanteId] = useState<string>('');

    // Estados de vista
    const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
    const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});

    // Simular datos para demo
    useEffect(() => {
        const mockData = {
            inicio: '2024-01-15',
            fin: '2024-01-21',
            dias: {
                '2024-01-15': [
                    {
                        id: 1,
                        titulo: 'Diseñar landing page',
                        descripcion: 'Crear el diseño de la página principal del sitio web',
                        prioridad: 'alta',
                        fecha: '2024-01-15',
                        tipo: { id: 1, nombre_tipo: 'Diseño' },
                        company: { id: 1, name: 'TechCorp' },
                        asignados: [
                            {
                                id: 1,
                                user_id: 1,
                                user_name: 'Ana García',
                                estado: 'en_revision',
                                detalle: 'Mockups completados al 80%',
                            },
                        ],
                    },
                    {
                        id: 2,
                        titulo: 'Optimizar base de datos',
                        descripcion: 'Mejorar el rendimiento de las consultas principales',
                        prioridad: 'media',
                        fecha: '2024-01-15',
                        tipo: { id: 2, nombre_tipo: 'Backend' },
                        company: { id: 2, name: 'DataSoft' },
                        asignados: [
                            {
                                id: 2,
                                user_id: 2,
                                user_name: 'Carlos López',
                                estado: 'pendiente',
                                detalle: 'Análisis inicial completado',
                            },
                        ],
                    },
                ],
                '2024-01-16': [
                    {
                        id: 3,
                        titulo: 'Testing de aplicación móvil',
                        descripcion: 'Realizar pruebas exhaustivas en diferentes dispositivos',
                        prioridad: 'alta',
                        fecha: '2024-01-16',
                        tipo: { id: 3, nombre_tipo: 'QA' },
                        company: { id: 1, name: 'TechCorp' },
                        asignados: [
                            {
                                id: 3,
                                user_id: 3,
                                user_name: 'María Rodríguez',
                                estado: 'publicada',
                                detalle: 'Todas las pruebas completadas exitosamente',
                            },
                        ],
                    },
                ],
                '2024-01-17': [],
                '2024-01-18': [
                    {
                        id: 4,
                        titulo: 'Documentación API',
                        descripcion: 'Crear documentación completa de los endpoints',
                        prioridad: 'baja',
                        fecha: '2024-01-18',
                        tipo: { id: 4, nombre_tipo: 'Documentación' },
                        company: { id: 3, name: 'DevStudio' },
                        asignados: [
                            {
                                id: 4,
                                user_id: 1,
                                user_name: 'Ana García',
                                estado: 'pendiente',
                                detalle: 'Iniciando estructura del documento',
                            },
                        ],
                    },
                ],
                '2024-01-19': [],
                '2024-01-20': [],
                '2024-01-21': [],
            },
        };

        setTimeout(() => {
            setDatosSemana(mockData);
            setTipos([
                { id: 1, nombre: 'Diseño' },
                { id: 2, nombre: 'Backend' },
                { id: 3, nombre: 'QA' },
                { id: 4, nombre: 'Documentación' },
            ]);
            setEmpresas([
                { id: 1, name: 'TechCorp' },
                { id: 2, name: 'DataSoft' },
                { id: 3, name: 'DevStudio' },
            ]);
            setUsuarios([
                { id: 1, name: 'Ana García', email: 'ana@example.com' },
                { id: 2, name: 'Carlos López', email: 'carlos@example.com' },
                { id: 3, name: 'María Rodríguez', email: 'maria@example.com' },
            ]);
            setLoading(false);

            // Expandir todos los días por defecto
            const expanded: Record<string, boolean> = {};
            Object.keys(mockData.dias).forEach((dia) => {
                expanded[dia] = true;
            });
            setExpandedDays(expanded);
        }, 1000);
    }, []);

    // Obtener todas las tareas filtradas
    const allFilteredTasks = useMemo(() => {
        if (!datosSemana?.dias) return [];

        let allTasks: Tarea[] = [];
        Object.values(datosSemana.dias).forEach((dayTasks) => {
            allTasks = [...allTasks, ...dayTasks];
        });

        // Aplicar filtros
        if (searchTerm) {
            allTasks = allTasks.filter(
                (t) => t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || t.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        if (filterPriority !== 'all') {
            allTasks = allTasks.filter((t) => t.prioridad === filterPriority);
        }

        if (filterUser !== 'all') {
            allTasks = allTasks.filter((t) => t.asignados?.some((a) => a.user_name === filterUser));
        }

        if (filterStatus !== 'all') {
            allTasks = allTasks.filter((t) => t.asignados?.some((a) => a.estado === filterStatus));
        }

        return allTasks;
    }, [datosSemana, searchTerm, filterPriority, filterUser, filterStatus]);

    // Agrupar tareas filtradas por día
    const filteredTasksByDay = useMemo(() => {
        const grouped: Record<string, Tarea[]> = {};

        allFilteredTasks.forEach((task) => {
            if (!grouped[task.fecha]) {
                grouped[task.fecha] = [];
            }
            grouped[task.fecha].push(task);
        });

        return grouped;
    }, [allFilteredTasks]);

    // Funciones de utilidad
    const getPriorityColor = (prioridad: string) => {
        switch (prioridad?.toLowerCase()) {
            case 'alta':
                return 'destructive';
            case 'media':
                return 'default';
            case 'baja':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getPriorityIcon = (prioridad: string) => {
        switch (prioridad?.toLowerCase()) {
            case 'alta':
                return <AlertCircle className="h-4 w-4" />;
            case 'media':
                return <Circle className="h-4 w-4" />;
            case 'baja':
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <Circle className="h-4 w-4" />;
        }
    };

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'publicada':
                return 'default';
            case 'en_revision':
                return 'secondary';
            case 'pendiente':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    };

    const handleCreateTask = async () => {
        if (!newTaskData.titulo.trim()) return;

        // Simular creación de tarea
        console.log('Creando tarea:', newTaskData);
        setShowNewTaskDialog(false);
        setNewTaskData({
            titulo: '',
            prioridad: '',
            descripcion: '',
            fecha: '',
            tipo_id: '',
            company_id: '',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Skeleton className="h-10 rounded-lg" />
                        <Skeleton className="h-10 rounded-lg" />
                        <Skeleton className="h-10 rounded-lg" />
                    </div>
                    <Skeleton className="h-96 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="flex items-center gap-3 text-4xl font-bold">
                                <Calendar className="h-10 w-10" />
                                Gestión de Tareas Semanales
                            </h1>
                            {datosSemana && (
                                <p className="mt-2 text-xl opacity-90">
                                    Semana del {formatDate(datosSemana.inicio)} al {formatDate(datosSemana.fin)}
                                </p>
                            )}
                            <div className="mt-4 flex items-center gap-4">
                                <Badge variant="secondary" className="px-3 py-1 text-sm">
                                    {allFilteredTasks.length} tareas totales
                                </Badge>
                                <Badge variant="secondary" className="px-3 py-1 text-sm">
                                    {Object.keys(filteredTasksByDay).length} días con tareas
                                </Badge>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowNewTaskDialog(true)}
                            size="lg"
                            className="border border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Nueva Tarea
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Filtros */}
                <Card className="mb-8 border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filtros y Búsqueda
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                <Input
                                    placeholder="Buscar tareas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={filterPriority} onValueChange={setFilterPriority}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrar por prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las prioridades</SelectItem>
                                    <SelectItem value="alta">Alta</SelectItem>
                                    <SelectItem value="media">Media</SelectItem>
                                    <SelectItem value="baja">Baja</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filterUser} onValueChange={setFilterUser}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrar por usuario" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los usuarios</SelectItem>
                                    {usuarios.map((user) => (
                                        <SelectItem key={user.id} value={user.name}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrar por estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    <SelectItem value="pendiente">Pendiente</SelectItem>
                                    <SelectItem value="en_revision">En Revisión</SelectItem>
                                    <SelectItem value="publicada">Publicada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de tareas por día */}
                <div className="space-y-6">
                    {datosSemana &&
                        Object.keys(datosSemana.dias).map((fecha) => {
                            const tareasDelDia = filteredTasksByDay[fecha] || [];
                            const todasLasTareasDelDia = datosSemana.dias[fecha] || [];

                            return (
                                <Card key={fecha} className="overflow-hidden border-0 shadow-lg">
                                    <Collapsible
                                        open={expandedDays[fecha]}
                                        onOpenChange={(open) => setExpandedDays({ ...expandedDays, [fecha]: open })}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <CardHeader className="cursor-pointer transition-colors hover:bg-slate-50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        {expandedDays[fecha] ? (
                                                            <ChevronDown className="text-muted-foreground h-5 w-5" />
                                                        ) : (
                                                            <ChevronRight className="text-muted-foreground h-5 w-5" />
                                                        )}
                                                        <div>
                                                            <CardTitle className="text-xl">{formatDate(fecha)}</CardTitle>
                                                            <p className="text-muted-foreground mt-1 text-sm">
                                                                {todasLasTareasDelDia.length} {todasLasTareasDelDia.length === 1 ? 'tarea' : 'tareas'}{' '}
                                                                programadas
                                                                {tareasDelDia.length !== todasLasTareasDelDia.length &&
                                                                    ` • ${tareasDelDia.length} mostradas`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {tareasDelDia.length > 0 && (
                                                            <>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {tareasDelDia.filter((t) => t.prioridad === 'alta').length} Alta
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {tareasDelDia.filter((t) => t.prioridad === 'media').length} Media
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {tareasDelDia.filter((t) => t.prioridad === 'baja').length} Baja
                                                                </Badge>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </CollapsibleTrigger>

                                        <CollapsibleContent>
                                            <CardContent className="pt-0">
                                                {tareasDelDia.length === 0 ? (
                                                    <div className="text-muted-foreground py-12 text-center">
                                                        <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                                        <p className="text-lg font-medium">No hay tareas para este día</p>
                                                        <p className="text-sm">Las tareas aparecerán aquí cuando las crees</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {tareasDelDia.map((tarea) => (
                                                            <Card
                                                                key={tarea.id}
                                                                className="border border-slate-200 transition-shadow hover:shadow-md"
                                                            >
                                                                <Collapsible
                                                                    open={expandedTasks[tarea.id]}
                                                                    onOpenChange={(open) => setExpandedTasks({ ...expandedTasks, [tarea.id]: open })}
                                                                >
                                                                    <CollapsibleTrigger asChild>
                                                                        <CardHeader className="cursor-pointer pb-3 transition-colors hover:bg-slate-50/50">
                                                                            <div className="flex items-start justify-between">
                                                                                <div className="flex-1">
                                                                                    <div className="mb-2 flex items-center gap-3">
                                                                                        <h3 className="text-lg font-semibold">{tarea.titulo}</h3>
                                                                                        {expandedTasks[tarea.id] ? (
                                                                                            <ChevronDown className="text-muted-foreground h-4 w-4" />
                                                                                        ) : (
                                                                                            <ChevronRight className="text-muted-foreground h-4 w-4" />
                                                                                        )}
                                                                                    </div>

                                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                                        <Badge
                                                                                            variant={getPriorityColor(tarea.prioridad || '')}
                                                                                            className="text-xs"
                                                                                        >
                                                                                            {getPriorityIcon(tarea.prioridad || '')}
                                                                                            <span className="ml-1">
                                                                                                {tarea.prioridad?.toUpperCase() || 'SIN PRIORIDAD'}
                                                                                            </span>
                                                                                        </Badge>

                                                                                        {tarea.tipo && (
                                                                                            <Badge variant="outline" className="text-xs">
                                                                                                <Tag className="mr-1 h-3 w-3" />
                                                                                                {tarea.tipo.nombre_tipo}
                                                                                            </Badge>
                                                                                        )}

                                                                                        {tarea.company && (
                                                                                            <Badge variant="outline" className="text-xs">
                                                                                                <Building className="mr-1 h-3 w-3" />
                                                                                                {tarea.company.name}
                                                                                            </Badge>
                                                                                        )}

                                                                                        <Badge variant="outline" className="text-xs">
                                                                                            <Clock className="mr-1 h-3 w-3" />
                                                                                            {tarea.fecha}
                                                                                        </Badge>
                                                                                    </div>

                                                                                    {tarea.asignados && tarea.asignados.length > 0 && (
                                                                                        <div className="mt-3 flex items-center gap-2">
                                                                                            <User className="text-muted-foreground h-4 w-4" />
                                                                                            <div className="flex items-center gap-2">
                                                                                                {tarea.asignados.map((asignado) => (
                                                                                                    <div
                                                                                                        key={asignado.id}
                                                                                                        className="flex items-center gap-2"
                                                                                                    >
                                                                                                        <Avatar className="h-6 w-6">
                                                                                                            <AvatarFallback className="text-xs">
                                                                                                                {getInitials(asignado.user_name)}
                                                                                                            </AvatarFallback>
                                                                                                        </Avatar>
                                                                                                        <span className="text-sm font-medium">
                                                                                                            {asignado.user_name}
                                                                                                        </span>
                                                                                                        <Badge
                                                                                                            variant={getStatusColor(asignado.estado)}
                                                                                                            className="text-xs"
                                                                                                        >
                                                                                                            {asignado.estado
                                                                                                                .replace('_', ' ')
                                                                                                                .toUpperCase()}
                                                                                                        </Badge>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                                <DropdownMenu>
                                                                                    <DropdownMenuTrigger asChild>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            onClick={(e) => e.stopPropagation()}
                                                                                        >
                                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                                        </Button>
                                                                                    </DropdownMenuTrigger>
                                                                                    <DropdownMenuContent align="end">
                                                                                        <DropdownMenuItem>
                                                                                            <Edit className="mr-2 h-4 w-4" />
                                                                                            Editar tarea
                                                                                        </DropdownMenuItem>
                                                                                        <DropdownMenuItem className="text-destructive">
                                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                                            Eliminar tarea
                                                                                        </DropdownMenuItem>
                                                                                    </DropdownMenuContent>
                                                                                </DropdownMenu>
                                                                            </div>
                                                                        </CardHeader>
                                                                    </CollapsibleTrigger>

                                                                    <CollapsibleContent>
                                                                        <CardContent className="pt-0">
                                                                            <Separator className="mb-4" />

                                                                            {tarea.descripcion && (
                                                                                <div className="mb-4">
                                                                                    <h4 className="mb-2 font-medium">Descripción</h4>
                                                                                    <p className="text-muted-foreground rounded-lg bg-slate-50 p-3 text-sm">
                                                                                        {tarea.descripcion}
                                                                                    </p>
                                                                                </div>
                                                                            )}

                                                                            {tarea.asignados && tarea.asignados.length > 0 && (
                                                                                <div>
                                                                                    <h4 className="mb-3 font-medium">Progreso de Asignaciones</h4>
                                                                                    <div className="space-y-3">
                                                                                        {tarea.asignados.map((asignado) => (
                                                                                            <Card
                                                                                                key={asignado.id}
                                                                                                className="border border-slate-200"
                                                                                            >
                                                                                                <CardContent className="p-4">
                                                                                                    <div className="mb-3 flex items-center justify-between">
                                                                                                        <div className="flex items-center gap-3">
                                                                                                            <Avatar className="h-8 w-8">
                                                                                                                <AvatarFallback>
                                                                                                                    {getInitials(asignado.user_name)}
                                                                                                                </AvatarFallback>
                                                                                                            </Avatar>
                                                                                                            <span className="font-medium">
                                                                                                                {asignado.user_name}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <Badge
                                                                                                            variant={getStatusColor(asignado.estado)}
                                                                                                        >
                                                                                                            {asignado.estado
                                                                                                                .replace('_', ' ')
                                                                                                                .toUpperCase()}
                                                                                                        </Badge>
                                                                                                    </div>

                                                                                                    <div className="space-y-3">
                                                                                                        <div>
                                                                                                            <Label className="text-sm font-medium">
                                                                                                                Estado:
                                                                                                            </Label>
                                                                                                            <RadioGroup
                                                                                                                value={asignado.estado}
                                                                                                                className="mt-2 flex gap-4"
                                                                                                            >
                                                                                                                <div className="flex items-center space-x-2">
                                                                                                                    <RadioGroupItem
                                                                                                                        value="pendiente"
                                                                                                                        id={`pendiente-${asignado.id}`}
                                                                                                                    />
                                                                                                                    <Label
                                                                                                                        htmlFor={`pendiente-${asignado.id}`}
                                                                                                                        className="text-sm"
                                                                                                                    >
                                                                                                                        Pendiente
                                                                                                                    </Label>
                                                                                                                </div>
                                                                                                                <div className="flex items-center space-x-2">
                                                                                                                    <RadioGroupItem
                                                                                                                        value="en_revision"
                                                                                                                        id={`revision-${asignado.id}`}
                                                                                                                    />
                                                                                                                    <Label
                                                                                                                        htmlFor={`revision-${asignado.id}`}
                                                                                                                        className="text-sm"
                                                                                                                    >
                                                                                                                        En Revisión
                                                                                                                    </Label>
                                                                                                                </div>
                                                                                                                <div className="flex items-center space-x-2">
                                                                                                                    <RadioGroupItem
                                                                                                                        value="publicada"
                                                                                                                        id={`publicada-${asignado.id}`}
                                                                                                                    />
                                                                                                                    <Label
                                                                                                                        htmlFor={`publicada-${asignado.id}`}
                                                                                                                        className="text-sm"
                                                                                                                    >
                                                                                                                        Publicada
                                                                                                                    </Label>
                                                                                                                </div>
                                                                                                            </RadioGroup>
                                                                                                        </div>

                                                                                                        <div>
                                                                                                            <Label className="text-sm font-medium">
                                                                                                                Detalle del progreso:
                                                                                                            </Label>
                                                                                                            <Textarea
                                                                                                                placeholder="Escribe aquí los detalles del progreso..."
                                                                                                                defaultValue={asignado.detalle || ''}
                                                                                                                className="mt-2"
                                                                                                                rows={2}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </CardContent>
                                                                                            </Card>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </CardContent>
                                                                    </CollapsibleContent>
                                                                </Collapsible>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </Card>
                            );
                        })}
                </div>
            </div>

            {/* Dialog para nueva tarea */}
            <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">✨ Crear Nueva Tarea</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="titulo">Título *</Label>
                            <Input
                                id="titulo"
                                value={newTaskData.titulo}
                                onChange={(e) => setNewTaskData({ ...newTaskData, titulo: e.target.value })}
                                placeholder="Título de la tarea"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prioridad">Prioridad</Label>
                            <Select value={newTaskData.prioridad} onValueChange={(value) => setNewTaskData({ ...newTaskData, prioridad: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="alta">Alta</SelectItem>
                                    <SelectItem value="media">Media</SelectItem>
                                    <SelectItem value="baja">Baja</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tipo">Tipo de Tarea</Label>
                            <Select value={newTaskData.tipo_id} onValueChange={(value) => setNewTaskData({ ...newTaskData, tipo_id: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tipos.map((tipo) => (
                                        <SelectItem key={tipo.id} value={String(tipo.id)}>
                                            {tipo.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="empresa">Empresa</Label>
                            <Select value={newTaskData.company_id} onValueChange={(value) => setNewTaskData({ ...newTaskData, company_id: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar empresa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {empresas.map((empresa) => (
                                        <SelectItem key={empresa.id} value={String(empresa.id)}>
                                            {empresa.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Tipo de Asignación</Label>
                            <RadioGroup
                                value={asignacionTipo}
                                onValueChange={(value: 'aleatoria' | 'manual') => setAsignacionTipo(value)}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="aleatoria" id="aleatoria" />
                                    <Label htmlFor="aleatoria">Asignación Aleatoria</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="manual" id="manual" />
                                    <Label htmlFor="manual">Asignación Manual</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {asignacionTipo === 'manual' && (
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="pasante">Seleccionar Pasante</Label>
                                <Select value={selectedPasanteId} onValueChange={setSelectedPasanteId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar pasante" />y
                                    </SelectTrigger>
                                    <SelectContent>
                                        {usuarios.map((usuario) => (
                                            <SelectItem key={usuario.id} value={String(usuario.id)}>
                                                {usuario.name} ({usuario.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea
                                id="descripcion"
                                value={newTaskData.descripcion}
                                onChange={(e) => setNewTaskData({ ...newTaskData, descripcion: e.target.value })}
                                placeholder="Descripción detallada de la tarea"
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewTaskDialog(false)}>
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateTask}
                            disabled={!newTaskData.titulo.trim() || (asignacionTipo === 'manual' && !selectedPasanteId)}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Crear Tarea
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
