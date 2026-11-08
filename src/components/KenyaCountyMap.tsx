import React, { useState, useMemo } from 'react';
import { CountyHealthData, CountyStatus, MapLayerType } from '../types';
import { KENYA_ALL_GEO_PATHS } from '../data/kenyaSvgPaths';
import { COUNTIES_FINAL_DATA } from '../data/countiesData';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  MinusCircle,
  MapPin,
  Layers,
  AlertCircle
} from 'lucide-react';

interface KenyaCountyMapProps {
  counties: CountyHealthData[];
  selectedCounty: CountyHealthData | null;
  onSelectCounty: (county: CountyHealthData) => void;
  statusFilter: 'all' | 'on-track' | 'lagging' | 'data-incomplete' | 'partial';
  setStatusFilter: (filter: 'all' | 'on-track' | 'lagging' | 'data-incomplete' | 'partial') => void;
  selectedYear: string;
}

export const KenyaCountyMap: React.FC<KenyaCountyMapProps> = ({
  counties,
  selectedCounty,
  onSelectCounty,
  statusFilter,
  setStatusFilter,
  selectedYear,
}) => {
  // Requirement 3: Map Layer toggle
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('budget-status');
  const [hoveredCounty, setHoveredCounty] = useState<CountyHealthData | null>(null);
  const [hoveredNonPilot, setHoveredNonPilot] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const nationalSurvey = COUNTIES_FINAL_DATA.meta?.nationalSurvey || {
    facilityDelivery: 91.1,
    skilledBirthAttendance: 91.9,
    anc4Plus: 72.4,
  };

  // Fast map lookup for the 26 counties
  const pilotCountiesMap = useMemo(() => {
    const map = new Map<string, CountyHealthData>();
    counties.forEach((c) => map.set(c.name, c));
    return map;
  }, [counties]);

  // Non-pilot counties for authentic Kenya silhouette
  const nonPilotCounties = useMemo(() => {
    return Object.values(KENYA_ALL_GEO_PATHS).filter((g) => !pilotCountiesMap.has(g.name));
  }, [pilotCountiesMap]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.3, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.3, 0.8));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const getCountyStatusCategory = (c: CountyHealthData): CountyStatus => {
    if (c.status === 'data-incomplete' || c.status === 'data_incomplete') return 'data-incomplete';
    if (c.status === 'partial') return 'partial';
    if (c.status === 'lagging') return 'lagging';
    return 'on-track';
  };

  // Helper to determine survey layer styling
  const getSurveyLayerMetrics = (c: CountyHealthData) => {
    if (activeLayer === 'facility-delivery') {
      const val = c.survey?.facilityDelivery ?? 0;
      const benchmark = nationalSurvey.facilityDelivery;
      const isAbove = val >= benchmark;
      return {
        label: 'Births in a health facility',
        value: val,
        benchmark,
        isAbove,
        color: isAbove ? '#10b981' : '#f43f5e',
      };
    }
    if (activeLayer === 'skilled-provider') {
      const val = c.survey?.skilledBirthAttendance ?? 0;
      const benchmark = nationalSurvey.skilledBirthAttendance;
      const isAbove = val >= benchmark;
      return {
        label: 'Births with a skilled provider',
        value: val,
        benchmark,
        isAbove,
        color: isAbove ? '#10b981' : '#f43f5e',
      };
    }
    if (activeLayer === 'anc4-plus') {
      const val = c.survey?.anc4Plus ?? 0;
      const benchmark = nationalSurvey.anc4Plus;
      const isAbove = val >= benchmark;
      return {
        label: 'Women with 4+ antenatal visits',
        value: val,
        benchmark,
        isAbove,
        color: isAbove ? '#10b981' : '#f43f5e',
      };
    }
    return null;
  };

  // Check if any partial counties exist for this year
  const hasPartialCounties = useMemo(() => {
    return counties.some((c) => c.status === 'partial');
  }, [counties]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-5 flex flex-col space-y-4">
      {/* Map Header with Layer Toggle */}
      <div className="flex flex-col gap-3 pb-3 border-b border-neutral-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <h3 className="text-base font-bold text-neutral-100">
              Kenya Map · {activeLayer === 'budget-status' ? `Health Budget (${selectedYear})` : 'Mini DHS 2025-26 Baseline'}
            </h3>
          </div>

          {/* Layer Selector Dropdown/Pills */}
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-400" />
            <select
              id="map-layer-select"
              value={activeLayer}
              onChange={(e) => setActiveLayer(e.target.value as MapLayerType)}
              className="bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-[13px] text-neutral-100 font-medium focus:outline-none focus:border-neutral-500 cursor-pointer"
              aria-label="Select Map Layer"
            >
              <option value="budget-status" className="bg-neutral-900 text-neutral-100">
                Budget status ({selectedYear})
              </option>
              <option value="facility-delivery" className="bg-neutral-900 text-neutral-100">
                Births in a health facility
              </option>
              <option value="skilled-provider" className="bg-neutral-900 text-neutral-100">
                Births with a skilled provider
              </option>
              <option value="anc4-plus" className="bg-neutral-900 text-neutral-100">
                Women with 4+ antenatal visits
              </option>
            </select>
          </div>
        </div>

        {/* Filter buttons visible when in budget status layer */}
        {activeLayer === 'budget-status' && (
          <div className="flex items-center flex-wrap bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-[13px] self-start">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-neutral-800 text-neutral-100'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('on-track')}
              className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition ${
                statusFilter === 'on-track'
                  ? 'bg-neutral-800 text-emerald-400'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>On track</span>
            </button>
            <button
              onClick={() => setStatusFilter('lagging')}
              className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition ${
                statusFilter === 'lagging'
                  ? 'bg-neutral-800 text-rose-400'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
              <span>Lagging</span>
            </button>
            <button
              onClick={() => setStatusFilter('data-incomplete')}
              className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition ${
                statusFilter === 'data-incomplete'
                  ? 'bg-neutral-800 text-amber-400'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Data incomplete</span>
            </button>
            {hasPartialCounties && (
              <button
                onClick={() => setStatusFilter('partial')}
                className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 transition ${
                  statusFilter === 'partial'
                    ? 'bg-neutral-800 text-neutral-200'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-neutral-400 inline-block" />
                <span>Partial</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Map Display Stage: Every county shaded dark blue */}
      <div className="relative w-full h-[520px] lg:h-[580px] bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden flex items-center justify-center">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#26262610_1px,transparent_1px),linear-gradient(to_bottom,#26262610_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Floating Zoom Controls */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded transition"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded transition"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded transition"
            title="Reset Zoom"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Status Legend (Dynamically switches based on layer) */}
        <div className="absolute bottom-3 left-3 z-20 bg-neutral-900/90 border border-neutral-800 rounded-lg p-3 text-[13px] space-y-1.5 backdrop-blur-sm max-w-xs">
          {activeLayer === 'budget-status' ? (
            <>
              <div className="font-semibold text-neutral-300">County Health Status ({selectedYear})</div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>On track (&ge;80% spent)</span>
              </div>
              <div className="flex items-center gap-2 text-rose-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span>Lagging (&lt;80% spent)</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Data incomplete</span>
              </div>
              {hasPartialCounties && (
                <div className="flex items-center gap-2 text-neutral-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 inline-block" />
                  <span>Partial year</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="font-semibold text-neutral-200">
                {activeLayer === 'facility-delivery' && 'Births in Health Facility'}
                {activeLayer === 'skilled-provider' && 'Births with Skilled Provider'}
                {activeLayer === 'anc4-plus' && 'Women with 4+ Antenatal Visits'}
              </div>
              <div className="text-[13px] text-neutral-400">
                National benchmark: <strong className="text-neutral-100">
                  {activeLayer === 'facility-delivery' && `${nationalSurvey.facilityDelivery}%`}
                  {activeLayer === 'skilled-provider' && `${nationalSurvey.skilledBirthAttendance}%`}
                  {activeLayer === 'anc4-plus' && `${nationalSurvey.anc4Plus}%`}
                </strong>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>At or above national</span>
              </div>
              <div className="flex items-center gap-2 text-rose-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span>Below national</span>
              </div>
            </>
          )}
        </div>

        {/* SVG Map of Kenya */}
        <svg
          viewBox="-10 -10 314 398"
          className="w-full h-full cursor-grab active:cursor-grabbing select-none transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          <defs>
            {/* Shaded dark blue base gradients */}
            <linearGradient id="darkBlueCounty" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b1b36" />
              <stop offset="100%" stopColor="#10254c" />
            </linearGradient>

            <linearGradient id="darkBlueSelected" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1d3557" />
              <stop offset="100%" stopColor="#2a4d7a" />
            </linearGradient>

            <linearGradient id="darkBlueHover" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#142c54" />
              <stop offset="100%" stopColor="#1c3e75" />
            </linearGradient>
          </defs>

          {/* Non-Pilot Counties Outline (shaded dark blue) */}
          <g id="non-pilot-counties">
            {nonPilotCounties.map((nonPilot) => {
              const isHovered = hoveredNonPilot === nonPilot.name;
              return (
                <path
                  key={`non-pilot-${nonPilot.id}`}
                  d={nonPilot.d}
                  fill={isHovered ? '#0e1f3d' : '#081224'}
                  stroke="#172847"
                  strokeWidth={0.5}
                  strokeOpacity={0.8}
                  className="transition-colors duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredNonPilot(nonPilot.name)}
                  onMouseLeave={() => setHoveredNonPilot(null)}
                >
                  <title>{`${nonPilot.name} County`}</title>
                </path>
              );
            })}
          </g>

          {/* 26 Tracked Counties (Dark blue shaded, colored by that layer) */}
          <g id="tracked-counties">
            {counties.map((county) => {
              const geo = KENYA_ALL_GEO_PATHS[county.name];
              const pathD = geo?.d || county.mapCoord?.svgPathD;
              if (!pathD) return null;

              const isSelected = selectedCounty?.id === county.id;
              const isHovered = hoveredCounty?.id === county.id;
              const cat = getCountyStatusCategory(county);
              const isFilteredOut = activeLayer === 'budget-status' && statusFilter !== 'all' && cat !== statusFilter;

              const fill = isSelected
                ? 'url(#darkBlueSelected)'
                : isHovered
                ? 'url(#darkBlueHover)'
                : 'url(#darkBlueCounty)';

              let stroke = '#10b981';
              if (activeLayer === 'budget-status') {
                stroke = isSelected
                  ? '#94a3b8'
                  : isHovered
                  ? '#cbd5e1'
                  : cat === 'on-track'
                  ? '#10b981'
                  : cat === 'data-incomplete'
                  ? '#eab308'
                  : cat === 'partial'
                  ? '#64748b'
                  : '#f43f5e';
              } else {
                const sMetrics = getSurveyLayerMetrics(county);
                stroke = isSelected
                  ? '#ffffff'
                  : isHovered
                  ? '#cbd5e1'
                  : sMetrics?.color || '#10b981';
              }

              const strokeWidth = isSelected ? 1.4 : isHovered ? 1.1 : 0.6;

              return (
                <path
                  key={`county-${county.id}`}
                  d={pathD}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  className={`transition-all duration-150 cursor-pointer ${
                    isFilteredOut ? 'opacity-25' : 'opacity-100 hover:brightness-125'
                  }`}
                  onClick={() => onSelectCounty(county)}
                  onMouseEnter={() => setHoveredCounty(county)}
                  onMouseLeave={() => setHoveredCounty(null)}
                />
              );
            })}
          </g>

          {/* Status Pins & County Labels */}
          <g id="county-pins-and-labels" className="pointer-events-none">
            {counties.map((county) => {
              const geo = KENYA_ALL_GEO_PATHS[county.name];
              const cx = geo?.cx || county.mapCoord?.x;
              const cy = geo?.cy || county.mapCoord?.y;
              if (!cx || !cy) return null;

              const cat = getCountyStatusCategory(county);
              const isFilteredOut = activeLayer === 'budget-status' && statusFilter !== 'all' && cat !== statusFilter;
              if (isFilteredOut) return null;

              const isSelected = selectedCounty?.id === county.id;
              const isHovered = hoveredCounty?.id === county.id;

              let pinColor = '#10b981';
              if (activeLayer === 'budget-status') {
                pinColor =
                  cat === 'on-track'
                    ? '#10b981'
                    : cat === 'data-incomplete'
                    ? '#eab308'
                    : cat === 'partial'
                    ? '#94a3b8'
                    : '#f43f5e';
              } else {
                const sMetrics = getSurveyLayerMetrics(county);
                pinColor = sMetrics?.color || '#10b981';
              }

              const r = isSelected ? 3.8 : 2.8;

              return (
                <g key={`pin-${county.id}`}>
                  {/* Status Pin Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={pinColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 1 : 0.6}
                  />

                  {/* County Name Label */}
                  <text
                    x={cx}
                    y={cy + r + 4}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : isHovered ? '#e2e8f0' : '#cbd5e1'}
                    fontSize={isSelected ? '5.2' : '4.2'}
                    fontWeight={isSelected ? 'bold' : '600'}
                    fontFamily="sans-serif"
                    className="select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  >
                    {county.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredCounty && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none bg-neutral-900 border border-neutral-700 rounded-xl p-4 shadow-2xl text-[13px] min-w-[290px] max-w-[360px] space-y-2">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-neutral-800">
              <span className="font-bold text-neutral-100 text-sm">
                {hoveredCounty.name} County
              </span>

              {activeLayer === 'budget-status' ? (
                hoveredCounty.status === 'on-track' ? (
                  <span className="px-2 py-0.5 rounded text-[13px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/40 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> On track
                  </span>
                ) : hoveredCounty.status === 'data-incomplete' ||
                  hoveredCounty.status === 'data_incomplete' ? (
                  <span className="px-2 py-0.5 rounded text-[13px] font-semibold bg-amber-950 text-amber-400 border border-amber-500/40 inline-flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" /> Data incomplete
                  </span>
                ) : hoveredCounty.status === 'partial' ? (
                  <span className="px-2 py-0.5 rounded text-[13px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-600 inline-flex items-center gap-1">
                    <MinusCircle className="w-3.5 h-3.5" /> Partial
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[13px] font-semibold bg-rose-950 text-rose-400 border border-rose-500/40 inline-flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Lagging
                  </span>
                )
              ) : (
                <span className="text-[13px] text-neutral-400">
                  Mini DHS 2025-26
                </span>
              )}
            </div>

            {/* Content based on Active Layer */}
            {activeLayer === 'budget-status' ? (
              hoveredCounty.status === 'data-incomplete' ||
              hoveredCounty.status === 'data_incomplete' ? (
                <div className="text-[13px] text-amber-300 bg-neutral-950 p-2.5 rounded border border-amber-800/40 font-medium">
                  {hoveredCounty.reportedActualNote || 'Data incomplete'}
                </div>
              ) : hoveredCounty.status === 'partial' ? (
                <div className="text-[13px] text-neutral-300 bg-neutral-950 p-2.5 rounded border border-neutral-800">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Approved budget:</span>
                    <span className="font-semibold text-neutral-100">
                      {hoveredCounty.promisedBudgetKES != null ? `KES ${Number(hoveredCounty.promisedBudgetKES).toLocaleString()}M` : '-'}
                    </span>
                  </div>
                  <div className="text-[13px] text-neutral-400 mt-1">
                    Approved budget only (partial year)
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-neutral-300">
                  <div>
                    <span className="text-neutral-400 block text-[13px]">Approved</span>
                    <span className="font-semibold text-neutral-100">
                      {hoveredCounty.promisedBudgetKES != null
                        ? `KES ${hoveredCounty.promisedBudgetKES}M`
                        : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[13px]">Spent</span>
                    <span className="font-semibold text-neutral-100">
                      {hoveredCounty.deliveredBudgetKES != null
                        ? `KES ${hoveredCounty.deliveredBudgetKES}M`
                        : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[13px]">Absorption</span>
                    <span
                      className={`font-semibold ${
                        hoveredCounty.status === 'on-track'
                          ? 'text-emerald-400'
                          : hoveredCounty.status === 'lagging'
                          ? 'text-rose-400'
                          : 'text-neutral-400'
                      }`}
                    >
                      {hoveredCounty.absorptionRate != null
                        ? `${hoveredCounty.absorptionRate.toFixed(1)}%`
                        : '-'}
                    </span>
                  </div>
                </div>
              )
            ) : (
              /* Requirement 3: Survey Layer Tooltip: county, value, Source: Kenya Mini DHS 2025-26, and small sample flag */
              <div className="space-y-2 text-[13px]">
                <div className="flex items-center justify-between bg-neutral-950 p-2.5 rounded border border-neutral-800">
                  <span className="text-neutral-400 font-medium">
                    {activeLayer === 'facility-delivery' && 'Facility delivery rate:'}
                    {activeLayer === 'skilled-provider' && 'Skilled birth attendance:'}
                    {activeLayer === 'anc4-plus' && '4+ antenatal visits:'}
                  </span>
                  <span className="font-bold text-neutral-100 text-sm">
                    {activeLayer === 'facility-delivery' && `${hoveredCounty.survey?.facilityDelivery ?? '-'}%`}
                    {activeLayer === 'skilled-provider' && `${hoveredCounty.survey?.skilledBirthAttendance ?? '-'}%`}
                    {activeLayer === 'anc4-plus' && `${hoveredCounty.survey?.anc4Plus ?? '-'}%`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-400">
                  <span>National benchmark:</span>
                  <span className="font-semibold text-neutral-200">
                    {activeLayer === 'facility-delivery' && `${nationalSurvey.facilityDelivery}%`}
                    {activeLayer === 'skilled-provider' && `${nationalSurvey.skilledBirthAttendance}%`}
                    {activeLayer === 'anc4-plus' && `${nationalSurvey.anc4Plus}%`}
                  </span>
                </div>

                <div className="text-neutral-400 text-[13px]">
                  Source: Kenya Mini DHS 2025-26
                </div>

                {hoveredCounty.survey?.smallSample && (
                  <div className="text-[13px] text-amber-300 bg-amber-950/60 p-2 rounded border border-amber-800/40 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Small sample, interpret with caution</span>
                  </div>
                )}
              </div>
            )}

            {activeLayer === 'budget-status' && hoveredCounty.editorHeadline && (
              <p className="text-[13px] text-neutral-300 pt-1.5 border-t border-neutral-800 leading-snug">
                {hoveredCounty.editorHeadline}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Requirement 3: Under the map notes */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 space-y-1.5 text-[13px] text-neutral-400 leading-relaxed">
        <p>
          <strong className="text-neutral-300">Survey baseline</strong> (fixed, does not change with the financial year). Shown beside budget data, not as cause and effect.
        </p>
        <p className="text-neutral-300">
          The Mini DHS reports maternal mortality at national level only: <strong>263 per 100,000 live births (CI 121 to 405)</strong>.
        </p>
      </div>
    </div>
  );
};
