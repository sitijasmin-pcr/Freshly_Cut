<<<<<<< HEAD
import { TbToolsKitchen2 } from "react-icons/tb";
import { BsPeopleFill } from "react-icons/bs";
=======
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  BarChart2,
<<<<<<< HEAD
  Settings,
  LogIn,
  UserPlus,
=======
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";

// 🔥 IMPORT LOGO (PASTIKAN PATH BENAR)
import FreshlyLogo from "../assets/FreshlyLogo.png";

const menuItems = [
<<<<<<< HEAD
  { name: 'Dashboard', icon: <BarChart2 />, path: '/laporan' },
  // { name: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard' },
  { name: 'Produk', icon: <Box />, path: '/produk' },
  { name: 'POS', icon: <ShoppingCart />, path: '/sales' },
  { name: 'Produksi & Modal', icon: <BarChart2 />, path: '/produksi' },
  // { name: 'Customer', icon: <BsPeopleFill />, path: '/customer' },
  { name: 'FAQ', icon: <FaQuestionCircle />, path: '/faq' },
  // { name: 'Feedback', icon: <MdFeedback />, path: '/feedback' },
  // { name: 'Shift', icon: <AiFillSchedule />, path: '/shift' },
  { name: 'Materials', icon: <TbToolsKitchen2 />, path: '/materials' },
  { name: 'Sales', icon: <ShoppingCart />, path: '/sales' },
  // { name: 'Customer', icon: <BsPeopleFill />, path: '/customer' },
  // { name: 'Shift', icon: <AiFillSchedule />, path: '/shift' },
  { name: 'Feedback', icon: <MdFeedback />, path: '/feedback' },
  { name: 'Outlet', icon: <FaMapLocationDot />, path: '/branch' },
  { name: 'User', icon: <FaUser />, path: '/user' },
];

const accountItems = [
  { name: 'Pengaturan Akun', icon: <Settings />, path: '/akun' },
  { name: 'Sign In', icon: <LogIn />, path: '/signin' },
  { name: 'Sign Up', icon: <UserPlus />, path: '/signup' },
=======
  { name: 'Dashboard', icon: <LayoutDashboard />, path: '/laporan' },
  { name: 'Produk', icon: <Box />, path: '/produk' },
  { name: 'POS', icon: <ShoppingCart />, path: '/sales' },
  { name: 'Produksi & Modal', icon: <BarChart2 />, path: '/produksi' },
  { name: 'Outlet', icon: <FaMapLocationDot />, path: '/branch' },
  { name: 'User', icon: <FaUser />, path: '/user' },
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
];

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
<<<<<<< HEAD
    <aside className="bg-white w-64 min-h-screen shadow-lg px-4 py-6 hidden md:block">
      <div className="text-xl font-bold mb-8 text-orange-700">
        <img
          className="px-8"
          src="https://images.seeklogo.com/logo-png/51/1/tomoro-coffee-logo-png_seeklogo-513701.png"
          alt="Logo"
        />
      </div>

      <nav className="space-y-1">
=======
    <aside className="bg-[#FDF8EE] w-64 min-h-screen shadow-lg px-5 py-8 hidden md:block border-r border-[#004d33]/10">

      {/* 🔥 LOGO + BRAND */}
      <div className="flex flex-col items-center mb-10">

        {/* LOGO */}
        <div className="bg-white p-3 rounded-full shadow-md mb-3 hover:scale-105 transition duration-300">
          <img
            src={FreshlyLogo}
            alt="Freshly Logo"
            className="w-20 h-20 object-contain"
          />
        </div>

        {/* TEXT BRAND */}
        <h1 className="text-xl font-extrabold tracking-wide">
          <span className="text-[#004d33]">Freshly </span>
          <span className="text-orange-500 italic">Cut</span>
        </h1>

      </div>

      {/* MENU */}
      <nav className="space-y-2">
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
<<<<<<< HEAD
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
              ${
                isActive(item.path)
                  ? 'bg-orange-100 text-orange-800 font-semibold border-l-4 border-orange-500 pl-2'
                  : 'text-gray-700 hover:bg-orange-50'
=======
            className={`
              flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200
              ${
                isActive(item.path)
                  ? 'bg-[#004d33] text-white shadow-md'
                  : 'text-[#004d33] hover:bg-orange-100 hover:text-orange-600'
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
              }
            `}
          >
            <span className="w-5 h-5">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar; 