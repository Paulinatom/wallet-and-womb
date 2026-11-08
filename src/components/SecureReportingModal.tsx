import React, { useState } from 'react';
import { CountyHealthData, SecureTipSubmission } from '../types';
import { generateVerificationHash } from '../utils/formatters';
import {
  X,
  Send,
  EyeOff,
  Check,
  Copy,
  FileCheck2,
  UploadCloud
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
  const [activeTab, setActiveTab] = useState<'submit' | 'recent-reports'>('submit');
  const [countyId, setCountyId] = useState(selectedCounty.id);
  const [facility, setFacility] = useState('');
  const [category, setCategory] = useState<SecureTipSubmission['category']>('Unreported Spending');
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
      status: 'Pending Review',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-100">
              Confidential Tip Drop
            </h3>
            <p className="text-[13px] text-neutral-400">
              Direct reporting workspace for healthcare spending leads
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-800 bg-neutral-950 px-6 gap-3 text-[13px]">
          <button
            onClick={() => setActiveTab('submit')}
            className={`py-3 px-2 font-medium border-b-2 transition ${
              activeTab === 'submit'
                ? 'border-neutral-200 text-neutral-100 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Submit Field Lead
          </button>
          <button
            onClick={() => setActiveTab('recent-reports')}
            className={`py-3 px-2 font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'recent-reports'
                ? 'border-neutral-200 text-neutral-100 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>Filed Reports</span>
            <span className="px-2 py-0.5 rounded-full text-[13px] bg-neutral-800 text-neutral-300">
              {existingTips.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'submit' && (
            <div>
              {receiptHash ? (
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-200 flex items-center justify-center mx-auto">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-neutral-100">Confidential Report Logged</h4>
                    <p className="text-[13px] text-neutral-400 mt-1 max-w-md mx-auto">
                      Your tip has been logged into the reporting queue for newsroom follow-up.
                    </p>
                  </div>

                  <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-800 text-[13px] font-mono max-w-md mx-auto">
                    <div className="text-neutral-400 mb-1">Receipt Hash:</div>
                    <div className="text-neutral-200 break-all select-all font-semibold">{receiptHash}</div>
                  </div>

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={handleCopyHash}
                      className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[13px] font-medium text-neutral-200 flex items-center gap-2 transition"
                    >
                      {copiedHash ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedHash ? 'Hash Copied' : 'Copy Hash'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setReceiptHash(null);
                        setFacility('');
                        setDescription('');
                      }}
                      className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[13px] font-medium text-neutral-100 transition"
                    >
                      Submit Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitTip} className="space-y-4 text-[13px]">
                  <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 flex items-start gap-2.5">
                    <EyeOff className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong>Source Protection:</strong> Submissions are processed without personal trackers or device identifiers.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">
                        Target County
                      </label>
                      <select
                        value={countyId}
                        onChange={(e) => setCountyId(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-neutral-500"
                      >
                        {counties.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} County
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">
                        Health Facility / Ward
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sub-County Hospital, Level 3 Center"
                        value={facility}
                        onChange={(e) => setFacility(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-neutral-500"
                      >
                        <option value="Unreported Spending">Unreported / Missing Spending</option>
                        <option value="Medicine Stockout">Medicine & Supply Stockout</option>
                        <option value="Equipment Tampering">Medical Equipment Non-Operation</option>
                        <option value="Fund Diversion">County Health Fund Diversion</option>
                        <option value="Unofficial Fees">Unofficial User Fees</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">
                        Date Observed
                      </label>
                      <input
                        type="date"
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">
                      Description & Evidence Summary
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide specific details, dates, and facility units..."
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">
                        Supporting Files Attached
                      </label>
                      <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-700 rounded-lg p-2 px-3">
                        <UploadCloud className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-300">{filesCount} file(s) attached</span>
                        <button
                          type="button"
                          onClick={() => setFilesCount((c) => Math.min(c + 1, 5))}
                          className="ml-auto text-[13px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                        >
                          + Add File
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 font-medium">
                        Priority Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Standard', 'Urgent', 'Breaking Lead'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setUrgency(lvl)}
                            className={`p-2 rounded-lg text-center font-medium transition ${
                              urgency === lvl
                                ? 'bg-neutral-800 text-neutral-100 border border-neutral-600'
                                : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-neutral-100 hover:bg-white text-neutral-900 font-bold flex items-center gap-2 shadow"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Lead</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'recent-reports' && (
            <div className="space-y-3">
              <div className="text-[13px] text-neutral-400 pb-2 border-b border-neutral-800">
                Logged reports from health facilities
              </div>

              {existingTips.map((tip) => (
                <div key={tip.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-[13px] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-100">{tip.countyName} County</span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-neutral-300">{tip.facility}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[13px] bg-neutral-900 text-neutral-300 border border-neutral-700">
                      {tip.category}
                    </span>
                  </div>

                  <p className="text-neutral-300 leading-relaxed bg-neutral-900/60 p-2.5 rounded border border-neutral-800">
                    "{tip.description}"
                  </p>

                  <div className="text-[13px] text-neutral-400">
                    Filed: {tip.submittedAt}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
