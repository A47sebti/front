import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import TechnicianDashboard from './pages/dashboard/TechnicianDashboard';
import InterventionList from './pages/interventions/InterventionList';
import InterventionForm from './pages/interventions/InterventionForm';
import InterventionDetail from './pages/interventions/InterventionDetail';
import Reports from './pages/reports/Reports';
import SiteForm from './pages/sites/SiteForm';
import SiteList from './pages/sites/SiteList';
import { AuthProvider } from './context/AuthContext';
import './App.css';

interface ProtectedRouteProps {
  children: JSX.Element | ((role: string) => JSX.Element);
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    if (user?.role) {
      switch (user.role) {
        case 'ADMIN':
          return <Navigate to="/admin/dashboard" />;
        case 'GESTIONNAIRE':
          return <Navigate to="/manager/dashboard" />;
        case 'TECHNICIEN':
          return <Navigate to="/technician/dashboard" />;
        default:
          return <Navigate to="/login" />;
      }
    }
    return <Navigate to="/login" />;
  }

  if (typeof children === 'function') {
    return <>{children(user.role)}</>;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <Router>
            <div className="app">
              <Navbar />
              <main className="container">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  
                  <Route path="/" element={<Layout />}>
                    {/* Routes protégées */}
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Dashboard routes */}
                    <Route path="dashboard" element={
                      <ProtectedRoute allowedRoles={['ADMIN', 'GESTIONNAIRE', 'TECHNICIEN']}>
                        {(role) => {
                          switch (role) {
                            case 'ADMIN':
                              return <AdminDashboard />;
                            case 'GESTIONNAIRE':
                              return <ManagerDashboard />;
                            case 'TECHNICIEN':
                              return <TechnicianDashboard />;
                            default:
                              return <Navigate to="/login" replace />;
                          }
                        }}
                      </ProtectedRoute>
                    } />

                    {/* Sites routes */}
                    <Route path="sites" element={<ProtectedRoute allowedRoles={['ADMIN', 'GESTIONNAIRE']}>
                      <SiteList />
                    </ProtectedRoute>} />
                    <Route path="sites/new" element={
                      <ProtectedRoute allowedRoles={['ADMIN', 'GESTIONNAIRE']}>
                        <SiteForm />
                      </ProtectedRoute>
                    } />
                    <Route path="sites/:id/edit" element={
                      <ProtectedRoute allowedRoles={['ADMIN', 'GESTIONNAIRE']}>
                        <SiteForm />
                      </ProtectedRoute>
                    } />

                    {/* Interventions routes */}
                    <Route path="interventions" element={<ProtectedRoute allowedRoles={['ADMIN', 'GESTIONNAIRE', 'TECHNICIEN']}>
                      <InterventionList />
                    </ProtectedRoute>} />
                    <Route path="interventions/new" element={
                      <ProtectedRoute allowedRoles={['ADMIN', 'GESTIONNAIRE']}>
                        <InterventionForm />
                      </ProtectedRoute>
                    } />
                    <Route path="interventions/:id" element={
                      <ProtectedRoute allowedRoles={['ADMIN', 'GESTIONNAIRE', 'TECHNICIEN']}>
                        <InterventionDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="interventions/:id/edit" element={
                      <ProtectedRoute allowedRoles={['ADMIN', 'GESTIONNAIRE']}>
                        <InterventionForm />
                      </ProtectedRoute>
                    } />

                    {/* Routes communes avec restrictions de rôle */}
                    <Route
                      path="reports"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'GESTIONNAIRE']}>
                          <Reports />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
