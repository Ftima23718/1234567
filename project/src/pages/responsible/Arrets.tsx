import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { fetchArrets, fetchLignes } from '../../services/transport';
import { useToast } from '../../components/ui/useToast';

export default function ResponsibleArrets() {
  const [showModal, setShowModal] = useState(false);
  const [filterLigne, setFilterLigne] = useState('all');
  const [lignes, setLignes] = useState<any[]>([]);
  const [arrets, setArrets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [form, setForm] = useState({ nom: '', adresse: '', ligneId: '', ordre: '1' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetchLignes()
      .then((lig) => {
        const lineData = Array.isArray(lig) ? lig : lig.content ?? [];
        setLignes(lineData);
        return Promise.all(lineData.map((ligne: any) => fetchArrets(ligne.id)));
      })
      .then((all) => setArrets(all.flat()))
      .catch(() => {
        setLignes([]);
        setArrets([]);
      });
  };

  const filtered = filterLigne === 'all' ? arrets : arrets.filter((a) => a.ligneId === filterLigne);

  const handleAdd = async () => {
    if (!form.nom || !form.ligneId) {
      toast('warning', 'Nom et ligne sont obligatoires');
      return;
    }
    setLoadingAdd(true);
    try {
      await axiosClient.post('/admin/arrets', {
        nom: form.nom,
        adresse: form.adresse || '',
        ligneId: form.ligneId,
        ordre: parseInt(form.ordre) || 1,
      });
      toast('success', 'Arrêt ajouté avec succès');
      setShowModal(false);
      setForm({ nom: '', adresse: '', ligneId: '', ordre: '1' });
      // Recharger
      fetchLignes().then((lig: any[]) => {
        setLignes(lig || []);
        Promise.all((lig || []).map((l: any) =>
          axiosClient.get(`/lignes/${l.id}/arrets`).then(r => r.data).catch(() => [])
        )).then(all => setArrets((all as any[][]).flat()));
      });
    } catch (err: any) {
      toast('error', err?.response?.data?.message || 'Erreur lors de l\'ajout de l\'arret');
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des arrets</h1>
          <p className="text-gray-600 mt-1">Ajoutez et modifiez les arrets sur les lignes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvel arret
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setFilterLigne('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterLigne === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>Toutes les lignes</button>
        {lignes.map((l) => (
          <button key={l.id} onClick={() => setFilterLigne(l.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterLigne === l.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{l.nom}</button>
        ))}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3">Ordre</th>
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">Adresse</th>
                <th className="px-5 py-3">Ligne</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.sort((a, b) => a.ordre - b.ordre).map((arret) => (
                <tr key={arret.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-700">{arret.ordre}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      <span className="text-sm font-medium text-gray-900">{arret.nom}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{arret.adresse}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{lignes.find((l) => l.id === arret.ligneId)?.nom || '-'}</td>
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
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Nouvel arret</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'arret</label>
                <input className="input-field" placeholder="Ex: Place de la Gare"
                  value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input className="input-field" placeholder="Adresse complete"
                  value={form.adresse} onChange={e => setForm(p => ({ ...p, adresse: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ligne</label>
                  <select className="input-field" value={form.ligneId}
                    onChange={e => setForm(p => ({ ...p, ligneId: e.target.value }))}>
                    <option value="">Choisir une ligne</option>
                    {lignes.filter((l) => l.estActive).map((l) => (
                      <option key={l.id} value={l.id}>{l.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
                  <input type="number" className="input-field" placeholder="1" min={1}
                    value={form.ordre} onChange={e => setForm(p => ({ ...p, ordre: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <button onClick={() => setShowModal(false)} className="btn-ghost flex-1" disabled={loadingAdd}>Annuler</button>
                <button onClick={handleAdd} disabled={loadingAdd} className="btn-primary flex-1">
                  {loadingAdd ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
