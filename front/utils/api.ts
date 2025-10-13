// API utilities pour la plateforme d'enregistrement
// Simulation des appels API pour le développement

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
    horairePrefere: string;
    objectifPrincipal: string;
    ateliersInterets: string[];
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

// Simulation de l'API d'inscription
export const registrationAPI = {
    async create(data: RegistrationData, cvFile?: File | null): Promise<ApiResponse<{ numeroInscription: string }>> {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Génération d'un numéro d'inscription simulé
        const numeroInscription = `ACPE2025${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

        // Simulation de succès (90% de chance)
        if (Math.random() > 0.1) {
            return {
                success: true,
                data: { numeroInscription },
                message: 'Inscription créée avec succès'
            };
        } else {
            return {
                success: false,
                message: 'Erreur lors de la création de l\'inscription. Veuillez réessayer.'
            };
        }
    }
};

// Simulation de l'API de vérification ACPE
export const acpeAPI = {
    async verify(numeroACPE: string, email: string): Promise<ApiResponse<ACPEVerificationData>> {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulation de la vérification
        const isValid = numeroACPE.length >= 8 && numeroACPE.includes('ACPE');
        const alreadyUsed = Math.random() > 0.7; // 30% de chance d'être déjà utilisé

        if (!isValid) {
            return {
                success: true,
                data: {
                    valid: false,
                    alreadyUsed: false,
                    message: 'Numéro ACPE invalide. Vérifiez le format.'
                }
            };
        }

        if (alreadyUsed) {
            return {
                success: true,
                data: {
                    valid: true,
                    alreadyUsed: true,
                    message: 'Ce numéro ACPE est déjà utilisé pour une autre inscription.',
                    data: {
                        usedBy: {
                            nom: 'Dupont',
                            prenom: 'Jean',
                            email: 'jean.dupont@example.cg'
                        }
                    }
                }
            };
        }

        return {
            success: true,
            data: {
                valid: true,
                alreadyUsed: false,
                message: 'Numéro ACPE vérifié avec succès.'
            }
        };
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
    if (!data.horairePrefere) errors.push('L\'horaire préféré est obligatoire');
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
