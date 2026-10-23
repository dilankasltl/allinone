import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Users,
  Settings,
  Cpu,
  Calendar,
  Clock,
  Flame,
  AlertCircle
} from 'lucide-react';

export default function DrmReviewMatrix({
  proData,
  qaData,
  engData,
  hrData,
  mouldData,
  mixingData,
  safetyData,
  theme = 'dark',
  selectedDate = '2026-10-13',
  viewMode = 'daily', // 'daily' | 'week' | 'month'
  periodInfo = null
}) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200';
  const subText = isDark ? 'text-slate-400' : 'text-slate-600';

  const isMultiDay = viewMode === 'week' || viewMode === 'month';
  const periodTag = viewMode === 'week' ? 'Week Total' : viewMode === 'month' ? 'Month Total' : '';
  const periodAvgTag = viewMode === 'week' ? 'Week Avg' : viewMode === 'month' ? 'Month Avg' : 'Avg';

  // Helper to test if a telemetry value has actual recorded data (remember '0' is valid data!)
  const isPopulated = (val) => {
    if (val === null || val === undefined) return false;
    const s = String(val).trim();
    if (s === '' || s.toLowerCase() === 'nan' || s.toLowerCase() === 'null') return false;
    return true;
  };

  const renderKpiVal = (val, suffix = '', precision = null) => {
    if (!isPopulated(val)) {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
          No Data
        </span>
      );
    }
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (!isNaN(num)) {
      const formatted = precision !== null ? num.toFixed(precision) : num;
      return `${formatted}${suffix}`;
    }
    return `${val}${suffix}`;
  };

  // Fallbacks if data is loading
  const pro = proData || {
    planT: 21.03,
    actualT: 18.82,
    utilizationPercent: 71.6,
    adherencePercent: 89.5,
    curingOee: 94.0,
    productivity: 7.84,
    lossT: 2.21,
    capacityT: 26.29
  };

  const qa = qaData || {
    customerClaims: 0,
    berlcDaily: 0.04,
    rGradeDaily: 0.04,
    ftrDaily: 87.5,
    flashRateDaily: 1.37,
    compoundRejection: 0
  };

  const hr = hrData || {
    authorizedLeave: 3.08,
    unauthorizedLeave: 1.54,
    twentyFourHours: 16,
    trainingHrs: 6.0,
    dot: 19,
    kaizen: 0
  };

  const mould = mouldData || {
    mouldBreakdownHrs: 1.02,
    preventiveMouldNos: 2,
    mouldMaintainCostINR: 0.0,
    improvementCostINR: 0.0
  };

  const mixing = mixingData || {
    mixingTonnage: 5210,
    mixingOee: 85.0,
    noOfBatches: 128,
    remillWeightT: 2.22,
    remillBatchesNos: 37
  };

  const safe = safetyData || {
    reportableAccidents: 0,
    nonReportableAccidents: 0,
    firstAidAccidents: 0,
    nearmissesIdentified: 2,
    nearmissesClosed: 1,
    unsafeActs: 1,
    safetyTrainingHrs: 0,
    daysWithoutIncidents: 14
  };

  const eng = engData || {
    fuelConsumption: 816.0,
    fuelCost: 1.96,
    powerConsumption: 333,
    powerCost: 2.0,
    totalUnitsDay: 5640,
    totalWoodConsumption: 13780
  };

  // 7 Main Departments & Exact Required KPIs with period-aware dynamic labels
  const departmentSections = [
    {
      id: 'production',
      title: 'Production Telemetry',
      officer: 'Mr. Ravimal',
      icon: <Layers size={18} className="text-sky-400" />,
      accentBorder: 'border-sky-500/30',
      accentBg: isDark ? 'bg-sky-950/20' : 'bg-sky-50/60',
      badge: isMultiDay ? `${periodTag} (PRO)` : 'PRO Cloud',
      kpis: [
        {
          label: isMultiDay ? `Utilization % (${periodAvgTag})` : 'Plant Utilization %',
          value: renderKpiVal(pro.utilizationPercent, '%', 1),
          target: '85.0%',
          status: isPopulated(pro.utilizationPercent) ? (pro.utilizationPercent >= 80 ? 'good' : 'warning') : 'neutral',
          rawValue: pro.utilizationPercent
        },
        {
          label: isMultiDay ? `Production [${periodTag}]` : 'Production (T)',
          value: renderKpiVal(pro.actualT, ' T'),
          target: renderKpiVal(pro.planT, ' T'),
          status: isPopulated(pro.actualT) && isPopulated(pro.planT) ? (pro.actualT >= pro.planT ? 'good' : 'warning') : 'neutral',
          rawValue: pro.actualT
        },
        {
          label: isMultiDay ? `Adherence % (${periodAvgTag})` : 'Production Adherence %',
          value: renderKpiVal(pro.adherencePercent, '%', 1),
          target: '95.0%',
          status: isPopulated(pro.adherencePercent) ? (pro.adherencePercent >= 90 ? 'good' : 'bad') : 'neutral',
          rawValue: pro.adherencePercent
        },
        {
          label: isMultiDay ? `Curing OEE % (${periodAvgTag})` : 'Curing OEE %',
          value: renderKpiVal(pro.curingOee, '%', 1),
          target: '80.0%',
          status: isPopulated(pro.curingOee) ? (pro.curingOee >= 80 ? 'good' : 'warning') : 'neutral',
          rawValue: pro.curingOee
        },
        {
          label: isMultiDay ? `Productivity (${periodAvgTag})` : 'Productivity',
          value: renderKpiVal(pro.productivity),
          target: '7.84',
          status: isPopulated(pro.productivity) ? 'good' : 'neutral',
          rawValue: pro.productivity
        },
        {
          label: isMultiDay ? `Loss [${periodTag}]` : 'Production Loss (T)',
          value: renderKpiVal(pro.lossT, ' T'),
          target: '0.00 T',
          status: isPopulated(pro.lossT) ? (pro.lossT > 0 ? 'bad' : 'good') : 'neutral',
          rawValue: pro.lossT
        }
      ]
    },
    {
      id: 'quality',
      title: 'Quality Assurance (QA)',
      icon: <Sparkles size={18} className="text-cyan-400" />,
      accentBorder: 'border-cyan-500/30',
      accentBg: isDark ? 'bg-cyan-950/20' : 'bg-cyan-50/60',
      badge: isMultiDay ? `${periodTag} (QA)` : 'QA Cloud',
      kpis: [
        {
          label: isMultiDay ? `Complaints [${periodTag}]` : 'Customer Complaints',
          value: renderKpiVal(qa.customerClaims, ' NOS'),
          target: '0 NOS',
          status: isPopulated(qa.customerClaims) ? (qa.customerClaims === 0 ? 'good' : 'bad') : 'neutral',
          rawValue: qa.customerClaims
        },
        {
          label: isMultiDay ? `BERLC % (${periodAvgTag})` : 'BERLC %',
          value: renderKpiVal(qa.berlcDaily, '%', 2),
          target: '0.25%',
          status: isPopulated(qa.berlcDaily) ? (qa.berlcDaily <= 0.25 ? 'good' : 'bad') : 'neutral',
          rawValue: qa.berlcDaily
        },
        {
          label: isMultiDay ? `R Grade % (${periodAvgTag})` : 'R Grade %',
          value: renderKpiVal(qa.rGradeDaily, '%', 2),
          target: '0.15%',
          status: isPopulated(qa.rGradeDaily) ? (qa.rGradeDaily <= 0.15 ? 'good' : 'bad') : 'neutral',
          rawValue: qa.rGradeDaily
        },
        {
          label: isMultiDay ? `FTR % (${periodAvgTag})` : 'FTR %',
          value: renderKpiVal(qa.ftrDaily, '%', 1),
          target: '90.0%',
          status: isPopulated(qa.ftrDaily) ? (qa.ftrDaily >= 90 ? 'good' : 'warning') : 'neutral',
          rawValue: qa.ftrDaily
        },
        {
          label: isMultiDay ? `Flash Rate % (${periodAvgTag})` : 'Flash Rate %',
          value: renderKpiVal(qa.flashRateDaily, '%', 2),
          target: '1.20%',
          status: isPopulated(qa.flashRateDaily) ? (qa.flashRateDaily <= 1.20 ? 'good' : 'warning') : 'neutral',
          rawValue: qa.flashRateDaily
        },
        {
          label: isMultiDay ? `Compound Rej. [${periodTag}]` : 'Compound Rejection',
          value: renderKpiVal(qa.compoundRejection, ' Kg'),
          target: '0 Kg',
          status: isPopulated(qa.compoundRejection) ? (qa.compoundRejection === 0 ? 'good' : 'bad') : 'neutral',
          rawValue: qa.compoundRejection
        }
      ]
    },
    {
      id: 'engineering',
      title: 'Engineering & Utilities',
      officer: 'Mr. Shemba',
      icon: <Zap size={18} className="text-amber-400" />,
      accentBorder: 'border-amber-500/30',
      accentBg: isDark ? 'bg-amber-950/20' : 'bg-amber-50/60',
      badge: isMultiDay ? `${periodTag} (ENG)` : 'ENG Cloud',
      kpis: [
        {
          label: isMultiDay ? `Fuel Cons. (${periodAvgTag})` : 'Fuel Consumption',
          value: renderKpiVal(eng.fuelConsumption, ' KG/MT'),
          target: '910 KG/MT',
          status: isPopulated(eng.fuelConsumption) ? (eng.fuelConsumption <= 910 ? 'good' : 'warning') : 'neutral',
          rawValue: eng.fuelConsumption
        },
        {
          label: isMultiDay ? `Fuel Rate (${periodAvgTag})` : 'Fuel Cost (INR)',
          value: renderKpiVal(eng.fuelCost, ' INR/Kg'),
          target: '3.20 INR',
          status: isPopulated(eng.fuelCost) ? 'good' : 'neutral',
          rawValue: eng.fuelCost
        },
        {
          label: isMultiDay ? `Power Cons. (${periodAvgTag})` : 'Power Consumption',
          value: renderKpiVal(eng.powerConsumption, ' Kwh/MT'),
          target: '360 Kwh/MT',
          status: isPopulated(eng.powerConsumption) ? (eng.powerConsumption <= 360 ? 'good' : 'warning') : 'neutral',
          rawValue: eng.powerConsumption
        },
        {
          label: isMultiDay ? `Power Cost (${periodAvgTag})` : 'Power Cost (INR)',
          value: renderKpiVal(eng.powerCost, ' INR/Kg'),
          target: '4.08 INR',
          status: isPopulated(eng.powerCost) ? 'good' : 'neutral',
          rawValue: eng.powerCost
        }
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Environmental Health',
      icon: <ShieldCheck size={18} className="text-emerald-400" />,
      accentBorder: 'border-emerald-500/30',
      accentBg: isDark ? 'bg-emerald-950/20' : 'bg-emerald-50/60',
      badge: isMultiDay ? `${periodTag} (SAFETY)` : 'SAFETY Cloud',
      kpis: [
        {
          label: isMultiDay ? `Reportable [${periodTag}]` : 'Reportable Accident (NOS)',
          value: renderKpiVal(safe.reportableAccidents),
          target: '0',
          status: isPopulated(safe.reportableAccidents) ? (safe.reportableAccidents === 0 ? 'good' : 'bad') : 'neutral',
          rawValue: safe.reportableAccidents
        },
        {
          label: isMultiDay ? `Non Reportable [${periodTag}]` : 'Non Reportable Accident',
          value: renderKpiVal(safe.nonReportableAccidents),
          target: '0',
          status: isPopulated(safe.nonReportableAccidents) ? (safe.nonReportableAccidents === 0 ? 'good' : 'bad') : 'neutral',
          rawValue: safe.nonReportableAccidents
        },
        {
          label: isMultiDay ? `First Aid [${periodTag}]` : 'First Aid Accident (NOS)',
          value: renderKpiVal(safe.firstAidAccidents),
          target: '0',
          status: isPopulated(safe.firstAidAccidents) ? (safe.firstAidAccidents === 0 ? 'good' : 'warning') : 'neutral',
          rawValue: safe.firstAidAccidents
        },
        {
          label: isMultiDay ? `Nearmisses [${periodTag}]` : 'Nearmiss Unsafe Condition',
          value: renderKpiVal(safe.nearmissesIdentified),
          target: '0',
          status: isPopulated(safe.nearmissesIdentified) ? (safe.nearmissesIdentified === 0 ? 'good' : 'warning') : 'neutral',
          rawValue: safe.nearmissesIdentified
        },
        {
          label: isMultiDay ? `Unsafe Acts [${periodTag}]` : 'Unsafe Act (NOS)',
          value: renderKpiVal(safe.unsafeActs),
          target: '0',
          status: isPopulated(safe.unsafeActs) ? (safe.unsafeActs === 0 ? 'good' : 'warning') : 'neutral',
          rawValue: safe.unsafeActs
        },
        {
          label: isMultiDay ? `Training [${periodTag}]` : 'Safety Training (Hrs)',
          value: renderKpiVal(safe.safetyTrainingHrs, ' Hrs'),
          target: isMultiDay ? `${((periodInfo?.activeDays || 1) * 2).toFixed(0)} Hrs` : '60 Hrs',
          status: isPopulated(safe.safetyTrainingHrs) ? 'good' : 'warning',
          rawValue: safe.safetyTrainingHrs
        }
      ]
    },
    {
      id: 'hr',
      title: 'Human Resources (HR)',
      icon: <Users size={18} className="text-purple-400" />,
      accentBorder: 'border-purple-500/30',
      accentBg: isDark ? 'bg-purple-950/20' : 'bg-purple-50/60',
      badge: isMultiDay ? `${periodTag} (HR)` : 'HR Cloud',
      kpis: [
        {
          label: isMultiDay ? `Authorized Leave % (${periodAvgTag})` : 'Authorized Leave %',
          value: renderKpiVal(hr.authorizedLeave, '%', 2),
          target: '6.0%',
          status: isPopulated(hr.authorizedLeave) ? (hr.authorizedLeave <= 6 ? 'good' : 'warning') : 'neutral',
          rawValue: hr.authorizedLeave
        },
        {
          label: isMultiDay ? `Unauth. Leave % (${periodAvgTag})` : 'Unauthorized Leave %',
          value: renderKpiVal(hr.unauthorizedLeave, '%', 2),
          target: '0.0%',
          status: isPopulated(hr.unauthorizedLeave) ? (hr.unauthorizedLeave === 0 ? 'good' : 'bad') : 'neutral',
          rawValue: hr.unauthorizedLeave
        },
        {
          label: isMultiDay ? `24 Hours [${periodTag}]` : '24 Hours (NOS)',
          value: renderKpiVal(hr.twentyFourHours),
          target: '4',
          status: isPopulated(hr.twentyFourHours) ? 'warning' : 'neutral',
          rawValue: hr.twentyFourHours
        },
        {
          label: isMultiDay ? `Training [${periodTag}]` : 'Training (Hrs)',
          value: renderKpiVal(hr.trainingHrs, ' Hrs'),
          target: isMultiDay ? `${((periodInfo?.activeDays || 1) * 3).toFixed(0)} Hrs` : '3.0 Hrs',
          status: isPopulated(hr.trainingHrs) ? 'good' : 'neutral',
          rawValue: hr.trainingHrs
        },
        {
          label: isMultiDay ? `DOT [${periodTag}]` : 'DOT (NOS)',
          value: renderKpiVal(hr.dot),
          target: '4',
          status: isPopulated(hr.dot) ? 'warning' : 'neutral',
          rawValue: hr.dot
        },
        {
          label: isMultiDay ? `Kaizen [${periodTag}]` : 'Kaizen (NOS)',
          value: renderKpiVal(hr.kaizen),
          target: '20',
          status: isPopulated(hr.kaizen) ? 'good' : 'neutral',
          rawValue: hr.kaizen
        }
      ]
    },
    {
      id: 'mould',
      title: 'Mould Operations',
      icon: <Settings size={18} className="text-indigo-400" />,
      accentBorder: 'border-indigo-500/30',
      accentBg: isDark ? 'bg-indigo-950/20' : 'bg-indigo-50/60',
      badge: isMultiDay ? `${periodTag} (MOULD)` : 'MOULD Cloud',
      kpis: [
        {
          label: isMultiDay ? `Breakdown [${periodTag}]` : 'Mould Breakdown (Hrs)',
          value: renderKpiVal(mould.mouldBreakdownHrs, ' Hrs'),
          target: '1.0 Hrs',
          status: isPopulated(mould.mouldBreakdownHrs) ? (mould.mouldBreakdownHrs <= 1.0 ? 'good' : 'warning') : 'neutral',
          rawValue: mould.mouldBreakdownHrs
        },
        {
          label: isMultiDay ? `Preventive [${periodTag}]` : 'Preventive Mould (Nos)',
          value: renderKpiVal(mould.preventiveMouldNos),
          target: '2',
          status: isPopulated(mould.preventiveMouldNos) ? 'good' : 'neutral',
          rawValue: mould.preventiveMouldNos
        },
        {
          label: isMultiDay ? `Maintain Cost [${periodTag}]` : 'Mould Maintain Cost (INR)',
          value: renderKpiVal(mould.mouldMaintainCostINR, ' INR'),
          target: '0.5 INR',
          status: isPopulated(mould.mouldMaintainCostINR) ? 'good' : 'neutral',
          rawValue: mould.mouldMaintainCostINR
        },
        {
          label: isMultiDay ? `Improve Cost [${periodTag}]` : 'Improvement Cost (INR)',
          value: renderKpiVal(mould.improvementCostINR, ' INR'),
          target: '1.03 INR',
          status: isPopulated(mould.improvementCostINR) ? 'good' : 'neutral',
          rawValue: mould.improvementCostINR
        }
      ]
    },
    {
      id: 'mixing',
      title: 'Compound Mixing',
      icon: <Cpu size={18} className="text-teal-400" />,
      accentBorder: 'border-teal-500/30',
      accentBg: isDark ? 'bg-teal-950/20' : 'bg-teal-50/60',
      badge: isMultiDay ? `${periodTag} (MIXING)` : 'MIXING Cloud',
      kpis: [
        {
          label: isMultiDay ? `Mixing Tonnage [${periodTag}]` : 'Mixing Tonnage',
          value: renderKpiVal(mixing.mixingTonnage, ' T'),
          target: '8000 T',
          status: isPopulated(mixing.mixingTonnage) ? 'good' : 'neutral',
          rawValue: mixing.mixingTonnage
        },
        {
          label: isMultiDay ? `Mixing OEE % (${periodAvgTag})` : 'Mixing OEE %',
          value: renderKpiVal(mixing.mixingOee, '%'),
          target: '80.0%',
          status: isPopulated(mixing.mixingOee) ? 'good' : 'neutral',
          rawValue: mixing.mixingOee
        },
        {
          label: isMultiDay ? `No of Batches [${periodTag}]` : 'No of Batches',
          value: renderKpiVal(mixing.noOfBatches),
          target: '120',
          status: isPopulated(mixing.noOfBatches) ? 'good' : 'neutral',
          rawValue: mixing.noOfBatches
        },
        {
          label: isMultiDay ? `Remill Weight [${periodTag}]` : 'Remill Weight (T)',
          value: renderKpiVal(mixing.remillWeightT, ' T'),
          target: '2.5 T',
          status: isPopulated(mixing.remillWeightT) ? 'good' : 'neutral',
          rawValue: mixing.remillWeightT
        },
        {
          label: isMultiDay ? `Remill Batches [${periodTag}]` : 'Remill Batches (NOS)',
          value: renderKpiVal(mixing.remillBatchesNos),
          target: '40',
          status: isPopulated(mixing.remillBatchesNos) ? 'good' : 'neutral',
          rawValue: mixing.remillBatchesNos
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Active Date / Period Banner for KPI DASHBOARD */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-md ${cardBg}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black border ${
            viewMode === 'month'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : viewMode === 'week'
              ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
              : 'bg-sky-500/20 text-sky-400 border-sky-500/30'
          }`}>
            <Calendar size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">KPI DASHBOARD</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Live Factory Telemetry
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border uppercase ${
                viewMode === 'month'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : viewMode === 'week'
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
              }`}>
                {viewMode === 'week' ? 'Week-Wise Totals' : viewMode === 'month' ? 'Month-Wise Totals' : 'Daily Single Date'}
              </span>
            </div>
            <h1 className="text-base font-black tracking-wide">
              {viewMode === 'daily' ? (
                <>Operational Review Date: <span className="text-sky-400 font-mono">{selectedDate || 'Active Log'}</span></>
              ) : viewMode === 'week' ? (
                <>Week-Wise Period: <span className="text-indigo-400 font-mono">{periodInfo?.dateRangeStr || 'Selected Week'}</span></>
              ) : (
                <>Month-Wise Period: <span className="text-emerald-400 font-mono">{periodInfo?.dateRangeStr || 'Selected Month'}</span></>
              )}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-3 py-1.5 rounded-xl border font-mono font-bold ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            {viewMode === 'daily'
              ? 'Shifts: Shift (Day) & Shift (Night)'
              : `${periodInfo?.activeDays || 0} Operational Days Calculated`}
          </span>
        </div>
      </div>

      {/* Top Global Telemetry Banner (6 Dedicated KPI Boxes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Output Tonnage */}
        <div className={`p-4 rounded-2xl border shadow-lg relative overflow-hidden transition-all flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className={subText}>{isMultiDay ? `Production [${periodTag}]` : 'Production Output'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {renderKpiVal(pro.actualT, ' T')}
              </span>
            </div>
            <div className={`text-[11px] mt-0.5 ${subText}`}>/ {renderKpiVal(pro.planT, ' T Plan')}</div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs flex items-center justify-between">
            <span className="text-emerald-500 font-bold flex items-center gap-1 text-[11px]">
              <TrendingUp size={12} /> {renderKpiVal(pro.adherencePercent, '% Adh')}
            </span>
            <span className="text-slate-400 text-[10px] font-mono">Cap: {renderKpiVal(pro.capacityT, 'T')}</span>
          </div>
        </div>

        {/* Card 2: Plant Utilization */}
        <div className={`p-4 rounded-2xl border shadow-lg relative overflow-hidden transition-all flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className={subText}>{isMultiDay ? `Utilization (${periodAvgTag})` : 'Plant Utilization'}</span>
              <Activity size={14} className="text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {renderKpiVal(pro.utilizationPercent, '%', 1)}
              </span>
            </div>
            <div className={`text-[11px] mt-0.5 ${subText}`}>Target 85%</div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs flex items-center justify-between">
            <span className="text-emerald-500 font-bold text-[11px]">
              {isPopulated(pro.utilizationPercent) && pro.utilizationPercent >= 80 ? 'Optimal Run' : 'Available Cap'}
            </span>
            <span className="text-slate-400 text-[10px] font-mono">OEE: {renderKpiVal(pro.curingOee, '%')}</span>
          </div>
        </div>

        {/* Card 3: Quality First Time Right */}
        <div className={`p-4 rounded-2xl border shadow-lg relative overflow-hidden transition-all flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> {isMultiDay ? `FTR % (${periodAvgTag})` : 'First Time Right (FTR)'}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                &ge; 90%
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-cyan-500 tracking-tight">
                {renderKpiVal(qa.ftrDaily, '%', 1)}
              </span>
            </div>
            <div className={`text-[11px] mt-0.5 ${subText}`}>Standard Spec</div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs flex items-center justify-between">
            <span className="text-cyan-400 font-bold text-[11px]">Quality Spec</span>
            <span className="text-slate-400 text-[10px] font-mono">BERLC: {renderKpiVal(qa.berlcDaily, '%', 2)}</span>
          </div>
        </div>

        {/* Card 4: Customer Complaints */}
        <div className={`p-4 rounded-2xl border shadow-lg relative overflow-hidden transition-all flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles size={13} /> {isMultiDay ? `Complaints [${periodTag}]` : 'Customer Complaints'}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                Target 0
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black tracking-tight text-emerald-400">
                {renderKpiVal(qa.customerClaims, ' NOS')}
              </span>
            </div>
            <div className={`text-[11px] mt-0.5 ${subText}`}>Zero Customer Claims</div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs flex items-center justify-between">
            <span className="text-emerald-400 font-bold text-[11px]">
              {isPopulated(qa.customerClaims) && qa.customerClaims === 0 ? 'Zero Claims' : 'Active Action'}
            </span>
            <span className="text-slate-400 text-[10px] font-mono">Flash: {renderKpiVal(qa.flashRateDaily, '%')}</span>
          </div>
        </div>

        {/* Card 5: Energy & Power */}
        <div className={`p-4 rounded-2xl border shadow-lg relative overflow-hidden transition-all flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className={subText}>{isMultiDay ? `Power Cons. (${periodAvgTag})` : 'Power Consumption'}</span>
              <Zap size={14} className="text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {renderKpiVal(eng.powerConsumption, ' Kwh/MT')}
              </span>
            </div>
            <div className={`text-[11px] mt-0.5 ${subText}`}>
              {isMultiDay && eng.totalUnitsDay ? `Total: ${eng.totalUnitsDay.toLocaleString()} kWh` : 'Target 360 Kwh/MT'}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs flex items-center justify-between">
            <span className="text-emerald-500 font-bold text-[11px]">Cost: {renderKpiVal(eng.powerCost, ' INR/Kg')}</span>
            <span className="text-slate-400 text-[10px] font-mono">Fuel: {renderKpiVal(eng.fuelConsumption)}</span>
          </div>
        </div>

        {/* Card 6: Safety Zero Harm */}
        <div className={`p-4 rounded-2xl border shadow-lg relative overflow-hidden transition-all flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className={subText}>{isMultiDay ? `Incidents [${periodTag}]` : 'Incident-Free Days'}</span>
              <ShieldCheck size={14} className="text-purple-500" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black tracking-tight text-purple-400">
                {renderKpiVal(safe.daysWithoutIncidents, ' Days')}
              </span>
            </div>
            <div className="text-[11px] mt-0.5 text-purple-400 font-bold">Zero Harm</div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs flex items-center justify-between">
            <span className="text-emerald-500 font-bold text-[11px]">{renderKpiVal(safe.reportableAccidents, ' Reportable')}</span>
            <span className="text-slate-400 text-[10px] font-mono">Hazards: {renderKpiVal(safe.nearmissesIdentified)}</span>
          </div>
        </div>
      </div>

      {/* 7 Core Department Command Telemetry Cards */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-sky-500 rounded-sm"></div>
            <h2 className={`text-lg font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              OPERATIONAL DEPARTMENT KPI DASHBOARD
            </h2>
          </div>
          <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Live Synchronized Feeds (PRO, QA, ENG, SAFETY, HR, MOULD, MIXING)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departmentSections.map((dept) => (
            <div
              key={dept.id}
              className={`rounded-2xl border p-5 shadow-xl flex flex-col justify-between transition-all hover:border-sky-500/40 ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                {/* Section Header */}
                <div className={`flex items-center justify-between pb-3 mb-4 border-b ${
                  isDark ? 'border-slate-800/60' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {dept.icon}
                    <div>
                      <h3 className={`font-black text-sm uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {dept.title}
                      </h3>
                      {dept.officer && (
                        <div className={`text-[10px] font-mono font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Officer: {dept.officer}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${dept.accentBorder} ${
                    isDark ? 'text-slate-300 bg-slate-950/60' : 'text-slate-700 bg-slate-100'
                  }`}>
                    {dept.badge}
                  </span>
                </div>

                {/* KPI Metrics Grid for this department */}
                <div className="grid grid-cols-2 gap-2.5">
                  {dept.kpis.map((kpi, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                        isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold truncate max-w-[110px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {kpi.label}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          kpi.status === 'good'
                            ? 'bg-emerald-400'
                            : kpi.status === 'warning'
                            ? 'bg-amber-400'
                            : kpi.status === 'bad'
                            ? 'bg-rose-500'
                            : 'bg-slate-500'
                        }`}></span>
                      </div>

                      <div className="flex items-baseline justify-between mt-1.5">
                        <span className={`font-black text-sm font-mono tracking-tight ${
                          !isPopulated(kpi.rawValue)
                            ? (isDark ? 'text-slate-400' : 'text-slate-500')
                            : kpi.status === 'good'
                            ? (isDark ? 'text-emerald-400' : 'text-emerald-700')
                            : kpi.status === 'warning'
                            ? (isDark ? 'text-amber-400' : 'text-amber-700')
                            : kpi.status === 'bad'
                            ? (isDark ? 'text-rose-400' : 'text-rose-600')
                            : (isDark ? 'text-slate-200' : 'text-slate-800')
                        }`}>
                          {kpi.value}
                        </span>
                        <span className={`text-[9px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          T: {kpi.target}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Footer */}
              <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] ${
                isDark ? 'border-slate-800/60 text-slate-500' : 'border-slate-100 text-slate-500'
              }`}>
                <span className="flex items-center gap-1 font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {isMultiDay ? `${periodTag} Calculated` : 'Live Connected'}
                </span>
                <span className="font-mono text-[10px] font-semibold text-sky-400">
                  SLTL Operations
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
