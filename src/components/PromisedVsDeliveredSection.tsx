import React, { useState } from 'react';
import { CountyHealthData } from '../types';
import { formatKES } from '../utils/formatters';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ArrowUpDown, 
  Building2, 
  ExternalLink, 
  ShieldAlert, 
  Copy, 
  Check, 
  ChevronRight,
  PieChart as PieIcon,
  BarChart3,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface PromisedVsDeliveredProps {
  counties: CountyHealthData[];
  selectedCounty: CountyHealthData | null;
  onSelectCounty: (county: CountyHealthData) => void;
}

export const PromisedVsDeliveredSection: React.FC<PromisedVsDeliveredProps> = ({
  counties,
  selectedCounty,
  onSelectCounty,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'on-track' | 'lagging' | 'audited'>('all');
  const [sortField, setSortField] = useState<'gap' | 'absorption' | 'promised' | 'name'>('gap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');

  // Aggregates
  const totalPromised = counties.reduce((acc, c) => acc + c.promisedBudgetKES, 0);
  const totalDelivered = counties.reduce((acc, c) => acc + c.deliveredBudgetKES, 0);
  const totalGap = totalPromised - totalDelivered;
  const avgAbsorption = (totalDelivered / totalPromised) * 100;
  const onTrackCount = counties.filter((c) => c.status === 'on-track').length;
  const laggingCount = counties.filter((c) => c.status === 'lagging').length;

  // Filter & sort counties
  const filteredCounties = counties
    .filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.capital.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.region.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      if (filterStatus === 'on-track') return c.status === 'on-track';
      if (filterStatus === 'lagging') return c.status === 'lagging';
      if (filterStatus === 'audited') return c.auditorGeneralFlag;
      return true;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortField === 'gap') {
        diff = (a.promisedBudgetKES - a.deliveredBudgetKES) - (b.promisedBudgetKES - b.deliveredBudgetKES);
      } else if (sortField === 'absorption') {
        diff = a.absorptionRate - b.absorptionRate;
      } else if (sortField === 'promised') {
        diff = a.promisedBudgetKES - b.promisedBudgetKES;
      } else if (sortField === 'name') {
        diff = a.name.localeCompare(b.name);
      }
      return sortOrder === 'desc' ? -diff : diff;
    });

  // Chart data preparation
  const chartData = filteredCounties.slice(0, 16).map((c) => ({
    name: c.name,
    Promised: c.promisedBudgetKES,
    Delivered: c.deliveredBudgetKES,
    Gap: c.promisedBudgetKES - c.deliveredBudgetKES,
    status: c.status,
    absorption: c.absorptionRate,
  }));

  const handleCopyFactsheet = (county: CountyHealthData) => {
    const text = `[WALLET & WOMB AUDIT DATA] ${county.name} County (Code #${county.code}): Government Promised KES ${county.promisedBudgetKES}M vs Delivered KES ${county.deliveredBudgetKES}M (${county.absorptionRate.toFixed(1)}% absorption). Gap: KES ${county.promisedBudgetKES - county.deliveredBudgetKES}M. Status: ${county.status === 'on-track' ? 'ON TRACK (GREEN)' : 'LAGGING BEHIND (RED)'}. Maternal Mortality: ${county.indicators.mmr}/100k live births. Source: CoB FY2023/24 Q3.`;
    navigator.clipboard.writeText(text);
    setCopiedId(county.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const currentCounty = selectedCounty || counties[0];

  return (
    <section id="promised-vs-delivered-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-950/80 border border-blue-500/30 text-blue-400">
              <DollarSign className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">Fiscal Accountability</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">
            Promised vs. Delivered Healthcare Budgets
          </h2>
          <p className="text-xs lg:text-sm text-slate-400 max-w-2xl mt-0.5">
            Cross-referencing County Treasury exchequer approvals with verified grassroots maternal facility expenditures across 26 counties.
          </p>
        </div>

        {/* Global Summary Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            <span>{onTrackCount} Counties On Track</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse inline-block"></span>
            <span>{laggingCount} Counties Lagging Behind</span>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Stat Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        {/* Total Promised */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Total Promised Allocation</div>
          <div className="text-xl lg:text-2xl font-bold text-blue-400 mt-1 font-mono">{formatKES(totalPromised)}</div>
          <div className="text-[11px] text-slate-400 mt-1">County Health Votes (26 Target Counties)</div>
          <div className="absolute top-3 right-3 text-blue-500/20">
            <Building2 className="w-8 h-8" />
          </div>
        </div>

        {/* Total Delivered */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Actual Project Spending</div>
          <div className="text-xl lg:text-2xl font-bold text-cyan-400 mt-1 font-mono">{formatKES(totalDelivered)}</div>
          <div className="text-[11px] text-emerald-400/90 flex items-center gap-1 mt-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Facility Works & Supplies
          </div>
          <div className="absolute top-3 right-3 text-cyan-500/20">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>

        {/* Total Delivery Deficit */}
        <div className="bg-slate-900/90 border border-rose-900/40 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="text-[11px] text-rose-300 uppercase font-mono tracking-wider">Unrealized / Delayed Funds</div>
          <div className="text-xl lg:text-2xl font-bold text-rose-400 mt-1 font-mono">{formatKES(totalGap)}</div>
          <div className="text-[11px] text-rose-400/80 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {( (totalGap / totalPromised) * 100 ).toFixed(1)}% of maternal budget undelivered
          </div>
          <div className="absolute top-3 right-3 text-rose-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>
        </div>

        {/* Average Absorption Rate */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Weighted Absorption Rate</div>
          <div className="text-xl lg:text-2xl font-bold text-amber-300 mt-1 font-mono">
            {avgAbsorption.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-amber-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${avgAbsorption}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Target benchmark: ≥ 80.0%</div>
        </div>
      </div>

      {/* Main Dual View: Comparison Chart & County Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:p-6 shadow-xl space-y-6">
        {/* Toolbar & Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              id="county-search-input"
              type="text"
              placeholder="Search by county name, capital, or region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs lg:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Filter status buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                id="filter-status-all"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 font-medium rounded-md transition ${
                  filterStatus === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All (26)
              </button>
              <button
                id="filter-status-ontrack"
                onClick={() => setFilterStatus('on-track')}
                className={`px-3 py-1 font-medium rounded-md flex items-center gap-1.5 transition ${
                  filterStatus === 'on-track' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" /> On Track
              </button>
              <button
                id="filter-status-lagging"
                onClick={() => setFilterStatus('lagging')}
                className={`px-3 py-1 font-medium rounded-md flex items-center gap-1.5 transition ${
                  filterStatus === 'lagging' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:text-rose-300'
                }`}
              >
                <AlertTriangle className="w-3 h-3" /> Lagging
              </button>
              <button
                id="filter-status-audited"
                onClick={() => setFilterStatus('audited')}
                className={`px-3 py-1 font-medium rounded-md flex items-center gap-1.5 transition ${
                  filterStatus === 'audited' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <ShieldAlert className="w-3 h-3" /> Audit Red Flags
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                id="view-toggle-chart"
                onClick={() => setActiveTab('chart')}
                className={`px-3 py-1 font-medium rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'chart' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Chart
              </button>
              <button
                id="view-toggle-table"
                onClick={() => setActiveTab('table')}
                className={`px-3 py-1 font-medium rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Full Table
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Interactive Bar Chart */}
        {activeTab === 'chart' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Showing top allocations vs actual expenditures (KES Millions)</span>
              <span className="font-mono text-[11px] text-blue-400">Click any county to inspect project ledger</span>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
                  onClick={(e: any) => {
                    if (e && e.activePayload && e.activePayload[0]) {
                      const clickedName = e.activePayload[0].payload.name;
                      const match = counties.find((c) => c.name === clickedName);
                      if (match) onSelectCounty(match);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={11}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11}
                    tickFormatter={(val) => `${val}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: any) => [`KES ${value}M`, name]}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }}
                  />
                  <Bar dataKey="Promised" fill="#3b82f6" name="Promised Allocation (KES)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Delivered" fill="#06b6d4" name="Actual Project Spending (KES)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: Full Detailed Data Table */}
        {activeTab === 'table' && (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">County</th>
                  <th className="p-3">Status</th>
                  <th 
                    className="p-3 cursor-pointer hover:text-white"
                    onClick={() => {
                      setSortField('promised');
                      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Promised <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="p-3">Delivered</th>
                  <th 
                    className="p-3 cursor-pointer hover:text-white"
                    onClick={() => {
                      setSortField('absorption');
                      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Absorption Rate <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th 
                    className="p-3 cursor-pointer hover:text-white"
                    onClick={() => {
                      setSortField('gap');
                      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Deficit (Gap) <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="p-3">Leakage Risk</th>
                  <th className="p-3">Audit Alert</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                {filteredCounties.map((county) => {
                  const isCurrent = currentCounty.id === county.id;
                  const gap = county.promisedBudgetKES - county.deliveredBudgetKES;

                  return (
                    <tr
                      key={county.id}
                      onClick={() => onSelectCounty(county)}
                      className={`hover:bg-slate-800/50 cursor-pointer transition ${
                        isCurrent ? 'bg-blue-950/40 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <td className="p-3 font-semibold text-white flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-[10px]">#{String(county.code).padStart(2, '0')}</span>
                        {county.name}
                        <span className="text-[10px] text-slate-400 font-normal">({county.region})</span>
                      </td>

                      {/* Status Badge: Explicit Green vs Red */}
                      <td className="p-3">
                        {county.status === 'on-track' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/90 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> ON TRACK
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/90 text-rose-400 border border-rose-500/30 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> LAGGING
                          </span>
                        )}
                      </td>

                      <td className="p-3 font-mono text-slate-200">
                        {formatKES(county.promisedBudgetKES)}
                      </td>

                      <td className="p-3 font-mono text-cyan-300 font-medium">
                        {formatKES(county.deliveredBudgetKES)}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${county.absorptionRate >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {county.absorptionRate.toFixed(1)}%
                          </span>
                          <div className="w-14 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                county.absorptionRate >= 80 ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(county.absorptionRate, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-mono text-rose-400 font-medium">
                        {gap > 0 ? formatKES(gap) : 'KES 0M'}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            county.leakageRisk === 'Critical'
                              ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                              : county.leakageRisk === 'High'
                              ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                              : county.leakageRisk === 'Medium'
                              ? 'bg-blue-950 text-blue-300 border border-blue-600/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {county.leakageRisk}
                        </span>
                      </td>

                      <td className="p-3">
                        {county.auditorGeneralFlag ? (
                          <span className="text-amber-400 flex items-center gap-1 text-[10px] font-mono" title="Flagged in Auditor-General FY2023/24 Report">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> CoB Flag
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px] font-mono">Clean</span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyFactsheet(county);
                          }}
                          className="p-1 text-slate-400 hover:text-cyan-300 transition"
                          title="Copy journalist data quote"
                          aria-label="Copy journalist factsheet quote"
                        >
                          {copiedId === county.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Selected County Detailed Projects Ledger */}
        <div id="county-project-ledger" className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">County Project Dossier</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">
                  #{String(currentCounty.code).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                {currentCounty.name} County Maternal & Newborn Projects
                {currentCounty.status === 'on-track' ? (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ON TRACK
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-950 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> LAGGING BEHIND
                  </span>
                )}
              </h3>
            </div>

            <button
              onClick={() => handleCopyFactsheet(currentCounty)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition"
            >
              {copiedId === currentCounty.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Journalist Quote</span>
                </>
              )}
            </button>
          </div>

          {/* Project List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentCounty.keyProjects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-slate-900 text-blue-300 border border-slate-800">
                      {project.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        project.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/30'
                          : project.status === 'Stalled'
                          ? 'bg-rose-950 text-rose-400 border border-rose-600/30'
                          : project.status === 'Audit Flagged'
                          ? 'bg-amber-950 text-amber-400 border border-amber-600/30'
                          : 'bg-blue-950 text-blue-400 border border-blue-600/30'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-100">{project.name}</h4>
                  <div className="text-[11px] text-slate-400 mt-1">Facility: {project.facility}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Contractor: {project.contractor}</div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Allocated:</span>
                    <span className="text-blue-300 font-semibold">{formatKES(project.allocatedKES)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono mt-0.5">
                    <span className="text-slate-400">Spent:</span>
                    <span className="text-cyan-300 font-semibold">{formatKES(project.spentKES)}</span>
                  </div>

                  {project.flagNotes && (
                    <div className="mt-2 p-2 rounded bg-rose-950/40 border border-rose-800/50 text-[10px] text-rose-300 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                      <span>{project.flagNotes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
