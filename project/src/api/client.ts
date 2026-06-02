import axios, { type AxiosRequestConfig } from 'axios';
import axiosClient from './axiosClient';

export const apiClient = axiosClient;

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    const serverMessage = data?.message ?? data?.detail ?? data?.error;
    if (typeof serverMessage === 'string' && serverMessage.trim()) return serverMessage;
    if (error.message) return error.message;
  }
  return 'Une erreur inattendue est survenue.';
}

export function setAuthToken(token?: string | null) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

export function getAuthToken() {
  return localStorage.getItem('token');
}

export type ApiRequestConfig = AxiosRequestConfig;
