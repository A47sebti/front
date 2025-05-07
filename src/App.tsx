import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Navbar from './components/layout/Navbar';
//import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
//import Dashboard from './pages/Dashboard';
//import InterventionList from './pages/interventions/InterventionList';
//import InterventionReport from './pages/interventions/InterventionReport';
//import AlertDashboard from './pages/alerts/AlertDashboard';
//import { AuthProvider } from './context/AuthContext';
import 'src/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Routes des interventions */}
              <Route path="/interventions" element={<InterventionList />} />
              <Route path="/interventions/:id/report" element={<InterventionReport />} />
              
              {/* Routes des alertes */}
              <Route path="/alerts" element={<AlertDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
