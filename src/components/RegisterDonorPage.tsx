import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Droplets,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BLOOD_GROUPS, DEMO_CITIES, formatBloodGroupLabel } from '../data/mockData';
import { BloodGroup } from '../types';

export const RegisterDonorPage: React.FC = () => {
  const { registerDonor, navigate } = useApp();
  const [imgError, setImgError] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [city, setCity] = useState(DEMO_CITIES[0]);
  const [area, setArea] = useState('');
  const [dob, setDob] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [available, setAvailable] = useState(true);
  const [contactPreference, setContactPreference] = useState<'Phone' | 'Email' | 'Both'>('Both');
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const completionPercent = useMemo(() => {
    let filled = 0;
    if (fullName.trim()) filled += 1;
    if (phone.trim()) filled += 1;
    if (email.trim()) filled += 1;
    if (area.trim()) filled += 1;
    if (dob) filled += 1;
    if (acknowledged) filled += 1;
    return Math.round((filled / 6) * 100);
  }, [fullName, phone, email, area, dob, acknowledged]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim() || !area.trim() || !dob) {
      setError('Please fill in all required fields marked with *.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid demonstration email address.');
      return;
    }
    if (!acknowledged) {
      setError('Please confirm the community demonstration & medical screening acknowledgment.');
      return;
    }

    setError('');
    registerDonor({
      name: fullName,
      phone,
      email,
      bloodGroup,
      city,
      area,
      lastDonationDate,
      available,
      contactPreference,
    });
    setSubmitted(true);
  };

  return (
    <main className="relative py-12 sm:py-16 bg-gradient-to-br from-[#F8F7FF] via-[#FFF4F7] to-[#EFF7FF] overflow-hidden min-h-[85vh]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#FF647C]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#8B5CF6]/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Emotional & Motivational Column */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E63946]">
            <Sparkles className="w-4 h-4 text-[#FF4D9D]" />
            <span>Community Donor Registration (Demo)</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#171C3A] tracking-tight leading-tight text-balance">
            Your 15 minutes could mean someone&apos;s lifetime.
          </h1>

          <p className="text-base text-[#4A506D] leading-relaxed">
            Create a demonstration donor profile to explore how neighbors stay discoverable during urgent requests and manage availability effortlessly.
          </p>

          <div className="rounded-[28px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(23,28,58,0.16)] border-4 border-white aspect-[4/3] bg-[#FFF0F3]">
            {!imgError ? (
              <img
                src="/src/assets/images/donor_registration_scene_1795467178253.jpg"
                alt="Smiling donor relaxing in a modern sunlit blood donation lounge"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Heart className="w-14 h-14 text-[#E63946]" />
              </div>
            )}
          </div>

          <ul className="space-y-3 text-sm text-[#171C3A] font-medium">
            {[
              'Toggle your availability anytime from your dashboard',
              'Discover nearby hospital blood banks and requests',
              'Formal health screening is always handled by licensed hospitals',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#36D6A5] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7">
          <div className="rounded-[30px] bg-white p-6 sm:p-9 shadow-[0_24px_60px_-18px_rgba(23,28,58,0.14)] border border-white">
            {submitted ? (
              <div className="py-10 text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#36D6A5] to-[#4D96FF] text-white flex items-center justify-center shadow-lg shadow-[#36D6A5]/30">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#171C3A]">
                  Welcome to LifeDrop, {fullName}!
                </h2>
                <p className="text-sm sm:text-base text-[#4A506D] max-w-md mx-auto leading-relaxed">
                  Your demonstration <strong className="text-[#E63946]">{formatBloodGroupLabel(bloodGroup)}</strong> profile in{' '}
                  <strong>{area}, {city}</strong> has been saved to LocalStorage and added to the Donor Directory.
                </p>
                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('dashboard')}
                    className="px-7 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#E63946] to-[#FF4D9D] shadow-lg cursor-pointer"
                  >
                    Open Donor Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('donors')}
                    className="px-6 py-3.5 rounded-full text-sm font-bold text-[#171C3A] bg-[#F8F7FF] hover:bg-[#ECE8FF] cursor-pointer"
                  >
                    View in Donor Search
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Progress Indicator */}
                <div className="mb-7">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-[#5A607F]">Profile Completion</span>
                    <span className="text-[#8B5CF6] font-mono tabular-nums">
                      {completionPercent}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#F8F7FF] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#E63946] via-[#FF4D9D] to-[#8B5CF6] transition-all duration-300"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>

                <h2 className="font-display text-2xl font-extrabold text-[#171C3A]">
                  Donor Registration Form
                </h2>
                <p className="text-xs text-[#5A607F] mt-1">
                  Please use fictional or demonstration contact information for this preview.
                </p>

                {error && (
                  <div className="mt-4 rounded-xl bg-[#FFF0F3] border border-[#E63946]/25 px-4 py-3 text-xs font-bold text-[#E63946]">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#171C3A] mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-3" />
                        <input
                          type="text"
                          placeholder="e.g. Alex Rivera"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full rounded-xl border border-[#171C3A]/12 bg-[#F8F7FF] pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#171C3A] mb-1.5">
                        Phone Number (Demo) *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#E63946] absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          placeholder="+1 (555) 010-2345"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl border border-[#171C3A]/12 bg-[#F8F7FF] pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#171C3A] mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#4D96FF] absolute left-3.5 top-3" />
                        <input
                          type="email"
                          placeholder="alex.demo@example.org"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-[#171C3A]/12 bg-[#F8F7FF] pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#171C3A] mb-1.5">
                        Blood Group *
                      </label>
                      <div className="relative">
                        <Droplets className="w-4 h-4 text-[#E63946] absolute left-3.5 top-3" />
                        <select
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                          className="w-full rounded-xl border border-[#171C3A]/12 bg-[#F8F7FF] pl-10 pr-4 py-2.5 text-sm font-bold focus:bg-white focus:border-[#8B5CF6] focus:outline-none cursor-pointer"
                        >
                          {BLOOD_GROUPS.map((bg) => (
                            <option key={bg} value={bg}>
                              {formatBloodGroupLabel(bg)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#171C3A] mb-1.5">
                        City *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#FF9F43] absolute left-3.5 top-3" />
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full rounded-xl border border-[#171C3A]/12 bg-[#F8F7FF] pl-10 pr-4 py-2.5 text-sm font-semibold focus:bg-white focus:border-[#8B5CF6] focus:outline-none cursor-pointer"
                        >
                          {DEMO_CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#171C3A] mb-1.5">
                        Area / Neighborhood *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Midtown Heights"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full rounded-xl border border-[#171C3A]/12 bg-[#F8F7FF] px-4 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#171C3A] mb-1.5">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-3" />
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full rounded-xl border border-[#171C3A]/12 bg-[#F8F7FF] pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#171C3A] mb-1.5">
                        Last Donation Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={lastDonationDate}
                        onChange={(e) => setLastDonationDate(e.target.value)}
                        className="w-full rounded-xl border border-[#171C3A]/12 bg-[#F8F7FF] px-4 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Availability Toggle & Contact Preference */}
                  <div className="rounded-2xl bg-[#F8F7FF] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#171C3A]">Available to Connect</p>
                      <p className="text-xs text-[#5A607F]">
                        Show your demo profile in active donor searches
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={available}
                      onClick={() => setAvailable((v) => !v)}
                      className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                        available ? 'bg-[#36D6A5]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${
                          available ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#171C3A] mb-2">Contact Preference</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Phone', 'Email', 'Both'] as const).map((pref) => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => setContactPreference(pref)}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            contactPreference === pref
                              ? 'bg-[#171C3A] text-white border-[#171C3A]'
                              : 'bg-[#F8F7FF] text-[#4A506D] border-transparent hover:border-[#171C3A]/15'
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-[#4A506D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acknowledged}
                      onChange={(e) => setAcknowledged(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-[#E63946] cursor-pointer shrink-0"
                    />
                    <span>
                      I understand LifeDrop is a community connection demo platform and does not replace medical screening performed by licensed hospitals.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full font-display font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-[#E63946] via-[#FF647C] to-[#FF4D9D] shadow-[0_12px_28px_-6px_rgba(230,57,70,0.45)] hover:scale-[1.01] transition-transform cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Complete Donor Registration
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
