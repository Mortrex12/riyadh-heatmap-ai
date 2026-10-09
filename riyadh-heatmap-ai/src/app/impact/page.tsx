"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TreePine, Thermometer, ShieldCheck } from "lucide-react";

const impactData = [
  { zone: "District A", beforeTemp: 48.5, afterTemp: 46.2, vegIncrease: 12 },
  { zone: "District B", beforeTemp: 49.1, afterTemp: 45.8, vegIncrease: 18 },
  { zone: "District C", beforeTemp: 47.8, afterTemp: 46.5, vegIncrease: 8 },
  { zone: "District D", beforeTemp: 50.2, afterTemp: 47.1, vegIncrease: 15 },
];

const timeData = [
  { year: "2020", hotspotCount: 24, avgTemp: 46.5 },
  { year: "2021", hotspotCount: 26, avgTemp: 47.1 },
  { year: "2022", hotspotCount: 28, avgTemp: 47.8 },
  { year: "2023", hotspotCount: 20, avgTemp: 46.2 },
  { year: "2024", hotspotCount: 15, avgTemp: 45.8 },
];

export default function ImpactMonitoring() {
  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Impact Monitoring</h1>
        <p className="text-slate-400 mt-1">Measure the effectiveness of cooling interventions over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-sm">Avg Temp Reduction</span>
            <Thermometer className="w-5 h-5 text-green-500" />
          </div>
          <span className="text-3xl font-bold">-2.4 C</span>
          <p className="text-xs text-green-400 mt-2">In targeted intervention zones</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-sm">Hotspot Area Reduction</span>
            <ShieldCheck className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-3xl font-bold">-37.5%</span>
          <p className="text-xs text-blue-400 mt-2">Compared to 2022 peak</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-sm">Green Infrastructure</span>
            <TreePine className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-bold">+13.2%</span>
          <p className="text-xs text-emerald-400 mt-2">Overall vegetation increase in target areas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-6">Before/After Intervention Temperature</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="zone" stroke="#94a3b8" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Legend />
                <Bar dataKey="beforeTemp" name="Before (°C)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="afterTemp" name="After (°C)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-6">Historical Hotspot Trends (2020-2024)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="hotspotCount" name="Active Hotspots" stroke="#3b82f6" strokeWidth={3} />
                <Line yAxisId="right" type="monotone" dataKey="avgTemp" name="Avg Temp (°C)" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
