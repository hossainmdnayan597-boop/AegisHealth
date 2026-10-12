import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { Appointment } from '../../types';
import { NewAppointmentModal } from './NewAppointmentModal';
import { PreCheckinModal } from './PreCheckinModal';
import { TelehealthRoomModal } from './TelehealthRoomModal';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Building,
  Phone,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Download,
  CalendarCheck,
  XCircle,
  RefreshCw,
  Stethoscope,
} from 'lucide-react';

interface AppointmentsViewProps {
  onOpenDirectory?: () => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({ onOpenDirectory }) => {
  const { appointments, cancelAppointment, addToast } = useHealth();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [preCheckinAptId, setPreCheckinAptId] = useState<string | null>(null);
  const [telehealthApt, setTelehealthApt] = useState<Appointment | null>(null);

  const upcoming = appointments.filter((a) => a.status === 'confirmed');
  const past = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');

  const exportIcsCalendar = (apt: Appointment) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AegisHealth Connect//EN
BEGIN:VEVENT
UID:${apt.id}@aegishealth.org
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${apt.date.replace(/-/g, '')}T${apt.time.includes('AM') ? '090000' : '140000'}Z
DTEND:${apt.date.replace(/-/g, '')}T${apt.time.includes('AM') ? '100000' : '150000'}Z
SUMMARY:Medical Appointment with ${apt.doctorName}
DESCRIPTION:${apt.reason} - ${apt.specialty}
LOCATION:${apt.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `AegisHealth_${apt.doctorName.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    addToast({
      type: 'success',
      title: 'Calendar Event Downloaded',
      message: `Exported .ics event for ${apt.doctorName}. Open to sync with Google Calendar, Outlook, or Apple Calendar.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Clinical Appointment Scheduling
            </h2>
            <span className="text-[11px] font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
              Live Provider Slots
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Book in-person visits, launch encrypted telehealth rooms, and complete digital pre-check-in questionnaires.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenDirectory && (
            <button
              onClick={onOpenDirectory}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors"
            >
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Provider Directory</span>
            </button>
          )}

          <button
            onClick={() => setShowBookingModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Visit</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
          <span>Upcoming Appointments ({upcoming.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'past'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>Past Encounters ({past.length})</span>
        </button>
      </div>

      {/* Upcoming List */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcoming.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <img
                    src={apt.doctorAvatar}
                    alt={apt.doctorName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">
                        {apt.doctorName}
                      </h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        {apt.type === 'telehealth' ? 'Virtual Video Visit' : 'In-Person Clinic'}
                      </span>
                      {apt.preCheckinCompleted ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Pre-Check-In Completed
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Pre-Check-In Pending
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      {apt.specialty} · {apt.location} ({apt.roomNumber})
                    </p>

                    <p className="text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">Chief Reason:</span> {apt.reason}
                    </p>

                    {apt.notes && (
                      <p className="text-[11px] text-slate-500 italic">
                        Note: "{apt.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Date and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                  <div className="lg:text-right">
                    <span className="text-xs font-mono text-slate-500 block">
                      {apt.date}
                    </span>
                    <span className="text-xl font-extrabold text-teal-700 font-mono block">
                      {apt.time}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {!apt.preCheckinCompleted && (
                      <button
                        onClick={() => setPreCheckinAptId(apt.id)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Pre-Check-In</span>
                      </button>
                    )}

                    {apt.type === 'telehealth' && (
                      <button
                        onClick={() => setTelehealthApt(apt)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Room</span>
                      </button>
                    )}

                    <button
                      onClick={() => exportIcsCalendar(apt)}
                      title="Add to Google, Outlook, or Apple Calendar (.ics)"
                      className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
                    >
                      Cancel Visit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {upcoming.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No upcoming appointments scheduled</h4>
              <p className="text-xs text-slate-500 mt-1">
                Book a consultation with Dr. Vasquez or Dr. Hayes using the button above.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Past List */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {past.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs opacity-85"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={apt.doctorAvatar}
                    alt={apt.doctorName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{apt.doctorName}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        apt.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{apt.specialty} · {apt.date} at {apt.time}</p>
                    <p className="text-xs text-slate-600 mt-0.5">Encounter: {apt.reason}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowBookingModal(true)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors self-start sm:self-center"
                >
                  Book Follow-up
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showBookingModal && (
        <NewAppointmentModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      {preCheckinAptId && (
        <PreCheckinModal
          appointmentId={preCheckinAptId}
          onClose={() => setPreCheckinAptId(null)}
        />
      )}

      {telehealthApt && (
        <TelehealthRoomModal
          appointment={telehealthApt}
          onClose={() => setTelehealthApt(null)}
        />
      )}
    </div>
  );
};
