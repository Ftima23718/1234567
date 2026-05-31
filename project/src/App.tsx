import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './components/ui/Toast';
import DashboardLayout, { PublicLayout } from './components/Layout';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentInscription from './pages/student/Inscription';
import StudentAbonnements from './pages/student/Abonnements';
import StudentBadge from './pages/student/Badge';
import StudentPaiements from './pages/student/Paiements';
import StudentProfil from './pages/student/Profil';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminInscriptions from './pages/admin/Inscriptions';
import AdminEtudiants from './pages/admin/Etudiants';
import AdminPaiements from './pages/admin/Paiements';
import AdminRapports from './pages/admin/Rapports';

// Responsible pages
import ResponsibleDashboard from './pages/responsible/Dashboard';
import ResponsibleLignes from './pages/responsible/Lignes';
import ResponsibleArrets from './pages/responsible/Arrets';
import ResponsibleBus from './pages/responsible/Bus';
import ResponsibleTrajets from './pages/responsible/Trajets';
import ResponsibleChauffeurs from './pages/responsible/Chauffeurs';

// Driver pages
import DriverDashboard from './pages/driver/Dashboard';
import DriverPlanning from './pages/driver/Planning';
import DriverPassagers from './pages/driver/Passagers';
import DriverVerification from './pages/driver/Verification';

// Shared pages
import NotificationsPage from './pages/shared/Notifications';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Student routes */}
            <Route path="/student" element={<DashboardLayout requiredRole="student" />}>
              <Route index element={<StudentDashboard />} />
              <Route path="inscription" element={<StudentInscription />} />
              <Route path="abonnements" element={<StudentAbonnements />} />
              <Route path="badge" element={<StudentBadge />} />
              <Route path="paiements" element={<StudentPaiements />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profil" element={<StudentProfil />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<DashboardLayout requiredRole="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="inscriptions" element={<AdminInscriptions />} />
              <Route path="etudiants" element={<AdminEtudiants />} />
              <Route path="paiements" element={<AdminPaiements />} />
              <Route path="rapports" element={<AdminRapports />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>

            {/* Responsible routes */}
            <Route path="/responsible" element={<DashboardLayout requiredRole="responsible" />}>
              <Route index element={<ResponsibleDashboard />} />
              <Route path="lignes" element={<ResponsibleLignes />} />
              <Route path="arrets" element={<ResponsibleArrets />} />
              <Route path="bus" element={<ResponsibleBus />} />
              <Route path="trajets" element={<ResponsibleTrajets />} />
              <Route path="chauffeurs" element={<ResponsibleChauffeurs />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>

            {/* Driver routes */}
            <Route path="/driver" element={<DashboardLayout requiredRole="driver" />}>
              <Route index element={<DriverDashboard />} />
              <Route path="planning" element={<DriverPlanning />} />
              <Route path="passagers" element={<DriverPassagers />} />
              <Route path="verification" element={<DriverVerification />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
