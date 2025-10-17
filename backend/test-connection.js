#!/usr/bin/env node

/**
 * Script de test de connexion pour diagnostiquer les problèmes
 * Usage: node test-connection.js
 */

const http = require('http');

console.log('🔍 Test de connexion au backend...\n');

// Test 1: Vérifier si le port 5000 est ouvert
console.log('📡 Test 1: Vérification du port 5000...');

const testPort = (host, port) => {
    return new Promise((resolve, reject) => {
        const options = {
            host: host,
            port: port,
            path: '/api/health',
            method: 'GET',
            timeout: 3000
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    success: true,
                    status: res.statusCode,
                    data: data,
                    host: host
                });
            });
        });

        req.on('error', (err) => {
            reject({
                success: false,
                error: err.message,
                host: host
            });
        });

        req.on('timeout', () => {
            req.destroy();
            reject({
                success: false,
                error: 'Timeout',
                host: host
            });
        });

        req.end();
    });
};

// Tester différents hosts
const tests = [
    { host: 'localhost', port: 3001, name: 'localhost:3001' },
    { host: '127.0.0.1', port: 3001, name: '127.0.0.1:3001' }
];

async function runTests() {
    for (const test of tests) {
        try {
            console.log(`\n🔸 Test de http://${test.name}/api/health`);
            const result = await testPort(test.host, test.port);
            console.log(`   ✅ Succès ! Status: ${result.status}`);
            try {
                const jsonData = JSON.parse(result.data);
                console.log(`   📊 Réponse:`, JSON.stringify(jsonData, null, 2));
            } catch (e) {
                console.log(`   📄 Réponse brute:`, result.data);
            }
        } catch (error) {
            console.log(`   ❌ Échec: ${error.error}`);
            if (error.error === 'Timeout') {
                console.log(`   💡 Le serveur ne répond pas dans les 3 secondes`);
            } else if (error.error.includes('ECONNREFUSED')) {
                console.log(`   💡 Le serveur n'est pas démarré sur ce port`);
            } else {
                console.log(`   💡 Erreur de connexion`);
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📋 DIAGNOSTIC:');
    console.log('='.repeat(60));
    console.log('\n✅ Si tous les tests réussissent:');
    console.log('   → Le backend est opérationnel !');
    console.log('\n❌ Si tous les tests échouent avec ECONNREFUSED:');
    console.log('   → Le backend n\'est pas démarré');
    console.log('   → Lancez: npm run dev');
    console.log('\n⚠️ Si les tests timeout:');
    console.log('   → Le backend est peut-être bloqué');
    console.log('   → Vérifiez la connexion MongoDB');
    console.log('\n🔧 Commandes utiles:');
    console.log('   → Vérifier les processus: lsof -i :3001');
    console.log('   → Tuer un processus: kill -9 PID');
    console.log('   → Démarrer MongoDB: brew services start mongodb-community');
    console.log('   → Démarrer backend: cd backend && npm run dev');
    console.log('='.repeat(60) + '\n');
}

runTests().catch(console.error);

