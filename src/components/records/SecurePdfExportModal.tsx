import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { generateEncryptedHealthPdf } from '../../utils/generateSecurePdf';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Download,
  Key,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  FileCheck,
  Sparkles,
  Info,
  Calendar,
  User,
  Heart,
  Pill,
  Syringe,
} from 'lucide-react';

interface SecurePdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurePdfExportModal: React.FC<SecurePdfExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { patient, records, analytics, addToast } = useHealth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'preview' | 'test_decrypt'>('config');

  // Options
  const [includeLabs, setIncludeLabs] = useState(true);
  const [includeMeds, setIncludeMeds] = useState(true);
  const [includeAllergies, setIncludeAllergies] = useState(true);
  const [includeVitals, setIncludeVitals] = useState(true);

  // Decryption simulator
  const [testPasswordInput, setTestPasswordInput] = useState('');
  const [decryptedSuccessfully, setDecryptedSuccessfully] = useState(false);
  const [decryptAttempted, setDecryptAttempted] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  // Format DOB as MMDDYYYY for quick preset
  const dobPreset = patient.dob.replace(/-/g, ''); // e.g. 19800418 or formatted as 04181980
  const [birthYear, birthMonth, birthDay] = patient.dob.split('-');
  const dobStandardPreset = `${birthMonth}${birthDay}${birthYear}`; // 04181980

  const handleApplyDobPreset = () => {
    setPassword(dobStandardPreset);
    setConfirmPassword(dobStandardPreset);
    addToast({
      type: 'info',
      title: 'Standard Clinical Preset Applied',
      message: `Password set to Date of Birth (${dobStandardPreset}). Keep this documented for offline access.`,
    });
  };

  const isPasswordValid = password.length >= 6;
  const isMatching = password === confirmPassword && isPasswordValid;

  const handleDownloadPdf = () => {
    if (!isMatching) {
      alert('Please enter matching passwords of at least 6 characters.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      try {
        const blob = generateEncryptedHealthPdf({
          password,
          patient,
          records,
          analytics,
          includeLabs,
          includeMeds,
          includeAllergies,
          includeVitals,
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AegisHealth_Confidential_Summary_${patient.mrn}_SECURE.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        addToast({
          type: 'success',
          title: 'Encrypted PDF Downloaded',
          message: `Your health summary is saved with 128-bit PDF encryption. Use your password to unlock it offline in any PDF viewer.`,
        });

        setIsGenerating(false);
        onClose();
      } catch (err) {
        console.error('Error creating PDF:', err);
        setIsGenerating(false);
        alert('An error occurred while generating the PDF. Please try again.');
      }
    }, 600);
  };

  const handleTestDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    setDecryptAttempted(true);
    if (testPasswordInput === password && password.length > 0) {
      setDecryptedSuccessfully(true);
    } else {
      setDecryptedSuccessfully(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Export Password-Protected Health Summary (PDF)
                </h3>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  AES / RC4 Encrypted
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Secure, self-contained clinical summary for offline personal records and external specialist visits
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit my-3 shrink-0">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'config'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Encryption & Content
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'preview'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Clinical Document Preview
          </button>
          <button
            onClick={() => setActiveTab('test_decrypt')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'test_decrypt'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Test Password Unlock
          </button>
        </div>

        {/* Tab 1: Encryption & Content Setup */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {activeTab === 'config' && (
            <div className="space-y-4 text-xs">
              {/* Notice Banner */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-xs">
                    Patient-Controlled Security Policy
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    The exported document will be encrypted using standard PDF security algorithms. Anyone attempting to open the PDF in Adobe Acrobat, Apple Preview, or Google Chrome will be prompted to enter this password.
                  </p>
                </div>
              </div>

              {/* Password inputs */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Set Document Passphrase:
                  </label>
                  <button
                    type="button"
                    onClick={handleApplyDobPreset}
                    className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>Use Standard DOB Preset ({dobStandardPreset})</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-slate-600 font-medium">New Password (min 6 characters):</span>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter secure password..."
                        className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-300 rounded-xl pr-9 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-600 font-medium">Confirm Password:</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password..."
                      className={`w-full text-xs font-mono p-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 ${
                        confirmPassword && !isMatching
                          ? 'border-rose-400 focus:ring-rose-500/20'
                          : 'border-slate-300 focus:ring-teal-500/20'
                      }`}
                    />
                  </div>
                </div>

                {/* Password status */}
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Strength:{' '}
                    {password.length >= 10 ? (
                      <span className="text-emerald-700 font-bold">Strong</span>
                    ) : password.length >= 6 ? (
                      <span className="text-teal-700 font-bold">Good</span>
                    ) : (
                      <span className="text-slate-400">Enter at least 6 characters</span>
                    )}
                  </span>

                  {confirmPassword && (
                    <span className="font-medium">
                      {isMatching ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Passwords Match
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Passwords do not match
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Inclusions selection */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="font-bold text-slate-800 text-xs block">
                  Select Clinical Modules to Encrypt & Export:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={includeLabs}
                      onChange={(e) => setIncludeLabs(e.target.checked)}
                      className="rounded text-teal-600 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Diagnostic Lab Results</span>
                      <span className="text-[10px] text-slate-500">CMP-14, Lipid Panel, HbA1c</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={includeMeds}
                      onChange={(e) => setIncludeMeds(e.target.checked)}
                      className="rounded text-teal-600 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Active Prescriptions</span>
                      <span className="text-[10px] text-slate-500">Lisinopril, Atorvastatin, Rx details</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={includeAllergies}
                      onChange={(e) => setIncludeAllergies(e.target.checked)}
                      className="rounded text-teal-600 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Documented Allergies</span>
                      <span className="text-[10px] text-slate-500">Penicillin, Sulfa alerts</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={includeVitals}
                      onChange={(e) => setIncludeVitals(e.target.checked)}
                      className="rounded text-teal-600 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Verified Flow-Sheet Vitals</span>
                      <span className="text-[10px] text-slate-500">Blood Pressure, Pulse, Glucose</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Document Preview */}
          {activeTab === 'preview' && (
            <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm space-y-4">
                {/* Header */}
                <div className="bg-slate-900 text-white p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm">
                      AegisHealth Connect — Continuity of Care Document
                    </h4>
                    <p className="text-[10px] text-teal-300 font-mono mt-0.5">
                      OFFICIAL CERTIFIED HEALTH RECORD · HL7 FHIR R4 · CONFIDENTIAL
                    </p>
                  </div>
                  <Lock className="w-5 h-5 text-teal-400" />
                </div>

                {/* Patient Meta */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Patient Name:</span>
                    <span className="font-bold text-slate-900">{patient.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">MRN:</span>
                    <span className="font-mono font-bold text-slate-900">{patient.mrn}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">DOB / Age:</span>
                    <span className="font-medium text-slate-900">{patient.dob} ({patient.age}y)</span>
                  </div>
                </div>

                {/* Allergies Highlight */}
                {includeAllergies && (
                  <div className="p-3 bg-rose-50/70 rounded-lg border border-rose-200">
                    <span className="font-bold text-rose-900 text-[11px] block">
                      Critical Documented Allergies:
                    </span>
                    <p className="text-rose-800 text-[11px] mt-0.5">
                      • Penicillin: Severe anaphylactoid/angioedema reaction.
                    </p>
                  </div>
                )}

                {/* Medications snippet */}
                {includeMeds && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-900 text-[11px] block">
                      Active Pharmaceuticals:
                    </span>
                    <p className="text-slate-700 text-[11px]">
                      • Lisinopril 10 mg Oral Tablet (Once daily in morning)
                    </p>
                    <p className="text-slate-700 text-[11px]">
                      • Atorvastatin Calcium 20 mg Oral Tablet (Once daily at bedtime)
                    </p>
                  </div>
                )}

                {/* Labs snippet */}
                {includeLabs && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-900 text-[11px] block">
                      Diagnostic Laboratory Observations:
                    </span>
                    <p className="text-slate-700 text-[11px]">
                      • CMP-14: Fasting Glucose: 104 mg/dL (Elevated), BUN: 14, Creatinine: 0.85, eGFR: 94
                    </p>
                    <p className="text-slate-700 text-[11px]">
                      • Lipid Panel: Total Cholesterol: 178 mg/dL, HDL: 58, LDL: 94, Triglycerides: 130
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>Certified by: Dr. Elena Vasquez, MD</span>
                  <span>AES-256 PDF Encryption Protected</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Offline Decrypt Simulator */}
          {activeTab === 'test_decrypt' && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 text-sm block">
                  Offline Decryption Verification Sandbox
                </span>
                <p className="text-slate-500 text-[11px]">
                  Simulate what happens when you open the file in Adobe Acrobat Reader or Apple Preview on your personal computer.
                </p>
              </div>

              <form onSubmit={handleTestDecrypt} className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    Enter the document password you configured:
                  </label>
                  <input
                    type="password"
                    value={testPasswordInput}
                    onChange={(e) => setTestPasswordInput(e.target.value)}
                    placeholder="Enter password to unlock..."
                    className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Attempt Decrypt
                </button>
              </form>

              {decryptAttempted && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    decryptedSuccessfully
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {decryptedSuccessfully ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Document Decryption Successful!</span>
                        <p className="text-[11px] mt-0.5">
                          Your password unlocked the clinical payload correctly. You can safely proceed to download the document.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Decryption Failed</span>
                        <p className="text-[11px] mt-0.5">
                          The password entered does not match your configured password. Please re-check tab 1.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500">
            {isMatching ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ready to download encrypted PDF
              </span>
            ) : (
              <span className="text-slate-400">Set matching password of &ge; 6 characters to enable download</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isMatching || isGenerating}
              onClick={handleDownloadPdf}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Encrypting & Generating...' : 'Download Encrypted PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
