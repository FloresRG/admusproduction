// MapComponent.tsx
import React from 'react';
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
  // Convert string coordinates to LatLngExpression with validation
  const getCoordinates = (direccion: string): LatLngExpression => {
    try {
      const [lat, lng] = direccion.split(',').map(coord => {
        const num = parseFloat(coord.trim());
        if (isNaN(num)) {
          throw new Error('Invalid coordinate');
        }
        return num;
      });
      
      // Validate latitude and longitude ranges
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error('Coordinates out of range');
      }
      
      return [lat, lng];
    } catch (error) {
      console.warn('Invalid coordinates, using default:', error);
      return [-16.491381, -68.144709]; // Default coordinates
    }
  };

  const position = company?.direccion ? getCoordinates(company.direccion) : [-16.491381, -68.144709];

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
              <p><strong>Ubicación:</strong> {company.ubicacion}</p>
              <p><strong>Descripción:</strong> {company.description}</p>
              <p><strong>Duración del contrato:</strong> {company.contract_duration}</p>
              <p><strong>Fecha inicio:</strong> {new Date(company.start_date).toLocaleDateString()}</p>
              <p><strong>Fecha fin:</strong> {new Date(company.end_date).toLocaleDateString()}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
