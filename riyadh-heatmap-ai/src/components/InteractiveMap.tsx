"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, useMap, ImageOverlay } from "react-leaflet";
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

// Used to force remount on Fast Refresh
const fastRefreshKey = Math.random().toString(36).substring(7);

export default function InteractiveMap({ hotspots, expansion, future, onFeatureClick }: MapProps) {
  const center: [number, number] = [24.7136, 46.6753];
  
  // Clean up _leaflet_id on unmount to avoid StrictMode / Fast Refresh errors
  useEffect(() => {
    return () => {
      // Find any lingering map containers and remove their internal leaflet id
      const container = document.querySelector('.leaflet-container') as any;
      if (container && container._leaflet_id) {
        container._leaflet_id = null;
      }
    };
  }, []);

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
      <MapContainer key={fastRefreshKey} center={center} zoom={11} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="صور أقمار صناعية حقيقية (Satellite)">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer checked name="الوضع الليلي (Dark Mode)">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="خريطة الشوارع (OpenStreetMap)">
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="أسماء الأحياء والشوارع (Labels)">
            <TileLayer
              url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.Overlay>

          <LayersControl.Overlay name="🛰️ قمر Sentinel-2 الحقيقي (RGB)">
            <ImageOverlay
              url="/satellite/riyadh_sentinel2_rgb.png"
              bounds={[
                [24.50, 46.50],
                [24.90, 46.90],
              ]}
              opacity={0.9}
            />
          </LayersControl.Overlay>

          <LayersControl.Overlay name="🔥 تحليل Sentinel-2 الحراري والنباتي (NDVI)">
            <ImageOverlay
              url="/satellite/riyadh_sentinel2_ndvi_heat.png"
              bounds={[
                [24.50, 46.50],
                [24.90, 46.90],
              ]}
              opacity={0.75}
            />
          </LayersControl.Overlay>

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
