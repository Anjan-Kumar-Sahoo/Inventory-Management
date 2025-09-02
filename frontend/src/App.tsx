import { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ProductManager } from './components/ProductManager';
import { SupplierManager } from './components/SupplierManager';
import { InventoryProvider } from './context/InventoryContext';
import { SellProduct } from './components/SellProduct';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'suppliers' | 'sell'>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManager />;
      case 'suppliers':
        return <SupplierManager />;
      case 'sell':
        return <SellProduct />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <InventoryProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
        <footer className="bg-white border-t border-gray-200 py-4 text-center text-gray-500 text-sm">
          Created with <span className="text-red-500">&#10084;</span> by <span className="font-semibold text-gray-700">Mr. Aks</span> &mdash; Inventory made simple.
        </footer>
      </div>
    </InventoryProvider>
  );
}

export default App;