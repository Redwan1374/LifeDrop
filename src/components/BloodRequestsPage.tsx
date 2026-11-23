import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Droplets,
  HeartHandshake,
  Info,
  MapPin,
  Plus,
  ShieldAlert,
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

export const BloodRequestsPage: React.FC = () => {
  const {
    requests,
    openCreateRequest,
    setSelectedRequest,
    respondToRequest,
    savedConnectionIds,
  } = useApp();

  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'ALL'>('ALL');
  const [bloodFilter, setBloodFilter] = useState<BloodGroup | 'ALL'>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');

  const filteredRequests = useMemo(() => {
    const order: Record<UrgencyLevel, number> = { Critical: 0, Urgent: 1, Normal: 2 };
    return requests
      .filter((r) => {
        if (urgencyFilter !== 'ALL' && r.urgency !== urgencyFilter) return false;
        if (bloodFilter !== 'ALL' && r.bloodGroup !== bloodFilter) return false;
        if (cityFilter !== 'ALL' && r.city !== cityFilter) return false;
        return true;
      })
      .sort((a, b) => order[a.urgency] - order[b.urgency]);
  }, [requests, urgencyFilter, bloodFilter, cityFilter]);

  return (
    <main className="py-10 sm:py-14 bg-gradient-to-b from-[#FFF3F6] via-[#F8F7FF] to-[#F8F7FF] min-h-[82vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E63946] mb-2">
              <AlertTriangle className="w-4 h-4 animate-heartbeat-soft" />
              <span>Emergency Blood Request Board (Demonstration Data)</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#171C3A] tracking-tight">
              Active Blood Requests
            </h1>
            <p className="text-sm sm:text-base text-[#4A506D] mt-2 leading-relaxed">
              Browse urgent community requests or post a new demonstration request to notify compatible donors in your city.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateRequest}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#E63946] via-[#FF647C] to-[#FF4D9D] shadow-lg shadow-[#E63946]/30 hover:scale-[1.02] transition-transform cursor-pointer whitespace-nowrap self-start lg:self-auto"
          >
            <Plus className="w-4 h-4" />
            Submit Emergency Request
          </button>
        </div>

        {/* Medical Safety Banner */}
        <div className="rounded-2xl bg-white border border-[#E63946]/18 p-4 flex items-start gap-3 text-xs sm:text-sm text-[#4A506D]">
          <ShieldAlert className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" />
          <span>{SAFETY_DISCLAIMER}</span>
        </div>

        {/* Filter Bar */}
        <div className="rounded-[24px] bg-white p-4 border border-[#171C3A]/8 shadow-sm flex flex-wrap items-center justify-between gap-4">
          {/* Urgency Segmented Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#F8F7FF]">
            {(['ALL', 'Critical', 'Urgent', 'Normal'] as const).map((lvl) => {
              const active = urgencyFilter === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgencyFilter(lvl)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? lvl === 'Critical'
                        ? 'bg-[#E63946] text-white shadow-sm'
                        : lvl === 'Urgent'
                        ? 'bg-[#FF9F43] text-white shadow-sm'
                        : lvl === 'Normal'
                        ? 'bg-[#4D96FF] text-white shadow-sm'
                        : 'bg-[#171C3A] text-white shadow-sm'
                      : 'text-[#5A607F] hover:text-[#171C3A]'
                  }`}
                >
                  {lvl === 'ALL' ? 'All Urgencies' : lvl}
                </button>
              );
            })}
          </div>

          {/* Blood Group & City Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Filter by blood group"
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value as BloodGroup | 'ALL')}
              className="rounded-xl bg-[#F8F7FF] px-3.5 py-2.5 text-xs font-bold text-[#171C3A] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {formatBloodGroupLabel(bg)}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by city"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded-xl bg-[#F8F7FF] px-3.5 py-2.5 text-xs font-bold text-[#171C3A] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Demo Cities</option>
              {DEMO_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Request Grid */}
        {filteredRequests.length === 0 ? (
          <div className="rounded-[28px] bg-white p-12 text-center border border-[#171C3A]/8">
            <Droplets className="w-10 h-10 text-[#E63946] mx-auto mb-3" />
            <h3 className="font-display text-xl font-extrabold text-[#171C3A]">
              No requests match those filters
            </h3>
            <p className="text-sm text-[#5A607F] mt-1">
              Clear your filters or submit a new demonstration blood request.
            </p>
            <button
              type="button"
              onClick={() => {
                setUrgencyFilter('ALL');
                setBloodFilter('ALL');
                setCityFilter('ALL');
              }}
              className="mt-5 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-[#171C3A] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((req) => {
              const bgTheme = BLOOD_GROUP_THEMES[req.bloodGroup];
              const isResponded = savedConnectionIds.includes(req.id);
              const urgencyMeta =
                req.urgency === 'Critical'
                  ? { badge: 'bg-[#FFF0F3] text-[#E63946]', icon: AlertTriangle }
                  : req.urgency === 'Urgent'
                  ? { badge: 'bg-[#FFF6ED] text-[#EA580C]', icon: Clock }
                  : { badge: 'bg-[#EFF7FF] text-[#2563EB]', icon: Info };
              const UrgencyIcon = urgencyMeta.icon;

              return (
                <article
                  key={req.id}
                  className="rounded-[26px] bg-white p-6 border border-[#171C3A]/8 shadow-sm hover:shadow-[0_20px_44px_-14px_rgba(23,28,58,0.12)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${urgencyMeta.badge}`}
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

                    <h2 className="font-display text-lg font-extrabold text-[#171C3A]">
                      {req.patientReference}
                    </h2>
                    <p className="mt-1 text-xs text-[#5A607F]">
                      Posted {req.createdAt} · Status: <strong className="text-[#171C3A]">{req.status}</strong>
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-[#4A506D]">
                      <p className="inline-flex items-center gap-2 w-full">
                        <Building2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                        <span className="font-semibold text-[#171C3A] truncate">{req.hospital}</span>
                      </p>
                      <p className="inline-flex items-center gap-2 w-full">
                        <MapPin className="w-4 h-4 text-[#E63946] shrink-0" />
                        <span className="truncate">
                          {req.area}, {req.city}
                        </span>
                      </p>
                    </div>

                    <p className="mt-3 text-xs text-[#4A506D] line-clamp-2 leading-relaxed">
                      {req.notes}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#171C3A]/6 flex items-center justify-between text-xs font-bold tabular-nums">
                      <span className="text-[#171C3A]">{req.unitsRequired} unit(s) needed</span>
                      <span className="text-[#E63946]">{req.timeRemaining}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(req)}
                      className="flex-1 py-2.5 px-4 rounded-full text-xs font-bold text-[#171C3A] bg-[#F8F7FF] hover:bg-[#ECE8FF] transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => respondToRequest(req.id)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isResponded
                          ? 'bg-[#ECFDF7] text-[#059669]'
                          : 'text-white bg-gradient-to-r from-[#E63946] to-[#FF4D9D] shadow-md shadow-[#E63946]/20'
                      }`}
                    >
                      {isResponded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Offered ({req.pledgedCount})
                        </>
                      ) : (
                        <>
                          <HeartHandshake className="w-3.5 h-3.5" />
                          Offer Help
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
