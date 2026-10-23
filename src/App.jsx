import React, { useState, useEffect } from 'react';
import {
  Calendar,
  RefreshCw,
  Sun,
  Moon,
  Activity,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Users,
  Settings,
  Cpu,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import DrmReviewMatrix from './components/DrmReviewMatrix';
import {
  getProductionTelemetry,
  getQATelemetry,
  getEngineeringTelemetry,
  getHRTelemetry,
  getMouldTelemetry,
  getMixingTelemetry,
  getSafetyTelemetry
} from './services/liveSheetsEngine';

export default function App() {
  // Helper to format date YYYY-MM-DD
  const formatDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Default to yesterday's date
  const getYesterdayDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatDateStr(d);
  };

  const getTodayDateStr = () => {
    return formatDateStr(new Date());
  };

  const [selectedDate, setSelectedDate] = useState(() => getYesterdayDateStr());
  const [theme, setTheme] = useState(() => localStorage.getItem('sltl_drm_theme') || 'dark');
  const isDark = theme === 'dark';

  // Real-time telemetry data states
  const [proData, setProData] = useState(null);
  const [qaData, setQaData] = useState(null);
  const [engData, setEngData] = useState(null);
  const [hrData, setHrData] = useState(null);
  const [mouldData, setMouldData] = useState(null);
  const [mixingData, setMixingData] = useState(null);
  const [safetyData, setSafetyData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('sltl_drm_theme', next);
  };

  const loadTelemetry = async (date = selectedDate) => {
    setLoading(true);
    try {
      const [pro, qa, eng, hr, mould, mix, safe] = await Promise.all([
        getProductionTelemetry(date),
        getQATelemetry(date),
        getEngineeringTelemetry(date),
        getHRTelemetry(date),
        getMouldTelemetry(),
        getMixingTelemetry(),
        getSafetyTelemetry(date)
      ]);

      if (pro) setProData(pro);
      if (qa) setQaData(qa);
      if (eng) setEngData(eng);
      if (hr) setHrData(hr);
      if (mould) setMouldData(mould);
      if (mix) setMixingData(mix);
      if (safe) setSafetyData(safe);

      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTelemetry(selectedDate);
  }, [selectedDate]);

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Corporate Command Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md shadow-sm transition-colors ${
        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-sky-500/20">
              <span className="text-sm font-mono tracking-tighter">SLTL</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-sky-400 tracking-widest uppercase">
                  SUN-TWS • TVS Group
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Live Sheets Connected
                </span>
              </div>
              <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Daily Review Matrix (DRM)</span>
                <span className="text-xs font-mono font-medium text-slate-400 hidden sm:inline">| Executive Scorecard</span>
              </h1>
            </div>
          </div>

          {/* Controls: Date Selector & Theme Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Date Pills */}
            <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-bold ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setSelectedDate(getYesterdayDateStr())}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDate === getYesterdayDateStr()
                    ? 'bg-sky-600 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yesterday
              </button>
              <button
                onClick={() => setSelectedDate(getTodayDateStr())}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedDate === getTodayDateStr()
                    ? 'bg-sky-600 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today
              </button>
            </div>

            {/* Custom Date Input */}
            <div className={`p-1.5 px-3 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
            }`}>
              <Calendar size={15} className="text-sky-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none focus:outline-none cursor-pointer font-mono text-xs"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => loadTelemetry(selectedDate)}
              disabled={loading}
              title="Refresh Telemetry"
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                isDark ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <RefreshCw size={14} className={`${loading ? 'animate-spin text-sky-400' : ''}`} />
              <span className="hidden md:inline font-mono text-[11px]">
                {lastSyncTime ? lastSyncTime : 'Sync'}
              </span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Single Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <DrmReviewMatrix
          proData={proData}
          qaData={qaData}
          engData={engData}
          hrData={hrData}
          mouldData={mouldData}
          mixingData={mixingData}
          safetyData={safetyData}
          theme={theme}
          selectedDate={selectedDate}
        />
      </main>

      {/* Corporate Global Footer */}
      <footer className={`border-t py-4 px-6 text-center text-xs flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto w-full transition-colors ${
        isDark ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-white border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#003399] text-white font-bold flex items-center justify-center text-[9px]">
            TVS
          </div>
          <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
            Sundaram Lanka Tyres Limited — Daily Review Matrix (DRM)
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-medium font-mono">
          <span>Continuous Live Telemetry</span>
          <span>•</span>
          <span>7 Factory Divisions</span>
        </div>
      </footer>
    </div>
  );
}
