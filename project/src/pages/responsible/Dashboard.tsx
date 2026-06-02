import { useEffect, useState } from 'react';
import { Bus, MapPin, Users, AlertTriangle, Wrench } from 'lucide-react';
import { getStatutColor, getStatutLabel } from '../../utils/format';
import axiosClient from '../../api/axiosClient';

export default function ResponsibleDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [lignes, setLignes] = useState<any[]>([]);
  const [busList, setBusList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axiosClient.get('/dashboard/responsable'),
      axiosClient.get('/lignes'),
      axiosClient.get('/bus'),
    ])
      .then(([dashRes, lignesRes, busRes]) => {
        setStats(dashRes.data);
        setLignes(Array.isArray(lignesRes.data) ? lignesRes.data : lignesRes.data?.content ?? []);
        setBusList(Array.isArray(busRes.data) ? busRes.data : busRes.data?.content ?? []);
      })
      .catch((err) => {
        console.error('Dashboard responsable error:', err);
        setError('Erreur lors du chargement des données');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><p>Chargement...</p></div>;
  if (error) return <div className="text-error-600">{error}</div>;

  const activeLignes = lignes.filter((l) => l.estActive);
  const maintenanceBus = busList.filter((b) => b.statut === 'EN_MAINTENANCE');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord responsable transport</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble du reseau de transport</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.lignesActives ?? activeLignes.length}</p>
              <p className="text-sm text-gray-500">Lignes actives</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalBus ?? busList.length}</p>
              <p className="text-sm text-gray-500">Bus total</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{maintenanceBus.length}</p>
              <p className="text-sm text-gray-500">En maintenance</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalTrajets ?? 0}</p>
              <p className="text-sm text-gray-500">Trajets planifies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lignes overview */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Etat des lignes</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {lignes.length === 0 && <div className="p-5 text-gray-500">Aucune ligne disponible</div>}
          {lignes.map((ligne) => (
            <div key={ligne.id} className="p-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Bus className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{ligne.nom}</h3>
                    <p className="text-xs text-gray-500">{ligne.pointDepart} → {ligne.pointArrivee}</p>
                  </div>
                </div>
                <span className={ligne.estActive ? 'badge-success' : 'badge-error'}>
                  {ligne.estActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-sm font-bold text-gray-900">{ligne.arretsCount ?? 0}</p>
                  <p className="text-xs text-gray-500">Arrets</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-sm font-bold text-gray-900">{ligne.busCount ?? 0}</p>
                  <p className="text-xs text-gray-500">Bus</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-sm font-bold text-gray-900">{ligne.trajetsCount ?? 0}</p>
                  <p className="text-xs text-gray-500">Trajets</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bus alerts */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning-500" /> Alertes bus
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {busList.filter((b) => b.statut !== 'ACTIF').length === 0 && (
            <div className="p-5 text-gray-500">Aucune alerte</div>
          )}
          {busList.filter((b) => b.statut !== 'ACTIF').map((bus) => (
            <div key={bus.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bus.statut === 'EN_MAINTENANCE' ? 'bg-warning-100' : 'bg-error-100'}`}>
                  <Bus className={`w-5 h-5 ${bus.statut === 'EN_MAINTENANCE' ? 'text-warning-600' : 'text-error-600'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{bus.immatriculation} - {bus.marque} {bus.modele}</p>
                  <p className="text-xs text-gray-500">Capacite: {bus.capacite} places</p>
                </div>
              </div>
              <span className={getStatutColor(bus.statut)}>{getStatutLabel(bus.statut)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
