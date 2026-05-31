import { useEffect, useMemo, useState } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { fetchAllInscriptions, fetchLignes } from '../../services/transport';

export default function AdminRapports() {
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [lignes, setLignes] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([fetchAllInscriptions(), fetchLignes()])
      .then(([ins, lig]) => {
        setInscriptions(Array.isArray(ins) ? ins : ins.content ?? []);
        setLignes(Array.isArray(lig) ? lig : []);
      })
      .catch(() => {
        setInscriptions([]);
        setLignes([]);
      });
  }, []);

  const stats = useMemo(() => {
    const validees = inscriptions.filter((i) => i.statut === 'VALIDEE').length;
    const total = inscriptions.length;
    return {
      total,
      validationRate: total ? Math.round((validees / total) * 100) : 0,
      revenue: inscriptions.filter((i) => i.paiementStatut === 'PAYE').length * 2000,
      fillRate: lignes.length ? Math.round((lignes.filter((l) => l.estActive).length / lignes.length) * 100) : 0,
    };
  }, [inscriptions, lignes]);

  const monthlyData = useMemo(() => [
    { name: 'S1', inscriptions: Math.max(0, inscriptions.length), paiements: Math.max(0, Math.round(inscriptions.length * 0.7)) },
    { name: 'S2', inscriptions: Math.max(0, inscriptions.length - 3), paiements: Math.max(0, Math.round((inscriptions.length - 3) * 0.7)) },
    { name: 'S3', inscriptions: Math.max(0, inscriptions.length - 1), paiements: Math.max(0, Math.round((inscriptions.length - 1) * 0.7)) },
  ], [inscriptions]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rapports & Statistiques</h1>
        <p className="text-gray-600 mt-1">Analysez les donnees du service de transport</p>
      </div>

      {/* Export buttons */}
      <div className="flex gap-3">
        <button className="btn-secondary inline-flex items-center gap-2 text-sm">
          <FileSpreadsheet className="w-4 h-4" /> Exporter Excel
        </button>
        <button className="btn-secondary inline-flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4" /> Exporter PDF
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-sm text-gray-500">Total inscriptions</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Taux de validation</p>
          <p className="text-2xl font-bold text-gray-900">{stats.validationRate}%</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Revenus totaux</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Taux de remplissage</p>
          <p className="text-2xl font-bold text-gray-900">{stats.fillRate}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Inscriptions mensuelles</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="inscriptions" fill="#2563eb" radius={[4, 4, 0, 0]} name="Inscriptions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Paiements mensuels</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Line type="monotone" dataKey="paiements" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} name="Paiements" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed report table */}
      <div className="card">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Rapport detaille par ligne</h2>
          <button className="btn-secondary inline-flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Telecharger
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3">Ligne</th>
                <th className="px-5 py-3">Inscrits</th>
                <th className="px-5 py-3">Taux remplissage</th>
                <th className="px-5 py-3">Revenus</th>
                <th className="px-5 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-medium text-gray-900">Ligne A - Campus Centre</td>
                <td className="px-5 py-4 text-sm text-gray-600">89</td>
                <td className="px-5 py-4"><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-gray-200 rounded-full"><div className="h-full bg-primary-600 rounded-full" style={{ width: '78%' }}></div></div><span className="text-sm text-gray-600">78%</span></div></td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatCurrency(535000)}</td>
                <td className="px-5 py-4"><span className="badge-success">Active</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-medium text-gray-900">Ligne B - Campus Sud</td>
                <td className="px-5 py-4 text-sm text-gray-600">67</td>
                <td className="px-5 py-4"><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-gray-200 rounded-full"><div className="h-full bg-success-500 rounded-full" style={{ width: '65%' }}></div></div><span className="text-sm text-gray-600">65%</span></div></td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatCurrency(420000)}</td>
                <td className="px-5 py-4"><span className="badge-success">Active</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-medium text-gray-900">Ligne C - Inter-Campus</td>
                <td className="px-5 py-4 text-sm text-gray-600">33</td>
                <td className="px-5 py-4"><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-gray-200 rounded-full"><div className="h-full bg-warning-500 rounded-full" style={{ width: '52%' }}></div></div><span className="text-sm text-gray-600">52%</span></div></td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatCurrency(295000)}</td>
                <td className="px-5 py-4"><span className="badge-success">Active</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm font-medium text-gray-900">Ligne D - Residences</td>
                <td className="px-5 py-4 text-sm text-gray-600">0</td>
                <td className="px-5 py-4"><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-gray-200 rounded-full"><div className="h-full bg-gray-300 rounded-full" style={{ width: '0%' }}></div></div><span className="text-sm text-gray-600">0%</span></div></td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatCurrency(0)}</td>
                <td className="px-5 py-4"><span className="badge-error">Inactive</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
