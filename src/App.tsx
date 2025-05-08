import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import InterventionList from './pages/interventions/InterventionList';
import InterventionForm from './pages/interventions/InterventionForm';
import Reports from './pages/reports/Reports';
import SiteForm from './pages/sites/SiteForm';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Routes des interventions */}
              <Route path="/interventions" element={<InterventionList />} />
              <Route path="/interventions/new" element={<InterventionForm />} />
              <Route path="/interventions/:id/edit" element={<InterventionForm />} />
              
              {/* Routes des rapports */}
              <Route path="/reports" element={<Reports />} />

              {/* Routes des sites */}
              <Route path="/sites/new" element={<SiteForm />} />
              <Route path="/sites/:id/edit" element={<SiteForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
