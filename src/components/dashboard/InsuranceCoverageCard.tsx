import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  ShieldCheck,
  CreditCard,
  Upload,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  FileCheck,
  Building,
  RotateCw,
  Camera,
  X,
  FileText,
  DollarSign,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const InsuranceCoverageCard: React.FC = () => {
  const { patient, uploadInsuranceCard, addToast } = useHealth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCardViewerModal, setShowCardViewerModal] = useState(false);
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');

  // Modal upload state
  const [frontFileUploaded, setFrontFileUploaded] = useState(true);
  const [backFileUploaded, setBackFileUploaded] = useState(true);
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(false);

  const insurance = patient.insuranceDetails || {
    planName: patient.insuranceProvider,
    planType: 'Comprehensive PPO Network',
    memberId: patient.policyNumber,
    groupNumber: patient.groupNumber,
    effectiveDate: '2026-01-01',
    expirationDate: '2026-12-31',
    eligibilityStatus: 'active' as const,
    deductibleMet: 500,
    deductibleTotal: 1500,
    outOfPocketMet: 1200,
    outOfPocketMax: 3500,
    copays: {
      primaryCare: 15,
      specialist: 25,
      telehealth: 0,
      urgentCare: 35,
      emergencyRoom: 150,
      genericRx: 5,
      brandRx: 15,
    },
    rxBin: '004336',
    rxPcn: 'ADV',
    lastCardUploadDate: 'Sep 12, 2026 (Verified)',
  };

  const deductiblePercent = Math.min(
    100,
    Math.round((insurance.deductibleMet / insurance.deductibleTotal) * 100)
  );
  const oopPercent = Math.min(
    100,
    Math.round((insurance.outOfPocketMet / insurance.outOfPocketMax) * 100)
  );

  const handleSimulateOcrUpload = () => {
    setIsOcrScanning(true);
    setTimeout(() => {
      setIsOcrScanning(false);
      setOcrCompleted(true);
      uploadInsuranceCard(
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
      );
      setTimeout(() => {
        setShowUploadModal(false);
        setOcrCompleted(false);
      }, 1000);
    }, 1400);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-base tracking-tight">
                Insurance & Healthcare Coverage
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                Active · Verified In-Network
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {insurance.planName} · Plan: <span className="font-semibold text-slate-700">{insurance.planType}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCardViewerModal(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>View Digital Card</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Card</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Policy Details & Copay Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Member ID & Policy Info (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Member Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                Member ID
              </span>
              <span className="font-bold text-slate-900 font-mono text-xs block mt-0.5">
                {insurance.memberId}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                Group Number
              </span>
              <span className="font-bold text-slate-900 font-mono text-xs block mt-0.5">
                {insurance.groupNumber}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                RxBIN / PCN
              </span>
              <span className="font-bold text-slate-900 font-mono text-xs block mt-0.5">
                {insurance.rxBin} · {insurance.rxPcn}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                Plan Year
              </span>
              <span className="font-bold text-slate-900 font-mono text-xs block mt-0.5">
                2026 Calendar
              </span>
            </div>
          </div>

          {/* Deductible & Out-of-Pocket Maximum Progress Bars */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                Individual Annual Deductible
              </span>
              <span className="font-mono text-slate-600 font-semibold">
                ${insurance.deductibleMet.toLocaleString()} of ${insurance.deductibleTotal.toLocaleString()} met ({deductiblePercent}%)
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${deductiblePercent}%` }}
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                Annual Out-of-Pocket Maximum
              </span>
              <span className="font-mono text-slate-600 font-semibold">
                ${insurance.outOfPocketMet.toLocaleString()} of ${insurance.outOfPocketMax.toLocaleString()} met ({oopPercent}%)
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${oopPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Copay Schedule Grid (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Verified In-Network Copays
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              EDI 271 Validated
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block truncate">Primary Care Visit</span>
              <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                ${insurance.copays.primaryCare}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block truncate">Specialist Consult</span>
              <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                ${insurance.copays.specialist}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block truncate">Telehealth Visit</span>
              <span className="text-base font-extrabold text-emerald-600 font-mono mt-0.5 block">
                ${insurance.copays.telehealth} <span className="text-[10px] font-sans font-bold text-emerald-700">(100% Covered)</span>
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block truncate">Urgent Care</span>
              <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                ${insurance.copays.urgentCare}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block truncate">Generic Meds (Tier 1)</span>
              <span className="text-base font-extrabold text-teal-700 font-mono mt-0.5 block">
                ${insurance.copays.genericRx}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block truncate">Brand Meds (Tier 2)</span>
              <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                ${insurance.copays.brandRx}
              </span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
            <span>Emergency Room Copay: <span className="font-bold text-slate-800 font-mono">${insurance.copays.emergencyRoom}</span></span>
            <span className="italic">Waived if admitted</span>
          </div>
        </div>
      </div>

      {/* Upload Status Footer */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>
            Digital Insurance Card:{' '}
            <span className="font-semibold text-slate-800">
              {insurance.lastCardUploadDate || 'Verified On File'}
            </span>
          </span>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="text-teal-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
        >
          <span>Upload or replace digital insurance card</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Modal 1: Digital Card Viewer (Front / Back Flip) */}
      {showCardViewerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-base">
                  Digital Member Identification Card
                </h4>
              </div>
              <button
                onClick={() => setShowCardViewerModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated High-Res Insurance Card Graphic */}
            <div className="relative w-full aspect-[1.586] rounded-2xl p-5 shadow-xl text-white overflow-hidden transition-all duration-300 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 border border-blue-700/50">
              {cardSide === 'front' ? (
                /* Card Front */
                <div className="h-full flex flex-col justify-between select-none">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono tracking-widest text-blue-300 font-bold block uppercase">
                        BlueCross BlueShield
                      </span>
                      <span className="text-base font-extrabold tracking-tight block">
                        Premier Choice PPO
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center font-bold text-xs text-blue-200">
                      BCBS
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-blue-300 uppercase tracking-wider block font-mono">
                      Subscriber Name
                    </span>
                    <span className="text-lg font-black tracking-wide block">
                      {patient.name.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-700/60 font-mono text-[11px]">
                    <div>
                      <span className="text-[9px] text-blue-300 block uppercase">Member ID</span>
                      <span className="font-bold">{insurance.memberId}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-blue-300 block uppercase">Group #</span>
                      <span className="font-bold">{insurance.groupNumber}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-blue-300 block uppercase">Copay (PCP/Spec)</span>
                      <span className="font-bold">${insurance.copays.primaryCare} / ${insurance.copays.specialist}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Card Back */
                <div className="h-full flex flex-col justify-between select-none text-xs">
                  <div>
                    <span className="font-bold text-xs text-blue-200 block uppercase tracking-wider">
                      Provider & Pharmacy Inquiries
                    </span>
                    <p className="text-[10px] text-blue-100/80 mt-1">
                      Claims: P.O. Box 9820, Portland, OR 97201 · Pre-authorization required for elective inpatient admissions.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-blue-950/40 p-2 rounded-lg border border-blue-700/40">
                    <div>
                      <span className="text-blue-300 block">Member Services:</span>
                      <span className="font-bold">1-800-555-8820</span>
                    </div>
                    <div>
                      <span className="text-blue-300 block">Mental Health:</span>
                      <span className="font-bold">1-800-555-8821</span>
                    </div>
                    <div>
                      <span className="text-blue-300 block">Pharmacist Helpline:</span>
                      <span className="font-bold">1-800-555-8822</span>
                    </div>
                    <div>
                      <span className="text-blue-300 block">RxBIN / PCN:</span>
                      <span className="font-bold">004336 / ADV</span>
                    </div>
                  </div>

                  <div className="text-[9px] text-blue-300/80 text-center font-mono">
                    This card is for identification only and does not guarantee coverage.
                  </div>
                </div>
              )}
            </div>

            {/* Flip toggle and actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Flip to {cardSide === 'front' ? 'Back' : 'Front'} of Card</span>
              </button>

              <button
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Digital Card Ready',
                    message: 'Your insurance card has been saved to your offline cache for clinic reception desk check-ins.',
                  });
                  setShowCardViewerModal(false);
                }}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Upload Digital Insurance Card Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-teal-600" />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Upload Digital Insurance Card
                  </h4>
                  <p className="text-xs text-slate-500">
                    Snap or upload front and back photos for automated OCR verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Front upload box */}
              <div className="p-4 border-2 border-dashed border-teal-300 bg-teal-50/40 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5">
                <Camera className="w-6 h-6 text-teal-600" />
                <span className="font-bold text-slate-900">Front of Insurance Card</span>
                <p className="text-[11px] text-slate-500 max-w-xs">
                  Ensure Member ID, Plan Name, and Subscriber details are clearly visible.
                </p>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-semibold">
                  Sample Front Document Loaded
                </span>
              </div>

              {/* Back upload box */}
              <div className="p-4 border-2 border-dashed border-slate-300 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5">
                <CreditCard className="w-6 h-6 text-slate-500" />
                <span className="font-bold text-slate-900">Back of Insurance Card</span>
                <p className="text-[11px] text-slate-500 max-w-xs">
                  Ensure Claims address and customer service phone numbers are legible.
                </p>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-semibold">
                  Sample Back Document Loaded
                </span>
              </div>

              {isOcrScanning && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2.5 text-blue-900">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="font-semibold text-xs">
                    Running OCR & Validating against EDI 270/271 Real-Time Eligibility Bridge...
                  </span>
                </div>
              )}

              {ocrCompleted && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-xs">
                    Verification Complete! Extracted Member ID #{insurance.memberId}.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Encrypted via HIPAA compliant storage
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isOcrScanning}
                  onClick={handleSimulateOcrUpload}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Scan & Save Digital Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
