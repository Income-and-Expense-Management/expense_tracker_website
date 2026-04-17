import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Protection
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Transactions from './pages/transactions/Transactions';
import Categories from './pages/categories/Categories';
import Budgets from './pages/budgets/Budgets';
import NotFound from './pages/not-found/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tuyến đường (Route) Public - Không cần đăng nhập, nhưng ĐÃ đăng nhập thì CHẶN quay lại */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* Tuyến đường (Route) Private - Yêu cầu đăng nhập */}
        <Route element={<ProtectedRoute />}>
          {/* Tự động redirect route gốc (/) sang /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/budgets" element={<Budgets />} />
          </Route>
        </Route>

        {/* Tuyến đường vãng lai (Catch all) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
