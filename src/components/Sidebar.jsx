import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  BarChart2,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";

// 🔥 IMPORT LOGO (PASTIKAN PATH BENAR)
import FreshlyLogo from "../assets/FreshlyLogo.png";

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard />, path: '/laporan' },
  { name: 'Produk', icon: <Box />, path: '/produk' },
  { name: 'POS', icon: <ShoppingCart />, path: '/sales' },
  { name: 'Produksi & Modal', icon: <BarChart2 />, path: '/produksi' },
  { name: 'Outlet', icon: <FaMapLocationDot />, path: '/branch' },
  { name: 'User', icon: <FaUser />, path: '/user' },
];

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
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
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`
              flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200
              ${
                isActive(item.path)
                  ? 'bg-[#004d33] text-white shadow-md'
                  : 'text-[#004d33] hover:bg-orange-100 hover:text-orange-600'
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