/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { FindDonorsPage } from './components/FindDonorsPage';
import { BloodRequestsPage } from './components/BloodRequestsPage';
import { HospitalsPage } from './components/HospitalsPage';
import { AboutPage } from './components/AboutPage';
import { RegisterDonorPage } from './components/RegisterDonorPage';
import { DashboardPage } from './components/DashboardPage';
import {
  AuthModal,
  CreateRequestModal,
  DonorContactModal,
  LegalContactModal,
  RequestDetailModal,
  ToastContainer,
} from './components/Modals';

const AppShell: React.FC = () => {
  const { route } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7FF] text-[#171C3A]">
      <Navbar />

      <div className="flex-1">
        {route === 'home' && <HomePage />}
        {route === 'donors' && <FindDonorsPage />}
        {route === 'requests' && <BloodRequestsPage />}
        {route === 'hospitals' && <HospitalsPage />}
        {route === 'about' && <AboutPage />}
        {route === 'register' && <RegisterDonorPage />}
        {route === 'dashboard' && <DashboardPage />}
      </div>

      <Footer />

      <AuthModal />
      <CreateRequestModal />
      <DonorContactModal />
      <RequestDetailModal />
      <LegalContactModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
