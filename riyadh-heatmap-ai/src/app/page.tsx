"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ThermometerSun, AlertTriangle, Building, MapPin, Activity, Radio, CheckCircle2 } from "lucide-react";
import hotspotsData from "@/data/demo_hotspots.json";
import sentinelMetadata from "@/data/sentinel_metadata.json";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center rounded-xl border border-slate-800"><Activity className="w-8 h-8 text-blue-500 animate-spin" /></div>
});

export default function Dashboard() {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const kpis = [
    { title: "مناطق البؤر الحرارية الحالية", value: "15", icon: <ThermometerSun className="w-5 h-5 text-red-500" /> },
    { title: "مناطق عالية الخطورة", value: "4", icon: <AlertTriangle className="w-5 h-5 text-orange-500" /> },
    { title: "التوسع العمراني", value: "448.8 كم مربع", icon: <Building className="w-5 h-5 text-blue-500" />, sub: "2000-2024" },
    { title: "متوسط درجة حرارة السطح", value: "48.2 مئوية", icon: <MapPin className="w-5 h-5 text-yellow-500" />, sub: "ذروة الصيف" },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col space-y-6">
      {/* Sentinel-2 Live Feed Status Bar */}
      <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-800/40 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Sentinel-2 MSI Live API Feed</span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> متصل بـ Copernicus CDSE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              آخر مشهد: <span className="font-mono text-slate-300">{sentinelMetadata.latestSceneId?.slice(0, 32)}...</span> &bull; 
              الغيوم: <span className="text-emerald-300 font-semibold">{sentinelMetadata.cloudCoveragePercent}%</span> &bull; 
              التاريخ: <span className="text-slate-300">{new Date(sentinelMetadata.acquisitionDatetime).toLocaleDateString('ar-SA')}</span>
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-lg">
          الدقة المكانية: <span className="text-blue-400 font-semibold">10m / بكسل</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">لوحة معلومات مخاطر الحرارة في الرياض</h1>
          <p className="text-slate-400 mt-1">اكتشاف البؤر الحرارية المستمرة ومراقبة الحرارة الحضرية باستخدام الأقمار الصناعية</p>
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
                <h2 className="text-xl font-semibold">بؤرة حرارية {selectedFeature.properties.id}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedFeature.properties.severity === 'CRITICAL' ? 'bg-red-900 text-red-200' :
                  selectedFeature.properties.severity === 'HIGH' ? 'bg-orange-900 text-orange-200' :
                  'bg-yellow-900 text-yellow-200'
                }`}>
                  خطر {selectedFeature.properties.severity}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <span className="text-sm text-slate-400 block mb-1">درجة الحرارة</span>
                  <span className="text-2xl font-bold text-white">{selectedFeature.properties.temperature} مئوية</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <span className="text-sm text-slate-400 block mb-1">السطح المبني</span>
                    <span className="text-xl font-bold text-slate-200">{selectedFeature.properties.builtUpPercent}%</span>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <span className="text-sm text-slate-400 block mb-1">الغطاء النباتي</span>
                    <span className="text-xl font-bold text-slate-200">{selectedFeature.properties.vegPercent}%</span>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 mt-4">
                  <span className="text-sm text-slate-400 block mb-2">درجة الاستمرارية</span>
                  <div className="w-full bg-slate-700 rounded-full h-2.5 mb-1">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${selectedFeature.properties.persistenceScore}%` }}></div>
                  </div>
                  <span className="text-xs text-slate-400">{selectedFeature.properties.persistenceScore}% متكررة في الملاحظات الأخيرة</span>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4">
                  <span className="text-sm text-slate-400 block mb-1">لماذا هذه المنطقة حارة؟</span>
                  <p className="text-sm text-slate-300">{selectedFeature.properties.reason}</p>
                </div>
                
                <div className="bg-blue-900/30 border border-blue-900/50 rounded-lg p-4 mt-6">
                  <span className="text-sm text-blue-400 block mb-2 font-semibold">التدخل الموصى به</span>
                  <ul className="text-sm text-slate-300 list-disc pl-4 space-y-1">
                    <li>زيادة تخصيص المساحات الخضراء</li>
                    <li>إدخال مواد رصف باردة</li>
                    <li>إضافة مناطق عامة مظللة</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 min-h-[400px]">
              <MapPin className="w-12 h-12 opacity-50" />
              <p>انقر على بؤرة حرارية في الخريطة لعرض تحليل مفصل</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
