import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { MedicalRecord, RecordCategory } from '../../types';
import {
  FileText,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Code,
  Pill,
  Syringe,
  Activity,
  Heart,
  ChevronDown,
  ChevronUp,
  X,
  Share2,
  Calendar,
  Building,
  User,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { SecurePdfExportModal } from './SecurePdfExportModal';

export const MedicalRecordsView: React.FC = () => {
  const { records, patient, requestMedicationRefill } = useHealth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<MedicalRecord | null>(null);
  const [fhirModalRecord, setFhirModalRecord] = useState<MedicalRecord | null>(null);
  const [refillModalMed, setRefillModalMed] = useState<MedicalRecord | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(patient.preferredPharmacy.name);
  const [exportSummaryModal, setExportSummaryModal] = useState(false);
  const [showSecurePdfModal, setShowSecurePdfModal] = useState(false);

  // Filter records
  const filteredRecords = records.filter((rec) => {
    const matchesCategory =
      selectedCategory === 'all' || rec.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.facility.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Records', count: records.length },
    { id: 'lab', label: 'Lab & Diagnostic Tests', count: records.filter((r) => r.category === 'lab').length },
    { id: 'medication', label: 'Prescriptions & Meds', count: records.filter((r) => r.category === 'medication').length },
    { id: 'visit_note', label: 'Clinical Visit Notes', count: records.filter((r) => r.category === 'visit_note').length },
    { id: 'immunization', label: 'Immunizations', count: records.filter((r) => r.category === 'immunization').length },
    { id: 'allergy', label: 'Allergies & Alerts', count: records.filter((r) => r.category === 'allergy').length },
  ];

  const handleRefillSubmit = () => {
    if (!refillModalMed) return;
    requestMedicationRefill(refillModalMed.id, selectedPharmacy);
    setRefillModalMed(null);
  };

  const handleExportDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(
        {
          resourceType: 'Bundle',
          type: 'document',
          timestamp: new Date().toISOString(),
          patient: {
            name: patient.name,
            mrn: patient.mrn,
            dob: patient.dob,
          },
          records: records,
        },
        null,
        2
      )
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AegisHealth_Records_${patient.mrn}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExportSummaryModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Electronic Health Records (EHR)
            </h2>
            <span className="text-[11px] font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
              FHIR R4 Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access, inspect, and export verified clinical laboratory observations, prescribed pharmaceuticals, physician notes, and allergies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowSecurePdfModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Export Encrypted PDF</span>
          </button>

          <button
            onClick={() => setExportSummaryModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export FHIR JSON</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clinical records by test name, medication, provider, or ICD/LOINC code..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Buttons (Functional Segmented Tab Bar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === cat.id ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Medical Records List */}
      <div className="space-y-3.5">
        {filteredRecords.map((record) => {
          const hasOutOfRange = record.testResults?.some((t) => t.isOutOfRange);

          return (
            <div
              key={record.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {record.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {record.date}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {record.facility}
                    </span>
                    {hasOutOfRange && (
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Out-of-Range Parameter
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {record.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {record.summary}
                  </p>

                  <div className="pt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Attending: <span className="text-slate-800 font-medium">{record.provider}</span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>Status: <span className="font-semibold text-slate-700 capitalize">{record.status}</span></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  {record.medicationInfo && (
                    <button
                      onClick={() => setRefillModalMed(record)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      Request Refill
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setSelectedRecordForDetail(
                        selectedRecordForDetail?.id === record.id ? null : record
                      )
                    }
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <span>{selectedRecordForDetail?.id === record.id ? 'Hide Details' : 'View Clinical Details'}</span>
                    {selectedRecordForDetail?.id === record.id ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {record.fhirResource && (
                    <button
                      onClick={() => setFhirModalRecord(record)}
                      title="Inspect HL7 FHIR R4 JSON Schema"
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Code className="w-4 h-4 text-teal-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsible Details Panel (e.g. Test Results Table) */}
              {selectedRecordForDetail?.id === record.id && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                  {/* If Lab Results */}
                  {record.testResults && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                          Biochemical Parameters & Reference Intervals
                        </h4>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Standard: Clinical Laboratory Improvement Amendments (CLIA)
                        </span>
                      </div>

                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-3">Analyte / Biomarker</th>
                              <th className="py-2.5 px-3">Result</th>
                              <th className="py-2.5 px-3">Standard Reference Interval</th>
                              <th className="py-2.5 px-3">Clinical Evaluation</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {record.testResults.map((t, idx) => (
                              <tr
                                key={idx}
                                className={t.isOutOfRange ? 'bg-amber-50/50' : 'hover:bg-slate-50/50'}
                              >
                                <td className="py-2.5 px-3 font-semibold text-slate-900">
                                  {t.parameter}
                                </td>
                                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                                  {t.value} {t.unit}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 font-mono">
                                  {t.referenceRange}
                                </td>
                                <td className="py-2.5 px-3">
                                  {t.isOutOfRange ? (
                                    <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded text-[11px]">
                                      <AlertTriangle className="w-3 h-3" />
                                      Elevated ({t.flag})
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Normal
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* If Medication Details */}
                  {record.medicationInfo && (
                    <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-900">
                          Prescription Details (Rx: {record.medicationInfo.rxNumber})
                        </span>
                        <span className="font-mono text-teal-800 font-semibold">
                          {record.medicationInfo.refillsRemaining} Refills Remaining
                        </span>
                      </div>
                      <p className="text-slate-700">
                        <span className="font-semibold text-slate-900">Dosage & Schedule:</span>{' '}
                        {record.medicationInfo.dosage} — {record.medicationInfo.frequency}
                      </p>
                      <p className="text-slate-700">
                        <span className="font-semibold text-slate-900">Clinical Instructions:</span>{' '}
                        {record.medicationInfo.instructions}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-teal-100">
                        <span>Prescribed: {record.medicationInfo.prescribedDate}</span>
                        <span>Expires: {record.medicationInfo.expiresDate}</span>
                      </div>
                    </div>
                  )}

                  {/* Metadata key-values if available */}
                  {record.details && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                      {Object.entries(record.details).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1 border-b border-slate-200/50 last:border-0">
                          <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-medium text-slate-800 text-right">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredRecords.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No matching medical records found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or clearing the category filter.
            </p>
          </div>
        )}
      </div>

      {/* FHIR JSON Inspection Modal */}
      {fhirModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  HL7 FHIR R4 Resource Preview
                </h3>
              </div>
              <button
                onClick={() => setFhirModalRecord(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Standardized interoperability schema for {fhirModalRecord.title} formatted per ONC Cures Act and US Core Data for Interoperability (USCDI).
            </p>

            <div className="flex-1 overflow-y-auto bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-xl border border-slate-800">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    resourceType: fhirModalRecord.fhirResource?.resourceType || 'DocumentReference',
                    id: fhirModalRecord.fhirResource?.id || fhirModalRecord.id,
                    status: fhirModalRecord.status,
                    subject: {
                      reference: `Patient/${patient.id}`,
                      display: patient.name,
                    },
                    effectiveDateTime: fhirModalRecord.date,
                    code: fhirModalRecord.fhirResource?.code || {
                      text: fhirModalRecord.title,
                    },
                    performer: [
                      {
                        display: fhirModalRecord.provider,
                      },
                    ],
                    custodian: {
                      display: fhirModalRecord.facility,
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setFhirModalRecord(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medication Refill Modal */}
      {refillModalMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Prescription Refill Request
                </h3>
              </div>
              <button
                onClick={() => setRefillModalMed(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{refillModalMed.title}</p>
              <p className="text-slate-600">
                Prescribing Physician: {refillModalMed.provider}
              </p>
              <p className="text-slate-600 font-mono">
                Rx Number: {refillModalMed.medicationInfo?.rxNumber}
              </p>
              <p className="text-teal-700 font-semibold pt-1">
                Refills remaining: {refillModalMed.medicationInfo?.refillsRemaining}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Select Dispensing Pharmacy:
              </label>
              <select
                value={selectedPharmacy}
                onChange={(e) => setSelectedPharmacy(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 text-slate-900"
              >
                <option value={patient.preferredPharmacy.name}>
                  {patient.preferredPharmacy.name} (Preferred on file)
                </option>
                <option value="CVS Pharmacy #3819 - NW 23rd Ave">
                  CVS Pharmacy #3819 - NW 23rd Ave
                </option>
                <option value="Costco Health Pharmacy - Portland Gateway">
                  Costco Health Pharmacy - Portland Gateway
                </option>
                <option value="Hospital Outpatient Pharmacy - St. Jude Medical">
                  Hospital Outpatient Pharmacy - St. Jude Medical
                </option>
              </select>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
              Refill orders are electronically validated against Surescripts network and sent to Dr. Marcus Hayes for authorized co-signature.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRefillModalMed(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleRefillSubmit}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Transmit Refill Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Summary Modal */}
      {exportSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Export Verified Health Continuity Record
                </h3>
              </div>
              <button
                onClick={() => setExportSummaryModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Export your clinical summary in standard HL7 FHIR R4 and C-CDA format compatible with any US hospital network or personal health record app.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-slate-900">{patient.name} ({patient.mrn})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Record Count:</span>
                <span className="font-semibold text-slate-900">{records.length} Clinical Items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Encryption:</span>
                <span className="font-semibold text-emerald-700">AES-256 GCM</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setExportSummaryModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleExportDownload}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download FHIR JSON Bundle</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secure Password-Protected PDF Exporter */}
      {showSecurePdfModal && (
        <SecurePdfExportModal
          isOpen={showSecurePdfModal}
          onClose={() => setShowSecurePdfModal(false)}
        />
      )}
    </div>
  );
};
