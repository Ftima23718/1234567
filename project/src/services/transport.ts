import axiosClient from '../api/axiosClient';
import {
  getArretsByLigne,
  getBus,
  getChauffeurs,
  getInscriptions,
  getLignes,
  getMyBadge,
  getMyInscriptions,
  getMyNotifications,
  getMyPaiements,
  getTarifs,
} from '../api/apiService';

export async function fetchLignes(activeOnly = false) {
  const data = await getLignes();
  if (!activeOnly) return data;
  return Array.isArray(data) ? data.filter((ligne: any) => ligne.estActive !== false) : data;
}

export async function fetchLigne(id: string) {
  const { data } = await axiosClient.get(`/lignes/${id}`);
  return data;
}

export async function fetchArrets(ligneId: string) {
  return getArretsByLigne(ligneId);
}

export async function fetchBus() {
  return getBus();
}

export async function fetchTrajets(ligneId: string) {
  const data = await axiosClient.get('/trajets');
  const trajets = data.data;
  return Array.isArray(trajets) ? trajets.filter((trajet: any) => trajet.ligneId === ligneId) : trajets;
}

export async function fetchMyInscriptions() {
  return getMyInscriptions();
}

export async function fetchAllInscriptions() {
  return getInscriptions();
}

export async function fetchMyPayments() {
  return getMyPaiements();
}

export async function fetchNotifications() {
  return getMyNotifications();
}

export async function fetchProfile() {
  const { data } = await axiosClient.get('/profile');
  return data;
}

export async function fetchMyBadge() {
  return getMyBadge();
}

export async function fetchTarifs() {
  return getTarifs();
}

export async function fetchChauffeurs() {
  return getChauffeurs();
}

export async function verifyBadge(qrCode: string) {
  const { data } = await axiosClient.post('/badges/verify', { qrCode });
  return data;
}
