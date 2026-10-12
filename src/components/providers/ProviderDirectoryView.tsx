import React, { useState } from 'react';
import { availableDoctors } from '../../data/mockHealthData';
import { Doctor } from '../../types';
import { useHealth } from '../../context/HealthContext';
import {
  Search,
  Stethoscope,
  Star,
  Calendar,
  Clock,
  Video,
  Building,
  Phone,
  GraduationCap,
  Award,
  Globe,
  MessageSquare,
  CheckCircle2,
  X,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Filter,
} from 'lucide-react';

interface ProviderDirectoryViewProps {
  onBookDoctor: (doctorId: string) => void;
  onMessageDoctor: (doctorId: string) => void;
}

export const ProviderDirectoryView: React.FC<ProviderDirectoryViewProps> = ({
  onBookDoctor,
  onMessageDoctor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [onlyAcceptingNew, setOnlyAcceptingNew] = useState(false);
  const [onlyTelehealth, setOnlyTelehealth] = useState(false);
  const [selectedDoctorForProfile, setSelectedDoctorForProfile] = useState<Doctor | null>(null);

  const specialties = [
    { id: 'all', label: 'All Specialties' },
    { id: 'primary', label: 'Primary Care' },
    { id: 'cardio', label: 'Cardiology' },
    { id: 'endo', label: 'Endocrinology' },
    { id: 'derm', label: 'Dermatology' },
    { id: 'pulm', label: 'Pulmonology' },
    { id: 'ortho', label: 'Orthopedics' },
    { id: 'neuro', label: 'Neurology' },
    { id: 'triage', label: 'Ambulatory Triage' },
  ];

  const filteredDoctors = availableDoctors.filter((doc) => {
    // Search query matching
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === '' ||
      doc.name.toLowerCase().includes(query) ||
      doc.specialty.toLowerCase().includes(query) ||
      doc.department.toLowerCase().includes(query) ||
      doc.facility.toLowerCase().includes(query) ||
      doc.subSpecialties?.some((s) => s.toLowerCase().includes(query)) ||
      doc.languages?.some((l) => l.toLowerCase().includes(query));

    // Specialty filter
    let matchesSpecialty = true;
    if (selectedSpecialty === 'primary') matchesSpecialty = doc.specialty.includes('Primary') || doc.specialty.includes('Internal');
    else if (selectedSpecialty === 'cardio') matchesSpecialty = doc.specialty.includes('Cardio');
    else if (selectedSpecialty === 'endo') matchesSpecialty = doc.specialty.includes('Endocrin');
    else if (selectedSpecialty === 'derm') matchesSpecialty = doc.specialty.includes('Dermatol');
    else if (selectedSpecialty === 'pulm') matchesSpecialty = doc.specialty.includes('Pulmon');
    else if (selectedSpecialty === 'ortho') matchesSpecialty = doc.specialty.includes('Orthoped');
    else if (selectedSpecialty === 'neuro') matchesSpecialty = doc.specialty.includes('Neurol');
    else if (selectedSpecialty === 'triage') matchesSpecialty = doc.specialty.includes('Triage') || doc.specialty.includes('Nurse');

    // Toggle filters
    const matchesAccepting = !onlyAcceptingNew || doc.acceptingNewPatients;
    const matchesTelehealth = !onlyTelehealth || doc.telehealthAvailable;

    return matchesSearch && matchesSpecialty && matchesAccepting && matchesTelehealth;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Clinical Specialist & Physician Directory
            </h2>
            <span className="text-[11px] font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
              Verified Care Team
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse board-certified specialists and primary care clinicians. Review credentials, verified patient ratings, and live appointment availability.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>All Providers Credentialed & Affiliated</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by provider name, medical specialty (e.g., Cardiology, Endocrinology), condition, or campus..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
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

        {/* Specialty Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {specialties.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setSelectedSpecialty(spec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSpecialty === spec.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec.label}
            </button>
          ))}
        </div>

        {/* Additional Toggle Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAcceptingNew}
              onChange={(e) => setOnlyAcceptingNew(e.target.checked)}
              className="rounded text-teal-600 w-3.5 h-3.5"
            />
            <span>Accepting New Patients</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyTelehealth}
              onChange={(e) => setOnlyTelehealth(e.target.checked)}
              className="rounded text-teal-600 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-cyan-600" />
              <span>Telehealth Video Eligible</span>
            </span>
          </label>

          <span className="text-slate-400 font-mono text-[11px] ml-auto">
            Showing {filteredDoctors.length} of {availableDoctors.length} Physicians
          </span>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Doctor Header */}
              <div className="flex items-start gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                  />
                  {doc.acceptingNewPatients && (
                    <span
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"
                      title="Accepting New Patients"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-slate-900 text-base truncate">
                      {doc.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({doc.patientReviewsCount || 150})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-teal-700 font-semibold truncate">
                    {doc.title} · {doc.specialty}
                  </p>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <Building className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{doc.facility}</span>
                  </p>
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {doc.bio}
              </p>

              {/* Availability & Next Slot */}
              <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    Next Available:
                  </span>
                  <span className="font-bold text-teal-700 font-mono text-[11px]">
                    {doc.nextAvailableSlot || 'Contact Clinic'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>In-Clinic Days:</span>
                  <span className="font-medium text-slate-700">
                    {doc.availableDays.map((d) => d.slice(0, 3)).join(' · ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>Visit Options:</span>
                  <div className="flex items-center gap-2 font-medium">
                    {doc.inPersonAvailable && <span className="text-slate-700">In-Person</span>}
                    {doc.inPersonAvailable && doc.telehealthAvailable && <span>·</span>}
                    {doc.telehealthAvailable && (
                      <span className="text-teal-700 font-semibold flex items-center gap-1">
                        <Video className="w-3 h-3" /> Virtual Video
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Subspecialties chips */}
              {doc.subSpecialties && (
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {doc.subSpecialties.map((sub, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedDoctorForProfile(doc)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1.5"
              >
                Full Profile & Bio
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onMessageDoctor(doc.id)}
                  title="Send message to this clinician"
                  className="p-2 text-slate-600 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 rounded-xl border border-slate-200 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onBookDoctor(doc.id)}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDoctors.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No providers match your search filters</h4>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your specialty filter or clearing the search terms.
            </p>
          </div>
        )}
      </div>

      {/* Doctor Detailed Profile Modal */}
      {selectedDoctorForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctorForProfile.avatar}
                  alt={selectedDoctorForProfile.name}
                  className="w-18 h-18 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-lg">
                      {selectedDoctorForProfile.name}
                    </h3>
                    <span className="text-xs text-teal-700 font-mono font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {selectedDoctorForProfile.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {selectedDoctorForProfile.specialty}
                  </p>
                  <p className="text-xs text-slate-500">{selectedDoctorForProfile.department}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctorForProfile(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ratings & Acceptance row */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-center">
              <div>
                <span className="text-slate-400 block text-[11px]">Patient Rating</span>
                <span className="font-bold text-amber-500 flex items-center justify-center gap-1 text-sm mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {selectedDoctorForProfile.rating} / 5.0
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Clinical Experience</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {selectedDoctorForProfile.yearsExperience || 15}+ Years
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">New Patients</span>
                <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                  {selectedDoctorForProfile.acceptingNewPatients ? 'Accepting' : 'Waitlist Only'}
                </span>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Clinical Philosophy & Biography:
              </h4>
              <p className="text-slate-600 leading-relaxed">{selectedDoctorForProfile.bio}</p>
            </div>

            {/* Education & Board Certifications */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Credentials & Medical Training:
              </h4>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                {selectedDoctorForProfile.education && (
                  <div className="flex items-start gap-2 text-slate-700">
                    <GraduationCap className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Education:</span>{' '}
                      {selectedDoctorForProfile.education}
                    </div>
                  </div>
                )}

                {selectedDoctorForProfile.boardCertifications && (
                  <div className="flex items-start gap-2 text-slate-700">
                    <Award className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Board Certifications:</span>
                      <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-slate-600">
                        {selectedDoctorForProfile.boardCertifications.map((cert, i) => (
                          <li key={i}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {selectedDoctorForProfile.languages && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Globe className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Languages:</span>{' '}
                      {selectedDoctorForProfile.languages.join(', ')}
                    </div>
                  </div>
                )}

                {selectedDoctorForProfile.officePhone && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Direct Office:</span>{' '}
                      <span className="font-mono">{selectedDoctorForProfile.officePhone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability Box with Action */}
            <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider block">
                  Next Available Opening:
                </span>
                <span className="text-sm font-extrabold text-teal-950 font-mono">
                  {selectedDoctorForProfile.nextAvailableSlot || 'Call Office'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const docId = selectedDoctorForProfile.id;
                    setSelectedDoctorForProfile(null);
                    onMessageDoctor(docId);
                  }}
                  className="px-3 py-2 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl border border-slate-300"
                >
                  Send Message
                </button>
                <button
                  onClick={() => {
                    const docId = selectedDoctorForProfile.id;
                    setSelectedDoctorForProfile(null);
                    onBookDoctor(docId);
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
