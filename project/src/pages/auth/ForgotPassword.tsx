import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSent(true);
    } catch {
      setError('Impossible d’envoyer la demande pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">TransCampus</span>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email envoye</h2>
              <p className="text-gray-600 mb-6">
                Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un lien de reinitialisation.
              </p>
              <Link to="/login" className="btn-primary w-full inline-flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Retour a la connexion
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublie ?</h2>
              <p className="text-gray-600 mb-6">Entrez votre adresse email pour recevoir un lien de reinitialisation.</p>
              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 text-sm rounded-lg p-3 mb-4">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-11"
                      placeholder="prenom.nom@univ.dz"
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Envoyer le lien'}
                </button>
              </form>
              <p className="mt-6 text-center">
                <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Retour a la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
