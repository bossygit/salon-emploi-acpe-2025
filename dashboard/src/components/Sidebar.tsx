'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Inscriptions', href: '/registrations', icon: Users },
  { name: 'Statistiques', href: '/stats', icon: BarChart3 },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 transform transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        {/* Header avec dégradé moderne */}
        <div className="relative h-24 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative flex items-center h-full space-x-4">
            <div className="relative group">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center p-2 border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <img 
                  src="/logo.png" 
                  alt="ACPE Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white text-xs font-bold">📊</span>
              </div>
            </div>
            <div className="text-white">
              <div className="font-bold text-lg tracking-tight">ACPE Dashboard</div>
              <div className="text-xs opacity-90 font-medium">Salon Emploi 2025</div>
            </div>
          </div>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-300 relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-105' 
                      : 'text-gray-700 hover:bg-white/60 hover:text-blue-700 hover:shadow-md hover:scale-105'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 backdrop-blur-sm"></div>
                  )}
                  <div className={`
                    relative flex items-center space-x-3 w-full
                    ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-700'}
                  `}>
                    <div className={`
                      p-2 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-white/20 shadow-lg' 
                        : 'bg-gray-100 group-hover:bg-blue-100 group-hover:shadow-md'
                      }
                    `}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold tracking-wide">{item.name}</span>
                  </div>
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">Salon Emploi 2025</div>
                  <div className="text-xs text-gray-600">Dashboard Administrateur</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">28-30 Octobre 2025</div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Actif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
