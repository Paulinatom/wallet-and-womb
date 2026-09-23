import React from 'react';
import { CountyHealthData } from '../types';
import { 
  ShieldCheck, 
  Download, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  HeartHandshake, 
  Radio, 
  Search,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  counties: CountyHealthData[];
  selectedCounty: CountyHealthData;
  onSelectCounty: (county: CountyHealthData) => void;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  counties,
  selectedCounty,
  onSelectCounty,
  onOpenReportModal,
}) => {
  const onTrackCount = counties.filter((c) => c.status === 'on-track').length;
  const laggingCount = counties.filter((c) => c.status === 'lagging').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-rose-600 p-0.5 shadow-lg shadow-blue-900/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-rose-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Wallet & Womb
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/50 uppercase tracking-widest">
                  Kenya
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Maternal & Newborn Health Spending Accountability Across 26 Kenyan Counties
            </p>
          </div>
        </div>

        {/* Status Budges & Primary Actions */}
        <div className="flex items-center flex-wrap gap-2 lg:gap-3">
          {/* Green Status Badge */}
          <div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{onTrackCount} On Track</span>
          </div>

          {/* Red Status Badge */}
          <div className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{laggingCount} Lagging Behind</span>
          </div>

          {/* County Quick Selector Dropdown */}
          <div className="relative">
            <select
              id="header-county-select"
              value={selectedCounty.id}
              onChange={(e) => {
                const found = counties.find((c) => c.id === e.target.value);
                if (found) onSelectCounty(found);
              }}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer pr-7 appearance-none"
              aria-label="Select one of 26 Kenyan counties"
            >
              {counties.map((c) => (
                <option key={c.id} value={c.id}>
                  #{String(c.code).padStart(2, '0')} {c.name} ({c.status === 'on-track' ? '🟢 On Track' : '🔴 Lagging'})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Secure Tip Drop Button */}
          <button
            id="open-secure-tip-drop-btn"
            onClick={onOpenReportModal}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/50"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Tip Drop</span>
          </button>
        </div>
      </div>
    </header>
  );
};
