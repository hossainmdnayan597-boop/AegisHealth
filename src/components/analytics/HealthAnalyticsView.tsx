import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  TrendingUp,
  Activity,
  Heart,
  Pill,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Award,
  Calendar,
  Users,
  LineChart,
  Layers,
} from 'lucide-react';

export const HealthAnalyticsView: React.FC = () => {
  const { analytics, logNewVitals, patient, role } = useHealth();

  const [showLogModal, setShowLogModal] = useState(false);
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(76);
  const [glucose, setGlucose] = useState<number>(98);
  const [heartRate, setHeartRate] = useState<number>(68);
  const [spo2, setSpo2] = useState<number>(99);

  const vitals = analytics.vitalsHistory;
  const latestVital = vitals[vitals.length - 1];

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logNewVitals({
      systolicBP: Number(systolic),
      diastolicBP: Number(diastolic),
      bloodGlucose: Number(glucose),
      restingHeartRate: Number(heartRate),
      spo2: Number(spo2),
    });
    setShowLogModal(false);
  };

  // SVG Chart calculation for Blood Pressure
  const chartHeight = 160;
  const chartWidth = 520;
  const paddingX = 40;
  const paddingY = 25;

  const minVal = 60;
  const maxVal = 160;

  const getY = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal);
    return chartHeight - paddingY - ratio * (chartHeight - 2 * paddingY);
  };

  const getX = (idx: number, count: number) => {
    return paddingX + (idx / (count - 1)) * (chartWidth - 2 * paddingX);
  };

  const systolicPoints = vitals
    .map((v, i) => `${getX(i, vitals.length)},${getY(v.systolicBP)}`)
    .join(' ');

  const diastolicPoints = vitals
    .map((v, i) => `${getX(i, vitals.length)},${getY(v.diastolicBP)}`)
    .join(' ');

  const glucosePoints = vitals
    .map((v, i) => `${getX(i, vitals.length)},${getY(v.bloodGlucose)}`)
    .join(' ');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Real-Time Health Analytics & Clinical Outcomes
            </h2>
            <span className="text-[11px] font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
              Continuous Biomarker Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking longitudinal vital trajectories, medication compliance scores, and evidence-based preventive health targets.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Vitals Today</span>
        </button>
      </div>

      {/* Clinician Population Health Panel (if provider role) */}
      {role === 'provider' && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-sm tracking-tight text-white uppercase tracking-wider">
                Clinical Population Health Cohort Analytics (Internal Medicine Dept)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              NPI: 1894029 · Dr. Elena Vasquez Panel
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block">Total Active Cohort</span>
              <span className="text-2xl font-black text-white block mt-1">148</span>
              <span className="text-[11px] text-teal-400 font-medium">Assigned Patients</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block">Hypertension Control</span>
              <span className="text-2xl font-black text-emerald-400 block mt-1 font-mono">88.4%</span>
              <span className="text-[11px] text-slate-400">Target &lt; 130/80 mmHg</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block">HbA1c &lt; 7.0% Compliance</span>
              <span className="text-2xl font-black text-teal-400 block mt-1 font-mono">91.2%</span>
              <span className="text-[11px] text-slate-400">Metabolic Panel cohort</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block">Preventive Care Gap</span>
              <span className="text-2xl font-black text-amber-400 block mt-1 font-mono">12</span>
              <span className="text-[11px] text-amber-300">Mammography/Flu alerts</span>
            </div>
          </div>
        </div>
      )}

      {/* 4 Outcome Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Adherence */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Medication Adherence</span>
            <Pill className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {analytics.medicationAdherenceRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              High
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            28 of 30 daily Lisinopril doses confirmed on schedule.
          </p>
        </div>

        {/* Engagement Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Patient Engagement Index</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {analytics.overallEngagementScore}/100
            </span>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Top 10%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Frequent vitals logging and automated reminder check-ins.
          </p>
        </div>

        {/* Risk Stratification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Clinical Risk Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700 tracking-tight">
              {analytics.riskStratification}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            ASCVD 10-Year Cardiovascular Event Risk: 3.2% (Low threshold).
          </p>
        </div>

        {/* Care Gaps */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Preventive Screening Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {analytics.preventiveCareGapCount}
            </span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Due Soon
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Routine Annual Mammography ordered for Autumn 2026.
          </p>
        </div>
      </div>

      {/* Main Charts: Blood Pressure Timeline & Glucose Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Pressure Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Blood Pressure Trajectory (6-Month Trend)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target: &lt; 120 Systolic / &lt; 80 Diastolic mmHg
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                <span className="w-3 h-1 bg-rose-600 rounded" /> Systolic
              </span>
              <span className="flex items-center gap-1.5 text-teal-600 font-semibold">
                <span className="w-3 h-1 bg-teal-600 rounded" /> Diastolic
              </span>
            </div>
          </div>

          {/* Responsive SVG Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-48 select-none"
            >
              {/* Guidelines / Target zones */}
              <line
                x1={paddingX}
                y1={getY(140)}
                x2={chartWidth - paddingX}
                y2={getY(140)}
                stroke="#cbd5e1"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={chartWidth - paddingX}
                y={getY(140) - 4}
                textAnchor="end"
                className="text-[9px] fill-slate-400 font-mono"
              >
                Stage 1 HTN (140)
              </text>

              <line
                x1={paddingX}
                y1={getY(120)}
                x2={chartWidth - paddingX}
                y2={getY(120)}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={chartWidth - paddingX}
                y={getY(120) - 4}
                textAnchor="end"
                className="text-[9px] fill-emerald-600 font-mono font-bold"
              >
                Optimal Target (120)
              </text>

              <line
                x1={paddingX}
                y1={getY(80)}
                x2={chartWidth - paddingX}
                y2={getY(80)}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={chartWidth - paddingX}
                y={getY(80) - 4}
                textAnchor="end"
                className="text-[9px] fill-emerald-600 font-mono font-bold"
              >
                Diastolic Target (80)
              </text>

              {/* Systolic Polyline */}
              <polyline
                fill="none"
                stroke="#e11d48"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={systolicPoints}
              />

              {/* Diastolic Polyline */}
              <polyline
                fill="none"
                stroke="#0d9488"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={diastolicPoints}
              />

              {/* Data points */}
              {vitals.map((v, i) => (
                <g key={v.id}>
                  <circle
                    cx={getX(i, vitals.length)}
                    cy={getY(v.systolicBP)}
                    r="4"
                    fill="#e11d48"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle
                    cx={getX(i, vitals.length)}
                    cy={getY(v.diastolicBP)}
                    r="4"
                    fill="#0d9488"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={getX(i, vitals.length)}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-500 font-mono"
                  >
                    {v.date.split('-')[1]}/{v.date.split('-')[2]}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Progress: Systolic decreased from 138 → 120 mmHg under Lisinopril 10mg.</span>
            <span className="text-emerald-700 font-bold">Normotensive</span>
          </div>
        </div>

        {/* Fasting Glucose Trajectory */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Fasting Blood Glucose Trajectory
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Window: 70 – 99 mg/dL
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-amber-600">
              Latest: {latestVital?.bloodGlucose} mg/dL
            </span>
          </div>

          {/* SVG Chart for Glucose */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-48 select-none"
            >
              {/* Target line (100) */}
              <line
                x1={paddingX}
                y1={getY(100)}
                x2={chartWidth - paddingX}
                y2={getY(100)}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={chartWidth - paddingX}
                y={getY(100) - 4}
                textAnchor="end"
                className="text-[9px] fill-amber-600 font-mono font-bold"
              >
                Normal Threshold (100)
              </text>

              {/* Glucose Polyline */}
              <polyline
                fill="none"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={glucosePoints}
              />

              {/* Dots */}
              {vitals.map((v, i) => (
                <g key={v.id}>
                  <circle
                    cx={getX(i, vitals.length)}
                    cy={getY(v.bloodGlucose)}
                    r="4"
                    fill="#d97706"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={getX(i, vitals.length)}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-500 font-mono"
                  >
                    {v.date.split('-')[1]}/{v.date.split('-')[2]}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Longitudinal stability: Fasting glucose restored to normal baseline (&lt; 100 mg/dL).</span>
            <span className="text-emerald-700 font-bold">Controlled</span>
          </div>
        </div>
      </div>

      {/* Log Vitals Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Log Biometric Vitals Reading
            </h3>
            <p className="text-xs text-slate-500">
              Readings are automatically synchronized with your clinician's EHR flow-sheet and analytics engine.
            </p>

            <form onSubmit={handleLogSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Systolic BP (mmHg):</label>
                  <input
                    type="number"
                    required
                    min={80}
                    max={220}
                    value={systolic}
                    onChange={(e) => setSystolic(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Diastolic BP (mmHg):</label>
                  <input
                    type="number"
                    required
                    min={50}
                    max={140}
                    value={diastolic}
                    onChange={(e) => setDiastolic(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Fasting Glucose (mg/dL):</label>
                  <input
                    type="number"
                    required
                    min={50}
                    max={350}
                    value={glucose}
                    onChange={(e) => setGlucose(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Resting Heart Rate (bpm):</label>
                  <input
                    type="number"
                    required
                    min={40}
                    max={180}
                    value={heartRate}
                    onChange={(e) => setHeartRate(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Pulse Oximetry SpO2 (%):</label>
                <input
                  type="number"
                  required
                  min={85}
                  max={100}
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl"
                >
                  Save & Transmit Biometrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
