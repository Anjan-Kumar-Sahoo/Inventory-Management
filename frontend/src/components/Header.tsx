import React from 'react';
import { Package, BarChart3, Users, Building2, IndianRupee } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'products' | 'suppliers' | 'sell';
  onTabChange: (tab: 'dashboard' | 'products' | 'suppliers' | 'sell') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Inventory</h1>
              <p className="text-sm text-gray-500">Management</p>
            </div>
          </div>

          <nav className="flex space-x-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <IndianRupee className="w-4 h-4 mr-2" />
              Sell
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};