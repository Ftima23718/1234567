import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open, title, message, confirmLabel = 'Confirmer', cancelLabel = 'Annuler',
  variant = 'danger', onConfirm, onCancel
}: ConfirmDialogProps) {
  if (!open) return null;

  const btnClass = variant === 'danger' ? 'btn-danger' : variant === 'warning' ? 'bg-warning-600 hover:bg-warning-700 text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 shadow-sm' : 'btn-primary';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              variant === 'danger' ? 'bg-error-100' : variant === 'warning' ? 'bg-warning-100' : 'bg-primary-100'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${
                variant === 'danger' ? 'text-error-600' : variant === 'warning' ? 'text-warning-600' : 'text-primary-600'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-2">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-4 border-t border-gray-100">
          <button onClick={onCancel} className="btn-ghost flex-1">{cancelLabel}</button>
          <button onClick={onConfirm} className={`${btnClass} flex-1`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
