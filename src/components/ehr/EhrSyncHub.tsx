import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { EhrPlatform } from '../../types';
import {
  Building2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Code,
  FileCheck,
  Server,
  Zap,
  ArrowRightLeft,
  Lock,
  ExternalLink,
  Sliders,
  Check,
} from 'lucide-react';

export const EhrSyncHub: React.FC = () => {
  const {
    ehrPlatforms,
    syncAllEhrPlatforms,
    syncSingleEhr,
    isSyncingEhr,
    patient,
    addToast,
  } = useHealth();

  const [activeTab, setActiveTab] = useState<'platforms' | 'reconciliation' | 'audit_log' | 'fhir_inspector'>('platforms');
  const [selectedEhrForDetail, setSelectedEhrForDetail] = useState<EhrPlatform | null>(null);

  // Reconciliation conflict simulation state
  const [conflictResolved, setConflictResolved] = useState(false);

  const totalSynced = ehrPlatforms.reduce((acc, curr) => acc + curr.syncedRecordsCount, 0);

  const handleResolveConflict = () => {
    setConflictResolved(true);
    addToast({
      type: 'success',
      title: 'EHR Clinical Conflict Resolved',
      message: 'Master patient medication list reconciled across Epic MyChart and Oracle Cerner records.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              EHR Multi-Platform Interoperability Hub
            </h2>
            <span className="text-[11px] font-mono bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded border border-cyan-200">
              HL7® FHIR® R4 Bridge
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time bidirectional synchronization with Epic Systems, Oracle Cerner, Athenahealth, Veradigm, and MEDITECH.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => syncAllEhrPlatforms()}
            disabled={isSyncingEhr}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingEhr ? 'animate-spin' : ''}`} />
            <span>{isSyncingEhr ? 'Synchronizing All Clinical Networks...' : 'Sync All Systems Now'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Connected EHR Systems</span>
          <span className="text-2xl font-black text-white tracking-tight mt-1 block">
            {ehrPlatforms.filter((p) => p.status === 'connected').length} of {ehrPlatforms.length} Active
          </span>
          <span className="text-[11px] text-emerald-400 font-medium">100% Uptime</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 block font-medium">Total Synced Resources</span>
          <span className="text-2xl font-black text-teal-400 tracking-tight mt-1 block font-mono">
            {totalSynced} Records
          </span>
          <span className="text-[11px] text-slate-400">Labs, Encounters & Meds</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 block font-medium">Interoperability Protocol</span>
          <span className="text-sm font-bold text-white tracking-tight mt-1.5 block font-mono">
            HL7 FHIR Release 4
          </span>
          <span className="text-[11px] text-slate-400">US Core STU3.1.1 Compliant</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 block font-medium">Security & Encryption</span>
          <span className="text-sm font-bold text-emerald-400 tracking-tight mt-1.5 block flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-400" />
            TLS 1.3 / AES-256 GCM
          </span>
          <span className="text-[11px] text-slate-400">HIPAA BAA Fully Executed</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('platforms')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'platforms'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-teal-600" />
          <span>Connected Clinical Platforms ({ehrPlatforms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'reconciliation'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
          <span>Data Conflict Reconciliation</span>
        </button>

        <button
          onClick={() => setActiveTab('fhir_inspector')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'fhir_inspector'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-cyan-600" />
          <span>FHIR R4 Schema Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_log')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'audit_log'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-slate-600" />
          <span>HIPAA Audit Trail Log</span>
        </button>
      </div>

      {/* Tab 1: Platforms List */}
      {activeTab === 'platforms' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ehrPlatforms.map((ehr) => (
              <div
                key={ehr.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 font-extrabold font-mono text-xs flex items-center justify-center shrink-0 border border-slate-800">
                        {ehr.logoBadge}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          {ehr.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {ehr.connectedFacility}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Connected
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">FHIR API Endpoint:</span>
                      <span className="font-mono text-slate-700 text-[11px] truncate max-w-[220px]">
                        {ehr.fhirEndpoint}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Successful Sync:</span>
                      <span className="font-semibold text-slate-800">{ehr.lastSyncTimestamp}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Synced Resources:</span>
                      <span className="font-mono font-bold text-teal-700">
                        {ehr.syncedRecordsCount} clinical resources
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Protocol Spec:</span>
                      <span className="text-slate-600">{ehr.protocolVersion}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Auto-sync: Every {ehr.autoSyncIntervalMinutes}m
                  </span>

                  <button
                    onClick={() => syncSingleEhr(ehr.id)}
                    disabled={isSyncingEhr}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-teal-600 ${isSyncingEhr ? 'animate-spin' : ''}`} />
                    <span>Sync Platform</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Reconciliation Conflict Simulator */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Cross-Platform Clinical Record Reconciliation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated reconciliation detects discrepancies between inpatient hospital discharges and outpatient primary care regimens.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Detected Medication Formulation Discrepancy (Reconciliation Required)
              </span>
              <span className="text-[11px] font-mono text-amber-800">Rule #FHIR-REC-204</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  Source: Epic Systems (Metropolitan Hospital Discharge)
                </span>
                <p className="text-slate-600">
                  Prescription: <span className="font-bold text-slate-900">Atorvastatin Calcium 40 mg</span>
                </p>
                <p className="text-slate-500 text-[11px]">
                  Ordered by Inpatient Cardiology during temporary titration.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  Source: Oracle Cerner (Outpatient Primary Care)
                </span>
                <p className="text-slate-600">
                  Prescription: <span className="font-bold text-slate-900">Atorvastatin Calcium 20 mg</span>
                </p>
                <p className="text-slate-500 text-[11px]">
                  Confirmed maintenance dose ordered by Dr. Marcus Hayes, MD.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <p className="text-xs text-amber-900">
                {conflictResolved
                  ? 'Reconciliation Applied: Maintained 20mg maintenance dose per Dr. Hayes ambulatory consultation. Discontinued inpatient temporary 40mg order.'
                  : 'Action needed: Harmonize master medication list to prevent duplicate dosing.'}
              </p>

              {!conflictResolved ? (
                <button
                  onClick={handleResolveConflict}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                >
                  Harmonize & Accept 20mg Maintenance
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
                  <Check className="w-4 h-4" />
                  Harmonized & Resolved
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: FHIR Inspector */}
      {activeTab === 'fhir_inspector' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Live FHIR R4 Bundle Payload Inspector
            </h3>
            <p className="text-xs text-slate-500">
              Bi-directional JSON stream exchanged between AegisHealth Connect gateway and connected clinical servers.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 border border-slate-800">
            <pre>
              {JSON.stringify(
                {
                  resourceType: 'Bundle',
                  id: 'bundle-fhir-sync-99201',
                  meta: {
                    lastUpdated: new Date().toISOString(),
                    security: [
                      {
                        system: 'http://terminology.hl7.org/CodeSystem/v3-Confidentiality',
                        code: 'R',
                        display: 'Restricted',
                      },
                    ],
                  },
                  type: 'transaction',
                  entry: [
                    {
                      fullUrl: `urn:uuid:patient-${patient.id}`,
                      resource: {
                        resourceType: 'Patient',
                        id: patient.id,
                        identifier: [{ system: 'urn:oid:1.3.6.1.4.1', value: patient.mrn }],
                        name: [{ use: 'official', family: 'Vance', given: ['Eleanor'] }],
                        gender: 'female',
                        birthDate: patient.dob,
                      },
                    },
                    {
                      fullUrl: 'urn:uuid:observation-bp',
                      resource: {
                        resourceType: 'Observation',
                        status: 'final',
                        category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
                        code: { coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel with all children optional' }] },
                        component: [
                          { code: { text: 'Systolic blood pressure' }, valueQuantity: { value: 120, unit: 'mmHg' } },
                          { code: { text: 'Diastolic blood pressure' }, valueQuantity: { value: 76, unit: 'mmHg' } },
                        ],
                      },
                    },
                  ],
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Log */}
      {activeTab === 'audit_log' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              HIPAA Interoperability Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Immutable ledger of all clinical cross-facility electronic data transfers (45 CFR § 164.312(b)).
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">EHR Platform</th>
                  <th className="py-2.5 px-3">FHIR Resource</th>
                  <th className="py-2.5 px-3">Records Count</th>
                  <th className="py-2.5 px-3">Security & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {ehrPlatforms.flatMap((p) => p.syncHistory).map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-slate-600">{entry.timestamp}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 font-sans">
                      {entry.message.split(' ')[0]} Clinical Server
                    </td>
                    <td className="py-2.5 px-3 text-teal-700">{entry.resourceType}</td>
                    <td className="py-2.5 px-3 text-slate-800 font-bold">{entry.recordsProcessed} items</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-sans">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified TLS 1.3
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
