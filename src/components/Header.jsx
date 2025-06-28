import React from 'react'; // Pastikan React diimpor
import { useLocation } from 'react-router-dom'; // Import useLocation
import { Search, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x); // Memecah pathname dan membersihkan string kosong

  let currentPageName = 'Dashboard'; // Default jika di root path atau tidak dikenali

  if (pathnames.length > 0) {
    const lastPathSegment = pathnames[pathnames.length - 1];

    // Proses nama file untuk mendapatkan nama halaman yang rapi
    currentPageName = lastPathSegment
      .replace(/\.jsx$/i, '') // Hapus ekstensi .jsx (case-insensitive)
      .replace(/([A-Z])/g, ' $1') // Tambahkan spasi sebelum huruf kapital (misal: CustomerForm -> Customer Form)
      .trim() // Hapus spasi di awal/akhir
      .split(' ') // Pecah berdasarkan spasi
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Kapitalisasi setiap kata
      .join(' '); // Gabungkan kembali dengan spasi

    // Penanganan khusus untuk nama rute yang perlu tampilan berbeda
    // Sesuai dengan daftar file .jsx yang Anda berikan
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
        currentPageName = 'Employee'; // Contoh: jika Anda ingin mengubah "Karyawan" menjadi "Employee"
        break;
      case 'Karyawanform':
        currentPageName = 'Employee Form';
        break;
      case 'Listzin':
        currentPageName = 'List Permit'; // Atau "List Izin" jika bahasa Indonesia
        break;
      case 'Outletform':
        currentPageName = 'Outlet Form';
        break;
      case 'Penjualan':
        currentPageName = 'Sales'; // Contoh: jika Anda ingin mengubah "Penjualan" menjadi "Sales"
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
      // Tambahkan case lain jika ada rute yang perlu penanganan khusus
      default:
        // Jika tidak ada penanganan khusus, gunakan nama yang sudah diproses
        break;
    }
  }

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="text-sm text-gray-500">
        Pages / <span className="text-gray-900 font-semibold">{currentPageName}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Type here..."
            className="px-4 py-2 pl-10 text-sm border rounded-full focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-purple-700">
          <User className="w-4 h-4" />
          Sign In
        </div>
      </div>
    </header>
  );
};

export default Header;