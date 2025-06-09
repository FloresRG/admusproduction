import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/markers/marker-icon-2x.png',
    iconUrl: '/markers/marker-icon.png',
    shadowUrl: '/markers/marker-shadow.png',
});

interface MapInputProps {
    value: string;
    onChange: (value: string) => void;
}

function DraggableMarker({ position, onPositionChange }: { 
    position: LatLngExpression, 
    onPositionChange: (pos: L.LatLng) => void 
}) {
    const marker = useMapEvents({
        click(e) {
            onPositionChange(e.latlng);
        },
    });

    return <Marker position={position} />;
}

const CompanyMapInput: React.FC<MapInputProps> = ({ value, onChange }) => {
    // Default position if no value is provided
    const defaultPosition: [number, number] = [-16.491381, -68.144709];
    
    // Convert string coordinates to array position
    const getPosition = (): [number, number] => {
        if (!value) return defaultPosition;
        try {
            const [lat, lng] = value.split(',').map(Number);
            return isNaN(lat) || isNaN(lng) ? defaultPosition : [lat, lng];
        } catch {
            return defaultPosition;
        }
    };

    const handlePositionChange = (latlng: L.LatLng) => {
        onChange(`${latlng.lat},${latlng.lng}`);
    };

    return (
        <div className="h-[400px] w-full rounded-md overflow-hidden border border-gray-300">
            <MapContainer 
                center={getPosition()} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <DraggableMarker 
                    position={getPosition()}
                    onPositionChange={handlePositionChange}
                />
            </MapContainer>
        </div>
    );
};

export default CompanyMapInput;