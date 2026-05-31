import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';
import {
  LayoutDashboard, FileText, CreditCard, QrCode, User,
  Users, BarChart3, Bus, MapPin, Clock, Truck,
  ChevronLeft, ChevronRight, LogOut, Bell, Menu, X,
  ScanLine
} from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
}

const menuItems: Record<UserRole, { label: string; icon: typeof LayoutDashboard; path: string }[]> = {
  student: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/student' },
    { label: 'Inscription', icon: FileText, path: '/student/inscription' },
    { label: 'Mes abonnements', icon: Clock, path: '/student/abonnements' },
    { label: 'Paiements', icon: CreditCard, path: '/student/paiements' },
    { label: 'Mon badge', icon: QrCode, path: '/student/badge' },
    { label: 'Notifications', icon: Bell, path: '/student/notifications' },
    { label: 'Profil', icon: User, path: '/student/profil' },
  ],
  admin: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/admin' },
    { label: 'Inscriptions', icon: FileText, path: '/admin/inscriptions' },
    { label: 'Etudiants', icon: Users, path: '/admin/etudiants' },
    { label: 'Paiements', icon: CreditCard, path: '/admin/paiements' },
    { label: 'Rapports', icon: BarChart3, path: '/admin/rapports' },
    { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
  ],
  responsible: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/responsible' },
    { label: 'Lignes', icon: Bus, path: '/responsible/lignes' },
    { label: 'Arrets', icon: MapPin, path: '/responsible/arrets' },
    { label: 'Bus', icon: Bus, path: '/responsible/bus' },
    { label: 'Trajets', icon: Clock, path: '/responsible/trajets' },
    { label: 'Chauffeurs', icon: Truck, path: '/responsible/chauffeurs' },
    { label: 'Notifications', icon: Bell, path: '/responsible/notifications' },
  ],
  driver: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/driver' },
    { label: 'Planning', icon: Clock, path: '/driver/planning' },
    { label: 'Passagers', icon: Users, path: '/driver/passagers' },
    { label: 'Verification badge', icon: ScanLine, path: '/driver/verification' },
    { label: 'Notifications', icon: Bell, path: '/driver/notifications' },
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const items = menuItems[role];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabels: Record<UserRole, string> = {
    student: 'Espace Etudiant',
    admin: 'Espace Administration',
    responsible: 'Espace Responsable',
    driver: 'Espace Chauffeur',
  };

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bus className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold text-gray-900">TransCampus</h2>
              <p className="text-xs text-gray-500">{roleLabels[role]}</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `/${role}`}
            className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-700">
                {user.prenom[0]}{user.nom[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.prenom} {user.nom}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-error-600 hover:bg-error-50 transition-all duration-200 text-sm font-medium w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Deconnexion</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all hidden lg:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex bg-white border-r border-gray-200 flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50 lg:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}

export function TopBar() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const role = user?.role || 'student';
  const notifPath = `/${role}/notifications`;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <MobileMenuButton />
        <h1 className="text-base lg:text-lg font-semibold text-gray-900 hidden sm:block">
          Gestion du Transport Universitaire
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <button onClick={() => { setShowNotifications(false); navigate(notifPath); }} className="text-xs text-primary-600 hover:text-primary-700 font-medium">Voir tout</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => { setShowNotifications(false); navigate(notifPath); }}>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-700">Votre dossier est en cours de traitement</p>
                      <p className="text-xs text-gray-400 mt-1">Il y a 2 heures</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-gray-50 cursor-pointer" onClick={() => { setShowNotifications(false); navigate(notifPath); }}>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-700">Changement d'horaire Ligne A</p>
                      <p className="text-xs text-gray-400 mt-1">Il y a 1 jour</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {user && (
          <button onClick={() => navigate(`/${role}/profil`)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-700">
                {user.prenom[0]}{user.nom[0]}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">{user.prenom} {user.nom}</span>
          </button>
        )}
      </div>
    </header>
  );
}

function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handle = () => setIsOpen(false);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  return (
    <button
      onClick={() => {
        setIsOpen(!isOpen);
        window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'));
      }}
      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all lg:hidden"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
