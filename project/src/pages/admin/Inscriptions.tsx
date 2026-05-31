import { useEffect, useState } from 'react';
import { fetchAllInscriptions } from '../../services/transport';
import { formatDate, getStatutColor, getStatutLabel, getTypeAbonnementLabel } from '../../utils/format';
import { CheckCircle, XCircle, Eye, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
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
  const { toast } = useToast();

  useEffect(() => {
    fetchAllInscriptions().then((data) => setInscriptions(Array.isArray(data) ? data : data.content ?? [])).catch(() => setInscriptions([]));
  }, []);

  const filtered = inscriptions
    .filter(i => filter === 'all' || i.statut === filter)
    .filter(i => search === '' || `${i.etudiantNom} ${i.etudiantPrenom} ${i.ligneNom}`.toLowerCase().includes(search.toLowerCase()));

  const selected = inscriptions.find(i => i.id === selectedId);

  const handleValidate = (id: string) => {
    setInscriptions(prev => prev.map(i => i.id === id ? { ...i, statut: 'VALIDEE' as const, paiementStatut: 'EN_ATTENTE' as const } : i));
    setValidateDialog(null);
    toast('success', 'Inscription validee avec succes. L\'etudiant doit maintenant effectuer le paiement.');
  };

  const handleReject = (id: string) => {
    if (!rejectMotif.trim()) {
      toast('warning', 'Veuillez saisir un motif de rejet');
      return;
    }
    setInscriptions(prev => prev.map(i => i.id === id ? { ...i, statut: 'REJETEE' as const, motifRejet: rejectMotif, paiementStatut: 'ANNULE' as const } : i));
    setRejectDialog(null);
    setRejectMotif('');
    toast('info', 'Inscription rejetee. L\'etudiant sera notifie par email.');
  };

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
          <p className="text-xs text-success-600 font-medium">Validees</p>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-error-700">{inscriptions.filter(i => i.statut === 'REJETEE').length}</p>
          <p className="text-xs text-error-600 font-medium">Rejetees</p>
        </div>
        <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-primary-700">{inscriptions.length}</p>
          <p className="text-xs text-primary-600 font-medium">Total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un etudiant..." />
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tous' },
            { value: 'EN_ATTENTE', label: 'En attente' },
            { value: 'VALIDEE', label: 'Validees' },
            { value: 'REJETEE', label: 'Rejetees' },
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
                  <th className="px-5 py-3">Etudiant</th>
                  <th className="px-5 py-3">Ligne</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((ins) => (
                  <tr key={ins.id} className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedId === ins.id ? 'bg-primary-50' : ''}`}
                    onClick={() => setSelectedId(ins.id)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary-700">{ins.etudiantPrenom[0]}{ins.etudiantNom[0]}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{ins.etudiantPrenom} {ins.etudiantNom}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{ins.ligneNom}</td>
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
                              className="p-1.5 text-gray-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-all" title="Valider">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setRejectDialog(ins.id); setRejectMotif(''); }}
                              className="p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all" title="Rejeter">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">{filtered.length} resultat(s)</p>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm text-gray-600">1 / 1</span>
              <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div className="card">
          {selected ? (
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detail de l'inscription</h3>
                <span className={getStatutColor(selected.statut)}>{getStatutLabel(selected.statut)}</span>
              </div>

              {/* Student info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-700">{selected.etudiantPrenom[0]}{selected.etudiantNom[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selected.etudiantPrenom} {selected.etudiantNom}</p>
                  <p className="text-xs text-gray-500">ID: {selected.etudiantId}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Ligne</p>
                    <p className="text-sm font-medium text-gray-900">{selected.ligneNom}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Arret de prise</p>
                    <p className="text-sm font-medium text-gray-900">{selected.arretNom}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type d'abonnement</p>
                  <p className="text-sm font-medium text-gray-900">{getTypeAbonnementLabel(selected.typeAbonnement)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Date debut</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(selected.dateDebut)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date fin</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(selected.dateFin)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Paiement</p>
                  <span className={selected.paiementStatut === 'PAYE' ? 'badge-success' : selected.paiementStatut === 'ANNULE' ? 'badge-error' : 'badge-pending'}>
                    {selected.paiementStatut === 'PAYE' ? 'Paye' : selected.paiementStatut === 'ANNULE' ? 'Annule' : 'En attente'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Badge genere</p>
                  <span className={selected.badgeGenere ? 'badge-success' : 'badge-info'}>{selected.badgeGenere ? 'Oui' : 'Non'}</span>
                </div>
              </div>

              {selected.motifRejet && (
                <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
                  <p className="text-xs font-medium text-error-700 mb-1">Motif du rejet</p>
                  <p className="text-sm text-error-600">{selected.motifRejet}</p>
                </div>
              )}

              {selected.statut === 'EN_ATTENTE' && (
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button onClick={() => setValidateDialog(selected.id)} className="btn-success flex-1 inline-flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Valider
                  </button>
                  <button onClick={() => { setRejectDialog(selected.id); setRejectMotif(''); }} className="btn-danger flex-1 inline-flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" /> Rejeter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Selectionnez une inscription pour voir les details</p>
            </div>
          )}
        </div>
      </div>

      {/* Validate confirmation */}
      <ConfirmDialog
        open={!!validateDialog}
        title="Valider l'inscription"
        message="Etes-vous sur de vouloir valider cette inscription ? L'etudiant sera notifie et devra proceder au paiement."
        confirmLabel="Valider"
        variant="primary"
        onConfirm={() => validateDialog && handleValidate(validateDialog)}
        onCancel={() => setValidateDialog(null)}
      />

      {/* Reject dialog with motif */}
      {rejectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4" onClick={() => setRejectDialog(null)}>
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-error-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Rejeter l'inscription</h3>
                  <p className="text-sm text-gray-600 mt-1">L'etudiant sera notifie du rejet par email.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Motif du rejet <span className="text-error-500">*</span></label>
                <textarea
                  value={rejectMotif}
                  onChange={(e) => setRejectMotif(e.target.value)}
                  className="input-field min-h-[100px] resize-y"
                  placeholder="Expliquez la raison du rejet (ex: Carte etudiante invalide, dossier incomplet...)"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-100">
              <button onClick={() => setRejectDialog(null)} className="btn-ghost flex-1">Annuler</button>
              <button onClick={() => handleReject(rejectDialog)} className="btn-danger flex-1">Rejeter l'inscription</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
