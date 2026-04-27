import { TbToolsKitchen2 } from "react-icons/tb";
import { BsPeopleFill } from "react-icons/bs";
import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  BarChart2,
  Settings,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import {FaQuestionCircle} from "react-icons/fa";
import { MdFeedback } from "react-icons/md";


// 🔥 IMPORT LOGO (PASTIKAN PATH BENAR)
import FreshlyLogo from "../assets/FreshlyLogo.png";

const menuItems = [
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
  // { name: 'Sales', icon: <ShoppingCart />, path: '/sales' },
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
];

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="bg-white w-64 min-h-screen shadow-lg px-4 py-6 hidden md:block">
      
      {/* LOGO + TEXT */}
      <div className="mb-8 flex flex-col items-center">
        <img 
          className="w-24" 
          src="src/assets/FreshlyLogo.png" 
          alt="Freshly Logo" 
        />
        <h1 className="mt-2 text-lg font-bold italic text-green-700 tracking-wide drop-shadow-sm">
          Freshly Cut
        </h1>
      </div>
            <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
              ${
                isActive(item.path)
                  ? 'bg-orange-100 text-orange-800 font-semibold border-l-4 border-orange-500 pl-2'
                  : 'text-gray-700 hover:bg-orange-50'
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