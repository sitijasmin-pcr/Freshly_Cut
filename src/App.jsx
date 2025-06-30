// src/App.jsx
import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { supabase } from './supabase'; // Import Supabase client here

// Admin Pages
import Dashboard from './Pages/Dashboard';
import MainLayout from './components/MainLayout';
import Customer from './Pages/Customer';
import Faq from './Pages/FAQ';
import FAQForm from './Pages/FAQForm';
import Produk from './Pages/Produk';
import SalesForm from './Pages/SalesForm';
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
import CreateAccount from './USERPAGE/CreateAccount';
import FeedbackUser from './USERPAGE/FeedbackUser';
import ProfileUser from './USERPAGE/ProfileUser';
import LokasiUser from './USERPAGE/LokasiUser';
import OrderInformation from './USERPAGE/OrderInformation';

// Pastikan jalur ini benar untuk CartContext.jsx
import { CartProvider } from "./USERPAGE/CartContext";

// Import komponen Login yang baru
import Login from './Login';

import '@fortawesome/fontawesome-free/css/all.min.css';

// --- Auth Context Setup ---
export const AuthContext = createContext(null);

// DUMMY ADMIN USER (Does not need to be in Supabase)
const DUMMY_ADMIN = { 
  email: 'admin@tomoro.com', 
  password: 'adminpassword', 
  role: 'admin',
  nama: 'Admin Tomoro', // Dummy name for display in profile
  title: 'Gold', // Dummy title for display in profile
  address: 'Tomoro Headquarters, Global', // Dummy address
  Profile_Picture: 'https://placehold.co/150x150/FFD700/000000?text=Admin' // Dummy profile pic
};

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null); 
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Function to handle user login
  const login = async (email, password) => {
    setIsAuthLoading(true);
    // 1. Check for DUMMY ADMIN credentials first
    if (email === DUMMY_ADMIN.email && password === DUMMY_ADMIN.password) {
      setIsAuthenticated(true);
      setUserRole(DUMMY_ADMIN.role);
      setUserEmail(DUMMY_ADMIN.email);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', DUMMY_ADMIN.role);
      localStorage.setItem('loggedInUserEmail', DUMMY_ADMIN.email);
      console.log("Login successful as DUMMY ADMIN.");
      setIsAuthLoading(false);
      return true;
    }

    // 2. If not dummy admin, proceed with Supabase authentication
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, pass, role')
        .eq('email', email)
        .single();

      if (error) {
        console.error("Supabase login error:", error.message);
        return false;
      }

      if (data && data.pass === password) {
        setIsAuthenticated(true);
        setUserRole(data.role);
        setUserEmail(data.email);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('loggedInUserEmail', data.email);
        console.log("Login successful via Supabase.");
        return true;
      } else {
        console.log("Invalid credentials or user not found in Supabase.");
        return false;
      }
    } catch (err) {
      console.error("Authentication failed:", err.message);
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loggedInUserEmail');
    console.log("User logged out. localStorage cleared.");
  };

  // Check login status from localStorage when the app loads
  React.useEffect(() => {
    console.log("AuthContext useEffect running...");
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedRole = localStorage.getItem('userRole');
    const storedEmail = localStorage.getItem('loggedInUserEmail');

    if (storedAuth === 'true' && storedRole && storedEmail) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      setUserEmail(storedEmail);
      console.log("Found stored session:", { storedAuth, storedRole, storedEmail });
    } else {
      console.log("No stored session found or incomplete.");
    }
    setIsAuthLoading(false);
  }, []);

  const authContextValue = {
    isAuthenticated,
    userRole,
    userEmail, // Provide userEmail in context value
    login,
    logout,
    isAuthLoading
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {isAuthLoading ? (
        <div className="flex items-center justify-center min-h-screen text-gray-700">
          Loading authentication...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole, isAuthLoading } = useContext(AuthContext);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated. Redirecting to Login.");
    return <Navigate to="/Login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log(`ProtectedRoute: User role '${userRole}' not allowed for this route. Redirecting.`);
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
      <CartProvider>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/CreateAccount" element={<CreateAccount />} />
          <Route path="/" element={<Navigate to="Login" replace />} />
          
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/faqform" element={<FAQForm />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/laporan" element={<Penjualan />} />
              <Route path="/produk" element={<Produk />} />
              <Route path="/produkTerlaris" element={<ProdukTerlaris />} />
              <Route path="/sales" element={<SalesManagement />} />
              <Route path="/salesform" element={<SalesForm />} />
              <Route path="/branch" element={<BranchOutlet />} />
              <Route path="/shift" element={<ShiftManagement />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/user" element={<User />} />
              <Route path="/karyawan" element={<Karyawan />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/HomeUser" element={<HomeUser />} />
            <Route path="/MenuUser" element={<MenuUser />} />
            <Route path="/CartUser" element={<CartUser />} />
            <Route path="/CheckoutUser" element={<CheckoutUser />} />
            <Route path="/NotificationUser" element={<NotificationUser />} />
            <Route path="/ChatUser" element={<ChatUser />} />
            <Route path="/FAQUser" element={<FAQUser />} />
            <Route path="/ProfInfo" element={<ProfInfo />} />
            <Route path="/FeedbackUser" element={<FeedbackUser />} />
            <Route path="/ProfileUser" element={<ProfileUser />} />
            <Route path="/lokasi" element={<LokasiUser />} />
            <Route path="/order-information" element={<OrderInformation />} />
          </Route>

          <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-700">404 Not Found</div>} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
