import { useEffect, useState } from 'react';
import { getInscriptions, validerInscription, rejeterInscription } from '../../api/apiService';
import { formatDate, getStatutColor, getStatutLabel, getTypeAbonnementLabel } from '../../utils/format';
import { CheckCircle, XCircle, Eye, Activity } from 'lucide-react';
import { useToast } from '../../components/ui/useToast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SearchBar from '../../components/ui/SearchBar';

export default function AdminInscriptions() {
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [validateDialog, setValidateDialog] = useState<string | null>(null);
  const [rejectMotif, setRejectMotif] = useState('');
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadInscriptions();
  }, []);

  const loadInscriptions = async () => {
    try {
      setLoading(true);
      const data = await getInscriptions();
      setInscriptions(Array.isArray(data) ? data : data.content ?? []);
    } catch (error) {
      console.error('Failed to load inscriptions:', error);
      toast('error', 'Failed to load inscriptions');
      setInscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id: string) => {
    try {
      setValidating(true);
      await validerInscription(id);
      setInscriptions(prev => prev.map(i => i.id === id ? { ...i, statut: 'VALIDEE' } : i));
      setValidateDialog(null);
      // notify other parts (paiements) that inscriptions changed
      try { window.dispatchEvent(new CustomEvent('inscription:changed', { detail: { id, statut: 'VALIDEE' } })); } catch (e) { /* noop */ }
      toast('success', 'Inscription validée avec succès. L\'étudiant doit maintenant effectuer le paiement.');
    } catch (error) {
      toast('error', 'Erreur lors de la validation');
    } finally {
      setValidating(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectMotif.trim()) {
      toast('warning', 'Veuillez saisir un motif de rejet');
      return;
    }
    try {
      setValidating(true);
      await rejeterInscription(id, rejectMotif);
      setInscriptions(prev => prev.map(i => i.id === id ? { ...i, statut: 'REJETEE', motifRejet: rejectMotif } : i));
      setRejectDialog(null);
      setRejectMotif('');
      try { window.dispatchEvent(new CustomEvent('inscription:changed', { detail: { id, statut: 'REJETEE' } })); } catch (e) { /* noop */ }
      toast('info', 'Inscription rejetée. L\'étudiant sera notifié par email.');
    } catch (error) {
      toast('error', 'Erreur lors du rejet');
    } finally {
      setValidating(false);
    }
  };

  const filtered = inscriptions
    .filter(i => filter === 'all' || i.statut === filter)
    .filter(i => search === '' || `${i.etudiant?.nom || ''} ${i.etudiant?.prenom || ''} ${i.ligne?.nom || ''}`.toLowerCase().includes(search.toLowerCase()));

  const selected = inscriptions.find(i => i.id === selectedId);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des inscriptions</h1>
        <div className="flex items-center justify-center h-96">
          <Activity className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des inscriptions</h1>
        <p className="text-gray-600 mt-1">Validez, rejetez et suivez les dossiers d'inscription</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-warning-50 border border-warning-200 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-warning-700">{inscriptions.filter(i => i.statut === 'EN_ATTENTE').length}</p>
          <p className="text-xs text-warning-600 font-medium">En attente</p>
        </div>
        <div className="bg-success-50 border border-success-200 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-success-700">{inscriptions.filter(i => i.statut === 'VALIDEE').length}</p>
          <p className="text-xs text-success-600 font-medium">Validées</p>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-error-700">{inscriptions.filter(i => i.statut === 'REJETEE').length}</p>
          <p className="text-xs text-error-600 font-medium">Rejetées</p>
        </div>
        <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-primary-700">{inscriptions.length}</p>
          <p className="text-xs text-primary-600 font-medium">Total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un étudiant..." />
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'Tous' },
            { value: 'EN_ATTENTE', label: 'En attente' },
            { value: 'VALIDEE', label: 'Validées' },
            { value: 'REJETEE', label: 'Rejetées' },
          ].map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.value ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-5 py-3">Étudiant</th>
                  <th className="px-5 py-3">Ligne</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length > 0 ? (
                  filtered.map((ins) => (
                    <tr key={ins.id} className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedId === ins.id ? 'bg-primary-50' : ''}`}
                      onClick={() => setSelectedId(ins.id)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary-700">{(ins.etudiant?.prenom || 'E')[0]}{(ins.etudiant?.nom || 'U')[0]}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{ins.etudiant?.prenom} {ins.etudiant?.nom}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{ins.ligne?.nom || 'N/A'}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{getTypeAbonnementLabel(ins.typeAbonnement)}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{formatDate(ins.dateInscription)}</td>
                      <td className="px-5 py-4"><span className={getStatutColor(ins.statut)}>{getStatutLabel(ins.statut)}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); setSelectedId(ins.id); }}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          {ins.statut === 'EN_ATTENTE' && (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); setValidateDialog(ins.id); }}
                                className="p-1.5 text-gray-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-all" title="Valider" disabled={validating}>
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setRejectDialog(ins.id); setRejectMotif(''); }}
                                className="p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all" title="Rejeter" disabled={validating}>
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center">
                      <p className="text-gray-500">Aucune inscription trouvée</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        <div className="card">
          {selected ? (
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Détail de l'inscription</h3>
                <span className={getStatutColor(selected.statut)}>{getStatutLabel(selected.statut)}</span>
              </div>

              {/* Student info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-700">{(selected.etudiant?.prenom || 'E')[0]}{(selected.etudiant?.nom || 'U')[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selected.etudiant?.prenom} {selected.etudiant?.nom}</p>
                  <p className="text-xs text-gray-500">ID: {selected.etudiant?.id}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Ligne</p>
                  <p className="text-sm font-medium text-gray-900">{selected.ligne?.nom || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Arrêt de prise</p>
                  <p className="text-sm font-medium text-gray-900">{selected.arret?.nom || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type d'abonnement</p>
                  <p className="text-sm font-medium text-gray-900">{getTypeAbonnementLabel(selected.typeAbonnement)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Date début</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(selected.dateDebut)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date fin</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(selected.dateFin)}</p>
                  </div>
                </div>
              </div>

              {selected.statut === 'EN_ATTENTE' && (
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <button onClick={() => setValidateDialog(selected.id)} className="w-full btn-success"
                    disabled={validating}>
                    ✓ Valider
                  </button>
                  <button onClick={() => { setRejectDialog(selected.id); setRejectMotif(''); }} className="w-full btn-danger"
                    disabled={validating}>
                    ✗ Rejeter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Sélectionnez une inscription</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        title="Valider l'inscription"
        message="Êtes-vous sûr de vouloir valider cette inscription ?"
        confirmText="Valider"
        cancelText="Annuler"
        isOpen={!!validateDialog}
        onConfirm={() => validateDialog && handleValidate(validateDialog)}
        onCancel={() => setValidateDialog(null)}
      />

      <ConfirmDialog
        title="Rejeter l'inscription"
        message={
          <div className="space-y-3">
            <p>Êtes-vous sûr de vouloir rejeter cette inscription ?</p>
            <textarea
              value={rejectMotif}
              onChange={(e) => setRejectMotif(e.target.value)}
              placeholder="Motif du rejet (obligatoire)"
              className="input-field"
              rows={3}
            />
          </div>
        }
        confirmText="Rejeter"
        cancelText="Annuler"
        isOpen={!!rejectDialog}
        onConfirm={() => rejectDialog && handleReject(rejectDialog)}
        onCancel={() => setRejectDialog(null)}
        isDangerous
      />
    </div>
  );
}
