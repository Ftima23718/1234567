import { createContext, useContext } from 'react';
import type { UserRole, User } from '../types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  currentRole: UserRole | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole | null }>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; role?: UserRole | null }>;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  numeroEtudiant: string;
  filiere: string;
  anneeEtude: number;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
