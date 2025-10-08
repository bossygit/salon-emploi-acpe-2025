import React, { useState } from 'react';
import { Users, Calendar, MapPin, Briefcase, CheckCircle, AlertCircle, Download, QrCode, Mail, Phone, ExternalLink, Upload, Lightbulb, MessageCircle } from 'lucide-react';
import Image from 'next/image';

const RegistrationPlatform = () => {
  const [step, setStep] = useState('home');
  const [formData, setFormData] = useState<any>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: '',
    telephone: '',
    email: '',
    ville: '',
    region: '',
    niveauEtudes: '',
    domaineEtudes: '',
    situationActuelle: '',
    experienceAnnees: '',
    secteursInterets: [],
    cvFile: null,
    ideeProjet: '',
    inscritACPE: '',
    numeroACPE: '',
    souhaitInscriptionACPE: '',
    ateliersInterets: [],
    accepteConditions: false,
    accepteTraitementDonnees: false,
    accepteCommunications: false
  });

  const [registrationNumber, setRegistrationNumber] = useState('');
  const [errors, setErrors] = useState<any>({});

  const secteurs = [
    'Agriculture/Agroalimentaire',
    'Numérique/TIC',
    'BTP/Construction',
    'Tourisme/Hôtellerie',
    'Artisanat/Créatif',
    'Transport/Logistique'
  ];

  const regions = [
    'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Ouesso', 
    'Owando', 'Impfondo', 'Sibiti', 'Madingou', 
    'Gamboma', 'Kinkala', 'Djambala', 'Ewo'
  ];

  const ateliers = [
    'Rédaction de CV et lettre de motivation',
    'Simulation d\'entretien d\'embauche',
    'Business plan et auto-emploi',
    'Financement FONEA/FIGA',
    'Marketing digital',
    'Gestion d\'entreprise',
    'Techniques de recherche d\'emploi'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const handleMultiSelect = (field: string, value: string) => {
    setFormData((prev: any) => {
      const current = prev[field] as string[] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v: string) => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.nom) newErrors.nom = 'Le nom est obligatoire';
    if (!formData.prenom) newErrors.prenom = 'Le prénom est obligatoire';
    if (!formData.telephone) newErrors.telephone = 'Le téléphone est obligatoire';
    if (!formData.email) newErrors.email = 'L\'email est obligatoire';
    if (!formData.inscritACPE) newErrors.inscritACPE = 'Cette information est obligatoire';
    if (formData.inscritACPE === 'oui' && !formData.numeroACPE) {
      newErrors.numeroACPE = 'Le numéro ACPE est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const regNum = 'SALON2025-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setRegistrationNumber(regNum);
      setStep('confirmation');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (step === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary text-white">
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
                  <Image 
                    src="/logo.png" 
                    alt="Logo ACPE" 
                    width={32} 
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Inscription Salon de l&apos;Emploi</h1>
                  <p className="text-sm opacity-90">République du Congo</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-yellow-300">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">28-30 Octobre 2025</span>
                </div>
                <p className="text-sm opacity-75">Palais des Congrès, Brazzaville</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Inscrivez-vous au Salon National de l&apos;Emploi Jeune 2025
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Ne manquez pas cette opportunité unique de rencontrer plus de 100 entreprises
              et d&apos;accéder à 1000+ opportunités d&apos;emploi et d&apos;auto-emploi
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-800" />
                </div>
                <h3 className="font-bold text-lg mb-2">100+ Entreprises</h3>
                <p className="text-sm opacity-90 mb-3">Rencontrez directement les recruteurs</p>
                <a 
                  href="#" 
                  className="text-yellow-300 hover:text-yellow-200 text-sm font-medium inline-flex items-center space-x-1"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Liste des entreprises bientôt disponible !');
                  }}
                >
                  <span>Voir la liste des entreprises</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-green-800" />
                </div>
                <h3 className="font-bold text-lg mb-2">1000+ Opportunités</h3>
                <p className="text-sm opacity-90">Emplois, stages, formations</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-green-800" />
                </div>
                <h3 className="font-bold text-lg mb-2">3 Jours</h3>
                <p className="text-sm opacity-90">Ateliers, conférences, networking</p>
              </div>
            </div>

            <button
              onClick={() => setStep('registration')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-10 py-4 rounded-lg text-lg font-bold transition-all transform hover:scale-105 inline-flex items-center space-x-3"
            >
              <span>Commencer mon inscription</span>
              <CheckCircle className="w-6 h-6" />
            </button>

            <p className="mt-6 text-sm opacity-75">
              ✓ Inscription gratuite • ✓ Confirmation immédiate • ✓ Badge d'accès numérique
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'registration') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800">Formulaire d'inscription</h1>
              <button
                onClick={() => setStep('home')}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Retour
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              
              {/* Section 1: Informations personnelles */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">1</div>
                  Informations personnelles
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                      placeholder="Votre nom"
                    />
                    {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => handleInputChange('prenom', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                      placeholder="Votre prénom"
                    />
                    {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      value={formData.dateNaissance}
                      onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sexe
                    </label>
                    <select
                      value={formData.sexe}
                      onChange={(e) => handleInputChange('sexe', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                    >
                      <option value="">Sélectionner</option>
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange('telephone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                      placeholder="+242 XX XXX XXXX"
                    />
                    {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                      placeholder="votre.email@exemple.cg"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Région
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                    >
                      <option value="">Sélectionner une région</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={formData.ville}
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                      placeholder="Votre ville"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Profil professionnel */}
              <div className="mb-8 pt-8 border-t">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">2</div>
                  Profil professionnel
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Niveau d'études
                    </label>
                    <select
                      value={formData.niveauEtudes}
                      onChange={(e) => handleInputChange('niveauEtudes', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                    >
                      <option value="">Sélectionner</option>
                      <option value="bepc">BEPC</option>
                      <option value="bac">BAC</option>
                      <option value="bac+2">BAC+2/3</option>
                      <option value="bac+4">BAC+4/5</option>
                      <option value="formation">Formation technique</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Domaine d'études/formation
                    </label>
                    <input
                      type="text"
                      value={formData.domaineEtudes}
                      onChange={(e) => handleInputChange('domaineEtudes', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                      placeholder="Ex: Informatique, Commerce, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Situation actuelle
                    </label>
                    <select
                      value={formData.situationActuelle}
                      onChange={(e) => handleInputChange('situationActuelle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                    >
                      <option value="">Sélectionner</option>
                      <option value="etudiant">Étudiant(e)</option>
                      <option value="chercheur">Chercheur d'emploi</option>
                      <option value="formation">En formation</option>
                      <option value="employe">Employé(e)</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expérience professionnelle
                    </label>
                    <select
                      value={formData.experienceAnnees}
                      onChange={(e) => handleInputChange('experienceAnnees', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                    >
                      <option value="">Sélectionner</option>
                      <option value="0">Débutant (0 an)</option>
                      <option value="1-2">1 à 2 ans</option>
                      <option value="3-5">3 à 5 ans</option>
                      <option value="5+">Plus de 5 ans</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Secteurs d'intérêt (plusieurs choix possibles)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {secteurs.map(secteur => (
                        <label key={secteur} className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                          <input
                            type="checkbox"
                            checked={formData.secteursInterets.includes(secteur)}
                            onChange={() => handleMultiSelect('secteursInterets', secteur)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{secteur}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CV (optionnel)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Glissez-déposez votre CV ici ou cliquez pour sélectionner
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData((prev: any) => ({ ...prev, cvFile: file }));
                          }
                        }}
                        className="hidden"
                        id="cv-upload"
                      />
                      <label
                        htmlFor="cv-upload"
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors"
                      >
                        Choisir un fichier
                      </label>
                      {formData.cvFile && (
                        <p className="text-sm text-success mt-2">
                          ✓ {formData.cvFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2.5: Entrepreneuriat */}
              <div className="mb-8 pt-8 border-t">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">2.5</div>
                  Entrepreneuriat
                </h2>
                
                <div className="bg-blue-50 border-l-4 border-primary p-4 mb-6">
                  <div className="flex items-start">
                    <Lightbulb className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Vous avez une idée de projet ?</p>
                      <p>Partagez votre idée d'entrepreneuriat pour bénéficier d'un accompagnement personnalisé pendant le salon.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Décrivez votre idée de projet en quelques mots
                  </label>
                  <textarea
                    value={formData.ideeProjet}
                    onChange={(e) => handleInputChange('ideeProjet', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
                    placeholder="Ex: Créer une application mobile pour la livraison de produits locaux..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Cette information nous aidera à vous orienter vers les bons ateliers et conseillers.
                  </p>
                </div>
              </div>

              {/* Section 3: Inscription ACPE */}
              <div className="mb-8 pt-8 border-t">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center mr-3 text-sm">3</div>
                  Inscription ACPE
                </h2>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">Information importante</p>
                      <p>L'ACPE (Agence Congolaise Pour l'Emploi) est le service public de l'emploi au Congo. 
                      Être inscrit facilite votre accès aux offres d'emploi et services d'accompagnement.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Êtes-vous déjà inscrit(e) sur le site de l'ACPE ? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <input
                          type="radio"
                          name="inscritACPE"
                          value="oui"
                          checked={formData.inscritACPE === 'oui'}
                          onChange={(e) => handleInputChange('inscritACPE', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <span className="font-semibold text-gray-800">Oui, je suis inscrit(e)</span>
                          <p className="text-xs text-gray-600">J'ai déjà un compte sur le site de l'ACPE</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <input
                          type="radio"
                          name="inscritACPE"
                          value="non"
                          checked={formData.inscritACPE === 'non'}
                          onChange={(e) => handleInputChange('inscritACPE', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <span className="font-semibold text-gray-800">Non, je ne suis pas inscrit(e)</span>
                          <p className="text-xs text-gray-600">Je n'ai pas encore de compte ACPE</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <input
                          type="radio"
                          name="inscritACPE"
                          value="ne_sais_pas"
                          checked={formData.inscritACPE === 'ne_sais_pas'}
                          onChange={(e) => handleInputChange('inscritACPE', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <span className="font-semibold text-gray-800">Je ne sais pas</span>
                          <p className="text-xs text-gray-600">Je ne suis pas sûr(e) de mon statut</p>
                        </div>
                      </label>
                    </div>
                    {errors.inscritACPE && <p className="text-red-500 text-sm mt-2">{errors.inscritACPE}</p>}
                  </div>

                  {formData.inscritACPE === 'oui' && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Numéro d'inscription ACPE <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.numeroACPE}
                        onChange={(e) => handleInputChange('numeroACPE', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                        placeholder="Ex: ACPE2024XXXXX"
                      />
                      {errors.numeroACPE && <p className="text-red-500 text-xs mt-1">{errors.numeroACPE}</p>}
                      <p className="text-xs text-gray-600 mt-2">
                        Vous trouverez ce numéro sur votre espace personnel ACPE
                      </p>
                    </div>
                  )}

                  {formData.inscritACPE === 'non' && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Souhaitez-vous vous inscrire à l'ACPE ?
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="souhaitInscriptionACPE"
                            value="oui"
                            checked={formData.souhaitInscriptionACPE === 'oui'}
                            onChange={(e) => handleInputChange('souhaitInscriptionACPE', e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Oui, je souhaite m'inscrire</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="souhaitInscriptionACPE"
                            value="non"
                            checked={formData.souhaitInscriptionACPE === 'non'}
                            onChange={(e) => handleInputChange('souhaitInscriptionACPE', e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Non, pas pour le moment</span>
                        </label>
                      </div>
                      {formData.souhaitInscriptionACPE === 'oui' && (
                        <div className="mt-3 bg-white p-3 rounded">
                          <p className="text-xs text-blue-700 mb-2">
                          ✓ Un conseiller ACPE vous contactera pendant le salon pour finaliser votre inscription
                        </p>
                          <a
                            href="https://acpe.cg/register"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-primary hover:text-primary/80 text-sm font-medium"
                          >
                            <span>Ou inscrivez-vous directement sur le site ACPE</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Ateliers */}
              <div className="mb-8 pt-8 border-t">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">4</div>
                  Ateliers disponibles
                </h2>
                
                <div className="bg-primary/10 border-l-4 border-primary p-4 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-primary">
                      <p className="font-semibold mb-1">Programme du Salon</p>
                      <p>Sélectionnez les ateliers qui vous intéressent pour recevoir des informations personnalisées.</p>
                    </div>
                  </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ateliers d'intérêt (plusieurs choix possibles)
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {ateliers.map(atelier => (
                        <label key={atelier} className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                          <input
                            type="checkbox"
                            checked={formData.ateliersInterets.includes(atelier)}
                            onChange={() => handleMultiSelect('ateliersInterets', atelier)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{atelier}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

              {/* Boutons de validation */}
              <div className="flex justify-between items-center pt-8 border-t">
                <button
                  onClick={() => setStep('home')}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
                >
                  ← Annuler
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-bold transition-all transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <span>Valider mon inscription</span>
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary text-white">
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
                <Image 
                  src="/logo.png" 
                  alt="Logo ACPE" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">Inscription confirmée</h1>
                <p className="text-sm opacity-90">Salon de l'Emploi 2025</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-800" />
              </div>
              <h2 className="text-3xl font-bold mb-3">
                Félicitations {formData.prenom} !
              </h2>
              <p className="text-xl opacity-90">
                Votre inscription au Salon de l'Emploi a été confirmée avec succès
              </p>
            </div>

            {/* Récapitulatif d'inscription */}
            <div className="bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Inscription confirmée</h3>
                <p className="text-sm opacity-90">Récapitulatif de vos informations</p>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Informations du participant */}
                  <div>
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-600 mb-3">INFORMATIONS DU PARTICIPANT</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-sm text-gray-600">Numéro d'inscription :</span>
                          <span className="font-bold text-primary">{registrationNumber}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-sm text-gray-600">Nom complet :</span>
                          <span className="font-semibold">{formData.nom} {formData.prenom}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-sm text-gray-600">Email :</span>
                          <span className="text-sm">{formData.email}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-sm text-gray-600">Téléphone :</span>
                          <span className="text-sm">{formData.telephone}</span>
                        </div>
                        {formData.region && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-sm text-gray-600">Région :</span>
                            <span className="text-sm">{formData.region}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {formData.ateliersInterets.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">ATELIERS SÉLECTIONNÉS</h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.ateliersInterets.map((atelier: string) => (
                            <span key={atelier} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                              {atelier}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.ideeProjet && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">IDÉE DE PROJET</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {formData.ideeProjet}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Informations importantes */}
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-semibold mb-1">Retrait du badge</p>
                          <p>Votre badge d'accès sera disponible sur le lieu du salon. Présentez votre numéro d'inscription :</p>
                          <p className="font-mono font-bold text-lg mt-2">{registrationNumber}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border-l-4 border-success p-4">
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-green-800">
                          <p className="font-semibold mb-1">Confirmation envoyée</p>
                          <p>Un email de confirmation a été envoyé à <strong>{formData.email}</strong></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Réseautage WhatsApp */}
                <div className="mt-8 pt-6 border-t">
                  <div className="bg-green-50 border-l-4 border-success p-4 mb-6">
                    <div className="flex items-start">
                      <MessageCircle className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-green-800">
                        <p className="font-semibold mb-1">Rejoignez notre communauté</p>
                        <p className="mb-3">Restez connecté avec les autres participants et recevez les dernières informations sur le salon.</p>
                        <a
                          href="https://wa.me/242XXXXXXXXX?text=Salut!%20Je%20viens%20de%20m'inscrire%20au%20Salon%20de%20l'Emploi%202025"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 bg-success text-white px-4 py-2 rounded-lg font-medium hover:bg-success/90 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Rejoindre le groupe WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {formData.inscritACPE === 'non' && formData.souhaitInscriptionACPE === 'oui' && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-semibold mb-1">Inscription ACPE</p>
                          <p>Un conseiller ACPE vous contactera pendant le salon pour finaliser votre inscription à l'Agence Congolaise Pour l'Emploi.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={() => {
                      const text = `Inscription Salon de l'Emploi 2025\nNuméro: ${registrationNumber}\nNom: ${formData.nom} ${formData.prenom}\nEmail: ${formData.email}`;
                      navigator.clipboard.writeText(text);
                      alert('Informations copiées !');
                    }}
                    className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Copier les infos</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setStep('home');
                      setFormData({
                        nom: '', prenom: '', dateNaissance: '', sexe: '', telephone: '', email: '',
                        ville: '', region: '', niveauEtudes: '', domaineEtudes: '', situationActuelle: '',
                        experienceAnnees: '', secteursInterets: [], cvFile: null, ideeProjet: '',
                        inscritACPE: '', numeroACPE: '', souhaitInscriptionACPE: '', ateliersInterets: [],
                        accepteConditions: false, accepteTraitementDonnees: false, accepteCommunications: false
                      });
                      setRegistrationNumber('');
                    }}
                    className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-lg font-medium transition-all"
                  >
                    <Users className="w-5 h-5" />
                    <span>Nouvelle inscription</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Informations pratiques */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Informations pratiques
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-1">📅 Dates</p>
                  <p className="opacity-90">28, 29 et 30 octobre 2025</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">🕐 Horaires</p>
                  <p className="opacity-90">8h00 - 18h00 chaque jour</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">📍 Lieu</p>
                  <p className="opacity-90">Palais des Congrès, Brazzaville</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">🎫 Entrée</p>
                  <p className="opacity-90">Gratuite avec badge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RegistrationPlatform;
