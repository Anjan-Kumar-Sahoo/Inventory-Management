import React from 'react';
import { Package, BarChart3, Users, IndianRupee, Moon, Sun, LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'products' | 'suppliers' | 'sell';
  onTabChange: (tab: 'dashboard' | 'products' | 'suppliers' | 'sell') => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  storeName?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, darkMode, onToggleTheme, onLogout, storeName }) => {
  return (
    <header className={darkMode ? 'bg-slate-900 shadow-sm border-b border-slate-800' : 'bg-white shadow-sm border-b border-gray-200'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Inventory logo" className="h-10 w-10 rounded-lg object-contain bg-white p-1" />
            <div>
              <h1 className={darkMode ? 'text-xl font-bold text-slate-100' : 'text-xl font-bold text-gray-900'}>{storeName || 'Inventory'}</h1>
              <p className={darkMode ? 'text-sm text-slate-400' : 'text-sm text-gray-500'}>Management</p>
            </div>
          </div>

          <nav className="flex space-x-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : darkMode ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            
            <button
              onClick={() => onTabChange('products')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'products'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : darkMode ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4 mr-2" />
              Products
            </button>
            
            <button
              onClick={() => onTabChange("suppliers")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "suppliers"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : darkMode ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-800' : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Suppliers
            </button>
            <button
              onClick={() => onTabChange("sell")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "sell"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : darkMode ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-800' : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <IndianRupee className="w-4 h-4 mr-2" />
              Sell
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className={darkMode
                ? 'p-2 rounded-lg bg-slate-800 hover:bg-slate-700'
                : 'p-2 rounded-lg bg-gray-100 hover:bg-gray-200'}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-slate-100" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={onLogout}
              className={darkMode
                ? 'flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700 text-sm'
                : 'flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm'}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};