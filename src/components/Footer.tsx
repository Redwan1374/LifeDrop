import React from 'react';
import { Globe, HeartHandshake, Mail, Phone, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAFETY_DISCLAIMER } from '../data/mockData';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { route, navigate, openCreateRequest, setLegalModal } = useApp();

  if (route === 'dashboard') {
    return null;
  }

  return (
    <footer className="relative bg-[#171C3A] text-white overflow-hidden">
      {/* Subtle top gradient hairline */}
      <div className="h-1 w-full bg-gradient-to-r from-[#E63946] via-[#FF4D9D] to-[#8B5CF6]" />

      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-[#8B5CF6]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#FF647C]/12 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="light" size="md" />
            <p className="text-lg font-display font-semibold text-white/95">
              Be Someone&apos;s Lifeline.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              A community-driven blood donor discovery and emergency request network built to help neighbors and hospital coordinators connect faster when every minute matters.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLegalModal('contact')}
                aria-label="Contact LifeDrop"
                className="w-10 h-10 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-200 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('about')}
                aria-label="Community Network"
                className="w-10 h-10 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-200 transition-colors cursor-pointer"
              >
                <Globe className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('register')}
                aria-label="Donor Community"
                className="w-10 h-10 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-200 transition-colors cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('home')}
                  className="hover:text-[#FF647C] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="hover:text-[#FF647C] transition-colors cursor-pointer"
                >
                  About LifeDrop
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('register')}
                  className="hover:text-[#FF647C] transition-colors cursor-pointer"
                >
                  Become a Donor
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('dashboard')}
                  className="hover:text-[#FF647C] transition-colors cursor-pointer"
                >
                  Donor Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Network Services */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide">Platform Directory</h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('donors')}
                  className="hover:text-[#36D6A5] transition-colors cursor-pointer"
                >
                  Find Donors
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('donors', { donorFilter: { viewMode: 'map' } })}
                  className="hover:text-[#36D6A5] transition-colors cursor-pointer"
                >
                  Interactive Donor Map
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCreateRequest}
                  className="hover:text-[#FF647C] transition-colors cursor-pointer"
                >
                  Request Blood
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('hospitals')}
                  className="hover:text-[#7DD3FC] transition-colors cursor-pointer"
                >
                  Hospitals &amp; Blood Banks
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wide">Support &amp; Policies</h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('contact')}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#7DD3FC]" />
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms &amp; Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical Safety Disclaimer */}
        <div className="mt-8 rounded-2xl bg-white/6 border border-white/10 p-4 sm:p-5 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-[#FFD166] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong className="text-white font-semibold">Medical &amp; Demonstration Notice:</strong>{' '}
            {SAFETY_DISCLAIMER} All donor profiles, hospital cards, and metrics shown in this preview use fictional demonstration data.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} LifeDrop Community Network. Interactive Demonstration Platform.</p>
          <p>Designed for rapid, humane donor-to-requester connection.</p>
        </div>
      </div>
    </footer>
  );
};
