"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ShieldAlert, Activity, Upload, BrainCircuit, CheckCircle2 } from "lucide-react";
import futureData from "@/data/demo_future.json";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center rounded-xl border border-slate-800"><Activity className="w-8 h-8 text-blue-500 animate-spin" /></div>
});

export default function FutureRisk() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const handlePredict = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2000);
  };

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Future Heat Risk Prediction</h1>
          <p className="text-slate-400 mt-1">Upload development plans and evaluate heat locking risk using ML</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
        <div className="lg:col-span-3 relative min-h-[400px]">
          <InteractiveMap 
            future={analyzed ? futureData : undefined} 
            onFeatureClick={analyzed ? setSelectedFeature : undefined} 
          />
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-full overflow-y-auto">
          {!analyzed && !analyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="p-6 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/50 w-full hover:bg-slate-800 transition cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-300">Upload GeoJSON</h3>
                <p className="text-xs text-slate-500 mt-1">Include building footprints & materials</p>
              </div>
              <button 
                onClick={handlePredict}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition"
              >
                <BrainCircuit className="w-5 h-5 mr-2" />
                Run AI Prediction
              </button>
              <div className="bg-slate-800/50 p-4 rounded text-sm text-slate-400 text-left w-full border border-slate-700">
                <p className="font-semibold text-slate-300 mb-2">Simulation Scenario:</p>
                <p>Loading 5 planned development districts with varied building density and green space allocation to evaluate thermal performance.</p>
              </div>
            </div>
          ) : analyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <Activity className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-lg font-medium text-slate-300 animate-pulse">Running Random Forest Model...</p>
              <ul className="text-sm text-slate-500 text-left space-y-2">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Parsing geometries...</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Extracting material features...</li>
                <li className="flex items-center"><Activity className="w-4 h-4 mr-2 text-blue-500 animate-spin" /> Evaluating spatial configurations...</li>
              </ul>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Prediction Results</h2>
                <button onClick={() => {setAnalyzed(false); setSelectedFeature(null);}} className="text-xs text-blue-400 hover:underline">Reset</button>
              </div>
              
              {!selectedFeature ? (
                <div className="text-sm text-slate-400 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <p>Analysis complete. Found 5 planned zones.</p>
                  <p className="mt-2 text-orange-400 font-semibold">Click a zone on the map to view detailed ML risk prediction.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-1">{selectedFeature.properties.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Predicted Heat Risk</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        selectedFeature.properties.predictedRisk === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                        selectedFeature.properties.predictedRisk === 'MODERATE' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {selectedFeature.properties.predictedRisk}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4">
                    <span className="text-sm text-slate-400 block mb-2">Risk Score (Random Forest)</span>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold">{selectedFeature.properties.riskScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${selectedFeature.properties.riskScore}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-500">Confidence: {selectedFeature.properties.confidence}%</span>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4">
                    <span className="text-sm text-slate-400 block mb-3">Feature Contributions</span>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span>Building Density ({selectedFeature.properties.buildingDensity}%)</span> <span className="text-red-400">+42% Risk</span></div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5"><div className="bg-red-500 h-1.5 rounded-full" style={{ width: '42%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span>Planned Vegetation ({selectedFeature.properties.plannedVeg}%)</span> <span className="text-green-400">-15% Risk</span></div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: '15%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span>Historical Base Temp</span> <span className="text-orange-400">+28% Risk</span></div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5"><div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '28%' }}></div></div>
                      </div>
                    </div>
                  </div>

                  {selectedFeature.properties.predictedRisk === 'HIGH' && (
                    <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
                      <span className="text-sm text-red-400 block mb-2 font-semibold">Priority Interventions</span>
                      <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                        <li>Increase planned green space ratio to at least 25%</li>
                        <li>Mandate cool roofs for commercial structures</li>
                        <li>Re-orient block layout for better wind flow</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
