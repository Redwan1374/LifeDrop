import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Droplets,
  Filter,
  LayoutGrid,
  List,
  Map as MapIcon,
  MapPin,
  PhoneCall,
  RotateCcw,
  Search,
  SlidersHorizontal,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  BLOOD_GROUPS,
  BLOOD_GROUP_THEMES,
  DEMO_CITIES,
  formatBloodGroupLabel,
} from '../data/mockData';
import { BloodGroup, Donor } from '../types';

const ITEMS_PER_PAGE = 6;

export const FindDonorsPage: React.FC = () => {
  const { donors, hospitals, donorFilter, setDonorFilter, setSelectedDonor } = useApp();
  const [sortBy, setSortBy] = useState<'available' | 'donations' | 'name'>('available');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeMapDonor, setActiveMapDonor] = useState<Donor | null>(null);

  const viewMode = donorFilter.viewMode ?? 'grid';

  const triggerLoadingPulse = () => {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 220);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [donorFilter.bloodGroup, donorFilter.city, donorFilter.area, donorFilter.availableOnly]);

  const filteredDonors = useMemo(() => {
    const result = donors.filter((d) => {
      if (donorFilter.bloodGroup !== 'ALL' && d.bloodGroup !== donorFilter.bloodGroup) {
        return false;
      }
      if (donorFilter.city !== 'ALL' && d.city !== donorFilter.city) {
        return false;
      }
      if (
        donorFilter.area.trim() &&
        !d.area.toLowerCase().includes(donorFilter.area.trim().toLowerCase()) &&
        !d.city.toLowerCase().includes(donorFilter.area.trim().toLowerCase())
      ) {
        return false;
      }
      if (donorFilter.availableOnly && !d.available) {
        return false;
      }
      return true;
    });

    return [...result].sort((a, b) => {
      if (sortBy === 'available') {
        if (a.available !== b.available) return a.available ? -1 : 1;
        return b.donationsCount - a.donationsCount;
      }
      if (sortBy === 'donations') {
        return b.donationsCount - a.donationsCount;
      }
      return a.name.localeCompare(b.name);
    });
  }, [donors, donorFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredDonors.length / ITEMS_PER_PAGE));
  const paginatedDonors = filteredDonors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    triggerLoadingPulse();
    setDonorFilter({
      bloodGroup: 'ALL',
      city: 'ALL',
      area: '',
      availableOnly: false,
      viewMode,
    });
  };

  return (
    <main className="py-10 sm:py-14 bg-[#F8F7FF] min-h-[82vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header + Fintech/Travel Style Search Panel */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-bold text-[#8B5CF6] mb-1">
                Demonstration Donor Network
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#171C3A] tracking-tight">
                Find a Blood Donor Near You
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#5A607F] max-w-md">
              All donor listings are fictional sample profiles for demonstration. Hospital blood banks conduct formal screening.
            </p>
          </div>

          {/* Search Command Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              triggerLoadingPulse();
            }}
            className="rounded-[26px] bg-white p-3 sm:p-4 shadow-[0_18px_40px_-14px_rgba(23,28,58,0.1)] border border-[#171C3A]/8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center"
          >
            {/* Blood Group */}
            <div className="lg:col-span-3 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#F8F7FF]">
              <Droplets className="w-5 h-5 text-[#E63946] shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-bold text-[#5A607F]">Blood Group</label>
                <select
                  value={donorFilter.bloodGroup}
                  onChange={(e) => {
                    triggerLoadingPulse();
                    setDonorFilter((prev) => ({
                      ...prev,
                      bloodGroup: e.target.value as BloodGroup | 'ALL',
                    }));
                  }}
                  className="w-full bg-transparent text-sm font-bold text-[#171C3A] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Blood Groups</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {formatBloodGroupLabel(bg)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* City */}
            <div className="lg:col-span-3 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#F8F7FF]">
              <MapPin className="w-5 h-5 text-[#8B5CF6] shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-bold text-[#5A607F]">City</label>
                <select
                  value={donorFilter.city}
                  onChange={(e) => {
                    triggerLoadingPulse();
                    setDonorFilter((prev) => ({ ...prev, city: e.target.value }));
                  }}
                  className="w-full bg-transparent text-sm font-bold text-[#171C3A] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Demo Cities</option>
                  {DEMO_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Area */}
            <div className="lg:col-span-3 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#F8F7FF]">
              <Search className="w-5 h-5 text-[#4D96FF] shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-bold text-[#5A607F]">Neighborhood / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Midtown, Bayfront"
                  value={donorFilter.area}
                  onChange={(e) =>
                    setDonorFilter((prev) => ({ ...prev, area: e.target.value }))
                  }
                  className="w-full bg-transparent text-sm font-semibold text-[#171C3A] placeholder:text-[#8E93AE] focus:outline-none"
                />
              </div>
            </div>

            {/* Availability + Search Button */}
            <div className="lg:col-span-3 flex items-center justify-between gap-2 pl-1">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-[#171C3A] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={donorFilter.availableOnly}
                  onChange={(e) => {
                    triggerLoadingPulse();
                    setDonorFilter((prev) => ({ ...prev, availableOnly: e.target.checked }));
                  }}
                  className="w-4 h-4 accent-[#36D6A5] rounded cursor-pointer"
                />
                Available Only
              </label>

              <button
                type="submit"
                className="px-5 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#E63946] via-[#FF647C] to-[#FF4D9D] shadow-md shadow-[#E63946]/25 hover:scale-[1.02] transition-transform cursor-pointer whitespace-nowrap"
              >
                Search Donors
              </button>
            </div>
          </form>
        </div>

        {/* Main Content Grid: Filter Sidebar + Results / Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-[#171C3A]/10 text-sm font-bold text-[#171C3A] cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#8B5CF6]" />
                Quick Filters
              </span>
              <span>{mobileFiltersOpen ? 'Hide' : 'Show'}</span>
            </button>
          </div>

          {/* Left Filter Sidebar */}
          <aside
            className={`lg:col-span-3 rounded-[26px] bg-white p-6 border border-[#171C3A]/8 shadow-sm space-y-6 ${
              mobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-extrabold text-[#171C3A] inline-flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#8B5CF6]" />
                Filters
              </h2>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-[#E63946] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Blood Group Grid Buttons */}
            <div>
              <p className="text-xs font-bold text-[#5A607F] mb-2.5">Blood Group</p>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map((bg) => {
                  const active = donorFilter.bloodGroup === bg;
                  const theme = BLOOD_GROUP_THEMES[bg];
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => {
                        triggerLoadingPulse();
                        setDonorFilter((prev) => ({
                          ...prev,
                          bloodGroup: active ? 'ALL' : bg,
                        }));
                      }}
                      className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        active
                          ? `bg-gradient-to-r ${theme.gradient} text-white shadow-sm`
                          : 'bg-[#F8F7FF] text-[#171C3A] hover:bg-[#ECE8FF]'
                      }`}
                    >
                      {theme.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* City Filter */}
            <div>
              <p className="text-xs font-bold text-[#5A607F] mb-2.5">Demo City</p>
              <div className="space-y-1.5">
                {['ALL', ...DEMO_CITIES].map((city) => {
                  const active = donorFilter.city === city;
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        triggerLoadingPulse();
                        setDonorFilter((prev) => ({ ...prev, city }));
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#171C3A] text-white'
                          : 'text-[#4A506D] hover:bg-[#F8F7FF]'
                      }`}
                    >
                      {city === 'ALL' ? 'All Cities' : city}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div className="pt-4 border-t border-[#171C3A]/8">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-[#171C3A]">Available Donors Only</span>
                <input
                  type="checkbox"
                  checked={donorFilter.availableOnly}
                  onChange={(e) => {
                    triggerLoadingPulse();
                    setDonorFilter((prev) => ({ ...prev, availableOnly: e.target.checked }));
                  }}
                  className="w-4 h-4 accent-[#36D6A5] cursor-pointer"
                />
              </label>
            </div>
          </aside>

          {/* Right Results / Map Column */}
          <div className="lg:col-span-9 space-y-5">
            {/* Toolbar: Count, Sort, View Switcher */}
            <div className="rounded-2xl bg-white px-5 py-3.5 border border-[#171C3A]/8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-semibold text-[#4A506D] tabular-nums">
                Showing <strong className="text-[#171C3A]">{filteredDonors.length}</strong> demo donor profile(s)
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  aria-label="Sort donors"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'available' | 'donations' | 'name')}
                  className="rounded-xl bg-[#F8F7FF] px-3 py-2 text-xs font-bold text-[#171C3A] focus:outline-none cursor-pointer"
                >
                  <option value="available">Sort: Available First</option>
                  <option value="donations">Sort: Most Donations</option>
                  <option value="name">Sort: Name A–Z</option>
                </select>

                <div className="inline-flex items-center p-1 rounded-xl bg-[#F8F7FF]">
                  {[
                    { id: 'grid' as const, label: 'Grid', icon: LayoutGrid },
                    { id: 'list' as const, label: 'List', icon: List },
                    { id: 'map' as const, label: 'Demo Map', icon: MapIcon },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const active = viewMode === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDonorFilter((prev) => ({ ...prev, viewMode: tab.id }))}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-white text-[#171C3A] shadow-sm'
                            : 'text-[#5A607F] hover:text-[#171C3A]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Loading Skeleton State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="rounded-[24px] bg-white p-6 border border-[#171C3A]/8 animate-pulse space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-32 bg-slate-200 rounded" />
                        <div className="h-3 w-24 bg-slate-100 rounded" />
                      </div>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded" />
                    <div className="h-10 w-full bg-slate-200 rounded-full" />
                  </div>
                ))}
              </div>
            ) : filteredDonors.length === 0 ? (
              /* Empty State */
              <div className="rounded-[28px] bg-white p-12 text-center border border-[#171C3A]/8">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF0F3] text-[#E63946] flex items-center justify-center mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-extrabold text-[#171C3A]">
                  No matching demo donors found
                </h3>
                <p className="text-sm text-[#5A607F] mt-2 max-w-md mx-auto">
                  Try widening your neighborhood search or selecting &ldquo;All Blood Groups&rdquo; to view nearby community profiles.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#4D96FF] cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'map' ? (
              /* INTERACTIVE DEMO DONOR MAP */
              <div className="rounded-[28px] bg-white p-5 sm:p-6 border border-[#171C3A]/8 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-extrabold text-[#171C3A]">
                      Interactive Demonstration Donor Map
                    </h2>
                    <p className="text-xs text-[#5A607F]">
                      Fictional district coordinates shown for demonstration — no real-time GPS tracking is active.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#8B5CF6] bg-[#F4F1FF] px-3 py-1.5 rounded-xl">
                    Click any blood group pin
                  </span>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                  {/* Vector Map Canvas */}
                  <div className="xl:col-span-8 relative h-[430px] rounded-[24px] overflow-hidden border border-[#171C3A]/10 bg-gradient-to-br from-[#EFF7FF] via-[#F8F7FF] to-[#ECFDF7]">
                    {/* Stylized District Map Grid & River SVG */}
                    <svg
                      viewBox="0 0 800 500"
                      className="absolute inset-0 w-full h-full object-cover"
                      aria-hidden="true"
                    >
                      <defs>
                        <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="rgba(23,28,58,0.05)"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>
                      <rect width="800" height="500" fill="url(#map-grid)" />
                      {/* Stylized river curve */}
                      <path
                        d="M -20 380 C 180 310, 320 420, 520 260 C 660 150, 740 190, 840 120"
                        fill="none"
                        stroke="#BAE6FD"
                        strokeWidth="38"
                        strokeLinecap="round"
                        opacity="0.65"
                      />
                      {/* Arterial roads */}
                      <path
                        d="M 80 80 L 720 420 M 140 430 L 680 70 M 400 20 L 400 480 M 40 240 L 760 240"
                        stroke="rgba(139,92,246,0.14)"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                      />
                      {/* City Labels */}
                      <text x="150" y="95" className="fill-[#171C3A]/35 text-[14px] font-bold">
                        Metro City North
                      </text>
                      <text x="530" y="105" className="fill-[#171C3A]/35 text-[14px] font-bold">
                        Riverdale District
                      </text>
                      <text x="560" y="370" className="fill-[#171C3A]/35 text-[14px] font-bold">
                        Harborview Bay
                      </text>
                      <text x="130" y="405" className="fill-[#171C3A]/35 text-[14px] font-bold">
                        Oakridge Commons
                      </text>
                    </svg>

                    {/* Hospital Demo Markers */}
                    {hospitals.slice(0, 4).map((h) => (
                      <div
                        key={h.id}
                        style={{ left: `${h.coordinates.x}%`, top: `${h.coordinates.y}%` }}
                        title={`${h.name} (Demo Hospital)`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#171C3A]/85 text-white text-[10px] font-extrabold flex items-center justify-center shadow">
                          H
                        </div>
                      </div>
                    ))}

                    {/* Donor Pins */}
                    {filteredDonors.map((d) => {
                      const theme = BLOOD_GROUP_THEMES[d.bloodGroup];
                      const isSelected = activeMapDonor?.id === d.id;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setActiveMapDonor(d)}
                          style={{ left: `${d.coordinates.x}%`, top: `${d.coordinates.y}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-full text-xs font-display font-extrabold text-white bg-gradient-to-r ${theme.gradient} shadow-lg transition-transform cursor-pointer ${
                            isSelected ? 'scale-125 ring-4 ring-white z-20' : 'hover:scale-110 z-10'
                          }`}
                        >
                          {theme.label}
                        </button>
                      );
                    })}

                    {/* Floating Popup Card inside Map */}
                    {activeMapDonor && (
                      <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-xl border border-[#171C3A]/10 z-30">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display font-extrabold text-sm text-[#171C3A]">
                              {activeMapDonor.name} ({formatBloodGroupLabel(activeMapDonor.bloodGroup)})
                            </p>
                            <p className="text-xs text-[#5A607F]">
                              {activeMapDonor.area}, {activeMapDonor.city} · Demo Location
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveMapDonor(null)}
                            className="text-xs font-bold text-[#5A607F] hover:text-[#171C3A] cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-bold ${
                              activeMapDonor.available ? 'text-[#059669]' : 'text-[#5A607F]'
                            }`}
                          >
                            {activeMapDonor.available ? 'Available (Demo)' : 'Resting (Demo)'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedDonor(activeMapDonor)}
                            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E63946] to-[#FF4D9D] cursor-pointer"
                          >
                            Contact Donor
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Nearby Demo List beside Map */}
                  <div className="xl:col-span-4 space-y-2.5 max-h-[430px] overflow-y-auto pr-1">
                    {filteredDonors.map((d) => {
                      const theme = BLOOD_GROUP_THEMES[d.bloodGroup];
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setActiveMapDonor(d)}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            activeMapDonor?.id === d.id
                              ? 'bg-[#F4F1FF] border-[#8B5CF6]/40'
                              : 'bg-[#F8F7FF] border-transparent hover:border-[#171C3A]/15'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#171C3A] truncate">{d.name}</p>
                            <p className="text-xs text-[#5A607F] truncate">
                              {d.area}, {d.city}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r ${theme.gradient} shrink-0`}
                          >
                            {theme.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* GRID OR LIST VIEW */
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-5'
                      : 'space-y-4'
                  }
                >
                  {paginatedDonors.map((donor) => {
                    const theme = BLOOD_GROUP_THEMES[donor.bloodGroup];
                    return (
                      <div
                        key={donor.id}
                        className={`rounded-[26px] bg-white p-6 border border-[#171C3A]/8 shadow-sm hover:shadow-[0_18px_40px_-14px_rgba(23,28,58,0.12)] hover:-translate-y-0.5 transition-all ${
                          viewMode === 'list'
                            ? 'flex flex-col sm:flex-row sm:items-center justify-between gap-5'
                            : 'flex flex-col justify-between'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${donor.avatarGradient} text-white font-display font-extrabold text-base flex items-center justify-center shrink-0`}
                          >
                            {donor.initials}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display text-lg font-extrabold text-[#171C3A]">
                                {donor.name}
                              </h3>
                              <span
                                className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold text-white bg-gradient-to-r ${theme.gradient}`}
                              >
                                {theme.label}
                              </span>
                            </div>

                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A607F]">
                              <span className="inline-flex items-center gap-1 font-semibold text-[#171C3A]">
                                <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
                                {donor.area}, {donor.city}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                {donor.demoLabel}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                              {donor.available ? (
                                <span className="inline-flex items-center gap-1.5 font-bold text-[#059669]">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Available
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 font-bold text-[#5A607F]">
                                  <Clock className="w-3.5 h-3.5" />
                                  Resting Window
                                </span>
                              )}
                              <span aria-hidden="true" className="text-[#171C3A]/20">
                                ·
                              </span>
                              <span className="text-[#5A607F] tabular-nums">
                                Last donation: {donor.lastDonationDate}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className={
                            viewMode === 'list'
                              ? 'shrink-0'
                              : 'mt-5 pt-4 border-t border-[#171C3A]/6 flex items-center justify-between gap-3'
                          }
                        >
                          {viewMode === 'grid' && (
                            <span className="text-xs font-semibold text-[#5A607F] tabular-nums">
                              {donor.donationsCount} sample donations
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedDonor(donor)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E63946] to-[#FF4D9D] shadow-md shadow-[#E63946]/20 hover:scale-[1.02] transition-transform cursor-pointer whitespace-nowrap"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            Contact Donor
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pt-4 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-[#171C3A]/10 text-[#171C3A] disabled:opacity-40 cursor-pointer"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const page = idx + 1;
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-xl text-xs font-extrabold tabular-nums cursor-pointer ${
                            currentPage === page
                              ? 'bg-[#171C3A] text-white'
                              : 'bg-white border border-[#171C3A]/10 text-[#171C3A]'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-[#171C3A]/10 text-[#171C3A] disabled:opacity-40 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
