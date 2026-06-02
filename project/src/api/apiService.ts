import axiosClient from './axiosClient';

async function request<T = any>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: unknown): Promise<T> {
  try {
    const { data: responseData } = await axiosClient.request<T>({ method, url, data });
    return responseData;
  } catch (error) {
    console.error(`API request failed: ${method} ${url}`, error);
    throw error;
  }
}

const unwrapList = <T>(value: unknown): T => {
  if (Array.isArray(value)) return value as T;
  if (value && typeof value === 'object' && 'content' in value) {
    const content = (value as { content?: unknown }).content;
    return (Array.isArray(content) ? content : value) as T;
  }
  return value as T;
};

export async function getEtudiants() {
  return request<any>('GET', '/etudiants');
}

export async function getEtudiantById(id: string | number) {
  return request<any>('GET', `/etudiants/${id}`);
}

export async function updateUser(id: string | number, data: unknown) {
  return request<any>('PUT', `/users/${id}`, data);
}

export async function getChauffeurs() {
  return request<any>('GET', '/chauffeurs');
}

export async function createChauffeur(data: unknown) {
  return request<any>('POST', '/auth/chauffeur', data);
}

export async function updateChauffeur(id: string | number, data: unknown) {
  return request<any>('PUT', `/chauffeurs/${id}`, data);
}

export async function deleteChauffeur(id: string | number) {
  return request<any>('DELETE', `/chauffeurs/${id}`);
}

export async function getLignes() {
  return request<any>('GET', '/lignes');
}

export async function createLigne(data: unknown) {
  return request<any>('POST', '/admin/lignes', data);
}

export async function updateLigne(id: string | number, data: unknown) {
  return request<any>('PUT', `/lignes/${id}`, data);
}

export async function deleteLigne(id: string | number) {
  return request<any>('DELETE', `/lignes/${id}`);
}

export async function getArrets() {
  return request<any>('GET', '/arrets');
}

export async function getArretsByLigne(ligneId: string | number) {
  return request<any>('GET', `/lignes/${ligneId}/arrets`);
}

export async function createArret(data: unknown) {
  return request<any>('POST', '/admin/arrets', data);
}

export async function updateArret(id: string | number, data: unknown) {
  return request<any>('PUT', `/arrets/${id}`, data);
}

export async function deleteArret(id: string | number) {
  return request<any>('DELETE', `/arrets/${id}`);
}

export async function getBus() {
  return request<any>('GET', '/bus');
}

export async function createBus(data: unknown) {
  return request<any>('POST', '/admin/bus', data);
}

export async function updateBus(id: string | number, data: unknown) {
  return request<any>('PUT', `/bus/${id}`, data);
}

export async function deleteBus(id: string | number) {
  return request<any>('DELETE', `/bus/${id}`);
}

export async function getTrajets() {
  return request<any>('GET', '/trajets');
}

export async function createTrajet(data: unknown) {
  return request<any>('POST', '/admin/trajets', data);
}

export async function updateTrajet(id: string | number, data: unknown) {
  return request<any>('PUT', `/trajets/${id}`, data);
}

export async function deleteTrajet(id: string | number) {
  return request<any>('DELETE', `/trajets/${id}`);
}

export async function getInscriptions() {
  return unwrapList<any>(await request<any>('GET', '/inscriptions'));
}

export async function getMyInscriptions() {
  return unwrapList<any>(await request<any>('GET', '/inscriptions/me'));
}

export async function createInscription(data: unknown) {
  return request<any>('POST', '/inscriptions', data);
}

export async function validerInscription(id: string | number) {
  return request<any>('PUT', `/inscriptions/${id}/validate`);
}

export async function rejeterInscription(id: string | number, motif: string) {
  return request<any>('PUT', `/inscriptions/${id}/reject`, { motifRejet: motif });
}

export async function getPaiements() {
  return request<any>('GET', '/paiements');
}

export async function getMyPaiements() {
  return request<any>('GET', '/paiements/me');
}

export async function createPaiement(data: unknown) {
  return request<any>('POST', '/paiements', data);
}

export async function getBadges() {
  return request<any>('GET', '/badges');
}

export async function getMyBadge() {
  return request<any>('GET', '/badges/me');
}

export async function getMyNotifications() {
  return request<any>('GET', '/notifications/me');
}

export async function markAsRead(id: string | number) {
  return request<any>('PUT', `/notifications/${id}/read`);
}

export async function getTarifs() {
  return request<any>('GET', '/tarifs');
}

export async function getDashboardKPIs() {
  return request<any>('GET', '/dashboard/kpis');
}

export async function getDashboardResponsable() {
  return request<any>('GET', '/dashboard/responsable');
}

export async function getDashboardDriver() {
  return request<any>('GET', '/dashboard/driver');
}

export const fetchLignes = getLignes;
export const fetchArrets = getArrets;
export const fetchBus = getBus;
export const fetchTrajets = getTrajets;
export const fetchMyInscriptions = getMyInscriptions;
export const fetchAllInscriptions = getInscriptions;
export const fetchMyPayments = getMyPaiements;
export const fetchNotifications = getMyNotifications;
export const fetchMyBadge = getMyBadge;
export const fetchTarifs = getTarifs;
export const fetchChauffeurs = getChauffeurs;
export const fetchProfile = async () => request<any>('GET', '/profile');

export { unwrapList };
