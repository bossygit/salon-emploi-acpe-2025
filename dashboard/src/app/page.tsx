'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import StatsCard from '@/components/StatsCard';
import { Users, CheckCircle, Clock, XCircle, BarChart3, Settings } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Stats } from '@/types';

export default function Dashboard() {
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

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="p-8">
          {/* Header moderne */}
          <div className="mb-10">
            <div className="relative">
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-white text-xs font-bold">✨</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Tableau de bord</h1>
                  <p className="text-lg text-gray-600 font-medium">
                    Vue d'ensemble du Salon National de l'Emploi Jeune 2025
                  </p>
                </div>
              </div>
              
              {/* Barre de statut */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 shadow-lg">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">Système actif</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 shadow-lg">
                  <span className="text-sm font-semibold text-gray-700">13 inscriptions</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 shadow-lg">
                  <span className="text-sm font-semibold text-gray-700">28-30 Oct 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Inscriptions"
              value={stats?.totalInscriptions || 0}
              icon={Users}
              color="primary"
            />
            <StatsCard
              title="Confirmés"
              value={stats?.inscriptionsConfirmees || 0}
              icon={CheckCircle}
              color="success"
            />
        <StatsCard
          title="Annulées"
          value={stats?.inscriptionsAnnulees || 0}
          icon={XCircle}
          color="danger"
        />
            <StatsCard
              title="Entrées Marquées"
              value={stats?.entriesMarked || 0}
              icon={CheckCircle}
              color="success"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">⚡</span>
                  </div>
                  <span>Actions Rapides</span>
                </h3>
                <div className="space-y-4">
                  <button className="group w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl text-left flex items-center space-x-4">
                    <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-lg">Voir toutes les inscriptions</span>
                  </button>
                  <button className="group w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl text-left flex items-center space-x-4">
                    <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <span className="text-lg">Exporter les données</span>
                  </button>
                  <button className="group w-full bg-gradient-to-r from-gray-600 via-slate-600 to-zinc-600 hover:from-gray-700 hover:via-slate-700 hover:to-zinc-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl text-left flex items-center space-x-4">
                    <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                      <Settings className="w-6 h-6" />
                    </div>
                    <span className="text-lg">Gérer les paramètres</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/30 to-emerald-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">ℹ️</span>
                  </div>
                  <span>Informations du Salon</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <span className="font-semibold text-gray-700">Dates:</span>
                    <span className="font-bold text-blue-700">28-30 Octobre 2025</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <span className="font-semibold text-gray-700">Lieu:</span>
                    <span className="font-bold text-green-700">Palais des Congrès</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
                    <span className="font-semibold text-gray-700">Horaires:</span>
                    <span className="font-bold text-purple-700">8h00 - 18h00</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                    <span className="font-semibold text-gray-700">Statut:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="font-bold text-green-700">Actif</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
            <div className="text-center py-8 text-gray-500">
              <p>Les dernières activités apparaîtront ici</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
