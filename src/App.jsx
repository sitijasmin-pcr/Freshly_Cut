import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';

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

// Import komponen Login yang baru
import Login from './Login'; // Sesuaikan path jika Login.jsx ada di subfolder

import '@fortawesome/fontawesome-free/css/all.min.css';

// --- Auth Context Setup ---
// Membuat AuthContext untuk berbagi status otentikasi di seluruh aplikasi
export const AuthContext = createContext(null);

// Data dummy pengguna
const DUMMY_USERS = [
  { email: 'admin@tomoro.com', password: 'adminpassword', role: 'admin' },
  { email: 'customer@mail.com', password: 'customerpassword', role: 'customer' },
  // Tambahkan user dummy lain jika diperlukan
];

// AuthProvider component yang akan membungkus seluruh aplikasi atau bagian yang membutuhkan otentikasi
const AuthProvider = ({ children }) => {
  // State untuk melacak apakah pengguna sudah login
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State untuk melacak peran pengguna (misal: 'admin', 'customer')
  const [userRole, setUserRole] = useState(null);

  // Fungsi untuk proses login
  const login = (email, password) => {
    const user = DUMMY_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setIsAuthenticated(true);
      setUserRole(user.role);
      // Simpan status di localStorage agar tetap login setelah refresh (opsional)
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);
      return true;
    }
    return false;
  };

  // Fungsi untuk proses logout
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    // Hapus status dari localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  };

  // Cek status login dari localStorage saat aplikasi dimuat
  useState(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedRole = localStorage.getItem('userRole');
    if (storedAuth === 'true' && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []); // Hanya dijalankan sekali saat mount

  // Nilai yang akan disediakan oleh AuthContext
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

// --- ProtectedRoute Component ---
// Komponen ini akan memeriksa hak akses sebelum merender rute anak
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  if (!isAuthenticated) {
    // Jika belum login, redirect ke halaman login
    return <Navigate to="/Login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Jika tidak memiliki peran yang diizinkan, redirect (misal ke HomeUser atau halaman tidak berizin)
    // Untuk contoh ini, saya akan redirect ke HomeUser jika tidak diizinkan ke admin page
    if (userRole === 'customer') {
      return <Navigate to="/HomeUser" replace />;
    }
    return <Navigate to="/Login" replace />; // Fallback jika peran tidak dikenal atau tidak sesuai
  }

  // Jika sudah login dan memiliki peran yang diizinkan, lanjutkan ke rute anak
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider> {/* Bungkus seluruh aplikasi dengan AuthProvider */}
      <Routes>
        {/* Rute publik, tidak memerlukan otentikasi */}
        <Route path="/Login" element={<Login />} />
        {/* Rute default akan diarahkan ke halaman login */}
        <Route path="/" element={<Navigate to="Login" replace />} />
        
        {/* --- Protected Admin Routes --- */}
        {/* Hanya pengguna dengan peran 'admin' yang bisa mengakses rute ini */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<MainLayout />}>
            {/* Rute admin yang akan memiliki sidebar dan layout admin */}
            <Route path="/dashboard" element={<Dashboard />} /> {/* Ganti root admin ke /dashboard */}
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
        {/* Pengguna dengan peran 'customer' dan 'admin' bisa mengakses rute ini */}
        <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
          {/* Rute user yang berdiri sendiri (tidak menggunakan MainLayout) */}
          <Route path="/HomeUser" element={<HomeUser />} />
          <Route path="/MenuUser" element={<MenuUser />} />
          <Route path="/CartUser" element={<CartUser />} />
          <Route path="/CheckoutUser" element={<CheckoutUser />} />
          <Route path="/NotificationUser" element={<NotificationUser />} />
          <Route path="/ChatUser" element={<ChatUser />} />
          {/* Anda mungkin ingin menambahkan route untuk halaman lokasi user juga jika ada */}
          {/* <Route path="/location" element={<UserLocationPage />} /> */}
        </Route>

        {/* Rute untuk halaman yang tidak ditemukan (404) */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-700">404 Not Found</div>} />

      </Routes>
    </AuthProvider>
  );
}

export default App;