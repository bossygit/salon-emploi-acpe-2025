const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const registrationSchema = new mongoose.Schema({
  // Informations personnelles
  nom: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est obligatoire'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  dateNaissance: {
    type: Date,
    required: [true, 'La date de naissance est obligatoire']
  },
  sexe: {
    type: String,
    enum: ['M', 'F'],
    required: [true, 'Le sexe est obligatoire']
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est obligatoire'],
    unique: true,
    match: [/^(\+242|242)?[0-9]{9}$/, 'Format de téléphone invalide']
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Format d\'email invalide']
  },
  ville: {
    type: String,
    trim: true,
    maxlength: [50, 'Le nom de la ville ne peut pas dépasser 50 caractères']
  },
  region: {
    type: String,
    enum: [
      'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Ouesso',
      'Owando', 'Impfondo', 'Sibiti', 'Madingou',
      'Gamboma', 'Kinkala', 'Djambala', 'Ewo'
    ]
  },

  // Profil professionnel
  niveauEtudes: {
    type: String,
    enum: [
      'Primaire', 'Secondaire', 'Baccalauréat', 'BTS/DUT',
      'Licence', 'Master', 'Doctorat', 'Autre'
    ]
  },
  domaineEtudes: {
    type: String,
    trim: true,
    maxlength: [100, 'Le domaine d\'études ne peut pas dépasser 100 caractères']
  },
  situationActuelle: {
    type: String,
    enum: [
      'Étudiant', 'Chômeur', 'Employé', 'Auto-entrepreneur',
      'Fonctionnaire', 'Retraité', 'Autre'
    ]
  },
  experienceAnnees: {
    type: Number,
    min: [0, 'L\'expérience ne peut pas être négative'],
    max: [50, 'L\'expérience ne peut pas dépasser 50 ans']
  },
  secteursInterets: [{
    type: String,
    enum: [
      'Agriculture/Agroalimentaire',
      'Numérique/TIC',
      'BTP/Construction',
      'Tourisme/Hôtellerie',
      'Artisanat/Créatif',
      'Transport/Logistique'
    ]
  }],
  cvFile: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  },
  ideeProjet: {
    type: String,
    maxlength: [500, 'L\'idée de projet ne peut pas dépasser 500 caractères']
  },

  // Inscription ACPE
  inscritACPE: {
    type: String,
    required: [true, 'L\'information sur l\'inscription ACPE est obligatoire'],
    enum: ['oui', 'non', 'je-ne-sais-pas']
  },
  numeroACPE: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        // Si inscrit ACPE, le numéro est recommandé mais pas obligatoire
        // L'utilisateur pourra l'ajouter plus tard
        return true;
      },
      message: 'Format de numéro ACPE invalide'
    }
  },
  souhaitInscriptionACPE: {
    type: String,
    enum: ['oui', 'non', 'peut-etre']
  },

  // Préférences salon
  joursParticipation: [{
    type: String,
    enum: ['2025-10-28', '2025-10-29', '2025-10-30']
  }],
  horairePrefere: {
    type: String,
    enum: ['matin', 'apres-midi', 'toute-la-journee']
  },
  objectifPrincipal: {
    type: String,
    enum: ['emploi', 'auto-emploi', 'formation', 'les-trois']
  },
  ateliersInterets: [{
    type: String,
    enum: [
      'Rédaction de CV et lettre de motivation',
      'Simulation d\'entretien d\'embauche',
      'Business plan et auto-emploi',
      'Financement FONEA/FIGA',
      'Marketing digital',
      'Gestion d\'entreprise',
      'Techniques de recherche d\'emploi'
    ]
  }],

  // Données système
  numeroInscription: {
    type: String,
    unique: true,
    required: true
  },
  qrCode: {
    data: String,
    image: String
  },
  statut: {
    type: String,
    enum: ['en-attente', 'confirme', 'annule'],
    default: 'confirme'
  },
  entryMarked: {
    type: Boolean,
    default: false
  },
  entryTime: {
    type: Date,
    default: null
  },
  accepteConditions: {
    type: Boolean,
    required: [true, 'Vous devez accepter les conditions d\'utilisation']
  },
  accepteTraitementDonnees: {
    type: Boolean,
    required: [true, 'Vous devez accepter le traitement des données']
  },
  accepteCommunications: {
    type: Boolean,
    default: false
  },

  // Métadonnées
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les recherches
registrationSchema.index({ email: 1 });
registrationSchema.index({ telephone: 1 });
registrationSchema.index({ numeroInscription: 1 });
registrationSchema.index({ statut: 1 });
registrationSchema.index({ createdAt: -1 });

// Virtual pour le nom complet
registrationSchema.virtual('nomComplet').get(function() {
  return `${this.prenom} ${this.nom}`;
});

// Virtual pour l'âge
registrationSchema.virtual('age').get(function() {
  if (!this.dateNaissance) return null;
  const today = new Date();
  const birthDate = new Date(this.dateNaissance);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Middleware pre-save pour générer le numéro d'inscription
registrationSchema.pre('save', async function(next) {
  if (this.isNew && !this.numeroInscription) {
    const count = await this.constructor.countDocuments();
    this.numeroInscription = `SALON2025-${String(count + 1).padStart(6, '0')}`;
  }
  this.updatedAt = new Date();
  next();
});

// Méthodes d'instance
registrationSchema.methods.generateQRCode = function() {
  const qrData = {
    numeroInscription: this.numeroInscription,
    nom: this.nom,
    prenom: this.prenom,
    email: this.email,
    telephone: this.telephone,
    statut: this.statut
  };
  return JSON.stringify(qrData);
};

registrationSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.ipAddress;
  delete obj.userAgent;
  return obj;
};

// Méthodes statiques
registrationSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

registrationSchema.statics.findByPhone = function(phone) {
  return this.findOne({ telephone: phone });
};

registrationSchema.statics.findByRegistrationNumber = function(numero) {
  return this.findOne({ numeroInscription: numero });
};

registrationSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        confirmes: { $sum: { $cond: [{ $eq: ['$statut', 'confirme'] }, 1, 0] } },
        annules: { $sum: { $cond: [{ $eq: ['$statut', 'annule'] }, 1, 0] } }
      }
    }
  ]);
  
  return stats[0] || { total: 0, confirmes: 0, annules: 0 };
};

module.exports = mongoose.model('Registration', registrationSchema);
