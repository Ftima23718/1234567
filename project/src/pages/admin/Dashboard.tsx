import { useEffect, useMemo, useState } from 'react';
import { Users, Bus, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchAllInscriptions } from '../../services/transport';
import { fetchLignes } from '../../services/transport';
import { fetchBus as fetchBusList } from '../../services/transport';

const COLORS = ['#2563eb', '#22c55e', '#f97316', '#ef4444'];

export default function AdminDashboard() {
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [lignes, setLignes] = useState<any[]>([]);
  const [bus, setBus] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([fetchAllInscriptions(), fetchLignes(), fetchBusList()])
      .then(([ins, lig, b]) => {
        setInscriptions(Array.isArray(ins) ? ins : ins.content ?? []);
        setLignes(Array.isArray(lig) ? lig : []);
        setBus(Array.isArray(b) ? b : []);
      })
      .catch(() => {
        setInscriptions([]);
        setLignes([]);
        setBus([]);
      });
  }, []);

  const stats = useMemo(() => {
    const validees = inscriptions.filter((i) => i.statut === 'VALIDEE').length;
    const attente = inscriptions.filter((i) => i.statut === 'EN_ATTENTE').length;
    const revenue = inscriptions.filter((i) => i.paiementStatut === 'PAYE').length * 2000;
    return { total: inscriptions.length, validees, attente, revenue, lignesActives: lignes.filter((l) => l.estActive).length, busActifs: bus.filter((b) => b.statut === 'ACTIF').length };
  }, [inscriptions, lignes, bus]);

  const monthlyData = useMemo(() => [
    { name: 'Jan', inscriptions: inscriptions.length, paiements: Math.max(0, Math.round(inscriptions.length * 0.8)) },
    { name: 'Fev', inscriptions: Math.max(0, inscriptions.length - 4), paiements: Math.max(0, Math.round((inscriptions.length - 4) * 0.8)) },
    { name: 'Mar', inscriptions: Math.max(0, inscriptions.length - 2), paiements: Math.max(0, Math.round((inscriptions.length - 2) * 0.8)) },
  ], [inscriptions]);

  const ligneRemplissageData = useMemo(() => lignes.map((ligne) => ({
    name: ligne.nom,
    remplissage: Math.min(100, Math.round((ligne.busCount || 0) * 12)),
    capacite: Math.max(40, (ligne.busCount || 0) * 10),
  })), [lignes]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administration</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble du service de transport</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <span className="inline-flex items-center gap-1 text-sm text-success-600 font-medium">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Etudiants inscrits</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.attente}</p>
          <p className="text-sm text-gray-500">Inscriptions en attente</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success-600" />
            </div>
            <span className="inline-flex items-center gap-1 text-sm text-success-600 font-medium">
              <TrendingUp className="w-3 h-3" /> +8%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue)}</p>
          <p className="text-sm text-gray-500">Revenus totaux</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-accent-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.busActifs}/{stats.lignesActives}</p>
          <p className="text-sm text-gray-500">Bus actifs / Lignes actives</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Inscriptions & Paiements mensuels</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="inscriptions" fill="#2563eb" radius={[4, 4, 0, 0]} name="Inscriptions" />
                <Bar dataKey="paiements" fill="#22c55e" radius={[4, 4, 0, 0]} name="Paiements" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Repartition par statut</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Validees', value: stats.validees },
                    { name: 'En attente', value: stats.attente },
                    { name: 'Rejetees', value: 15 },
                    { name: 'Expirees', value: 25 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {COLORS.map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {['Validees', 'En attente', 'Rejetees', 'Expirees'].map((label, i) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ligne remplissage */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Taux de remplissage par ligne</h2>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {ligneRemplissageData.map((ligne) => (
              <div key={ligne.name} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 w-24">{ligne.name}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                    style={{ width: `${ligne.remplissage}%` }}
                  >
                    <span className="text-xs font-semibold text-white">{ligne.remplissage}%</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500 w-20 text-right">{ligne.remplissage}/{ligne.capacite} places</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
