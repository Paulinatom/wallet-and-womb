import React, { useState, useMemo } from 'react';
import { CountyHealthData } from '../types';
import { KENYA_ALL_GEO_PATHS, CountyGeoPath } from '../data/kenyaSvgPaths';
import { formatKES } from '../utils/formatters';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Compass,
  Eye,
  Info,
  ChevronRight
} from 'lucide-react';

interface KenyaCountyMapProps {
  counties: CountyHealthData[];
  selectedCounty: CountyHealthData | null;
  onSelectCounty: (county: CountyHealthData) => void;
  statusFilter: 'all' | 'on-track' | 'lagging';
  setStatusFilter: (filter: 'all' | 'on-track' | 'lagging') => void;
}

export const KenyaCountyMap: React.FC<KenyaCountyMapProps> = ({
  counties,
  selectedCounty,
  onSelectCounty,
  statusFilter,
  setStatusFilter,
}) => {
  const [hoveredCounty, setHoveredCounty] = useState<CountyHealthData | null>(null);
  const [hoveredNonPilot, setHoveredNonPilot] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showBadges, setShowBadges] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [mapMode, setMapMode] = useState<'status' | 'absorption' | 'spending'>('status');

  // Fast map lookup for the 26 pilot counties
  const pilotCountiesMap = useMemo(() => {
    const map = new Map<string, CountyHealthData>();
    counties.forEach((c) => map.set(c.name, c));
    return map;
  }, [counties]);

  // Non-pilot counties to render full authentic Kenya silhouette
  const nonPilotCounties = useMemo(() => {
    return Object.values(KENYA_ALL_GEO_PATHS).filter((g) => !pilotCountiesMap.has(g.name));
  }, [pilotCountiesMap]);

  const onTrackCount = counties.filter((c) => c.status === 'on-track').length;
  const laggingCount = counties.filter((c) => c.status === 'lagging').length;

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.3, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.3, 0.8));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      id="kenya-map-container"
      className="relative bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:p-6 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col"
    >
      {/* Header & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-blue-950/80 border border-blue-600/30 text-blue-400">
              <MapPin className="w-4 h-4" />
            </span>
            <h3 className="text-base lg:text-lg font-bold text-white tracking-wide">
              Official Kenya County Health Map (26 Pilot Counties)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Geographically precise boundaries, dark-blue county shading, and live green/red accountability badges
          </p>
        </div>

        {/* Filter Pills & Map Status Legend */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <button
              id="filter-all-counties-btn"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All 26 ({counties.length})
            </button>
            <button
              id="filter-on-track-btn"
              onClick={() => setStatusFilter('on-track')}
              className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all ${
                statusFilter === 'on-track'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-400/80 hover:text-emerald-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              On Track ({onTrackCount})
            </button>
            <button
              id="filter-lagging-btn"
              onClick={() => setStatusFilter('lagging')}
              className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all ${
                statusFilter === 'lagging'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-400/80 hover:text-rose-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block animate-pulse"></span>
              Lagging Behind ({laggingCount})
            </button>
          </div>

          {/* Layer toggles */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setShowBadges(!showBadges)}
              className={`px-2 py-1 rounded transition ${
                showBadges ? 'bg-slate-800 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Status Badges"
            >
              Badges
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-2 py-1 rounded transition ${
                showLabels ? 'bg-slate-800 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle County Labels"
            >
              Labels
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative w-full h-[520px] lg:h-[580px] bg-gradient-to-b from-slate-950 via-[#070e1e] to-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
        {/* Geographic Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        {/* Map Zoom & View Controls Floating Toolbar */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-lg shadow-lg backdrop-blur-md">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
            title="Zoom In"
            aria-label="Zoom in on Kenya map"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
            title="Zoom Out"
            aria-label="Zoom out on Kenya map"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
            title="Reset Map View"
            aria-label="Reset Kenya map view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Box in Bottom-Left */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-950/85 border border-slate-800/90 rounded-lg p-3 shadow-xl backdrop-blur-md text-[11px] max-w-[210px] space-y-2">
          <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-1">
            <span>Status Budges Legend</span>
            <span className="text-[10px] font-mono text-cyan-400">26 Tracked</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] inline-block"></span>
              <span>🟢 On Track (≥80% Delivered)</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] inline-block"></span>
              <span>🔴 Lagging Behind (&lt;80%)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] pt-1 border-t border-slate-800/80">
              <span className="w-2 h-2 rounded bg-slate-800 border border-slate-700 inline-block"></span>
              <span>Non-Pilot County (Context)</span>
            </div>
          </div>
        </div>

        {/* Geographic Labels & Watermark Identifiers */}
        <div className="absolute top-4 left-4 pointer-events-none text-left font-mono text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>KENYA GEODETIC REFERENCE</span>
          </div>
          <div className="text-[9px] text-slate-400">WGS 84 • 47 Counties Silhouette</div>
        </div>

        {/* Neighboring Country Guides */}
        <div className="absolute top-2 left-1/3 pointer-events-none font-mono text-[9px] text-slate-400 tracking-wider">
          ETHIOPIA
        </div>
        <div className="absolute top-1/4 right-3 pointer-events-none font-mono text-[9px] text-slate-400 tracking-wider text-right">
          SOMALIA
        </div>
        <div className="absolute bottom-2 left-1/3 pointer-events-none font-mono text-[9px] text-slate-400 tracking-wider">
          TANZANIA
        </div>
        <div className="absolute top-1/2 left-2 pointer-events-none font-mono text-[9px] text-slate-400 tracking-wider">
          UGANDA
        </div>

        {/* Lake Turkana Water Indicator */}
        <div className="absolute top-16 left-[28%] pointer-events-none font-mono text-[9px] text-cyan-400/50 uppercase tracking-widest">
          Lake Turkana
        </div>

        {/* Lake Victoria Basin Indicator */}
        <div className="absolute bottom-32 left-8 pointer-events-none font-mono text-[9px] text-cyan-400/50 uppercase tracking-widest">
          Lake Victoria
        </div>

        {/* Indian Ocean Coast Indicator */}
        <div className="absolute bottom-10 right-8 pointer-events-none text-right font-mono text-[9px] text-sky-400/50 uppercase tracking-widest">
          Indian Ocean Coast
        </div>

        {/* Authentic SVG Map of Kenya */}
        <svg
          id="kenya-authentic-svg-map"
          viewBox="-10 -10 314 398"
          className="w-full h-full cursor-grab active:cursor-grabbing select-none transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          <defs>
            {/* Shaded dark blue gradient fills */}
            <linearGradient id="darkBlueBase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c1833" />
              <stop offset="50%" stopColor="#14264e" />
              <stop offset="100%" stopColor="#0e1a38" />
            </linearGradient>

            <linearGradient id="darkBlueOnTrack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d244c" />
              <stop offset="60%" stopColor="#143468" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            <linearGradient id="darkBlueLagging" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f1e3c" />
              <stop offset="60%" stopColor="#1c1f4e" />
              <stop offset="100%" stopColor="#4c0519" />
            </linearGradient>

            <linearGradient id="selectedCountyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Glowing filters for status badge pins */}
            <filter id="badgeGlowGreen" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#10b981" floodOpacity="0.8" />
            </filter>
            <filter id="badgeGlowRed" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#f43f5e" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Equator Guide Line across Central Kenya */}
          <line
            x1="0"
            y1="210"
            x2="292"
            y2="210"
            stroke="#2563eb"
            strokeDasharray="2 4"
            strokeWidth="0.5"
            opacity="0.35"
          />
          <text x="4" y="207" fill="#60a5fa" opacity="0.6" fontSize="5" fontFamily="monospace">
            EQUATOR 0°00'
          </text>

          {/* LAYER 1: 21 Non-Pilot Counties (Contextual Background Shaded in Deep Dark Blue) */}
          <g id="non-pilot-counties-layer">
            {nonPilotCounties.map((nonPilot) => {
              const isHovered = hoveredNonPilot === nonPilot.name;
              return (
                <path
                  key={`non-pilot-${nonPilot.id}`}
                  d={nonPilot.d}
                  fill={isHovered ? '#12203d' : '#081020'}
                  stroke={isHovered ? '#334155' : '#172554'}
                  strokeWidth={0.5}
                  strokeOpacity={0.7}
                  className="transition-colors duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredNonPilot(nonPilot.name)}
                  onMouseLeave={() => setHoveredNonPilot(null)}
                >
                  <title>{nonPilot.name} (National Non-Pilot County)</title>
                </path>
              );
            })}
          </g>

          {/* LAYER 2: 26 Pilot Counties (Shaded in Dark Blue with Green/Red Status Visuals) */}
          <g id="pilot-counties-layer">
            {counties.map((county) => {
              const geo = KENYA_ALL_GEO_PATHS[county.name];
              if (!geo) return null;

              const isSelected = selectedCounty?.id === county.id;
              const isHovered = hoveredCounty?.id === county.id;
              const isFilteredOut = statusFilter !== 'all' && county.status !== statusFilter;

              // Dark blue shading with subtle status hints
              let fillColor = 'url(#darkBlueBase)';
              if (county.status === 'on-track') {
                fillColor = 'url(#darkBlueOnTrack)';
              } else if (county.status === 'lagging') {
                fillColor = 'url(#darkBlueLagging)';
              }

              if (isSelected) {
                fillColor = 'url(#selectedCountyGlow)';
              }

              const strokeColor = isSelected
                ? '#38bdf8'
                : isHovered
                ? '#93c5fd'
                : county.status === 'on-track'
                ? '#10b981'
                : '#f43f5e';

              const strokeWidth = isSelected ? 1.6 : isHovered ? 1.2 : 0.7;

              return (
                <g
                  key={`pilot-${county.id}`}
                  className={`transition-opacity duration-200 ${
                    isFilteredOut ? 'opacity-20 pointer-events-none' : 'opacity-100 cursor-pointer'
                  }`}
                  onClick={() => onSelectCounty(county)}
                  onMouseEnter={() => setHoveredCounty(county)}
                  onMouseLeave={() => setHoveredCounty(null)}
                >
                  {/* County Polygon */}
                  <path
                    d={geo.d}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    className="transition-all duration-200 hover:brightness-125"
                  />
                </g>
              );
            })}
          </g>

          {/* LAYER 3: Prominent Status Badges & County Labels (Green on Track, Red Lagging) */}
          {showBadges && (
            <g id="status-badges-layer" className="pointer-events-none">
              {counties.map((county) => {
                const geo = KENYA_ALL_GEO_PATHS[county.name];
                if (!geo) return null;

                const isFilteredOut = statusFilter !== 'all' && county.status !== statusFilter;
                if (isFilteredOut) return null;

                const isSelected = selectedCounty?.id === county.id;
                const isOnTrack = county.status === 'on-track';
                const cx = geo.cx;
                const cy = geo.cy;

                // Radius sizing: larger for selected or high-impact
                const r = isSelected ? 4.2 : 3.2;

                return (
                  <g key={`badge-${county.id}`} className="transition-all duration-200">
                    {/* Outer pulsating halo ring for selected or lagging counties */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r + 3.5}
                        fill="none"
                        stroke={isOnTrack ? '#34d399' : '#fb7185'}
                        strokeWidth="0.8"
                        strokeDasharray="2 2"
                        className="animate-spin"
                        style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '6s' }}
                      />
                    )}

                    {/* Status Badge Pin Drop Shadow Filter */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={isOnTrack ? '#059669' : '#e11d48'}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 1.0 : 0.6}
                      filter={isOnTrack ? 'url(#badgeGlowGreen)' : 'url(#badgeGlowRed)'}
                    />

                    {/* Center Dot Indicator */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r * 0.4}
                      fill="#ffffff"
                      opacity={0.9}
                    />

                    {/* County Name Label */}
                    {showLabels && (
                      <text
                        x={cx}
                        y={cy + (r + 4.5)}
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : '#e2e8f0'}
                        fontSize={isSelected ? '5.2' : '4.2'}
                        fontWeight={isSelected ? 'bold' : '600'}
                        fontFamily="sans-serif"
                        className="select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                      >
                        {county.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay Box */}
        {hoveredCounty && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none bg-slate-950/95 border border-slate-700/90 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs min-w-[240px] max-w-[320px] animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
              <span className="font-bold text-white text-sm">
                #{String(hoveredCounty.code).padStart(2, '0')} {hoveredCounty.name} County
              </span>
              {/* Green status badge for on track, red for lagging */}
              {hoveredCounty.status === 'on-track' ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ON TRACK
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-500/50 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> LAGGING
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Promised Budget:</span>
                <span className="text-blue-400 font-bold">{formatKES(hoveredCounty.promisedBudgetKES)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Delivered Spending:</span>
                <span className="text-cyan-400 font-bold">{formatKES(hoveredCounty.deliveredBudgetKES)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Absorption Rate:</span>
                <span className={`font-bold ${hoveredCounty.absorptionRate >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {hoveredCounty.absorptionRate.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Maternal Mortality:</span>
                <span className="text-rose-400 font-bold">{hoveredCounty.indicators.mmr} /100k</span>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>{hoveredCounty.region} Region</span>
              <span className="text-blue-400 flex items-center gap-0.5">
                Click to inspect <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Summary Pill below Map */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>
            Clicking any county on the map updates the <strong>Promised vs Delivered finances</strong>,{' '}
            <strong>health indicators</strong>, and <strong>investigative desk widgets</strong>.
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>Selected: <strong className="text-white">{selectedCounty?.name || 'None'}</strong></span>
          <span>•</span>
          <span>Status: <strong className={selectedCounty?.status === 'on-track' ? 'text-emerald-400' : 'text-rose-400'}>
            {selectedCounty?.status === 'on-track' ? '🟢 ON TRACK' : '🔴 LAGGING BEHIND'}
          </strong></span>
        </div>
      </div>
    </div>
  );
};
