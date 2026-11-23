import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Heart,
  HeartHandshake,
  Info,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  BLOOD_GROUPS,
  BLOOD_GROUP_THEMES,
  SAMPLE_TESTIMONIALS,
  formatBloodGroupLabel,
} from '../data/mockData';
import { BloodGroup } from '../types';

const AnimatedCounter: React.FC<{ target: number; suffix?: string }> = ({
  target,
  suffix = '',
}) => {
  const [value, setValue] = useState(target);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 900;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - elapsed, 3);
            setValue(Math.round(target * eased));
            if (elapsed < 1) {
              requestAnimationFrame(tick);
            }
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString()}
      {suffix}
    </span>
  );
};

export const HomePage: React.FC = () => {
  const { donors, requests, navigate, openCreateRequest, setSelectedRequest } = useApp();
  const [heroImgError, setHeroImgError] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const featuredRequests = requests.filter((r) => r.status !== 'Fulfilled').slice(0, 3);

  const countForBloodGroup = (bg: BloodGroup) =>
    donors.filter((d) => d.bloodGroup === bg).length;

  const activeTestimonial = SAMPLE_TESTIMONIALS[testimonialIndex];

  const handleNextTestimonial = () =>
    setTestimonialIndex((i) => (i + 1) % SAMPLE_TESTIMONIALS.length);
  const handlePrevTestimonial = () =>
    setTestimonialIndex((i) => (i - 1 + SAMPLE_TESTIMONIALS.length) % SAMPLE_TESTIMONIALS.length);

  return (
    <main className="overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-20 sm:pt-12 sm:pb-28 bg-soft-grid">
        {/* Soft Ambient Gradient Blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#FF647C]/18 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 right-[-80px] w-[460px] h-[460px] rounded-full bg-[#8B5CF6]/16 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/3 w-[340px] h-[340px] rounded-full bg-[#7DD3FC]/20 blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Copy Column */}
          <div className="lg:col-span-6 space-y-7">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#E63946] tracking-wide">
              <Sparkles className="w-4 h-4 text-[#FF4D9D]" />
              <span>A community that saves lives</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-[#171C3A] leading-[1.06] text-balance">
              Your Blood.
              <br />
              <span className="bg-gradient-to-r from-[#E63946] via-[#FF647C] to-[#FF4D9D] bg-clip-text text-transparent">
                Their Tomorrow.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#4A506D] leading-relaxed max-w-xl">
              One donation can make a difference. Connect with nearby donors, post urgent blood requests, and help families and hospitals make every second count.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => navigate('donors')}
                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#E63946] via-[#FF647C] to-[#FF4D9D] shadow-[0_14px_30px_-6px_rgba(230,57,70,0.45)] hover:shadow-[0_18px_36px_-6px_rgba(255,77,157,0.55)] hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
              >
                Find a Blood Donor
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => navigate('register')}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full text-sm sm:text-base font-bold text-[#171C3A] bg-white border border-[#171C3A]/12 shadow-sm hover:border-[#FF647C]/50 hover:bg-[#FFF8FA] transition-all cursor-pointer whitespace-nowrap"
              >
                <Heart className="w-4 h-4 text-[#E63946] fill-[#E63946]/15" />
                Become a Lifesaver
              </button>
            </div>

            {/* Unboxed Trust Metadata Row */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium text-[#5A607F]">
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#8B5CF6]" />
                Community-driven
              </span>
              <span aria-hidden="true" className="text-[#171C3A]/25">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#4D96FF]" />
                Fast donor discovery
              </span>
              <span aria-hidden="true" className="text-[#171C3A]/25">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#36D6A5]" />
                24/7 request access
              </span>
            </div>
          </div>

          {/* Right Creative Layered Visual Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center">
              {/* Soft Orbit Rings */}
              <div
                aria-hidden="true"
                className="absolute inset-6 rounded-full border border-dashed border-[#8B5CF6]/20"
              />
              <div
                aria-hidden="true"
                className="absolute inset-16 rounded-full bg-gradient-to-tr from-[#FF647C]/14 via-[#8B5CF6]/10 to-[#7DD3FC]/16 blur-xl"
              />

              {/* Centerpiece 3D Glass Sculpture */}
              <div className="relative w-[76%] h-[76%] rounded-[36px] overflow-hidden bg-gradient-to-br from-white to-[#F4F1FF] shadow-[0_28px_60px_-15px_rgba(23,28,58,0.16)] border border-white">
                {!heroImgError ? (
                  <img
                    src="/src/assets/images/hero_lifedrop_sculpture_1795467176614.jpg"
                    alt="Translucent ruby-red droplet embracing a sculpted heart emblem"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#FFF0F3] via-[#F8F7FF] to-[#EFF7FF] flex flex-col items-center justify-center p-6 text-center">
                    <Droplets className="w-16 h-16 text-[#E63946] mb-3" />
                    <span className="font-display font-extrabold text-xl text-[#171C3A]">
                      LifeDrop Network
                    </span>
                  </div>
                )}
              </div>

              {/* Floating Interactive Blood Group Chips */}
              <button
                type="button"
                onClick={() => navigate('donors', { donorFilter: { bloodGroup: 'O+' } })}
                title="Find O+ Demo Donors"
                className="animate-float-slow absolute top-4 left-4 sm:left-6 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#36D6A5] to-[#4D96FF] text-white font-display font-extrabold text-sm shadow-lg shadow-[#36D6A5]/30 hover:scale-105 transition-transform cursor-pointer"
              >
                O+ Match
              </button>

              <button
                type="button"
                onClick={() => navigate('donors', { donorFilter: { bloodGroup: 'A+' } })}
                title="Find A+ Demo Donors"
                className="animate-float-reverse absolute bottom-12 right-2 sm:right-4 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#E63946] to-[#FF647C] text-white font-display font-extrabold text-sm shadow-lg shadow-[#E63946]/30 hover:scale-105 transition-transform cursor-pointer"
              >
                A+ Ready
              </button>

              <button
                type="button"
                onClick={() => navigate('donors', { donorFilter: { bloodGroup: 'AB+' } })}
                title="Find AB+ Demo Donors"
                className="hidden sm:inline-flex animate-float-slow absolute top-1/2 -left-2 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md text-[#8B5CF6] border border-[#8B5CF6]/20 font-display font-extrabold text-xs shadow-md hover:scale-105 transition-transform cursor-pointer"
              >
                AB+ · B+
              </button>

              {/* Floating Sample Donor Profile Card */}
              <button
                type="button"
                onClick={() => navigate('donors', { donorFilter: { bloodGroup: 'O+' } })}
                className="animate-float-reverse absolute -top-1 right-2 sm:right-0 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-[0_16px_36px_-10px_rgba(23,28,58,0.16)] border border-white flex items-center gap-3 text-left hover:scale-[1.02] transition-transform cursor-pointer max-w-[230px]"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF647C] to-[#FF4D9D] text-white font-display font-extrabold text-xs flex items-center justify-center shrink-0">
                  ML
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#171C3A] truncate">Maya Lin (Demo)</p>
                  <p className="text-[11px] font-semibold text-[#059669] truncate">
                    O+ · Available · Midtown
                  </p>
                </div>
              </button>

              {/* Floating Sample Emergency Request Card */}
              <button
                type="button"
                onClick={() => navigate('requests')}
                className="animate-float-slow absolute -bottom-2 left-2 sm:left-4 rounded-2xl bg-[#171C3A] text-white p-3.5 shadow-[0_20px_40px_-10px_rgba(23,28,58,0.35)] flex items-center gap-3 text-left hover:scale-[1.02] transition-transform cursor-pointer max-w-[260px]"
              >
                <div className="animate-heartbeat-soft w-10 h-10 rounded-xl bg-gradient-to-br from-[#E63946] to-[#FF9F43] flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">2 Units A− Needed (Demo)</p>
                  <p className="text-[11px] text-slate-300 truncate">
                    St. Jude Regional · 3 hrs left
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COLORFUL TRUST STATISTICS BENTO GRID */}
      <section className="py-16 bg-white border-y border-[#171C3A]/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#171C3A]">
                Built for rapid community response
              </h2>
              <p className="text-sm text-[#5A607F] mt-1">
                Sample network overview figures shown for interactive platform demonstration.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#5A607F]">
              Sample / Demo Metrics
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pink Bento Card */}
            <div className="rounded-[26px] bg-gradient-to-br from-[#FFF0F3] to-[#FFE3EC] p-6 border border-[#FF647C]/15 hover:-translate-y-1 transition-transform">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E63946] to-[#FF4D9D] text-white flex items-center justify-center mb-5 shadow-md shadow-[#E63946]/25">
                <Users className="w-5 h-5" />
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-[#171C3A]">
                <AnimatedCounter target={12000} suffix="+" />
              </p>
              <p className="text-sm font-bold text-[#E63946] mt-1">Sample Registered Donors</p>
              <p className="text-xs text-[#5A607F] mt-2 leading-relaxed">
                Demo community profiles organized by blood type and city neighborhood.
              </p>
            </div>

            {/* Purple Bento Card */}
            <div className="rounded-[26px] bg-gradient-to-br from-[#F4F1FF] to-[#E9E4FF] p-6 border border-[#8B5CF6]/15 hover:-translate-y-1 transition-transform">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#4D96FF] text-white flex items-center justify-center mb-5 shadow-md shadow-[#8B5CF6]/25">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-[#171C3A]">
                <AnimatedCounter target={3800} suffix="+" />
              </p>
              <p className="text-sm font-bold text-[#7C3AED] mt-1">Sample Lives Impacted</p>
              <p className="text-xs text-[#5A607F] mt-2 leading-relaxed">
                Illustrative connection milestones between local donors and care coordinators.
              </p>
            </div>

            {/* Orange Bento Card */}
            <div className="rounded-[26px] bg-gradient-to-br from-[#FFF6ED] to-[#FFE8D1] p-6 border border-[#FF9F43]/20 hover:-translate-y-1 transition-transform">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF9F43] to-[#FF647C] text-white flex items-center justify-center mb-5 shadow-md shadow-[#FF9F43]/25">
                <Clock className="w-5 h-5" />
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-[#171C3A] tabular-nums">
                24/7
              </p>
              <p className="text-sm font-bold text-[#EA580C] mt-1">Emergency Request Access</p>
              <p className="text-xs text-[#5A607F] mt-2 leading-relaxed">
                Always-open interface to post urgent hospital blood needs and filter matches.
              </p>
            </div>

            {/* Mint Bento Card */}
            <div className="rounded-[26px] bg-gradient-to-br from-[#ECFDF7] to-[#D6FAEC] p-6 border border-[#36D6A5]/20 hover:-translate-y-1 transition-transform">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#36D6A5] to-[#4D96FF] text-white flex items-center justify-center mb-5 shadow-md shadow-[#36D6A5]/25">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-[#171C3A] tabular-nums">
                100%
              </p>
              <p className="text-sm font-bold text-[#059669] mt-1">Community Powered</p>
              <p className="text-xs text-[#5A607F] mt-2 leading-relaxed">
                Free neighbor-to-neighbor discovery built around voluntary human kindness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BLOOD GROUP EXPLORER BENTO */}
      <section className="py-20 bg-[#F8F7FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-bold text-[#8B5CF6] mb-2">Interactive Blood Group Directory</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#171C3A] tracking-tight text-balance">
              Find Your Match.{' '}
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#4D96FF] bg-clip-text text-transparent">
                Give Hope.
              </span>
            </h2>
            <p className="text-base text-[#4A506D] mt-3 leading-relaxed">
              Select any blood group below to explore compatible demonstration donors and view hospital needs by location.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BLOOD_GROUPS.map((bg, idx) => {
              const theme = BLOOD_GROUP_THEMES[bg];
              const count = countForBloodGroup(bg);
              const isWideOnLg = idx === 0 || idx === 7;
              return (
                <div
                  key={bg}
                  className={`group rounded-[26px] bg-white p-6 border border-[#171C3A]/8 shadow-sm hover:shadow-[0_20px_44px_-14px_rgba(23,28,58,0.14)] hover:-translate-y-1 transition-all flex flex-col justify-between ${
                    isWideOnLg ? 'lg:col-span-2' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`px-4 py-2 rounded-2xl bg-gradient-to-r ${theme.gradient} text-white font-display text-2xl sm:text-3xl font-extrabold shadow-md ${theme.shadowColor}`}
                      >
                        {theme.label}
                      </div>
                      <div className={`w-10 h-10 rounded-2xl ${theme.softBg} ${theme.textColor} flex items-center justify-center`}>
                        <Droplets className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-[#4A506D] leading-relaxed">{theme.note}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#171C3A]/6 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#5A607F] tabular-nums">
                      <strong className="text-sm font-extrabold text-[#171C3A]">{count}</strong> demo profiles
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('donors', { donorFilter: { bloodGroup: bg } })}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold ${theme.softBg} ${theme.textColor} hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap`}
                    >
                      Find Donors
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EMERGENCY REQUEST SECTION */}
      <section className="py-20 bg-gradient-to-b from-[#FFF2F5] via-[#FFF7F9] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E63946] mb-2">
                <AlertTriangle className="w-4 h-4 animate-heartbeat-soft" />
                <span>Urgent Community Board (Demo Requests)</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#171C3A] tracking-tight text-balance">
                Someone Needs Blood Right Now
              </h2>
              <p className="text-base text-[#4A506D] mt-2">
                Explore active demonstration blood requests sorted by urgency. For real medical emergencies, contact emergency services immediately.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openCreateRequest}
                className="px-5 py-3 rounded-full text-sm font-bold text-[#E63946] bg-white border border-[#E63946]/25 hover:bg-[#FFF0F3] transition-colors cursor-pointer whitespace-nowrap"
              >
                + Post Request (Demo)
              </button>
              <button
                type="button"
                onClick={() => navigate('requests')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#E63946] to-[#FF647C] shadow-lg shadow-[#E63946]/25 hover:scale-[1.02] transition-transform cursor-pointer whitespace-nowrap"
              >
                View Emergency Requests
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRequests.map((req) => {
              const bgTheme = BLOOD_GROUP_THEMES[req.bloodGroup];
              const urgencyStyle =
                req.urgency === 'Critical'
                  ? { badge: 'bg-[#FFF0F3] text-[#E63946]', icon: AlertTriangle }
                  : req.urgency === 'Urgent'
                  ? { badge: 'bg-[#FFF6ED] text-[#EA580C]', icon: Clock }
                  : { badge: 'bg-[#EFF7FF] text-[#2563EB]', icon: Info };
              const UrgencyIcon = urgencyStyle.icon;

              return (
                <div
                  key={req.id}
                  className="rounded-[26px] bg-white p-6 border border-[#171C3A]/8 shadow-sm hover:shadow-[0_20px_44px_-14px_rgba(230,57,70,0.14)] hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${urgencyStyle.badge}`}
                      >
                        <UrgencyIcon
                          className={`w-3.5 h-3.5 ${
                            req.urgency === 'Critical' ? 'animate-heartbeat-soft' : ''
                          }`}
                        />
                        {req.urgency}
                      </span>
                      <span
                        className={`px-3.5 py-1 rounded-xl text-sm font-display font-extrabold text-white bg-gradient-to-r ${bgTheme.gradient}`}
                      >
                        {bgTheme.label}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-extrabold text-[#171C3A]">
                      {req.patientReference}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm text-[#4A506D]">
                      <p className="inline-flex items-center gap-2 w-full">
                        <Building2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                        <span className="truncate font-semibold text-[#171C3A]">{req.hospital}</span>
                      </p>
                      <p className="inline-flex items-center gap-2 w-full">
                        <MapPin className="w-4 h-4 text-[#E63946] shrink-0" />
                        <span className="truncate">
                          {req.area}, {req.city}
                        </span>
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#5A607F] tabular-nums">
                      <span>{req.unitsRequired} units needed</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#E63946]">{req.timeRemaining}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedRequest(req)}
                    className="mt-6 w-full py-3 rounded-full text-sm font-bold text-[#171C3A] bg-[#F8F7FF] hover:bg-[#171C3A] hover:text-white transition-colors cursor-pointer"
                  >
                    Request Details
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-bold text-[#36D6A5] mb-2">Simple Community Flow</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#171C3A] tracking-tight text-balance">
              Three Steps. One Life Changed.
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Desktop connecting gradient bar */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-14 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[#4D96FF] via-[#8B5CF6] to-[#E63946] opacity-30"
            />

            {[
              {
                num: '01',
                title: '01. Find',
                desc: 'Search for the blood group and city neighborhood you need in seconds with instant filters.',
                gradient: 'from-[#4D96FF] to-[#7DD3FC]',
                soft: 'bg-[#EFF7FF]',
                icon: Search,
              },
              {
                num: '02',
                title: '02. Connect',
                desc: 'Reach out to an available donor profile or post an urgent request for nearby hospital coordination.',
                gradient: 'from-[#8B5CF6] to-[#FF4D9D]',
                soft: 'bg-[#F4F1FF]',
                icon: HeartHandshake,
              },
              {
                num: '03',
                title: '03. Save a Life',
                desc: 'Coordinate directly with hospital blood banks so patients receive support when every minute counts.',
                gradient: 'from-[#E63946] to-[#FF647C]',
                soft: 'bg-[#FFF0F3]',
                icon: Heart,
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative rounded-[28px] bg-[#F8F7FF] p-8 border border-[#171C3A]/6 text-center hover:-translate-y-1 transition-transform"
                >
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center shadow-lg mb-6 relative z-10`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-[#171C3A]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#4A506D] leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS CAROUSEL */}
      <section className="py-20 bg-[#F8F7FF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-bold text-[#FF4D9D] mb-1">
                Sample Community Stories (Fictional Demo)
              </p>
              <h2 className="font-display text-3xl font-extrabold text-[#171C3A]">
                Stories that inspire generosity
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevTestimonial}
                aria-label="Previous story"
                className="w-11 h-11 rounded-full bg-white border border-[#171C3A]/10 hover:border-[#8B5CF6] flex items-center justify-center text-[#171C3A] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextTestimonial}
                aria-label="Next story"
                className="w-11 h-11 rounded-full bg-white border border-[#171C3A]/10 hover:border-[#8B5CF6] flex items-center justify-center text-[#171C3A] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="rounded-[30px] bg-white p-8 sm:p-10 border border-[#171C3A]/8 shadow-[0_20px_50px_-20px_rgba(23,28,58,0.12)]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-1 text-[#FF9F43]" aria-label="Appreciation stars">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#FFD166] text-[#FF9F43]" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#5A607F]">{activeTestimonial.tag}</span>
            </div>

            <blockquote className="font-display text-xl sm:text-2xl font-bold text-[#171C3A] leading-snug">
              &ldquo;{activeTestimonial.quote}&rdquo;
            </blockquote>

            <div className="mt-8 pt-6 border-t border-[#171C3A]/8 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeTestimonial.gradient} text-white font-display font-extrabold flex items-center justify-center`}
                >
                  {activeTestimonial.initials}
                </div>
                <div>
                  <p className="font-bold text-sm text-[#171C3A]">{activeTestimonial.name}</p>
                  <p className="text-xs text-[#5A607F]">
                    {activeTestimonial.role} · {activeTestimonial.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {SAMPLE_TESTIMONIALS.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-label={`View story ${i + 1}`}
                    onClick={() => setTestimonialIndex(i)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      i === testimonialIndex
                        ? 'w-7 bg-gradient-to-r from-[#E63946] to-[#FF4D9D]'
                        : 'w-2.5 bg-[#171C3A]/15 hover:bg-[#171C3A]/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL EMOTIONAL CTA */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#E63946] via-[#FF647C] to-[#FF4D9D] px-6 py-14 sm:px-14 sm:py-20 text-center text-white shadow-[0_28px_60px_-15px_rgba(230,57,70,0.45)]">
          {/* Decorative Floating Shapes */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/15 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-12 w-72 h-72 rounded-full bg-[#FFD166]/25 blur-2xl"
          />

          <div className="relative max-w-2xl mx-auto space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <Heart className="w-7 h-7 text-white fill-white/30" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-balance">
              Be Someone&apos;s Reason to Smile Again.
            </h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed">
              Join the LifeDrop community and turn a simple act of kindness into a second chance at life.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('register')}
                className="px-8 py-4 rounded-full text-sm sm:text-base font-extrabold text-[#E63946] bg-white shadow-xl hover:scale-[1.03] transition-transform cursor-pointer whitespace-nowrap"
              >
                Become a Donor
              </button>
              <button
                type="button"
                onClick={openCreateRequest}
                className="px-8 py-4 rounded-full text-sm sm:text-base font-extrabold text-white bg-[#171C3A]/30 hover:bg-[#171C3A]/45 backdrop-blur-md border border-white/30 transition-colors cursor-pointer whitespace-nowrap"
              >
                Request Blood
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
