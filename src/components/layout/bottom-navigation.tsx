'use client';

import type React from 'react';

import { useState } from 'react';
import { Home, Users, User, Bike, MenuIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route?: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, route: '/' },
  { id: 'conexoes', label: 'Conexões', icon: Users, route: '/conexoes' },
  { id: 'perfil', label: 'Perfil', icon: User, route: '/me' },
  { id: 'MENU', label: 'Menu', icon: MenuIcon },
];

export function BottomNavigation() {
  const navigate = useNavigate();

  const pathname = window.location.pathname;

  const isActivePath = (route: string) => {
    return pathname === route || (route === '/' && pathname === '/home');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.route || '');

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.route) {
                  navigate(item.route);
                }
              }}
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
