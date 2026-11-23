import React, { useEffect, useState } from 'react';
import { Heart, LayoutDashboard, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageRoute } from '../types';
import { BrandLogo } from './BrandLogo';

const NAV_ITEMS: { id: PageRoute; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'donors', label: 'Find Donors' },
  { id: 'requests', label: 'Blood Requests' },
  { id: 'hospitals', label: 'Hospitals' },
  { id: 'about', label: 'About' },
];

export const Navbar: React.FC = () => {
  const { route, navigate, user, openAuthModal } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (route === 'dashboard') {
    return null;
  }

  const handleNav = (id: PageRoute) => {
    setMobileOpen(false);
    navigate(id);
  };

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 pt-3 pb-2 pointer-events-none">
      <div
        className={`max-w-7xl mx-auto pointer-events-auto rounded-2xl transition-all duration-200 px-4 sm:px-6 h-16 flex items-center justify-between gap-6 ${
          scrolled
            ? 'bg-white/92 backdrop-blur-xl shadow-[0_12px_36px_-12px_rgba(23,28,58,0.12)] border border-[#171C3A]/8'
            : 'bg-white/80 backdrop-blur-lg border border-white/80 shadow-[0_6px_24px_-8px_rgba(23,28,58,0.07)]'
        }`}
      >
        {/* Zone 1: Single-line Brand */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="cursor-pointer rounded-xl focus-visible:outline-none whitespace-nowrap shrink-0"
          aria-label="LifeDrop Home"
        >
          <BrandLogo variant="dark" size="md" />
        </button>

        {/* Zone 2: Clean 5-item Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = route === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`group relative py-1.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive ? 'text-[#E63946]' : 'text-[#4A506D] hover:text-[#171C3A]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#E63946] to-[#FF4D9D] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Right Actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user.loggedIn ? (
            <button
              type="button"
              onClick={() => handleNav('dashboard')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-[#171C3A] bg-[#F8F7FF] hover:bg-[#EFEBFD] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-[#8B5CF6]" />
              Dashboard
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-3 py-2 text-sm font-semibold text-[#4A506D] hover:text-[#171C3A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="px-3.5 py-2 text-sm font-semibold text-[#171C3A] bg-[#F8F7FF] hover:bg-[#ECE8FF] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => handleNav('register')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-full bg-gradient-to-r from-[#E63946] via-[#FF647C] to-[#FF4D9D] shadow-[0_8px_20px_-4px_rgba(230,57,70,0.42)] hover:shadow-[0_12px_26px_-4px_rgba(255,77,157,0.5)] hover:scale-[1.02] active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white/25" />
            Become a Donor
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => handleNav('register')}
            className="px-3.5 py-2 text-xs font-bold text-white rounded-full bg-gradient-to-r from-[#E63946] to-[#FF4D9D] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Become a Donor
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-[#F8F7FF] text-[#171C3A] hover:bg-[#ECE8FF] transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 pointer-events-auto rounded-2xl bg-white/95 backdrop-blur-xl border border-[#171C3A]/10 shadow-xl p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = route === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#FFF0F3] text-[#E63946]'
                    : 'text-[#171C3A] hover:bg-[#F8F7FF]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-3 mt-2 border-t border-[#171C3A]/10 flex flex-wrap gap-2">
            {user.loggedIn ? (
              <button
                type="button"
                onClick={() => handleNav('dashboard')}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#171C3A] rounded-xl cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                Open Dashboard
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    openAuthModal('login');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#171C3A] bg-[#F8F7FF] rounded-xl cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    openAuthModal('signup');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#171C3A] rounded-xl cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
