import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, LogOut } from 'lucide-react';
import { FaBell } from "react-icons/fa";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter(x => x);

  // State to hold the current greeting
  const [greeting, setGreeting] = useState('');

  let currentPageName = 'Dashboard';

  if (pathnames.length > 0) {
    const lastPathSegment = pathnames[pathnames.length - 1];
    currentPageName = lastPathSegment
      .replace(/\.jsx$/i, '')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    switch (currentPageName) {
      case 'Branchoutlet':
        currentPageName = 'Branch Outlet';
        break;
      case 'Customerform':
        currentPageName = 'Customer Form';
        break;
      case 'Employeequest':
        currentPageName = 'Employee Request';
        break;
      case 'Faq':
        currentPageName = 'FAQ';
        break;
      case 'Faqform':
        currentPageName = 'FAQ Form';
        break;
      case 'Feedbackform':
        currentPageName = 'Feedback Form';
        break;
      case 'Karyawan':
        currentPageName = 'Employee';
        break;
      case 'Karyawanform':
        currentPageName = 'Employee Form';
        break;
      case 'Listzin':
        currentPageName = 'List Permit';
        break;
      case 'Outletform':
        currentPageName = 'Outlet Form';
        break;
      case 'Penjualan':
        currentPageName = 'Sales';
        break;
      case 'Productform':
        currentPageName = 'Product Form';
        break;
      case 'Produkterlaris':
        currentPageName = 'Best Selling Product';
        break;
      case 'Salesform':
        currentPageName = 'Sales Form';
        break;
      case 'Salesmanagement':
        currentPageName = 'Sales Management';
        break;
      case 'Shiftform':
        currentPageName = 'Shift Form';
        break;
      case 'Shiftmanagement':
        currentPageName = 'Shift Management';
        break;
      case 'Userform':
        currentPageName = 'User Form';
        break;
      case 'HomeUser': // Make sure this is handled if it's a new route
        currentPageName = 'Home User';
        break;
      case 'User': // Handle User page
        currentPageName = 'User Management';
        break;
      default:
        break;
    }
  }

  // Function to determine the greeting based on current time
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return 'Selamat Pagi';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Selamat Siang';
    } else if (currentHour >= 18 && currentHour < 22) {
      return 'Selamat Sore';
    } else {
      return 'Selamat Malam';
    }
  };

  // Update greeting on component mount
  useEffect(() => {
    setGreeting(getGreeting());
    // No need to update every second unless you want real-time update
    // If you want real-time update every minute for example:
    // const interval = setInterval(() => setGreeting(getGreeting()), 60 * 1000);
    // return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Apa kamu yakin?',
      text: 'Anda akan keluar dan diarahkan ke halaman login.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      backdrop: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform logout process (e.g., clear local storage token)
        // localStorage.removeItem('token'); // Example if using token
        navigate('/login'); // Redirect to login page
        Swal.fire({
          title: 'Keluar!',
          text: 'Anda telah berhasil keluar.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-white to-orange-50 shadow-sm sticky top-0 z-20">
      {/* Left Side: Greeting and Current Page */}
      <div>
      <p className="text-sm text-[#004d33]/70 font-semibold mb-1">
          {greeting}, Admin Freshly!
        </p>
        <h1 className="text-2xl font-black text-[#004d33] tracking-tight">          {currentPageName}
        </h1>
      </div>

      {/* Right Side: Logout */}
      <div className="flex items-center gap-6">

        {/* User Profile/Notification (Example placeholder) */}
        <div className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-purple-700">
        <FaBell className="w-5 h-5 text-orange-500 hover:text-[#004d33] transition" />        </div>
        
        {/* Logout Button */}
        <div
  className="flex items-center gap-2 text-sm cursor-pointer text-white bg-[#004d33] hover:bg-green-800 transition duration-200 px-4 py-2 rounded-xl shadow"
  onClick={handleLogout}
>
  <LogOut className="w-4 h-4" />
  <span className="font-semibold hidden sm:block">Keluar</span>
</div>      </div>
    </header>
  );
};

export default Header;