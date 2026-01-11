import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DaftarKasus from './components/cases/DaftarKasus';
import DetailKasus from './components/cases/DetailKasus';
import TambahKasus from './components/cases/TambahKasus';
import DataKlien from './components/clients/DataKlien';
import TimInternal from './components/team/TimInternal';
import DokumenArsip from './components/documents/DokumenArsip';
import TugasAktivitas from './components/tasks/TugasAktivitas';
import KalenderJadwal from './components/calendar/KalenderJadwal';
import StatistikLaporan from './components/reports/StatistikLaporan';
import PengaturanSistem from './components/settings/PengaturanSistem';
import AuditKeamanan from './components/audit/AuditKeamanan';
import BantuanInfo from './components/help/BantuanInfo';
import api from './lib/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authPage, setAuthPage] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [caseFilter, setCaseFilter] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      setUserName(JSON.parse(user).name);
    }
  }, []);

  const handleLogin = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    setCurrentPage('dashboard');
    setAuthPage('login');
  };

  const handleNavigate = (page: string, caseId?: string, filter?: string) => {
    setCurrentPage(page);
    if (caseId) {
      setSelectedCaseId(caseId);
    }
    if (filter) {
      setCaseFilter(filter);
    } else {
      setCaseFilter(undefined);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        {authPage === 'login' && (
          <Login
            onLogin={handleLogin}
            onNavigateToRegister={() => setAuthPage('register')}
            onNavigateToForgotPassword={() => setAuthPage('forgot-password')}
          />
        )}
        {authPage === 'register' && (
          <Register onBackToLogin={() => setAuthPage('login')} />
        )}
        {authPage === 'forgot-password' && (
          <ForgotPassword onBackToLogin={() => setAuthPage('login')} />
        )}
        <Toaster position="top-right" />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard userName={userName} onNavigate={handleNavigate} />;
      case 'daftar-kasus':
        return <DaftarKasus onNavigate={handleNavigate} initialFilter={caseFilter} />;
      case 'detail-kasus':
        return <DetailKasus caseId={selectedCaseId} onNavigate={handleNavigate} />;
      case 'tambah-kasus':
        return <TambahKasus onNavigate={handleNavigate} />;
      case 'data-klien':
        return <DataKlien />;
      case 'tim-internal':
        return <TimInternal />;
      case 'dokumen-arsip':
        return <DokumenArsip />;
      case 'tugas-aktivitas':
        return <TugasAktivitas />;
      case 'kalender-jadwal':
        return <KalenderJadwal />;
      case 'statistik-laporan':
        return <StatistikLaporan />;
      case 'pengaturan-sistem':
        return <PengaturanSistem userName={userName} />;
      case 'audit-keamanan':
        return <AuditKeamanan />;
      case 'bantuan-info':
        return <BantuanInfo />;
      default:
        return <Dashboard userName={userName} onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Layout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userName={userName}
      >
        {renderPage()}
      </Layout>
      <Toaster position="top-right" />
    </>
  );
}