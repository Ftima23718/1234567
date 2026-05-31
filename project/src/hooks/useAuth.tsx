import { useEffect, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { AuthContext, type RegisterData } from './useAuthContext';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
const TOKEN_KEY = 'token';
const USER_KEY = 'transcampus_user';

function getApiErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Une erreur inattendue est survenue.';
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error((data && typeof data === 'object' && 'message' in data ? String(data.message) : '') || 'Erreur d’authentification');
  }

  return data as T;
}

function normalizeUser(profile: any): User {
  return {
    id: profile.id,
    nom: profile.nom ?? '',
    prenom: profile.prenom ?? '',
    email: profile.email ?? '',
    role: (profile.role || 'student').toLowerCase() as UserRole,
    telephone: profile.telephone ?? '',
    dateCreation: profile.dateCreation ?? '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;
  const currentRole = user?.role ?? null;

  const fetchProfile = async (): Promise<User | null> => {
    try {
      const profile = await apiRequest<any>('/auth/me');
      const mappedUser = normalizeUser(profile);
      setUser(mappedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
      return mappedUser;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as User;
        setUser(parsed);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    void fetchProfile();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; role?: UserRole | null }> => {
    try {
      const response = await apiRequest<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem(TOKEN_KEY, response.token);
      const user = await fetchProfile();
      return { success: true, role: user?.role ?? null };
    } catch (error) {
      return { success: false, error: getApiErrorMessage(error) };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string; role?: UserRole | null }> => {
    try {
      const response = await apiRequest<{ token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone,
          password: data.password,
          numeroEtudiant: data.numeroEtudiant,
          filiere: data.filiere,
          anneeEtude: data.anneeEtude,
        }),
      });

      localStorage.setItem(TOKEN_KEY, response.token);
      const user = await fetchProfile();
      return { success: true, role: user?.role ?? null };
    } catch (error) {
      return { success: false, error: getApiErrorMessage(error) };
    }
  };

  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, currentRole, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

