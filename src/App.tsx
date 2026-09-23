import React, { useState } from 'react';
import { KENYA_26_COUNTIES } from './data/countiesData';
import { CountyHealthData, SecureTipSubmission } from './types';
import { Header } from './components/Header';
import { KenyaCountyMap } from './components/KenyaCountyMap';
import { CountyDetailCard } from './components/CountyDetailCard';
import { PromisedVsDeliveredSection } from './components/PromisedVsDeliveredSection';
import { HealthTrendsSection } from './components/HealthTrendsSection';
import { JournalistContentWidgets } from './components/JournalistContentWidgets';
import { SecureReportingModal } from './components/SecureReportingModal';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  HeartHandshake, 
  Share2, 
  Radio, 
  FileText,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

const INITIAL_TIPS: SecureTipSubmission[] = [
  {
    id: 'tip-101',
    countyId: '001',
    countyName: 'Mandera',
    facility: 'Elwak Sub-County Hospital',
    category: 'Ghost Maternity Ward',
    incidentDate: '2024-02-18',
    description: 'Contractor abandoned the 40-bed maternal theater in November after receiving 65% upfront mobilization payment. Expectant mothers are sharing two labor beds in the old colonial dispensary.',
    evidenceFilesCount: 4,
    urgency: 'Breaking Lead',
    verificationHash: 'WW-KE-9B2F44-A01',
    submittedAt: '2024-03-02',
    status: 'Verified',
  },
  {
    id: 'tip-102',
    countyId: '019',
    countyName: 'Kakamega',
    facility: 'Kakamega County Teaching Hospital',
    category: 'Equipment Tampering',
    incidentDate: '2024-03-01',
    description: '14 newborn incubators delivered under the Level 6 maternal grant remain locked in exterior shipping containers. Hospital administration cited delayed power sub-station installation.',
    evidenceFilesCount: 2,
    urgency: 'Urgent',
    verificationHash: 'WW-KE-18CD90-E54',
    submittedAt: '2024-03-10',
    status: 'Verified',
  },
  {
    id: 'tip-103',
    countyId: '016',
    countyName: 'Homa Bay',
    facility: 'Mfangano Island Health Centre',
    category: 'Fund Diversion',
    incidentDate: '2024-02-28',
    description: 'Boat ambulance fuel budget of KES 450,000 for January/February was diverted. Midwives had to pool personal funds to transport a mother with postpartum hemorrhage across Lake Victoria.',
    evidenceFilesCount: 3,
    urgency: 'Breaking Lead',
    verificationHash: 'WW-KE-7728AF-F12',
    submittedAt: '2024-03-12',
    status: 'Verified',
  },
];

export default function App() {
  const [counties, setCounties] = useState<CountyHealthData[]>(KENYA_26_COUNTIES);
  const [selectedCounty, setSelectedCounty] = useState<CountyHealthData>(KENYA_26_COUNTIES[0]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'on-track' | 'lagging'>('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [tips, setTips] = useState<SecureTipSubmission[]>(INITIAL_TIPS);
  const [activeSection, setActiveSection] = useState<'overview' | 'finances' | 'trends' | 'journalism'>('overview');

  const handleSelectCounty = (county: CountyHealthData) => {
    setSelectedCounty(county);
    // Smooth scroll to details on mobile if needed
  };

  const handleSelectCountyByName = (name: string) => {
    const found = counties.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (found) setSelectedCounty(found);
  };

  const handleTipSubmitted = (newTip: SecureTipSubmission) => {
    setTips((prev) => [newTip, ...prev]);
    // Also increment county whistleblower alert count
    setCounties((prev) =>
      prev.map((c) =>
        c.id === newTip.countyId
          ? { ...c, whistleblowerAlertsCount: c.whistleblowerAlertsCount + 1 }
          : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Top Sticky Header */}
      <Header
        counties={counties}
        selectedCounty={selectedCounty}
        onSelectCounty={handleSelectCounty}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Primary Navigation Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 lg:px-8 py-2 sticky top-[61px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-tab-overview"
              onClick={() => setActiveSection('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeSection === 'overview'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              1. Geospatial Map & Focus
            </button>
            <button
              id="nav-tab-finances"
              onClick={() => setActiveSection('finances')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeSection === 'finances'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              2. Promised vs Delivered Budgets
            </button>
            <button
              id="nav-tab-trends"
              onClick={() => setActiveSection('trends')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeSection === 'trends'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              3. Health Trends & Correlation
            </button>
            <button
              id="nav-tab-journalism"
              onClick={() => setActiveSection('journalism')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeSection === 'journalism'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              4. Journalist & Editor Toolkit
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>26 Pilot Counties</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">10 On Track</span>
            <span>•</span>
            <span className="text-rose-400 font-semibold">16 Lagging</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-8">
        {/* Section 1: Geospatial Dark Blue Map & Selected County Card */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Kenya County Map with all counties shaded in dark blue */}
              <div className="lg:col-span-7">
                <KenyaCountyMap
                  counties={counties}
                  selectedCounty={selectedCounty}
                  onSelectCounty={handleSelectCounty}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                />
              </div>

              {/* Right Column: Selected County Deep-Dive Card */}
              <div className="lg:col-span-5">
                <CountyDetailCard
                  county={selectedCounty}
                  onOpenReportModal={() => setIsReportModalOpen(true)}
                />
              </div>
            </div>

            {/* Quick summary of Promised vs Delivered below the map */}
            <PromisedVsDeliveredSection
              counties={counties}
              selectedCounty={selectedCounty}
              onSelectCounty={handleSelectCounty}
            />

            {/* Journalist Content Suite */}
            <JournalistContentWidgets
              selectedCounty={selectedCounty}
              onSelectCountyByName={handleSelectCountyByName}
            />
          </div>
        )}

        {/* Section 2: Full Promised vs Delivered Budgets */}
        {activeSection === 'finances' && (
          <div className="space-y-6">
            <PromisedVsDeliveredSection
              counties={counties}
              selectedCounty={selectedCounty}
              onSelectCounty={handleSelectCounty}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CountyDetailCard
                county={selectedCounty}
                onOpenReportModal={() => setIsReportModalOpen(true)}
              />
              <KenyaCountyMap
                counties={counties}
                selectedCounty={selectedCounty}
                onSelectCounty={handleSelectCounty}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            </div>
          </div>
        )}

        {/* Section 3: Maternal & Newborn Health Trends */}
        {activeSection === 'trends' && (
          <div className="space-y-6">
            <HealthTrendsSection
              counties={counties}
              selectedCounty={selectedCounty}
              onSelectCounty={handleSelectCounty}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CountyDetailCard
                county={selectedCounty}
                onOpenReportModal={() => setIsReportModalOpen(true)}
              />
              <PromisedVsDeliveredSection
                counties={counties}
                selectedCounty={selectedCounty}
                onSelectCounty={handleSelectCounty}
              />
            </div>
          </div>
        )}

        {/* Section 4: Journalist & Editor Toolkit */}
        {activeSection === 'journalism' && (
          <div className="space-y-6">
            <JournalistContentWidgets
              selectedCounty={selectedCounty}
              onSelectCountyByName={handleSelectCountyByName}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CountyDetailCard
                county={selectedCounty}
                onOpenReportModal={() => setIsReportModalOpen(true)}
              />
              <KenyaCountyMap
                counties={counties}
                selectedCounty={selectedCounty}
                onSelectCounty={handleSelectCounty}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 px-4 lg:px-8 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <span className="font-bold text-white">Wallet & Womb</span>
            <span>—</span>
            <span>Kenya Maternal & Newborn Health Spending Accountability Initiative</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>26 Counties Tracked</span>
            <span>•</span>
            <span>Data: Controller of Budget & KDHS 2022</span>
            <span>•</span>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Whistleblower Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Whistleblower & Secure Reporting Modal */}
      <SecureReportingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        counties={counties}
        selectedCounty={selectedCounty}
        onTipSubmitted={handleTipSubmitted}
        existingTips={tips}
      />
    </div>
  );
}
