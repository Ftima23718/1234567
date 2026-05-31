import { useEffect, useState } from 'react';
import { Bus, MapPin, Users } from 'lucide-react';
import { fetchLignes, fetchTrajets } from '../../services/transport';

export default function DriverPlanning() {
  const [myTrajets, setMyTrajets] = useState<any[]>([]);

  useEffect(() => {
    fetchLignes().then((lignes) => Promise.all((lignes || []).map((ligne: any) => fetchTrajets(ligne.id)))).then((all) => setMyTrajets(all.flat())).catch(() => setMyTrajets([]));
  }, []);
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const dayLabels: Record<string, string> = { Lun: 'Lundi', Mar: 'Mardi', Mer: 'Mercredi', Jeu: 'Jeudi', Ven: 'Vendredi', Sam: 'Samedi', Dim: 'Dimanche' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Planning hebdomadaire</h1>
        <p className="text-gray-600 mt-1">Vos trajets planifies pour la semaine</p>
      </div>

      <div className="grid gap-4">
        {days.map(day => {
          const trajetsDuJour = myTrajets.filter(t => t.joursSemaine.includes(day));
          if (trajetsDuJour.length === 0) return null;
          return (
            <div key={day} className="card">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{day}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{dayLabels[day]}</h3>
                  <p className="text-xs text-gray-500">{trajetsDuJour.length} trajet(s)</p>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {trajetsDuJour.map(trajet => (
                  <div key={trajet.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className="text-center min-w-[60px]">
                      <p className="text-lg font-bold text-primary-600">{trajet.heureDepart}</p>
                      <p className="text-xs text-gray-400">depart</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Bus className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-medium text-gray-900">{trajet.ligneNom}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Bus {trajet.busImmatriculation}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {trajet.placesDisponibles} places</span>
                      </div>
                    </div>
                    <div className="text-center min-w-[60px]">
                      <p className="text-lg font-bold text-accent-600">{trajet.heureArrivee}</p>
                      <p className="text-xs text-gray-400">arrivee</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
