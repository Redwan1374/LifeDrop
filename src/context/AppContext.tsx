import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityItem,
  BloodGroup,
  BloodRequest,
  Donor,
  Hospital,
  NotificationItem,
  PageRoute,
  ToastMessage,
  UrgencyLevel,
  UserAccount,
} from '../types';
import {
  INITIAL_DONORS,
  INITIAL_HOSPITALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REQUESTS,
} from '../data/mockData';

const STORAGE_KEY = 'lifedrop_demo_v1';

interface DonorSearchFilter {
  bloodGroup: BloodGroup | 'ALL';
  city: string;
  area: string;
  availableOnly: boolean;
  viewMode?: 'grid' | 'list' | 'map';
}

interface NewDonorPayload {
  name: string;
  phone: string;
  email: string;
  bloodGroup: BloodGroup;
  city: string;
  area: string;
  lastDonationDate: string;
  available: boolean;
  contactPreference: 'Phone' | 'Email' | 'Both';
}

interface NewRequestPayload {
  patientReference: string;
  bloodGroup: BloodGroup;
  urgency: UrgencyLevel;
  hospital: string;
  city: string;
  area: string;
  unitsRequired: number;
  timeRemaining: string;
  contactName: string;
  contactPhone: string;
  notes: string;
}

interface PersistedState {
  donors: Donor[];
  requests: BloodRequest[];
  user: UserAccount;
  notifications: NotificationItem[];
  activities: ActivityItem[];
  savedConnectionIds: string[];
}

const DEFAULT_USER: UserAccount = {
  loggedIn: false,
  id: 'usr-demo-1',
  name: 'Jordan Avery',
  email: 'jordan.avery.demo@example.org',
  phone: '+1 (555) 018-2460',
  bloodGroup: 'O+',
  city: 'Metro City',
  area: 'Midtown Heights',
  available: true,
  donationsCount: 4,
  impactScore: 12,
  joinedDate: '2026-03-15',
  contactPreference: 'Both',
};

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Demo Account Ready',
    detail: 'Explore donor discovery, emergency request posting, and availability controls.',
    timestamp: 'Just now',
    type: 'registration',
  },
  {
    id: 'act-2',
    title: 'Connected with Central Metro Pavilion',
    detail: 'Viewed 24/7 blood bank intake hours in Metro City.',
    timestamp: '2 days ago',
    type: 'connection',
  },
];

function loadPersistedState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        donors: parsed.donors && parsed.donors.length > 0 ? parsed.donors : INITIAL_DONORS,
        requests: parsed.requests && parsed.requests.length > 0 ? parsed.requests : INITIAL_REQUESTS,
        user: parsed.user ? parsed.user : DEFAULT_USER,
        notifications: parsed.notifications ?? INITIAL_NOTIFICATIONS,
        activities: parsed.activities ?? INITIAL_ACTIVITIES,
        savedConnectionIds: parsed.savedConnectionIds ?? [],
      };
    }
  } catch {
    // Fallback cleanly if storage is unavailable
  }
  return {
    donors: INITIAL_DONORS,
    requests: INITIAL_REQUESTS,
    user: DEFAULT_USER,
    notifications: INITIAL_NOTIFICATIONS,
    activities: INITIAL_ACTIVITIES,
    savedConnectionIds: [],
  };
}

interface AppContextValue {
  route: PageRoute;
  navigate: (page: PageRoute, options?: { donorFilter?: Partial<DonorSearchFilter> }) => void;
  donors: Donor[];
  requests: BloodRequest[];
  hospitals: Hospital[];
  user: UserAccount;
  notifications: NotificationItem[];
  activities: ActivityItem[];
  savedConnectionIds: string[];
  donorFilter: DonorSearchFilter;
  setDonorFilter: React.Dispatch<React.SetStateAction<DonorSearchFilter>>;
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, variant?: ToastMessage['variant']) => void;
  dismissToast: (id: string) => void;
  // Modals
  authModal: 'login' | 'signup' | null;
  openAuthModal: (mode: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  createRequestOpen: boolean;
  openCreateRequest: () => void;
  closeCreateRequest: () => void;
  selectedDonor: Donor | null;
  setSelectedDonor: (donor: Donor | null) => void;
  selectedRequest: BloodRequest | null;
  setSelectedRequest: (req: BloodRequest | null) => void;
  legalModal: 'privacy' | 'terms' | 'contact' | null;
  setLegalModal: (type: 'privacy' | 'terms' | 'contact' | null) => void;
  // Actions
  loginUser: (name?: string, email?: string) => void;
  logoutUser: () => void;
  registerDonor: (payload: NewDonorPayload) => void;
  toggleUserAvailability: () => void;
  updateUserProfile: (updates: Partial<UserAccount>) => void;
  addBloodRequest: (payload: NewRequestPayload) => void;
  respondToRequest: (requestId: string) => void;
  updateRequestStatus: (requestId: string, status: BloodRequest['status']) => void;
  contactDonor: (donor: Donor) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persisted, setPersisted] = useState<PersistedState>(() => loadPersistedState());
  const [route, setRoute] = useState<PageRoute>('home');
  const [donorFilter, setDonorFilter] = useState<DonorSearchFilter>({
    bloodGroup: 'ALL',
    city: 'ALL',
    area: '',
    availableOnly: false,
    viewMode: 'grid',
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [createRequestOpen, setCreateRequestOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Ignore storage quota issues
    }
  }, [persisted]);

  const addToast = useCallback(
    (title: string, description?: string, variant: ToastMessage['variant'] = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const navigate = useCallback(
    (page: PageRoute, options?: { donorFilter?: Partial<DonorSearchFilter> }) => {
      if (options?.donorFilter) {
        setDonorFilter((prev) => ({
          ...prev,
          ...options.donorFilter,
        }));
      }
      setRoute(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const openAuthModal = useCallback((mode: 'login' | 'signup') => setAuthModal(mode), []);
  const closeAuthModal = useCallback(() => setAuthModal(null), []);
  const openCreateRequest = useCallback(() => setCreateRequestOpen(true), []);
  const closeCreateRequest = useCallback(() => setCreateRequestOpen(false), []);

  const loginUser = useCallback(
    (name?: string, email?: string) => {
      setPersisted((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          loggedIn: true,
          name: name?.trim() || prev.user.name,
          email: email?.trim() || prev.user.email,
        },
        activities: [
          {
            id: `act-${Date.now()}`,
            title: 'Signed into Demo Dashboard',
            detail: `Active session started as ${name?.trim() || prev.user.name}.`,
            timestamp: 'Just now',
            type: 'registration',
          },
          ...prev.activities,
        ],
      }));
      setAuthModal(null);
      addToast('Welcome back to LifeDrop', 'Your demonstration dashboard is now active.', 'success');
    },
    [addToast]
  );

  const logoutUser = useCallback(() => {
    setPersisted((prev) => ({
      ...prev,
      user: { ...prev.user, loggedIn: false },
    }));
    setRoute('home');
    addToast('Signed out', 'You have exited the demo dashboard session.', 'info');
  }, [addToast]);

  const registerDonor = useCallback(
    (payload: NewDonorPayload) => {
      const parts = payload.name.trim().split(/\s+/);
      const initials =
        parts.length >= 2
          ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
          : payload.name.slice(0, 2).toUpperCase();

      const gradients = [
        'from-[#E63946] to-[#FF647C]',
        'from-[#8B5CF6] to-[#4D96FF]',
        'from-[#36D6A5] to-[#4D96FF]',
        'from-[#FF9F43] to-[#FF647C]',
      ];
      const newDonor: Donor = {
        id: `dn-${Date.now()}`,
        name: payload.name.trim(),
        initials,
        bloodGroup: payload.bloodGroup,
        city: payload.city,
        area: payload.area.trim(),
        available: payload.available,
        lastDonationDate: payload.lastDonationDate || 'First-time profile',
        phone: payload.phone,
        email: payload.email,
        contactPreference: payload.contactPreference,
        donationsCount: payload.lastDonationDate ? 1 : 0,
        demoLabel: 'Demo Profile',
        avatarGradient: gradients[Math.floor(Math.random() * gradients.length)],
        coordinates: {
          x: 22 + Math.floor(Math.random() * 58),
          y: 22 + Math.floor(Math.random() * 56),
        },
        bio: `Community demo donor registered in ${payload.area}, ${payload.city}.`,
      };

      setPersisted((prev) => ({
        ...prev,
        donors: [newDonor, ...prev.donors],
        user: {
          ...prev.user,
          loggedIn: true,
          id: newDonor.id,
          name: newDonor.name,
          email: newDonor.email,
          phone: newDonor.phone,
          bloodGroup: newDonor.bloodGroup,
          city: newDonor.city,
          area: newDonor.area,
          available: newDonor.available,
          contactPreference: newDonor.contactPreference,
          donationsCount: newDonor.donationsCount,
          impactScore: newDonor.donationsCount * 3,
          joinedDate: new Date().toISOString().slice(0, 10),
        },
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: 'Donor Profile Created',
            message: `Welcome ${newDonor.name}! Your ${newDonor.bloodGroup} demo listing is now visible in ${newDonor.city}.`,
            timeAgo: 'Just now',
            read: false,
            category: 'system',
          },
          ...prev.notifications,
        ],
        activities: [
          {
            id: `act-${Date.now()}`,
            title: 'Registered as Community Donor',
            detail: `Added ${newDonor.bloodGroup} demo profile in ${newDonor.area}, ${newDonor.city}.`,
            timestamp: 'Just now',
            type: 'registration',
          },
          ...prev.activities,
        ],
      }));

      addToast(
        'Registration Complete',
        `Thank you, ${payload.name}! Your demo profile is now live.`,
        'success'
      );
    },
    [addToast]
  );

  const toggleUserAvailability = useCallback(() => {
    setPersisted((prev) => {
      const nextAvail = !prev.user.available;
      const updatedDonors = prev.donors.map((d) =>
        d.id === prev.user.id || d.email === prev.user.email
          ? { ...d, available: nextAvail }
          : d
      );
      return {
        ...prev,
        donors: updatedDonors,
        user: { ...prev.user, available: nextAvail },
        activities: [
          {
            id: `act-${Date.now()}`,
            title: `Availability set to ${nextAvail ? 'Available' : 'Resting'}`,
            detail: nextAvail
              ? 'Your demo listing is now discoverable in donor search.'
              : 'Your demo listing is temporarily paused from urgent search.',
            timestamp: 'Just now',
            type: 'availability',
          },
          ...prev.activities,
        ],
      };
    });
    addToast('Availability Updated', 'Your donor status has been updated across the network.', 'info');
  }, [addToast]);

  const updateUserProfile = useCallback(
    (updates: Partial<UserAccount>) => {
      setPersisted((prev) => {
        const nextUser = { ...prev.user, ...updates };
        const updatedDonors = prev.donors.map((d) =>
          d.id === prev.user.id || d.email === prev.user.email
            ? {
                ...d,
                name: nextUser.name,
                city: nextUser.city,
                area: nextUser.area,
                bloodGroup: nextUser.bloodGroup,
                available: nextUser.available,
                contactPreference: nextUser.contactPreference,
              }
            : d
        );
        return {
          ...prev,
          user: nextUser,
          donors: updatedDonors,
        };
      });
      addToast('Profile Saved', 'Your demo account details have been updated.', 'success');
    },
    [addToast]
  );

  const addBloodRequest = useCallback(
    (payload: NewRequestPayload) => {
      const newReq: BloodRequest = {
        id: `req-${Date.now()}`,
        patientReference: payload.patientReference.trim(),
        bloodGroup: payload.bloodGroup,
        urgency: payload.urgency,
        hospital: payload.hospital.trim(),
        city: payload.city,
        area: payload.area.trim(),
        unitsRequired: payload.unitsRequired,
        timeRemaining: payload.timeRemaining || 'Within 6 hours',
        createdAt: 'Just now',
        contactName: payload.contactName.trim(),
        contactPhone: payload.contactPhone.trim(),
        notes: payload.notes.trim() || 'Community blood request submitted via LifeDrop demo network.',
        status: 'Open',
        pledgedCount: 0,
        isUserSubmitted: true,
      };

      setPersisted((prev) => ({
        ...prev,
        requests: [newReq, ...prev.requests],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: `${newReq.urgency} ${newReq.bloodGroup} Request Posted`,
            message: `${newReq.hospital} (${newReq.city}) needs ${newReq.unitsRequired} unit(s).`,
            timeAgo: 'Just now',
            read: false,
            category: 'emergency',
          },
          ...prev.notifications,
        ],
        activities: [
          {
            id: `act-${Date.now()}`,
            title: `Submitted ${newReq.bloodGroup} Blood Request`,
            detail: `${newReq.unitsRequired} unit(s) requested at ${newReq.hospital}, ${newReq.city}.`,
            timestamp: 'Just now',
            type: 'request',
          },
          ...prev.activities,
        ],
      }));

      setCreateRequestOpen(false);
      addToast(
        'Emergency Request Published',
        `Your ${newReq.bloodGroup} request at ${newReq.hospital} is now live in the demo feed.`,
        'success'
      );
    },
    [addToast]
  );

  const respondToRequest = useCallback(
    (requestId: string) => {
      setPersisted((prev) => {
        const target = prev.requests.find((r) => r.id === requestId);
        if (!target) return prev;
        const alreadySaved = prev.savedConnectionIds.includes(requestId);
        return {
          ...prev,
          requests: prev.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  pledgedCount: alreadySaved ? r.pledgedCount : r.pledgedCount + 1,
                  status: r.status === 'Open' ? 'Connected' : r.status,
                }
              : r
          ),
          savedConnectionIds: alreadySaved
            ? prev.savedConnectionIds
            : [requestId, ...prev.savedConnectionIds],
          user: {
            ...prev.user,
            impactScore: alreadySaved ? prev.user.impactScore : prev.user.impactScore + 3,
          },
          activities: alreadySaved
            ? prev.activities
            : [
                {
                  id: `act-${Date.now()}`,
                  title: `Offered Support for ${target.bloodGroup} Request`,
                  detail: `Connected with ${target.hospital} (${target.patientReference}).`,
                  timestamp: 'Just now',
                  type: 'connection',
                },
                ...prev.activities,
              ],
        };
      });
      addToast(
        'Support Offer Logged',
        'Hospital coordinator contact info is available in the request details.',
        'success'
      );
    },
    [addToast]
  );

  const updateRequestStatus = useCallback(
    (requestId: string, status: BloodRequest['status']) => {
      setPersisted((prev) => ({
        ...prev,
        requests: prev.requests.map((r) => (r.id === requestId ? { ...r, status } : r)),
      }));
      addToast('Request Updated', `Request status changed to ${status}.`, 'info');
    },
    [addToast]
  );

  const contactDonor = useCallback(
    (donor: Donor) => {
      setPersisted((prev) => {
        const alreadySaved = prev.savedConnectionIds.includes(donor.id);
        return {
          ...prev,
          savedConnectionIds: alreadySaved
            ? prev.savedConnectionIds
            : [donor.id, ...prev.savedConnectionIds],
          activities: [
            {
              id: `act-${Date.now()}`,
              title: `Requested Connection with ${donor.name}`,
              detail: `${donor.bloodGroup} demo donor in ${donor.area}, ${donor.city}.`,
              timestamp: 'Just now',
              type: 'connection',
            },
            ...prev.activities,
          ],
        };
      });
      addToast(
        'Connection Logged',
        `Demo outreach to ${donor.name} (${donor.bloodGroup}) saved to your activity log.`,
        'success'
      );
    },
    [addToast]
  );

  const markNotificationRead = useCallback((id: string) => {
    setPersisted((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setPersisted((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        route,
        navigate,
        donors: persisted.donors,
        requests: persisted.requests,
        hospitals: INITIAL_HOSPITALS,
        user: persisted.user,
        notifications: persisted.notifications,
        activities: persisted.activities,
        savedConnectionIds: persisted.savedConnectionIds,
        donorFilter,
        setDonorFilter,
        toasts,
        addToast,
        dismissToast,
        authModal,
        openAuthModal,
        closeAuthModal,
        createRequestOpen,
        openCreateRequest,
        closeCreateRequest,
        selectedDonor,
        setSelectedDonor,
        selectedRequest,
        setSelectedRequest,
        legalModal,
        setLegalModal,
        loginUser,
        logoutUser,
        registerDonor,
        toggleUserAvailability,
        updateUserProfile,
        addBloodRequest,
        respondToRequest,
        updateRequestStatus,
        contactDonor,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
