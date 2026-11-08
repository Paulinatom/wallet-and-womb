import React, { useState, useMemo } from 'react';
import { 
  COUNTIES_FINAL_DATA, 
  DEFAULT_YEAR, 
  AVAILABLE_YEARS, 
  getCountiesForYear 
} from './data/countiesData';
import { CountyHealthData, SecureTipSubmission } from './types';
import { Header } from './components/Header';
import { KenyaCountyMap } from './components/KenyaCountyMap';
import { CountyDetailCard } from './components/CountyDetailCard';
import { StoryBoardSection } from './components/StoryBoardSection';
import { LiveSurveillanceEweneSection } from './components/LiveSurveillanceEweneSection';
import { DataSourcesSection } from './components/DataSourcesSection';
import { SecureReportingModal } from './components/SecureReportingModal';
import { MapPin, Database, Newspaper, Radio } from 'lucide-react';

const INITIAL_TIPS: SecureTipSubmission[] = [
  {
    id: 'tip-101',
    countyId: '001',
    countyName: 'Migori',
    facility: 'Migori County Referral Hospital',
    category: 'Unreported Spending',
    incidentDate: '2024-03-02',
    description: 'Q4 actual spending reported in source schedule is low compared to facility-level procurement vouchers for essential drugs.',
    evidenceFilesCount: 2,
    urgency: 'Breaking Lead',
    verificationHash: 'WW-KE-9B2F44-A01',
    submittedAt: '2024-03-02',
    status: 'Pending Review',
  },
  {
    id: 'tip-102',
    countyId: '003',
    countyName: 'Mombasa',
    facility: 'Coast General Teaching & Referral Hospital',
    category: 'Fund Diversion',
    incidentDate: '2024-03-01',
    description: 'Development health spending reached only 13% of approved estimates; theater renovation delayed while recurrent administration costs exceeded 90%.',
    evidenceFilesCount: 1,
    urgency: 'Urgent',
    verificationHash: 'WW-KE-18CD90-E54',
    submittedAt: '2024-03-10',
    status: 'Pending Review',
  },
  {
    id: 'tip-103',
    countyId: '012',
    countyName: 'Homa Bay',
    facility: 'Mfangano Island Health Centre',
    category: 'Medicine Stockout',
    incidentDate: '2024-02-28',
    description: 'Facility Improvement Fund (FIF) hospital retention delayed, causing emergency medicine stockouts in lake island dispensaries.',
    evidenceFilesCount: 3,
    urgency: 'Breaking Lead',
    verificationHash: 'WW-KE-7728AF-F12',
    submittedAt: '2024-03-12',
    status: 'Pending Review',
  },
];

export default function App() {
  // Requirement 1: Financial year dropdown with FY2022/23, FY2023/24, FY2024/25, FY2025/26 (default FY2023/24)
  const [selectedYear, setSelectedYear] = useState<string>(DEFAULT_YEAR);
  const [selectedCountyId, setSelectedCountyId] = useState<string>('001');
  const [statusFilter, setStatusFilter] = useState<'all' | 'on-track' | 'lagging' | 'data-incomplete' | 'partial'>('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [tips, setTips] = useState<SecureTipSubmission[]>(INITIAL_TIPS);

  // Requirement 4: Tabs only: Map & Focus, Story Board, Live Surveillance (ewene), Data & Sources
  const [activeTab, setActiveTab] = useState<'map-focus' | 'story-board' | 'live-surveillance' | 'data-sources'>('map-focus');

  // Requirement 1: When the year changes, update everything from counties[].years[year]
  const countiesForCurrentYear = useMemo(() => {
    return getCountiesForYear(selectedYear);
  }, [selectedYear]);

  // Year summary for current year
  const currentYearSummary = useMemo(() => {
    return COUNTIES_FINAL_DATA.yearSummary[selectedYear];
  }, [selectedYear]);

  // Active selected county in currently selected year
  const selectedCounty = useMemo(() => {
    return (
      countiesForCurrentYear.find((c) => c.id === selectedCountyId) ||
      countiesForCurrentYear[0]
    );
  }, [countiesForCurrentYear, selectedCountyId]);

  const handleSelectCounty = (county: CountyHealthData) => {
    setSelectedCountyId(county.id);
  };

  const handleSelectCountyByName = (countyName: string) => {
    const found = countiesForCurrentYear.find(
      (c) => c.name.toLowerCase() === countyName.toLowerCase()
    );
    if (found) {
      setSelectedCountyId(found.id);
    }
  };

  const handleTipSubmitted = (newTip: SecureTipSubmission) => {
    setTips((prev) => [newTip, ...prev]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans selection:bg-neutral-800 selection:text-neutral-100">
      {/* Top Header: Title, single status line with counts, FY dropdown, county selector, Tip Drop button */}
      <Header
        counties={countiesForCurrentYear}
        selectedCounty={selectedCounty}
        onSelectCounty={handleSelectCounty}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        selectedYear={selectedYear}
        onSelectYear={(yr) => setSelectedYear(yr)}
        availableYears={AVAILABLE_YEARS}
        yearSummary={currentYearSummary}
      />

      {/* Navigation Bar: Exactly 4 Tabs */}
      <nav className="bg-neutral-900 border-b border-neutral-800 px-4 lg:px-8 py-2 sticky top-[57px] z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5">
            {/* Tab 1: Map & Focus */}
            <button
              id="tab-map-focus"
              onClick={() => setActiveTab('map-focus')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === 'map-focus'
                  ? 'bg-neutral-800 text-neutral-100 border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <MapPin className="w-4 h-4 text-neutral-400" />
              <span>Map & Focus</span>
            </button>

            {/* Tab 2: Story Board */}
            <button
              id="tab-story-board"
              onClick={() => setActiveTab('story-board')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === 'story-board'
                  ? 'bg-neutral-800 text-neutral-100 border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Newspaper className="w-4 h-4 text-neutral-400" />
              <span>Story Board</span>
              {currentYearSummary?.topLeads?.length > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[13px] bg-neutral-950 text-neutral-300 font-semibold border border-neutral-800">
                  {currentYearSummary.topLeads.length}
                </span>
              )}
            </button>

            {/* Tab 3: Live Surveillance (ewene): not connected (Requirement 5) */}
            <button
              id="tab-live-surveillance"
              onClick={() => setActiveTab('live-surveillance')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === 'live-surveillance'
                  ? 'bg-neutral-800 text-neutral-100 border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Radio className="w-4 h-4 text-neutral-400" />
              <span>Live Surveillance (ewene): not connected</span>
            </button>

            {/* Tab 4: Data & Sources */}
            <button
              id="tab-data-sources"
              onClick={() => setActiveTab('data-sources')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === 'data-sources'
                  ? 'bg-neutral-800 text-neutral-100 border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Database className="w-4 h-4 text-neutral-400" />
              <span>Data & Sources</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[13px] text-neutral-400 font-medium">
            <span>26 Priority Counties</span>
            <span>·</span>
            <span className="text-neutral-200 font-bold">{selectedYear}</span>
            {currentYearSummary?.totalPromisedAllCounties && (
              <>
                <span>·</span>
                <span>
                  Total Approved: KES {Number(currentYearSummary.totalPromisedAllCounties).toLocaleString()}M
                </span>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6">
        {/* TAB 1: Map & Focus */}
        {activeTab === 'map-focus' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Kenya Map with Layer Toggle (7 Cols) */}
            <div className="lg:col-span-7">
              <KenyaCountyMap
                counties={countiesForCurrentYear}
                selectedCounty={selectedCounty}
                onSelectCounty={handleSelectCounty}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                selectedYear={selectedYear}
              />
            </div>

            {/* County Detail Card with Possible story leads (5 Cols) */}
            <div className="lg:col-span-5">
              <CountyDetailCard
                county={selectedCounty}
                selectedYear={selectedYear}
                onOpenReportModal={() => setIsReportModalOpen(true)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Story Board (Requirement 2) */}
        {activeTab === 'story-board' && (
          <StoryBoardSection
            topLeads={currentYearSummary?.topLeads || []}
            selectedYear={selectedYear}
            onSelectCountyByName={handleSelectCountyByName}
            onNavigateToMap={() => setActiveTab('map-focus')}
          />
        )}

        {/* TAB 3: Live Surveillance (ewene): not connected (Requirement 5) */}
        {activeTab === 'live-surveillance' && (
          <LiveSurveillanceEweneSection
            counties={countiesForCurrentYear}
            selectedCounty={selectedCounty}
            onSelectCounty={handleSelectCounty}
            selectedYear={selectedYear}
          />
        )}

        {/* TAB 4: Data & Sources */}
        {activeTab === 'data-sources' && <DataSourcesSection />}
      </main>

      {/* Requirement 6: Mandatory exact footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-5 px-4 lg:px-8 text-[13px] text-neutral-400 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p>
            Preliminary data, being verified against Controller of Budget reports. County health budgets, not maternal-specific spending. Survey data: Kenya Mini DHS 2025-26.
          </p>
        </div>
      </footer>

      {/* Tip Drop Modal */}
      <SecureReportingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        counties={countiesForCurrentYear}
        selectedCounty={selectedCounty}
        onTipSubmitted={handleTipSubmitted}
        existingTips={tips}
      />
    </div>
  );
}
