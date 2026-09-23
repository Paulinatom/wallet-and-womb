import React, { useState } from 'react';
import { CountyHealthData, StoryPitch } from '../types';
import { STORY_PITCHES } from '../data/countiesData';
import { formatKES } from '../utils/formatters';
import {
  Newspaper,
  Radio,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Flame,
  PhoneCall,
  UserCheck,
  Download,
  Share2,
  Sparkles,
  BookmarkPlus
} from 'lucide-react';

interface JournalistWidgetsProps {
  selectedCounty: CountyHealthData;
  onSelectCountyByName: (name: string) => void;
}

export const JournalistContentWidgets: React.FC<JournalistWidgetsProps> = ({
  selectedCounty,
  onSelectCountyByName,
}) => {
  const [activePitchIndex, setActivePitchIndex] = useState(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const selectedPitch = STORY_PITCHES[activePitchIndex];

  return (
    <div id="journalist-content-toolkit" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Newspaper className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base lg:text-lg font-bold text-white tracking-wide">
              Journalist & Editor Content Suite
            </h3>
            <p className="text-xs text-slate-400">
              Localized investigative leads, Swahili radio bulletins, and source files for Kenyan newsrooms
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-blue-950/80 border border-blue-500/30 text-blue-300">
          Newsroom Edition • Media Council of Kenya Aligned
        </span>
      </div>

      {/* Grid of Localized Journalist Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Curated Investigative Story Pitches & Hooks */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-rose-500" /> High-Impact Story Pitches
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800/40">
                {selectedPitch.urgency}
              </span>
            </div>

            {/* Pitch Selector Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 border-b border-slate-800">
              {STORY_PITCHES.map((pitch, idx) => (
                <button
                  key={pitch.id}
                  onClick={() => setActivePitchIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    activePitchIndex === idx
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pitch.county} • {pitch.tag}
                </button>
              ))}
            </div>

            {/* Active Pitch Body */}
            <div className="space-y-3">
              <h4 className="text-base lg:text-lg font-bold text-white font-serif leading-snug">
                "{selectedPitch.headline}"
              </h4>

              <p className="text-xs lg:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="font-semibold text-blue-400 font-mono text-xs uppercase block mb-1">
                  The Editorial Hook:
                </span>
                {selectedPitch.hook}
              </p>

              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Verified Data Points for Publication:
                </span>
                <ul className="space-y-1">
                  {selectedPitch.keyDataPoints.map((point, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              Assigned Desk: <strong className="text-slate-200">{selectedPitch.suggestedDesk}</strong>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(`${selectedPitch.headline}\n\n${selectedPitch.hook}\n\nKey Data Points:\n${selectedPitch.keyDataPoints.join('\n')}`, 'pitch')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition text-xs font-medium"
              >
                {copiedSection === 'pitch' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Lead</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Story Memo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Widget 2: Localized Radio News Bite ("Dondoo za Redio" - Swahili + English) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                <Radio className="w-4 h-4 text-emerald-400" /> Dondoo za Redio (Swahili News Bites)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                Taarifa Fupi
              </span>
            </div>

            <div className="text-[11px] text-slate-400 mb-2">
              Ready for broadcast newsreaders (Radio Citizen, Radio Taifa, Milele FM, KBC Idhaa ya Taifa):
            </div>

            {/* Swahili Audio Script / Reading Prompt */}
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg text-xs leading-relaxed text-slate-200 font-serif italic relative">
              "{selectedCounty.swahiliBrief}"
              <div className="mt-2 pt-2 border-t border-slate-800/80 not-italic font-mono text-[10px] text-slate-400">
                Kaunti: <strong>{selectedCounty.name} (#{selectedCounty.code})</strong> | Hali: {selectedCounty.status === 'on-track' ? 'Inafanya Vizuri (Kijani)' : 'Inachelewa (Nyekundu)'}
              </div>
            </div>

            {/* English Quick Grab Lead */}
            <div className="mt-3">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                English Broadcast Lead:
              </span>
              <p className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded border border-slate-800/60">
                "{selectedCounty.editorHeadline}"
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-[11px] text-slate-400 font-mono">Word count: ~45 words (20s on air)</span>
            <button
              onClick={() => handleCopy(`${selectedCounty.swahiliBrief}\n\nEnglish: ${selectedCounty.editorHeadline}`, 'swahili')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/40 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition"
            >
              {copiedSection === 'swahili' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kimenakiliwa</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Nakili Dondoo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Journalist Source Directory & County Deep-Dive Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Verified Source Rolodex: {selectedCounty.name} County
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Audit Quarter: {selectedCounty.cobReportQuarter}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* CEC Health */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg">
            <div className="text-[10px] text-slate-400 uppercase font-mono">County Executive Committee Member (CEC Health)</div>
            <div className="font-bold text-white text-sm mt-1">{selectedCounty.keySources.cecHealth}</div>
            <div className="text-slate-400 mt-1 flex items-center gap-1 text-[11px]">
              <PhoneCall className="w-3 h-3 text-cyan-400" /> Official Ministry Directory
            </div>
            <div className="mt-2 text-[10px] text-blue-300/90 italic">
              Status: {selectedCounty.keySources.contactNote}
            </div>
          </div>

          {/* Controller of Budget / Oversight Reference */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Statutory Audit Citation</div>
            <div className="font-bold text-cyan-300 text-sm mt-1">{selectedCounty.cobReportQuarter}</div>
            <div className="text-slate-400 mt-1 text-[11px]">
              Unaccounted/Delayed: <strong className="text-rose-400 font-mono">{formatKES(selectedCounty.unaccountedFundsKES)}</strong>
            </div>
            <div className="mt-2 text-[10px] text-slate-400">
              Audit Risk Level: <span className="font-bold text-white">{selectedCounty.leakageRisk}</span>
            </div>
          </div>

          {/* Whistleblower Submissions Tracker */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Grassroots Whistleblower Tips</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-amber-300 font-mono">
                  {selectedCounty.whistleblowerAlertsCount}
                </span>
                <span className="text-[11px] text-slate-300">Verified field alerts on file</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Submissions from nurses, clinical officers, and patient families.
              </p>
            </div>
            <div className="mt-2 text-[10px] text-emerald-400 font-medium">
              Tamper-proof SHA-256 logs protected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
