import React, { useState } from 'react';
import { CountyHealthData } from '../types';
import { 
  Radio, 
  AlertCircle, 
  Info, 
  ChevronDown, 
  FileText,
  Activity,
  ArrowRight
} from 'lucide-react';

interface LiveSurveillanceEweneSectionProps {
  counties: CountyHealthData[];
  selectedCounty: CountyHealthData;
  onSelectCounty: (county: CountyHealthData) => void;
  selectedYear: string;
}

export const LiveSurveillanceEweneSection: React.FC<LiveSurveillanceEweneSectionProps> = ({
  counties,
  selectedCounty,
  onSelectCounty,
  selectedYear,
}) => {
  const [templateCounty, setTemplateCounty] = useState<string>(selectedCounty?.name || 'Garissa');

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-neutral-200">
      {/* Requirement 5: Prototype Banner */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 sm:p-5 flex items-start gap-3 shadow-md">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-bold text-neutral-100 text-sm sm:text-base flex items-center gap-2">
            <span>Prototype: pipeline 1 data is not connected yet. No figures on this tab are real.</span>
          </h3>
          <p className="text-[13px] text-neutral-400">
            This module represents the architectural interface for automated maternal and newborn death surveillance feeds (ewene.go.ke/rri).
          </p>
        </div>
      </div>

      {/* Requirement 5: "How it will work" card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-neutral-400" />
          <h2 className="text-base sm:text-lg font-bold text-neutral-100">
            How it will work
          </h2>
        </div>
        <p className="text-[13px] sm:text-sm text-neutral-300 leading-relaxed">
          When connected, this panel will show a county's reported maternal and newborn deaths for the latest month beside its budget absorption, to point journalists to stories.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[13px]">
          <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg">
            <span className="text-neutral-400 block font-medium">1. Surveillance Intake</span>
            <p className="text-neutral-300 mt-1">
              Automated ingestion of daily county death counts from ewene.go.ke/rri.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg">
            <span className="text-neutral-400 block font-medium">2. Budget Correlation</span>
            <p className="text-neutral-300 mt-1">
              Cross-referencing mortality spikes against delayed capital and recurrent health disbursements.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg">
            <span className="text-neutral-400 block font-medium">3. Editorial Triggers</span>
            <p className="text-neutral-300 mt-1">
              Prompting journalists with verified document requests and official inquiries.
            </p>
          </div>
        </div>
      </div>

      {/* Active County Empty State View */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-neutral-400" />
              <h3 className="text-lg font-bold text-neutral-100">
                County Surveillance Feed Status
              </h3>
            </div>
            <p className="text-[13px] text-neutral-400 mt-0.5">
              Live feed monitoring across Kenya's 26 priority counties
            </p>
          </div>

          {/* County Selector */}
          <div className="relative">
            <select
              value={selectedCounty?.id || ''}
              onChange={(e) => {
                const found = counties.find((c) => c.id === e.target.value);
                if (found) {
                  onSelectCounty(found);
                  setTemplateCounty(found.name);
                }
              }}
              className="bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-[13px] text-neutral-200 font-medium focus:outline-none focus:border-neutral-500 cursor-pointer pr-8 appearance-none"
              aria-label="Select County for Surveillance"
            >
              {counties.map((c) => (
                <option key={c.id} value={c.id} className="bg-neutral-900 text-neutral-200">
                  {c.name} County
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Empty States: a dash ("-") and "waiting for pipeline 1", no sample numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
            <div className="text-[13px] text-neutral-400 font-medium">Maternal Deaths (Latest Month)</div>
            <div className="text-2xl font-bold text-neutral-400 mt-1">-</div>
            <div className="text-[13px] text-neutral-500 mt-1">waiting for pipeline 1</div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
            <div className="text-[13px] text-neutral-400 font-medium">Newborn Deaths (Latest Month)</div>
            <div className="text-2xl font-bold text-neutral-400 mt-1">-</div>
            <div className="text-[13px] text-neutral-500 mt-1">waiting for pipeline 1</div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
            <div className="text-[13px] text-neutral-400 font-medium">Health Budget Absorption ({selectedYear})</div>
            <div className="text-2xl font-bold text-neutral-200 mt-1">
              {selectedCounty.absorptionRate != null ? `${selectedCounty.absorptionRate.toFixed(1)}%` : '-'}
            </div>
            <div className="text-[13px] text-neutral-400 mt-1">
              Approved: {selectedCounty.promisedBudgetKES != null ? `KES ${Number(selectedCounty.promisedBudgetKES).toLocaleString()}M` : '-'}
            </div>
          </div>
        </div>

        {/* Daily Stream Empty State Table */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-[13px] border-b border-neutral-800/80 pb-2">
            <span className="font-semibold text-neutral-300">Daily Facility Log · {selectedCounty.name}</span>
            <span className="text-neutral-500">Pipeline Status: Disconnected</span>
          </div>

          <div className="py-8 text-center space-y-2">
            <Activity className="w-6 h-6 text-neutral-600 mx-auto animate-pulse" />
            <div className="text-lg font-bold text-neutral-400">-</div>
            <p className="text-[13px] text-neutral-400">waiting for pipeline 1</p>
          </div>
        </div>
      </div>

      {/* Requirement 5: Template example with placeholders only, labelled "Template, not real data" */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-400" />
            <h3 className="font-bold text-neutral-100 text-sm sm:text-base">
              Surveillance Correlation Wireframe
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[13px] font-semibold bg-neutral-950 text-neutral-300 border border-neutral-700">
            Template, not real data
          </span>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-4 text-[13px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded">
              <span className="text-neutral-400 block">Facility Name:</span>
              <span className="font-medium text-neutral-300">[County Referral Hospital]</span>
            </div>
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded">
              <span className="text-neutral-400 block">Maternal Mortality Alert:</span>
              <span className="font-medium text-neutral-300">[Maternal Deaths: —]</span>
            </div>
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded">
              <span className="text-neutral-400 block">Newborn Mortality Alert:</span>
              <span className="font-medium text-neutral-300">[Newborn Deaths: —]</span>
            </div>
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded">
              <span className="text-neutral-400 block">Capital Execution Rate:</span>
              <span className="font-medium text-neutral-300">[Absorption: —%]</span>
            </div>
          </div>

          <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded space-y-2">
            <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
              <span>Investigation Lead Template:</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <p className="text-neutral-400 leading-relaxed italic">
              "[County Name] reported [N] maternal deaths in [Month] while [X]% of its FY capital maternity budget remained unspent. Did procurement delays at [Referral Facility] contribute to essential equipment or blood product stockouts?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
