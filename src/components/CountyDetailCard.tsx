import React, { useState } from 'react';
import { CountyHealthData } from '../types';
import { formatKES } from '../utils/formatters';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Building2, 
  Users, 
  HeartPulse, 
  Stethoscope, 
  Baby, 
  Share2, 
  Copy, 
  Check, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface CountyDetailCardProps {
  county: CountyHealthData;
  onOpenReportModal: () => void;
}

export const CountyDetailCard: React.FC<CountyDetailCardProps> = ({
  county,
  onOpenReportModal,
}) => {
  const [copied, setCopied] = useState(false);
  const gap = county.promisedBudgetKES - county.deliveredBudgetKES;

  const handleCopyQuote = () => {
    const text = `"${county.investigativeAngle}" - Source: Controller of Budget & Wallet & Womb audit records for ${county.name} County. Government Promised: ${formatKES(county.promisedBudgetKES)}, Actual Spending: ${formatKES(county.deliveredBudgetKES)} (${county.absorptionRate.toFixed(1)}%). MMR: ${county.indicators.mmr}/100k births.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="county-detail-card" className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:p-6 shadow-2xl space-y-5">
      {/* Top Identity Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center font-mono">
            <span className="text-[10px] text-slate-400">CODE</span>
            <span className="text-base font-bold text-white">#{String(county.code).padStart(2, '0')}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">
                {county.name} County
              </h2>
              {/* Green status badge for on track, red for lagging */}
              {county.status === 'on-track' ? (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 inline-flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ON TRACK
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-950/90 text-rose-400 border border-rose-500/40 inline-flex items-center gap-1.5 shadow-sm">
                  <AlertTriangle className="w-3.5 h-3.5" /> LAGGING BEHIND
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span>Region: <strong className="text-slate-200">{county.region}</strong></span>
              <span>•</span>
              <span>Capital: <strong className="text-slate-200">{county.capital}</strong></span>
              <span>•</span>
              <span>Population: <strong className="text-slate-200">{county.population}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyQuote}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Quote'}</span>
          </button>
          <button
            onClick={onOpenReportModal}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>File Field Tip</span>
          </button>
        </div>
      </div>

      {/* Editorial Headline & Status Alert Box */}
      <div className={`p-4 rounded-xl border ${
        county.status === 'on-track'
          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
          : 'bg-rose-950/20 border-rose-800/40 text-rose-300'
      }`}>
        <div className="text-[11px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
          {county.status === 'on-track' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>Editor's Summary Angle:</span>
        </div>
        <p className="text-sm font-semibold text-white leading-relaxed">
          "{county.editorHeadline}"
        </p>
        <p className="text-xs text-slate-300 mt-1">
          {county.statusReason}
        </p>
      </div>

      {/* Financial Comparison Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Promised */}
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Promised Allocation</div>
          <div className="text-lg font-bold text-blue-400 mt-0.5 font-mono">{formatKES(county.promisedBudgetKES)}</div>
          <div className="text-[10px] text-slate-400">Budgeted by County Assembly</div>
        </div>

        {/* Delivered */}
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Delivered Spending</div>
          <div className="text-lg font-bold text-cyan-400 mt-0.5 font-mono">{formatKES(county.deliveredBudgetKES)}</div>
          <div className="text-[10px] text-slate-400">Actual Healthcare Projects</div>
        </div>

        {/* Absorption Rate */}
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Absorption Rate</div>
          <div className={`text-lg font-bold mt-0.5 font-mono ${county.absorptionRate >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {county.absorptionRate.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${county.absorptionRate >= 80 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${Math.min(county.absorptionRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Deficit / Gap */}
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Spending Deficit</div>
          <div className="text-lg font-bold text-rose-400 mt-0.5 font-mono">{gap > 0 ? formatKES(gap) : 'KES 0M'}</div>
          <div className="text-[10px] text-slate-400">
            {gap > 0 ? 'Unspent / Stalled funds' : 'Fully utilized'}
          </div>
        </div>
      </div>

      {/* Health Outcome Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-600/30 text-rose-400">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Maternal Mortality</div>
            <div className="text-sm font-bold text-white font-mono">{county.indicators.mmr} <span className="text-[10px] text-slate-400 font-normal">/100k</span></div>
          </div>
        </div>

        <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-600/30 text-blue-400">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Skilled Delivery</div>
            <div className="text-sm font-bold text-white font-mono">{county.indicators.skilledBirthAttendance}%</div>
          </div>
        </div>

        <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-600/30 text-emerald-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">4+ ANC Visits</div>
            <div className="text-sm font-bold text-white font-mono">{county.indicators.anc4Visits}%</div>
          </div>
        </div>

        <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-600/30 text-purple-400">
            <Baby className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Neonatal Survival</div>
            <div className="text-sm font-bold text-white font-mono">{county.indicators.neonatalMortality} <span className="text-[10px] text-slate-400 font-normal">/1k</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
