"use client";
import dynamic from "next/dynamic";
import { TrendingUp, Activity, Box, Clock } from "lucide-react";
import expansionData from "@/data/demo_expansion.json";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center rounded-xl border border-slate-800"><Activity className="w-8 h-8 text-blue-500 animate-spin" /></div>
});

export default function UrbanExpansion() {
  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Urban Expansion Analysis</h1>
          <p className="text-slate-400 mt-1">Monitor built-up area growth vs persistent heat</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-blue-900/50 rounded-lg text-blue-400"><Clock className="w-6 h-6" /></div>
          <div>
            <span className="text-sm text-slate-400">Timeframe</span>
            <span className="block text-xl font-bold">2000 - 2024</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-indigo-900/50 rounded-lg text-indigo-400"><Box className="w-6 h-6" /></div>
          <div>
            <span className="text-sm text-slate-400">Total Built-Up Area</span>
            <span className="block text-xl font-bold">448.8 sq km</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-red-900/50 rounded-lg text-red-400"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <span className="text-sm text-slate-400">Overlap with Heat Risk</span>
            <span className="block text-xl font-bold">34.2%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
        <div className="lg:col-span-3 relative min-h-[400px]">
          <InteractiveMap expansion={expansionData} />
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Legend & Analysis</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#1e3a8a] rounded"></div>
              <span className="text-sm text-slate-300">Base Extent (2000)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#1d4ed8] rounded"></div>
              <span className="text-sm text-slate-300">Expansion by 2010</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#3b82f6] rounded"></div>
              <span className="text-sm text-slate-300">Expansion by 2020</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#60a5fa] rounded"></div>
              <span className="text-sm text-slate-300">Recent Expansion (2024)</span>
            </div>
          </div>

          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <h3 className="font-semibold mb-2">Insight</h3>
            <p className="text-sm text-slate-300">
              The northern and eastern corridors show the most rapid recent expansion. 
              These new developments overlap with historical bare-ground hotspots, locking in high temperatures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
