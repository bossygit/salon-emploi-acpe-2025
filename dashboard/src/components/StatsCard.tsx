'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'primary' | 'success' | 'danger' | 'warning';
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
}

export default function StatsCard({ title, value, icon: Icon, color, change }: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-blue-600 text-white shadow-blue-200',
    success: 'bg-green-600 text-white shadow-green-200',
    danger: 'bg-red-600 text-white shadow-red-200',
    warning: 'bg-yellow-500 text-white shadow-yellow-200',
  };

  const changeColorClasses = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
  };

  const gradientClasses = {
    primary: 'from-blue-500 to-blue-600',
    success: 'from-green-500 to-green-600',
    danger: 'from-red-500 to-red-600',
    warning: 'from-yellow-400 to-yellow-500',
  };

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
      {/* Effet de fond animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-2 tracking-wide">{title}</p>
          <p className="text-4xl font-black text-gray-900 mb-3 tracking-tight">{value.toLocaleString()}</p>
          {change && (
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${
                change.type === 'increase' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                <span>{change.type === 'increase' ? '↗' : '↘'}</span>
                <span>{Math.abs(change.value)}%</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">vs mois dernier</span>
            </div>
          )}
        </div>
        <div className={`relative p-5 rounded-2xl bg-gradient-to-br ${gradientClasses[color]} shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
          <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
          <Icon className="relative h-8 w-8 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
