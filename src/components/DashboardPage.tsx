import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Bell,
  CheckCircle2,
  Droplets,
  Heart,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  ToggleLeft,
  ToggleRight,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  BLOOD_GROUPS,
  BLOOD_GROUP_THEMES,
  DEMO_CITIES,
  MONTHLY_CHART_DATA,
  formatBloodGroupLabel,
} from '../data/mockData';
import { BloodGroup } from '../types';
import { BrandLogo } from './BrandLogo';

type DashTab = 'overview' | 'requests' | 'connections' | 'profile';

export const DashboardPage: React.FC = () => {
  const {
    user,
    donors,
    requests,
    notifications,
    activities,
    savedConnectionIds,
    navigate,
    openCreateRequest,
    toggleUserAvailability,
    updateUserProfile,
    updateRequestStatus,
    markNotificationRead,
    markAllNotificationsRead,
    logoutUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<DashTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dashSearch, setDashSearch] = useState('');

  const [editName, setEditName] = useState(user.name);
  const [editCity, setEditCity] = useState(user.city);
  const [editArea, setEditArea] = useState(user.area);
  const [editBlood, setEditBlood] = useState<BloodGroup>(user.bloodGroup);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const openRequestsCount = requests.filter((r) => r.status !== 'Fulfilled').length;

  const bloodGroupCounts = useMemo(() => {
    const counts = BLOOD_GROUPS.map((bg) => ({
      bg,
      count: donors.filter((d) => d.bloodGroup === bg).length,
    }));
    const max = Math.max(1, ...counts.map((c) => c.count));
    return counts.map((c) => ({ ...c, pct: Math.round((c.count / max) * 100) }));
  }, [donors]);

  const filteredActivities = useMemo(() => {
    if (!dashSearch.trim()) return activities;
    const q = dashSearch.toLowerCase();
    return activities.filter(
      (a) => a.title.toLowerCase().includes(q) || a.detail.toLowerCase().includes(q)
    );
  }, [activities, dashSearch]);

  const savedDonors = donors.filter((d) => savedConnectionIds.includes(d.id));
  const respondedRequests = requests.filter((r) => savedConnectionIds.includes(r.id));

  const milestoneTarget = 8;
  const milestonePct = Math.min(100, Math.round((user.donationsCount / milestoneTarget) * 100));

  const navItems: { id: DashTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'requests', label: 'Blood Requests', icon: Droplets },
    { id: 'connections', label: 'Connections', icon: HeartHandshake },
    { id: 'profile', label: 'Profile & Status', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#171C3A]/50 lg:hidden"
        />
      )}

      {/* Dark Navy Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-68 bg-[#171C3A] text-white flex flex-col justify-between p-5 transition-transform duration-200 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="cursor-pointer"
              aria-label="Back to LifeDrop Home"
            >
              <BrandLogo variant="light" size="sm" />
            </button>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:bg-white/10 cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav aria-label="Dashboard Navigation" className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-[#E63946] via-[#FF647C] to-[#FF4D9D] text-white shadow-lg shadow-[#E63946]/25'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={() => navigate('donors')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/8 hover:text-white cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#36D6A5]" />
              Browse Donor Search
            </button>
            <button
              type="button"
              onClick={() => navigate('home')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/8 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#7DD3FC]" />
              Back to Public Site
            </button>
          </div>
        </div>

        {/* Bottom User Summary & Sign Out */}
        <div className="rounded-2xl bg-white/8 border border-white/10 p-3.5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#4D96FF] flex items-center justify-center font-display font-extrabold text-sm shrink-0">
              {user.name
                .split(' ')
                .map((p) => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-300 truncate">
                {formatBloodGroupLabel(user.bloodGroup)} · Demo Account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/10 hover:bg-white/18 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Demo Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#171C3A]/8 px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[#F8F7FF] text-[#171C3A] cursor-pointer"
              aria-label="Open dashboard menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display text-base sm:text-lg font-extrabold text-[#171C3A] truncate">
              Donor Workspace / {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8F7FF] w-56">
              <Search className="w-4 h-4 text-[#5A607F]" />
              <input
                type="text"
                placeholder="Filter activity..."
                value={dashSearch}
                onChange={(e) => setDashSearch(e.target.value)}
                className="bg-transparent text-xs font-medium text-[#171C3A] focus:outline-none w-full"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Toggle notifications"
                className="relative w-10 h-10 rounded-xl bg-[#F8F7FF] hover:bg-[#ECE8FF] flex items-center justify-center text-[#171C3A] transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E63946] text-white text-[10px] font-extrabold flex items-center justify-center tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-[#171C3A]/10 p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-extrabold text-[#171C3A]">
                      Demo Notifications
                    </span>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-xs font-bold text-[#8B5CF6] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => markNotificationRead(n.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                          n.read
                            ? 'bg-[#F8F7FF]/60 border-transparent'
                            : 'bg-[#FFF0F3]/60 border-[#FF647C]/25'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-[#171C3A]">{n.title}</p>
                          <span className="text-[10px] text-[#5A607F]">{n.timeAgo}</span>
                        </div>
                        <p className="text-xs text-[#4A506D] mt-1 leading-relaxed">{n.message}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={openCreateRequest}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E63946] to-[#FF4D9D] shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Request Blood
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-7">
          {activeTab === 'overview' && (
            <>
              {/* Quick Actions Banner */}
              <div className="rounded-[26px] bg-gradient-to-r from-[#171C3A] via-[#262E5C] to-[#412B6B] text-white p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
                <div>
                  <p className="text-xs font-bold text-[#7DD3FC]">
                    Interactive Demonstration Workspace
                  </p>
                  <h2 className="font-display text-2xl font-extrabold mt-1">
                    Hello, {user.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Manage your sample availability, respond to local hospital needs, and review community activity.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => navigate('donors')}
                    className="px-4 py-2.5 rounded-full text-xs font-bold bg-white text-[#171C3A] hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                  >
                    Find Donors
                  </button>
                  <button
                    type="button"
                    onClick={openCreateRequest}
                    className="px-4 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#E63946] to-[#FF4D9D] text-white cursor-pointer whitespace-nowrap"
                  >
                    Request Blood
                  </button>
                  <button
                    type="button"
                    onClick={toggleUserAvailability}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-white/12 hover:bg-white/20 text-white border border-white/15 cursor-pointer whitespace-nowrap"
                  >
                    {user.available ? (
                      <ToggleRight className="w-4 h-4 text-[#36D6A5]" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 text-slate-300" />
                    )}
                    {user.available ? 'Status: Available' : 'Status: Resting'}
                  </button>
                </div>
              </div>

              {/* 4 Overview KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <div className="rounded-[24px] bg-white p-5 border border-[#171C3A]/8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5A607F]">Sample Donations</span>
                    <span className="w-9 h-9 rounded-xl bg-[#FFF0F3] text-[#E63946] flex items-center justify-center">
                      <Droplets className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="font-display text-3xl font-extrabold text-[#171C3A] mt-3 tabular-nums">
                    {user.donationsCount}
                  </p>
                  <p className="text-xs text-[#5A607F] mt-1">Demo milestone tracker</p>
                </div>

                <div className="rounded-[24px] bg-white p-5 border border-[#171C3A]/8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5A607F]">Community Impact</span>
                    <span className="w-9 h-9 rounded-xl bg-[#F4F1FF] text-[#8B5CF6] flex items-center justify-center">
                      <Heart className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="font-display text-3xl font-extrabold text-[#171C3A] mt-3 tabular-nums">
                    {user.impactScore}
                  </p>
                  <p className="text-xs text-[#5A607F] mt-1">Estimated sample lives helped</p>
                </div>

                <div className="rounded-[24px] bg-white p-5 border border-[#171C3A]/8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5A607F]">Active Requests</span>
                    <span className="w-9 h-9 rounded-xl bg-[#FFF6ED] text-[#EA580C] flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="font-display text-3xl font-extrabold text-[#171C3A] mt-3 tabular-nums">
                    {openRequestsCount}
                  </p>
                  <p className="text-xs text-[#5A607F] mt-1">Open demo requests on board</p>
                </div>

                <div className="rounded-[24px] bg-white p-5 border border-[#171C3A]/8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5A607F]">Donor Status</span>
                    <span className="w-9 h-9 rounded-xl bg-[#ECFDF7] text-[#059669] flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  </div>
                  <p
                    className={`font-display text-2xl font-extrabold mt-3 ${
                      user.available ? 'text-[#059669]' : 'text-[#5A607F]'
                    }`}
                  >
                    {user.available ? 'Available' : 'Resting'}
                  </p>
                  <button
                    type="button"
                    onClick={toggleUserAvailability}
                    className="text-xs font-bold text-[#8B5CF6] hover:underline mt-1 cursor-pointer"
                  >
                    Click to toggle
                  </button>
                </div>
              </div>

              {/* Charts + Progress Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Monthly Activity SVG Bar Chart */}
                <div className="lg:col-span-7 rounded-[26px] bg-white p-6 border border-[#171C3A]/8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-[#171C3A]">
                        Community Connection Trends (Demo)
                      </h3>
                      <p className="text-xs text-[#5A607F]">
                        Monthly sample connections vs. blood requests
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-[#5A607F]">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#8B5CF6]" />
                        Requests
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#FF647C]" />
                        Connections
                      </span>
                    </div>
                  </div>

                  <div className="h-56 flex items-end justify-between gap-3 pt-4">
                    {MONTHLY_CHART_DATA.map((item) => {
                      const reqH = Math.round((item.requests / 600) * 100);
                      const conH = Math.round((item.connections / 600) * 100);
                      return (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <div className="w-full flex items-end justify-center gap-1.5 h-44">
                            <div
                              title={`${item.month} Requests: ${item.requests} (demo)`}
                              style={{ height: `${reqH}%` }}
                              className="w-3.5 sm:w-5 rounded-t-lg bg-[#8B5CF6]/25 hover:bg-[#8B5CF6] transition-colors"
                            />
                            <div
                              title={`${item.month} Connections: ${item.connections} (demo)`}
                              style={{ height: `${conH}%` }}
                              className="w-3.5 sm:w-5 rounded-t-lg bg-gradient-to-t from-[#E63946] to-[#FF647C]"
                            />
                          </div>
                          <span className="text-xs font-bold text-[#5A607F]">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Blood Group Pool Breakdown + Milestone */}
                <div className="lg:col-span-5 rounded-[26px] bg-white p-6 border border-[#171C3A]/8 shadow-sm flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-[#171C3A]">
                      Demo Network Blood Mix
                    </h3>
                    <p className="text-xs text-[#5A607F] mb-4">
                      Live distribution across registered demonstration profiles
                    </p>

                    <div className="space-y-2.5">
                      {bloodGroupCounts.slice(0, 5).map(({ bg, count, pct }) => {
                        const theme = BLOOD_GROUP_THEMES[bg];
                        return (
                          <div key={bg} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-[#171C3A]">{theme.label}</span>
                              <span className="text-[#5A607F] tabular-nums">{count} profiles</span>
                            </div>
                            <div className="h-2 rounded-full bg-[#F8F7FF] overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${theme.gradient}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personal Milestone Progress */}
                  <div className="rounded-2xl bg-[#F8F7FF] p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#171C3A]">Next Community Milestone</span>
                      <span className="text-[#E63946] tabular-nums">
                        {user.donationsCount} / {milestoneTarget} donations
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#36D6A5] to-[#4D96FF]"
                        style={{ width: `${milestonePct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div className="rounded-[26px] bg-white p-6 border border-[#171C3A]/8 shadow-sm">
                <h3 className="font-display text-lg font-extrabold text-[#171C3A] mb-4">
                  Recent Activity Timeline
                </h3>
                {filteredActivities.length === 0 ? (
                  <p className="text-sm text-[#5A607F]">No activity matches your filter.</p>
                ) : (
                  <div className="space-y-4">
                    {filteredActivities.slice(0, 6).map((act) => (
                      <div
                        key={act.id}
                        className="flex items-start justify-between gap-4 pb-4 border-b border-[#171C3A]/6 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#F4F1FF] text-[#8B5CF6] flex items-center justify-center shrink-0">
                            <Activity className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#171C3A]">{act.title}</p>
                            <p className="text-xs text-[#5A607F] mt-0.5">{act.detail}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#5A607F] whitespace-nowrap">
                          {act.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'requests' && (
            <div className="rounded-[26px] bg-white p-6 border border-[#171C3A]/8 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-extrabold text-[#171C3A]">
                    Manage Demo Blood Requests
                  </h2>
                  <p className="text-xs text-[#5A607F]">
                    Update status on active community requests in this demonstration session.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCreateRequest}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E63946] to-[#FF4D9D] cursor-pointer"
                >
                  + New Request
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#171C3A]/10 text-xs text-[#5A607F]">
                      <th className="py-3 pr-4 font-bold">Case</th>
                      <th className="py-3 px-4 font-bold">Blood</th>
                      <th className="py-3 px-4 font-bold">Hospital</th>
                      <th className="py-3 px-4 font-bold">Units</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 pl-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id} className="border-b border-[#171C3A]/6 last:border-b-0">
                        <td className="py-3.5 pr-4 font-bold text-[#171C3A]">
                          {r.patientReference}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-[#E63946]">
                          {formatBloodGroupLabel(r.bloodGroup)}
                        </td>
                        <td className="py-3.5 px-4 text-[#4A506D]">{r.hospital}</td>
                        <td className="py-3.5 px-4 font-mono tabular-nums">{r.unitsRequired}</td>
                        <td className="py-3.5 px-4 font-semibold">{r.status}</td>
                        <td className="py-3.5 pl-4 text-right">
                          {r.status !== 'Fulfilled' ? (
                            <button
                              type="button"
                              onClick={() => updateRequestStatus(r.id, 'Fulfilled')}
                              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#ECFDF7] text-[#059669] hover:bg-[#D6FAEC] cursor-pointer"
                            >
                              Mark Fulfilled
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateRequestStatus(r.id, 'Open')}
                              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#F8F7FF] text-[#5A607F] cursor-pointer"
                            >
                              Reopen
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="rounded-[26px] bg-white p-6 border border-[#171C3A]/8 shadow-sm space-y-5">
              <h2 className="font-display text-xl font-extrabold text-[#171C3A]">
                Saved Demo Connections
              </h2>

              {savedDonors.length === 0 && respondedRequests.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <HeartHandshake className="w-10 h-10 text-[#8B5CF6] mx-auto" />
                  <p className="text-sm font-bold text-[#171C3A]">No saved connections yet</p>
                  <p className="text-xs text-[#5A607F]">
                    Contact a demo donor or offer help on an active blood request to track connections here.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('donors')}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#171C3A] cursor-pointer"
                  >
                    Find Donors
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedDonors.map((d) => (
                    <div
                      key={d.id}
                      className="rounded-2xl bg-[#F8F7FF] p-4 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#171C3A]">
                          {d.name} ({formatBloodGroupLabel(d.bloodGroup)})
                        </p>
                        <p className="text-xs text-[#5A607F]">
                          {d.area}, {d.city} · {d.phone}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#059669]">Donor Logged</span>
                    </div>
                  ))}
                  {respondedRequests.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl bg-[#FFF0F3] p-4 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#171C3A]">
                          {r.patientReference} ({formatBloodGroupLabel(r.bloodGroup)})
                        </p>
                        <p className="text-xs text-[#5A607F]">
                          {r.hospital} · {r.city}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#E63946]">Support Offered</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl rounded-[26px] bg-white p-6 sm:p-8 border border-[#171C3A]/8 shadow-sm space-y-6">
              <div>
                <h2 className="font-display text-xl font-extrabold text-[#171C3A]">
                  Demo Profile &amp; Availability
                </h2>
                <p className="text-xs text-[#5A607F] mt-1">
                  Changes made here update your demonstration profile across the platform.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateUserProfile({
                    name: editName,
                    city: editCity,
                    area: editArea,
                    bloodGroup: editBlood,
                  });
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171C3A] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-4 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#171C3A] mb-1">Blood Group</label>
                    <select
                      value={editBlood}
                      onChange={(e) => setEditBlood(e.target.value as BloodGroup)}
                      className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-4 py-2.5 text-sm font-bold focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {formatBloodGroupLabel(bg)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171C3A] mb-1">City</label>
                    <select
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-4 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
                    >
                      {DEMO_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#171C3A] mb-1">Area</label>
                    <input
                      type="text"
                      value={editArea}
                      onChange={(e) => setEditArea(e.target.value)}
                      className="w-full rounded-xl border border-[#171C3A]/15 bg-[#F8F7FF] px-4 py-2.5 text-sm focus:bg-white focus:border-[#8B5CF6] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={toggleUserAvailability}
                    className="px-4 py-2.5 rounded-full text-xs font-bold bg-[#F8F7FF] text-[#171C3A] hover:bg-[#ECE8FF] cursor-pointer"
                  >
                    Toggle Availability ({user.available ? 'Available' : 'Resting'})
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#4D96FF] cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
