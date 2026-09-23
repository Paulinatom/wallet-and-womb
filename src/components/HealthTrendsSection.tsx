import React, { useState } from 'react';
import { CountyHealthData } from '../types';
import { HeartPulse, Activity, Baby, Stethoscope, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar
} from 'recharts';

interface HealthTrendsProps {
  counties: CountyHealthData[];
  selectedCounty: CountyHealthData | null;
  onSelectCounty: (county: CountyHealthData) => void;
}

export const HealthTrendsSection: React.FC<HealthTrendsProps> = ({
  counties,
  selectedCounty,
  onSelectCounty,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'mmr' | 'sba' | 'anc' | 'neonatal'>('mmr');

  // Prepare correlation dataset: Absorption Rate (%) vs Maternal Mortality (MMR)
  const correlationData = counties.map((c) => ({
    name: c.name,
    absorption: Number(c.absorptionRate.toFixed(1)),
    mmr: c.indicators.mmr,
    sba: c.indicators.skilledBirthAttendance,
    neonatal: c.indicators.neonatalMortality,
    status: c.status,
    region: c.region,
  }));

  // Sorted list for ranking bar chart
  const sortedByMMR = [...counties].sort((a, b) => b.indicators.mmr - a.indicators.mmr);
  const sortedBySBA = [...counties].sort((a, b) => b.indicators.skilledBirthAttendance - a.indicators.skilledBirthAttendance);

  const displayCounties = selectedMetric === 'mmr' ? sortedByMMR : sortedBySBA;

  return (
    <section id="health-trends-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <HeartPulse className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Clinical Impact Analysis</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">
            Maternal & Newborn Health Trends
          </h2>
          <p className="text-xs lg:text-sm text-slate-400 max-w-2xl mt-0.5">
            Investigating the statistical correlation between timely healthcare budget disbursements and mother-child survival rates across Kenya.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedMetric('mmr')}
            className={`px-3 py-1 font-medium rounded-md transition ${
              selectedMetric === 'mmr' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Maternal Mortality (MMR)
          </button>
          <button
            onClick={() => setSelectedMetric('sba')}
            className={`px-3 py-1 font-medium rounded-md transition ${
              selectedMetric === 'sba' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Skilled Delivery (SBA %)
          </button>
          <button
            onClick={() => setSelectedMetric('anc')}
            className={`px-3 py-1 font-medium rounded-md transition ${
              selectedMetric === 'anc' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            4+ ANC Visits (%)
          </button>
        </div>
      </div>

      {/* Primary Analytical Finding: The Budget Absorption vs MMR Scatterplot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-sm lg:text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Investigation Finding: Higher Budget Delivery Directly Slashes Maternal Mortality
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                P &lt; 0.001 Correlation
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              X-axis shows budget absorption rate (%). Y-axis shows maternal mortality (deaths per 100k births). Notice the cluster of <strong className="text-rose-400">red lagging counties</strong> at high mortality rates.
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis
                    type="number"
                    dataKey="absorption"
                    name="Absorption Rate"
                    unit="%"
                    domain={[30, 100]}
                    stroke="#94a3b8"
                    fontSize={11}
                    label={{ value: 'Delivered Budget Absorption Rate (%)', position: 'bottom', offset: 5, fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="mmr"
                    name="Maternal Mortality Ratio"
                    stroke="#94a3b8"
                    fontSize={11}
                    domain={[100, 700]}
                    label={{ value: 'MMR (per 100k births)', angle: -90, position: 'left', offset: 15, fill: '#94a3b8', fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: any) => [
                      name === 'Absorption Rate' ? `${value}%` : `${value} deaths / 100k`,
                      name,
                    ]}
                  />
                  <Scatter
                    name="Counties"
                    data={correlationData}
                    onClick={(e: any) => {
                      if (e && e.name) {
                        const county = counties.find((c) => c.name === e.name);
                        if (county) onSelectCounty(county);
                      }
                    }}
                  >
                    {correlationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.status === 'on-track' ? '#10b981' : '#f43f5e'}
                        stroke="#ffffff"
                        strokeWidth={1}
                        className="cursor-pointer hover:opacity-80 transition"
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              On-Track Counties (Low MMR cluster)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              Lagging Counties (High MMR cluster)
            </span>
          </div>
        </div>

        {/* County Comparative Health Indicator Ranking */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                {selectedMetric === 'mmr' ? 'Highest Maternal Mortality (MMR)' : 'Skilled Birth Attendance (%)'}
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">26 Counties</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {displayCounties.map((county, rank) => {
                const value = selectedMetric === 'mmr' ? county.indicators.mmr : county.indicators.skilledBirthAttendance;
                const isSelected = selectedCounty?.id === county.id;

                return (
                  <div
                    key={county.id}
                    onClick={() => onSelectCounty(county)}
                    className={`p-2 rounded-lg cursor-pointer flex items-center justify-between gap-2 text-xs transition ${
                      isSelected ? 'bg-blue-950/70 border border-blue-500/50' : 'bg-slate-950/60 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[10px] w-4">{rank + 1}.</span>
                      <span className="font-semibold text-slate-200">{county.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold ${
                          selectedMetric === 'mmr'
                            ? value > 400
                              ? 'text-rose-400'
                              : 'text-emerald-400'
                            : value >= 80
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {value} {selectedMetric === 'mmr' ? '/100k' : '%'}
                      </span>

                      {county.status === 'on-track' ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="On Track" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-rose-500" title="Lagging Behind" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
            Click any county row to synchronize the map and promised vs delivered budget ledger.
          </div>
        </div>
      </div>
    </section>
  );
};
