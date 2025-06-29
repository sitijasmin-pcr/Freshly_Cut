import { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Pastikan path ke supabase klien Anda benar
import UserForm from './UserForm'; // Pastikan path ke UserForm.jsx Anda benar
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Komponen utama untuk menampilkan dan mengelola data pengguna
function User() {
  const [users, setUsers] = useState([]); // State untuk menyimpan daftar pengguna
  const [editingUser, setEditingUser] = useState(null); // State untuk pengguna yang sedang diedit
  const [loading, setLoading] = useState(true); // State untuk indikator loading
  const [error, setError] = useState(null); // State untuk menampilkan pesan error umum
  const [successMessage, setSuccessMessage] = useState(null); // State untuk pesan sukses
  const [errorMessage, setErrorMessage] = useState(null); // State untuk pesan error spesifik operasi

  // Fungsi untuk menampilkan pesan (sukses atau error) dan menghilangkannya setelah waktu tertentu
  const showNotification = (message, type) => {
    Swal.fire({
      icon: type, // 'success' atau 'error'
      title: type === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan!',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
  };

  // Fungsi untuk mengambil data pengguna dari Supabase
  const fetchUsers = async () => {
    setLoading(true); // Set loading ke true saat memulai fetch
    setError(null); // Reset error umum
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }
      setUsers(data); // Set data pengguna ke state
    } catch (err) {
      console.error("Error fetching users:", err.message); // Log error ke konsol
      setError("Gagal memuat data pengguna. Silakan coba lagi."); // Set pesan error umum untuk UI
    } finally {
      setLoading(false); // Set loading ke false setelah fetch selesai (baik sukses maupun gagal)
    }
  };

  // useEffect untuk memanggil fetchUsers saat komponen dimuat pertama kali
  useEffect(() => {
    fetchUsers();
  }, []); // Dependensi kosong agar hanya berjalan sekali

  // Fungsi untuk menambahkan pengguna baru ke Supabase
  const addUser = async (newUser) => {
    setLoading(true);
    try {
      const { error: insertError } = await supabase.from('users').insert(newUser);
      if (insertError) {
        throw insertError;
      }
      fetchUsers();
      showNotification("Pengguna berhasil ditambahkan!", "success");
    } catch (err) {
      console.error("Error adding user:", err.message);
      showNotification(`Gagal menambahkan pengguna: ${err.message}`, "error");
    } finally {
      setLoading(false);
      setEditingUser(null); // Tutup form setelah submit
    }
  };

  // Fungsi untuk memperbarui data pengguna di Supabase
  const updateUser = async (updatedUser) => {
    setLoading(true);
    try {
      const { id, nama, email, pass } = updatedUser;
      const payload = { nama, email };
      if (pass) { // Hanya update password jika diisi di form
        payload.pass = pass;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(payload)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }
      fetchUsers();
      setEditingUser(null); // Reset editingUser setelah update berhasil
      showNotification("Pengguna berhasil diperbarui!", "success");
    } catch (err) {
      console.error("Error updating user:", err.message);
      showNotification(`Gagal memperbarui pengguna: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghapus pengguna dari Supabase dengan konfirmasi SweetAlert2
  const handleDeleteUser = async (id, userName) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: `Anda tidak akan bisa mengembalikan data pengguna ${userName} ini!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316', // Oranye
      cancelButtonColor: '#6b7280', // Abu-abu
      confirmButtonText: 'Ya, Hapus Saja!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const { error: deleteError } = await supabase.from('users').delete().eq('id', id);
          if (deleteError) {
            throw deleteError;
          }
          fetchUsers();
          showNotification("Pengguna berhasil dihapus!", "success");
        } catch (err) {
          console.error("Error deleting user:", err.message);
          showNotification(`Gagal menghapus pengguna: ${err.message}`, "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-inter">
      {/* Header Aplikasi */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-orange-700 mb-2">
          <i className="fas fa-users mr-3"></i> Manajemen Pengguna
        </h1>
        <div className="w-24 h-1 bg-orange-700 rounded-full mx-auto mb-4" />
        <p className="text-gray-600 text-base max-w-lg mx-auto">
          Kelola data akun pengguna aplikasi Anda dengan mudah dan efisien.
        </p>
      </header>

      {/* Bagian form tambah/edit pengguna */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow-xl border-l-4 border-orange-500">
        <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center">
          <i className="fas fa-user-plus mr-3"></i> {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
        </h2>
        <UserForm
          addUser={addUser}
          updateUser={updateUser}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
        />
      </section>

      {/* Bagian daftar pengguna */}
      <section className="p-6 bg-white rounded-lg shadow-xl border-l-4 border-orange-500">
        <h2 className="text-2xl font-bold text-orange-700 mb-6 flex items-center">
          <i className="fas fa-list mr-3"></i> Daftar Pengguna
        </h2>

        {/* Indikator loading */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mb-3"></div>
            <p className="text-lg text-orange-600 font-medium">Memuat data pengguna...</p>
          </div>
        )}

        {/* Pesan error umum (jika gagal fetch data awal) */}
        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Oops!</strong>
            <span className="block sm:inline"> {error}</span>
            <p className="text-sm mt-1">Pastikan koneksi internet Anda stabil dan konfigurasi Supabase sudah benar.</p>
          </div>
        )}

        {/* Pesan jika tidak ada data */}
        {!loading && users.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-orange-300 rounded-lg p-6">
            <i className="fas fa-info-circle text-4xl mb-3 text-orange-400"></i>
            <p className="text-lg font-medium">Belum ada data pengguna.</p>
            <p className="text-md">Silakan gunakan formulir di atas untuk menambahkan pengguna pertama Anda.</p>
          </div>
        )}

        {/* Daftar pengguna dalam bentuk kartu */}
        {!loading && users.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-5 transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col justify-between border-l-4 border-orange-400"
              >
                <div>
                  <h3 className="font-bold text-xl text-orange-800 mb-2">{user.nama}</h3>
                  <p className="text-sm text-gray-600 mb-1 flex items-center">
                    <i className="fas fa-envelope mr-2 text-orange-500"></i> Email: {user.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    <i className="fas fa-clock mr-1"></i> Dibuat pada: {new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Tombol aksi (Edit, Hapus) */}
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-200 shadow-md text-sm"
                  >
                    <i className="fas fa-edit mr-2"></i> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id, user.nama)}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 shadow-md text-sm"
                  >
                    <i className="fas fa-trash-alt mr-2"></i> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default User;