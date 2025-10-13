'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import StatsCard from '@/components/StatsCard';
import { Users, CheckCircle, Clock, XCircle, TrendingUp, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Stats } from '@/types';

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.getStats();
        setStats(response.data as Stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-danger-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = stats?.totalInscriptions || 0;
  const confirmed = stats?.inscriptionsConfirmees || 0;
  const cancelled = stats?.inscriptionsAnnulees || 0;
  const entries = stats?.entriesMarked || 0;

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
            <p className="text-gray-600 mt-2">
              Analyse détaillée des inscriptions et de la participation
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Inscriptions"
              value={total}
              icon={Users}
              color="primary"
            />
            <StatsCard
              title="Confirmés"
              value={confirmed}
              icon={CheckCircle}
              color="success"
            />
            <StatsCard
              title="Annulées"
              value={cancelled}
              icon={XCircle}
              color="danger"
            />
            <StatsCard
              title="Entrées Marquées"
              value={entries}
              icon={TrendingUp}
              color="success"
            />
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Registration Status Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des Inscriptions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-success-500 rounded"></div>
                    <span className="text-sm text-gray-600">Confirmés</span>
                  </div>
                  <span className="font-medium">{confirmed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-success-500 h-2 rounded-full" 
                    style={{ width: `${total > 0 ? (confirmed / total) * 100 : 0}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm text-gray-600">Annulées</span>
                  </div>
                  <span className="font-medium">{cancelled}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${total > 0 ? (cancelled / total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Entry Statistics */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques d'Entrée</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-500" />
                    <span className="text-sm text-gray-600">Entrées enregistrées</span>
                  </div>
                  <span className="font-medium">{entries}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Pas encore entrés</span>
                  </div>
                  <span className="font-medium">{total - entries}</span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Taux de participation</span>
                    <span className="font-bold text-lg text-primary-600">
                      {total > 0 ? Math.round((entries / total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition Régionale</h3>
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Les données régionales seront disponibles prochainement</p>
            </div>
          </div>

          {/* Export Options */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exporter les Données</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="btn-primary">
                Exporter toutes les inscriptions
              </button>
              <button className="btn-secondary">
                Exporter les statistiques
              </button>
              <button className="btn-secondary">
                Exporter les entrées
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
