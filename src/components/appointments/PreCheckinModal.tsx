import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  FileCheck,
  CheckCircle2,
  X,
  ShieldCheck,
  User,
  Heart,
  Pill,
  AlertTriangle,
} from 'lucide-react';

interface PreCheckinModalProps {
  appointmentId: string;
  onClose: () => void;
}

export const PreCheckinModal: React.FC<PreCheckinModalProps> = ({
  appointmentId,
  onClose,
}) => {
  const { appointments, completePreCheckin, patient, records } = useHealth();

  const apt = appointments.find((a) => a.id === appointmentId);
  const activeMeds = records.filter((r) => r.category === 'medication' && r.status === 'active');
  const allergies = records.filter((r) => r.category === 'allergy' && r.status === 'active');

  const [hasSymptoms, setHasSymptoms] = useState(false);
  const [symptomNotes, setSymptomNotes] = useState('');
  const [medsConfirmed, setMedsConfirmed] = useState(true);
  const [contactConfirmed, setContactConfirmed] = useState(true);
  const [consentSigned, setConsentSigned] = useState(true);

  if (!apt) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completePreCheckin(appointmentId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Clinical Pre-Check-In
              </h3>
              <p className="text-xs text-slate-500">
                Encounter with {apt.doctorName} on {apt.date} at {apt.time}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Contact & Insurance */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              1. Demographics & Insurance Check
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400 block">Patient Name:</span>
                <span className="font-semibold text-slate-800">{patient.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">DOB / MRN:</span>
                <span className="font-semibold text-slate-800">{patient.dob} ({patient.mrn})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Insurance:</span>
                <span className="font-semibold text-slate-800">{patient.insuranceProvider}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone:</span>
                <span className="font-semibold text-slate-800">{patient.phone}</span>
              </div>
            </div>

            <label className="flex items-center gap-2 pt-2 border-t border-slate-200/60 cursor-pointer">
              <input
                type="checkbox"
                checked={contactConfirmed}
                onChange={(e) => setContactConfirmed(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span className="text-slate-700 font-medium">
                I verify my contact and insurance details are accurate.
              </span>
            </label>
          </div>

          {/* 2. Medication & Allergy Reconciliation */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              2. Medication & Allergy Verification
            </h4>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium block">Active Prescriptions:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                {activeMeds.map((m) => (
                  <li key={m.id}>
                    {m.title} ({m.medicationInfo?.dosage || 'active'})
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-slate-500 font-medium block">Documented Allergies:</span>
              <div className="flex flex-wrap gap-1.5">
                {allergies.map((a) => (
                  <span
                    key={a.id}
                    className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded font-semibold text-[11px]"
                  >
                    {a.title}
                  </span>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 pt-2 border-t border-slate-200/60 cursor-pointer">
              <input
                type="checkbox"
                checked={medsConfirmed}
                onChange={(e) => setMedsConfirmed(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span className="text-slate-700 font-medium">
                I have reviewed my medication list and confirm no recent unlisted changes.
              </span>
            </label>
          </div>

          {/* 3. Symptom Assessment */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              3. Current Symptoms & Recent Changes
            </h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasSymptoms}
                onChange={(e) => setHasSymptoms(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span className="text-slate-700 font-medium">
                I am currently experiencing acute symptoms (fever, persistent cough, pain, dizziness).
              </span>
            </label>

            {hasSymptoms && (
              <textarea
                rows={2}
                value={symptomNotes}
                onChange={(e) => setSymptomNotes(e.target.value)}
                placeholder="Describe onset, intensity (1-10), and location of symptoms..."
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 text-slate-900 resize-none mt-1"
              />
            )}
          </div>

          {/* 4. HIPAA Consent */}
          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-900 space-y-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consentSigned}
                onChange={(e) => setConsentSigned(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 mt-0.5"
              />
              <span className="text-[11px] leading-relaxed">
                <span className="font-bold">HIPAA Electronic Care Authorization:</span> I authorize electronic transmission of this intake questionnaire to my designated clinical care team and medical record.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!contactConfirmed || !medsConfirmed || !consentSigned}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Complete Pre-Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
