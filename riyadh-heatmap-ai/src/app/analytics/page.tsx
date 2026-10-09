"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const landCover2000 = [
  { name: "Built-up", value: 35 },
  { name: "Vegetation", value: 12 },
  { name: "Bare Ground", value: 50 },
  { name: "Water/Other", value: 3 },
];

const landCover2024 = [
  { name: "Built-up", value: 65 },
  { name: "Vegetation", value: 8 },
  { name: "Bare Ground", value: 25 },
  { name: "Water/Other", value: 2 },
];

const COLORS = ["#ef4444", "#10b981", "#eab308", "#3b82f6"];

const tempDistribution = [
  { temp: "38-40", area: 15 },
  { temp: "40-42", area: 25 },
  { temp: "42-44", area: 35 },
  { temp: "44-46", area: 55 },
  { temp: "46-48", area: 75 },
  { temp: "48-50", area: 45 },
  { temp: ">50", area: 20 },
];

export default function Analytics() {
  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Geospatial Analytics</h1>
        <p className="text-slate-400 mt-1">Detailed breakdowns of land cover classification and surface temperatures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-2">Land Cover Classification (2000)</h2>
          <p className="text-sm text-slate-400 mb-6">Based on Sentinel-2 / Landsat historical data</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={landCover2000} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {landCover2000.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-2">Land Cover Classification (2024)</h2>
          <p className="text-sm text-slate-400 mb-6">Current breakdown of urban region</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={landCover2024} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {landCover2024.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-2">Land Surface Temperature Distribution</h2>
        <p className="text-sm text-slate-400 mb-6">Area in square kilometers experiencing specific temperature ranges during peak summer</p>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tempDistribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="temp" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
              <Area type="monotone" dataKey="area" stroke="#ef4444" fillOpacity={1} fill="url(#colorArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
