import { Registration, Stats, QRVerificationResult, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1vzhrzgny-kitutupros-projects.vercel.app/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      console.log(`🔄 Appel API: ${url}`);
      
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      console.log(`📡 Statut HTTP: ${response.status} ${response.statusText}`);

      // Tentative de lecture du body
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('❌ Réponse non-JSON:', text);
        throw new Error(`Le serveur a retourné une réponse non-JSON (${response.status}): ${text.substring(0, 200)}`);
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || `Erreur ${response.status}: ${response.statusText}`;
        console.error('❌ Erreur API:', errorMessage, data);
        throw new Error(errorMessage);
      }

      console.log('✅ Succès API:', data);
      return data;
    } catch (error: any) {
      // Amélioration des messages d'erreur
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const detailedError = new Error(
          `❌ Impossible de se connecter au backend.\n` +
          `URL tentée: ${url}\n` +
          `Erreur: ${error.message}\n\n` +
          `Vérifications à faire:\n` +
          `1. Le backend est-il déployé et actif?\n` +
          `2. L'URL du backend est-elle correcte?\n` +
          `3. CORS est-il configuré pour autoriser ce domaine?\n` +
          `4. Le backend répond-il? Testez: curl ${API_BASE_URL}/health`
        );
        console.error(detailedError.message);
        throw detailedError;
      }

      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        const networkError = new Error(
          `❌ Erreur réseau lors de la connexion au backend.\n` +
          `URL: ${url}\n` +
          `Problème possible: CORS, Backend hors ligne, ou URL incorrecte\n` +
          `Backend configuré: ${API_BASE_URL}`
        );
        console.error(networkError.message);
        throw networkError;
      }

      console.error('❌ Erreur complète:', error);
      throw error;
    }
  }

  // Récupérer toutes les inscriptions
  async getRegistrations(page = 1, limit = 50, statut?: string, search?: string): Promise<ApiResponse<Registration[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(statut && { statut }),
      ...(search && { search })
    });

    return this.request<Registration[]>(`/registration?${params}`);
  }

  // Récupérer une inscription par numéro
  async getRegistrationByNumber(numero: string): Promise<ApiResponse<Registration>> {
    return this.request<Registration>(`/registration/${numero}`);
  }

  // Récupérer les statistiques
  async getStats(): Promise<ApiResponse<Stats>> {
    return this.request<Stats>('/registration/stats/public');
  }

  // Vérifier un QR code
  async verifyQRCode(qrData: string): Promise<ApiResponse<QRVerificationResult>> {
    return this.request<QRVerificationResult>('/registration/verify-qr', {
      method: 'POST',
      body: JSON.stringify({ qrData }),
    });
  }

  // Mettre à jour le statut d'une inscription
  async updateRegistrationStatus(numero: string, statut: 'en-attente' | 'confirme' | 'annule'): Promise<ApiResponse<Registration>> {
    return this.request<Registration>(`/registration/${numero}`, {
      method: 'PUT',
      body: JSON.stringify({ statut }),
    });
  }
}

export const apiClient = new ApiClient();
