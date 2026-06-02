import { useEffect, useState } from 'react';
import { Bus, Clock, Users, MapPin } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function DriverDashboard() {
  const [trajets, setTrajets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setLoading(true);
    // Appel direct à l'endpoint driver
    axiosClient.get('/driver/trajets')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setTrajets(data);
      })
      .catch((err) => {
        console.error('Driver trajets error:', err);
        setError('Erreur lors du chargement des trajets');
      })
      .finally(() => setLoading(false));

    // Récupérer le profil du chauffeur
    axiosClient.get('/profile')
      .then((res) => {
        const u = res.data;
        setUserName(`${u.prenom ?? ''} ${u.nom ?? ''}`.trim());
      })
      .catch(() => {});
  }, []);

  const totalPlaces = trajets.reduce((sum, t) => sum + (t.placesDisponibles ?? 0), 0);
  const trajetsParSemaine = trajets.length > 0
    ? trajets.reduce((sum, t) => sum + (t.joursSemaine?.length ?? 0), 0)
    : 0;

  if (loading) return (
    <div className="flex justify-center items-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord chauffeur</h1>
        <p className="text-gray-600 mt-1">Bienvenue, {userName || 'Mohamed Hadj'}</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{trajets.length}</p>
              <p className="text-sm text-gray-500">Trajets assignes</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalPlaces}</p>
              <p className="text-sm text-gray-500">Places totales</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{trajetsParSemaine}</p>
              <p className="text-sm text-gray-500">Trajets / semaine</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trajets du jour */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Trajets du jour</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {trajets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bus className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p>Aucun trajet assigné pour le moment</p>
            </div>
          ) : (
            trajets.map((trajet) => (
              <div key={trajet.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                      <Bus className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {trajet.ligneNom ?? trajet.ligne?.nom ?? 'Ligne inconnue'}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        Bus {trajet.busImmatriculation ?? trajet.bus?.immatriculation ?? 'N/A'}
                      </div>
                    </div>
                  </div>
                  <span className="badge-info">Planifie</span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{trajet.heureDepart}</p>
                      <p className="text-xs text-gray-500">Depart</p>
                    </div>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{trajet.heureArrivee}</p>
                      <p className="text-xs text-gray-500">Arrivee</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex gap-1 flex-wrap">
                    {(trajet.joursSemaine ?? []).map((j: string) => (
                      <span key={j} className="px-1.5 py-0.5 bg-primary-50 text-primary-700 text-xs rounded font-medium">
                        {j}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{trajet.placesDisponibles} places</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}