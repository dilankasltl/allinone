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
  AlertCircle,
  Clock,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import DrmReviewMatrix from './components/DrmReviewMatrix';
import { getUnifiedPeriodKpiTelemetry } from './services/liveSheetsEngine';

export default function App() {
  // Helper to format date YYYY-MM-DD
  const formatDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Default dates
  const getYesterdayDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatDateStr(d);
  };

  const getTodayDateStr = () => {
    return formatDateStr(new Date());
  };

  const getWeekAgoDateStr = (anchorDateStr) => {
    const d = new Date(anchorDateStr);
    d.setDate(d.getDate() - 6);
    return formatDateStr(d);
  };

  const getCurrentMonthStr = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  };

  // View Mode: 'daily' | 'week' | 'month'
  const [viewMode, setViewMode] = useState('daily');

  // Filter states
  const [selectedDate, setSelectedDate] = useState(() => getYesterdayDateStr());
  const [weekEndDate, setWeekEndDate] = useState(() => getYesterdayDateStr());
  const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonthStr());

  const weekStartDate = getWeekAgoDateStr(weekEndDate);

  const [theme, setTheme] = useState(() => localStorage.getItem('sltl_drm_theme') || 'dark');
  const isDark = theme === 'dark';

  // Toggle state to hide top 6 Global KPI cards by default
  const [showTopSummary, setShowTopSummary] = useState(false);

  // Telemetry data states
  const [proData, setProData] = useState(null);
  const [qaData, setQaData] = useState(null);
  const [engData, setEngData] = useState(null);
  const [hrData, setHrData] = useState(null);
  const [mouldData, setMouldData] = useState(null);
  const [mixingData, setMixingData] = useState(null);
  const [safetyData, setSafetyData] = useState(null);
  const [periodInfo, setPeriodInfo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('sltl_drm_theme', next);
  };

  const loadTelemetry = async () => {
    setLoading(true);
    try {
      const config = {
        mode: viewMode,
        selectedDate,
        weekStartDate,
        weekEndDate,
        selectedMonth
      };

      const result = await getUnifiedPeriodKpiTelemetry(config);

      if (result) {
        setProData(result.pro);
        setQaData(result.qa);
        setEngData(result.eng);
        setHrData(result.hr);
        setMouldData(result.mould);
        setMixingData(result.mix);
        setSafetyData(result.safe);
        setPeriodInfo(result.periodInfo);
      }

      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching period telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTelemetry();
  }, [viewMode, selectedDate, weekEndDate, selectedMonth]);

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
                <span>KPI DASHBOARD</span>
                <span className="text-xs font-mono font-medium text-slate-400 hidden sm:inline">| Operations Matrix</span>
              </h1>
            </div>
          </div>

          {/* Mode Switcher: Daily vs Week-Wise vs Month-Wise */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-bold ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'daily'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week-Wise Total
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month-Wise Total
            </button>
          </div>

          {/* Interactive Date & Period Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {viewMode === 'daily' && (
              <>
                {/* Quick Date Pills for Daily */}
                <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-bold ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  <button
                    onClick={() => setSelectedDate(getYesterdayDateStr())}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedDate === getYesterdayDateStr()
                        ? 'bg-sky-600 text-white shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Yesterday
                  </button>
                  <button
                    onClick={() => setSelectedDate(getTodayDateStr())}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedDate === getTodayDateStr()
                        ? 'bg-sky-600 text-white shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Today
                  </button>
                </div>

                {/* Custom Daily Date Input */}
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
              </>
            )}

            {viewMode === 'week' && (
              <>
                {/* Quick Week Selectors */}
                <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-bold ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  <button
                    onClick={() => setWeekEndDate(getYesterdayDateStr())}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      weekEndDate === getYesterdayDateStr()
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Current Week
                  </button>
                  <button
                    onClick={() => {
                      const d = new Date(weekEndDate);
                      d.setDate(d.getDate() - 7);
                      setWeekEndDate(formatDateStr(d));
                    }}
                    className="px-2.5 py-1 rounded-lg transition-all cursor-pointer text-slate-400 hover:text-white"
                  >
                    -7 Days
                  </button>
                </div>

                {/* Week End Date Input */}
                <div className={`p-1.5 px-3 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold ${
                  isDark ? 'bg-slate-900 border-indigo-500/40 text-indigo-300' : 'bg-indigo-50 border-indigo-300 text-indigo-900'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Week Ending:</span>
                  <input
                    type="date"
                    value={weekEndDate}
                    onChange={(e) => setWeekEndDate(e.target.value)}
                    className="bg-transparent border-none focus:outline-none cursor-pointer font-mono text-xs font-bold"
                  />
                </div>
              </>
            )}

            {viewMode === 'month' && (
              <>
                {/* Quick Month Selectors */}
                <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-bold ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  <button
                    onClick={() => setSelectedMonth(getCurrentMonthStr())}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedMonth === getCurrentMonthStr()
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    This Month
                  </button>
                  <button
                    onClick={() => setSelectedMonth('2026-10')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedMonth === '2026-10'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Oct 2026
                  </button>
                </div>

                {/* Month Picker Input */}
                <div className={`p-1.5 px-3 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold ${
                  isDark ? 'bg-slate-900 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Month:</span>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-transparent border-none focus:outline-none cursor-pointer font-mono text-xs font-bold"
                  />
                </div>
              </>
            )}

            {/* Summary Toggle Button */}
            <button
              onClick={() => setShowTopSummary(prev => !prev)}
              title={showTopSummary ? "Hide Global KPI Summary" : "Show Global KPI Summary"}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                showTopSummary
                  ? (isDark ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' : 'bg-sky-50 text-sky-700 border-sky-300')
                  : (isDark ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600')
              }`}
            >
              {showTopSummary ? <EyeOff size={14} /> : <Eye size={14} />}
              <span className="hidden md:inline font-mono text-[11px]">
                {showTopSummary ? 'Hide Summary' : 'Summary'}
              </span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={loadTelemetry}
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
          viewMode={viewMode}
          periodInfo={periodInfo}
          showTopSummary={showTopSummary}
          onToggleTopSummary={() => setShowTopSummary(prev => !prev)}
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
            Sundaram Lanka Tyres Limited — KPI DASHBOARD ({viewMode === 'week' ? 'Week-Wise Total Mode' : viewMode === 'month' ? 'Month-Wise Total Mode' : 'Daily Review Mode'})
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
