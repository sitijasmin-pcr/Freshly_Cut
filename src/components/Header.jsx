// // import React from 'react'; // Pastikan React diimpor
// // import { useLocation } from 'react-router-dom'; // Import useLocation
// // import { Search, User } from 'lucide-react';

// // const Header = () => {
// //   const location = useLocation();
// //   const pathnames = location.pathname.split('/').filter(x => x); // Memecah pathname dan membersihkan string kosong

// //   let currentPageName = 'Dashboard'; // Default jika di root path atau tidak dikenali

// //   if (pathnames.length > 0) {
// //     const lastPathSegment = pathnames[pathnames.length - 1];

// //     // Proses nama file untuk mendapatkan nama halaman yang rapi
// //     currentPageName = lastPathSegment
// //       .replace(/\.jsx$/i, '') // Hapus ekstensi .jsx (case-insensitive)
// //       .replace(/([A-Z])/g, ' $1') // Tambahkan spasi sebelum huruf kapital (misal: CustomerForm -> Customer Form)
// //       .trim() // Hapus spasi di awal/akhir
// //       .split(' ') // Pecah berdasarkan spasi
// //       .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Kapitalisasi setiap kata
// //       .join(' '); // Gabungkan kembali dengan spasi

// //     // Penanganan khusus untuk nama rute yang perlu tampilan berbeda
// //     // Sesuai dengan daftar file .jsx yang Anda berikan
// //     switch (currentPageName) {
// //       case 'Branchoutlet':
// //         currentPageName = 'Branch Outlet';
// //         break;
// //       case 'Customerform':
// //         currentPageName = 'Customer Form';
// //         break;
// //       case 'Employeequest':
// //         currentPageName = 'Employee Request';
// //         break;
// //       case 'Faq':
// //         currentPageName = 'FAQ';
// //         break;
// //       case 'Faqform':
// //         currentPageName = 'FAQ Form';
// //         break;
// //       case 'Feedbackform':
// //         currentPageName = 'Feedback Form';
// //         break;
// //       case 'Karyawan':
// //         currentPageName = 'Employee'; // Contoh: jika Anda ingin mengubah "Karyawan" menjadi "Employee"
// //         break;
// //       case 'Karyawanform':
// //         currentPageName = 'Employee Form';
// //         break;
// //       case 'Listzin':
// //         currentPageName = 'List Permit'; // Atau "List Izin" jika bahasa Indonesia
// //         break;
// //       case 'Outletform':
// //         currentPageName = 'Outlet Form';
// //         break;
// //       case 'Penjualan':
// //         currentPageName = 'Sales'; // Contoh: jika Anda ingin mengubah "Penjualan" menjadi "Sales"
// //         break;
// //       case 'Productform':
// //         currentPageName = 'Product Form';
// //         break;
// //       case 'Produkterlaris':
// //         currentPageName = 'Best Selling Product';
// //         break;
// //       case 'Salesform':
// //         currentPageName = 'Sales Form';
// //         break;
// //       case 'Salesmanagement':
// //         currentPageName = 'Sales Management';
// //         break;
// //       case 'Shiftform':
// //         currentPageName = 'Shift Form';
// //         break;
// //       case 'Shiftmanagement':
// //         currentPageName = 'Shift Management';
// //         break;
// //       case 'Userform':
// //         currentPageName = 'User Form';
// //         break;
// //       // Tambahkan case lain jika ada rute yang perlu penanganan khusus
// //       default:
// //         // Jika tidak ada penanganan khusus, gunakan nama yang sudah diproses
// //         break;
// //     }
// //   }

// //   return (
// //     <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b sticky top-0 z-10">
// //       <div className="text-sm text-gray-500">
// //         Pages / <span className="text-gray-900 font-semibold">{currentPageName}</span>
// //       </div>
// //       <div className="flex items-center gap-4">
// //         <div className="relative">
// //           <input
// //             type="text"
// //             placeholder="Type here..."
// //             className="px-4 py-2 pl-10 text-sm border rounded-full focus:outline-none"
// //           />
// //           <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
// //         </div>
// //         <div className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-purple-700">
// //           <User className="w-4 h-4" />
// //           Sign In
// //         </div>
// //       </div>
// //     </header>
// //   );
// // };

// // export default Header;

// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Search, LogOut } from 'lucide-react';
// import Swal from 'sweetalert2';
// import 'sweetalert2/dist/sweetalert2.min.css';

// const Header = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const pathnames = location.pathname.split('/').filter(x => x);

//   let currentPageName = 'Dashboard';

//   if (pathnames.length > 0) {
//     const lastPathSegment = pathnames[pathnames.length - 1];
//     currentPageName = lastPathSegment
//       .replace(/\.jsx$/i, '')
//       .replace(/([A-Z])/g, ' $1')
//       .trim()
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');

//     switch (currentPageName) {
//       case 'Branchoutlet':
//         currentPageName = 'Branch Outlet';
//         break;
//       case 'Customerform':
//         currentPageName = 'Customer Form';
//         break;
//       case 'Employeequest':
//         currentPageName = 'Employee Request';
//         break;
//       case 'Faq':
//         currentPageName = 'FAQ';
//         break;
//       case 'Faqform':
//         currentPageName = 'FAQ Form';
//         break;
//       case 'Feedbackform':
//         currentPageName = 'Feedback Form';
//         break;
//       case 'Karyawan':
//         currentPageName = 'Employee';
//         break;
//       case 'Karyawanform':
//         currentPageName = 'Employee Form';
//         break;
//       case 'Listzin':
//         currentPageName = 'List Permit';
//         break;
//       case 'Outletform':
//         currentPageName = 'Outlet Form';
//         break;
//       case 'Penjualan':
//         currentPageName = 'Sales';
//         break;
//       case 'Productform':
//         currentPageName = 'Product Form';
//         break;
//       case 'Produkterlaris':
//         currentPageName = 'Best Selling Product';
//         break;
//       case 'Salesform':
//         currentPageName = 'Sales Form';
//         break;
//       case 'Salesmanagement':
//         currentPageName = 'Sales Management';
//         break;
//       case 'Shiftform':
//         currentPageName = 'Shift Form';
//         break;
//       case 'Shiftmanagement':
//         currentPageName = 'Shift Management';
//         break;
//       case 'Userform':
//         currentPageName = 'User Form';
//         break;
//       default:
//         break;
//     }
//   }

//   const handleLogout = () => {
//     Swal.fire({
//       title: 'Apa kamu yakin?',
//       text: "Anda akan keluar dan diarahkan ke halaman login.",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Ya, Keluar!',
//       cancelButtonText: 'Batal',
//       reverseButtons: true,
//       backdrop: true,
//       allowOutsideClick: false,
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Lakukan proses logout (misalnya hapus token auth localstorage, dsb)
//         // localStorage.removeItem('token'); // Contoh jika pakai token
//         navigate('/login'); // Redirect ke halaman login
//         Swal.fire({
//           title: 'Keluar!',
//           text: 'Anda telah berhasil keluar.',
//           icon: 'success',
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     });
//   };

//   return (
//     <header className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-orange-50 to-white shadow-sm sticky top-0 z-20">
//       {/* Breadcrumb */}
//       <div>
//         <p className="text-xs text-gray-500">Pages /</p>
//         <h1 className="text-xl font-semibold text-gray-800">{currentPageName}</h1>
//       </div>

//       {/* Right Side */}
//       <div className="flex items-center gap-4">
//         {/* Logout Button */}
//         <div
//           className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-red-600 transition"
//           onClick={handleLogout}
//         >
//           <LogOut className="w-4 h-4" />
//           <span className="font-medium">Logout</span>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

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
        <p className="text-sm text-gray-600 font-medium mb-1">
          {greeting}, Admin!
        </p>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          {currentPageName}
        </h1>
      </div>

      {/* Right Side: Logout */}
      <div className="flex items-center gap-6">

        {/* User Profile/Notification (Example placeholder) */}
        <div className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-purple-700">
          <FaBell className="w-5 h-5 text-orange-600" />
        </div>
        
        {/* Logout Button */}
        <div
          className="flex items-center gap-2 text-sm cursor-pointer text-orange-700 hover:text-red-600 transition duration-200 ease-in-out px-3 py-2 rounded-lg bg-orange -50 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium hidden sm:block">Keluar</span> {/* Hide text on very small screens */}
        </div>
      </div>
    </header>
  );
};

export default Header;