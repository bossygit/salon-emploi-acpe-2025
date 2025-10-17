import React, { useState } from 'react';
import { Users, Calendar, MapPin, Briefcase, CheckCircle, AlertCircle, Download, QrCode, Mail, Phone, ExternalLink, Upload, Lightbulb, MessageCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { registrationAPI, handleApiError, validateRegistrationData } from './utils/api';

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
    joursParticipation: [],
    objectifPrincipal: '',
    panelsInterets: [],
    accepteConditions: false,
    accepteTraitementDonnees: false,
    accepteCommunications: false
  });

  const [registrationNumber, setRegistrationNumber] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  // États de vérification ACPE supprimés (fonctionnalité désactivée)

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

  const panels = [
    {
      id: 'panel1',
      titre: 'Panel 1 : Défis du marché de l\'emploi local',
      objectifs: [
        'Présentation des Secteurs d\'activités',
        'Métiers en tension',
        'Niveau requis',
        'Niveau de tension (fort, faible, moyen)',
        'Solutions proposées'
      ]
    },
    {
      id: 'panel2',
      titre: 'Panel 2 : L\'adéquation formation - emploi : rôle des universités et centres de formation',
      objectifs: [
        'Analyse des différents axes',
        'Diagnostic',
        'Rôle des acteurs',
        'Compétences clés',
        'Outils et initiatives'
      ]
    },
    {
      id: 'panel3',
      titre: 'Panel 3 : Les secteurs qui recrutent : tendances et perspectives',
      objectifs: [
        'Axe d\'analyse',
        'Cartographie actuelle',
        'Évolution du marché',
        'Compétences recherchées',
        'Vision prospective'
      ]
    },
    {
      id: 'panel4',
      titre: 'Panel 4 : L\'entrepreneuriat comme voie d\'insertion professionnelle',
      objectifs: [
        'Contexte et enjeux',
        'Écosystème entrepreneurial',
        'Formation et accompagnement',
        'Témoignages et modèles',
        'Solutions intégrées'
      ]
    }
  ];

  const joursSalon = [
    '2025-10-28',
    '2025-10-29',
    '2025-10-30'
  ];

  // Horaires supprimés (champ retiré du formulaire)

  const objectifs = [
    'emploi',
    'auto-emploi',
    'formation',
    'les-trois'
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
    const errorMessages: string[] = [];

    // Champs obligatoires de base
    if (!formData.nom) {
      newErrors.nom = 'Le nom est obligatoire';
      errorMessages.push('Le nom est obligatoire');
    }
    if (!formData.prenom) {
      newErrors.prenom = 'Le prénom est obligatoire';
      errorMessages.push('Le prénom est obligatoire');
    }
    if (!formData.telephone) {
      newErrors.telephone = 'Le téléphone est obligatoire';
      errorMessages.push('Le téléphone est obligatoire');
    }
    if (!formData.email) {
      newErrors.email = 'L\'email est obligatoire';
      errorMessages.push('L\'email est obligatoire');
    }
    if (!formData.inscritACPE) {
      newErrors.inscritACPE = 'Cette information est obligatoire';
      errorMessages.push('Le statut d\'inscription ACPE est obligatoire');
    }

    // ACPE (numéro optionnel maintenant)
    if (formData.inscritACPE === 'oui' && !formData.numeroACPE) {
      // Juste un avertissement, pas d'erreur bloquante
      console.log('⚠️ Avertissement: Inscrit ACPE mais pas de numéro fourni');
    }

    // NOUVEAUX CHAMPS OBLIGATOIRES
    if (!formData.situationActuelle || formData.situationActuelle === '') {
      newErrors.situationActuelle = 'La situation actuelle est obligatoire';
      errorMessages.push('La situation actuelle est obligatoire');
    }
    // Horaire préféré supprimé
    if (!formData.objectifPrincipal || formData.objectifPrincipal === '') {
      newErrors.objectifPrincipal = 'L\'objectif principal est obligatoire';
      errorMessages.push('L\'objectif principal est obligatoire');
    }
    if (!formData.joursParticipation || formData.joursParticipation.length === 0) {
      newErrors.joursParticipation = 'Veuillez sélectionner au moins un jour de participation';
      errorMessages.push('Au moins un jour de participation doit être sélectionné');
    }

    // Validation des acceptations
    if (!formData.accepteConditions) {
      newErrors.accepteConditions = 'Vous devez accepter les conditions d\'utilisation';
      errorMessages.push('Vous devez accepter les conditions d\'utilisation');
    }
    if (!formData.accepteTraitementDonnees) {
      newErrors.accepteTraitementDonnees = 'Vous devez accepter le traitement des données personnelles';
      errorMessages.push('Vous devez accepter le traitement des données personnelles');
    }

    setErrors(newErrors);
    setValidationErrors(errorMessages);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setValidationErrors([]);

    try {
      // Préparer les données pour l'API
      const registrationData = {
        ...formData,
        accepteConditions: formData.accepteConditions.toString(),
        accepteTraitementDonnees: formData.accepteTraitementDonnees.toString(),
        accepteCommunications: formData.accepteCommunications.toString(),
      };

      // Appeler l'API pour créer l'inscription
      const response = await registrationAPI.create(registrationData, formData.cvFile);

      if (response.success && response.data) {
        setRegistrationNumber(response.data.numeroInscription);
        setStep('confirmation');
      } else {
        const generic = 'Une erreur est survenue lors de l\'inscription.';
        const help = `\nConseils:\n- Vérifiez votre connexion Internet\n- Réessayez dans quelques instants\n- Si le problème persiste, contactez le support`;
        setSubmitError((response.message || generic) + help);
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
      const msg = handleApiError(error);
      setSubmitError(`${msg}\n(La requête n'a pas pu aboutir. Assurez-vous que le serveur est accessible.)`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction de vérification ACPE supprimée (fonctionnalité désactivée)

  if (step === 'home') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background avec image et overlay */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/1.jpg"
              alt="Salon de l'Emploi"
              fill
              className="object-cover parallax-bg"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Particules flottantes */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-white/30 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-success rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-60 right-40 w-5 h-5 bg-secondary rounded-full animate-float opacity-30" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Header moderne */}
        <header className="relative z-20 glass border-b border-white/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4 animate-fadeInLeft">
                <div className="relative">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-3 shadow-lg hover-glow">
                    <Image
                      src="/logo.png"
                      alt="Logo ACPE"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">2025</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white text-shadow">Salon de l&apos;Emploi</h1>
                  <p className="text-sm text-white/90">République du Congo</p>
                </div>
              </div>
              <div className="text-right animate-fadeInRight">
                <div className="flex items-center space-x-3 text-white">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-lg">13-15 Novembre 2025</span>
                    <p className="text-sm text-white/80">Palais des Congrès, Brazzaville</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="relative z-20 container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <span className="bg-gradient-to-r from-primary to-success text-white px-8 py-3 rounded-full text-sm font-bold animate-bounce-custom shadow-lg">
                  ÉVÉNEMENT NATIONAL
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white text-shadow animate-fadeInUp">
                <span className="block">Salon de l&apos;Emploi</span>

              </h2>

              <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                Transformez votre avenir professionnel ! Rencontrez plus de
                <span className="text-white font-black animate-pulse-custom"> 100 entreprises</span> et accédez à
                <span className="text-white font-black animate-pulse-custom" style={{ animationDelay: '0.5s' }}> 1000+ opportunités</span> d&apos;emploi.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                <button
                  onClick={() => setStep('registration')}
                  className="group relative bg-gradient-to-r from-secondary to-red-600 text-white px-12 py-5 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 hover-glow inline-flex items-center space-x-3 shadow-2xl"
                >
                  <span className="relative z-10">Commencer mon inscription</span>
                  <CheckCircle className="w-6 h-6 relative z-10 group-hover:animate-bounce-custom" />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-secondary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <div className="flex items-center space-x-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm">Inscription gratuite</span>
                </div>
              </div>
            </div>

            {/* Cards avec animations - Design innovant */}
            <div className="grid md:grid-cols-3 gap-8 mb-16 items-stretch">
              {/* Card 1: Entreprises */}
              <div className="group relative animate-fadeInUp flex flex-col" style={{ animationDelay: '0.9s' }}>
                <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 shadow-2xl flex flex-col h-full">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute bottom-4 left-4 w-24 h-24 bg-secondary rounded-full blur-2xl"></div>
                  </div>

                  <div className="relative p-8 flex flex-col flex-grow">
                    {/* Header avec icône flottante */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center animate-pulse-custom">
                          <span className="text-white text-xs font-black">100+</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-primary mb-1">100+</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Entreprises</div>
                      </div>
                    </div>

                    {/* Contenu */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Recruteurs Premium</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">Rencontrez les décideurs des plus grandes entreprises du Congo</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">Recrutement</span>
                      <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-medium">Networking</span>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Liste des entreprises bientôt disponible !');
                      }}
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mt-auto"
                    >
                      <span>Découvrir les entreprises</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Opportunités */}
              <div className="group relative animate-fadeInUp flex flex-col" style={{ animationDelay: '1.2s' }}>
                <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-success/20 hover:border-success/40 transition-all duration-500 hover:scale-105 shadow-2xl flex flex-col h-full">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 bg-success rounded-full blur-3xl"></div>
                    <div className="absolute bottom-4 left-4 w-24 h-24 bg-primary rounded-full blur-2xl"></div>
                  </div>

                  <div className="relative p-8 flex flex-col flex-grow">
                    {/* Header avec icône flottante */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-success to-green-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300">
                          <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-pulse-custom">
                          <span className="text-white text-xs font-black">1000+</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-success mb-1">1000+</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Offres</div>
                      </div>
                    </div>

                    {/* Contenu */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Opportunités d'Or</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">Emplois, stages, formations et accompagnement à l'entrepreneuriat</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-success/20 text-success px-3 py-1 rounded-full text-xs font-medium">Emplois</span>
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">Stages</span>
                      <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-medium">Formations</span>
                    </div>

                    {/* Action button */}
                    <button className="w-full bg-gradient-to-r from-success to-green-600 hover:from-green-600 hover:to-success text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mt-auto">
                      <span>Explorer les offres</span>
                      <Briefcase className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3: Programme */}
              <div className="group relative animate-fadeInUp flex flex-col" style={{ animationDelay: '1.5s' }}>
                <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm border border-secondary/20 hover:border-secondary/40 transition-all duration-500 hover:scale-105 shadow-2xl flex flex-col h-full">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 bg-secondary rounded-full blur-3xl"></div>
                    <div className="absolute bottom-4 left-4 w-24 h-24 bg-success rounded-full blur-2xl"></div>
                  </div>

                  <div className="relative p-8 flex flex-col flex-grow">
                    {/* Header avec icône flottante */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-secondary to-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-pulse-custom">
                          <span className="text-white text-xs font-black">3</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-secondary mb-1">3</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Jours</div>
                      </div>
                    </div>

                    {/* Contenu */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Programme Intensif</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">Ateliers pratiques, conférences inspirantes et networking de qualité</p>

                    {/* Liste des activités */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse-custom"></div>
                        <span className="text-gray-600 text-sm">Ateliers CV & entretiens</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse-custom" style={{ animationDelay: '0.5s' }}></div>
                        <span className="text-gray-600 text-sm">Conférences métier</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse-custom" style={{ animationDelay: '1s' }}></div>
                        <span className="text-gray-600 text-sm">Networking premium</span>
                      </div>
                    </div>

                    {/* Action button */}
                    <button className="w-full bg-gradient-to-r from-secondary to-red-600 hover:from-red-600 hover:to-secondary text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mt-auto">
                      <span>Voir le programme</span>
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section statistiques - Design moderne full width */}
            <div className="w-screen bg-white py-24 animate-fadeInUp relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" style={{ animationDelay: '1.8s' }}>
              <div className="w-full px-8">
                <div className="text-center mb-24">
                  <div className="inline-block mb-12">
                    <span className="bg-primary text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider">
                      Nos Résultats
                    </span>
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 mb-12 leading-tight">
                    <span className="block">Des chiffres qui</span>
                    <span className="block text-primary">parlent d&apos;eux-mêmes</span>
                  </h3>
                  <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">La preuve de notre excellence à travers des statistiques impressionnantes</p>
                </div>

                {/* Design en ligne horizontale */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                  {/* Stat 1 */}
                  <div className="flex-1 text-center group">
                    <div className="w-28 h-28 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-500 shadow-2xl">
                      <span className="text-2xl font-black text-white">95%</span>
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 mb-4">Excellence</h4>
                    <p className="text-gray-600 text-base leading-relaxed mb-6">Taux de satisfaction exceptionnel</p>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="bg-primary h-4 rounded-full transition-all duration-2000" style={{ width: '95%' }}></div>
                    </div>
                  </div>

                  {/* Séparateur vertical */}
                  <div className="hidden lg:block w-px h-32 bg-gray-300"></div>

                  {/* Stat 2 */}
                  <div className="flex-1 text-center group">
                    <div className="w-28 h-28 bg-success rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-500 shadow-2xl">
                      <span className="text-2xl font-black text-white">500+</span>
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 mb-4">Succès</h4>
                    <p className="text-gray-600 text-base leading-relaxed mb-6">Jeunes placés l&apos;an dernier</p>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="bg-success h-4 rounded-full transition-all duration-2000" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  {/* Séparateur vertical */}
                  <div className="hidden lg:block w-px h-32 bg-gray-300"></div>

                  {/* Stat 3 */}
                  <div className="flex-1 text-center group">
                    <div className="w-28 h-28 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-500 shadow-2xl">
                      <span className="text-2xl font-black text-white">50+</span>
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 mb-4">Diversité</h4>
                    <p className="text-gray-600 text-base leading-relaxed mb-6">Secteurs d&apos;activité représentés</p>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="bg-secondary h-4 rounded-full transition-all duration-2000" style={{ width: '75%' }}></div>
                    </div>
                  </div>


                </div>

                {/* Call to action en bas */}
                <div className="text-center mt-24">
                  <div className="inline-flex items-center space-x-8 bg-gray-50 rounded-3xl px-16 py-8 border-2 border-gray-200">
                    <div className="w-6 h-6 bg-success rounded-full"></div>
                    <span className="text-gray-900 font-bold text-lg">Rejoignez des milliers de jeunes qui ont déjà fait le choix de la réussite</span>
                    <div className="w-6 h-6 bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to action final - Design moderne */}
            <div className="text-center mt-20 animate-fadeInUp" style={{ animationDelay: '2.1s' }}>
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 max-w-4xl mx-auto shadow-2xl border border-white/20">
                <div className="mb-8">
                  <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                    🚀 Action
                  </span>
                </div>

                <h3 className="text-4xl font-black text-gray-900 mb-6">Prêt à transformer votre avenir ?</h3>
                <p className="text-gray-600 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">Rejoignez des milliers de jeunes congolais qui ont déjà fait le choix de leur réussite professionnelle.</p>

                {/* Avantages en grille */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  <div className="flex items-center justify-center space-x-3 bg-success/10 rounded-2xl p-4">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800 font-semibold">Inscription gratuite</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 bg-primary/10 rounded-2xl p-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800 font-semibold">Confirmation immédiate</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 bg-secondary/10 rounded-2xl p-4">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800 font-semibold">Badge d&apos;accès numérique</span>
                  </div>
                </div>

                {/* Bouton principal */}
                <button
                  onClick={() => setStep('registration')}
                  className="group relative bg-gradient-to-r from-primary to-success text-white px-16 py-5 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 hover-glow inline-flex items-center space-x-4 shadow-2xl"
                >
                  <span className="relative z-10">Commencer mon inscription</span>
                  <CheckCircle className="w-6 h-6 relative z-10 group-hover:animate-bounce-custom" />
                  <div className="absolute inset-0 bg-gradient-to-r from-success to-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'registration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
        {/* Header moderne avec design épuré */}
        <header className="bg-white shadow-2xl border-b-4 border-primary sticky top-0 z-10">
          <div className="container mx-auto px-8 py-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="relative group">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-4 shadow-2xl border-4 border-primary group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/logo.png"
                      alt="Logo ACPE"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg animate-pulse-custom">
                    <span className="text-white text-sm font-bold">📝</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <h1 className="text-4xl font-black text-gray-900">Inscription</h1>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse-custom"></div>
                  </div>
                  <p className="text-xl text-gray-700 mb-4">Salon de l'Emploi 2025</p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="text-gray-600 font-semibold">Inscription gratuite</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-gray-600 font-semibold">Confirmation immédiate</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setStep('home')}
                className="group flex items-center space-x-4 text-gray-800 hover:text-white transition-all duration-300 px-8 py-4 rounded-2xl bg-gray-100 hover:bg-primary border-2 border-gray-200 hover:border-primary shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-2xl group-hover:-translate-x-2 transition-transform duration-300">←</span>
                <span className="font-bold text-lg">Retour</span>
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress bar moderne */}
            <div className="mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Progression de l'inscription</h3>
                  <span className="text-sm font-semibold text-primary">Étape 1 sur 4</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-success rounded-full w-1/4 transition-all duration-1000 ease-out"></div>
                </div>
                <p className="text-center text-gray-600 mt-3 font-medium">Informations personnelles</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 md:p-16 animate-fadeInUp">

              {/* Affichage des erreurs de validation */}
              {validationErrors.length > 0 && (
                <div className="mb-8 bg-red-50 border-2 border-red-500 text-red-800 px-6 py-5 rounded-2xl shadow-lg animate-shake">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-red-800 mb-3">⚠️ Veuillez corriger les erreurs suivantes :</h4>
                      <ul className="list-disc list-inside space-y-2">
                        {validationErrors.map((error, index) => (
                          <li key={index} className="text-sm font-medium">{error}</li>
                        ))}
                      </ul>
                      <p className="text-sm mt-4 text-red-700 font-semibold">
                        👇 Faites défiler vers le bas pour remplir tous les champs obligatoires marqués d'un astérisque (*).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 1: Informations personnelles */}
              <div className="mb-16">
                <div className="flex items-center mb-12">
                  <div className="w-16 h-16 bg-primary text-white rounded-3xl flex items-center justify-center mr-6 shadow-2xl">
                    <span className="text-2xl font-black">1</span>
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2">Informations personnelles</h2>
                    <p className="text-xl text-gray-600">Renseignez vos coordonnées de base</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-lg font-bold text-gray-800 mb-4">
                      Nom <span className="text-secondary">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => handleInputChange('nom', e.target.value)}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary text-gray-800 transition-all duration-300 group-hover:border-primary/50 text-lg font-medium"
                        placeholder="Votre nom complet"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    {errors.nom && <p className="text-secondary text-sm mt-3 flex items-center font-semibold"><AlertCircle className="w-4 h-4 mr-2" />{errors.nom}</p>}
                  </div>

                  <div className="group">
                    <label className="block text-lg font-bold text-gray-800 mb-4">
                      Prénom <span className="text-secondary">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.prenom}
                        onChange={(e) => handleInputChange('prenom', e.target.value)}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary text-gray-800 transition-all duration-300 group-hover:border-primary/50 text-lg font-medium"
                        placeholder="Votre prénom"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    {errors.prenom && <p className="text-secondary text-sm mt-3 flex items-center font-semibold"><AlertCircle className="w-4 h-4 mr-2" />{errors.prenom}</p>}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Date de naissance
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.dateNaissance}
                        onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-800 transition-all duration-300 group-hover:border-gray-300"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Sexe
                    </label>
                    <div className="relative">
                      <select
                        value={formData.sexe}
                        onChange={(e) => handleInputChange('sexe', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-800 transition-all duration-300 group-hover:border-gray-300 appearance-none"
                      >
                        <option value="">Sélectionner</option>
                        <option value="M">Homme</option>
                        <option value="F">Femme</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => handleInputChange('telephone', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-800 transition-all duration-300 group-hover:border-gray-300"
                        placeholder="+242 XX XXX XXXX"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.telephone && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.telephone}</p>}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-800 transition-all duration-300 group-hover:border-gray-300"
                        placeholder="votre.email@exemple.cg"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.email}</p>}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Département
                    </label>
                    <div className="relative">
                      <select
                        value={formData.region}
                        onChange={(e) => handleInputChange('region', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-800 transition-all duration-300 group-hover:border-gray-300 appearance-none"
                      >
                        <option value="">Sélectionner une département</option>
                        {regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Ville
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.ville}
                        onChange={(e) => handleInputChange('ville', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-800 transition-all duration-300 group-hover:border-gray-300"
                        placeholder="Votre ville"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Profil professionnel */}
              <div className="mb-12 pt-12 border-t border-gray-200">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-success to-green-500 text-white rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Profil professionnel</h2>
                    <p className="text-gray-600">Décrivez votre parcours et vos compétences</p>
                  </div>
                </div>

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
                      <option value="Primaire">Primaire</option>
                      <option value="Secondaire">Secondaire</option>
                      <option value="Baccalauréat">Baccalauréat</option>
                      <option value="BTS/DUT">BTS/DUT</option>
                      <option value="Licence">Licence</option>
                      <option value="Master">Master</option>
                      <option value="Doctorat">Doctorat</option>
                      <option value="Autre">Autre</option>
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
                      <option value="Étudiant">Étudiant</option>
                      <option value="Chômeur">Chômeur</option>
                      <option value="Employé">Employé</option>
                      <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                      <option value="Fonctionnaire">Fonctionnaire</option>
                      <option value="Retraité">Retraité</option>
                      <option value="Autre">Autre</option>
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
                      <option value="1">1 an</option>
                      <option value="2">2 ans</option>
                      <option value="3">3 ans</option>
                      <option value="4">4 ans</option>
                      <option value="5">5 ans</option>
                      <option value="6">6 ans</option>
                      <option value="7">7 ans</option>
                      <option value="8">8 ans</option>
                      <option value="9">9 ans</option>
                      <option value="10">10 ans et plus</option>
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
                          value="je-ne-sais-pas"
                          checked={formData.inscritACPE === 'je-ne-sais-pas'}
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
                        Numéro d'inscription ACPE <span className="text-gray-400">(optionnel)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.numeroACPE}
                        onChange={(e) => handleInputChange('numeroACPE', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                        placeholder="Ex: ACPE2024XXXXX"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        Vous pouvez ajouter votre numéro de récépissé d'inscription à l'ACPE si vous le connaissez. Ce champ est optionnel.
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

              {/* Section 4: Préférences salon */}
              <div className="mb-8 pt-8 border-t">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">4</div>
                  Préférences salon
                </h2>

                <div className="bg-primary/10 border-l-4 border-primary p-4 mb-6">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-primary">
                      <p className="font-semibold mb-1">Organisation de votre participation</p>
                      <p>Indiquez vos préférences pour optimiser votre expérience au salon.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Jours de participation */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jours de participation <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {joursSalon.map(jour => (
                        <label key={jour} className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                          <input
                            type="checkbox"
                            checked={formData.joursParticipation.includes(jour)}
                            onChange={() => handleMultiSelect('joursParticipation', jour)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            {new Date(jour).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.joursParticipation && <p className="text-red-500 text-xs mt-1">{errors.joursParticipation}</p>}
                  </div>

                  {/* Horaire préféré supprimé */}

                  {/* Objectif principal */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Objectif principal <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {objectifs.map(objectif => (
                        <label key={objectif} className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                          <input
                            type="radio"
                            name="objectifPrincipal"
                            value={objectif}
                            checked={formData.objectifPrincipal === objectif}
                            onChange={(e) => handleInputChange('objectifPrincipal', e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            {objectif === 'emploi' && 'Rechercher un emploi'}
                            {objectif === 'auto-emploi' && 'Créer mon entreprise'}
                            {objectif === 'formation' && 'Me former'}
                            {objectif === 'les-trois' && 'Les trois'}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.objectifPrincipal && <p className="text-red-500 text-xs mt-1">{errors.objectifPrincipal}</p>}
                  </div>
                </div>
              </div>

              {/* Section 5: Ateliers */}
              <div className="mb-8 pt-8 border-t">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">5</div>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Panels et objectifs (sélectionnez vos centres d'intérêt)
                  </label>

                  <div className="grid grid-cols-1 gap-4">
                    {panels.map((panel) => (
                      <div key={panel.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-xl">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">{panel.titre}</h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-600 mb-3">Objectifs du panel :</p>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-4">
                            {panel.objectifs.map((obj, idx) => (
                              <li key={idx}>{obj}</li>
                            ))}
                          </ul>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.panelsInterets.includes(panel.titre)}
                              onChange={() => handleMultiSelect('panelsInterets', panel.titre)}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Je suis intéressé(e) par ce panel</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cases d'acceptation - en haut */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accepteConditions}
                      onChange={(e) => handleInputChange('accepteConditions', e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      <span className="text-red-500">*</span> J'accepte les conditions d'utilisation
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accepteTraitementDonnees}
                      onChange={(e) => handleInputChange('accepteTraitementDonnees', e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      <span className="text-red-500">*</span> J'accepte le traitement de mes données personnelles
                    </span>
                  </label>
                </div>

                {errors.accepteConditions && <p className="text-red-500 text-xs mb-2">{errors.accepteConditions}</p>}
                {errors.accepteTraitementDonnees && <p className="text-red-500 text-xs mb-2">{errors.accepteTraitementDonnees}</p>}
              </div>

              {/* Boutons de validation */}
              <div className="flex justify-between items-center pt-12 border-t border-gray-200">

                {/* Affichage des erreurs de soumission */}
                {submitError && (
                  <div className="bg-red-600 border border-red-700 text-white px-6 py-4 rounded-xl mb-6 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-6 h-6 text-white flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Erreur lors de l'inscription</h4>
                        <p className="text-sm mt-1 text-white whitespace-pre-line">{submitError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setStep('home')}
                  className="group flex items-center space-x-2 px-8 py-4 text-gray-600 hover:text-gray-800 font-medium transition-all duration-300 hover:bg-gray-100 rounded-xl"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  <span>Annuler</span>
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="group relative bg-gradient-to-r from-primary to-success text-white px-12 py-4 rounded-2xl text-lg font-bold transition-all transform hover:scale-105 hover-glow inline-flex items-center space-x-3 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="relative z-10">Inscription en cours...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Valider mon inscription</span>
                      <CheckCircle className="w-6 h-6 relative z-10 group-hover:animate-bounce-custom" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-success to-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
      <div className="min-h-screen relative overflow-hidden">
        {/* Background avec image et overlay */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/1.jpg"
              alt="Salon de l'Emploi"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-success/90 via-primary/80 to-secondary/90"></div>
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        </div>

        {/* Particules de célébration */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-20 left-10 w-6 h-6 bg-primary rounded-full animate-bounce-custom opacity-80"></div>
          <div className="absolute top-40 right-20 w-4 h-4 bg-white rounded-full animate-float opacity-60" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-40 left-20 w-5 h-5 bg-success rounded-full animate-bounce-custom opacity-70" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-60 right-40 w-3 h-3 bg-secondary rounded-full animate-float opacity-50" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-60 right-10 w-4 h-4 bg-white rounded-full animate-bounce-custom opacity-60" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header moderne */}
        <header className="relative z-20 glass border-b border-white/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-3 shadow-lg">
                  <Image
                    src="/logo.png"
                    alt="Logo ACPE"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-pulse-custom">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white text-shadow">Inscription confirmée</h1>
                <p className="text-sm text-white/90">Salon de l'Emploi 2025</p>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-20 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce-custom">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center animate-pulse-custom">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>

              <div className="inline-block mb-6">
                <span className="bg-gradient-to-r from-primary to-success text-white px-8 py-3 rounded-full text-sm font-bold animate-fadeInUp shadow-lg">
                  🎉 INSCRIPTION RÉUSSIE
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white text-shadow animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <span className="block">Félicitations</span>
                <span className="block bg-gradient-to-r from-primary to-success bg-clip-text text-transparent text-glow">{formData.prenom} !</span>
              </h2>

              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                Votre inscription au Salon National de l&apos;Emploi Jeune 2025 a été confirmée avec succès !
              </p>
            </div>

            {/* Récapitulatif d'inscription */}
            <div className="glass rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
              <div className="bg-gradient-to-r from-primary via-success to-secondary text-white p-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">Inscription confirmée</h3>
                    <p className="text-white/90">Récapitulatif de vos informations</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/95 backdrop-blur-sm">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Informations du participant */}
                  <div>
                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        INFORMATIONS DU PARTICIPANT
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-primary/10 to-success/10 p-4 rounded-xl border-l-4 border-primary">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Numéro d'inscription :</span>
                            <span className="font-bold text-primary text-lg">{registrationNumber}</span>
                          </div>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">Nom complet :</span>
                          <span className="font-semibold text-gray-800">{formData.nom} {formData.prenom}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">Email :</span>
                          <span className="text-sm text-gray-700">{formData.email}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">Téléphone :</span>
                          <span className="text-sm text-gray-700">{formData.telephone}</span>
                        </div>
                        {formData.region && (
                          <div className="flex justify-between py-3 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-600">Département :</span>
                            <span className="text-sm text-gray-700">{formData.region}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {formData.panelsInterets.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">PANELS SÉLECTIONNÉS</h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.panelsInterets.map((panel: string) => (
                            <span key={panel} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                              {panel}
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
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <button
                    onClick={() => {
                      const text = `Inscription Salon de l'Emploi 2025\nNuméro: ${registrationNumber}\nNom: ${formData.nom} ${formData.prenom}\nEmail: ${formData.email}`;
                      navigator.clipboard.writeText(text);
                      alert('Informations copiées !');
                    }}
                    className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 px-6 py-4 rounded-2xl font-medium transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Mail className="w-5 h-5 group-hover:animate-bounce-custom" />
                    <span>Copier les informations</span>
                  </button>

                  <button
                    onClick={() => {
                      setStep('home');
                      setFormData({
                        nom: '', prenom: '', dateNaissance: '', sexe: '', telephone: '', email: '',
                        ville: '', region: '', niveauEtudes: '', domaineEtudes: '', situationActuelle: '',
                        experienceAnnees: '', secteursInterets: [], cvFile: null, ideeProjet: '',
                        inscritACPE: '', numeroACPE: '', souhaitInscriptionACPE: '', panelsInterets: [],
                        accepteConditions: false, accepteTraitementDonnees: false, accepteCommunications: false
                      });
                      setRegistrationNumber('');
                    }}
                    className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-primary to-success hover:from-success hover:to-primary text-white px-6 py-4 rounded-2xl font-medium transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Users className="w-5 h-5 group-hover:animate-bounce-custom" />
                    <span>Nouvelle inscription</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Informations pratiques */}
            <div className="mt-12 glass rounded-2xl p-8 animate-fadeInUp" style={{ animationDelay: '1.2s' }}>
              <h4 className="font-bold text-2xl mb-8 flex items-center text-white">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center mr-4">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                Informations pratiques
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-custom">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-bold text-white mb-2">📅 Dates</p>
                  <p className="text-white/80 text-sm">28, 29 et 30 octobre 2025</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-success to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-custom">
                    <span className="text-white text-xl">🕐</span>
                  </div>
                  <p className="font-bold text-white mb-2">Horaires</p>
                  <p className="text-white/80 text-sm">8h00 - 18h00 chaque jour</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-custom">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-bold text-white mb-2">📍 Lieu</p>
                  <p className="text-white/80 text-sm">Palais des Congrès, Brazzaville</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-success rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-custom">
                    <span className="text-white text-xl">🎫</span>
                  </div>
                  <p className="font-bold text-white mb-2">Entrée</p>
                  <p className="text-white/80 text-sm">Gratuite avec badge</p>
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
