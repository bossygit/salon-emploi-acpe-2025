export interface Registration {
  _id: string;
  numeroInscription: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  region: string;
  niveauEtudes: string;
  situationActuelle: string;
  experienceAnnees: number;
  secteursInterets: string[];
  inscritACPE: 'oui' | 'non' | 'je-ne-sais-pas';
  numeroACPE?: string;
  joursParticipation: string[];
  horairePrefere: string;
  objectifPrincipal: string;
  statut: 'en-attente' | 'confirme' | 'annule';
  entryMarked: boolean;
  entryTime?: string;
  qrCode: {
    data: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  totalInscriptions: number;
  inscriptionsConfirmees: number;
  inscriptionsAnnulees?: number;
  entriesMarked?: number;
}

export interface QRVerificationResult {
  success: boolean;
  message: string;
  data?: {
    numeroInscription: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    statut: string;
    entryMarked: boolean;
    entryTime?: string;
    createdAt: string;
    status: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}
