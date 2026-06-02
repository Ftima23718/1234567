import { useEffect, useState } from 'react';
import { Bus, Plus, Edit2, Trash2, MapPin, ArrowRight } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { fetchArrets, fetchBus, fetchLignes } from '../../services/transport';
import { useToast } from '../../components/ui/useToast';

export default function ResponsibleLignes() {
  const [showModal, setShowModal] = useState(false);
  const [selectedLigne, setSelectedLigne] = useState<string | null>(null);
  const [lignes, setLignes] = useState<any[]>([]);
  const [arrets, setArrets] = useState<any[]>([]);
  const [busList, setBusList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [loadingAdd, setLoadingAdd] = useState(false);

  // Form state
  const [form, setForm] = useState({
    nom: '',
    description: '',
    pointDepart: '',
    pointArrivee: '',
    estActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    Promise.all([fetchLignes(), fetchBus()])
      .then(([lig, bus]) => {
        const lineData = Array.isArray(lig) ? lig : lig.content ?? [];
        setLignes(lineData);
        setBusList(Array.isArray(bus) ? bus : bus.content ?? []);
        return Promise.all(lineData.map((ligne: any) => fetchArrets(ligne.id)));
      })
      .then((all) => setArrets(all.flat()))
      .catch(() => {
        setLignes([]);
        setArrets([]);
        setBusList([]);
      });
  };

  const ligneDetail = lignes.find((l) => l.id === selectedLigne);
  const ligneArrets = arrets.filter((a) => a.ligneId === selectedLigne);
  const ligneBus = busList.filter((b) => b.ligneId === selectedLigne);

  const handleAdd = async () => {
    if (!form.nom || !form.pointDepart || !form.pointArrivee) {
      toast('warning', 'Nom, départ et arrivée sont obligatoires');
      return;
    }
    setLoadingAdd(true);
    try {
      await axiosClient.post('/admin/lignes', form);
      toast('success', 'Ligne créée avec succès');
      setShowModal(false);
      setForm({ nom: '', description: '', pointDepart: '', pointArrivee: '', estActive: true });
      axiosClient.get('/lignes').then(r => setLignes(Array.isArray(r.data) ? r.data : []));
    } catch (err: any) {
      toast('error', err?.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des lignes</h1>
          <p className="text-gray-600 mt-1">Creez, modifiez et supervisez les lignes de transport</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvelle ligne
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {lignes.map((ligne) => (
          <div key={ligne.id} className="card hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Bus className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{ligne.nom}</h3>
                    <p className="text-sm text-gray-500">{ligne.description}</p>
                  </div>
                </div>
                <span className={ligne.estActive ? 'badge-success' : 'badge-error'}>
                  {ligne.estActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{ligne.pointDepart}</span>
                <ArrowRight className="w-4 h-4" />
                <span>{ligne.pointArrivee}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-gray-900">{ligne.arretsCount}</p>
                  <p className="text-xs text-gray-500">Arrets</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-gray-900">{ligne.busCount}</p>
                  <p className="text-xs text-gray-500">Bus</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-gray-900">{ligne.estActive ? 'Oui' : 'Non'}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => setSelectedLigne(ligne.id)} className="btn-ghost text-sm flex-1">Details</button>
                <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedLigne && ligneDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLigne(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{ligneDetail.nom}</h2>
              <button onClick={() => setSelectedLigne(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">{ligneDetail.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4" /> {ligneDetail.pointDepart} → {ligneDetail.pointArrivee}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Arrets ({ligneArrets.length})</h3>
                <div className="space-y-2">
                  {ligneArrets.map((arret, i) => (
                    <div key={arret.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-700">{i + 1}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{arret.nom}</p>
                        <p className="text-xs text-gray-500">{arret.adresse}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Bus affectes ({ligneBus.length})</h3>
                <div className="space-y-2">
                  {ligneBus.map((bus) => (
                    <div key={bus.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{bus.immatriculation}</p>
                        <p className="text-xs text-gray-500">{bus.marque} {bus.modele}</p>
                      </div>
                      <span className={bus.statut === 'ACTIF' ? 'badge-success' : bus.statut === 'EN_MAINTENANCE' ? 'badge-pending' : 'badge-error'}>
                        {bus.statut === 'ACTIF' ? 'Actif' : bus.statut === 'EN_MAINTENANCE' ? 'Maintenance' : 'Hors service'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Nouvelle ligne</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la ligne</label>
                <input className="input-field" placeholder="Ex: Ligne E - Campus Nord"
                  value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input className="input-field" placeholder="Description du trajet"
                  value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Point de depart</label>
                  <input className="input-field" placeholder="Depart"
                    value={form.pointDepart} onChange={e => setForm(p => ({ ...p, pointDepart: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Point d'arrivee</label>
                  <input className="input-field" placeholder="Arrivee"
                    value={form.pointArrivee} onChange={e => setForm(p => ({ ...p, pointArrivee: e.target.value }))} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.estActive}
                  onChange={e => setForm(p => ({ ...p, estActive: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="active" className="text-sm text-gray-700">Ligne active</label>
              </div>
              <div className="flex gap-3 pt-3">
                <button onClick={() => setShowModal(false)} className="btn-ghost flex-1" disabled={loadingAdd}>Annuler</button>
                <button onClick={handleAdd} disabled={loadingAdd} className="btn-primary flex-1">
                  {loadingAdd ? 'Création...' : 'Créer la ligne'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
