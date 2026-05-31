import { useState } from 'react';
import { ScanLine, QrCode, CheckCircle, XCircle, AlertTriangle, Search, User, Bus, Clock } from 'lucide-react';
import { formatDate } from '../../utils/format';
import { useToast } from '../../components/ui/useToast';
import { verifyBadge } from '../../services/transport';

export default function DriverVerification() {
  const [qrCode, setQrCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();

  const handleVerify = () => {
    if (!qrCode.trim()) {
      toast('warning', 'Veuillez saisir un code QR');
      return;
    }
    setScanning(true);
    verifyBadge(qrCode.trim())
      .then((data) => {
        setResult(data);
        toast(data.valid ? 'success' : 'error', data.message || (data.valid ? 'Badge valide ! Acces autorise.' : 'Badge expire ! Acces refuse.'));
      })
      .catch(() => {
        setResult('not_found');
        toast('error', 'Badge introuvable dans le systeme');
      })
      .finally(() => setScanning(false));
  };

  const reset = () => {
    setQrCode('');
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verification de badge</h1>
        <p className="text-gray-600 mt-1">Scannez ou saisissez un code QR pour verifier la validite d'un badge</p>
      </div>

      {/* Scan input */}
      <div className="card p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ScanLine className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Scanner un badge</h2>
          <p className="text-sm text-gray-500">Saisissez le code QR affiche sur le badge de l'etudiant</p>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={qrCode}
              onChange={e => setQrCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
              className="input-field pl-11"
              placeholder="Saisir le code QR (ex: QR-INS1-BDG1)"
            />
          </div>
          <button onClick={handleVerify} disabled={scanning} className="btn-primary inline-flex items-center gap-2">
            {scanning ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Search className="w-5 h-5" />
            )}
            Verifier
          </button>
        </div>

        <p className="text-xs text-gray-500">Le code QR sera verifie via l'API backend.</p>
      </div>

      {/* Result */}
      {result && (
        <div className={`card overflow-hidden ${
          result === 'not_found' ? 'border-error-300' : result?.valid ? 'border-success-300' : 'border-warning-300'
        }`}>
          {result === 'not_found' ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-error-600" />
              </div>
              <h3 className="text-xl font-bold text-error-700 mb-2">Badge introuvable</h3>
              <p className="text-sm text-gray-600 mb-4">Aucun badge correspondant a ce code QR n'a ete trouve dans le systeme.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={reset} className="btn-ghost">Nouvelle recherche</button>
                <button onClick={() => { setQrCode(''); setResult(null); }} className="btn-primary">Reessayer</button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className={`p-6 text-center ${result?.valid ? 'bg-success-50' : 'bg-warning-50'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  result?.valid ? 'bg-success-100' : 'bg-warning-100'
                }`}>
                  {result?.valid ? (
                    <CheckCircle className="w-8 h-8 text-success-600" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-warning-600" />
                  )}
                </div>
                <h3 className={`text-xl font-bold ${result?.valid ? 'text-success-700' : 'text-warning-700'}`}>
                  {result?.valid ? 'Badge valide - Acces autorise' : 'Badge expire - Acces refuse'}
                </h3>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Etudiant</p>
                    <p className="text-sm font-semibold text-gray-900">{result?.etudiantPrenom || ''} {result?.etudiantNom || ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Bus className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Ligne</p>
                    <p className="text-sm font-semibold text-gray-900">{result?.ligneNom || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <QrCode className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Code QR</p>
                    <p className="text-sm font-mono text-gray-900">{qrCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Date d'expiration</p>
                    <p className="text-sm font-semibold text-gray-900">{result?.dateExpiration ? formatDate(result.dateExpiration) : '-'}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button onClick={reset} className="btn-ghost flex-1">Nouvelle recherche</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Recent verifications */}
      <div className="card">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Verifications recentes</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">QR-INS1-BDG1 - Benali Ahmed</p>
                <p className="text-xs text-gray-500">Ligne A - Campus Centre</p>
              </div>
            </div>
            <span className="badge-success">Valide</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">QR-INS2-BDG2 - Kaci Fatima</p>
                <p className="text-xs text-gray-500">Ligne B - Campus Sud</p>
              </div>
            </div>
            <span className="badge-pending">Expire bientot</span>
          </div>
        </div>
      </div>
    </div>
  );
}
