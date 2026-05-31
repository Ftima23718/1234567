export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(amount) + ' DZD';
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatutColor(statut: string): string {
  switch (statut) {
    case 'EN_ATTENTE': return 'badge-pending';
    case 'VALIDEE': return 'badge-success';
    case 'REJETEE': return 'badge-error';
    case 'EXPIREE': return 'badge-info';
    case 'PAYE': return 'badge-success';
    case 'ANNULE': return 'badge-error';
    case 'ACTIF': return 'badge-success';
    case 'EN_MAINTENANCE': return 'badge-pending';
    case 'HORS_SERVICE': return 'badge-error';
    default: return 'badge-info';
  }
}

export function getStatutLabel(statut: string): string {
  switch (statut) {
    case 'EN_ATTENTE': return 'En attente';
    case 'VALIDEE': return 'Validee';
    case 'REJETEE': return 'Rejetee';
    case 'EXPIREE': return 'Expiree';
    case 'PAYE': return 'Paye';
    case 'ANNULE': return 'Annule';
    case 'ACTIF': return 'Actif';
    case 'EN_MAINTENANCE': return 'En maintenance';
    case 'HORS_SERVICE': return 'Hors service';
    default: return statut;
  }
}

export function getTypeAbonnementLabel(type: string): string {
  switch (type) {
    case 'MENSUEL': return 'Mensuel';
    case 'SEMESTRIEL': return 'Semestriel';
    case 'ANNUEL': return 'Annuel';
    default: return type;
  }
}
