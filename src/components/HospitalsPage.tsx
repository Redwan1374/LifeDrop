import React, { useMemo, useState } from 'react';
import {
  Ambulance,
  Building2,
  Clock,
  Droplets,
  MapPin,
  Navigation,
  Phone,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMO_CITIES } from '../data/mockData';
import { Hospital } from '../types';

export const HospitalsPage: React.FC = () => {
  const { hospitals, addToast, navigate } = useApp();
  const [cityFilter, setCityFilter] = useState('ALL');
  const [bloodBankOnly, setBloodBankOnly] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeHospital, setActiveHospital] = useState<{
    hospital: Hospital;
    mode: 'contact' | 'directions';
  } | null>(null);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      if (cityFilter !== 'ALL' && h.city !== cityFilter) return false;
      if (bloodBankOnly && !h.hasBloodBank) return false;
      if (emergencyOnly && !h.hasEmergencyFacility) return false;
      return true;
    });
  }, [hospitals, cityFilter, bloodBankOnly, emergencyOnly]);

  return (
    <main className="py-10 sm:py-14 bg-[#F8F7FF] min-h-[82vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-[#4D96FF] mb-1">
              Hospital &amp; Blood Bank Directory (Demonstration Data)
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#171C3A] tracking-tight">
              Partner Facilities &amp; Blood Centers
            </h1>
            <p className="text-sm sm:text-base text-[#4A506D] mt-2">
              Locate sample regional blood banks and 24/7 emergency departments across our demonstration cities.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('donors', { donorFilter: { viewMode: 'map' } })}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold text-[#171C3A] bg-white border border-[#171C3A]/10 hover:border-[#4D96FF] transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Navigation className="w-4 h-4 text-[#4D96FF]" />
            View on Demo Map
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-[24px] bg-white p-4 sm:p-5 border border-[#171C3A]/8 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', ...DEMO_CITIES].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setCityFilter(city)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  cityFilter === city
                    ? 'bg-[#171C3A] text-white'
                    : 'bg-[#F8F7FF] text-[#4A506D] hover:text-[#171C3A]'
                }`}
              >
                {city === 'ALL' ? 'All Cities' : city}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-[#171C3A]">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bloodBankOnly}
                onChange={(e) => setBloodBankOnly(e.target.checked)}
                className="w-4 h-4 accent-[#E63946] cursor-pointer"
              />
              Blood Bank Available
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
              />
              24/7 Emergency Facility
            </label>
          </div>
        </div>

        {/* Hospital Cards */}
        {filteredHospitals.length === 0 ? (
          <div className="rounded-[28px] bg-white p-12 text-center border border-[#171C3A]/8">
            <Building2 className="w-10 h-10 text-[#4D96FF] mx-auto mb-3" />
            <h3 className="font-display text-xl font-extrabold text-[#171C3A]">
              No matching hospitals found
            </h3>
            <button
              type="button"
              onClick={() => {
                setCityFilter('ALL');
                setBloodBankOnly(false);
                setEmergencyOnly(false);
              }}
              className="mt-4 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#171C3A] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hosp, idx) => {
              const isFeatured = Boolean(hosp.featuredImage) && idx === 0;
              return (
                <article
                  key={hosp.id}
                  className={`rounded-[28px] bg-white border border-[#171C3A]/8 shadow-sm hover:shadow-[0_20px_44px_-14px_rgba(23,28,58,0.12)] overflow-hidden flex flex-col justify-between transition-all ${
                    isFeatured ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <div>
                    {hosp.featuredImage && !imgError ? (
                      <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                        <img
                          src={hosp.featuredImage}
                          alt={hosp.name}
                          referrerPolicy="no-referrer"
                          onError={() => setImgError(true)}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#171C3A]/75 via-[#171C3A]/20 to-transparent" />
                        <div className="absolute bottom-4 left-6 right-6 text-white">
                          <span className="text-xs font-bold text-[#7DD3FC]">
                            Featured Demo Hub · {hosp.city}
                          </span>
                          <h2 className="font-display text-2xl font-extrabold mt-0.5">
                            {hosp.name}
                          </h2>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`h-28 bg-gradient-to-r ${hosp.accentGradient} p-6 flex items-end justify-between text-white`}
                      >
                        <div>
                          <span className="text-xs font-bold text-white/85">{hosp.city}</span>
                          <h2 className="font-display text-lg font-extrabold leading-snug">
                            {hosp.name}
                          </h2>
                        </div>
                        <Building2 className="w-8 h-8 text-white/40 shrink-0" />
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      <p className="text-sm text-[#4A506D] leading-relaxed">{hosp.summary}</p>

                      <div className="space-y-2 text-xs text-[#4A506D]">
                        <p className="inline-flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#E63946] shrink-0 mt-0.5" />
                          <span>{hosp.address}</span>
                        </p>
                        <p className="inline-flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                          <span>{hosp.hours}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {hosp.hasBloodBank && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF0F3] text-[#E63946] text-xs font-bold">
                            <Droplets className="w-3.5 h-3.5" />
                            Demo Blood Bank
                          </span>
                        )}
                        {hosp.hasEmergencyFacility && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F4F1FF] text-[#7C3AED] text-xs font-bold">
                            <Ambulance className="w-3.5 h-3.5" />
                            Demo Emergency Facility
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-[#171C3A]/6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveHospital({ hospital: hosp, mode: 'contact' })}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full text-xs font-bold text-white bg-[#171C3A] hover:bg-[#252C57] transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Contact
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHospital({ hospital: hosp, mode: 'directions' })}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full text-xs font-bold text-[#171C3A] bg-[#F8F7FF] hover:bg-[#ECE8FF] transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#4D96FF]" />
                      Directions
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact / Demo Directions Modal */}
      {activeHospital && (
        <div className="fixed inset-0 z-50 bg-[#171C3A]/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-[#171C3A]/8 relative"
          >
            <button
              type="button"
              onClick={() => setActiveHospital(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-[#F8F7FF] flex items-center justify-center text-[#171C3A] cursor-pointer"
              aria-label="Close hospital modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-xl font-extrabold text-[#171C3A] pr-8">
              {activeHospital.hospital.name}
            </h3>
            <p className="text-xs text-[#5A607F] mt-1">
              Demonstration Facility Information
            </p>

            {activeHospital.mode === 'contact' ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[#F8F7FF] p-4 space-y-2 text-sm">
                  <p className="font-bold text-[#171C3A] inline-flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#E63946]" />
                    <span className="font-mono tabular-nums">{activeHospital.hospital.phone}</span>
                  </p>
                  <p className="text-xs text-[#5A607F]">{activeHospital.hospital.hours}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addToast(
                      'Demo Desk Logged',
                      `Simulated call reference copied for ${activeHospital.hospital.name}.`,
                      'info'
                    );
                    setActiveHospital(null);
                  }}
                  className="w-full py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#E63946] to-[#FF4D9D] cursor-pointer"
                >
                  Save Facility Contact
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[#EFF7FF] p-4 space-y-2 text-sm">
                  <p className="font-bold text-[#171C3A]">Demo Address</p>
                  <p className="text-xs text-[#4A506D]">{activeHospital.hospital.address}</p>
                  <p className="text-xs font-mono text-[#2563EB] pt-1 tabular-nums">
                    Map Grid Position: ({activeHospital.hospital.coordinates.x}%, {activeHospital.hospital.coordinates.y}%)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveHospital(null);
                    navigate('donors', { donorFilter: { viewMode: 'map' } });
                  }}
                  className="w-full py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#4D96FF] to-[#8B5CF6] cursor-pointer"
                >
                  Open Interactive Demo Map
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
