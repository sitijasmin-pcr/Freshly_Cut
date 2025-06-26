import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Admin Pages
import Dashboard from './Pages/Dashboard';
import MainLayout from './components/MainLayout';
import Customer from './Pages/Customer';
import Faq from './Pages/FAQ';
import Produk from './Pages/Produk';
import SalesManagement from './Pages/SalesManagement';
import ProdukTerlaris from './Pages/ProdukTerlaris';
import Penjualan from './Pages/Penjualan';
import BranchOutlet from './Pages/BranchOutlet';
import Feedback from './Pages/Feedback';
import ShiftManagement from './Pages/ShiftManagement';
import User from './Pages/User';
import Karyawan from './Pages/Karyawan';

// User Pages
import HomeUser from './USERPAGE/HomeUser';
import MenuUser from './USERPAGE/MenuUser';
import CartUser from './USERPAGE/CartUser';
import CheckoutUser from './USERPAGE/CheckoutUser';
import NotificationUser from './USERPAGE/NotificationUser';
import ChatUser from './USERPAGE/ChatUser';
import FAQUser from './USERPAGE/FAQUser';
import ProfInfo from './USERPAGE/ProfInfo';
import LokasiUser from './USERPAGE/LokasiUser'; // Import LokasiUser (konsisten)
import OrderInformation from './USERPAGE/OrderInformation'; // Import OrderInformation (konsisten)

// Pastikan jalur ini benar untuk CartContext.jsx di src/context/
import { CartProvider } from "./USERPAGE/CartContext"; // <--- KOREKSI JALUR INI

// Import komponen Login yang baru
import Login from './Login'; // Sesuaikan path jika Login.jsx ada di subfolder Anda

import '@fortawesome/fontawesome-free/css/all.min.css';

// --- Auth Context Setup ---
export const AuthContext = createContext(null);

const DUMMY_USERS = [
  { email: 'admin@tomoro.com', password: 'adminpassword', role: 'admin' },
  { email: 'customer@mail.com', password: 'customerpassword', role: 'customer' },
];

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const login = (email, password) => {
    const user = DUMMY_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setIsAuthenticated(true);
      setUserRole(user.role);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  };

  // Cek status login dari localStorage saat aplikasi dimuat
  React.useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedRole = localStorage.getItem('userRole');
    if (storedAuth === 'true' && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);

  const authContextValue = {
    isAuthenticated,
    userRole,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'customer') {
      return <Navigate to="/HomeUser" replace />;
    }
    return <Navigate to="/Login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      {/* CartProvider membungkus semua rute yang membutuhkan akses keranjang */}
      <CartProvider>
        <Routes>
          {/* Rute publik */}
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Navigate to="Login" replace />} />
          
          {/* --- Protected Admin Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/laporan" element={<Penjualan />} />
              <Route path="/produk" element={<Produk />} />
              <Route path="/produkTerlaris" element={<ProdukTerlaris />} />
              <Route path="/sales" element={<SalesManagement />} />
              <Route path="/branch" element={<BranchOutlet />} />
              <Route path="/shift" element={<ShiftManagement />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/user" element={<User />} />
              <Route path="/karyawan" element={<Karyawan />} />
            </Route>
          </Route>

          {/* --- Protected User Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
            <Route path="/HomeUser" element={<HomeUser />} />
            <Route path="/MenuUser" element={<MenuUser />} />
            <Route path="/CartUser" element={<CartUser />} />
            <Route path="/CheckoutUser" element={<CheckoutUser />} />
            <Route path="/NotificationUser" element={<NotificationUser />} />
            <Route path="/ChatUser" element={<ChatUser />} />
            <Route path="/FAQUser" element={<FAQUser />} />
            <Route path="/ProfInfo" element={<ProfInfo />} />
            <Route path="/lokasi" element={<LokasiUser />} />
            <Route path="/order-information" element={<OrderInformation />} />
          </Route>

          {/* Rute 404 */}
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-700">404 Not Found</div>} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
