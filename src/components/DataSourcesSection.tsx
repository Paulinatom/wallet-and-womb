import React from 'react';
import { FileText, Database, Shield, AlertCircle, Info, Sparkles } from 'lucide-react';

export const DataSourcesSection: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto text-neutral-200">
      {/* Overview Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800">
          <Database className="w-5 h-5 text-neutral-400" />
          <h2 className="text-lg sm:text-xl font-bold text-neutral-100">
            Data Architecture & Sources
          </h2>
        </div>

        <p className="text-[13px] sm:text-sm text-neutral-300 leading-relaxed">
          The Wallet & Womb accountability dashboard provides journalists and editors with factual financial records tracking county health budgets across 26 priority counties in Kenya. All financial figures are drawn directly from official publications by the Office of the Controller of Budget (OCOB), alongside clinical service coverage baselines from the Kenya Mini Demographic and Health Survey (Mini DHS 2025-26).
        </p>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-neutral-200">
            <Info className="w-4 h-4 text-neutral-400" />
            <span>Scope & Attribution Notice</span>
          </div>
          <p className="text-[13px] text-neutral-400 leading-relaxed">
            Financial figures represent total <strong>County health budgets</strong> (recurrent operational expenses plus development projects), and do not isolate maternal-specific spending, as county assemblies budget health at the departmental and program level.
          </p>
        </div>
      </div>

      {/* Primary Data Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source 1: OCOB */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-neutral-100 font-semibold text-base">
            <FileText className="w-4 h-4 text-neutral-400" />
            <h3>Controller of Budget Reports</h3>
          </div>
          <p className="text-[13px] text-neutral-300 leading-relaxed">
            County Budget Implementation Review Reports published by the Office of the Controller of Budget:
          </p>
          <ul className="list-disc list-inside text-[13px] text-neutral-400 space-y-1 pl-1">
            <li>FY 2022/23, FY 2023/24, FY 2024/25, and FY 2025/26 review schedules</li>
            <li>Departmental health allocations (Approved Estimates)</li>
            <li>Actual expenditures (Disbursed & Expended)</li>
            <li>Recurrent vs. Development expenditure breakdown</li>
            <li>Own Source Revenue (OSR) and Facility Improvement Fund (FIF) targets & actuals</li>
          </ul>
        </div>

        {/* Source 2: Mini DHS 2025-26 */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-neutral-100 font-semibold text-base">
            <Sparkles className="w-4 h-4 text-neutral-400" />
            <h3>Kenya Mini DHS 2025-26</h3>
          </div>
          <p className="text-[13px] text-neutral-300 leading-relaxed">
            Official baseline survey estimates from the Kenya National Bureau of Statistics (KNBS) and Ministry of Health:
          </p>
          <ul className="list-disc list-inside text-[13px] text-neutral-400 space-y-1 pl-1">
            <li>Births in a health facility: National benchmark 91.1%</li>
            <li>Births with a skilled provider: National benchmark 91.9%</li>
            <li>Women with 4+ antenatal visits: National benchmark 72.4%</li>
            <li>National Maternal Mortality Ratio: 263 per 100,000 live births (CI 121 to 405)</li>
            <li>County-level MMR is not published by the survey and is never shown by county</li>
          </ul>
        </div>
      </div>

      {/* Status Classification Criteria */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-neutral-100 font-semibold text-base pb-2 border-b border-neutral-800">
          <Shield className="w-4 h-4 text-neutral-400" />
          <h3>Budget Status Classification Criteria</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
          <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
            <div>
              <span className="text-emerald-400 font-semibold block">On track (Green)</span>
              <span className="text-neutral-400">Health budget absorption rate is 80% or higher.</span>
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0" />
            <div>
              <span className="text-rose-400 font-semibold block">Lagging (Red)</span>
              <span className="text-neutral-400">Health budget absorption rate is below 80%.</span>
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0" />
            <div>
              <span className="text-amber-400 font-semibold block">Data incomplete (Amber)</span>
              <span className="text-neutral-400">Actual spending missing or under 20% of estimate; note shown instead of numbers.</span>
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 mt-1 shrink-0" />
            <div>
              <span className="text-neutral-300 font-semibold block">Partial (Grey)</span>
              <span className="text-neutral-400">Current fiscal year in progress (FY2025/26); approved budget shown only.</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Story Leads Disclaimer */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-neutral-200 font-semibold text-[13px]">
          <AlertCircle className="w-4 h-4 text-neutral-400" />
          <span>Verification Requirement for Journalists</span>
        </div>
        <p className="text-[13px] text-neutral-400 leading-relaxed italic">
          AI-assisted story leads can contain mistakes. They are prompts for reporting, not findings. Verify every figure against the source documents and with officials before publishing.
        </p>
      </div>
    </div>
  );
};
