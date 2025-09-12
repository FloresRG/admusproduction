import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Crear el ícono personalizado
const customIcon = icon({
  iconUrl: '/Gflores/ubicacion.png', // Asegúrate que este archivo esté en public/Gflores
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface MapComponentProps {
  nombre?: string;
  direccion?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ nombre, direccion }) => {
  const [address, setAddress] = useState<string>('');

  const getCoordinates = (direccion: string): LatLngExpression => {
    try {
      const [lat, lng] = direccion.split(',').map(coord => {
        const num = parseFloat(coord.trim());
        if (isNaN(num)) throw new Error('Invalid coordinate');
        return num;
      });
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) throw new Error('Out of range');
      return [lat, lng];
    } catch (error) {
      console.warn('Invalid coordinates, using default:', error);
      return [-16.491381, -68.144709]; // fallback
    }
  };

  const position = direccion ? getCoordinates(direccion) : [-16.491381, -68.144709];

  // Obtener dirección aproximada con reverse geocoding
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      setAddress(data.display_name || 'Dirección no encontrada');
    } catch (error) {
      setAddress('Dirección no encontrada');
    }
  };

  useEffect(() => {
    if (position) {
      reverseGeocode(position[0] as number, position[1] as number);
    }
  }, [position]);

  return (
    <MapContainer center={position} zoom={15} style={{ width: '100%', height: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={customIcon}>
        <Popup>
          <div>
            <h3>{nombre}</h3>
            {direccion && <p><strong>Coordenadas:</strong> {direccion}</p>}
            <p><strong>Dirección aproximada:</strong> {address}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
