import { CreditCard, Download, DollarSign, TrendingUp, Plus, Receipt } from 'lucide-react';
import { formatDate, formatCurrency, getStatutColor, getStatutLabel } from '../../utils/format';
import { useEffect, useState } from 'react';
import { fetchAllInscriptions } from '../../services/transport';
import { useToast } from '../../components/ui/useToast';
import SearchBar from '../../components/ui/SearchBar';

export default function AdminPaiements() {
  const [paiements, setPaiements] = useState<any[]>([]);
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordForm, setRecordForm] = useState({
    inscriptionId: '', montant: '', modePaiement: 'ESPECES', reference: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAllInscriptions().then((data) => setInscriptions(Array.isArray(data) ? data : data.content ?? [])).catch(() => setInscriptions([]));
  }, []);

  const filtered = paiements
    .filter(p => filter === 'all' || p.statut === filter)
    .filter(p => search === '' || `${p.etudiantNom} ${p.etudiantPrenom} ${p.referenceTransaction}`.toLowerCase().includes(search.toLowerCase()));

  const totalPaye = paiements.filter(p => p.statut === 'PAYE').reduce((s, p) => s + p.montant, 0);

  // Inscriptions validees with pending payment
  const pendingInscriptions = inscriptions.filter(i => i.statut === 'VALIDEE' && i.paiementStatut === 'EN_ATTENTE');

  const handleRecordPayment = () => {
    if (!recordForm.inscriptionId || !recordForm.montant) {
      toast('warning', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    const ins = inscriptions.find(i => i.id === recordForm.inscriptionId);
    const newPaiement = {
      id: `PAY${Date.now()}`,
      inscriptionId: recordForm.inscriptionId,
      etudiantNom: ins?.etudiantNom || '',
      etudiantPrenom: ins?.etudiantPrenom || '',
      montant: parseFloat(recordForm.montant),
      datePaiement: new Date().toISOString().split('T')[0],
      modePaiement: recordForm.modePaiement as 'ESPECES' | 'VIREMENT',
      statut: 'PAYE' as const,
      referenceTransaction: recordForm.reference || `TXN-${Date.now()}`,
    };
    setPaiements(prev => [newPaiement, ...prev]);
    setShowRecordModal(false);
    setRecordForm({ inscriptionId: '', montant: '', modePaiement: 'ESPECES', reference: '' });
    toast('success', `Paiement de ${formatCurrency(newPaiement.montant)} enregistre avec succes. Le badge a ete genere.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des paiements</h1>
          <p className="text-gray-600 mt-1">Suivez et enregistrez les paiements des etudiants</p>
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
            <p className="text-sm text-gray-500">Total encaisse</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaye)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-primary-600" />
            <p className="text-sm text-gray-500">Paiements enregistres</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{paiements.length}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-accent-600" />
            <p className="text-sm text-gray-500">En attente</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingInscriptions.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un paiement..." />
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tous' },
            { value: 'PAYE', label: 'Payes' },
            { value: 'EN_ATTENTE', label: 'En attente' },
            { value: 'ANNULE', label: 'Annules' },
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
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Etudiant</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Mode</th>
                <th className="px-5 py-3">Montant</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3">Reçu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-mono text-gray-900">{p.referenceTransaction}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{p.etudiantPrenom} {p.etudiantNom}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{formatDate(p.datePaiement)}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.modePaiement === 'ESPECES' ? 'Especes' : 'Virement'}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatCurrency(p.montant)}</td>
                  <td className="px-5 py-4"><span className={getStatutColor(p.statut)}>{getStatutLabel(p.statut)}</span></td>
                  <td className="px-5 py-4">
                    {p.statut === 'PAYE' && (
                      <button className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
                        <Download className="w-4 h-4" /> PDF
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun paiement trouve</p>
          </div>
        )}
      </div>

      {/* Record payment modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4" onClick={() => setShowRecordModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-success-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Enregistrer un paiement</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Inscription <span className="text-error-500">*</span></label>
                <select
                  value={recordForm.inscriptionId}
                  onChange={e => {
                    const ins = inscriptions.find((i: any) => i.id === e.target.value);
                    setRecordForm({
                      ...recordForm,
                      inscriptionId: e.target.value,
                      montant: ins ? String(ins.typeAbonnement === 'MENSUEL' ? 2000 : ins.typeAbonnement === 'SEMESTRIEL' ? 8000 : 15000) : '',
                    });
                  }}
                  className="input-field"
                >
                  <option value="">Selectionner une inscription en attente de paiement</option>
                  {pendingInscriptions.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.etudiantPrenom} {i.etudiantNom} - {i.ligneNom} ({i.typeAbonnement === 'MENSUEL' ? 'Mensuel' : i.typeAbonnement === 'SEMESTRIEL' ? 'Semestriel' : 'Annuel'})
                    </option>
                  ))}
                </select>
                {pendingInscriptions.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">Aucune inscription en attente de paiement</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Montant (DZD) <span className="text-error-500">*</span></label>
                  <input
                    type="number"
                    value={recordForm.montant}
                    onChange={e => setRecordForm({ ...recordForm, montant: e.target.value })}
                    className="input-field"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mode de paiement</label>
                  <select
                    value={recordForm.modePaiement}
                    onChange={e => setRecordForm({ ...recordForm, modePaiement: e.target.value })}
                    className="input-field"
                  >
                    <option value="ESPECES">Especes</option>
                    <option value="VIREMENT">Virement</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reference de transaction</label>
                <input
                  value={recordForm.reference}
                  onChange={e => setRecordForm({ ...recordForm, reference: e.target.value })}
                  className="input-field"
                  placeholder="Optionnel - sera genere si vide"
                />
              </div>
              <div className="flex gap-3 pt-3">
                <button onClick={() => setShowRecordModal(false)} className="btn-ghost flex-1">Annuler</button>
                <button onClick={handleRecordPayment} className="btn-success flex-1 inline-flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" /> Enregistrer le paiement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
