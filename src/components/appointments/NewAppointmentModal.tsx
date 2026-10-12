import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { availableDoctors } from '../../data/mockHealthData';
import { Doctor, AppointmentType } from '../../types';
import {
  Calendar,
  Clock,
  Video,
  Building,
  Phone,
  User,
  Star,
  CheckCircle2,
  X,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoctorId?: string;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  initialDoctorId,
}) => {
  const { bookAppointment, patient } = useHealth();

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || availableDoctors[0].id
  );
  const [selectedType, setSelectedType] = useState<AppointmentType>('in-person');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-24');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  const selectedDoctor = availableDoctors.find((d) => d.id === selectedDoctorId) || availableDoctors[0];

  const availableSlots = [
    '08:30 AM',
    '09:15 AM',
    '10:00 AM',
    '11:30 AM',
    '01:45 PM',
    '02:30 PM',
    '03:15 PM',
    '04:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please enter a brief reason for your visit.');
      return;
    }

    bookAppointment({
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      doctorAvatar: selectedDoctor.avatar,
      date: selectedDate,
      time: selectedTime,
      type: selectedType,
      location: selectedType === 'telehealth' ? 'Secure Telehealth Video Room' : selectedDoctor.facility,
      roomNumber: selectedType === 'telehealth' ? 'Virtual Suite #842' : 'Suite 302',
      status: 'confirmed',
      reason: reason.trim(),
      notes: notes.trim(),
      preCheckinCompleted: false,
      telehealthMeetingUrl: selectedType === 'telehealth' ? 'https://telehealth.connecthealth.org/room/pat-98240-ev' : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-lg tracking-tight">
              Schedule Clinical Appointment
            </h3>
            <p className="text-xs text-slate-500">
              Direct real-time provider calendar integration & EHR sync
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step Indicator */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pb-2 border-b border-slate-100">
            <span className={step >= 1 ? 'text-teal-600 font-bold' : ''}>1. Provider</span>
            <span className="text-slate-300">→</span>
            <span className={step >= 2 ? 'text-teal-600 font-bold' : ''}>2. Visit Type</span>
            <span className="text-slate-300">→</span>
            <span className={step >= 3 ? 'text-teal-600 font-bold' : ''}>3. Date & Time</span>
            <span className="text-slate-300">→</span>
            <span className={step >= 4 ? 'text-teal-600 font-bold' : ''}>4. Reason</span>
          </div>

          {/* Section 1: Doctor Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              1. Select Healthcare Provider:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableDoctors.map((doc) => (
                <button
                  type="button"
                  key={doc.id}
                  onClick={() => setSelectedDoctorId(doc.id)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    selectedDoctorId === doc.id
                      ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-900 leading-tight">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-teal-700 font-medium truncate mt-0.5">
                      {doc.specialty}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{doc.rating}</span>
                      <span>·</span>
                      <span>{doc.facility.split(' ')[0]}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Visit Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              2. Appointment Delivery Format:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedType('in-person')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedType === 'in-person'
                    ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 text-teal-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
                }`}
              >
                <Building className="w-5 h-5 mx-auto mb-1 text-teal-600" />
                <span className="text-xs block">In-Person Clinic</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('telehealth')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedType === 'telehealth'
                    ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 text-teal-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
                }`}
              >
                <Video className="w-5 h-5 mx-auto mb-1 text-cyan-600" />
                <span className="text-xs block">Virtual Video</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('phone')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedType === 'phone'
                    ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 text-teal-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
                }`}
              >
                <Phone className="w-5 h-5 mx-auto mb-1 text-slate-600" />
                <span className="text-xs block">Phone Audio</span>
              </button>
            </div>
          </div>

          {/* Section 3: Date & Available Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Appointment Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Available Time Slots:
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-mono"
              >
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4: Clinical Reason & Intake */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Primary Reason for Visit / Symptoms:
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Blood pressure check, medication adjustment, lab result review..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Additional Notes for Clinical Staff (Optional):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any symptoms, recent changes, or questions you wish to address..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 text-slate-900 resize-none"
            />
          </div>

          {/* Insurance verification banner */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center justify-between">
            <div>
              <span className="font-bold">Insurance Coverage Verified:</span> {patient.insuranceProvider}
            </div>
            <span className="font-mono text-[10px] bg-emerald-200/60 px-1.5 py-0.5 rounded text-emerald-900 font-semibold">
              $15 In-Network Co-Pay
            </span>
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
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Confirm & Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
