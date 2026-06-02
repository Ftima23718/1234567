import { CreditCard, Download, DollarSign, TrendingUp, Plus, Receipt, Activity } from 'lucide-react';
import { formatDate, formatCurrency, getStatutColor, getStatutLabel } from '../../utils/format';
import { useEffect, useState } from 'react';
import { getPaiements, getInscriptions, createPaiement } from '../../api/apiService';
import { useToast } from '../../components/ui/useToast';
import SearchBar from '../../components/ui/SearchBar';

export default function AdminPaiements() {
  const [paiements, setPaiements] = useState<any[]>([]);
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recordForm, setRecordForm] = useState({
    inscriptionId: '', montant: '', modePaiement: 'ESPECES', referenceTransaction: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handler = () => { loadData().catch(() => {}); };
    window.addEventListener('inscription:changed', handler as EventListener);
    return () => window.removeEventListener('inscription:changed', handler as EventListener);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paiementsData, inscriptionsData] = await Promise.all([
        getPaiements(),
        getInscriptions(),
      ]);
      setPaiements(Array.isArray(paiementsData) ? paiementsData : paiementsData.content ?? []);
      setInscriptions(Array.isArray(inscriptionsData) ? inscriptionsData : inscriptionsData.content ?? []);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filtered = paiements
    .filter(p => filter === 'all' || p.statut === filter)
    .filter(p => search === '' || `${p.etudiant?.nom || ''} ${p.etudiant?.prenom || ''} ${p.referenceTransaction || ''}`.toLowerCase().includes(search.toLowerCase()));

  const totalPaye = paiements.filter(p => p.statut === 'PAYE').reduce((s, p) => s + (p.montant || 0), 0);
  const totalEnAttente = paiements.filter(p => p.statut === 'EN_ATTENTE').reduce((s, p) => s + (p.montant || 0), 0);

  // Inscriptions validees with pending payment
  const pendingInscriptions = inscriptions.filter(i => i.statut === 'VALIDEE' && !paiements.some(p => p.inscription?.id === i.id));

  const handleRecordPayment = async () => {
    if (!recordForm.inscriptionId || !recordForm.montant) {
      toast('warning', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSubmitting(true);
      const newPaiement = await createPaiement({
        inscriptionId: recordForm.inscriptionId,
        montant: parseFloat(recordForm.montant),
        modePaiement: recordForm.modePaiement,
        referenceTransaction: recordForm.referenceTransaction || undefined,
      });

      setPaiements(prev => [newPaiement, ...prev]);
      setShowRecordModal(false);
      setRecordForm({ inscriptionId: '', montant: '', modePaiement: 'ESPECES', referenceTransaction: '' });
      toast('success', `Paiement de ${formatCurrency(parseFloat(recordForm.montant))} enregistré avec succès.`);
    } catch (error) {
      console.error('Error recording payment:', error);
      const msg = (error as any)?.response?.data?.message || (error as any)?.message || 'Erreur lors de l\'enregistrement du paiement';
      toast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des paiements</h1>
        <div className="flex items-center justify-center h-96">
          <Activity className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des paiements</h1>
          <p className="text-gray-600 mt-1">Suivez et enregistrez les paiements des étudiants</p>
        </div>
        <button onClick={() => setShowRecordModal(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Enregistrer un paiement
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-success-600" />
            <p className="text-sm text-gray-500">Total encaissé</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaye)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-primary-600" />
            <p className="text-sm text-gray-500">Paiements enregistrés</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{paiements.length}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-accent-600" />
            <p className="text-sm text-gray-500">En attente</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalEnAttente)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un paiement..." />
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'Tous' },
            { value: 'PAYE', label: 'Payés' },
            { value: 'EN_ATTENTE', label: 'En attente' },
          ].map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.value ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3">Étudiant</th>
                <th className="px-5 py-3">Référence</th>
                <th className="px-5 py-3">Montant</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Mode</th>
                <th className="px-5 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary-700">{(p.etudiant?.prenom || 'E')[0]}{(p.etudiant?.nom || 'U')[0]}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{p.etudiant?.prenom} {p.etudiant?.nom}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 font-mono">{p.referenceTransaction}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatCurrency(p.montant)}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(p.datePaiement)}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{p.modePaiement}</td>
                    <td className="px-5 py-4"><span className={getStatutColor(p.statut)}>{getStatutLabel(p.statut)}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center">
                    <p className="text-gray-500">Aucun paiement trouvé</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Enregistrer un paiement</h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inscription validée</label>
                <select
                  value={recordForm.inscriptionId}
                  onChange={(e) => setRecordForm({ ...recordForm, inscriptionId: e.target.value })}
                  className="input-field"
                  disabled={submitting}
                >
                  <option value="">Choisir une inscription...</option>
                  {pendingInscriptions.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.etudiant?.prenom} {i.etudiant?.nom} - {i.ligne?.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant (DZD)</label>
                <input
                  type="number"
                  value={recordForm.montant}
                  onChange={(e) => setRecordForm({ ...recordForm, montant: e.target.value })}
                  placeholder="Entrer le montant"
                  className="input-field"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
                <select
                  value={recordForm.modePaiement}
                  onChange={(e) => setRecordForm({ ...recordForm, modePaiement: e.target.value })}
                  className="input-field"
                  disabled={submitting}
                >
                  <option value="ESPECES">Espèces</option>
                  <option value="VIREMENT">Virement</option>
                  <option value="CHEQUE">Chèque</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Référence (optionnel)</label>
                <input
                  type="text"
                  value={recordForm.referenceTransaction}
                  onChange={(e) => setRecordForm({ ...recordForm, referenceTransaction: e.target.value })}
                  placeholder="N° de transaction, chèque..."
                  className="input-field"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowRecordModal(false)}
                className="flex-1 btn-secondary"
                disabled={submitting}
              >
                Annuler
              </button>
              <button
                onClick={handleRecordPayment}
                className="flex-1 btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
