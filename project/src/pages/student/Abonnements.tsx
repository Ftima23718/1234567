import { formatDate, getStatutColor, getStatutLabel, getTypeAbonnementLabel, formatCurrency } from '../../utils/format';
import { Bus, RefreshCw, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '../../components/ui/useToast';
import { fetchMyInscriptions, fetchTarifs } from '../../services/transport';

export default function StudentAbonnements() {
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [tarifs, setTarifs] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([fetchMyInscriptions(), fetchTarifs()])
      .then(([ins, tar]) => {
        setInscriptions(Array.isArray(ins) ? ins : []);
        setTarifs(Array.isArray(tar) ? tar : []);
      })
      .catch(() => {
        setInscriptions([]);
        setTarifs([]);
      });
  }, []);
  const [filter, setFilter] = useState('all');
  const [renewDialog, setRenewDialog] = useState<string | null>(null);
  const [renewType, setRenewType] = useState<'MENSUEL' | 'SEMESTRIEL' | 'ANNUEL'>('MENSUEL');
  const { toast } = useToast();

  const filtered = filter === 'all' ? inscriptions : inscriptions.filter(i => i.statut === filter);

  const handleRenew = (inscriptionId: string) => {
    const ins = inscriptions.find(i => i.id === inscriptionId);
    if (!ins) return;

    const newInscription = {
      ...ins,
      id: `INS${Date.now()}`,
      typeAbonnement: renewType,
      statut: 'EN_ATTENTE' as const,
      dateInscription: new Date().toISOString().split('T')[0],
      paiementStatut: 'EN_ATTENTE' as const,
      badgeGenere: false,
      motifRejet: undefined,
    };
    setInscriptions(prev => [newInscription, ...prev]);
    setRenewDialog(null);
    toast('success', 'Demande de renouvellement soumise avec succes');
  };

  const isExpiringSoon = (dateFin: string) => {
    const fin = new Date(dateFin);
    const now = new Date();
    const diff = fin.getTime() - now.getTime();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes abonnements</h1>
          <p className="text-gray-600 mt-1">Historique de vos inscriptions au service de transport</p>
        </div>
        <a href="/student/inscription" className="btn-primary inline-flex items-center gap-2">
          <Bus className="w-4 h-4" /> Nouvelle inscription
        </a>
      </div>

      {/* Expiry alerts */}
      {inscriptions.filter(i => i.statut === 'VALIDEE' && isExpiringSoon(i.dateFin)).map(ins => (
        <div key={ins.id} className="bg-warning-50 border border-warning-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning-800">Votre abonnement sur {ins.ligneNom} expire bientot</p>
            <p className="text-xs text-warning-600 mt-1">Date d'expiration : {formatDate(ins.dateFin)}. Pensez a le renouveler.</p>
            <button onClick={() => { setRenewDialog(ins.id); setRenewType(ins.typeAbonnement); }} className="mt-2 text-sm font-medium text-warning-700 hover:text-warning-800 inline-flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Renouveler maintenant
            </button>
          </div>
        </div>
      ))}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'Tous' },
          { value: 'VALIDEE', label: 'Validees' },
          { value: 'EN_ATTENTE', label: 'En attente' },
          { value: 'REJETEE', label: 'Rejetees' },
          { value: 'EXPIREE', label: 'Expirees' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.value ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Bus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune inscription trouvee</p>
          </div>
        )}
        {filtered.map((ins) => (
          <div key={ins.id} className="card hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Bus className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{ins.ligneNom}</h3>
                    <p className="text-sm text-gray-500">Arret : {ins.arretNom}</p>
                  </div>
                </div>
                <span className={getStatutColor(ins.statut)}>{getStatutLabel(ins.statut)}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm font-medium text-gray-900">{getTypeAbonnementLabel(ins.typeAbonnement)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date debut</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(ins.dateDebut)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date fin</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(ins.dateFin)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Paiement</p>
                  <span className={ins.paiementStatut === 'PAYE' ? 'badge-success' : ins.paiementStatut === 'ANNULE' ? 'badge-error' : 'badge-pending'}>
                    {ins.paiementStatut === 'PAYE' ? 'Paye' : ins.paiementStatut === 'ANNULE' ? 'Annule' : 'En attente'}
                  </span>
                </div>
              </div>

              {/* Timeline status */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                  <span className="text-xs text-gray-500">Soumise</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200">
                  <div className={`h-full transition-all ${['VALIDEE', 'REJETEE', 'EXPIREE'].includes(ins.statut) ? 'bg-primary-500' : ''}`} style={{ width: ['VALIDEE', 'REJETEE', 'EXPIREE'].includes(ins.statut) ? '100%' : '0%' }}></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${['VALIDEE', 'REJETEE', 'EXPIREE'].includes(ins.statut) ? (ins.statut === 'REJETEE' ? 'bg-error-500' : 'bg-primary-500') : 'bg-gray-300'}`}></div>
                  <span className="text-xs text-gray-500">{ins.statut === 'REJETEE' ? 'Rejetee' : 'Traitee'}</span>
                </div>
                {ins.statut === 'VALIDEE' && (
                  <>
                    <div className="flex-1 h-0.5 bg-primary-500"></div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                      <span className="text-xs text-gray-500">Active</span>
                    </div>
                  </>
                )}
              </div>

              {ins.motifRejet && (
                <div className="mt-3 p-3 bg-error-50 rounded-lg">
                  <p className="text-sm text-error-700">Motif du rejet : {ins.motifRejet}</p>
                </div>
              )}

              {/* Actions */}
              {(ins.statut === 'VALIDEE' || ins.statut === 'EXPIREE') && (
                <div className="flex items-center gap-3 pt-3 mt-3 border-t border-gray-100">
                  {(ins.statut === 'EXPIREE' || (ins.statut === 'VALIDEE' && isExpiringSoon(ins.dateFin))) && (
                    <button onClick={() => { setRenewDialog(ins.id); setRenewType(ins.typeAbonnement); }} className="btn-primary text-sm inline-flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" /> Renouveler
                    </button>
                  )}
                  {ins.badgeGenere && ins.statut === 'VALIDEE' && (
                    <a href="/student/badge" className="btn-ghost text-sm inline-flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Voir le badge
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Renewal dialog */}
      {renewDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4" onClick={() => setRenewDialog(null)}>
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Renouveler l'abonnement</h3>
                  <p className="text-sm text-gray-600 mt-1">Choisissez le type d'abonnement pour le renouvellement</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {tarifs.map(t => (
                  <label
                    key={t.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      renewType === t.typeAbonnement ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="renewType"
                      value={t.typeAbonnement}
                      checked={renewType === t.typeAbonnement}
                      onChange={() => setRenewType(t.typeAbonnement as 'MENSUEL' | 'SEMESTRIEL' | 'ANNUEL')}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {t.typeAbonnement === 'MENSUEL' ? 'Mensuel' : t.typeAbonnement === 'SEMESTRIEL' ? 'Semestriel' : 'Annuel'}
                      </p>
                      <p className="text-xs text-gray-500">{t.description}</p>
                    </div>
                    <p className="text-sm font-bold text-primary-600">{formatCurrency(t.montant)}</p>
                    {renewType === t.typeAbonnement && <CheckCircle className="w-5 h-5 text-primary-600" />}
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setRenewDialog(null)} className="btn-ghost flex-1">Annuler</button>
                <button onClick={() => handleRenew(renewDialog)} className="btn-primary flex-1 inline-flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Confirmer le renouvellement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
