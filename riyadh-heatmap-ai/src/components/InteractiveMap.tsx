"use client";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon issue in Next.js
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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const onFeatureClickRef = useRef(onFeatureClick);

  useEffect(() => {
    onFeatureClickRef.current = onFeatureClick;
  });

  const getHotspotStyle = (feature: any) => {
    const severity = feature.properties?.severity;
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
      fillOpacity: 0.6,
    };
  };

  const getExpansionStyle = (feature: any) => {
    const year = feature.properties?.year;
    let color = "#3b82f6";
    if (year === 2000) color = "#1e3a8a";
    if (year === 2010) color = "#1d4ed8";
    if (year === 2020) color = "#3b82f6";
    if (year === 2024) color = "#60a5fa";
    return {
      fillColor: color,
      weight: 1,
      color: "white",
      fillOpacity: 0.5,
    };
  };

  const getFutureStyle = (feature: any) => {
    const risk = feature.properties?.predictedRisk;
    let color = "#64748b";
    if (risk === "HIGH") color = "#ef4444";
    if (risk === "MEDIUM") color = "#f59e0b";
    if (risk === "LOW") color = "#10b981";
    return {
      fillColor: color,
      weight: 2,
      color: color,
      fillOpacity: 0.7,
      dashArray: "4",
    };
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous map if it exists
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Ensure DOM container doesn't retain leaflet id from strict mode or fast refresh
    if ((containerRef.current as any)._leaflet_id) {
      delete (containerRef.current as any)._leaflet_id;
    }

    const center: [number, number] = [24.7136, 46.6753];
    const map = L.map(containerRef.current, {
      center,
      zoom: 11,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    // Base layers
    const realSatellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
        maxZoom: 19,
      }
    ).addTo(map);

    const darkSatellite = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://carto.com/">Carto</a>',
      }
    );

    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: '&copy; <a href="https://openstreetmap.org">OSM</a>',
      }
    );

    const baseLayers: Record<string, L.TileLayer> = {
      "صور أقمار صناعية حقيقية (Satellite)": realSatellite,
      "الوضع الليلي (Dark Mode)": darkSatellite,
      "خريطة الشوارع (OpenStreetMap)": osm,
    };

    // Reference labels overlay for Riyadh districts and highways
    const labelsLayer = L.tileLayer(
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
      }
    ).addTo(map);

    const overlayLayers: Record<string, L.Layer> = {
      "أسماء الأحياء والشوارع (Labels)": labelsLayer,
    };

    // Real Sentinel-2 Satellite Layers (Copernicus CDSE API)
    const riyadhBounds: L.LatLngBoundsExpression = [
      [24.50, 46.50],
      [24.90, 46.90],
    ];

    const sentinelRgbLayer = L.imageOverlay("/satellite/riyadh_sentinel2_rgb.png", riyadhBounds, {
      opacity: 0.9,
      attribution: "Copernicus Sentinel-2 &copy; ESA",
    });

    const sentinelNdviLayer = L.imageOverlay("/satellite/riyadh_sentinel2_ndvi_heat.png", riyadhBounds, {
      opacity: 0.75,
      attribution: "Sentinel-2 NDVI & Heat Analysis &copy; CDSE",
    });

    overlayLayers["🛰️ قمر Sentinel-2 الحقيقي (RGB)"] = sentinelRgbLayer;
    overlayLayers["🔥 تحليل Sentinel-2 الحراري والنباتي (NDVI)"] = sentinelNdviLayer;

    if (hotspots) {
      const hotspotLayer = L.geoJSON(hotspots, {
        style: getHotspotStyle,
        onEachFeature: (feature, layer) => {
          layer.on({
            click: () => {
              onFeatureClickRef.current?.(feature);
            },
          });
        },
      }).addTo(map);
      overlayLayers["Persistent Hotspots"] = hotspotLayer;
    }

    if (expansion) {
      const expansionLayer = L.geoJSON(expansion, {
        style: getExpansionStyle,
        onEachFeature: (feature, layer) => {
          layer.on({
            click: () => {
              onFeatureClickRef.current?.(feature);
            },
          });
        },
      }).addTo(map);
      overlayLayers["Urban Expansion"] = expansionLayer;
    }

    if (future) {
      const futureLayer = L.geoJSON(future, {
        style: getFutureStyle,
        onEachFeature: (feature, layer) => {
          layer.on({
            click: () => {
              onFeatureClickRef.current?.(feature);
            },
          });
        },
      }).addTo(map);
      overlayLayers["Future Development Zones"] = futureLayer;
    }

    L.control.layers(baseLayers, overlayLayers, { position: "topright" }).addTo(map);

    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapRef.current = null;
    };
  }, [hotspots, expansion, future]);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-800 shadow-xl relative z-0">
      <div ref={containerRef} className="h-full w-full" style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
