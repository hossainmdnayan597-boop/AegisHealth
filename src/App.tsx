import React, { useState } from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { MedicalRecordsView } from './components/records/MedicalRecordsView';
import { AppointmentsView } from './components/appointments/AppointmentsView';
import { SecureMessagingView } from './components/messaging/SecureMessagingView';
import { RemindersView } from './components/reminders/RemindersView';
import { EhrSyncHub } from './components/ehr/EhrSyncHub';
import { HealthAnalyticsView } from './components/analytics/HealthAnalyticsView';
import { ProviderDirectoryView } from './components/providers/ProviderDirectoryView';
import { ToastContainer } from './components/common/ToastContainer';
import { NewAppointmentModal } from './components/appointments/NewAppointmentModal';
import { PreCheckinModal } from './components/appointments/PreCheckinModal';
import { TelehealthRoomModal } from './components/appointments/TelehealthRoomModal';
import { Appointment } from './types';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  Building2,
  TrendingUp,
  ShieldCheck,
  Lock,
  Phone,
  FileSpreadsheet,
  Stethoscope,
} from 'lucide-react';

const MainPortalContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [showGlobalBooking, setShowGlobalBooking] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<string | undefined>(undefined);
  const [globalPreCheckinAptId, setGlobalPreCheckinAptId] = useState<string | null>(null);
  const [globalTelehealthApt, setGlobalTelehealthApt] = useState<Appointment | null>(null);

  const { patient, role, appointments, reminders, threads, setActiveThreadId } = useHealth();
  const pendingRemindersCount = reminders.filter((r) => r.status === 'active').length;

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'providers', label: 'Find Providers', icon: Stethoscope },
    { id: 'messages', label: 'Secure Messages', icon: MessageSquare },
    { id: 'reminders', label: 'Automated Reminders', icon: Bell, badge: pendingRemindersCount },
    { id: 'ehr', label: 'EHR Systems Sync', icon: Building2 },
    { id: 'analytics', label: 'Health Analytics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <nav aria-label="Portal Navigation" className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-amber-100 text-amber-800 font-bold'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* View Switcher */}
        <main>
          {currentTab === 'overview' && (
            <OverviewDashboard
              setCurrentTab={setCurrentTab}
              onOpenBooking={() => setShowGlobalBooking(true)}
              onOpenPreCheckin={(aptId) => setGlobalPreCheckinAptId(aptId)}
              onOpenTelehealth={(apt) => setGlobalTelehealthApt(apt)}
            />
          )}

          {currentTab === 'records' && <MedicalRecordsView />}

          {currentTab === 'appointments' && (
            <AppointmentsView onOpenDirectory={() => setCurrentTab('providers')} />
          )}

          {currentTab === 'providers' && (
            <ProviderDirectoryView
              onBookDoctor={(docId) => {
                setSelectedDoctorForBooking(docId);
                setShowGlobalBooking(true);
              }}
              onMessageDoctor={(docId) => {
                const matchedThread = threads.find((t) => t.providerId === docId);
                if (matchedThread) {
                  setActiveThreadId(matchedThread.id);
                }
                setCurrentTab('messages');
              }}
            />
          )}

          {currentTab === 'messages' && <SecureMessagingView />}

          {currentTab === 'reminders' && <RemindersView />}

          {currentTab === 'ehr' && <EhrSyncHub />}

          {currentTab === 'analytics' && <HealthAnalyticsView />}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center md:text-left">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-semibold text-slate-700">AegisHealth Connect™</span>
            <span>·</span>
            <span>HIPAA Protected Health Information (PHI) Environment</span>
            <span>·</span>
            <span className="text-slate-600">
              Developed by{' '}
              <a
                href="https://www.facebook.com/mdnayan.hossain.1420"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-teal-700 hover:text-teal-900 hover:underline transition-colors inline-flex items-center gap-1"
              >
                <span>Md. Nayan Hossain</span>
              </a>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-[11px] text-slate-500">
            <span>Interoperability: HL7 FHIR R4 (US Core v3.1.1)</span>
            <span>·</span>
            <span>Connected: Epic, Cerner, Athenahealth, MEDITECH</span>
            <span>·</span>
            <span className="font-mono text-slate-600">TLS 1.3 GCM</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      {showGlobalBooking && (
        <NewAppointmentModal
          isOpen={showGlobalBooking}
          initialDoctorId={selectedDoctorForBooking}
          onClose={() => {
            setShowGlobalBooking(false);
            setSelectedDoctorForBooking(undefined);
          }}
        />
      )}

      {globalPreCheckinAptId && (
        <PreCheckinModal
          appointmentId={globalPreCheckinAptId}
          onClose={() => setGlobalPreCheckinAptId(null)}
        />
      )}

      {globalTelehealthApt && (
        <TelehealthRoomModal
          appointment={globalTelehealthApt}
          onClose={() => setGlobalTelehealthApt(null)}
        />
      )}

      {/* Real-Time Toast Notifications (SMS, EHR Sync, Reminders) */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <HealthProvider>
      <MainPortalContent />
    </HealthProvider>
  );
}
