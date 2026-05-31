import { useEffect, useState } from 'react';
import { fetchNotifications } from '../../services/transport';
import { formatDateTime } from '../../utils/format';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, Trash2, CheckCheck } from 'lucide-react';
import { useToast } from '../../components/ui/useToast';

const typeIcons: Record<string, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const typeStyles: Record<string, string> = {
  info: 'bg-primary-50 text-primary-600 border-primary-200',
  success: 'bg-success-50 text-success-600 border-success-200',
  warning: 'bg-warning-50 text-warning-600 border-warning-200',
  error: 'bg-error-50 text-error-600 border-error-200',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifications().then(setNotifications).catch(() => setNotifications([]));
  }, []);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();

  const filtered = notifications
    .filter(n => filter === 'all' || (filter === 'unread' ? !n.estLue : n.estLue))
    .filter(n => typeFilter === 'all' || n.type === typeFilter);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, estLue: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, estLue: true })));
    toast('success', 'Toutes les notifications marquees comme lues');
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast('info', 'Notification supprimee');
  };

  const unreadCount = notifications.filter(n => !n.estLue).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">{unreadCount} non lue(s) sur {notifications.length}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-ghost inline-flex items-center gap-2 text-sm">
            <CheckCheck className="w-4 h-4" /> Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {[
            { value: 'all' as const, label: 'Toutes' },
            { value: 'unread' as const, label: `Non lues (${unreadCount})` },
            { value: 'read' as const, label: 'Lues' },
          ].map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.value ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>{f.label}</button>
          ))}
        </div>
        <div className="h-6 w-px bg-gray-200"></div>
        <div className="flex gap-2">
          {['all', 'info', 'success', 'warning', 'error'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              typeFilter === t ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}>{t === 'all' ? 'Tous types' : t === 'info' ? 'Info' : t === 'success' ? 'Succes' : t === 'warning' ? 'Alerte' : 'Erreur'}</button>
          ))}
        </div>
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        )}
        {filtered.map(notif => {
          const Icon = typeIcons[notif.type] || Info;
          return (
            <div
              key={notif.id}
              className={`card transition-all hover:shadow-md cursor-pointer ${!notif.estLue ? 'border-l-4 border-l-primary-500' : ''}`}
              onClick={() => markAsRead(notif.id)}
            >
              <div className="p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${typeStyles[notif.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${!notif.estLue ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDateTime(notif.dateEnvoi)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notif.estLue && (
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                        className="p-1.5 text-gray-300 hover:text-error-500 hover:bg-error-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
