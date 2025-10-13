const nodemailer = require('nodemailer');
require('dotenv').config({ path: './config.env' });

async function testEmailConfig() {
    console.log('📧 Test de la configuration email...\n');

    // Vérifier les variables d'environnement
    console.log('🔍 Variables d\'environnement:');
    console.log('   EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('   EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('   EMAIL_USER:', process.env.EMAIL_USER);
    console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '***configuré***' : '❌ NON CONFIGURÉ');
    console.log('   EMAIL_FROM:', process.env.EMAIL_FROM);
    console.log('');

    if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('remplacez-par-votre-email')) {
        console.log('❌ ERREUR: Email non configuré !');
        console.log('');
        console.log('📝 Pour configurer:');
        console.log('1. Modifiez backend/config.env');
        console.log('2. Remplacez "remplacez-par-votre-email@gmail.com" par votre email');
        console.log('3. Remplacez "remplacez-par-votre-mot-de-passe-application" par votre mot de passe');
        console.log('');
        console.log('🔐 Pour Gmail:');
        console.log('- Activez l\'authentification à 2 facteurs');
        console.log('- Générez un mot de passe d\'application');
        console.log('- Utilisez ce mot de passe dans EMAIL_PASS');
        return;
    }

    if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS.includes('remplacez-par-votre-mot-de-passe')) {
        console.log('❌ ERREUR: Mot de passe email non configuré !');
        console.log('');
        console.log('🔐 Configurez votre mot de passe dans backend/config.env');
        return;
    }

    try {
        // Créer le transporteur
        const transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        console.log('🔗 Test de connexion au serveur email...');

        // Tester la connexion
        await transporter.verify();
        console.log('✅ Connexion au serveur email réussie !');

        // Envoyer un email de test
        console.log('📤 Envoi d\'un email de test...');
        
        const testEmail = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER, // S'envoyer à soi-même
            subject: 'Test Configuration Email - Salon Emploi 2025',
            html: `
                <h2>🎉 Configuration Email Réussie !</h2>
                <p>Votre configuration Nodemailer fonctionne parfaitement.</p>
                <p><strong>Serveur:</strong> ${process.env.EMAIL_HOST}</p>
                <p><strong>Port:</strong> ${process.env.EMAIL_PORT}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
                <hr>
                <p><em>Salon National de l'Emploi Jeune 2025 - ACPE</em></p>
            `
        };

        const result = await transporter.sendMail(testEmail);
        console.log('✅ Email de test envoyé avec succès !');
        console.log('📧 Message ID:', result.messageId);
        console.log('');
        console.log('🎉 CONFIGURATION EMAIL VALIDÉE !');
        console.log('📱 Les emails de confirmation seront maintenant envoyés automatiquement.');

    } catch (error) {
        console.error('❌ Erreur configuration email:', error.message);
        console.log('');
        console.log('🔧 Solutions possibles:');
        console.log('1. Vérifiez vos identifiants email');
        console.log('2. Pour Gmail: Activez l\'authentification à 2 facteurs');
        console.log('3. Pour Gmail: Utilisez un mot de passe d\'application');
        console.log('4. Vérifiez que "Accès moins sécurisé" est activé (si applicable)');
    }
}

testEmailConfig().catch(console.error);
