import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import {
  ShieldCheck,
  Activity,
  Bell,
  RefreshCw,
  User,
  Stethoscope,
  Heart,
  ChevronDown,
  CheckCircle2,
  Lock,
  ExternalLink,
  PhoneCall,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const {
    role,
    setRole,
    patient,
    reminders,
    ehrPlatforms,
    syncAllEhrPlatforms,
    isSyncingEhr,
    toggleReminderStatus,
  } = useHealth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const activeReminders = reminders.filter((r) => r.status === 'active');
  const connectedEhrsCount = ehrPlatforms.filter((p) => p.status === 'connected').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Clinical Trust Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 sm:px-6 flex items-center justify-between font-mono tracking-tight">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            HIPAA Compliant · 256-Bit TLS
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">
            FHIR R4 Interoperability v4.0.1
          </span>
          <span className="hidden lg:inline text-slate-600">|</span>
          <span className="hidden lg:inline text-slate-400">
            EHR Bridge: {connectedEhrsCount} Systems Live
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-300">
            Patient ID: <span className="text-white font-semibold">{patient.mrn}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            Primary: <span className="text-teal-300 font-medium">Dr. Elena Vasquez, MD</span>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('overview')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  AegisHealth
                </span>
                <span className="text-teal-600 font-bold text-xs uppercase tracking-wider bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  Connect
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                Patient Portal & Clinical EHR Sync
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* EHR Sync Indicator & Trigger */}
          <button
            onClick={() => syncAllEhrPlatforms()}
            disabled={isSyncingEhr}
            title="Trigger Bidirectional EHR Data Reconciliation"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors disabled:opacity-60"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-teal-600 ${isSyncingEhr ? 'animate-spin' : ''}`}
            />
            <span className="font-mono text-[11px]">
              {isSyncingEhr ? 'Syncing EHR...' : 'Sync EHR'}
            </span>
          </button>

          {/* Role Switcher (Patient vs Clinician) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setRole('patient')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                role === 'patient'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-teal-600" />
              <span>Patient</span>
            </button>
            <button
              onClick={() => setRole('provider')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                role === 'provider'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-cyan-600" />
              <span>Clinician</span>
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="View automated reminders"
            >
              <Bell className="w-5 h-5" />
              {activeReminders.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeReminders.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 px-4 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Automated Reminders ({activeReminders.length})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTab('reminders');
                      setShowNotifications(false);
                    }}
                    className="text-[11px] text-teal-600 hover:text-teal-800 font-semibold"
                  >
                    Manage All
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2.5 divide-y divide-slate-100">
                  {activeReminders.slice(0, 4).map((rem) => (
                    <div key={rem.id} className="pt-2 first:pt-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900 leading-tight">
                          {rem.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          {rem.scheduledTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        {rem.description}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          via {rem.channels.join(', ').toUpperCase()}
                        </span>
                        <button
                          onClick={() => toggleReminderStatus(rem.id)}
                          className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
                        >
                          {rem.actionLabel || 'Mark Complete'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {activeReminders.length === 0 && (
                    <p className="text-xs text-slate-500 py-4 text-center">
                      No pending reminders. All care schedules are up to date!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-300 text-teal-800 flex items-center justify-center font-bold text-xs">
                {role === 'patient' ? 'EV' : 'EV-MD'}
              </div>
              <div className="hidden lg:block">
                <span className="block text-xs font-bold text-slate-900 leading-none">
                  {role === 'patient' ? patient.name : 'Dr. Elena Vasquez'}
                </span>
                <span className="block text-[10px] text-slate-500 font-mono leading-tight mt-0.5">
                  {role === 'patient' ? `MRN: ${patient.mrn}` : 'Staff NPI: #1894029'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-3 px-4 z-50">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 block">
                    {patient.name}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    DOB: {patient.dob} (Age {patient.age}) · Blood: {patient.bloodType}
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-1">
                    Coverage: {patient.insuranceProvider}
                  </span>
                </div>

                <div className="py-2 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2 text-slate-600">
                    <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                    <span>Emergency Contact: {patient.emergencyContact.name} ({patient.emergencyContact.phone})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Policy ID: {patient.policyNumber}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setCurrentTab('records');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-center py-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                  >
                    View Full Medical Record
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
