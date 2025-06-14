'use client';

import type React from 'react';

import { useState } from 'react';
import { Home, Users, User, Bike, MenuIcon } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'conexoes', label: 'Conexões', icon: Users },
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'MENU', label: 'Menu', icon: MenuIcon },
];

export function BottomNavigation() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-500 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? 'text-blue-500' : 'text-gray-500'
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
