import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { ProductManager } from '../pages/ProductManager';
import { SupplierManager } from '../pages/SupplierManager';
import { SellProduct } from '../pages/SellProduct';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { OtpVerificationPage } from '../pages/auth/OtpVerificationPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { AppShell } from '../layouts/AppShell';
import { useAuth } from '../context/AuthContext';
import { GuestRoute, ProtectedRoute } from './RouteGuards';
import { ROUTES } from './paths';

interface AppRoutesProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ darkMode, onToggleTheme }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path={ROUTES.ROOT}
        element={<Navigate to={isAuthenticated ? ROUTES.APP.DASHBOARD : ROUTES.AUTH.LOGIN} replace />}
      />

      <Route
        path={ROUTES.AUTH.LOGIN}
        element={
          <GuestRoute>
            <LoginPage
              darkMode={darkMode}
              onToggleTheme={onToggleTheme}
              onGoToRegister={() => navigate(ROUTES.AUTH.REGISTER)}
            />
          </GuestRoute>
        }
      />
      <Route
        path={ROUTES.AUTH.REGISTER}
        element={
          <GuestRoute>
            <RegisterPage
              darkMode={darkMode}
              onToggleTheme={onToggleTheme}
              onRegistered={() => navigate(ROUTES.AUTH.VERIFY_OTP)}
              onGoToLogin={() => navigate(ROUTES.AUTH.LOGIN)}
            />
          </GuestRoute>
        }
      />
      <Route
        path={ROUTES.AUTH.VERIFY_OTP}
        element={
          <GuestRoute>
            <OtpVerificationPage
              darkMode={darkMode}
              onToggleTheme={onToggleTheme}
              onVerified={() => navigate(ROUTES.AUTH.LOGIN)}
              onBackToRegister={() => navigate(ROUTES.AUTH.REGISTER)}
            />
          </GuestRoute>
        }
      />

      <Route
        path={ROUTES.APP.ROOT}
        element={
          <ProtectedRoute>
            <AppShell darkMode={darkMode} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.APP.DASHBOARD} replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductManager />} />
        <Route
          path="suppliers"
          element={<SupplierManager onNavigateToProducts={() => navigate(ROUTES.APP.PRODUCTS)} />}
        />
        <Route path="sell" element={<SellProduct />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? ROUTES.APP.DASHBOARD : ROUTES.AUTH.LOGIN} replace />}
      />
    </Routes>
  );
};
