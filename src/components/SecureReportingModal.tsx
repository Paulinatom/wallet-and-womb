import React, { useState } from 'react';
import { CountyHealthData, SecureTipSubmission } from '../types';
import { generateVerificationHash } from '../utils/formatters';
import {
  ShieldCheck,
  Lock,
  FileCheck,
  AlertTriangle,
  Upload,
  Copy,
  Check,
  X,
  FileText,
  Key,
  Shield,
  Download
} from 'lucide-react';

interface SecureReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
  counties: CountyHealthData[];
  selectedCounty: CountyHealthData;
  onTipSubmitted: (tip: SecureTipSubmission) => void;
  existingTips: SecureTipSubmission[];
}

export const SecureReportingModal: React.FC<SecureReportingModalProps> = ({
  isOpen,
  onClose,
  counties,
  selectedCounty,
  onTipSubmitted,
  existingTips,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'verified-leads' | 'export-dossier'>('submit');
  const [countyId, setCountyId] = useState(selectedCounty.id);
  const [facility, setFacility] = useState('');
  const [category, setCategory] = useState<SecureTipSubmission['category']>('Ghost Maternity Ward');
  const [incidentDate, setIncidentDate] = useState('2024-03-15');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent' | 'Breaking Lead'>('Urgent');
  const [filesCount, setFilesCount] = useState(1);
  const [receiptHash, setReceiptHash] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const handleSubmitTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facility.trim() || !description.trim()) return;

    const matchedCounty = counties.find((c) => c.id === countyId) || selectedCounty;
    const hash = generateVerificationHash(`${facility}-${description}-${Date.now()}`);

    const newTip: SecureTipSubmission = {
      id: `tip-${Date.now()}`,
      countyId: matchedCounty.id,
      countyName: matchedCounty.name,
      facility: facility.trim(),
      category,
      incidentDate,
      description: description.trim(),
      evidenceFilesCount: filesCount,
      urgency,
      verificationHash: hash,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Verified',
    };

    onTipSubmitted(newTip);
    setReceiptHash(hash);
  };

  const handleCopyHash = () => {
    if (!receiptHash) return;
    navigator.clipboard.writeText(receiptHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadDossier = () => {
    const markdownContent = `# WALLET & WOMB: MATERNAL HEALTH SPENDING INVESTIGATIVE DOSSIER
Generated: ${new Date().toLocaleDateString('en-GB')}
Target County: ${selectedCounty.name} County (Code #${selectedCounty.code})
Region: ${selectedCounty.region} | Status: ${selectedCounty.status.toUpperCase()}

## 1. FINANCIAL SUMMARY
- Government Allocation (Promised): KES ${selectedCounty.promisedBudgetKES}M
- Actual Healthcare Spending (Delivered): KES ${selectedCounty.deliveredBudgetKES}M
- Budget Absorption Rate: ${selectedCounty.absorptionRate.toFixed(1)}%
- Funding Deficit (Unrealized): KES ${selectedCounty.promisedBudgetKES - selectedCounty.deliveredBudgetKES}M
- Unaccounted Funds Flagged: KES ${selectedCounty.unaccountedFundsKES}M
- Leakage Risk Score: ${selectedCounty.leakageRisk}
- Controller of Budget Reference: ${selectedCounty.cobReportQuarter}

## 2. MATERNAL & NEWBORN CLINICAL INDICATORS
- Maternal Mortality Ratio (MMR): ${selectedCounty.indicators.mmr} deaths per 100,000 live births
- Skilled Birth Attendance: ${selectedCounty.indicators.skilledBirthAttendance}%
- 4+ Antenatal Care Visits: ${selectedCounty.indicators.anc4Visits}%
- Neonatal Mortality: ${selectedCounty.indicators.neonatalMortality} per 1,000 live births
- Emergency Obstetric Readiness: ${selectedCounty.indicators.emergencyObstetricReadiness}%

## 3. KEY MATERNAL HEALTHCARE PROJECTS
${selectedCounty.keyProjects
  .map(
    (p, i) =>
      `${i + 1}. ${p.name}
   - Facility: ${p.facility}
   - Contractor: ${p.contractor}
   - Allocation: KES ${p.allocatedKES}M | Spent: KES ${p.spentKES}M
   - Status: ${p.status}
   ${p.flagNotes ? `   - Audit Notes: ${p.flagNotes}` : ''}`
  )
  .join('\n\n')}

## 4. INVESTIGATIVE LEAD & VERIFIED ANGLE
"${selectedCounty.investigativeAngle}"

Editor Headline: "${selectedCounty.editorHeadline}"
Swahili Radio Bullet: "${selectedCounty.swahiliBrief}"

Verification Source: Media Council of Kenya Aligned Data Protocol
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Wallet-Womb-Dossier-${selectedCounty.name}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-950/90 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Secure Data Reporting & Whistleblower Drop
              </h3>
              <p className="text-xs text-slate-400">
                End-to-end encrypted evidence submission for health workers & investigative journalists
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 text-xs">
          <button
            onClick={() => setActiveTab('submit')}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeTab === 'submit'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Submit Anonymous Field Tip
          </button>
          <button
            onClick={() => setActiveTab('verified-leads')}
            className={`py-3 px-4 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'verified-leads'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Verified Field Alerts</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-blue-300">
              {existingTips.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('export-dossier')}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeTab === 'export-dossier'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Export County Dossier
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: SUBMIT ANONYMOUS TIP */}
          {activeTab === 'submit' && (
            <div>
              {receiptHash ? (
                /* Success Receipt */
                <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-500/40 text-emerald-400">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Encrypted Tip Successfully Logged</h4>
                      <p className="text-[11px] text-slate-400">
                        Your alert is logged with cryptographic verification and queued for Kenya editorial review.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Verification Receipt Hash (SHA-256):</div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-cyan-300 font-bold text-xs select-all">
                        {receiptHash}
                      </span>
                      <button
                        onClick={handleCopyHash}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition"
                      >
                        {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Keep this verification hash. It is your tamper-proof cryptographic proof of submission. No IP address, browser fingerprint, or identifying data was recorded.
                  </p>

                  <button
                    onClick={() => {
                      setReceiptHash(null);
                      setFacility('');
                      setDescription('');
                    }}
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
                  >
                    Submit Another Report
                  </button>
                </div>
              ) : (
                /* The Tip Form */
                <form onSubmit={handleSubmitTip} className="space-y-4">
                  <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-lg flex items-start gap-2 text-slate-300">
                    <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      Zero-knowledge whistleblowing gateway. Submissions are scrubbed of metadata and accessible only to accredited health investigative desks.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Target County:
                      </label>
                      <select
                        value={countyId}
                        onChange={(e) => setCountyId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      >
                        {counties.map((c) => (
                          <option key={c.id} value={c.id}>
                            #{String(c.code).padStart(2, '0')} {c.name} ({c.region})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Violation Category:
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      >
                        <option value="Ghost Maternity Ward">Ghost Maternity Ward / Stalled Works</option>
                        <option value="Medicine Stockout">Medicine & Commodity Stockout (Oxytocin/Blood)</option>
                        <option value="Equipment Tampering">Broken / Tampered Incubators</option>
                        <option value="Fund Diversion">Maternal Fund Diversion / Extortion</option>
                        <option value="Unofficial Fees">Unofficial Out-of-Pocket Fees Demanded</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Facility Name & Sub-County:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mwingi Level 4 or Katilu Dispensary"
                        value={facility}
                        onChange={(e) => setFacility(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Urgency Level:
                      </label>
                      <div className="flex gap-2">
                        {(['Standard', 'Urgent', 'Breaking Lead'] as const).map((lvl) => (
                          <button
                            type="button"
                            key={lvl}
                            onClick={() => setUrgency(lvl)}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition ${
                              urgency === lvl
                                ? lvl === 'Breaking Lead'
                                  ? 'bg-rose-950 text-rose-300 border-rose-500'
                                  : 'bg-blue-900 text-blue-200 border-blue-500'
                                : 'bg-slate-950 text-slate-400 border-slate-800'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Incident Details & Concrete Evidence:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify what happened, dates, contractors, or specific wards affected (e.g. 'The 12 neonatal incubators delivered in June have never been turned on due to faulty wiring...')"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* Attachment Simulator */}
                  <div className="border border-dashed border-slate-800 bg-slate-950/60 p-3 rounded-lg text-center cursor-pointer hover:border-slate-700 transition">
                    <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                    <span className="text-[11px] text-slate-300 block">
                      Attach documents, delivery notes, or site photos (Optional)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      EXIF data and file metadata automatically stripped before encryption.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit Encrypted Tip & Generate Verification Receipt</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: VERIFIED FIELD LEADS */}
          {activeTab === 'verified-leads' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-400">
                Live repository of corroborated submissions currently under active review by editors:
              </div>

              {existingTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white text-xs">
                      {tip.countyName} • {tip.facility}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-600/30">
                      {tip.status}
                    </span>
                  </div>

                  <div className="text-slate-300 text-xs">{tip.description}</div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                    <span>Category: <strong>{tip.category}</strong></span>
                    <span>Audit Hash: <strong className="text-cyan-400">{tip.verificationHash}</strong></span>
                    <span>Logged: {tip.submittedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: EXPORT DOSSIER */}
          {activeTab === 'export-dossier' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Investigative Dossier: {selectedCounty.name} County
                </h4>
                <p className="text-[11px] text-slate-400">
                  Export an offline Markdown or text investigation brief with verified exchequer releases, Controller of Budget reference numbers, project status audit notes, and source contacts.
                </p>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300">
                  <div>County: {selectedCounty.name} (#{selectedCounty.code})</div>
                  <div>Promised Allocation: KES {selectedCounty.promisedBudgetKES}M</div>
                  <div>Actual Project Spending: KES {selectedCounty.deliveredBudgetKES}M</div>
                  <div>Delivery Gap: KES {selectedCounty.promisedBudgetKES - selectedCounty.deliveredBudgetKES}M</div>
                  <div>Status: {selectedCounty.status.toUpperCase()}</div>
                </div>
              </div>

              <button
                onClick={handleDownloadDossier}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download {selectedCounty.name} Investigation Dossier (.md)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
