import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { AutomatedReminder, ReminderCategory } from '../../types';
import {
  Bell,
  Clock,
  Pill,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Mail,
  Plus,
  Send,
  Trash2,
  Volume2,
  Settings2,
} from 'lucide-react';

export const RemindersView: React.FC = () => {
  const {
    reminders,
    toggleReminderStatus,
    dismissReminder,
    triggerManualReminderAlert,
    patient,
    addToast,
  } = useHealth();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ReminderCategory>('medication');
  const [newTime, setNewTime] = useState('08:00 AM Daily');
  const [newDesc, setNewDesc] = useState('');

  // Preference switches
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [advanceNotice, setAdvanceNotice] = useState('24h');

  const filtered = reminders.filter(
    (r) => filterCategory === 'all' || r.category === filterCategory
  );

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReminder: AutomatedReminder = {
      id: 'rem-custom-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      scheduledTime: newTime,
      description: newDesc.trim() || 'Custom patient care schedule prompt.',
      status: 'active',
      channels: ['push', 'sms'],
      actionLabel: 'Mark Completed',
    };

    // Update state via context
    // We can also trigger toast
    addToast({
      type: 'reminder',
      title: 'Automated Reminder Created',
      message: `Scheduled "${newTitle}" for delivery across configured channels.`,
    });

    reminders.push(newReminder);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Automated Reminders & Engagement Engine
            </h2>
            <span className="text-[11px] font-mono bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
              Active Dispatcher
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated SMS notifications, medication compliance alerts, appointment countdowns, and preventive screening recalls.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Reminder</span>
        </button>
      </div>

      {/* Main Grid: Reminders List & Channels Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Reminders Cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Reminders' },
              { id: 'medication', label: 'Medications & Prescriptions' },
              { id: 'appointment', label: 'Appointments' },
              { id: 'preventive_screening', label: 'Preventive Care Screenings' },
              { id: 'lab_followup', label: 'Biometrics & Labs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterCategory === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filtered.map((rem) => {
              const isCompleted = rem.status === 'completed';

              return (
                <div
                  key={rem.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'border-slate-200 bg-slate-50/50 opacity-70'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {rem.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {rem.scheduledTime}
                      </span>
                    </div>

                    <h3
                      className={`text-sm font-bold text-slate-900 ${
                        isCompleted ? 'line-through text-slate-500' : ''
                      }`}
                    >
                      {rem.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rem.description}
                    </p>

                    <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Delivery Channels: {rem.channels.map((c) => c.toUpperCase()).join(' · ')}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">Automated Pipeline Active</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                    <button
                      onClick={() => triggerManualReminderAlert(rem.id)}
                      title="Simulate immediate SMS notification dispatch to patient's device"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-teal-600" />
                      <span>Test Alert (SMS)</span>
                    </button>

                    <button
                      onClick={() => toggleReminderStatus(rem.id)}
                      className={`px-3.5 py-1.5 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 ${
                        isCompleted
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isCompleted ? 'Mark Pending' : rem.actionLabel || 'Mark Done'}</span>
                    </button>

                    <button
                      onClick={() => dismissReminder(rem.id)}
                      title="Delete reminder"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
                <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No reminders found in this category</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Add custom reminders or adjust filter settings above.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Channel Configuration */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Settings2 className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Automated Notification Channels
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              {/* SMS toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    SMS Text Alerts
                  </span>
                  <input
                    type="checkbox"
                    checked={smsEnabled}
                    onChange={(e) => setSmsEnabled(e.target.checked)}
                    className="rounded text-teal-600 w-4 h-4"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Direct cellular delivery to: <span className="font-mono font-medium text-slate-800">{patient.phone}</span>
                </p>
              </div>

              {/* Email toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    Email Digest Notifications
                  </span>
                  <input
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    className="rounded text-teal-600 w-4 h-4"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Delivered to: <span className="font-medium text-slate-800">{patient.email}</span>
                </p>
              </div>

              {/* Push Alerts toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-amber-600" />
                    Browser & Mobile Push
                  </span>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => setPushEnabled(e.target.checked)}
                    className="rounded text-teal-600 w-4 h-4"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Instant visual toast banners and auditory chime alerts.
                </p>
              </div>

              {/* Advance notice selector */}
              <div className="space-y-1 pt-1">
                <label className="font-bold text-slate-800 block text-[11px]">
                  Appointment Alert Lead Time:
                </label>
                <select
                  value={advanceNotice}
                  onChange={(e) => setAdvanceNotice(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium"
                >
                  <option value="48h">48 hours & 2 hours prior</option>
                  <option value="24h">24 hours prior (Standard)</option>
                  <option value="12h">Morning of appointment (8:00 AM)</option>
                  <option value="1h">1 hour prior only</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
              Protected under HIPAA Privacy Rules (45 CFR § 164.520). Notifications exclude sensitive diagnosis names from lock-screen text previews.
            </div>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Create Custom Automated Reminder
            </h3>

            <form onSubmit={handleCreateReminder} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Reminder Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Afternoon Hydration & Vitamin D Dose"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ReminderCategory)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                >
                  <option value="medication">Medication & Prescription</option>
                  <option value="appointment">Appointment Preparation</option>
                  <option value="preventive_screening">Preventive Screening</option>
                  <option value="lab_followup">Biometric / Lab Log</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Frequency / Time:</label>
                <input
                  type="text"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 02:00 PM Daily or Oct 20 at 9:00 AM"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Description / Action:</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Provide instructions for taking dose or logging measurement..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
