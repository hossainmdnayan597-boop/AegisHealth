import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PatientProfile,
  MedicalRecord,
  Appointment,
  MessageThread,
  AutomatedReminder,
  EhrPlatform,
  PatientAnalytics,
  UserRole,
  ChatMessage,
  HealthGoal
} from '../types';
import {
  initialPatientProfile,
  initialMedicalRecords,
  initialAppointments,
  initialMessageThreads,
  initialReminders,
  initialEhrPlatforms,
  initialAnalytics,
  initialHealthGoals
} from '../data/mockHealthData';

export interface ToastMessage {
  id: string;
  type: 'sms' | 'reminder' | 'ehr_sync' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

interface HealthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  patient: PatientProfile;
  updatePatient: (profile: Partial<PatientProfile>) => void;
  records: MedicalRecord[];
  addRecord: (record: MedicalRecord) => void;
  requestMedicationRefill: (medicationId: string, pharmacyName: string) => void;
  appointments: Appointment[];
  bookAppointment: (newApt: Omit<Appointment, 'id' | 'calendarExported'>) => void;
  cancelAppointment: (id: string) => void;
  completePreCheckin: (appointmentId: string) => void;
  threads: MessageThread[];
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  sendMessage: (threadId: string, text: string, attachments?: any[]) => void;
  simulateDoctorReply: (threadId: string) => void;
  reminders: AutomatedReminder[];
  toggleReminderStatus: (id: string) => void;
  dismissReminder: (id: string) => void;
  triggerManualReminderAlert: (reminderId: string) => void;
  ehrPlatforms: EhrPlatform[];
  syncAllEhrPlatforms: () => Promise<void>;
  syncSingleEhr: (platformId: string) => Promise<void>;
  isSyncingEhr: boolean;
  analytics: PatientAnalytics;
  logNewVitals: (vital: { systolicBP: number; diastolicBP: number; restingHeartRate: number; bloodGlucose: number; spo2: number }) => void;
  goals: HealthGoal[];
  updateGoalProgress: (goalId: string, delta: number) => void;
  setGoalValue: (goalId: string, newValue: number) => void;
  addHealthGoal: (newGoal: Omit<HealthGoal, 'id' | 'lastUpdated'>) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('patient');
  const [patient, setPatient] = useState<PatientProfile>(() => {
    const saved = localStorage.getItem('aegis_patient');
    return saved ? JSON.parse(saved) : initialPatientProfile;
  });

  const [records, setRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('aegis_records');
    return saved ? JSON.parse(saved) : initialMedicalRecords;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('aegis_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [threads, setThreads] = useState<MessageThread[]>(() => {
    const saved = localStorage.getItem('aegis_threads');
    return saved ? JSON.parse(saved) : initialMessageThreads;
  });
  const [activeThreadId, setActiveThreadId] = useState<string>('thread-01');

  const [reminders, setReminders] = useState<AutomatedReminder[]>(() => {
    const saved = localStorage.getItem('aegis_reminders');
    return saved ? JSON.parse(saved) : initialReminders;
  });

  const [ehrPlatforms, setEhrPlatforms] = useState<EhrPlatform[]>(() => {
    const saved = localStorage.getItem('aegis_ehr');
    return saved ? JSON.parse(saved) : initialEhrPlatforms;
  });

  const [analytics, setAnalytics] = useState<PatientAnalytics>(() => {
    const saved = localStorage.getItem('aegis_analytics');
    return saved ? JSON.parse(saved) : initialAnalytics;
  });

  const [goals, setGoals] = useState<HealthGoal[]>(() => {
    const saved = localStorage.getItem('aegis_goals');
    return saved ? JSON.parse(saved) : initialHealthGoals;
  });

  const [isSyncingEhr, setIsSyncingEhr] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('aegis_patient', JSON.stringify(patient));
  }, [patient]);

  useEffect(() => {
    localStorage.setItem('aegis_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('aegis_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('aegis_threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('aegis_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('aegis_ehr', JSON.stringify(ehrPlatforms));
  }, [ehrPlatforms]);

  useEffect(() => {
    localStorage.setItem('aegis_analytics', JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    localStorage.setItem('aegis_goals', JSON.stringify(goals));
  }, [goals]);

  const addToast = (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...toast,
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updatePatient = (updated: Partial<PatientProfile>) => {
    setPatient((prev) => ({ ...prev, ...updated }));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal health identification and contacts have been updated.',
    });
  };

  const addRecord = (newRec: MedicalRecord) => {
    setRecords((prev) => [newRec, ...prev]);
    addToast({
      type: 'ehr_sync',
      title: 'New Clinical Record Added',
      message: `${newRec.title} successfully added to your chart.`,
    });
  };

  const requestMedicationRefill = (medicationId: string, pharmacyName: string) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === medicationId && rec.medicationInfo) {
          return {
            ...rec,
            medicationInfo: {
              ...rec.medicationInfo,
              refillsRemaining: Math.max(0, rec.medicationInfo.refillsRemaining - 1),
            },
          };
        }
        return rec;
      })
    );
    addToast({
      type: 'success',
      title: 'Refill Request Transmitted',
      message: `Prescription refill request sent to ${pharmacyName} and routed to physician for signature.`,
    });
  };

  const bookAppointment = (newAptData: Omit<Appointment, 'id' | 'calendarExported'>) => {
    const newApt: Appointment = {
      ...newAptData,
      id: 'apt-' + Date.now(),
      calendarExported: false,
    };
    setAppointments((prev) => [newApt, ...prev]);

    // Create an automated reminder for the new appointment
    const newReminder: AutomatedReminder = {
      id: 'rem-' + Date.now(),
      title: `Upcoming Appointment: ${newApt.doctorName}`,
      category: 'appointment',
      scheduledTime: `${newApt.date} at ${newApt.time}`,
      dueDate: `${newApt.date}T${newApt.time.includes('PM') ? '14:00:00' : '09:00:00'}`,
      description: `${newApt.type === 'telehealth' ? 'Virtual Telehealth consult' : 'In-person clinic visit'} for ${newApt.reason}.`,
      status: 'active',
      channels: ['sms', 'email', 'push'],
      actionLabel: 'View Appointment',
      linkedEntityId: newApt.id,
    };
    setReminders((prev) => [newReminder, ...prev]);

    addToast({
      type: 'sms',
      title: 'Appointment Scheduled & Reminders Active',
      message: `Confirmed with ${newApt.doctorName} for ${newApt.date} at ${newApt.time}. SMS confirmation sent.`,
    });
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
    addToast({
      type: 'info',
      title: 'Appointment Cancelled',
      message: 'The clinical schedule slot has been released.',
    });
  };

  const completePreCheckin = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, preCheckinCompleted: true } : a))
    );
    addToast({
      type: 'success',
      title: 'Pre-Check-In Completed',
      message: 'Intake questions, insurance coverage, and symptoms recorded. You are ready for your visit!',
    });
  };

  const sendMessage = (threadId: string, text: string, attachments?: any[]) => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: role === 'patient' ? 'patient' : 'provider',
      senderName: role === 'patient' ? patient.name : 'Dr. Elena Vasquez, MD',
      senderRole: role === 'patient' ? undefined : 'Internal Medicine',
      text,
      timestamp: 'Just now',
      read: true,
      attachments,
    };

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            lastMessageTimestamp: 'Just now',
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      })
    );

    // If patient sent message, trigger simulated provider notification toast
    if (role === 'patient') {
      addToast({
        type: 'info',
        title: 'Encrypted Message Transmitted',
        message: 'Your message has been sent to the clinical care team via secure HIPAA channel.',
      });
    }
  };

  const simulateDoctorReply = (threadId: string) => {
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) return;

    const sampleReplies = [
      `Thank you for providing the update, ${patient.name.split(' ')[0]}. I reviewed your latest biomarker readings. Everything aligns with our therapeutic goals. Continue your current routine and message if anything shifts.`,
      `I've noted this in your master EHR encounter summary. We will review the details during your upcoming appointment. In the meantime, keep up the consistent medication adherence.`,
      `Thank you for reaching out. I have updated your chart and verified that your prescription renewal order has been dispatched to your preferred pharmacy.`,
      `Your query has been reviewed by the clinical triage nurse and myself. The vitals you logged look stable and well within the normal guideline range.`,
    ];
    const replyText = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

    const doctorMsg: ChatMessage = {
      id: 'msg-doc-' + Date.now(),
      sender: 'provider',
      senderName: thread.providerName,
      senderRole: thread.providerRole,
      text: replyText,
      timestamp: 'Just now',
      read: false,
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessageTimestamp: 'Just now',
            unreadCount: t.unreadCount + 1,
            messages: [...t.messages, doctorMsg],
          };
        }
        return t;
      })
    );

    addToast({
      type: 'reminder',
      title: `New Message from ${thread.providerName}`,
      message: replyText.substring(0, 95) + '...',
    });
  };

  const toggleReminderStatus = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === 'completed' ? 'active' : 'completed';
          if (nextStatus === 'completed' && r.category === 'medication') {
            addToast({
              type: 'success',
              title: 'Medication Adherence Recorded',
              message: `Marked '${r.title}' as taken. Adherence score updated!`,
            });
            // Boost adherence analytics
            setAnalytics((a) => ({
              ...a,
              medicationAdherenceRate: Math.min(100, a.medicationAdherenceRate + 1),
            }));
          }
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const dismissReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const triggerManualReminderAlert = (reminderId: string) => {
    const rem = reminders.find((r) => r.id === reminderId);
    if (!rem) return;

    addToast({
      type: 'sms',
      title: `[SMS Automated Alert] +1 (555) ***-3820`,
      message: `AegisHealth Alert: "${rem.title}". ${rem.description}`,
    });
  };

  const syncSingleEhr = async (platformId: string) => {
    setIsSyncingEhr(true);
    await new Promise((res) => setTimeout(res, 1200));

    const timestamp = 'Just now (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')';
    setEhrPlatforms((prev) =>
      prev.map((p) => {
        if (p.id === platformId) {
          const newCount = p.syncedRecordsCount + Math.floor(Math.random() * 4) + 1;
          return {
            ...p,
            lastSyncTimestamp: timestamp,
            syncedRecordsCount: newCount,
            status: 'connected',
            syncHistory: [
              {
                id: 'sync-hist-' + Date.now(),
                timestamp,
                resourceType: 'Bundle (Patient, Observation, Condition, CarePlan)',
                recordsProcessed: 6,
                status: 'success',
                message: `Bidirectional synchronization with ${p.name} completed successfully. FHIR R4 schema verified.`,
              },
              ...p.syncHistory,
            ],
          };
        }
        return p;
      })
    );
    setIsSyncingEhr(false);
    addToast({
      type: 'ehr_sync',
      title: 'EHR Synchronization Complete',
      message: `Successfully synchronized FHIR records with clinical platform.`,
    });
  };

  const syncAllEhrPlatforms = async () => {
    setIsSyncingEhr(true);
    await new Promise((res) => setTimeout(res, 2000));

    const timestamp = 'Just now (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')';
    setEhrPlatforms((prev) =>
      prev.map((p) => ({
        ...p,
        lastSyncTimestamp: timestamp,
        syncedRecordsCount: p.syncedRecordsCount + 3,
        status: 'connected',
        syncHistory: [
          {
            id: 'sync-all-' + Date.now() + '-' + p.id,
            timestamp,
            resourceType: 'HL7 FHIR R4 Multi-Resource Bundle',
            recordsProcessed: 8,
            status: 'success',
            message: `Automated data reconciliation synchronized with ${p.connectedFacility}.`,
          },
          ...p.syncHistory,
        ],
      }))
    );
    setIsSyncingEhr(false);
    addToast({
      type: 'ehr_sync',
      title: 'All Clinical Systems Synchronized',
      message: 'Epic Systems, Oracle Cerner, Athenahealth & MEDITECH are aligned in real time with zero schema conflicts.',
    });
  };

  const logNewVitals = (vital: { systolicBP: number; diastolicBP: number; restingHeartRate: number; bloodGlucose: number; spo2: number }) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      id: 'v-' + Date.now(),
      date: today,
      ...vital,
      weightLbs: 143,
    };
    setAnalytics((prev) => ({
      ...prev,
      vitalsHistory: [...prev.vitalsHistory, newEntry],
      overallEngagementScore: Math.min(100, prev.overallEngagementScore + 2),
    }));
    addToast({
      type: 'success',
      title: 'Biometrics Logged & Transmitted',
      message: `BP ${vital.systolicBP}/${vital.diastolicBP} mmHg & Glucose ${vital.bloodGlucose} mg/dL uploaded to clinical analytics pipeline.`,
    });
  };

  const updateGoalProgress = (goalId: string, delta: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updatedVal = Math.max(0, Math.round((g.currentValue + delta) * 10) / 10);
          const reachedTarget = updatedVal >= g.targetValue && g.currentValue < g.targetValue;
          if (reachedTarget) {
            addToast({
              type: 'success',
              title: `Daily Goal Achieved: ${g.name}! 🎉`,
              message: `Congratulations! You reached your daily target of ${g.targetValue} ${g.unit}. Adherence score boosted!`,
            });
            setAnalytics((a) => ({
              ...a,
              overallEngagementScore: Math.min(100, a.overallEngagementScore + 1),
            }));
          }
          return {
            ...g,
            currentValue: updatedVal,
            lastUpdated: 'Just now',
          };
        }
        return g;
      })
    );
  };

  const setGoalValue = (goalId: string, newValue: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const clamped = Math.max(0, Math.round(newValue * 10) / 10);
          const reachedTarget = clamped >= g.targetValue && g.currentValue < g.targetValue;
          if (reachedTarget) {
            addToast({
              type: 'success',
              title: `Target Met: ${g.name}! 🎉`,
              message: `You reached ${clamped} ${g.unit}! Excellent daily health consistency.`,
            });
          }
          return { ...g, currentValue: clamped, lastUpdated: 'Just now' };
        }
        return g;
      })
    );
  };

  const addHealthGoal = (newGoal: Omit<HealthGoal, 'id' | 'lastUpdated'>) => {
    const goal: HealthGoal = {
      ...newGoal,
      id: 'goal-' + Date.now(),
      lastUpdated: 'Just created',
    };
    setGoals((prev) => [...prev, goal]);
    addToast({
      type: 'success',
      title: 'New Health Target Configured',
      message: `Added "${goal.name}" with a target of ${goal.targetValue} ${goal.unit}.`,
    });
  };

  return (
    <HealthContext.Provider
      value={{
        role,
        setRole,
        patient,
        updatePatient,
        records,
        addRecord,
        requestMedicationRefill,
        appointments,
        bookAppointment,
        cancelAppointment,
        completePreCheckin,
        threads,
        activeThreadId,
        setActiveThreadId,
        sendMessage,
        simulateDoctorReply,
        reminders,
        toggleReminderStatus,
        dismissReminder,
        triggerManualReminderAlert,
        ehrPlatforms,
        syncAllEhrPlatforms,
        syncSingleEhr,
        isSyncingEhr,
        analytics,
        logNewVitals,
        goals,
        updateGoalProgress,
        setGoalValue,
        addHealthGoal,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
