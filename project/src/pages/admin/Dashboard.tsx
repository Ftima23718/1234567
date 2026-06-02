import { useEffect, useState } from 'react';
import { Users, Bus, TrendingUp, DollarSign, AlertTriangle, Activity } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboardKPIs } from '../../api/apiService';
import { useToast } from '../../components/ui/useToast';

const COLORS = ['#2563eb', '#22c55e', '#f97316', '#ef4444'];

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const kpisData = await getDashboardKPIs();
        setKpis(kpisData);
      } catch (error) {
        console.error('Failed to fetch KPIs:', error);
        toast('error', 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administration</h1>
        <div className="flex items-center justify-center h-96">
          <Activity className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administration</h1>
        <div className="card p-6 text-center">
          <p className="text-gray-600">Impossible de charger les données</p>
        </div>
      </div>
    );
  }

  const monthlyData = [
    { name: 'Jan', inscriptions: Math.max(2, kpis.totalInscrits - 10), paiements: Math.max(1, kpis.inscriptionsValidees - 5) },
    { name: 'Fev', inscriptions: Math.max(3, kpis.totalInscrits - 5), paiements: Math.max(1, kpis.inscriptionsValidees - 2) },
    { name: 'Mar', inscriptions: kpis.totalInscrits, paiements: kpis.inscriptionsValidees },
  ];

  const ligneRemplissageData = [
    { name: 'Ligne A', remplissage: 65, capacite: 150 },
    { name: 'Ligne B', remplissage: 72, capacite: 155 },
    { name: 'Ligne C', remplissage: 58, capacite: 145 },
  ];

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
          <p className="text-2xl font-bold text-gray-900">{kpis.totalInscrits}</p>
          <p className="text-sm text-gray-500">Etudiants inscrits</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{kpis.inscriptionsEnAttente}</p>
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
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(kpis.revenusTotal)}</p>
          <p className="text-sm text-gray-500">Revenus totaux</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-accent-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{kpis.busActifs}/{kpis.lignesActives}</p>
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
                    { name: 'Validees', value: kpis.inscriptionsValidees },
                    { name: 'En attente', value: kpis.inscriptionsEnAttente },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#f97316" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                <span className="text-xs text-gray-600">Validees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f97316' }}></div>
                <span className="text-xs text-gray-600">En attente</span>
              </div>
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
