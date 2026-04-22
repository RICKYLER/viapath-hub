import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack/Vite
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  lat: number;
  lng: number;
}

interface MapLocatorProps {
  onLocationSelect?: (location: Location) => void;
  workers?: { id: string; name: string; lat: number; lng: number }[];
  center?: Location;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export const MapLocator: React.FC<MapLocatorProps> = ({ onLocationSelect, workers = [], center }) => {
  const [position, setPosition] = useState<Location | null>(center || null);
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'m' | 's' | 'y' | 'h'>('m'); // m = roadmap, s = satellite, y = hybrid, h = roads only

  useEffect(() => {
    if (center) {
      setPosition(center);
      return;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(newPos);
          if (onLocationSelect) onLocationSelect(newPos);
        },
        (err) => {
          setError(err.message);
          // Fallback to Tagum City if geolocation fails
          setPosition({ lat: 7.4478, lng: 125.8094 });
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setPosition({ lat: 7.4478, lng: 125.8094 });
    }
  }, [onLocationSelect, center]);

  if (!position) return <div className="h-64 flex items-center justify-center bg-muted animate-pulse rounded-lg">Loading Map...</div>;

  return (
    <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg border border-border">
      {error && (
        <div className="absolute top-2 left-10 z-[1000] bg-destructive/10 text-destructive text-xs p-2 rounded border border-destructive/20 backdrop-blur-sm">
          {error}. Using default location.
        </div>
      )}

      {/* Map Type Toggle */}
      <div className="absolute top-3 right-3 z-[1000] flex gap-1">
        <button 
          onClick={() => setMapType('m')}
          className={`px-3 py-1.5 text-xs font-bold rounded-l-md shadow-md transition-colors ${mapType === 'm' ? 'bg-primary text-primary-foreground' : 'bg-white text-foreground hover:bg-muted'}`}
        >
          Map
        </button>
        <button 
          onClick={() => setMapType('s')}
          className={`px-3 py-1.5 text-xs font-bold rounded-r-md shadow-md transition-colors ${mapType === 's' ? 'bg-primary text-primary-foreground' : 'bg-white text-foreground hover:bg-muted'}`}
        >
          Satellite
        </button>
      </div>

      <MapContainer 
        center={[position.lat, position.lng]} 
        zoom={14} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url={`https://{s}.google.com/vt/lyrs=${mapType}&x={x}&y={y}&z={z}`}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        <ChangeView center={[position.lat, position.lng]} />
        
        <Marker position={[position.lat, position.lng]}>
          <Popup>You are here</Popup>
        </Marker>

        {workers.map((worker) => (
          <Marker key={worker.id} position={[worker.lat, worker.lng]}>
            <Popup>
              <div className="space-y-1">
                <p className="font-bold">{worker.name}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${worker.lat},${worker.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary hover:underline flex items-center gap-1"
                >
                  View on Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
