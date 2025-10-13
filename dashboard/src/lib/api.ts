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
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'appel API');
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
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
