import React, { useState } from 'react';
import { YearSummaryLead } from '../types';
import { 
  Newspaper, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Tag
} from 'lucide-react';

interface StoryBoardSectionProps {
  topLeads: YearSummaryLead[];
  selectedYear: string;
  onSelectCountyByName: (countyName: string) => void;
  onNavigateToMap: () => void;
}

export const StoryBoardSection: React.FC<StoryBoardSectionProps> = ({
  topLeads,
  selectedYear,
  onSelectCountyByName,
  onNavigateToMap,
}) => {
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());

  const toggleDetail = (index: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleFocusCounty = (countyName: string) => {
    onSelectCountyByName(countyName);
    onNavigateToMap();
  };

  const formatLeadType = (type: string) => {
    switch (type) {
      case 'combined':
        return 'Budget + Mini DHS survey';
      case 'underspend':
        return 'Budget Underspend';
      case 'data-gap':
        return 'Data Discrepancy';
      case 'shif':
        return 'SHIF Claims Flow';
      case 'phc':
        return 'Primary Healthcare Fund';
      case 'development':
        return 'Capital Spending Delay';
      case 'development-zero':
        return 'Zero Development Spending';
      case 'revenue':
        return 'Revenue Shortfall';
      case 'fif':
        return 'FIF Undercollection';
      default:
        return type.toUpperCase();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-neutral-400" />
            <h2 className="text-lg sm:text-xl font-bold text-neutral-100">
              Story Board · Top Leads ({selectedYear})
            </h2>
          </div>
          <p className="text-[13px] text-neutral-400 mt-1">
            Priority investigative reporting leads curated from Controller of Budget reports and Mini DHS survey data.
          </p>
        </div>

        <div className="text-[13px] text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
          <span>{topLeads.length} priority leads identified</span>
        </div>
      </div>

      {/* Top Leads Grid */}
      {topLeads.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-[13px] text-neutral-400">
          No top leads catalogued for {selectedYear}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topLeads.map((lead, idx) => {
            const isExpanded = expandedIndices.has(idx);
            const isCombined = lead.type === 'combined';
            const angleText = lead.angle || lead.question || '';

            return (
              <div
                key={idx}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-neutral-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* County Name and Type Badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
                    <span className="font-bold text-neutral-100 text-[15px] flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-neutral-400" />
                      {lead.county} County
                    </span>

                    <span className={`px-2.5 py-0.5 rounded text-[13px] font-semibold border flex items-center gap-1 ${
                      isCombined
                        ? 'bg-neutral-950 text-neutral-200 border-neutral-600'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-700'
                    }`}>
                      {isCombined ? (
                        <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                      ) : (
                        <Tag className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                      {formatLeadType(lead.type)}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-bold text-neutral-100 text-[14px] leading-snug">
                    {lead.headline}
                  </h3>

                  {/* Detail line under More button */}
                  {lead.detail && (
                    <div className="pt-0.5">
                      <button
                        onClick={() => toggleDetail(idx)}
                        className="text-[13px] text-neutral-400 hover:text-neutral-200 font-medium underline flex items-center gap-1 transition"
                      >
                        <span>{isExpanded ? 'Less' : 'More'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {isExpanded && (
                        <p className="mt-2 text-neutral-300 bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-[13px] leading-relaxed">
                          <strong className="text-neutral-400 font-semibold block text-[13px] mb-0.5">Detail:</strong>
                          {lead.detail}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Possible angle: statement (not a question) */}
                  {angleText && (
                    <div className="bg-neutral-950 border border-neutral-800/90 rounded-lg p-3 text-[13px]">
                      <span className="text-neutral-400 font-semibold">Possible angle: </span>
                      <span className="text-neutral-200 leading-relaxed">
                        {angleText}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Action: Focus on Map */}
                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[13px] text-neutral-400 font-medium">
                    Financial Year: {selectedYear}
                  </span>

                  <button
                    onClick={() => handleFocusCounty(lead.county)}
                    className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 text-[13px] font-medium transition flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>View on Map</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mandatory AI disclaimer under every leads section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-[13px] text-neutral-400 leading-relaxed italic text-center">
        AI-assisted story leads can contain mistakes. They are prompts for reporting, not findings. Verify every figure against the source documents and with officials before publishing.
      </div>
    </div>
  );
};
