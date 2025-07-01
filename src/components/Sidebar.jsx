import { BsPeopleFill } from "react-icons/bs";
import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  BarChart2,
  Settings,
  LogIn,
  UserPlus,
  User,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { FaQuestionCircle, FaUser } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import { AiFillSchedule } from "react-icons/ai";

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard />, path: '/' },
  { name: 'Produk', icon: <Box />, path: '/produk' },
  { name: 'Sales', icon: <ShoppingCart />, path: '/sales' },
  { name: 'Laporan', icon: <BarChart2 />, path: '/laporan' },
  { name: 'Customer', icon: <BsPeopleFill />, path: '/customer' },
  { name: 'FAQ', icon: <FaQuestionCircle />, path: '/faq' },
  { name: 'Feedback', icon: <MdFeedback />, path: '/feedback' },
  { name: 'Shift', icon: <AiFillSchedule />, path: '/shift' },
  { name: 'Outlet', icon: <FaMapLocationDot />, path: '/branch' },
  // { name: 'HomeUser', icon: <FaMapLocationDot />, path: '/HomeUser' },
  { name: 'User', icon: <FaUser />, path: '/user' },
  { name: 'Karyawan', icon: <FaUser />, path: '/karyawan' },
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
      <div className="text-xl font-bold mb-8 text-orange-700">
        <img className="px-8" src="https://images.seeklogo.com/logo-png/51/1/tomoro-coffee-logo-png_seeklogo-513701.png" alt="Tomoro Coffee Logo" />
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            // Tambahkan kelas border-l-4 dan border-orange-500 untuk penanda aktif
            // Sesuaikan padding-left (pl) agar tidak bergeser jika border ditambahkan
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg transition
              ${isActive(item.path)
                ? 'bg-orange-100 text-orange-800 font-semibold border-l-4 border-orange-500 pl-2' // Item aktif: background lebih terang, border kiri
                : 'text-gray-700 hover:bg-orange-50' // Item tidak aktif: hover dengan background sangat terang
              }
            `}
          >
            <span className="w-5 h-5">{item.icon}</span>
            {item.name}
          </Link>
        ))}

      </nav>
    </aside>
  );
};

export default Sidebar;