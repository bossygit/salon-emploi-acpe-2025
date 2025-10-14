// API utilities pour la plateforme d'enregistrement
// Configuration pour le backend déployé

// URL du backend (Vercel)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-mauve-phi-53.vercel.app/api';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface RegistrationData {
    nom: string;
    prenom: string;
    dateNaissance: string;
    sexe: string;
    telephone: string;
    email: string;
    ville: string;
    region: string;
    niveauEtudes: string;
    domaineEtudes: string;
    situationActuelle: string;
    experienceAnnees: string;
    secteursInterets: string[];
    cvFile?: File | null;
    ideeProjet: string;
    inscritACPE: string;
    numeroACPE: string;
    souhaitInscriptionACPE: string;
    joursParticipation: string[];
    objectifPrincipal: string;
    panelsInterets: string[];
    accepteConditions: string;
    accepteTraitementDonnees: string;
    accepteCommunications: string;
}

export interface ACPEVerificationData {
    valid: boolean;
    alreadyUsed: boolean;
    message: string;
    data?: {
        usedBy?: {
            nom: string;
            prenom: string;
            email: string;
        };
    };
}

// API d'inscription (appel réel au backend)
export const registrationAPI = {
    async create(data: RegistrationData, cvFile?: File | null): Promise<ApiResponse<{ numeroInscription: string }>> {
        try {
            const formData = new FormData();

            // Ajouter toutes les données du formulaire
            Object.entries(data).forEach(([key, value]) => {
                if (key !== 'cvFile' && value !== null && value !== undefined) {
                    if (Array.isArray(value)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            });

            // Ajouter le fichier CV s'il existe
            if (cvFile) {
                formData.append('cv', cvFile);
            }

            const response = await fetch(`${API_BASE_URL}/registration`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.message || 'Erreur lors de l\'inscription'
                };
            }

            return {
                success: true,
                data: { numeroInscription: result.data.numeroInscription },
                message: result.message || 'Inscription créée avec succès'
            };
        } catch (error) {
            console.error('Registration API error:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur. Veuillez réessayer.'
            };
        }
    }
};

// API de vérification ACPE (appel réel au backend)
export const acpeAPI = {
    async verify(numeroACPE: string, email: string): Promise<ApiResponse<ACPEVerificationData>> {
        try {
            const response = await fetch(`${API_BASE_URL}/acpe/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numeroACPE, email }),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.message || 'Erreur lors de la vérification ACPE'
                };
            }

            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error('ACPE verification error:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur. Veuillez réessayer.'
            };
        }
    }
};

// Gestionnaire d'erreurs API
export const handleApiError = (error: any): string => {
    console.error('API Error:', error);

    if (error?.response?.status === 400) {
        return 'Données invalides. Vérifiez vos informations.';
    }

    if (error?.response?.status === 409) {
        return 'Cette inscription existe déjà.';
    }

    if (error?.response?.status >= 500) {
        return 'Erreur serveur. Veuillez réessayer plus tard.';
    }

    if (error?.code === 'NETWORK_ERROR') {
        return 'Erreur de connexion. Vérifiez votre internet.';
    }

    return 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
};

// Validation des données d'inscription
export const validateRegistrationData = (data: RegistrationData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validation des champs obligatoires
    if (!data.nom?.trim()) errors.push('Le nom est obligatoire');
    if (!data.prenom?.trim()) errors.push('Le prénom est obligatoire');
    if (!data.telephone?.trim()) errors.push('Le téléphone est obligatoire');
    if (!data.email?.trim()) errors.push('L\'email est obligatoire');
    if (!data.inscritACPE) errors.push('Le statut ACPE est obligatoire');
    if (!data.situationActuelle) errors.push('La situation actuelle est obligatoire');
    if (!data.objectifPrincipal) errors.push('L\'objectif principal est obligatoire');
    if (!data.joursParticipation?.length) errors.push('Au moins un jour de participation est requis');

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        errors.push('Format d\'email invalide');
    }

    // Validation du téléphone
    const phoneRegex = /^(\+242|242)?[0-9]{9}$/;
    if (data.telephone && !phoneRegex.test(data.telephone.replace(/\s/g, ''))) {
        errors.push('Format de téléphone invalide (ex: +242 XX XXX XXXX)');
    }

    // Validation des acceptations
    if (data.accepteConditions !== 'true') {
        errors.push('Vous devez accepter les conditions d\'utilisation');
    }
    if (data.accepteTraitementDonnees !== 'true') {
        errors.push('Vous devez accepter le traitement des données personnelles');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
