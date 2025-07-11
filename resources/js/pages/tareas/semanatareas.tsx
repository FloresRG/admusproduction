"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Calendar,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
  Building,
  Tag,
  User,
  CheckCircle,
  AlertCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  Save,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

// Types
type Tarea = {
  id: number
  titulo: string
  descripcion: string | null
  prioridad: string | null
  fecha: string
  tipo: {
    id: number
    nombre_tipo: string
  } | null
  company: {
    id: number
    name: string
  } | null
  asignados?: Asignado[]
}

type Asignado = {
  id: number
  user_id: number
  user_name: string
  estado: string
  detalle: string
}

type TareasSemanaResponse = {
  inicio: string
  fin: string
  dias: Record<string, Tarea[]>
}

type TipoTarea = {
  id: number
  nombre: string
}

type Empresa = {
  id: number
  name: string
}

type Usuario = {
  id: number
  name: string
  email: string
}

export default function WeeklyTasksImproved() {
  // Estados principales
  const [datosSemana, setDatosSemana] = useState<TareasSemanaResponse | null>(null)
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [tipos, setTipos] = useState<TipoTarea[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])

  // Estados de filtrado
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUser, setFilterUser] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Estados para nueva tarea
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const [newTaskData, setNewTaskData] = useState({
    titulo: "",
    prioridad: "",
    descripcion: "",
    fecha: "",
    tipo_id: "",
    company_id: "",
  })
  const [asignacionTipo, setAsignacionTipo] = useState<"aleatoria" | "manual">("aleatoria")
  const [selectedPasanteId, setSelectedPasanteId] = useState<string>("")

  // Estados de vista
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})
  const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({})

  // Simular datos para demo
  useEffect(() => {
    const mockData = {
      inicio: "2024-01-15",
      fin: "2024-01-21",
      dias: {
        "2024-01-15": [
          {
            id: 1,
            titulo: "Diseñar landing page",
            descripcion: "Crear el diseño de la página principal del sitio web",
            prioridad: "alta",
            fecha: "2024-01-15",
            tipo: { id: 1, nombre_tipo: "Diseño" },
            company: { id: 1, name: "TechCorp" },
            asignados: [
              {
                id: 1,
                user_id: 1,
                user_name: "Ana García",
                estado: "en_revision",
                detalle: "Mockups completados al 80%",
              },
            ],
          },
          {
            id: 2,
            titulo: "Optimizar base de datos",
            descripcion: "Mejorar el rendimiento de las consultas principales",
            prioridad: "media",
            fecha: "2024-01-15",
            tipo: { id: 2, nombre_tipo: "Backend" },
            company: { id: 2, name: "DataSoft" },
            asignados: [
              {
                id: 2,
                user_id: 2,
                user_name: "Carlos López",
                estado: "pendiente",
                detalle: "Análisis inicial completado",
              },
            ],
          },
        ],
        "2024-01-16": [
          {
            id: 3,
            titulo: "Testing de aplicación móvil",
            descripcion: "Realizar pruebas exhaustivas en diferentes dispositivos",
            prioridad: "alta",
            fecha: "2024-01-16",
            tipo: { id: 3, nombre_tipo: "QA" },
            company: { id: 1, name: "TechCorp" },
            asignados: [
              {
                id: 3,
                user_id: 3,
                user_name: "María Rodríguez",
                estado: "publicada",
                detalle: "Todas las pruebas completadas exitosamente",
              },
            ],
          },
        ],
        "2024-01-17": [],
        "2024-01-18": [
          {
            id: 4,
            titulo: "Documentación API",
            descripcion: "Crear documentación completa de los endpoints",
            prioridad: "baja",
            fecha: "2024-01-18",
            tipo: { id: 4, nombre_tipo: "Documentación" },
            company: { id: 3, name: "DevStudio" },
            asignados: [
              {
                id: 4,
                user_id: 1,
                user_name: "Ana García",
                estado: "pendiente",
                detalle: "Iniciando estructura del documento",
              },
            ],
          },
        ],
        "2024-01-19": [],
        "2024-01-20": [],
        "2024-01-21": [],
      },
    }

    setTimeout(() => {
      setDatosSemana(mockData)
      setTipos([
        { id: 1, nombre: "Diseño" },
        { id: 2, nombre: "Backend" },
        { id: 3, nombre: "QA" },
        { id: 4, nombre: "Documentación" },
      ])
      setEmpresas([
        { id: 1, name: "TechCorp" },
        { id: 2, name: "DataSoft" },
        { id: 3, name: "DevStudio" },
      ])
      setUsuarios([
        { id: 1, name: "Ana García", email: "ana@example.com" },
        { id: 2, name: "Carlos López", email: "carlos@example.com" },
        { id: 3, name: "María Rodríguez", email: "maria@example.com" },
      ])
      setLoading(false)

      // Expandir todos los días por defecto
      const expanded: Record<string, boolean> = {}
      Object.keys(mockData.dias).forEach((dia) => {
        expanded[dia] = true
      })
      setExpandedDays(expanded)
    }, 1000)
  }, [])

  // Obtener todas las tareas filtradas
  const allFilteredTasks = useMemo(() => {
    if (!datosSemana?.dias) return []

    let allTasks: Tarea[] = []
    Object.values(datosSemana.dias).forEach((dayTasks) => {
      allTasks = [...allTasks, ...dayTasks]
    })

    // Aplicar filtros
    if (searchTerm) {
      allTasks = allTasks.filter(
        (t) =>
          t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterPriority !== "all") {
      allTasks = allTasks.filter((t) => t.prioridad === filterPriority)
    }

    if (filterUser !== "all") {
      allTasks = allTasks.filter((t) => t.asignados?.some((a) => a.user_name === filterUser))
    }

    if (filterStatus !== "all") {
      allTasks = allTasks.filter((t) => t.asignados?.some((a) => a.estado === filterStatus))
    }

    return allTasks
  }, [datosSemana, searchTerm, filterPriority, filterUser, filterStatus])

  // Agrupar tareas filtradas por día
  const filteredTasksByDay = useMemo(() => {
    const grouped: Record<string, Tarea[]> = {}

    allFilteredTasks.forEach((task) => {
      if (!grouped[task.fecha]) {
        grouped[task.fecha] = []
      }
      grouped[task.fecha].push(task)
    })

    return grouped
  }, [allFilteredTasks])

  // Funciones de utilidad
  const getPriorityColor = (prioridad: string) => {
    switch (prioridad?.toLowerCase()) {
      case "alta":
        return "destructive"
      case "media":
        return "default"
      case "baja":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPriorityIcon = (prioridad: string) => {
    switch (prioridad?.toLowerCase()) {
      case "alta":
        return <AlertCircle className="h-4 w-4" />
      case "media":
        return <Circle className="h-4 w-4" />
      case "baja":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "publicada":
        return "default"
      case "en_revision":
        return "secondary"
      case "pendiente":
        return "outline"
      default:
        return "outline"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const handleCreateTask = async () => {
    if (!newTaskData.titulo.trim()) return

    // Simular creación de tarea
    console.log("Creando tarea:", newTaskData)
    setShowNewTaskDialog(false)
    setNewTaskData({
      titulo: "",
      prioridad: "",
      descripcion: "",
      fecha: "",
      tipo_id: "",
      company_id: "",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Calendar className="h-10 w-10" />
                Gestión de Tareas Semanales
              </h1>
              {datosSemana && (
                <p className="text-xl opacity-90 mt-2">
                  Semana del {formatDate(datosSemana.inicio)} al {formatDate(datosSemana.fin)}
                </p>
              )}
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {allFilteredTasks.length} tareas totales
                </Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {Object.keys(filteredTasksByDay).length} días con tareas
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => setShowNewTaskDialog(true)}
              size="lg"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nueva Tarea
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
              const tareasDelDia = filteredTasksByDay[fecha] || []
              const todasLasTareasDelDia = datosSemana.dias[fecha] || []

              return (
                <Card key={fecha} className="shadow-lg border-0 overflow-hidden">
                  <Collapsible
                    open={expandedDays[fecha]}
                    onOpenChange={(open) => setExpandedDays({ ...expandedDays, [fecha]: open })}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {expandedDays[fecha] ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div>
                              <CardTitle className="text-xl">{formatDate(fecha)}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {todasLasTareasDelDia.length} {todasLasTareasDelDia.length === 1 ? "tarea" : "tareas"}{" "}
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
                                  {tareasDelDia.filter((t) => t.prioridad === "alta").length} Alta
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {tareasDelDia.filter((t) => t.prioridad === "media").length} Media
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {tareasDelDia.filter((t) => t.prioridad === "baja").length} Baja
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
                          <div className="text-center py-12 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No hay tareas para este día</p>
                            <p className="text-sm">Las tareas aparecerán aquí cuando las crees</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {tareasDelDia.map((tarea) => (
                              <Card
                                key={tarea.id}
                                className="border border-slate-200 hover:shadow-md transition-shadow"
                              >
                                <Collapsible
                                  open={expandedTasks[tarea.id]}
                                  onOpenChange={(open) => setExpandedTasks({ ...expandedTasks, [tarea.id]: open })}
                                >
                                  <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-slate-50/50 transition-colors pb-3">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-lg">{tarea.titulo}</h3>
                                            {expandedTasks[tarea.id] ? (
                                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            )}
                                          </div>

                                          <div className="flex items-center gap-2 flex-wrap">
                                            <Badge
                                              variant={getPriorityColor(tarea.prioridad || "")}
                                              className="text-xs"
                                            >
                                              {getPriorityIcon(tarea.prioridad || "")}
                                              <span className="ml-1">
                                                {tarea.prioridad?.toUpperCase() || "SIN PRIORIDAD"}
                                              </span>
                                            </Badge>

                                            {tarea.tipo && (
                                              <Badge variant="outline" className="text-xs">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tarea.tipo.nombre_tipo}
                                              </Badge>
                                            )}

                                            {tarea.company && (
                                              <Badge variant="outline" className="text-xs">
                                                <Building className="h-3 w-3 mr-1" />
                                                {tarea.company.name}
                                              </Badge>
                                            )}

                                            <Badge variant="outline" className="text-xs">
                                              <Clock className="h-3 w-3 mr-1" />
                                              {tarea.fecha}
                                            </Badge>
                                          </div>

                                          {tarea.asignados && tarea.asignados.length > 0 && (
                                            <div className="flex items-center gap-2 mt-3">
                                              <User className="h-4 w-4 text-muted-foreground" />
                                              <div className="flex items-center gap-2">
                                                {tarea.asignados.map((asignado) => (
                                                  <div key={asignado.id} className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                      <AvatarFallback className="text-xs">
                                                        {getInitials(asignado.user_name)}
                                                      </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-medium">{asignado.user_name}</span>
                                                    <Badge
                                                      variant={getStatusColor(asignado.estado)}
                                                      className="text-xs"
                                                    >
                                                      {asignado.estado.replace("_", " ").toUpperCase()}
                                                    </Badge>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                              <Edit className="h-4 w-4 mr-2" />
                                              Editar tarea
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                              <Trash2 className="h-4 w-4 mr-2" />
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
                                          <h4 className="font-medium mb-2">Descripción</h4>
                                          <p className="text-sm text-muted-foreground bg-slate-50 p-3 rounded-lg">
                                            {tarea.descripcion}
                                          </p>
                                        </div>
                                      )}

                                      {tarea.asignados && tarea.asignados.length > 0 && (
                                        <div>
                                          <h4 className="font-medium mb-3">Progreso de Asignaciones</h4>
                                          <div className="space-y-3">
                                            {tarea.asignados.map((asignado) => (
                                              <Card key={asignado.id} className="border border-slate-200">
                                                <CardContent className="p-4">
                                                  <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                      <Avatar className="h-8 w-8">
                                                        <AvatarFallback>
                                                          {getInitials(asignado.user_name)}
                                                        </AvatarFallback>
                                                      </Avatar>
                                                      <span className="font-medium">{asignado.user_name}</span>
                                                    </div>
                                                    <Badge variant={getStatusColor(asignado.estado)}>
                                                      {asignado.estado.replace("_", " ").toUpperCase()}
                                                    </Badge>
                                                  </div>

                                                  <div className="space-y-3">
                                                    <div>
                                                      <Label className="text-sm font-medium">Estado:</Label>
                                                      <RadioGroup value={asignado.estado} className="flex gap-4 mt-2">
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
                                                        defaultValue={asignado.detalle || ""}
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
              )
            })}
        </div>
      </div>

      {/* Dialog para nueva tarea */}
      <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">✨ Crear Nueva Tarea</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
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
              <Select
                value={newTaskData.prioridad}
                onValueChange={(value) => setNewTaskData({ ...newTaskData, prioridad: value })}
              >
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
              <Select
                value={newTaskData.tipo_id}
                onValueChange={(value) => setNewTaskData({ ...newTaskData, tipo_id: value })}
              >
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
              <Select
                value={newTaskData.company_id}
                onValueChange={(value) => setNewTaskData({ ...newTaskData, company_id: value })}
              >
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

            <div className="md:col-span-2 space-y-2">
              <Label>Tipo de Asignación</Label>
              <RadioGroup
                value={asignacionTipo}
                onValueChange={(value: "aleatoria" | "manual") => setAsignacionTipo(value)}
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

            {asignacionTipo === "manual" && (
              <div className="md:col-span-2 space-y-2">
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

            <div className="md:col-span-2 space-y-2">
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
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={!newTaskData.titulo.trim() || (asignacionTipo === "manual" && !selectedPasanteId)}
            >
              <Save className="h-4 w-4 mr-2" />
              Crear Tarea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
