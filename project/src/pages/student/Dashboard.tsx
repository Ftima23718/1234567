import { useEffect, useMemo, useState } from 'react';
import { Bus, CreditCard, QrCode, Clock, FileText, CheckCircle } from 'lucide-react';
import { formatDate, getStatutColor, getStatutLabel, getTypeAbonnementLabel } from '../../utils/format';
import { Link } from 'react-router-dom';
import { fetchMyInscriptions, fetchNotifications } from '../../services/transport';
import { useAuth } from '../../hooks/useAuthContext';
import axiosClient from '../../api/axiosClient';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [myInscriptions, setMyInscriptions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetchMyInscriptions(),
      fetchNotifications(),
      axiosClient.get('/dashboard/student')
    ])
      .then(([ins, notif, dashRes]) => {
        setMyInscriptions(Array.isArray(ins) ? ins : []);
        setNotifications(Array.isArray(notif) ? notif : []);
        setDashboard(dashRes.data || null);
      })
      .catch((err) => {
        console.error('Error fetching dashboard data:', err);
        setMyInscriptions([]);
        setNotifications([]);
      });
  }, []);

  const activeInscriptions = useMemo(() => myInscriptions.filter(i => i.statut === 'VALIDEE'), [myInscriptions]);
  const pendingInscriptions = useMemo(() => myInscriptions.filter(i => i.statut === 'EN_ATTENTE'), [myInscriptions]);
  const unreadNotifications = useMemo(() => notifications.filter((n: any) => !n.estLue), [notifications]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">Bienvenue, {user?.prenom || 'étudiant'}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.totalInscriptions ?? myInscriptions.length}</p>
              <p className="text-sm text-gray-500">Total inscriptions</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.inscriptionsValidees ?? activeInscriptions.length}</p>
              <p className="text-sm text-gray-500">Inscriptions validees</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.inscriptionsEnAttente ?? pendingInscriptions.length}</p>
              <p className="text-sm text-gray-500">En attente</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{dashboard?.lignesActives ?? 0}</p>
              <p className="text-sm text-gray-500">Lignes actives</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mes inscriptions recentes */}
        <div className="lg:col-span-2 card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Mes inscriptions recentes</h2>
            <Link to="/student/abonnements" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Voir tout</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {myInscriptions.slice(0, 4).map((ins) => (
              <div key={ins.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Bus className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ins.ligneNom}</p>
                    <p className="text-xs text-gray-500">{getTypeAbonnementLabel(ins.typeAbonnement)} - {formatDate(ins.dateDebut)}</p>
                  </div>
                </div>
                <span className={getStatutColor(ins.statut)}>{getStatutLabel(ins.statut)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides & notifications */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <Link to="/student/inscription" className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <FileText className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">Nouvelle inscription</span>
              </Link>
              <Link to="/student/badge" className="flex items-center gap-3 p-3 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors">
                <QrCode className="w-5 h-5 text-accent-600" />
                <span className="text-sm font-medium text-accent-700">Telecharger badge</span>
              </Link>
              <Link to="/student/paiements" className="flex items-center gap-3 p-3 bg-success-50 rounded-lg hover:bg-success-100 transition-colors">
                <CreditCard className="w-5 h-5 text-success-600" />
                <span className="text-sm font-medium text-success-700">Voir paiements</span>
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {unreadNotifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-2">
                    {!notif.estLue && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></div>}
                    <p className="text-sm text-gray-700">{notif.message}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-4">{formatDate(notif.dateEnvoi)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
