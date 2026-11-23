import React, { useState } from 'react';
import {
  Accessibility,
  ArrowRight,
  Eye,
  Heart,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  BLOOD_GROUPS,
  BLOOD_GROUP_THEMES,
  SAFETY_DISCLAIMER,
  formatBloodGroupLabel,
} from '../data/mockData';
import { BloodGroup } from '../types';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();
  const [imgError, setImgError] = useState(false);
  const [selectedCompatibilityGroup, setSelectedCompatibilityGroup] = useState<BloodGroup>('O-');

  const activeTheme = BLOOD_GROUP_THEMES[selectedCompatibilityGroup];

  const values = [
    {
      title: 'Humanity',
      desc: 'Every blood donation represents an extraordinary act of compassion between neighbors.',
      gradient: 'from-[#E63946] to-[#FF647C]',
      bg: 'bg-[#FFF0F3]',
      icon: Heart,
    },
    {
      title: 'Trust',
      desc: 'Clear communication, respectful privacy boundaries, and transparent medical disclaimers.',
      gradient: 'from-[#8B5CF6] to-[#4D96FF]',
      bg: 'bg-[#F4F1FF]',
      icon: ShieldCheck,
    },
    {
      title: 'Community',
      desc: 'Local circles of campus volunteers, neighborhoods, and hospital coordinators working together.',
      gradient: 'from-[#36D6A5] to-[#4D96FF]',
      bg: 'bg-[#ECFDF7]',
      icon: Users,
    },
    {
      title: 'Accessibility',
      desc: 'Fast search across devices so families can find information calmly in stressful moments.',
      gradient: 'from-[#FF9F43] to-[#FF647C]',
      bg: 'bg-[#FFF6ED]',
      icon: Accessibility,
    },
    {
      title: 'Transparency',
      desc: 'Honest separation between community coordination tools and clinical hospital screening.',
      gradient: 'from-[#4D96FF] to-[#8B5CF6]',
      bg: 'bg-[#EFF7FF]',
      icon: Eye,
    },
  ];

  return (
    <main className="bg-white">
      {/* Section 1: Our Mission */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#F8F7FF] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-sm font-bold text-[#E63946]">Our Mission</p>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#171C3A] tracking-tight leading-tight text-balance">
              Making blood donation accessible, connected, and faster for everyone.
            </h1>
            <p className="text-base text-[#4A506D] leading-relaxed">
              When a hospital or family faces an urgent blood shortage, searching scattered social posts wastes precious minutes. LifeDrop brings donor discovery, compatibility education, and emergency requests into one clear, compassionate interface.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('donors')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#E63946] to-[#FF4D9D] shadow-lg shadow-[#E63946]/25 cursor-pointer"
              >
                Explore Donor Network
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('register')}
                className="px-6 py-3.5 rounded-full text-sm font-bold text-[#171C3A] bg-[#F8F7FF] hover:bg-[#ECE8FF] cursor-pointer"
              >
                Join Community
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-[32px] overflow-hidden shadow-[0_24px_60px_-15px_rgba(23,28,58,0.16)] border border-white aspect-video bg-[#FFF0F3]">
              {!imgError ? (
                <img
                  src="/src/assets/images/about_community_drive_1795467179033.jpg"
                  alt="Diverse community volunteers and medical coordinators organizing wellness kits"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8 text-center">
                  <Heart className="w-12 h-12 text-[#E63946]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Our Vision + Interactive Compatibility Matrix */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Interactive Compatibility Explorer */}
          <div className="lg:col-span-6 order-2 lg:order-1 rounded-[30px] bg-[#171C3A] text-white p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <p className="text-xs font-bold text-[#7DD3FC]">Interactive Reference Guide</p>
              <h3 className="font-display text-2xl font-extrabold mt-1">
                Blood Type Compatibility Explorer
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((bg) => {
                const active = selectedCompatibilityGroup === bg;
                const theme = BLOOD_GROUP_THEMES[bg];
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedCompatibilityGroup(bg)}
                    className={`py-2.5 rounded-xl text-sm font-display font-extrabold transition-all cursor-pointer ${
                      active
                        ? `bg-gradient-to-r ${theme.gradient} text-white scale-[1.03]`
                        : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    {theme.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-white/8 border border-white/10 p-5 space-y-4">
              <p className="text-sm text-slate-200 leading-relaxed">{activeTheme.note}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs font-bold text-[#36D6A5] block mb-1.5">
                    Can Donate Red Cells To
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTheme.canDonateTo.map((g) => (
                      <span
                        key={g}
                        className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-white"
                      >
                        {formatBloodGroupLabel(g)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#FF647C] block mb-1.5">
                    Can Receive Red Cells From
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTheme.canReceiveFrom.map((g) => (
                      <span
                        key={g}
                        className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-white"
                      >
                        {formatBloodGroupLabel(g)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <p className="text-sm font-bold text-[#8B5CF6]">Our Vision</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#171C3A] tracking-tight text-balance">
              A future where no life is lost because blood could not be found.
            </h2>
            <p className="text-base text-[#4A506D] leading-relaxed">
              We envision neighborhoods where willing donors stay informed without noise, pause gracefully during recovery windows, and step forward swiftly when local hospitals raise a call.
            </p>
            <p className="text-sm text-[#5A607F] leading-relaxed">
              Always consult qualified healthcare clinicians and accredited blood centers for transfusion matching and donation screening.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Our Values */}
      <section className="py-16 sm:py-20 bg-[#F8F7FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-bold text-[#36D6A5] mb-1">Our Values</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#171C3A]">
              Principles guiding every interaction
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="rounded-[24px] bg-white p-6 border border-[#171C3A]/8 shadow-sm hover:-translate-y-1 transition-transform"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${val.gradient} text-white flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-extrabold text-[#171C3A]">
                    {val.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#4A506D] leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Platform Safety Disclaimer Card */}
          <div className="mt-12 rounded-[26px] bg-white border border-[#E63946]/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-[#E63946] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-extrabold text-[#171C3A]">
                Important Medical &amp; Safety Responsibility
              </h3>
              <p className="mt-1.5 text-sm text-[#4A506D] leading-relaxed">
                {SAFETY_DISCLAIMER} LifeDrop does not perform medical testing, certify donor health eligibility, or provide clinical advice.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
