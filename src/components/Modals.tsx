import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Droplets,
  HeartHandshake,
  Info,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  BLOOD_GROUPS,
  BLOOD_GROUP_THEMES,
  DEMO_CITIES,
  SAFETY_DISCLAIMER,
  formatBloodGroupLabel,
} from '../data/mockData';
import { BloodGroup, UrgencyLevel } from '../types';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-[calc(100vw-2.5rem)]"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl bg-[#171C3A] text-white p-4 shadow-2xl border border-white/12 flex items-start gap-3 transition-all"
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              toast.variant === 'success'
                ? 'bg-[#36D6A5]/20 text-[#36D6A5]'
                : toast.variant === 'warning'
                ? 'bg-[#FF9F43]/20 text-[#FF9F43]'
                : 'bg-[#4D96FF]/20 text-[#7DD3FC]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const AuthModal: React.FC = () => {
  const { authModal, closeAuthModal, loginUser, navigate } = useApp();
  const [name, setName] = useState('Jordan Avery');
  const [email, setEmail] = useState('jordan.avery.demo@example.org');

  if (!authModal) return null;

  const isSignup = authModal === 'signup';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(name, email);
    navigate('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171C3A]/55 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl border border-[#171C3A]/8 relative"
      >
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-[#F8F7FF] hover:bg-[#ECE8FF] flex items-center justify-center text-[#171C3A] cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E63946] to-[#FF4D9D] text-white flex items-center justify-center mb-4">
          <User className="w-5 h-5" />
        </div>

        <h2 id="auth-modal-title" className="font-display text-2xl font-extrabold text-[#171C3A]">
          {isSignup ? 'Create Demo Account' : 'Sign In to LifeDrop'}
        </h2>
        <p className="text-sm text-[#5A607F] mt-1">
          Access the interactive donor dashboard, saved connections, and availability controls.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-[#171C3A] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-4 py-2.5 text-sm text-[#171C3A] focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-[#171C3A] mb-1.5">
              Demo Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-4 py-2.5 text-sm text-[#171C3A] focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#E63946] via-[#FF647C] to-[#FF4D9D] shadow-lg shadow-[#E63946]/25 hover:scale-[1.01] transition-transform cursor-pointer"
          >
            {isSignup ? 'Start Demo Session' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#171C3A]/8 flex items-center justify-between text-xs text-[#5A607F]">
          <span>Want to list as a new donor?</span>
          <button
            type="button"
            onClick={() => {
              closeAuthModal();
              navigate('register');
            }}
            className="font-bold text-[#E63946] hover:underline cursor-pointer"
          >
            Go to Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export const CreateRequestModal: React.FC = () => {
  const { createRequestOpen, closeCreateRequest, addBloodRequest } = useApp();
  const [patientReference, setPatientReference] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Urgent');
  const [hospital, setHospital] = useState('');
  const [city, setCity] = useState(DEMO_CITIES[0]);
  const [area, setArea] = useState('');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [timeRemaining, setTimeRemaining] = useState('4 hours left');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!createRequestOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientReference.trim() || !hospital.trim() || !area.trim() || !contactName.trim() || !contactPhone.trim()) {
      setError('Please complete all required fields before publishing your demo request.');
      return;
    }
    setError('');
    addBloodRequest({
      patientReference,
      bloodGroup,
      urgency,
      hospital,
      city,
      area,
      unitsRequired,
      timeRemaining,
      contactName,
      contactPhone,
      notes,
    });
    setPatientReference('');
    setHospital('');
    setArea('');
    setContactName('');
    setContactPhone('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171C3A]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="req-modal-title"
        className="w-full max-w-xl rounded-[28px] bg-white p-6 sm:p-8 shadow-2xl border border-[#171C3A]/8 my-8 relative"
      >
        <button
          type="button"
          onClick={closeCreateRequest}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-[#F8F7FF] hover:bg-[#ECE8FF] flex items-center justify-center text-[#171C3A] cursor-pointer"
          aria-label="Close request modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E63946] to-[#FF9F43] text-white flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h2 id="req-modal-title" className="font-display text-xl sm:text-2xl font-extrabold text-[#171C3A]">
              Post Blood Request (Demo)
            </h2>
            <p className="text-xs text-[#5A607F]">
              Connect with nearby community donors. Never include sensitive medical records.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-[#FFF0F3] border border-[#E63946]/25 px-4 py-2.5 text-xs font-semibold text-[#E63946]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171C3A] mb-1">
                Case / Patient Label *
              </label>
              <input
                type="text"
                placeholder="e.g. Surgical Care #710"
                value={patientReference}
                onChange={(e) => setPatientReference(e.target.value)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-3.5 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171C3A] mb-1">Blood Group *</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-3.5 py-2.5 text-sm font-semibold focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {formatBloodGroupLabel(bg)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171C3A] mb-1">Urgency *</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-3.5 py-2.5 text-sm font-semibold focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="Urgent">Urgent</option>
                <option value="Normal">Normal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171C3A] mb-1">Units Needed *</label>
              <input
                type="number"
                min={1}
                max={10}
                value={unitsRequired}
                onChange={(e) => setUnitsRequired(Number(e.target.value) || 1)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-3.5 py-2.5 text-sm tabular-nums focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171C3A] mb-1">Time Window</label>
              <select
                value={timeRemaining}
                onChange={(e) => setTimeRemaining(e.target.value)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-3.5 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              >
                <option value="Under 2 hours">Under 2 hours</option>
                <option value="4 hours left">Within 4 hours</option>
                <option value="8 hours left">Within 8 hours</option>
                <option value="24 hours left">Within 24 hours</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-[#171C3A] mb-1">City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-3.5 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              >
                {DEMO_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#171C3A] mb-1">
                Hospital / Clinic Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Central Metro Medical Pavilion"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-3.5 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171C3A] mb-1">Area / District *</label>
              <input
                type="text"
                placeholder="e.g. Midtown"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-3.5 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#171C3A] mb-1">Contact Name *</label>
              <input
                type="text"
                placeholder="Coordinator name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-3.5 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#171C3A] mb-1">
                Fictional Phone *
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 010-0000"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-3.5 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171C3A] mb-1">Additional Notes</label>
            <textarea
              rows={2}
              placeholder="Any helpful entrance or intake desk guidance..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-3.5 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
            />
          </div>

          <div className="rounded-xl bg-[#FFF7ED] border border-[#FF9F43]/30 p-3 flex items-start gap-2.5 text-xs text-[#9A3412]">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#EA580C]" />
            <span>{SAFETY_DISCLAIMER}</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeCreateRequest}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#5A607F] hover:bg-[#F8F7FF] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#E63946] via-[#FF647C] to-[#FF4D9D] shadow-lg shadow-[#E63946]/25 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              Publish Demo Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const DonorContactModal: React.FC = () => {
  const { selectedDonor, setSelectedDonor, contactDonor } = useApp();
  const [messageSent, setMessageSent] = useState(false);

  if (!selectedDonor) return null;

  const theme = BLOOD_GROUP_THEMES[selectedDonor.bloodGroup];

  const handleClose = () => {
    setMessageSent(false);
    setSelectedDonor(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171C3A]/55 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-[#171C3A]/8 relative"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-[#F8F7FF] hover:bg-[#ECE8FF] flex items-center justify-center text-[#171C3A] cursor-pointer"
          aria-label="Close donor modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedDonor.avatarGradient} text-white font-display font-extrabold text-lg flex items-center justify-center shrink-0`}
          >
            {selectedDonor.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-extrabold text-[#171C3A]">
                {selectedDonor.name}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold text-white bg-gradient-to-r ${theme.gradient}`}
              >
                {theme.label}
              </span>
            </div>
            <p className="text-xs text-[#5A607F] mt-1">
              {selectedDonor.demoLabel} · {selectedDonor.area}, {selectedDonor.city}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-[#4A506D] leading-relaxed">{selectedDonor.bio}</p>

        <div className="mt-5 rounded-2xl bg-[#F8F7FF] p-4 space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#5A607F] inline-flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#E63946]" />
              Demo Phone
            </span>
            <span className="font-mono font-semibold text-[#171C3A] tabular-nums">
              {selectedDonor.phone}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#5A607F] inline-flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#8B5CF6]" />
              Demo Email
            </span>
            <span className="font-medium text-[#171C3A] truncate max-w-[190px]">
              {selectedDonor.email}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#5A607F] inline-flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#36D6A5]" />
              Last Donation (Self-Reported)
            </span>
            <span className="font-mono text-xs font-semibold text-[#171C3A] tabular-nums">
              {selectedDonor.lastDonationDate}
            </span>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-[#5A607F] leading-relaxed">
          Note: Availability and donation dates are self-reported demonstration entries. Hospital blood banks conduct all formal medical screening.
        </p>

        <div className="mt-5 flex items-center gap-3">
          {messageSent ? (
            <div className="w-full py-3 rounded-full bg-[#ECFDF7] text-[#059669] text-sm font-bold text-center inline-flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Connection Logged in Dashboard
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                contactDonor(selectedDonor);
                setMessageSent(true);
              }}
              className="w-full py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#E63946] via-[#FF647C] to-[#FF4D9D] shadow-lg shadow-[#E63946]/25 hover:scale-[1.01] transition-transform cursor-pointer"
            >
              Log Connection Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const RequestDetailModal: React.FC = () => {
  const { selectedRequest, setSelectedRequest, respondToRequest, navigate } = useApp();

  if (!selectedRequest) return null;

  const theme = BLOOD_GROUP_THEMES[selectedRequest.bloodGroup];
  const urgencyBadge =
    selectedRequest.urgency === 'Critical'
      ? { bg: 'bg-[#FFF0F3] text-[#E63946]', icon: AlertTriangle }
      : selectedRequest.urgency === 'Urgent'
      ? { bg: 'bg-[#FFF6ED] text-[#EA580C]', icon: Clock }
      : { bg: 'bg-[#EFF7FF] text-[#2563EB]', icon: Info };
  const UrgencyIcon = urgencyBadge.icon;

  return (
    <div className="fixed inset-0 z-50 bg-[#171C3A]/55 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-[#171C3A]/8 relative"
      >
        <button
          type="button"
          onClick={() => setSelectedRequest(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-[#F8F7FF] hover:bg-[#ECE8FF] flex items-center justify-center text-[#171C3A] cursor-pointer"
          aria-label="Close request details"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} text-white font-display font-extrabold text-xl flex items-center justify-center shrink-0`}
          >
            {theme.label}
          </div>
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${urgencyBadge.bg}`}
            >
              <UrgencyIcon className="w-3.5 h-3.5" />
              {selectedRequest.urgency} Priority
            </span>
            <h3 className="font-display text-xl font-extrabold text-[#171C3A] mt-1">
              {selectedRequest.patientReference}
            </h3>
          </div>
        </div>

        <p className="text-sm text-[#4A506D] leading-relaxed">{selectedRequest.notes}</p>

        <div className="mt-5 rounded-2xl bg-[#F8F7FF] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-[#5A607F] block">Hospital</span>
            <span className="font-bold text-[#171C3A] inline-flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              {selectedRequest.hospital}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#5A607F] block">Location</span>
            <span className="font-bold text-[#171C3A] inline-flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-[#E63946] shrink-0" />
              {selectedRequest.area}, {selectedRequest.city}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#5A607F] block">Units &amp; Window</span>
            <span className="font-bold text-[#171C3A] tabular-nums">
              {selectedRequest.unitsRequired} unit(s) · {selectedRequest.timeRemaining}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#5A607F] block">Coordinator (Demo)</span>
            <span className="font-bold text-[#171C3A]">{selectedRequest.contactName}</span>
            <span className="block font-mono text-xs text-[#5A607F] tabular-nums">
              {selectedRequest.contactPhone}
            </span>
          </div>
        </div>

        <div className="mt-4 text-xs text-[#5A607F]">
          Compatible donor groups:{' '}
          <span className="font-bold text-[#171C3A]">
            {theme.canReceiveFrom.map(formatBloodGroupLabel).join(', ')}
          </span>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              respondToRequest(selectedRequest.id);
              setSelectedRequest(null);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#E63946] via-[#FF647C] to-[#FF4D9D] shadow-lg shadow-[#E63946]/25 hover:scale-[1.01] transition-transform cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4" />
            Offer Support (Demo)
          </button>
          <button
            type="button"
            onClick={() => {
              const bg = selectedRequest.bloodGroup;
              setSelectedRequest(null);
              navigate('donors', { donorFilter: { bloodGroup: bg } });
            }}
            className="px-5 py-3 rounded-full text-sm font-bold text-[#171C3A] bg-[#F8F7FF] hover:bg-[#ECE8FF] transition-colors cursor-pointer"
          >
            Find Matching Donors
          </button>
        </div>
      </div>
    </div>
  );
};

export const LegalContactModal: React.FC = () => {
  const { legalModal, setLegalModal, addToast } = useApp();
  const [contactMsg, setContactMsg] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  if (!legalModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#171C3A]/55 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-[28px] bg-white p-6 sm:p-8 shadow-2xl border border-[#171C3A]/8 relative"
      >
        <button
          type="button"
          onClick={() => setLegalModal(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-[#F8F7FF] hover:bg-[#ECE8FF] flex items-center justify-center text-[#171C3A] cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {legalModal === 'privacy' && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-extrabold text-[#171C3A]">Privacy Policy (Demo)</h2>
            <p className="text-sm text-[#4A506D] leading-relaxed">
              LifeDrop prioritizes participant privacy. In this interactive demonstration, all preloaded donor profiles, hospital cards, and requests are fictional sample records stored locally in your browser&apos;s LocalStorage.
            </p>
            <p className="text-sm text-[#4A506D] leading-relaxed">
              No personal medical history, health eligibility records, or live GPS coordinates are collected or transmitted. Donors control their visibility anytime via the Availability Toggle.
            </p>
          </div>
        )}

        {legalModal === 'terms' && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-extrabold text-[#171C3A]">
              Terms &amp; Platform Notice
            </h2>
            <p className="text-sm text-[#4A506D] leading-relaxed">{SAFETY_DISCLAIMER}</p>
            <p className="text-sm text-[#4A506D] leading-relaxed">
              LifeDrop does not screen, test, certify, or verify medical eligibility to donate blood. Licensed hospitals and accredited blood banks perform all clinical evaluations prior to donation.
            </p>
          </div>
        )}

        {legalModal === 'contact' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addToast('Message Received (Demo)', 'Thank you for reaching out to the LifeDrop community team.', 'success');
              setContactMsg('');
              setContactEmail('');
              setLegalModal(null);
            }}
            className="space-y-4"
          >
            <h2 className="font-display text-2xl font-extrabold text-[#171C3A]">Contact LifeDrop</h2>
            <p className="text-sm text-[#4A506D]">
              Questions about community partnerships, hospital directories, or campus blood drives? Send a demo inquiry below.
            </p>
            <div>
              <label className="block text-xs font-bold text-[#171C3A] mb-1">Your Email</label>
              <input
                type="email"
                required
                placeholder="you@example.org"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-4 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#171C3A] mb-1">Message</label>
              <textarea
                rows={3}
                required
                placeholder="Tell us how we can help..."
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-4 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#8B5CF6] to-[#4D96FF] shadow-lg shadow-[#8B5CF6]/25 cursor-pointer"
            >
              Send Demo Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
