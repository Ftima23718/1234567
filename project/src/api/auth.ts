import { apiClient, getApiErrorMessage, setAuthToken } from './client';

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;
  numeroEtudiant: string;
  filiere: string;
  anneeEtude: number;
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  setAuthToken(data.token);
  localStorage.setItem('transcampus_user', JSON.stringify(data));
  return data;
}

export async function registerUser(payload: RegisterPayload) {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function getProfile() {
  const { data } = await apiClient.get('/profile');
  return data;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const { data } = await apiClient.put('/auth/change-password', { currentPassword, newPassword });
  return data;
}

export async function logoutUser() {
  setAuthToken(null);
  localStorage.removeItem('transcampus_user');
}

export { getApiErrorMessage };
