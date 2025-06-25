import { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Pastikan path supabase benar
import KaryawanForm from "./KaryawanForm";

export default function KaryawanPage() {
  const [karyawan, setKaryawans] = useState([]);
  const [editingKaryawan, setEditingKaryawan] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // State untuk mengontrol visibilitas form

  // State untuk data ringkasan role karyawan
  const [karyawanRoleSummary, setKaryawanRoleSummary] = useState({
    admin: { total: 0, percentage: 0 },
    manager: { total: 0, percentage: 0 }, // Contoh role tambahan
    staff: { total: 0, percentage: 0 },   // Contoh role tambahan
  });

  useEffect(() => {
    fetchKaryawans();
  }, []);

  useEffect(() => {
    calculateKaryawanRoleSummary();
  }, [karyawan]);

  const fetchKaryawans = async () => {
    const { data, error } = await supabase.from("karyawan").select("*").order("created_at", { ascending: false });
    if (error) console.error("Fetch Error:", error);
    else setKaryawans(data);
  };

  const calculateKaryawanRoleSummary = () => {
    const admin = karyawan.filter(k => k.role === 'Admin').length;
    const manager = karyawan.filter(k => k.role === 'Manager').length;
    const staff = karyawan.filter(k => k.role === 'Staff').length;
    
    const totalKaryawans = karyawan.length;

    setKaryawanRoleSummary({
      admin: { total: admin, percentage: totalKaryawans > 0 ? ((admin / totalKaryawans) * 100).toFixed(0) : 0 },
      manager: { total: manager, percentage: totalKaryawans > 0 ? ((manager / totalKaryawans) * 100).toFixed(0) : 0 },
      staff: { total: staff, percentage: totalKaryawans > 0 ? ((staff / totalKaryawans) * 100).toFixed(0) : 0 },
    });
  };

  const addKaryawan = async (karyawan) => {
    const { error } = await supabase.from("karyawan").insert({
      ...karyawan,
      role: karyawan.role || "Admin", // Pastikan role default diset
    });
    if (error) {
        console.error("Insert Error:", error);
        alert(`Error adding karyawan: ${error.message}`);
    }
    else {
      fetchKaryawans();
      setIsFormOpen(false);
      setEditingKaryawan(null);
    }
  };

  const updateKaryawan = async (karyawan) => {
    const { error } = await supabase.from("karyawan").update(karyawan).eq("id", karyawan.id);
    if (error) {
        console.error("Update Error:", error);
        alert(`Error updating karyawan: ${error.message}`);
    }
    else {
      fetchKaryawans();
      setEditingKaryawan(null);
      setIsFormOpen(false);
    }
  };

  const deleteKaryawan = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
        const { error } = await supabase.from("karyawan").delete().eq("id", id);
        if (error) {
            console.error("Delete Error:", error);
            alert(`Error deleting karyawan: ${error.message}`);
        }
        else fetchKaryawans();
    }
  };

  // Helper untuk mendapatkan warna role (sesuaikan dengan desain Anda)
  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-500';
      case 'Manager':
        return 'bg-purple-500'; // Contoh warna untuk Manager
      case 'Staff':
        return 'bg-green-500'; // Contoh warna untuk Staff
      default:
        return 'bg-gray-500';
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
    return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Manajemen Karyawan</h1>

      {/* Karyawan Role Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> {/* Grid bisa disesuaikan jika ada lebih banyak role */}
        {/* Admin Total */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <p className="text-gray-600 text-lg">Admin Karyawan</p>
          <p className="text-4xl font-bold text-red-500 mt-2">{karyawanRoleSummary.admin.total}</p>
          <p className="text-green-500 text-sm">+{karyawanRoleSummary.admin.percentage}% of total</p>
        </div>

        {/* Manager Total (Contoh) */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <p className="text-gray-600 text-lg">Manager Karyawan</p>
          <p className="text-4xl font-bold text-purple-500 mt-2">{karyawanRoleSummary.manager.total}</p>
          <p className="text-green-500 text-sm">+{karyawanRoleSummary.manager.percentage}% of total</p>
        </div>

        {/* Staff Total (Contoh) */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <p className="text-gray-600 text-lg">Staff Karyawan</p>
          <p className="text-4xl font-bold text-green-500 mt-2">{karyawanRoleSummary.staff.total}</p>
          <p className="text-green-500 text-sm">+{karyawanRoleSummary.staff.percentage}% of total</p>
        </div>
      </div>

      {/* Button to open form */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddNewClick}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Tambah Karyawan Baru
        </button>
      </div>

      {/* KaryawanForm - Conditionally rendered */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{editingKaryawan ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}</h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
          </div>
          <KaryawanForm
            addKaryawan={addKaryawan}
            updateKaryawan={updateKaryawan}
            editingKaryawan={editingKaryawan}
            onClose={handleCloseForm}
          />
        </div>
      )}

      {/* Karyawan List Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar Karyawan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kelamin</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Ditambahkan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {karyawan.map((k) => (
                <tr key={k.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{k.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{k.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{k.alamat}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{k.jenis_kelamin}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getRoleColor(k.role)}`}>
                      {k.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateForTable(k.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEditClick(k)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => deleteKaryawan(k.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}