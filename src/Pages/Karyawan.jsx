// import { useState, useEffect } from "react";
// import { supabase } from "../supabase"; // Pastikan path supabase benar
// import KaryawanForm from "./KaryawanForm";

// export default function KaryawanPage() {
//   const [karyawan, setKaryawans] = useState([]);
//   const [editingKaryawan, setEditingKaryawan] = useState(null);
//   const [isFormOpen, setIsFormOpen] = useState(false); // State untuk mengontrol visibilitas form

//   // State untuk data ringkasan role karyawan
//   const [karyawanRoleSummary, setKaryawanRoleSummary] = useState({
//     admin: { total: 0, percentage: 0 },
//     manager: { total: 0, percentage: 0 }, // Contoh role tambahan
//     staff: { total: 0, percentage: 0 },   // Contoh role tambahan
//   });

//   useEffect(() => {
//     fetchKaryawans();
//   }, []);

//   useEffect(() => {
//     calculateKaryawanRoleSummary();
//   }, [karyawan]);

//   const fetchKaryawans = async () => {
//     const { data, error } = await supabase.from("karyawan").select("*").order("created_at", { ascending: false });
//     if (error) console.error("Fetch Error:", error);
//     else setKaryawans(data);
//   };

//   const calculateKaryawanRoleSummary = () => {
//     const admin = karyawan.filter(k => k.role === 'Admin').length;
//     const manager = karyawan.filter(k => k.role === 'Manager').length;
//     const staff = karyawan.filter(k => k.role === 'Staff').length;
    
//     const totalKaryawans = karyawan.length;

//     setKaryawanRoleSummary({
//       admin: { total: admin, percentage: totalKaryawans > 0 ? ((admin / totalKaryawans) * 100).toFixed(0) : 0 },
//       manager: { total: manager, percentage: totalKaryawans > 0 ? ((manager / totalKaryawans) * 100).toFixed(0) : 0 },
//       staff: { total: staff, percentage: totalKaryawans > 0 ? ((staff / totalKaryawans) * 100).toFixed(0) : 0 },
//     });
//   };

//   const addKaryawan = async (karyawan) => {
//     const { error } = await supabase.from("karyawan").insert({
//       ...karyawan,
//       role: karyawan.role || "Admin", // Pastikan role default diset
//     });
//     if (error) {
//         console.error("Insert Error:", error);
//         alert(`Error adding karyawan: ${error.message}`);
//     }
//     else {
//       fetchKaryawans();
//       setIsFormOpen(false);
//       setEditingKaryawan(null);
//     }
//   };

//   const updateKaryawan = async (karyawan) => {
//     const { error } = await supabase.from("karyawan").update(karyawan).eq("id", karyawan.id);
//     if (error) {
//         console.error("Update Error:", error);
//         alert(`Error updating karyawan: ${error.message}`);
//     }
//     else {
//       fetchKaryawans();
//       setEditingKaryawan(null);
//       setIsFormOpen(false);
//     }
//   };

//   const deleteKaryawan = async (id) => {
//     if (window.confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
//         const { error } = await supabase.from("karyawan").delete().eq("id", id);
//         if (error) {
//             console.error("Delete Error:", error);
//             alert(`Error deleting karyawan: ${error.message}`);
//         }
//         else fetchKaryawans();
//     }
//   };

//   // Helper untuk mendapatkan warna role (sesuaikan dengan desain Anda)
//   const getRoleColor = (role) => {
//     switch (role) {
//       case 'Admin':
//         return 'bg-red-500';
//       case 'Manager':
//         return 'bg-purple-500'; // Contoh warna untuk Manager
//       case 'Staff':
//         return 'bg-green-500'; // Contoh warna untuk Staff
//       default:
//         return 'bg-gray-500';
//     }
//   };

//   const handleEditClick = (karyawan) => {
//     setEditingKaryawan(karyawan);
//     setIsFormOpen(true);
//   };

//   const handleAddNewClick = () => {
//     setEditingKaryawan(null);
//     setIsFormOpen(true);
//   };

//   const handleCloseForm = () => {
//     setIsFormOpen(false);
//     setEditingKaryawan(null);
//   };

//   // Helper function to format date for display in table
//   const formatDateForTable = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Manajemen Karyawan</h1>

//       {/* Karyawan Role Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> {/* Grid bisa disesuaikan jika ada lebih banyak role */}
//         {/* Admin Total */}
//         <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
//           <p className="text-gray-600 text-lg">Admin Karyawan</p>
//           <p className="text-4xl font-bold text-red-500 mt-2">{karyawanRoleSummary.admin.total}</p>
//           <p className="text-green-500 text-sm">+{karyawanRoleSummary.admin.percentage}% of total</p>
//         </div>

//         {/* Manager Total (Contoh) */}
//         <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
//           <p className="text-gray-600 text-lg">Manager Karyawan</p>
//           <p className="text-4xl font-bold text-purple-500 mt-2">{karyawanRoleSummary.manager.total}</p>
//           <p className="text-green-500 text-sm">+{karyawanRoleSummary.manager.percentage}% of total</p>
//         </div>

//         {/* Staff Total (Contoh) */}
//         <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
//           <p className="text-gray-600 text-lg">Staff Karyawan</p>
//           <p className="text-4xl font-bold text-green-500 mt-2">{karyawanRoleSummary.staff.total}</p>
//           <p className="text-green-500 text-sm">+{karyawanRoleSummary.staff.percentage}% of total</p>
//         </div>
//       </div>

//       {/* Button to open form */}
//       <div className="mb-6 flex justify-end">
//         <button
//           onClick={handleAddNewClick}
//           className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
//         >
//           + Tambah Karyawan Baru
//         </button>
//       </div>

//       {/* KaryawanForm - Conditionally rendered */}
//       {isFormOpen && (
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold text-gray-800">{editingKaryawan ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}</h2>
//             <button
//               onClick={handleCloseForm}
//               className="text-gray-500 hover:text-gray-800 text-xl font-bold"
//             >
//               &times;
//             </button>
//           </div>
//           <KaryawanForm
//             addKaryawan={addKaryawan}
//             updateKaryawan={updateKaryawan}
//             editingKaryawan={editingKaryawan}
//             onClose={handleCloseForm}
//           />
//         </div>
//       )}

//       {/* Karyawan List Table */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar Karyawan</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kelamin</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Ditambahkan</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {karyawan.map((k) => (
//                 <tr key={k.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{k.nama}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{k.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{k.alamat}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{k.jenis_kelamin}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getRoleColor(k.role)}`}>
//                       {k.role}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateForTable(k.created_at)}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button onClick={() => handleEditClick(k)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
//                     <button onClick={() => deleteKaryawan(k.id)} className="text-red-600 hover:text-red-900">Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabase"; // Pastikan path supabase benar
import KaryawanForm from "./KaryawanForm";
import Swal from 'sweetalert2'; // Import SweetAlert2

// Import ikon dari lucide-react
import {
  User, // Untuk judul utama dan kartu ringkasan
  Users, // Untuk total karyawan
  UserCog, // Untuk role Admin
  UserCheck, // Untuk role Manager
  UserRound, // Untuk role Staff
  Plus, // Untuk tombol tambah baru
  Search, // Untuk input pencarian
  Edit, // Untuk tombol edit
  Trash2, // Untuk tombol hapus
  X, // Untuk tombol tutup form
  Filter // Untuk dropdown filter
} from 'lucide-react';

export default function KaryawanPage() {
  const [karyawan, setKaryawans] = useState([]);
  const [editingKaryawan, setEditingKaryawan] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // State untuk mengontrol visibilitas form
  const [searchQuery, setSearchQuery] = useState(''); // State untuk pencarian nama/email
  const [roleFilter, setRoleFilter] = useState(''); // State untuk filter role
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Jumlah item per halaman

  // State untuk data ringkasan role karyawan
  const [karyawanRoleSummary, setKaryawanRoleSummary] = useState({
    total: { count: 0, percentage: 0 },
    admin: { count: 0, percentage: 0 },
    manager: { count: 0, percentage: 0 },
    staff: { count: 0, percentage: 0 },
  });

  useEffect(() => {
    fetchKaryawans();
  }, []);

  // Recalculate summary whenever 'karyawan' state changes
  useEffect(() => {
    calculateKaryawanRoleSummary();
  }, [karyawan]);

  const fetchKaryawans = async () => {
    const { data, error } = await supabase.from("karyawan").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Fetch Error:", error);
      Swal.fire('Error', `Gagal memuat data karyawan: ${error.message}`, 'error');
    } else {
      setKaryawans(data);
    }
  };

  const calculateKaryawanRoleSummary = () => {
    const total = karyawan.length;
    const adminCount = karyawan.filter(k => k.role === 'Admin').length;
    const managerCount = karyawan.filter(k => k.role === 'Manager').length;
    const staffCount = karyawan.filter(k => k.role === 'Staff').length;

    setKaryawanRoleSummary({
      total: { count: total, percentage: 100 }, // Total selalu 100% dari dirinya sendiri
      admin: { count: adminCount, percentage: total > 0 ? ((adminCount / total) * 100).toFixed(0) : 0 },
      manager: { count: managerCount, percentage: total > 0 ? ((managerCount / total) * 100).toFixed(0) : 0 },
      staff: { count: staffCount, percentage: total > 0 ? ((staffCount / total) * 100).toFixed(0) : 0 },
    });
  };

  const addKaryawan = async (newKaryawan) => {
    const { error } = await supabase.from("karyawan").insert({
      ...newKaryawan,
      role: newKaryawan.role || "Staff", // Pastikan role default diset, misalnya 'Staff'
    });
    if (error) {
      console.error("Insert Error:", error);
      Swal.fire('Error', `Gagal menambahkan karyawan: ${error.message}`, 'error');
    } else {
      fetchKaryawans();
      setIsFormOpen(false);
      setEditingKaryawan(null);
      Swal.fire('Berhasil!', 'Karyawan berhasil ditambahkan.', 'success');
    }
  };

  const updateKaryawan = async (updatedKaryawan) => {
    const { error } = await supabase.from("karyawan").update(updatedKaryawan).eq("id", updatedKaryawan.id);
    if (error) {
      console.error("Update Error:", error);
      Swal.fire('Error', `Gagal memperbarui data karyawan: ${error.message}`, 'error');
    } else {
      fetchKaryawans();
      setEditingKaryawan(null);
      setIsFormOpen(false);
      Swal.fire('Berhasil!', 'Data karyawan berhasil diperbarui.', 'success');
    }
  };

  const deleteKaryawan = async (id, nama) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Anda akan menghapus karyawan bernama ${nama}. Tindakan ini tidak dapat dibatalkan!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316', // Orange-500
      cancelButtonColor: '#6b7280', // Gray-500
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("karyawan").delete().eq("id", id);
        if (error) {
          console.error("Delete Error:", error);
          Swal.fire('Error', `Gagal menghapus karyawan: ${error.message}`, 'error');
        } else {
          fetchKaryawans();
          Swal.fire('Terhapus!', 'Karyawan berhasil dihapus.', 'success');
        }
      }
    });
  };

  // Helper untuk mendapatkan warna role
  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-500 text-white';
      case 'Manager':
        return 'bg-purple-500 text-white';
      case 'Staff':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleEditClick = (karyawan) => {
    setEditingKaryawan(karyawan);
    setIsFormOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingKaryawan(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingKaryawan(null);
  };

  // Helper function to format date for display in table
  const formatDateForTable = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Filter karyawan berdasarkan search query dan role filter
  const filteredKaryawan = useMemo(() => {
    let currentKaryawan = karyawan;

    if (searchQuery) {
      currentKaryawan = currentKaryawan.filter(k =>
        k.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter) {
      currentKaryawan = currentKaryawan.filter(k => k.role === roleFilter);
    }
    return currentKaryawan;
  }, [karyawan, searchQuery, roleFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredKaryawan.length / itemsPerPage);
  const paginatedKaryawan = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredKaryawan.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredKaryawan, currentPage, itemsPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <div className="p-8 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-700 mb-2 flex items-center justify-center">
            <User className="inline-block mr-3 w-8 h-8" /> Manajemen Karyawan
          </h1>
          <div className="w-24 h-1 bg-orange-700 rounded-full mx-auto mb-6" />
          <p className="text-gray-600 text-base max-w-lg mx-auto">
            Kelola data karyawan, peran, dan informasi kontak mereka dengan mudah.
          </p>
        </header>

        {/* Karyawan Role Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Karyawan */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center border-l-4 border-orange-600">
            <Users className="text-orange-500 mb-2" size={32} />
            <p className="text-gray-600 text-base font-semibold">Total Karyawan</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">{karyawanRoleSummary.total.count}</p>
            <p className="text-gray-500 text-sm">100% dari keseluruhan</p>
          </div>

          {/* Admin Karyawan */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center border-l-4 border-red-500">
            <UserCog className="text-red-500 mb-2" size={32} />
            <p className="text-gray-600 text-base font-semibold">Karyawan Admin</p>
            <p className="text-4xl font-bold text-red-500 mt-2">{karyawanRoleSummary.admin.count}</p>
            <p className="text-gray-500 text-sm">{karyawanRoleSummary.admin.percentage}% dari total</p>
          </div>

          {/* Manager Karyawan */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center border-l-4 border-purple-500">
            <UserCheck className="text-purple-500 mb-2" size={32} />
            <p className="text-gray-600 text-base font-semibold">Karyawan Manager</p>
            <p className="text-4xl font-bold text-purple-500 mt-2">{karyawanRoleSummary.manager.count}</p>
            <p className="text-gray-500 text-sm">{karyawanRoleSummary.manager.percentage}% dari total</p>
          </div>

          {/* Staff Karyawan */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center border-l-4 border-green-500">
            <UserRound className="text-green-500 mb-2" size={32} />
            <p className="text-gray-600 text-base font-semibold">Karyawan Staff</p>
            <p className="text-4xl font-bold text-green-500 mt-2">{karyawanRoleSummary.staff.count}</p>
            <p className="text-gray-500 text-sm">{karyawanRoleSummary.staff.percentage}% dari total</p>
          </div>
        </div>

        {/* Button Tambah Karyawan Baru */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddNewClick}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Karyawan Baru
          </button>
        </div>

        {/* KaryawanForm - Conditionally rendered as a modal-like section */}
        {isFormOpen && (
          <div className="bg-white p-6 rounded-lg shadow-xl mb-8 border-l-4 border-orange-500 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-700">{editingKaryawan ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}</h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-800 text-3xl font-light"
                title="Tutup Form"
              >
                <X size={24} />
              </button>
            </div>
            <KaryawanForm
              addKaryawan={addKaryawan}
              updateKaryawan={updateKaryawan}
              editingKaryawan={editingKaryawan}
              onClose={handleCloseForm} // Pass onClose to the form component
            />
          </div>
        )}

        {/* Karyawan List Table */}
        <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <Users className="inline-block w-6 h-6" /> Daftar Karyawan
          </h2>

          {/* Search Bar and Role Filter */}
          <div className="mb-5 flex flex-col md:flex-row justify-between items-center flex-wrap gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset halaman saat pencarian berubah
                }}
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1); // Reset halaman saat filter role berubah
                  }}
                  className="p-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none shadow-sm"
                >
                  <option value="">Semua Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                Total hasil: <span className="font-semibold text-orange-600">{filteredKaryawan.length}</span>
              </span>
            </div>
          </div>

          {filteredKaryawan.length === 0 ? (
            <div className="text-center text-gray-500 py-10 border-2 border-dashed border-orange-300 rounded-lg p-6">
              <User size={48} className="inline-block mb-3 text-orange-400" />
              <p className="text-lg font-medium">Tidak ada karyawan yang ditemukan dengan kriteria ini.</p>
              <p className="text-md">Coba ubah kata kunci pencarian atau tambahkan karyawan baru.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-orange-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Nama</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Alamat</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Jenis Kelamin</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Bergabung Sejak</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedKaryawan.map((k, index) => (
                    <tr key={k.id} className="hover:bg-orange-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{k.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{k.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{k.alamat}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{k.jenis_kelamin}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(k.role)}`}>
                          {k.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateForTable(k.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(k)}
                          className="text-blue-600 hover:text-blue-800 mr-4 inline-flex items-center transition duration-150 ease-in-out"
                          title="Edit Karyawan"
                        >
                          <Edit size={16} className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => deleteKaryawan(k.id, k.nama)}
                          className="text-red-600 hover:text-red-800 inline-flex items-center transition duration-150 ease-in-out"
                          title="Hapus Karyawan"
                        >
                          <Trash2 size={16} className="mr-1" /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-5 py-2 rounded-lg font-medium transition duration-200 ease-in-out flex items-center gap-2
                      ${currentPage === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                  >
                    &larr; Sebelumnya
                  </button>
                  <span className="text-gray-700 font-medium">
                    Halaman <span className="font-bold">{currentPage}</span> dari <span className="font-bold">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-5 py-2 rounded-lg font-medium transition duration-200 ease-in-out flex items-center gap-2
                      ${currentPage === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                  >
                    Berikutnya &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}