const nodemailer = require('nodemailer');
const path = require('path');

// Configuration du transporteur email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true pour 465, false pour autres ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Template HTML pour l'email de confirmation
const getConfirmationEmailTemplate = (registration) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation d'inscription - Salon National de l'Emploi Jeune 2025</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                background: linear-gradient(135deg, #1B80BF 0%, #238C33 50%, #F2133C 100%);
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
                margin: -30px -30px 30px -30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .badge {
                background-color: #f8f9fa;
                border: 2px solid #1B80BF;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
            }
            .registration-number {
                font-size: 24px;
                font-weight: bold;
                color: #1B80BF;
                margin: 10px 0;
            }
            .qr-code {
                margin: 20px 0;
            }
            .info-section {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin: 15px 0;
            }
            .info-title {
                font-weight: bold;
                color: #1B80BF;
                margin-bottom: 10px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
            .button {
                display: inline-block;
                background-color: #1B80BF;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🇨🇬 ACPE</div>
                <h1>Salon National de l'Emploi Jeune 2025</h1>
                <p>Confirmation d'inscription</p>
            </div>

            <h2>Félicitations ${registration.prenom} ${registration.nom} !</h2>
            
            <p>Votre inscription au <strong>Salon National de l'Emploi Jeune 2025</strong> a été confirmée avec succès.</p>

            <div class="badge">
                <div class="info-title">Votre Badge d'Entrée</div>
                <div class="registration-number">${registration.numeroInscription}</div>
                <div class="qr-code">
                    <img src="${registration.qrCode.image}" alt="QR Code" style="max-width: 200px;">
                </div>
                <p><strong>Conservez ce badge !</strong> Il vous sera demandé à l'entrée du salon.</p>
            </div>

            <div class="info-section">
                <div class="info-title">📅 Informations du Salon</div>
                <p><strong>Dates :</strong> 28, 29 et 30 octobre 2025</p>
                <p><strong>Horaires :</strong> 8h00 - 18h00 chaque jour</p>
                <p><strong>Lieu :</strong> Palais des Congrès, Brazzaville</p>
                <p><strong>Entrée :</strong> Gratuite avec votre badge</p>
            </div>

            <div class="info-section">
                <div class="info-title">👤 Vos Informations</div>
                <p><strong>Nom :</strong> ${registration.prenom} ${registration.nom}</p>
                <p><strong>Email :</strong> ${registration.email}</p>
                <p><strong>Téléphone :</strong> ${registration.telephone}</p>
                ${registration.region ? `<p><strong>Région :</strong> ${registration.region}</p>` : ''}
            </div>

            ${registration.joursParticipation && registration.joursParticipation.length > 0 ? `
            <div class="info-section">
                <div class="info-title">📋 Vos Préférences</div>
                <p><strong>Jours de participation :</strong> ${registration.joursParticipation.join(', ')}</p>
                ${registration.horairePrefere ? `<p><strong>Horaire préféré :</strong> ${registration.horairePrefere}</p>` : ''}
                ${registration.objectifPrincipal ? `<p><strong>Objectif principal :</strong> ${registration.objectifPrincipal}</p>` : ''}
            </div>
            ` : ''}

            <div class="info-section">
                <div class="info-title">📱 Que faire maintenant ?</div>
                <ol>
                    <li><strong>Imprimez votre badge</strong> ou sauvegardez-le sur votre téléphone</li>
                    <li><strong>Préparez votre CV</strong> et vos documents</li>
                    <li><strong>Planifiez votre visite</strong> selon vos préférences</li>
                    <li><strong>Suivez nos réseaux sociaux</strong> pour les dernières actualités</li>
                </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://acpe.cg" class="button">Visiter le site ACPE</a>
            </div>

            <div class="footer">
                <p><strong>ACPE - Agence Congolaise Pour l'Emploi</strong></p>
                <p>Email: contact@acpe.cg | Téléphone: +242 05 123 45 67</p>
                <p>Boulevard Denis Sassou Nguesso, Brazzaville</p>
                <p>© 2025 ACPE. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Envoyer l'email de confirmation
const sendConfirmationEmail = async (registration) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ACPE <noreply@acpe.cg>',
      to: registration.email,
      subject: `Confirmation d'inscription - Salon Emploi 2025 - ${registration.numeroInscription}`,
      html: getConfirmationEmailTemplate(registration),
      attachments: [
        {
          filename: `badge-${registration.numeroInscription}.png`,
          content: registration.qrCode.image.split(',')[1],
          encoding: 'base64'
        }
      ]
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email de confirmation envoyé:', result.messageId);
    return result;

  } catch (error) {
    console.error('Erreur envoi email de confirmation:', error);
    throw error;
  }
};

// Envoyer un email de rappel
const sendReminderEmail = async (registration, daysBefore = 1) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ACPE <noreply@acpe.cg>',
      to: registration.email,
      subject: `Rappel - Salon Emploi 2025 dans ${daysBefore} jour(s)`,
      html: `
        <h2>Rappel - Salon National de l'Emploi Jeune 2025</h2>
        <p>Bonjour ${registration.prenom},</p>
        <p>Le Salon National de l'Emploi Jeune 2025 commence dans ${daysBefore} jour(s) !</p>
        <p><strong>Votre numéro d'inscription :</strong> ${registration.numeroInscription}</p>
        <p>N'oubliez pas d'apporter votre badge d'entrée.</p>
        <p>À bientôt !</p>
        <p>L'équipe ACPE</p>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email de rappel envoyé:', result.messageId);
    return result;

  } catch (error) {
    console.error('Erreur envoi email de rappel:', error);
    throw error;
  }
};

// Envoyer un email d'assistance ACPE
const sendAssistanceEmail = async (assistanceData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ACPE <noreply@acpe.cg>',
      to: assistanceData.email,
      subject: 'Assistance ACPE - Votre demande a été reçue',
      html: `
        <h2>Demande d'assistance ACPE reçue</h2>
        <p>Bonjour ${assistanceData.prenom},</p>
        <p>Votre demande d'assistance pour l'inscription ACPE a été reçue.</p>
        <p><strong>Référence :</strong> ${assistanceData.reference}</p>
        <p>Notre équipe vous contactera dans les plus brefs délais.</p>
        <p>En attendant, vous pouvez :</p>
        <ul>
          <li>Visiter notre site : <a href="https://acpe.cg">https://acpe.cg</a></li>
          <li>Nous appeler au : +242 05 123 45 67</li>
          <li>Nous écrire à : contact@acpe.cg</li>
        </ul>
        <p>Cordialement,<br>L'équipe ACPE</p>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email d\'assistance envoyé:', result.messageId);
    return result;

  } catch (error) {
    console.error('Erreur envoi email d\'assistance:', error);
    throw error;
  }
};

module.exports = {
  sendConfirmationEmail,
  sendReminderEmail,
  sendAssistanceEmail,
  createTransporter
};
