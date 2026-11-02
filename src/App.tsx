import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlatformProvider } from './context/PlatformContext';
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AIWorkspacePage from './pages/AIWorkspace/AIWorkspacePage';
import DocumentsPage from './pages/Documents/DocumentsPage';
import FinancialToolsPage from './pages/FinancialTools/FinancialToolsPage';
import ClientsPage from './pages/Clients/ClientsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import CompliancePage from './pages/Compliance/CompliancePage';
import SettingsPage from './pages/Settings/SettingsPage';

function App() {
  return (
    <PlatformProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected App Routes */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="ai" element={<AIWorkspacePage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="tools" element={<FinancialToolsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="compliance" element={<CompliancePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PlatformProvider>
  );
}

export default App;
