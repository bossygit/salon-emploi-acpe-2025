'use client';

import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface ErrorDisplayProps {
    error: Error | string;
    onRetry?: () => void;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const isConnectionError = errorMessage.includes('fetch') ||
        errorMessage.includes('Network') ||
        errorMessage.includes('connexion');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {isConnectionError ? 'Erreur de Connexion' : 'Une Erreur est Survenue'}
                        </h2>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <pre className="text-sm text-red-800 whitespace-pre-wrap font-mono">
                                {errorMessage}
                            </pre>
                        </div>

                        {isConnectionError && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold text-blue-900 mb-2">
                                    🔍 Diagnostics Possibles:
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
                                    <li>Le backend n'est pas encore déployé ou est hors ligne</li>
                                    <li>Les variables d'environnement ne sont pas configurées</li>
                                    <li>MongoDB n'est pas configuré (voir DEPLOYMENT.md)</li>
                                    <li>CORS n'autorise pas ce domaine</li>
                                </ul>
                            </div>
                        )}

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-yellow-900 mb-2">
                                ⚡ Actions à Effectuer:
                            </h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
                                <li>Vérifier que le backend est déployé sur Vercel</li>
                                <li>Configurer MongoDB Atlas (voir DEPLOYMENT.md)</li>
                                <li>Ajouter les variables d'environnement sur Vercel</li>
                                <li>Redéployer le backend après configuration</li>
                            </ol>
                        </div>

                        <div className="flex space-x-4">
                            {onRetry && (
                                <button
                                    onClick={onRetry}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <RefreshCw className="h-5 w-5" />
                                    <span>Réessayer</span>
                                </button>
                            )}

                            <a
                                href="https://github.com/bossygit/salon-emploi-acpe-2025/blob/main/DEPLOYMENT.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <ExternalLink className="h-5 w-5" />
                                <span>Voir la Documentation</span>
                            </a>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">📋 Détails Techniques:</h4>
                            <dl className="text-sm space-y-1">
                                <dt className="font-medium text-gray-700">Backend URL:</dt>
                                <dd className="text-gray-600 font-mono text-xs break-all ml-4">
                                    {process.env.NEXT_PUBLIC_API_URL || 'https://backend-mauve-phi-53.vercel.app/api'}
                                </dd>

                                <dt className="font-medium text-gray-700 mt-2">Type d'erreur:</dt>
                                <dd className="text-gray-600 ml-4">
                                    {isConnectionError ? 'Connexion réseau' : 'Erreur serveur'}
                                </dd>

                                <dt className="font-medium text-gray-700 mt-2">Timestamp:</dt>
                                <dd className="text-gray-600 ml-4">
                                    {new Date().toLocaleString('fr-FR')}
                                </dd>
                            </dl>
                        </div>

                        <div className="mt-6 text-sm text-gray-600">
                            <p>
                                💡 <strong>Conseil:</strong> Ouvrez la console du navigateur (F12)
                                pour voir les logs détaillés de l'erreur.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

