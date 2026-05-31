import { Users, Bus, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchAllInscriptions, fetchLignes, fetchTrajets } from '../../services/transport';

export default function DriverPassagers() {
  const [myTrajets, setMyTrajets] = useState<any[]>([]);
  const [selectedTrajet, setSelectedTrajet] = useState('');
  const [activeInscriptions, setActiveInscriptions] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([fetchLignes(), fetchAllInscriptions()])
      .then(([lignes, ins]) => {
        setActiveInscriptions(Array.isArray(ins) ? ins.filter((i: any) => i.statut === 'VALIDEE' && i.paiementStatut === 'PAYE') : []);
        return Promise.all((lignes || []).map((ligne: any) => fetchTrajets(ligne.id)));
      })
      .then((all) => {
        const trajets = all.flat();
        setMyTrajets(trajets);
        setSelectedTrajet(trajets[0]?.id || '');
      })
      .catch(() => {
        setMyTrajets([]);
        setActiveInscriptions([]);
      });
  }, []);

  // Simulated passengers for selected trajet
  const passagers = activeInscriptions.filter(i =>
    myTrajets.find(t => t.id === selectedTrajet)?.ligneId === i.ligneId
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Liste des passagers</h1>
        <p className="text-gray-600 mt-1">Consultez les passagers inscrits sur vos trajets</p>
      </div>

      {/* Trajet selector */}
      <div className="card p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Selectionner un trajet</label>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {myTrajets.map(trajet => (
            <button
              key={trajet.id}
              onClick={() => setSelectedTrajet(trajet.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedTrajet === trajet.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Bus className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-gray-900">{trajet.ligneNom}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{trajet.heureDepart} - {trajet.heureArrivee}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Bus {trajet.busImmatriculation}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Passengers list */}
      <div className="card">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Passagers inscrits</h2>
            <span className="badge-info">{passagers.length}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3">Etudiant</th>
                <th className="px-5 py-3">Arret</th>
                <th className="px-5 py-3">Abonnement</th>
                <th className="px-5 py-3">Validite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {passagers.map((ins) => (
                <tr key={ins.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary-700">{ins.etudiantPrenom[0]}{ins.etudiantNom[0]}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{ins.etudiantPrenom} {ins.etudiantNom}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{ins.arretNom}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{ins.typeAbonnement === 'MENSUEL' ? 'Mensuel' : ins.typeAbonnement === 'SEMESTRIEL' ? 'Semestriel' : 'Annuel'}</td>
                  <td className="px-5 py-4">
                    <span className="badge-success">Valide</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {passagers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun passager inscrit sur ce trajet</p>
          </div>
        )}
      </div>
    </div>
  );
}
