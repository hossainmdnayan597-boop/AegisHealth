import React from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  Calendar,
  MessageSquare,
  FileText,
  Pill,
  Heart,
  TrendingUp,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle2,
  Video,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { PersonalHealthGoalsCard } from './PersonalHealthGoalsCard';
import { InsuranceCoverageCard } from './InsuranceCoverageCard';

interface OverviewDashboardProps {
  setCurrentTab: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenPreCheckin: (aptId: string) => void;
  onOpenTelehealth: (apt: any) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  setCurrentTab,
  onOpenBooking,
  onOpenPreCheckin,
  onOpenTelehealth,
}) => {
  const {
    patient,
    role,
    records,
    appointments,
    reminders,
    ehrPlatforms,
    analytics,
    toggleReminderStatus,
    syncAllEhrPlatforms,
    isSyncingEhr,
  } = useHealth();

  // Next upcoming appointment
  const upcomingApts = appointments.filter((a) => a.status === 'confirmed');
  const nextAppointment = upcomingApts[0];

  // Active medications
  const activeMeds = records.filter(
    (r) => r.category === 'medication' && r.status === 'active'
  );

  // Latest lab test
  const recentLabs = records.filter((r) => r.category === 'lab');
  const latestLab = recentLabs[0];

  // Pending reminders
  const pendingReminders = reminders.filter((r) => r.status === 'active');

  const latestVital = analytics.vitalsHistory[analytics.vitalsHistory.length - 1];

  return (
    <div className="space-y-6">
      {/* Clinician Mode Header Notice (if toggled) */}
      {role === 'provider' && (
        <div className="bg-cyan-900 text-cyan-50 p-4 rounded-xl border border-cyan-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Clinician Chart View · Dr. Elena Vasquez, MD
              </p>
              <p className="text-sm font-medium">
                Viewing Patient: <span className="font-bold underline">{patient.name}</span> (MRN: {patient.mrn}, DOB: {patient.dob})
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('analytics')}
            className="text-xs bg-cyan-700 hover:bg-cyan-600 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            Open Population Health Panel
          </button>
        </div>
      )}

      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Healthcare & Patient Interoperability Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {patient.name.split(' ')[0]}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Your health records are actively synchronized with {ehrPlatforms.length} electronic health record systems. All vitals, medications, and appointment communications are protected under HIPAA standards.
            </p>
            
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div>
                Primary Care: <span className="text-white font-medium">{patient.primaryPhysician}</span>
              </div>
              <span className="text-slate-600">·</span>
              <div>
                Insurance: <span className="text-white font-medium">{patient.insuranceProvider}</span>
              </div>
              <span className="text-slate-600">·</span>
              <div>
                Status: <span className="text-emerald-400 font-semibold">Active & Covered</span>
              </div>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 shrink-0">
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Book Visit</span>
            </button>
            <button
              onClick={() => setCurrentTab('messages')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-4 h-4 text-teal-300" />
              <span>Message Doctor</span>
            </button>
            <button
              onClick={() => setCurrentTab('records')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4 text-teal-300" />
              <span>Medical Records</span>
            </button>
            <button
              onClick={() => syncAllEhrPlatforms()}
              disabled={isSyncingEhr}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-teal-300 ${isSyncingEhr ? 'animate-spin' : ''}`} />
              <span>{isSyncingEhr ? 'Syncing...' : 'Sync All EHR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Health Biometric & Engagement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blood Pressure */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Latest Blood Pressure</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {latestVital ? `${latestVital.systolicBP}/${latestVital.diastolicBP}` : '120/76'}
            </span>
            <span className="text-xs font-mono text-slate-500">mmHg</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Optimal / Target Met
            </span>
            <button
              onClick={() => setCurrentTab('analytics')}
              className="text-teal-600 hover:text-teal-800 text-[11px] font-semibold flex items-center gap-0.5"
            >
              Trends <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Blood Glucose */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Fasting Glucose</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {latestVital ? latestVital.bloodGlucose : '98'}
            </span>
            <span className="text-xs font-mono text-slate-500">mg/dL</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Normal Range (70-99)
            </span>
            <button
              onClick={() => setCurrentTab('records')}
              className="text-teal-600 hover:text-teal-800 text-[11px] font-semibold flex items-center gap-0.5"
            >
              Lab CMP <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Medication Adherence */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Medication Adherence</span>
            <Pill className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {analytics.medicationAdherenceRate}%
            </span>
            <span className="text-xs font-mono text-slate-500">30-day rate</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              High Compliance
            </span>
            <button
              onClick={() => setCurrentTab('reminders')}
              className="text-teal-600 hover:text-teal-800 text-[11px] font-semibold flex items-center gap-0.5"
            >
              Alarms <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* EHR Platform Bridge */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>EHR Synchronization</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {ehrPlatforms.filter((e) => e.status === 'connected').length} / {ehrPlatforms.length}
            </span>
            <span className="text-xs font-mono text-slate-500">Clinical feeds</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-cyan-700 font-semibold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
              FHIR R4 Connected
            </span>
            <button
              onClick={() => setCurrentTab('ehr')}
              className="text-teal-600 hover:text-teal-800 text-[11px] font-semibold flex items-center gap-0.5"
            >
              Audit Hub <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Personal Health Goals & Vitals Progress Card */}
      <PersonalHealthGoalsCard />

      {/* Insurance & Coverage Details Card */}
      <InsuranceCoverageCard />

      {/* Main Grid: Next Appointment & Automated Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Appointment Card (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  Next Scheduled Clinical Encounter
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('appointments')}
                className="text-xs text-teal-600 hover:text-teal-800 font-semibold"
              >
                View All ({appointments.length})
              </button>
            </div>

            {nextAppointment ? (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={nextAppointment.doctorAvatar}
                      alt={nextAppointment.doctorName}
                      className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">
                          {nextAppointment.doctorName}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                          {nextAppointment.type === 'telehealth' ? 'Virtual Video Visit' : 'In-Person Clinic'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {nextAppointment.specialty} · {nextAppointment.location}
                      </p>
                      <p className="text-xs text-slate-700 mt-1 font-medium">
                        Reason: {nextAppointment.reason}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-slate-900">
                      {nextAppointment.date}
                    </div>
                    <div className="text-base font-extrabold text-teal-700 font-mono">
                      {nextAppointment.time}
                    </div>
                    <span className="inline-block mt-1 text-[10px] text-slate-500">
                      Arrival window: 15 min prior
                    </span>
                  </div>
                </div>

                {/* Pre-Check-in or Telehealth Launch CTA */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {nextAppointment.preCheckinCompleted ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Pre-Check-In Completed (Ready for visit)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Pre-Check-In Required (Confirm insurance & symptoms)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!nextAppointment.preCheckinCompleted && (
                      <button
                        onClick={() => onOpenPreCheckin(nextAppointment.id)}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-xs"
                      >
                        Start Pre-Check-In
                      </button>
                    )}

                    {nextAppointment.type === 'telehealth' && (
                      <button
                        onClick={() => onOpenTelehealth(nextAppointment)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Launch Video Room</span>
                      </button>
                    )}

                    <button
                      onClick={() => setCurrentTab('appointments')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 transition-colors"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No appointments scheduled right now.</p>
                <button
                  onClick={onOpenBooking}
                  className="mt-3 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Schedule an Appointment
                </button>
              </div>
            )}

            {/* Recent Lab Overview Strip */}
            {latestLab && (
              <div className="mt-5 p-3.5 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Latest Lab: {latestLab.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({latestLab.date})
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentTab('records')}
                    className="text-xs text-teal-600 font-semibold hover:underline"
                  >
                    View Report & FHIR
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  {latestLab.summary}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Automated Reminders Sidebar (1 Column) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  Automated Reminders
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('reminders')}
                className="text-xs text-teal-600 hover:text-teal-800 font-semibold"
              >
                Configure
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {pendingReminders.slice(0, 3).map((reminder) => (
                <div
                  key={reminder.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {reminder.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {reminder.scheduledTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {reminder.description}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      SMS/Push Alert
                    </span>
                    <button
                      onClick={() => toggleReminderStatus(reminder.id)}
                      className="text-[11px] font-semibold text-teal-700 bg-white hover:bg-teal-50 px-2 py-0.5 rounded border border-teal-200 transition-colors"
                    >
                      {reminder.actionLabel || 'Mark Complete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentTab('reminders')}
              className="w-full text-center py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Manage Alert Frequencies & Delivery
            </button>
          </div>
        </div>
      </div>

      {/* EHR Systems Interoperability Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Connected Electronic Health Record (EHR) Ecosystem
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live bi-directional FHIR R4 interfaces synchronizing clinical notes, lab observations, and medications.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('ehr')}
            className="text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors self-start sm:self-auto"
          >
            Open EHR Synchronization Hub
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ehrPlatforms.map((ehr) => (
            <div
              key={ehr.id}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[11px] text-slate-800 font-mono">
                    {ehr.logoBadge}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 mt-1 truncate">
                  {ehr.providerType}
                </h4>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {ehr.connectedFacility}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>{ehr.syncedRecordsCount} resources</span>
                <span className="font-mono text-[9px] text-emerald-700 font-semibold">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
