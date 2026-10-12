export type UserRole = 'patient' | 'provider';

export interface PatientProfile {
  id: string;
  name: string;
  mrn: string; // Medical Record Number
  dob: string;
  age: number;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  primaryPhysician: string;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferredPharmacy: {
    name: string;
    address: string;
    phone: string;
  };
  insuranceDetails?: {
    planName: string;
    planType: string;
    memberId: string;
    groupNumber: string;
    effectiveDate: string;
    expirationDate: string;
    eligibilityStatus: 'active' | 'pending' | 'expired';
    deductibleMet: number;
    deductibleTotal: number;
    outOfPocketMet: number;
    outOfPocketMax: number;
    copays: {
      primaryCare: number;
      specialist: number;
      telehealth: number;
      urgentCare: number;
      emergencyRoom: number;
      genericRx: number;
      brandRx: number;
    };
    rxBin: string;
    rxPcn: string;
    cardFrontUrl?: string;
    cardBackUrl?: string;
    lastCardUploadDate?: string;
  };
}

export type RecordCategory = 
  | 'lab' 
  | 'medication' 
  | 'immunization' 
  | 'allergy' 
  | 'visit_note' 
  | 'vital'
  | 'imaging';

export interface MedicalRecord {
  id: string;
  category: RecordCategory;
  title: string;
  date: string;
  provider: string;
  facility: string;
  status: 'final' | 'preliminary' | 'active' | 'resolved' | 'discontinued';
  summary: string;
  details?: Record<string, string | number | boolean>;
  // For lab/vitals tests
  testResults?: Array<{
    parameter: string;
    value: string | number;
    unit: string;
    referenceRange: string;
    isOutOfRange: boolean;
    flag?: 'high' | 'low' | 'normal' | 'critical';
  }>;
  // For medications
  medicationInfo?: {
    dosage: string;
    frequency: string;
    instructions: string;
    refillsRemaining: number;
    rxNumber: string;
    prescribedDate: string;
    expiresDate: string;
  };
  // FHIR representation
  fhirResource?: {
    resourceType: string;
    id: string;
    code: {
      coding: Array<{ system: string; code: string; display: string }>;
      text: string;
    };
  };
}

export type AppointmentType = 'in-person' | 'telehealth' | 'phone';
export type AppointmentStatus = 'confirmed' | 'pending_checkin' | 'in_progress' | 'completed' | 'cancelled';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  department: string;
  facility: string;
  avatar: string;
  rating: number;
  availableDays: string[];
  bio: string;
  acceptingNewPatients?: boolean;
  telehealthAvailable?: boolean;
  inPersonAvailable?: boolean;
  nextAvailableSlot?: string;
  yearsExperience?: number;
  education?: string;
  boardCertifications?: string[];
  languages?: string[];
  officePhone?: string;
  patientReviewsCount?: number;
  subSpecialties?: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  doctorAvatar: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:30 AM"
  type: AppointmentType;
  location: string;
  roomNumber?: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  preCheckinCompleted: boolean;
  telehealthMeetingUrl?: string;
  calendarExported?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'provider';
  senderName: string;
  senderRole?: string;
  text: string;
  timestamp: string;
  read: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    size: string;
    type: 'pdf' | 'image' | 'lab';
    url?: string;
  }>;
}

export interface MessageThread {
  id: string;
  providerId: string;
  providerName: string;
  providerRole: string;
  providerAvatar: string;
  subject: string;
  category: 'General' | 'Prescription Refill' | 'Lab Results' | 'Symptom Question' | 'Billing';
  priority: 'routine' | 'urgent';
  lastMessageTimestamp: string;
  unreadCount: number;
  status: 'open' | 'pending_physician' | 'resolved';
  messages: ChatMessage[];
}

export type ReminderCategory = 'medication' | 'appointment' | 'preventive_screening' | 'lab_followup';
export type ReminderChannel = 'sms' | 'email' | 'push';

export interface AutomatedReminder {
  id: string;
  title: string;
  category: ReminderCategory;
  scheduledTime: string; // e.g. "08:00 AM Daily" or "Oct 15, 2026 - 9:00 AM"
  dueDate?: string;
  description: string;
  status: 'active' | 'completed' | 'snoozed';
  channels: ReminderChannel[];
  actionLabel?: string;
  linkedEntityId?: string; // e.g., appointment id or record id
}

export interface EhrPlatform {
  id: string;
  name: string;
  providerType: 'Epic MyChart' | 'Oracle Cerner' | 'Athenahealth' | 'Veradigm Allscripts' | 'MEDITECH';
  logoBadge: string;
  connectedFacility: string;
  fhirEndpoint: string;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSyncTimestamp: string;
  syncedRecordsCount: number;
  protocolVersion: string; // e.g. "FHIR R4 v4.0.1 (US Core STU3.1.1)"
  autoSyncIntervalMinutes: number;
  syncHistory: Array<{
    id: string;
    timestamp: string;
    resourceType: string;
    recordsProcessed: number;
    status: 'success' | 'warning' | 'conflict_resolved';
    message: string;
  }>;
}

export interface VitalRecord {
  id: string;
  date: string;
  systolicBP: number;
  diastolicBP: number;
  restingHeartRate: number;
  bloodGlucose: number; // mg/dL
  spo2: number; // %
  weightLbs: number;
  notes?: string;
}

export interface PatientAnalytics {
  medicationAdherenceRate: number; // 0 - 100%
  appointmentAttendanceRate: number; // 0 - 100%
  overallEngagementScore: number; // 0 - 100
  preventiveCareGapCount: number;
  riskStratification: 'Low Risk' | 'Moderate Risk' | 'High Monitoring';
  vitalsHistory: VitalRecord[];
}

export interface HealthGoal {
  id: string;
  name: string;
  category: 'water' | 'steps' | 'sleep' | 'exercise' | 'custom';
  currentValue: number;
  targetValue: number;
  unit: string;
  stepIncrement: number;
  notes?: string;
  lastUpdated?: string;
}

