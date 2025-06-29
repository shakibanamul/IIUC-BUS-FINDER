import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Bus, Clock, Users, Route, Layers, Satellite, Map as MapIcon, Maximize2, Minimize2 } from 'lucide-react';
import { BusSchedule } from '../types/BusSchedule';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface OpenStreetMapProps {
  schedule?: BusSchedule;
  schedules?: BusSchedule[];
  isFullscreen?: boolean;
  onClose?: () => void;
}

// Define route coordinates for IIUC bus routes
const routeCoordinates: Record<string, [number, number][]> = {
  'BOT': [
    [22.3569, 91.7832], // BOT (Bahaddarhat)
    [22.3612, 91.7891], // Muradpur
    [22.3698, 91.7945], // 2 no gate
    [22.3756, 91.8012], // Baizid Link Road
    [22.4569, 91.9859]  // IIUC
  ],
  'Agrabad': [
    [22.3255, 91.8317], // Agrabad
    [22.3298, 91.8245], // Boropool
    [22.3456, 91.8123], // Noyabazar
    [22.3789, 91.8034], // AK Khan
    [22.4569, 91.9859]  // IIUC
  ],
  'Chatteswari': [
    [22.3445, 91.7823], // Chatteswari Road
    [22.3512, 91.7934], // GEC
    [22.3698, 91.7945], // 2 no gate
    [22.3756, 91.8012], // Baizid Link Road
    [22.4569, 91.9859]  // IIUC
  ],
  'Baroyarhat': [
    [22.2845, 91.8234], // Baroyarhat
    [22.3123, 91.8456], // Mirsharai
    [22.3456, 91.8789], // Borodargahat
    [22.3789, 91.9123], // Sitakunda
    [22.4569, 91.9859]  // IIUC
  ],
  'Hathazari': [
    [22.2567, 91.8123], // Hathazari College
    [22.2789, 91.8234], // Borodighirpar
    [22.3456, 91.8345], // Baizid Link Road
    [22.4569, 91.9859]  // IIUC
  ],
  'CUET': [
    [22.4623, 91.9697], // CUET Gate
    [22.4589, 91.9756], // Kuwaish
    [22.4567, 91.9823], // Oxygen
    [22.4569, 91.9859]  // IIUC
  ],
  'Kotowali': [
    [22.3356, 91.8317], // Kotowali
    [22.3412, 91.8234], // Kadamtali
    [22.3567, 91.8456], // Dewan Hat
    [22.3789, 91.8678], // Alanker
    [22.4569, 91.9859]  // IIUC
  ],
  'Lucky Plaza': [
    [22.3255, 91.8317], // Lucky Plaza (Agrabad area)
    [22.3298, 91.8245], // Boropool
    [22.3456, 91.8123], // Noyabazar
    [22.3789, 91.8034], // AK Khan
    [22.4569, 91.9859]  // IIUC
  ]
};

// IIUC location
const IIUC_LOCATION: [number, number] = [22.4569, 91.9859];

// Map bounds for Chittagong area
const CHITTAGONG_BOUNDS: [[number, number], [number, number]] = [
  [22.2, 91.7], // Southwest
  [22.5, 92.1]  // Northeast
];

// Custom icons
const createCustomIcon = (color: string, text: string) => {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        font-weight: bold;
        color: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${text}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const iiucIcon = L.divIcon({
  html: `
    <div style="
      background: linear-gradient(135deg, #1e40af, #3b82f6);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 4px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    ">
      IIUC
    </div>
  `,
  className: 'iiuc-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Map controls component
const MapControls: React.FC<{
  mapType: string;
  onMapTypeChange: (type: string) => void;
  showTraffic: boolean;
  onTrafficToggle: () => void;
}> = ({ mapType, onMapTypeChange, showTraffic, onTrafficToggle }) => {
  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col space-y-2">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => onMapTypeChange(mapType === 'street' ? 'satellite' : 'street')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              mapType === 'satellite' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={mapType === 'street' ? 'Switch to Satellite' : 'Switch to Street'}
          >
            {mapType === 'street' ? <Satellite className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
          </button>
          
          <button
            onClick={onTrafficToggle}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showTraffic 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Toggle Traffic Layer"
          >
            <Layers className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Fit bounds component
const FitBounds: React.FC<{ bounds: [[number, number], [number, number]] }> = ({ bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, bounds]);
  
  return null;
};

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({ 
  schedule, 
  schedules = [], 
  isFullscreen = false, 
  onClose 
}) => {
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [showTraffic, setShowTraffic] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const routesToShow = schedule ? [schedule] : schedules;

  // Calculate bounds for all routes
  const calculateBounds = (): [[number, number], [number, number]] => {
    if (routesToShow.length === 0) return CHITTAGONG_BOUNDS;
    
    let minLat = IIUC_LOCATION[0];
    let maxLat = IIUC_LOCATION[0];
    let minLng = IIUC_LOCATION[1];
    let maxLng = IIUC_LOCATION[1];
    
    routesToShow.forEach(busSchedule => {
      const routeKey = getRouteKey(busSchedule.startingPoint);
      const coordinates = routeCoordinates[routeKey];
      if (coordinates) {
        coordinates.forEach(([lat, lng]) => {
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
        });
      }
    });
    
    // Add padding
    const latPadding = (maxLat - minLat) * 0.1;
    const lngPadding = (maxLng - minLng) * 0.1;
    
    return [
      [minLat - latPadding, minLng - lngPadding],
      [maxLat + latPadding, maxLng + lngPadding]
    ];
  };

  const getRouteKey = (startingPoint: string): string => {
    const point = startingPoint.toLowerCase();
    if (point.includes('bot') || point.includes('bahaddarhat')) return 'BOT';
    if (point.includes('agrabad') || point.includes('lucky plaza')) return 'Agrabad';
    if (point.includes('chatteswari')) return 'Chatteswari';
    if (point.includes('baroyarhat')) return 'Baroyarhat';
    if (point.includes('hathazari')) return 'Hathazari';
    if (point.includes('cuet')) return 'CUET';
    if (point.includes('kotowali')) return 'Kotowali';
    return 'BOT';
  };

  const getRouteColor = (busSchedule: BusSchedule, index: number): string => {
    if (busSchedule.gender === 'Female') return '#ec4899'; // Pink
    if (busSchedule.gender === 'Male') return '#3b82f6'; // Blue
    if (busSchedule.scheduleType === 'Friday') return '#f59e0b'; // Orange
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    return colors[index % colors.length];
  };

  const getTileLayer = () => {
    if (mapType === 'satellite') {
      return (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        />
      );
    }
    
    return (
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    );
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-96'} bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading Map...</p>
          <p className="text-gray-500 text-sm mt-2">Preparing route visualization</p>
        </div>
      </div>
    );
  }

  const bounds = calculateBounds();

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative w-full h-96'} rounded-2xl overflow-hidden shadow-xl border border-gray-200`}>
      
      {/* Map Controls */}
      <MapControls
        mapType={mapType}
        onMapTypeChange={setMapType}
        showTraffic={showTraffic}
        onTrafficToggle={() => setShowTraffic(!showTraffic)}
      />

      {/* Close Button (for fullscreen) */}
      {isFullscreen && onClose && (
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={onClose}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-3 text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200"
          >
            <Minimize2 className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 max-w-xs">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <Route className="h-4 w-4 text-blue-500" />
          <span>Route Legend</span>
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span className="text-gray-700">Female Routes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">Male Routes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700">Friday Special</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-gray-700">IIUC Campus</span>
          </div>
        </div>
      </div>

      {/* Route Info Panel */}
      {schedule && (
        <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-2">
              <Bus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{schedule.time}</h3>
              <p className="text-sm text-gray-600">{schedule.scheduleType} Schedule</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <span className="text-gray-700">{schedule.startingPoint}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4 text-blue-500" />
              <span className="text-gray-700">{schedule.endPoint}</span>
            </div>
            {schedule.gender && (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-gray-700">{schedule.gender} Only</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Container */}
      <MapContainer
        center={IIUC_LOCATION}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        className="leaflet-container"
      >
        {getTileLayer()}
        
        <FitBounds bounds={bounds} />
        
        {/* IIUC Marker */}
        <Marker position={IIUC_LOCATION} icon={iiucIcon}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-blue-900 mb-1">IIUC Campus</h3>
              <p className="text-sm text-gray-600">International Islamic University Chittagong</p>
              <p className="text-xs text-gray-500 mt-1">Main Campus - Kumira</p>
            </div>
          </Popup>
        </Marker>

        {/* Route Lines and Markers */}
        {routesToShow.map((busSchedule, index) => {
          const routeKey = getRouteKey(busSchedule.startingPoint);
          const coordinates = routeCoordinates[routeKey];
          const color = getRouteColor(busSchedule, index);

          if (!coordinates) return null;

          return (
            <React.Fragment key={busSchedule.id}>
              {/* Route Line */}
              <Polyline
                positions={coordinates}
                color={color}
                weight={4}
                opacity={0.8}
              />
              
              {/* Starting Point Marker */}
              <Marker 
                position={coordinates[0]} 
                icon={createCustomIcon(color, 'BUS')}
              >
                <Popup>
                  <div className="p-3 min-w-[200px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: color }}
                      ></div>
                      <h3 className="font-bold text-gray-900">{busSchedule.time}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Route:</strong> {busSchedule.startingPoint} → {busSchedule.endPoint}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">{busSchedule.route}</p>
                    <div className="flex flex-wrap gap-1">
                      {busSchedule.gender && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          busSchedule.gender === 'Female' 
                            ? 'bg-pink-100 text-pink-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {busSchedule.gender}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        busSchedule.scheduleType === 'Friday' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {busSchedule.scheduleType}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default OpenStreetMap;