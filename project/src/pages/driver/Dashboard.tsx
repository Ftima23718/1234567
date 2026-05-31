import { useEffect, useState } from 'react';
import { Bus, Clock, Users, MapPin } from 'lucide-react';
import { fetchLignes, fetchTrajets } from '../../services/transport';

export default function DriverDashboard() {
  const [myTrajets, setMyTrajets] = useState<any[]>([]);

  useEffect(() => {
    fetchLignes().then((lignes) => Promise.all((lignes || []).map((ligne: any) => fetchTrajets(ligne.id)))).then((all) => {
      setMyTrajets(all.flat());
    }).catch(() => setMyTrajets([]));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord chauffeur</h1>
        <p className="text-gray-600 mt-1">Bienvenue, Mohamed Hadj</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{myTrajets.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{myTrajets.reduce((s, t) => s + t.placesDisponibles, 0)}</p>
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
              <p className="text-2xl font-bold text-gray-900">{myTrajets.length * 5}</p>
              <p className="text-sm text-gray-500">Trajets / semaine</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's schedule */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Trajets du jour</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {myTrajets.map((trajet) => (
            <div key={trajet.id} className="p-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Bus className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{trajet.ligneNom}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      Bus {trajet.busImmatriculation}
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
                <div className="flex-1 h-0.5 bg-gray-200 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent-500 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{trajet.heureArrivee}</p>
                    <p className="text-xs text-gray-500">Arrivee</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex gap-1">
                  {trajet.joursSemaine.map((j: string) => (
                    <span key={j} className="px-1.5 py-0.5 bg-primary-50 text-primary-700 text-xs rounded font-medium">{j}</span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">{trajet.placesDisponibles} places disponibles</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
