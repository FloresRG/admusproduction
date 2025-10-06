import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CompanyProps {
  company: {
    name: string;
    description: string;
    ubicacion: string;
    direccion: string;
    contract_duration: string;
    start_date: string;
    end_date: string;
  };
}

const MapComponent: React.FC<CompanyProps> = ({ company }) => {
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
      return [-16.491381, -68.144709];
    }
  };

  const position = company?.direccion ? getCoordinates(company.direccion) : [-16.491381, -68.144709];

  // Función para hacer reverse geocoding
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
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
    <MapContainer center={position} zoom={13} style={{ width: '100%', height: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {company && (
        <Marker position={position}>
          <Popup>
            <div>
              <h3>{company.name}</h3>
              <p><strong>Coordenadas:</strong> {company.direccion}</p>
              <p><strong>Dirección aproximada:</strong> {address}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
