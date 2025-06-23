'use client';

import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'react-router-dom';
import Logo from '../auth/Logo';

export function Header() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-white">
      {/* Logo and Notification */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/Logo.svg" alt="Logo" width={90} />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          onChange={handleSearchChange}
          placeholder="Pesquisar aqui..."
          className="pl-10 bg-gray-50 border-gray-200 rounded-lg"
        />
      </div>
    </div>
  );
}
