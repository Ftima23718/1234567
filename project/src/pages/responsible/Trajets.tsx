import { useEffect, useState } from 'react';
import { Clock, Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { fetchBus, fetchChauffeurs, fetchLignes, fetchTrajets } from '../../services/transport';

export default function ResponsibleTrajets() {
  const [showModal, setShowModal] = useState(false);
  const [filterLigne, setFilterLigne] = useState('all');
  const [lignes, setLignes] = useState<any[]>([]);
  const [busList, setBusList] = useState<any[]>([]);
  const [chauffeurs, setChauffeurs] = useState<any[]>([]);
  const [trajets, setTrajets] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([fetchLignes(), fetchBus(), fetchChauffeurs()])
      .then(([lig, bus, ch]) => {
        const lineData = Array.isArray(lig) ? lig : lig.content ?? [];
        setLignes(lineData);
        setBusList(Array.isArray(bus) ? bus : bus.content ?? []);
        setChauffeurs(Array.isArray(ch) ? ch : ch.content ?? []);
        return Promise.all(lineData.map((ligne: any) => fetchTrajets(ligne.id)));
      })
      .then((all) => setTrajets(all.flat()))
      .catch(() => {
        setLignes([]);
        setBusList([]);
        setChauffeurs([]);
        setTrajets([]);
      });
  }, []);

  const filtered = filterLigne === 'all' ? trajets : trajets.filter((t) => t.ligneId === filterLigne);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des trajets</h1>
          <p className="text-gray-600 mt-1">Planifiez et organisez les trajets hebdomadaires</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau trajet
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setFilterLigne('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterLigne === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>Toutes</button>
        {lignes.filter((l) => l.estActive).map((l) => (
          <button key={l.id} onClick={() => setFilterLigne(l.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterLigne === l.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{l.nom}</button>
        ))}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3">Ligne</th>
                <th className="px-5 py-3">Bus</th>
                <th className="px-5 py-3">Chauffeur</th>
                <th className="px-5 py-3">Depart</th>
                <th className="px-5 py-3">Arrivee</th>
                <th className="px-5 py-3">Jours</th>
                <th className="px-5 py-3">Places dispo.</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((trajet) => (
                <tr key={trajet.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      <span className="text-sm font-medium text-gray-900">{trajet.ligneNom}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 font-mono">{trajet.busImmatriculation}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{trajet.chauffeurNom}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-900">{trajet.heureDepart}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-900">{trajet.heureArrivee}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      {trajet.joursSemaine.map((j: string) => (
                        <span key={j} className="px-1.5 py-0.5 bg-primary-50 text-primary-700 text-xs rounded font-medium">{j}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">{trajet.placesDisponibles}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun trajet planifie pour cette ligne</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Nouveau trajet</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ligne</label>
                <select className="input-field">
                  <option value="">Choisir une ligne</option>
                  {lignes.filter((l) => l.estActive).map((l) => (
                    <option key={l.id} value={l.id}>{l.nom}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bus</label>
                  <select className="input-field">
                    <option value="">Choisir un bus</option>
                    {busList.filter((b) => b.statut === 'ACTIF').map((b) => (
                      <option key={b.id} value={b.id}>{b.immatriculation} ({b.marque})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chauffeur</label>
                  <select className="input-field">
                    <option value="">Choisir un chauffeur</option>
                    {chauffeurs.map((c) => (
                      <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure depart</label>
                  <input type="time" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure arrivee</label>
                  <input type="time" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jours de circulation</label>
                <div className="flex gap-2">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(j => (
                    <label key={j} className="flex items-center gap-1">
                      <input type="checkbox" defaultChecked={j !== 'Sam' && j !== 'Dim'} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="text-sm text-gray-700">{j}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <button onClick={() => setShowModal(false)} className="btn-ghost flex-1">Annuler</button>
                <button onClick={() => setShowModal(false)} className="btn-primary flex-1">Creer le trajet</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
