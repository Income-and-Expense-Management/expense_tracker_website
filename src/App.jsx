import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts & Protection
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

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
        {/* Tuyến đường (Route) Public - Không cần đăng nhập */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Tuyến đường (Route) Private - Yêu cầu đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
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
