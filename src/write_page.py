# -*- coding: utf-8 -*-
import os

base_dir = "riyadh-heatmap-ai/src"
app_dir = os.path.join(base_dir, "app")

page_content = '''"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ThermometerSun, AlertTriangle, Building, MapPin, Activity } from "lucide-react";
import hotspotsData from "@/data/demo_hotspots.json";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center rounded-xl border border-slate-800"><Activity className="w-8 h-8 text-blue-500 animate-spin" /></div>
});

export default function Dashboard() {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const kpis = [
    { title: "Current Hotspot Areas", value: "15", icon: <ThermometerSun className="w-5 h-5 text-red-500" /> },
    { title: "High-Risk Zones", value: "4", icon: <AlertTriangle className="w-5 h-5 text-orange-500" /> },
    { title: "Urban Expansion", value: "448.8 sq km", icon: <Building className="w-5 h-5 text-blue-500" />, sub: "2000-2024" },
    { title: "Avg Surface Temp", value: "48.2 C", icon: <MapPin className="w-5 h-5 text-yellow-500" />, sub: "Summer Peak" },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Riyadh Heat Risk Dashboard</h1>
          <p className="text-slate-400 mt-1">Satellite-powered persistent hotspot detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 font-medium text-sm">{kpi.title}</span>
              <div className="p-2 bg-slate-800 rounded-lg">{kpi.icon}</div>
            </div>
            <div>
              <span className="text-3xl font-bold text-white">{kpi.value}</span>
              {kpi.sub && <span className="text-xs text-slate-500 ml-2">({kpi.sub})</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        <div className="lg:col-span-2 relative min-h-[400px]">
          <InteractiveMap hotspots={hotspotsData} onFeatureClick={setSelectedFeature} />
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 overflow-y-auto">
          {selectedFeature ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Hotspot {selectedFeature.properties.id}</h2>
                <span className={px-3 py-1 rounded-full text-xs font-bold }>
                  {selectedFeature.properties.severity} RISK
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <span className="text-sm text-slate-400 block mb-1">Temperature</span>
                  <span className="text-2xl font-bold text-white">{selectedFeature.properties.temperature} C</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <span className="text-sm text-slate-400 block mb-1">Built-up Surface</span>
                    <span className="text-xl font-bold text-slate-200">{selectedFeature.properties.builtUpPercent}%</span>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <span className="text-sm text-slate-400 block mb-1">Vegetation</span>
                    <span className="text-xl font-bold text-slate-200">{selectedFeature.properties.vegPercent}%</span>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 mt-4">
                  <span className="text-sm text-slate-400 block mb-2">Persistence Score</span>
                  <div className="w-full bg-slate-700 rounded-full h-2.5 mb-1">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: ${selectedFeature.properties.persistenceScore}% }}></div>
                  </div>
                  <span className="text-xs text-slate-400">{selectedFeature.properties.persistenceScore}% recurrent in recent observations</span>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4">
                  <span className="text-sm text-slate-400 block mb-1">Why is this area hot?</span>
                  <p className="text-sm text-slate-300">{selectedFeature.properties.reason}</p>
                </div>
                
                <div className="bg-blue-900/30 border border-blue-900/50 rounded-lg p-4 mt-6">
                  <span className="text-sm text-blue-400 block mb-2 font-semibold">Recommended Intervention</span>
                  <ul className="text-sm text-slate-300 list-disc pl-4 space-y-1">
                    <li>Increase green space allocation</li>
                    <li>Introduce cool pavement materials</li>
                    <li>Add shaded public areas</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 min-h-[400px]">
              <MapPin className="w-12 h-12 opacity-50" />
              <p>Click on a hotspot on the map to view detailed analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'''
with open(os.path.join(app_dir, "page.tsx"), "w", encoding="utf-8") as f:
    f.write(page_content)
