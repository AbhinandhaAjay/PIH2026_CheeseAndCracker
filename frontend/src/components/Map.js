import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const AccidentHotspotMap = () => {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/accidents/hotspots")
      .then((res) => res.json())
      .then((data) => {
        setHotspots(data);
      })
      .catch((err) => console.error("Error fetching hotspots:", err));
  }, []);

  // Color based on severity
  const getColor = (severity) => {
    switch (severity) {
      case "HIGH":
        return "red";
      case "MEDIUM":
        return "orange";
      case "LOW":
        return "yellow";
      default:
        return "blue";
    }
  };

  return (
    <MapContainer
      center={[13.0827, 80.2707]} // Chennai coordinates
      zoom={12}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {hotspots.map((spot, index) => (
        <CircleMarker
          key={index}
          center={[spot.latitude, spot.longitude]}
          radius={spot.count * 3} // Bigger circle for more accidents
          pathOptions={{
            color: getColor(spot.severity),
            fillColor: getColor(spot.severity),
            fillOpacity: 0.6,
          }}
        >
          <Popup>
            <div>
              <h4>Accident Hotspot</h4>
              <p><strong>Total Accidents:</strong> {spot.count}</p>
              <p><strong>Severity:</strong> {spot.severity}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default AccidentHotspotMap;