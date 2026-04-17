import { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ProductManager } from './components/ProductManager';
import { SupplierManager } from './components/SupplierManager';
import { InventoryProvider } from './context/InventoryContext';
import { SellProduct } from './components/SellProduct';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RegisterPage } from './components/auth/RegisterPage';
import { OtpVerificationPage } from './components/auth/OtpVerificationPage';
import { LoginPage } from './components/auth/LoginPage';

type AuthScreen = 'register' | 'verify-otp' | 'login';

function AppContent() {
  const { isAuthenticated, logout, user } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('inventory_theme');
    return saved === 'dark';
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'suppliers' | 'sell'>('dashboard');

  const toggleTheme = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('inventory_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  if (!isAuthenticated) {
    if (authScreen === 'register') {
      return (
        <RegisterPage
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          onRegistered={() => setAuthScreen('verify-otp')}
          onGoToLogin={() => setAuthScreen('login')}
        />
      );
    }

    if (authScreen === 'verify-otp') {
      return (
        <OtpVerificationPage
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          onVerified={() => setAuthScreen('login')}
          onBackToRegister={() => setAuthScreen('register')}
        />
      );
    }

    return <LoginPage darkMode={darkMode} onToggleTheme={toggleTheme} onGoToRegister={() => setAuthScreen('register')} />;
  }

  const handleNavigateToProducts = () => {
    setActiveTab('products');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManager />;
      case 'suppliers':
        return <SupplierManager onNavigateToProducts={handleNavigateToProducts} />;
      case 'sell':
        return <SellProduct />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <InventoryProvider>
      <div className={darkMode ? 'min-h-screen bg-slate-950 flex flex-col' : 'min-h-screen bg-gray-50 flex flex-col'}>
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          onLogout={logout}
          storeName={user?.storeName}
        />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
        <footer className={darkMode ? 'bg-slate-900 border-t border-slate-800 py-4 text-center text-slate-400 text-sm' : 'bg-white border-t border-gray-200 py-4 text-center text-gray-500 text-sm'}>
          Created with <span className="text-red-500">&#10084;</span> by <span className={darkMode ? 'font-semibold text-slate-300' : 'font-semibold text-gray-700'}>Mr. Aks</span> - Inventory made simple.
        </footer>
      </div>
    </InventoryProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;