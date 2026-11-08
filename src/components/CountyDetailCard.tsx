import React, { useState } from 'react';
import { CountyHealthData } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  MinusCircle,
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  Lightbulb,
  Sparkles
} from 'lucide-react';

interface CountyDetailCardProps {
  county: CountyHealthData;
  selectedYear: string;
  onOpenReportModal?: () => void;
}

export const CountyDetailCard: React.FC<CountyDetailCardProps> = ({ county, selectedYear }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [expandedLeadIndices, setExpandedLeadIndices] = useState<Set<number>>(new Set());

  const toggleLeadDetail = (index: number) => {
    setExpandedLeadIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const isOnTrack = county.status === 'on-track';
  const isLagging = county.status === 'lagging';
  const isDataIncomplete = county.status === 'data-incomplete' || county.status === 'data_incomplete';
  const isPartial = county.status === 'partial';

  // Check detailed fields
  const hasHealthHistory = county.health != null && Object.keys(county.health).length > 0;
  const hasOSR = county.osr != null && Object.keys(county.osr).length > 0;
  const hasFIF = county.fif != null && Object.keys(county.fif).length > 0;
  const hasSHIF = county.shif != null && Object.keys(county.shif).length > 0;
  const hasPHC = county.phc != null && Object.keys(county.phc).length > 0;
  const hasFlags = county.dataFlags != null && county.dataFlags.length > 0;
  const hasAnyDetails = hasHealthHistory || hasOSR || hasFIF || hasSHIF || hasPHC || hasFlags || county.capital || county.population;

  // Up to 3 leads
  const leads = county.leads ? county.leads.slice(0, 3) : [];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 text-neutral-200 space-y-5">
      {/* County Name and Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">
            {county.name} County
          </h2>
          <span className="text-[13px] text-neutral-400">
            County health budget · {selectedYear}
          </span>
        </div>

        {/* Status Badge: on-track (green), lagging (red), data-incomplete (amber), partial (grey) */}
        {isOnTrack && (
          <span className="px-3 py-1 rounded-md text-[13px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> On track
          </span>
        )}
        {isLagging && (
          <span className="px-3 py-1 rounded-md text-[13px] font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/40 inline-flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Lagging
          </span>
        )}
        {isDataIncomplete && (
          <span className="px-3 py-1 rounded-md text-[13px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/40 inline-flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Data incomplete
          </span>
        )}
        {isPartial && (
          <span className="px-3 py-1 rounded-md text-[13px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-600 inline-flex items-center gap-1.5">
            <MinusCircle className="w-4 h-4" /> Partial
          </span>
        )}
      </div>

      {/* Fiscal Numbers: Approved, Spent, Absorption */}
      {/* Requirement 1 & 4:
          For data-incomplete counties: show reportedActualNote instead of numbers.
          For partial (e.g. FY2025/26): show approved budget only.
          If a value is null: show a dash ("-"). */}
      {isDataIncomplete ? (
        <div className="bg-neutral-950 border border-amber-800/40 rounded-lg p-4 space-y-2">
          <div className="text-[13px] font-semibold text-amber-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Reporting Discrepancy Note</span>
          </div>
          <p className="text-[13px] text-neutral-200 leading-relaxed font-medium">
            {county.reportedActualNote || 'Data incomplete: Spending actuals not reported or implausible.'}
          </p>
          <div className="pt-2 border-t border-neutral-800/80 text-[13px] text-neutral-400 flex items-center justify-between">
            <span>Approved budget:</span>
            <span className="font-semibold text-neutral-200">
              {county.promisedBudgetKES != null ? `KES ${Number(county.promisedBudgetKES).toLocaleString()}M` : '-'}
            </span>
          </div>
        </div>
      ) : isPartial ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5">
            <div className="text-[13px] text-neutral-400 font-medium">Approved</div>
            <div className="text-lg sm:text-xl font-bold text-neutral-100 mt-1">
              {county.promisedBudgetKES != null ? `KES ${Number(county.promisedBudgetKES).toLocaleString()}M` : '-'}
            </div>
            <div className="text-[13px] text-neutral-400 mt-0.5">County health budget</div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5">
            <div className="text-[13px] text-neutral-400 font-medium">Spent</div>
            <div className="text-lg sm:text-xl font-bold text-neutral-400 mt-1">
              -
            </div>
            <div className="text-[13px] text-neutral-400 mt-0.5">Approved budget only</div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5">
            <div className="text-[13px] text-neutral-400 font-medium">Absorption</div>
            <div className="text-lg sm:text-xl font-bold text-neutral-400 mt-1">
              -
            </div>
            <div className="text-[13px] text-neutral-400 mt-0.5">Partial financial year</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5">
            <div className="text-[13px] text-neutral-400 font-medium">Approved</div>
            <div className="text-lg sm:text-xl font-bold text-neutral-100 mt-1">
              {county.promisedBudgetKES != null ? `KES ${Number(county.promisedBudgetKES).toLocaleString()}M` : '-'}
            </div>
            <div className="text-[13px] text-neutral-400 mt-0.5">County health budget</div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5">
            <div className="text-[13px] text-neutral-400 font-medium">Spent</div>
            <div className="text-lg sm:text-xl font-bold text-neutral-100 mt-1">
              {county.deliveredBudgetKES != null ? `KES ${Number(county.deliveredBudgetKES).toLocaleString()}M` : '-'}
            </div>
            <div className="text-[13px] text-neutral-400 mt-0.5">Actual expenditure</div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5">
            <div className="text-[13px] text-neutral-400 font-medium">Absorption</div>
            <div className={`text-lg sm:text-xl font-bold mt-1 ${
              isOnTrack
                ? 'text-emerald-400'
                : isDataIncomplete
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}>
              {county.absorptionRate != null ? `${county.absorptionRate.toFixed(1)}%` : '-'}
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  isOnTrack
                    ? 'bg-emerald-500'
                    : isDataIncomplete
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(county.absorptionRate || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Headline for the year */}
      {county.editorHeadline && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5">
          <p className="text-[13px] sm:text-sm text-neutral-200 font-medium leading-relaxed">
            {county.editorHeadline}
          </p>
        </div>
      )}

      {/* Requirement 2: Possible story leads
          Each lead: headline, a "Detail" line (under a "More" button), then "Possible angle:" followed by the statement.
          Combined leads (type "combined"): tag them "Budget + Mini DHS survey".
          Under every leads section, show disclaimer. */}
      {leads.length > 0 && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-3.5">
          <div className="text-[13px] font-semibold text-neutral-300 flex items-center gap-1.5 border-b border-neutral-800 pb-2">
            <Lightbulb className="w-4 h-4 text-neutral-400" />
            <span>Possible story leads</span>
          </div>

          <div className="space-y-3">
            {leads.map((lead, idx) => {
              const isLeadExpanded = expandedLeadIndices.has(idx);
              const isCombined = lead.type === 'combined';
              const angleText = lead.angle || lead.question || '';

              return (
                <div
                  key={idx}
                  className="bg-neutral-900 border border-neutral-800/90 rounded-lg p-3 space-y-2 text-[13px]"
                >
                  {/* Lead Tag (for combined leads) */}
                  {isCombined && (
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded text-[13px] font-semibold bg-neutral-950 text-neutral-300 border border-neutral-700 inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-neutral-400" />
                        Budget + Mini DHS survey
                      </span>
                    </div>
                  )}

                  {/* Headline */}
                  <h4 className="font-bold text-neutral-100 text-[13px] leading-snug">
                    {lead.headline}
                  </h4>

                  {/* Detail line under a "More" button */}
                  {lead.detail && (
                    <div className="pt-0.5">
                      <button
                        onClick={() => toggleLeadDetail(idx)}
                        className="text-[13px] text-neutral-400 hover:text-neutral-200 font-medium underline flex items-center gap-1 transition"
                      >
                        <span>{isLeadExpanded ? 'Less' : 'More'}</span>
                        {isLeadExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {isLeadExpanded && (
                        <p className="mt-2 text-neutral-300 bg-neutral-950 p-2.5 rounded border border-neutral-800 leading-relaxed">
                          <strong className="text-neutral-400 font-semibold block text-[13px] mb-0.5">Detail:</strong>
                          {lead.detail}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Possible angle: statement (not a question) */}
                  {angleText && (
                    <div className="pt-1 border-t border-neutral-800/60 text-[13px]">
                      <span className="text-neutral-400 font-semibold">Possible angle: </span>
                      <span className="text-neutral-200 leading-relaxed">
                        {angleText}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mandatory AI disclaimer under every leads section */}
          <div className="pt-2 border-t border-neutral-800 text-[13px] text-neutral-400 leading-relaxed italic">
            AI-assisted story leads can contain mistakes. They are prompts for reporting, not findings. Verify every figure against the source documents and with officials before publishing.
          </div>
        </div>
      )}

      {/* Detailed fields behind More details button: OSR, FIF, SHIF, PHC and data-quality flags */}
      {hasAnyDetails && (
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 text-[13px] font-medium transition flex items-center justify-center gap-1.5"
          >
            <span>{showDetails ? 'Hide details' : 'More details'}</span>
            {showDetails ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </button>

          {showDetails && (
            <div className="mt-4 space-y-4 pt-4 border-t border-neutral-800">
              {/* Profile */}
              {(county.capital || county.population || county.region) && (
                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 space-y-2">
                  <div className="text-[13px] font-semibold text-neutral-300">County Profile</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[13px]">
                    {county.region && (
                      <div>
                        <span className="text-neutral-400 block">Region:</span>
                        <span className="text-neutral-200 font-medium">{county.region}</span>
                      </div>
                    )}
                    {county.capital && (
                      <div>
                        <span className="text-neutral-400 block">Capital:</span>
                        <span className="text-neutral-200 font-medium">{county.capital}</span>
                      </div>
                    )}
                    {county.population && (
                      <div>
                        <span className="text-neutral-400 block">Population:</span>
                        <span className="text-neutral-200 font-medium">{county.population}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Health spending history */}
              {hasHealthHistory && (
                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 space-y-2.5">
                  <div className="text-[13px] font-semibold text-neutral-300">
                    Health Budget History (Recurrent vs Development)
                  </div>
                  <div className="space-y-2">
                    {Object.entries(county.health || {}).map(([fy, data]) => {
                      const estM = data.q4_revised_estimate ? (data.q4_revised_estimate / 1e6).toFixed(0) : '-';
                      const actM = data.q4_actual ? (data.q4_actual / 1e6).toFixed(0) : '-';
                      const absPct = data.absorption != null ? (data.absorption * 100).toFixed(1) + '%' : '-';
                      const recM = data.recurrent_actual ? (data.recurrent_actual / 1e6).toFixed(0) : '-';
                      const devM = data.development_actual ? (data.development_actual / 1e6).toFixed(0) : '-';

                      return (
                        <div key={fy} className="bg-neutral-900 border border-neutral-800 rounded p-2.5 text-[13px] space-y-1.5">
                          <div className="flex items-center justify-between font-medium">
                            <span className="text-neutral-200">{fy}</span>
                            <span className="text-neutral-400">
                              Absorption: <strong className="text-neutral-100">{absPct}</strong>
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[13px] text-neutral-300">
                            <div>
                              <span className="text-neutral-400 block">Approved:</span>
                              {estM !== '-' ? `KES ${estM}M` : '-'}
                            </div>
                            <div>
                              <span className="text-neutral-400 block">Spent:</span>
                              {actM !== '-' ? `KES ${actM}M` : '-'}
                            </div>
                            <div>
                              <span className="text-neutral-400 block">Recurrent:</span>
                              {recM !== '-' ? `KES ${recM}M` : '-'}
                            </div>
                            <div>
                              <span className="text-neutral-400 block">Development:</span>
                              {devM !== '-' ? `KES ${devM}M` : '-'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* OSR & FIF */}
              {(hasOSR || hasFIF) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hasOSR && (
                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 space-y-1.5">
                      <div className="text-[13px] font-semibold text-neutral-300">
                        Own Source Revenue (OSR)
                      </div>
                      <div className="space-y-1 text-[13px]">
                        {Object.entries(county.osr || {}).map(([fy, val]) => (
                          <div key={fy} className="flex items-center justify-between text-neutral-300">
                            <span className="text-neutral-400">{fy}:</span>
                            <span>
                              Target {val.target ? `KES ${(val.target / 1e6).toFixed(0)}M` : '-'} / Actual {val.actual ? `KES ${(val.actual / 1e6).toFixed(0)}M` : '-'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasFIF && (
                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 space-y-1.5">
                      <div className="text-[13px] font-semibold text-neutral-300">
                        Facility Improvement Fund (FIF)
                      </div>
                      <div className="space-y-1 text-[13px]">
                        {Object.entries(county.fif || {}).map(([fy, val]) => (
                          <div key={fy} className="flex items-center justify-between text-neutral-300">
                            <span className="text-neutral-400">{fy}:</span>
                            <span>
                              Target {val.target ? `KES ${(val.target / 1e6).toFixed(0)}M` : '-'} / Actual {val.actual ? `KES ${(val.actual / 1e6).toFixed(0)}M` : '-'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SHIF & PHC */}
              {(hasSHIF || hasPHC) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hasSHIF && (
                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 space-y-1.5">
                      <div className="text-[13px] font-semibold text-neutral-300">
                        Social Health Insurance Fund (SHIF)
                      </div>
                      <div className="space-y-1 text-[13px] text-neutral-300">
                        {county.shif?.gok_total_jul25_apr26 != null && (
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">GoK Allocation:</span>
                            <span>KES {(county.shif.gok_total_jul25_apr26 / 1e6).toFixed(1)}M</span>
                          </div>
                        )}
                        {county.shif?.private_total_jul25_apr26 != null && (
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">Private Providers:</span>
                            <span>KES {(county.shif.private_total_jul25_apr26 / 1e6).toFixed(1)}M</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {hasPHC && (
                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 space-y-1.5">
                      <div className="text-[13px] font-semibold text-neutral-300">
                        Primary Health Care (PHC)
                      </div>
                      <div className="space-y-1 text-[13px] text-neutral-300">
                        {county.phc?.level2 != null && (
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">Level 2 Dispensaries:</span>
                            <span>KES {(county.phc.level2 / 1e6).toFixed(1)}M</span>
                          </div>
                        )}
                        {county.phc?.level3 != null && (
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">Level 3 Health Centres:</span>
                            <span>KES {(county.phc.level3 / 1e6).toFixed(1)}M</span>
                          </div>
                        )}
                        {county.phc?.level4 != null && (
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">Level 4 Hospitals:</span>
                            <span>KES {(county.phc.level4 / 1e6).toFixed(1)}M</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Data Flags */}
              {hasFlags && (
                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 space-y-2">
                  <div className="text-[13px] font-semibold text-neutral-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-neutral-400" />
                    <span>Audit and Data-Quality Flags</span>
                  </div>
                  <div className="space-y-2">
                    {county.dataFlags?.map((flag, idx) => (
                      <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded p-2.5 text-[13px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-200">{flag.flag}</span>
                          <span className="text-neutral-400 text-[13px]">
                            {flag.severity} · {flag.fy}
                          </span>
                        </div>
                        <p className="text-neutral-300 leading-relaxed">{flag.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
