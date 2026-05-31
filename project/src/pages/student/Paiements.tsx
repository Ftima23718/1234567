import { CreditCard, Download, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchMyPayments } from '../../services/transport';
import { formatDate, formatCurrency, getStatutColor, getStatutLabel } from '../../utils/format';

export default function StudentPaiements() {
  const [myPaiements, setMyPaiements] = useState<any[]>([]);

  useEffect(() => {
    fetchMyPayments().then(setMyPaiements).catch(() => setMyPaiements([]));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historique des paiements</h1>
        <p className="text-gray-600 mt-1">Consultez et telechargez vos recus de paiement</p>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-sm text-gray-500">Total paye</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(myPaiements.reduce((s, p) => s + p.montant, 0))}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Nombre de paiements</p>
          <p className="text-2xl font-bold text-gray-900">{myPaiements.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Dernier paiement</p>
          <p className="text-2xl font-bold text-gray-900">{myPaiements.length > 0 ? formatDate(myPaiements[0].datePaiement) : '-'}</p>
        </div>
      </div>

      {/* Paiements list */}
      <div className="card">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Mes paiements</h2>
          <button className="btn-ghost inline-flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4" /> Filtrer
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Mode</th>
                <th className="px-5 py-3">Montant</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3">Reçu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myPaiements.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono text-gray-900">{p.referenceTransaction}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{formatDate(p.datePaiement)}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.modePaiement === 'ESPECES' ? 'Especes' : 'Virement'}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatCurrency(p.montant)}</td>
                  <td className="px-5 py-4"><span className={getStatutColor(p.statut)}>{getStatutLabel(p.statut)}</span></td>
                  <td className="px-5 py-4">
                    <button className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
                      <Download className="w-4 h-4" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {myPaiements.length === 0 && (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun paiement enregistre</p>
          </div>
        )}
      </div>
    </div>
  );
}
