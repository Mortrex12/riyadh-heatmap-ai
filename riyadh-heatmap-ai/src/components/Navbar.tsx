"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Activity, TrendingUp, ShieldAlert, BarChart3, Globe2 } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState("EN");
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: <Activity className="w-4 h-4 mr-2" /> },
    { name: "Urban Expansion", path: "/urban-expansion", icon: <TrendingUp className="w-4 h-4 mr-2" /> },
    { name: "Future Risk", path: "/future-risk", icon: <ShieldAlert className="w-4 h-4 mr-2" /> },
    { name: "Impact", path: "/impact", icon: <Globe2 className="w-4 h-4 mr-2" /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Map className="w-6 h-6 text-blue-500 mr-2" />
              <span className="font-bold text-lg tracking-tight">RIYADH HEATMAP AI</span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 transition-colors"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
             <button onClick={() => setLang(lang === "EN" ? "AR" : "EN")} className="px-3 py-1 rounded bg-slate-800 text-xs font-semibold hover:bg-slate-700 transition">
               {lang}
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
