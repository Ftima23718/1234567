import { QrCode, Download, CheckCircle, XCircle, Bus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchMyBadge } from '../../services/transport';
import { formatDate } from '../../utils/format';

export default function StudentBadge() {
  const [myBadges, setMyBadges] = useState<any[]>([]);

  useEffect(() => {
    fetchMyBadge().then((badge) => setMyBadges(badge ? [badge] : [])).catch(() => setMyBadges([]));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon badge de transport</h1>
        <p className="text-gray-600 mt-1">Telechargez et consultez votre badge avec QR code</p>
      </div>

      {myBadges.length === 0 ? (
        <div className="card p-12 text-center">
          <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun badge disponible</h3>
          <p className="text-gray-600 mb-6">Votre badge sera genere apres la validation de votre inscription et le paiement.</p>
          <a href="/student/inscription" className="btn-primary">S'inscrire au transport</a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {myBadges.map((badge) => (
            <div key={badge.id} className="card overflow-hidden">
              {/* Badge header */}
              <div className="bg-primary-600 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900 opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Bus className="w-6 h-6 text-white" />
                    <span className="text-lg font-bold text-white">TransCampus</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{badge.etudiantPrenom} {badge.etudiantNom}</h3>
                </div>
              </div>

              {/* Badge content */}
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-40 h-40 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-gray-800" />
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Ligne</span>
                    <span className="text-sm font-medium text-gray-900">{badge.ligneNom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Code QR</span>
                    <span className="text-sm font-mono text-gray-900">{badge.codeQR}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Expiration</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(badge.dateExpiration)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Validite</span>
                    {badge.estValide ? (
                      <span className="inline-flex items-center gap-1 text-success-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Valide
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-error-600 text-sm font-medium">
                        <XCircle className="w-4 h-4" /> Expire
                      </span>
                    )}
                  </div>
                </div>

                <button className="btn-primary w-full inline-flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> Telecharger le badge (PDF)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification section */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Verifier un badge</h2>
        <p className="text-sm text-gray-600 mb-4">Scannez ou saisissez un code QR pour verifier la validite d'un badge</p>
        <div className="flex gap-3">
          <input className="input-field flex-1" placeholder="Saisir le code QR (ex: QR-INS1-BDG1)" />
          <button className="btn-primary">Verifier</button>
        </div>
      </div>
    </div>
  );
}
