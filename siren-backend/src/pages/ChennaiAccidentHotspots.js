import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom accident hotspot icon
const createCustomIcon = (severity) => {
  const color = severity === 'High' ? '#dc2626' : 
                severity === 'Medium' ? '#ea580c' : '#ca8a04';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
      ">
        ⚠️
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Sample accident hotspot data for Chennai
const accidentHotspots = [
  {
    id: 1,
    location: "Anna Nagar 2nd Avenue",
    position: [13.0850, 80.2101],
    accidents: 15,
    severity: "High",
    lastReported: "2024-01-15",
    description: "Frequent accidents at intersection near shopping complex"
  },
  {
    id: 2,
    location: "Poonamallee High Road",
    position: [13.0765, 80.2525],
    accidents: 12,
    severity: "High",
    lastReported: "2024-01-12",
    description: "High-speed corridor with multiple pedestrian crossings"
  },
  {
    id: 3,
    location: "Mount Road (Anna Salai)",
    position: [13.0629, 80.2589],
    accidents: 8,
    severity: "Medium",
    lastReported: "2024-01-10",
    description: "Commercial area with heavy traffic during peak hours"
  },
  {
    id: 4,
    location: "Tambaram Main Road",
    position: [12.9249, 80.1000],
    accidents: 10,
    severity: "High",
    lastReported: "2024-01-14",
    description: "Accident-prone zone near railway station"
  },
  {
    id: 5,
    location: "OMR - Sholinganallur Junction",
    position: [12.8992, 80.2272],
    accidents: 7,
    severity: "Medium",
    lastReported: "2024-01-08",
    description: "IT corridor with high vehicle density"
  },
  {
    id: 6,
    location: "Koyambedu Junction",
    position: [13.0694, 80.1982],
    accidents: 9,
    severity: "Medium",
    lastReported: "2024-01-11",
    description: "Near bus terminus and market area"
  },
  {
    id: 7,
    location: "Porur Junction",
    position: [13.0359, 80.1563],
    accidents: 11,
    severity: "High",
    lastReported: "2024-01-13",
    description: "Multiple road merges causing confusion"
  },
  {
    id: 8,
    location: "T. Nagar - Pondy Bazaar",
    position: [13.0418, 80.2341],
    accidents: 6,
    severity: "Low",
    lastReported: "2024-01-09",
    description: "Shopping district with pedestrian traffic"
  }
];

const ChennaiAccidentHotspots = () => {
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Chennai coordinates
  const chennaiCenter = [13.0827, 80.2707];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-orange-500';
      case 'Low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'High': return 'text-red-700';
      case 'Medium': return 'text-orange-700';
      case 'Low': return 'text-yellow-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-extrabold text-gray-900 sm:text-3xl md:text-5xl ">
            Chennai Accident Hotspots
          </h1>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-red-600">
              {accidentHotspots.filter(h => h.severity === 'High').length}
            </div>
            <div className="text-gray-600">High Risk Zones</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {accidentHotspots.filter(h => h.severity === 'Medium').length}
            </div>
            <div className="text-gray-600">Medium Risk Zones</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-gray-700">
              {accidentHotspots.reduce((sum, hotspot) => sum + hotspot.accidents, 0)}
            </div>
            <div className="text-gray-600">Total Reported Accidents</div>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-96 md:h-[500px] w-full">
            <MapContainer
              center={chennaiCenter}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {accidentHotspots.map((hotspot) => (
                <Marker
                  key={hotspot.id}
                  position={hotspot.position}
                  icon={createCustomIcon(hotspot.severity)}
                  eventHandlers={{
                    click: () => {
                      setSelectedHotspot(hotspot);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[250px]">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">
                        {hotspot.location}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Severity:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(hotspot.severity)} text-white`}>
                            {hotspot.severity}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accidents:</span>
                          <span className="font-semibold">{hotspot.accidents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Reported:</span>
                          <span className="font-semibold">{hotspot.lastReported}</span>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-700">{hotspot.description}</p>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Hotspot List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Accident Hotspots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accidentHotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                  hotspot.severity === 'High' ? 'border-red-500' :
                  hotspot.severity === 'Medium' ? 'border-orange-500' : 'border-yellow-500'
                } hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => setSelectedHotspot(hotspot)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{hotspot.location}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(hotspot.severity)} text-white`}>
                    {hotspot.severity}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Accidents: <strong>{hotspot.accidents}</strong></span>
                  <span>Last: <strong>{hotspot.lastReported}</strong></span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{hotspot.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-gray-800 mb-3">Severity Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">High Risk (10+ accidents)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Medium Risk (5-9 accidents)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Low Risk (1-4 accidents)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChennaiAccidentHotspots;