const crypto = require('crypto');

// Générer un numéro d'inscription unique
const generateRegistrationNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SALON2025-${timestamp}-${random}`;
};

// Valider un numéro de téléphone congolais
const validateCongolesePhone = (phone) => {
  const phoneRegex = /^(\+242|242)?[0-9]{9}$/;
  return phoneRegex.test(phone);
};

// Formater un numéro de téléphone
const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Supprimer tous les espaces et caractères spéciaux
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Si commence par +242, garder tel quel
  if (cleaned.startsWith('+242')) {
    return cleaned;
  }
  
  // Si commence par 242, ajouter le +
  if (cleaned.startsWith('242')) {
    return '+' + cleaned;
  }
  
  // Si commence par 0, remplacer par +242
  if (cleaned.startsWith('0')) {
    return '+242' + cleaned.substring(1);
  }
  
  // Sinon, ajouter +242
  return '+242' + cleaned;
};

// Calculer l'âge à partir d'une date de naissance
const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Générer un mot de passe sécurisé
const generateSecurePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
};

// Nettoyer et valider les données d'inscription
const sanitizeRegistrationData = (data) => {
  const sanitized = {};
  
  // Champs texte - trim et escape
  const textFields = ['nom', 'prenom', 'ville', 'domaineEtudes', 'ideeProjet', 'numeroACPE'];
  textFields.forEach(field => {
    if (data[field]) {
      sanitized[field] = data[field].trim();
    }
  });
  
  // Email - normaliser
  if (data.email) {
    sanitized.email = data.email.toLowerCase().trim();
  }
  
  // Téléphone - formater
  if (data.telephone) {
    sanitized.telephone = formatPhoneNumber(data.telephone);
  }
  
  // Dates
  if (data.dateNaissance) {
    sanitized.dateNaissance = new Date(data.dateNaissance);
  }
  
  // Arrays - nettoyer et gérer les strings JSON du frontend
  const arrayFields = ['secteursInterets', 'joursParticipation', 'ateliersInterets'];
  arrayFields.forEach(field => {
    if (data[field]) {
      if (typeof data[field] === 'string') {
        try {
          // Essayer de parser le JSON
          const parsed = JSON.parse(data[field]);
          if (Array.isArray(parsed)) {
            sanitized[field] = parsed.filter(item => item && item.trim());
          }
        } catch (e) {
          // Si ce n'est pas du JSON valide, ignorer
          console.log(`Erreur parsing JSON pour ${field}:`, e.message);
        }
      } else if (Array.isArray(data[field])) {
        sanitized[field] = data[field].filter(item => item && item.trim());
      }
    }
  });
  
  // Booleans - gérer les strings "true"/"false" du frontend
  const booleanFields = ['accepteConditions', 'accepteTraitementDonnees', 'accepteCommunications'];
  booleanFields.forEach(field => {
    if (data[field] !== undefined) {
      // Convertir "true"/"false" strings en booléens
      if (typeof data[field] === 'string') {
        sanitized[field] = data[field] === 'true';
      } else {
        sanitized[field] = Boolean(data[field]);
      }
    }
  });
  
  // Copier les autres champs
  Object.keys(data).forEach(key => {
    if (!sanitized.hasOwnProperty(key)) {
      sanitized[key] = data[key];
    }
  });
  
  return sanitized;
};

// Valider les données d'inscription
const validateRegistrationData = (data) => {
  const errors = [];
  
  // Champs obligatoires
  const requiredFields = {
    nom: 'Le nom est obligatoire',
    prenom: 'Le prénom est obligatoire',
    dateNaissance: 'La date de naissance est obligatoire',
    sexe: 'Le sexe est obligatoire',
    telephone: 'Le téléphone est obligatoire',
    email: 'L\'email est obligatoire',
    inscritACPE: 'L\'information sur l\'inscription ACPE est obligatoire',
    accepteConditions: 'Vous devez accepter les conditions',
    accepteTraitementDonnees: 'Vous devez accepter le traitement des données'
  };
  
  Object.entries(requiredFields).forEach(([field, message]) => {
    if (!data[field]) {
      errors.push({ field, message });
    }
  });
  
  // Validation email
  if (data.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Format d\'email invalide' });
  }
  
  // Validation téléphone
  if (data.telephone && !validateCongolesePhone(data.telephone)) {
    errors.push({ field: 'telephone', message: 'Format de téléphone invalide' });
  }
  
  // Validation date de naissance
  if (data.dateNaissance) {
    const age = calculateAge(data.dateNaissance);
    if (age < 16) {
      errors.push({ field: 'dateNaissance', message: 'Vous devez avoir au moins 16 ans' });
    }
    if (age > 65) {
      errors.push({ field: 'dateNaissance', message: 'L\'âge maximum est de 65 ans' });
    }
  }
  
  // Validation sexe
  if (data.sexe && !['M', 'F'].includes(data.sexe)) {
    errors.push({ field: 'sexe', message: 'Le sexe doit être M ou F' });
  }
  
  // Validation inscription ACPE
  if (data.inscritACPE && !['oui', 'non', 'je-ne-sais-pas'].includes(data.inscritACPE)) {
    errors.push({ field: 'inscritACPE', message: 'Valeur invalide pour l\'inscription ACPE' });
  }
  
  // Si inscrit ACPE, vérifier le numéro (mais permettre de continuer sans)
  if (data.inscritACPE === 'oui' && !data.numeroACPE?.trim()) {
    console.log('⚠️ Avertissement: Inscrit ACPE mais pas de numéro fourni');
    // On ne bloque plus l'inscription, juste un avertissement
    // L'utilisateur pourra ajouter son numéro plus tard
  }
  
  return errors;
};

// Générer un token de réinitialisation
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Générer un hash pour un token
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Formater une date pour l'affichage
const formatDate = (date, locale = 'fr-FR') => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Formater une date et heure
const formatDateTime = (date, locale = 'fr-FR') => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Vérifier si une date est dans le futur
const isFutureDate = (date) => {
  if (!date) return false;
  return new Date(date) > new Date();
};

// Vérifier si une date est dans le passé
const isPastDate = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

// Obtenir les jours restants jusqu'à une date
const getDaysUntil = (date) => {
  if (!date) return null;
  
  const target = new Date(date);
  const today = new Date();
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Logger avec timestamp
const logWithTimestamp = (message, level = 'INFO') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${level}: ${message}`);
};

// Gérer les erreurs de manière cohérente
const handleError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const errorMessage = context ? `${context}: ${error.message}` : error.message;
  
  console.error(`[${timestamp}] ERROR: ${errorMessage}`);
  console.error(error.stack);
  
  return {
    message: errorMessage,
    timestamp,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  };
};

module.exports = {
  generateRegistrationNumber,
  validateCongolesePhone,
  formatPhoneNumber,
  calculateAge,
  generateSecurePassword,
  sanitizeRegistrationData,
  validateRegistrationData,
  generateResetToken,
  hashToken,
  formatDate,
  formatDateTime,
  isFutureDate,
  isPastDate,
  getDaysUntil,
  logWithTimestamp,
  handleError
};
