import os

base_dir = "riyadh-heatmap-ai/src"
components_dir = os.path.join(base_dir, "components")

map_content = '''"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
  hotspots?: any;
  expansion?: any;
  future?: any;
  onFeatureClick?: (feature: any) => void;
}

export default function InteractiveMap({ hotspots, expansion, future, onFeatureClick }: MapProps) {
  const center: [number, number] = [24.7136, 46.6753];

  const getHotspotStyle = (feature: any) => {
    const severity = feature.properties.severity;
    let color = "#ef4444"; // default red
    if (severity === "CRITICAL") color = "#7f1d1d";
    if (severity === "HIGH") color = "#b91c1c";
    if (severity === "MEDIUM") color = "#f97316";
    if (severity === "LOW") color = "#eab308";
    
    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.6
    };
  };

  const getExpansionStyle = (feature: any) => {
    const year = feature.properties.year;
    let color = "#3b82f6";
    if (year === 2000) color = "#1e3a8a";
    if (year === 2010) color = "#1d4ed8";
    if (year === 2020) color = "#3b82f6";
    if (year === 2024) color = "#60a5fa";
    return {
      fillColor: color,
      weight: 1,
      color: "white",
      fillOpacity: 0.5
    };
  };

  const getFutureStyle = (feature: any) => {
    const risk = feature.properties.predictedRisk;
    let color = "#64748b";
    if (risk === "HIGH") color = "#ef4444";
    if (risk === "MEDIUM") color = "#f59e0b";
    if (risk === "LOW") color = "#10b981";
    return {
      fillColor: color,
      weight: 2,
      color: color,
      fillOpacity: 0.7,
      dashArray: "4"
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on({
      click: () => {
        if (onFeatureClick) {
          onFeatureClick(feature);
        }
      }
    });
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-800 shadow-xl relative z-0">
      <MapContainer center={center} zoom={11} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Dark Satellite (Carto)">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {hotspots && (
            <LayersControl.Overlay checked name="Persistent Hotspots">
              <GeoJSON data={hotspots} style={getHotspotStyle} onEachFeature={onEachFeature} />
            </LayersControl.Overlay>
          )}

          {expansion && (
            <LayersControl.Overlay checked name="Urban Expansion">
              <GeoJSON data={expansion} style={getExpansionStyle} onEachFeature={onEachFeature} />
            </LayersControl.Overlay>
          )}

          {future && (
            <LayersControl.Overlay checked name="Future Development Zones">
              <GeoJSON data={future} style={getFutureStyle} onEachFeature={onEachFeature} />
            </LayersControl.Overlay>
          )}
        </LayersControl>
      </MapContainer>
    </div>
  );
}
'''
with open(os.path.join(components_dir, "InteractiveMap.tsx"), "w", encoding="utf-8") as f:
    f.write(map_content)
