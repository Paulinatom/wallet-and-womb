import React from 'react';
import { CountyHealthData, YearSummaryItem } from '../types';
import { ChevronDown, Send, Info } from 'lucide-react';

interface HeaderProps {
  counties: CountyHealthData[];
  selectedCounty: CountyHealthData;
  onSelectCounty: (county: CountyHealthData) => void;
  onOpenReportModal: () => void;
  selectedYear: string;
  onSelectYear: (year: string) => void;
  availableYears: string[];
  yearSummary: YearSummaryItem;
}

export const Header: React.FC<HeaderProps> = ({
  counties,
  selectedCounty,
  onSelectCounty,
  onOpenReportModal,
  selectedYear,
  onSelectYear,
  availableYears,
  yearSummary,
}) => {
  const counts = yearSummary?.counts || {
    'on-track': counties.filter((c) => c.status === 'on-track').length,
    lagging: counties.filter((c) => c.status === 'lagging').length,
    'data-incomplete': counties.filter(
      (c) => c.status === 'data-incomplete' || c.status === 'data_incomplete'
    ).length,
    partial: counties.filter((c) => c.status === 'partial').length,
  };

  const showReliabilityBanner = yearSummary && yearSummary.reliability !== 'good';

  return (
    <header className="sticky top-0 z-40 bg-neutral-950 border-b border-neutral-800">
      {/* Main Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Brand Title & Single Status Line */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h1 className="text-lg font-bold text-neutral-100 tracking-tight">
            Wallet & Womb
          </h1>
          <span className="hidden sm:inline text-neutral-600">|</span>
          {/* Exactly one status count line on the page */}
          <div className="text-[13px] text-neutral-400 font-medium flex flex-wrap items-center">
            <span className="text-emerald-400 font-semibold">{counts['on-track']} on track</span>
            <span className="mx-1.5 text-neutral-600">·</span>
            <span className="text-rose-400 font-semibold">{counts.lagging} lagging</span>
            <span className="mx-1.5 text-neutral-600">·</span>
            <span className="text-amber-400 font-semibold">{counts['data-incomplete']} data incomplete</span>
            {counts.partial > 0 && (
              <>
                <span className="mx-1.5 text-neutral-600">·</span>
                <span className="text-neutral-400 font-semibold">{counts.partial} partial</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Financial Year selector, County selector, and Tip Drop button */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Financial Year Dropdown */}
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-[13px]">
            <span className="text-neutral-400 font-medium">FY:</span>
            <div className="relative">
              <select
                id="financial-year-select"
                value={selectedYear}
                onChange={(e) => onSelectYear(e.target.value)}
                className="bg-transparent text-neutral-100 font-bold focus:outline-none cursor-pointer pr-5 appearance-none"
                aria-label="Select Financial Year"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr} className="bg-neutral-900 text-neutral-100">
                    {yr}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-0 top-1 pointer-events-none" />
            </div>
          </div>

          {/* County Selector */}
          <div className="relative">
            <select
              id="header-county-select"
              value={selectedCounty?.id || ''}
              onChange={(e) => {
                const found = counties.find((c) => c.id === e.target.value);
                if (found) onSelectCounty(found);
              }}
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-[13px] text-neutral-200 font-medium focus:outline-none focus:border-neutral-500 cursor-pointer pr-8 appearance-none"
              aria-label="Select county"
            >
              {counties.map((c) => {
                let statusDot = '🟢';
                if (c.status === 'lagging') statusDot = '🔴';
                else if (c.status === 'data-incomplete' || c.status === 'data_incomplete') statusDot = '🟡';
                else if (c.status === 'partial') statusDot = '⚪';

                return (
                  <option key={c.id} value={c.id} className="bg-neutral-900 text-neutral-200">
                    {c.name} ({statusDot})
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Small Tip Drop Button */}
          <button
            id="open-tip-drop-btn"
            onClick={onOpenReportModal}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-[13px] font-medium transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-neutral-300" />
            <span>Tip Drop</span>
          </button>
        </div>
      </div>

      {/* Requirement 4: Show the year's 'note' in a small banner under the dropdown when reliability is not 'good' */}
      {showReliabilityBanner && (
        <div className="bg-neutral-900/90 border-t border-neutral-800 px-4 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-[13px] text-neutral-300">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-neutral-200">{selectedYear} note:</strong> {yearSummary.note}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
