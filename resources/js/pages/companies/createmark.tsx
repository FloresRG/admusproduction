import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';

// Corregir los iconos de Leaflet
const defaultIcon = L.icon({
    iconUrl: '/Gflores/ubicacion.png',
    //shadowUrl: '/path/to/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

type CompanyCategory = {
    id: number;
    name: string;
};
type Paquete = {
    id: number;
    nombre_paquete: string;
};

type Props = {
    categories: CompanyCategory[];
    paquetes: Paquete[];
};

type Availability = {
    day_of_week: number;
    start_time: string;
    end_time: string;
    turno: 'mañana' | 'tarde';
    cantidad?: number | null;
};

type SearchResult = {
    display_name: string;
    lat: string;
    lon: string;
};

const DEFAULT_CENTER = { lat: -16.5871, lng: -68.0855 };
const DEFAULT_ZOOM = 13;

export default function Create({ categories, paquetes }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        company_category_id: string;
        contract_duration: string;
        description: string;
        direccion: string;
        start_date: string;
        end_date: string;
        celular: string;
        contrato: File | null;
        monto_mensual: string;
        logo: File | null;
        availability: Availability[];
        crear_usuario: boolean;
        influencer: string; // Nuevo campo
        paquete_id: string; // Nuevo campo
        nombre_cliente: string;
        especificaciones: string;
        seguidores_inicio: string;
        seguidores_fin: string;
    }>({
        name: '',
        company_category_id: '',
        contract_duration: '',
        description: '',
        direccion: '',
        start_date: '',
        end_date: '',
        celular: '',
        contrato: null,
        monto_mensual: '',
        logo: null,
        availability: [
            {
                day_of_week: 1,
                start_time: '',
                end_time: '',
                turno: 'mañana',
                cantidad: null,
            },
        ],
        crear_usuario: false, // ← nuevo campo
        influencer: 'si', // Valor por defecto
        paquete_id: '', // Valor por defecto
        nombre_cliente: '',
        especificaciones: '',
        seguidores_inicio: '',
        seguidores_fin: '',
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);

    const handleAddAvailability = () => {
        setData('availability', [...data.availability, { day_of_week: 1, start_time: '', end_time: '', turno: 'mañana', cantidad: null }]);
    };

    const handleAvailabilityChange = (index: number, field: keyof Availability, value: Availability[keyof Availability]) => {
        const updated = [...data.availability];
        updated[index] = { ...updated[index], [field]: value };
        setData('availability', updated);
    };

    const handleRemoveAvailability = (index: number) => {
        if (data.availability.length === 1) return;
        setData(
            'availability',
            data.availability.filter((_, i) => i !== index),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/companiasmark');
    };
    // Estado para manejar la visibilidad del mapa
    const [openMapModal, setOpenMapModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
    const [mapError, setMapError] = useState<string>('');

    const handleOpenMap = () => {
        setMapError('');
        setOpenMapModal(true);
        // Si ya hay una ubicación guardada, usarla como centro
        if (data.direccion) {
            const [lat, lng] = data.direccion.split(',').map(Number);
            setSelectedLocation(new LatLng(lat, lng));
        }
    };

    const handleCloseMap = () => {
        setOpenMapModal(false);
    };

    const handleSaveLocation = () => {
        if (!selectedLocation) {
            setMapError('Por favor seleccione una ubicación en el mapa');
            return;
        }

        // Redondear coordenadas a 6 decimales para mayor precisión
        const lat = Number(selectedLocation.lat.toFixed(6));
        const lng = Number(selectedLocation.lng.toFixed(6));
        setData('direccion', `${lat},${lng}`);
        setOpenMapModal(false);
        setMapError('');
    };

    // Componente para manejar la selección del marcador
    function LocationMarker() {
        const map = useMapEvents({
            dblclick(e) {
                e.originalEvent.preventDefault();
                const { lat, lng } = e.latlng;
                const newLocation = new LatLng(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
                setSelectedLocation(newLocation);
                setMapError('');
            },
        });

        useEffect(() => {
            if (selectedLocation) {
                map.setView(selectedLocation, map.getZoom());
            }
        }, [selectedLocation]);

        return selectedLocation ? (
            <Marker position={selectedLocation} icon={defaultIcon}>
                <Popup>
                    <div className="text-center">
                        <p>Ubicación seleccionada</p>
                        <small>
                            {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                        </small>
                    </div>
                </Popup>
            </Marker>
        ) : null;
    }

    // Añadir la función de búsqueda
    const handleSearch = async (query: string) => {
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching location:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Añadir función para seleccionar resultado
    const handleSelectSearchResult = (result: SearchResult) => {
        const newLocation = new LatLng(Number(result.lat), Number(result.lon));
        setSelectedLocation(newLocation);
        setSearchResults([]);
        setSearchQuery('');
    };

    return (
        <AppLayout>
            <Head title="Crear Empresa" />
            <div className="mx-auto max-w-3xl rounded-xl bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8 shadow-2xl ring-1 ring-blue-100">
                <h1 className="mb-6 text-center text-3xl font-extrabold text-blue-700">Crear nueva Empresa</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
                            <input
                                type="text"
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <div className="mt-1 text-red-600">{errors.name}</div>}
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Categoría</label>
                            <select
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={data.company_category_id}
                                onChange={(e) => setData('company_category_id', e.target.value)}
                            >
                                <option value="">Seleccione una categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.company_category_id && <div className="mt-1 text-red-600">{errors.company_category_id}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Duración del contrato */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Duración del contrato</label>
                            <input
                                type="text"
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={data.contract_duration}
                                onChange={(e) => setData('contract_duration', e.target.value)}
                            />
                            {errors.contract_duration && <div className="mt-1 text-red-600">{errors.contract_duration}</div>}
                        </div>

                        {/* Fecha de inicio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de inicio</label>
                            <input
                                type="date"
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                            {errors.start_date && <div className="mt-1 text-red-600">{errors.start_date}</div>}
                        </div>

                        {/* Fecha de fin */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de fin</label>
                            <input
                                type="date"
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                            />
                            {errors.end_date && <div className="mt-1 text-red-600">{errors.end_date}</div>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Nombre del cliente */}
                        <div>
                            {/* Cambiado: Se añade (Opcional) a la etiqueta */}
                            <label className="block text-sm font-medium text-gray-700">
                                Nombre del Cliente <span className="font-normal text-gray-500">(Opcional)</span>
                            </label>
                            <input
                                type="text"
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={data.nombre_cliente}
                                onChange={(e) => setData('nombre_cliente', e.target.value)}
                            />
                            {errors.nombre_cliente && <div className="mt-1 text-red-600">{errors.nombre_cliente}</div>}
                        </div>

                        {/* Especificaciones */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Especificaciones <span className="font-normal text-gray-500">(Opcional)</span>
                            </label>
                            <input
                                type="text"
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={data.especificaciones}
                                onChange={(e) => setData('especificaciones', e.target.value)}
                            />
                            {errors.especificaciones && <div className="mt-1 text-red-600">{errors.especificaciones}</div>}
                        </div> */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">¿Necesita influencers?</label>
                            <div className="flex space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="influencer"
                                        value="si"
                                        checked={data.influencer === 'si'}
                                        onChange={() => setData('influencer', 'si')}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">Sí</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="influencer"
                                        value="no"
                                        checked={data.influencer === 'no'}
                                        onChange={() => setData('influencer', 'no')}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors.influencer && <div className="mt-1 text-red-600">{errors.influencer}</div>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Seguidores inicio */}
                        <div>
                            {/* Cambiado: Se añade (Opcional) a la etiqueta */}
                            <label className="block text-sm font-medium text-gray-700">
                                Seguidores Inicio <span className="font-normal text-gray-500">(Opcional)</span>
                            </label>
                            <input
                                type="number"
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={data.seguidores_inicio}
                                onChange={(e) => setData('seguidores_inicio', e.target.value)}
                            />
                            {errors.seguidores_inicio && <div className="mt-1 text-red-600">{errors.seguidores_inicio}</div>}
                        </div>

                        {/* Seguidores fin */}
                        <div>
                            {/* Cambiado: Se añade (Opcional) a la etiqueta */}
                            <label className="block text-sm font-medium text-gray-700">
                                Seguidores Fin <span className="font-normal text-gray-500">(Opcional)</span>
                            </label>
                            <input
                                type="number"
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={data.seguidores_fin}
                                onChange={(e) => setData('seguidores_fin', e.target.value)}
                            />
                            {errors.seguidores_fin && <div className="mt-1 text-red-600">{errors.seguidores_fin}</div>}
                        </div>
                    </div>

                    {/* El resto del formulario sigue igual, pero aplica el mismo patrón de clases: 
                
                - Botones mejorados con hover y transición */}
                    {/* Dirección con el mapa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Dirección
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={data.direccion}
                                placeholder="Seleccione una ubicación en el mapa"
                                readOnly
                            />
                            <Button variant="contained" color="primary" onClick={handleOpenMap}>
                                Seleccionar Ubicación
                            </Button>
                        </div>
                        {errors.direccion && <div className="mt-1 text-red-600">{errors.direccion}</div>}
                    </div>

                    <Dialog open={openMapModal} onClose={handleCloseMap} maxWidth="md" fullWidth>
                        <DialogTitle>
                            Seleccionar Ubicación
                            <Typography variant="caption" component="div" color="textSecondary">
                                Haga clic en el mapa para seleccionar la ubicación
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <div className="mb-4">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-300 p-2"
                                        placeholder="Buscar ubicación..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSearch(searchQuery);
                                            }
                                        }}
                                    />
                                    <Button onClick={() => handleSearch(searchQuery)} variant="contained" disabled={isSearching}>
                                        {isSearching ? 'Buscando...' : 'Buscar'}
                                    </Button>
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-gray-200">
                                        {searchResults.map((result, index) => (
                                            <div
                                                key={index}
                                                className="cursor-pointer border-b border-gray-200 p-2 hover:bg-gray-100"
                                                onClick={() => handleSelectSearchResult(result)}
                                            >
                                                {result.display_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <MapContainer
                                center={selectedLocation || DEFAULT_CENTER}
                                zoom={DEFAULT_ZOOM}
                                style={{ height: '400px', width: '100%' }}
                                doubleClickZoom={false} // Desactivar zoom con doble clic
                                className="rounded-lg border border-gray-300 shadow-md"
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                />
                                <LocationMarker />
                            </MapContainer>

                            {mapError && (
                                <Typography color="error" className="mt-2 text-center">
                                    {mapError}
                                </Typography>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseMap} color="secondary">
                                Cancelar
                            </Button>
                            <Button onClick={handleSaveLocation} color="primary" disabled={!selectedLocation}>
                                Guardar Ubicación
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Paquete (select) */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Paquete</label>
                        <select
                            className="w-full rounded-md border border-gray-300 p-3 shadow transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                            value={data.paquete_id}
                            onChange={(e) => setData('paquete_id', e.target.value)}
                        >
                            <option value="">Seleccione un paquete</option>
                            {paquetes.map((paquete) => (
                                <option key={paquete.id} value={paquete.id}>
                                    {paquete.nombre_paquete}
                                </option>
                            ))}
                        </select>
                        {errors.paquete_id && <div className="mt-1 text-red-600">{errors.paquete_id}</div>}
                    </div>
                    {/* Descripción (ancho completo) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* celular */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Celular</label>
                            <input
                                type="text"
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={data.celular}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setData('celular', value);
                                    }
                                }}
                            />
                            {errors.celular && <div className="mt-1 text-red-600">{errors.celular}</div>}
                        </div>

                        {/* monto mensual */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Monto Mensual</label>
                            <input
                                type="text"
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                value={data.monto_mensual}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d*$/.test(value)) {
                                        setData('monto_mensual', value);
                                    }
                                }}
                            />
                            {errors.monto_mensual && <div className="mt-1 text-red-600">{errors.monto_mensual}</div>}
                        </div> */}
                    </div>

                    <div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2">
                        {/* Subida de contrato PDF */}
                        <div className="rounded-lg border p-4 shadow transition hover:shadow-md">
                            <h3 className="mb-3 text-lg font-semibold">Subir contrato (PDF)</h3>
                            <label className="flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition hover:border-blue-500">
                                <span className="text-gray-600">Haz clic o arrastra un archivo PDF aquí</span>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setData('contrato', file);
                                        setPdfPreview(file ? URL.createObjectURL(file) : null);
                                    }}
                                />
                            </label>

                            {/* Vista previa del contrato PDF */}
                            {pdfPreview && (
                                <div className="mt-4">
                                    <h4 className="mb-2 text-sm font-medium text-gray-700">Vista previa:</h4>
                                    <embed src={pdfPreview} type="application/pdf" width="100%" height="400px" className="rounded border" />
                                </div>
                            )}
                        </div>

                        {/* Subida de logo (imagen) */}
                        <div className="rounded-lg border p-4 shadow transition hover:shadow-md">
                            <h3 className="mb-3 text-lg font-semibold">Subir logo (imagen)</h3>
                            <label className="flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition hover:border-green-500">
                                <span className="text-gray-600">Haz clic o arrastra una imagen aquí</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setData('logo', file);
                                        setLogoPreview(file ? URL.createObjectURL(file) : null);
                                    }}
                                />
                            </label>

                            {/* Vista previa del logo imagen */}
                            {logoPreview && (
                                <div className="mt-4">
                                    <h4 className="mb-2 text-sm font-medium text-gray-700">Vista previa:</h4>
                                    <img src={logoPreview} alt="Vista previa del logo" className="max-h-48 w-full rounded border object-contain" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={data.crear_usuario}
                                onChange={(e) => setData('crear_usuario', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-700">¿Desea crear usuario para esta empresa?</span>
                        </label>
                    </div>
                    {/* Disponibilidad (como la tienes, sin cambios grandes) */}
                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Días de disponibilidad</label>

                        {data.availability.map((avail, idx) => (
                            <div key={idx} className="mb-4 flex justify-center">
                                <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-4">
                                    {/* Día de la semana */}
                                    <select
                                        className="col-span-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={avail.day_of_week}
                                        onChange={(e) => handleAvailabilityChange(idx, 'day_of_week', parseInt(e.target.value))}
                                    >
                                        <option value={1}>Lunes</option>
                                        <option value={2}>Martes</option>
                                        <option value={3}>Miércoles</option>
                                        <option value={4}>Jueves</option>
                                        <option value={5}>Viernes</option>
                                        <option value={6}>Sabado</option>
                                    </select>

                                    {/* Turno */}
                                    <select
                                        className="col-span-1 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={avail.turno}
                                        onChange={(e) => {
                                            const turno = e.target.value as 'mañana' | 'tarde';
                                            let start_time = '';
                                            let end_time = '';
                                            if (turno === 'mañana') {
                                                start_time = '09:30';
                                                end_time = '13:00';
                                            } else {
                                                start_time = '14:00';
                                                end_time = '18:00';
                                            }
                                            const updated = [...data.availability];
                                            updated[idx] = { ...updated[idx], turno, start_time, end_time };
                                            setData('availability', updated);
                                        }}
                                    >
                                        <option value="mañana">Mañana</option>
                                        <option value="tarde">Tarde</option>
                                    </select>

                                    {/* Cantidad (2 fracciones) */}
                                    <div className="col-span-2">
                                        <label className="sr-only">Cantidad</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Cantidad"
                                            value={avail.cantidad ?? ''}
                                            onChange={(e) =>
                                                handleAvailabilityChange(idx, 'cantidad', e.target.value === '' ? null : parseInt(e.target.value, 10))
                                            }
                                        />
                                    </div>

                                    {/* Botón eliminar */}
                                    <div className="col-span-1 flex items-center justify-center">
                                        <button
                                            type="button"
                                            className="text-xl font-bold text-red-600"
                                            onClick={() => handleRemoveAvailability(idx)}
                                            disabled={data.availability.length === 1}
                                            title="Eliminar este día"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Botón añadir */}
                        <div className="mt-2 flex justify-center">
                            <button type="button" onClick={handleAddAvailability} className="font-semibold text-blue-600">
                                + Añadir otro día
                            </button>
                        </div>

                        {/* Errores de disponibilidad */}
                        {Object.keys(errors)
                            .filter((key) => key.startsWith('availability'))
                            .map((key) => (
                                <div key={key} className="text-center text-red-600">
                                    {errors[key as keyof typeof errors]}
                                </div>
                            ))}
                    </div>

                    {/* Ejemplo de botón mejorado */}
                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/companiasmark"
                            className="rounded-md bg-gray-300 px-6 py-2 text-gray-700 transition-colors duration-150 hover:bg-gray-400"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-6 py-2 text-white shadow transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            disabled={processing}
                        >
                            {processing ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
