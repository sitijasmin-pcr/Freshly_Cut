import { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Pastikan path ke supabase klien Anda benar
import UserForm from './UserForm'; // Pastikan path ke UserForm.jsx Anda benar
// Import SweetAlert2
// Pastikan Anda sudah menginstal SweetAlert2 (npm install sweetalert2)
// atau menyertakan CDN-nya di public/index.html
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // Opsional: Untuk styling default SweetAlert2

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
    if (type === 'success') {
      setSuccessMessage(message);
      setErrorMessage(null); // Pastikan pesan error sebelumnya dihapus
    } else { // type === 'error'
      setErrorMessage(message);
      setSuccessMessage(null); // Pastikan pesan sukses sebelumnya dihapus
    }
    // Hapus pesan setelah 5 detik
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 5000);
  };

  // Fungsi untuk mengambil data pengguna dari Supabase
  const fetchUsers = async () => {
    setLoading(true); // Set loading ke true saat memulai fetch
    setError(null); // Reset error umum
    try {
      // Mengambil data dari tabel 'users' dan mengurutkan berdasarkan 'created_at' terbaru
      const { data, error: fetchError } = await supabase
        .from('users') // Menggunakan tabel 'users' sesuai CREATE TABLE
        .select('*') // Ambil semua kolom
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError; // Lempar error jika ada
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
    setLoading(true); // Set loading saat operasi dimulai
    setError(null); // Reset error umum
    setSuccessMessage(null); // Clear previous messages
    setErrorMessage(null); // Clear previous messages
    try {
      const { error: insertError } = await supabase.from('users').insert(newUser); // Menggunakan tabel 'users'
      if (insertError) {
        throw insertError;
      }
      fetchUsers(); // Refresh daftar pengguna setelah berhasil menambah
      showNotification("Pengguna berhasil ditambahkan!", "success"); // Tampilkan pesan sukses
    } catch (err) {
      console.error("Error adding user:", err.message);
      showNotification(`Gagal menambahkan pengguna: ${err.message}`, "error"); // Tampilkan pesan error
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memperbarui data pengguna di Supabase
  const updateUser = async (updatedUser) => {
    setLoading(true); // Set loading saat operasi dimulai
    setError(null); // Reset error umum
    setSuccessMessage(null); // Clear previous messages
    setErrorMessage(null); // Clear previous messages
    try {
      // Penting: Pastikan Anda hanya mengupdate kolom yang relevan.
      // Jika password tidak diisi di form saat edit, jangan sertakan dalam payload update.
      const { id, nama, email, pass } = updatedUser;
      const payload = { nama, email };
      if (pass) { // Hanya update password jika diisi di form
          payload.pass = pass;
      }

      const { error: updateError } = await supabase
        .from('users') // Menggunakan tabel 'users'
        .update(payload)
        .eq('id', id); // Mencari pengguna berdasarkan ID

      if (updateError) {
        throw updateError;
      }
      fetchUsers(); // Refresh daftar pengguna setelah berhasil memperbarui
      setEditingUser(null); // Reset editingUser setelah update berhasil
      showNotification("Pengguna berhasil diperbarui!", "success"); // Tampilkan pesan sukses
    } catch (err) {
      console.error("Error updating user:", err.message);
      showNotification(`Gagal memperbarui pengguna: ${err.message}`, "error"); // Tampilkan pesan error
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghapus pengguna dari Supabase dengan konfirmasi SweetAlert2
  const handleDeleteUser = async (id, userName) => {
    // Menampilkan konfirmasi SweetAlert2
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: `Anda tidak akan bisa mengembalikan data pengguna ${userName} ini!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus Saja!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true); // Set loading saat operasi dimulai
        setError(null); // Reset error umum
        setSuccessMessage(null); // Clear previous messages
        setErrorMessage(null); // Clear previous messages
        try {
          const { error: deleteError } = await supabase.from('users').delete().eq('id', id); // Menggunakan tabel 'users'
          if (deleteError) {
            throw deleteError;
          }
          fetchUsers(); // Refresh daftar pengguna setelah berhasil menghapus
          showNotification("Pengguna berhasil dihapus!", "success"); // Tampilkan pesan sukses
        } catch (err) {
          console.error("Error deleting user:", err.message);
          showNotification(`Gagal menghapus pengguna: ${err.message}`, "error"); // Tampilkan pesan error
        } finally {
          setLoading(false);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Pengguna membatalkan penghapusan
        showNotification("Penghapusan dibatalkan.", "info"); // Opsional: Tampilkan pesan info
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header aplikasi */}
        <header className="bg-indigo-600 p-6 text-white text-center rounded-t-xl">
          <h1 className="text-3xl font-extrabold tracking-tight">
            <i className="fas fa-users mr-2"></i> Manajemen Pengguna
          </h1>
          <p className="mt-1 text-indigo-200">Kelola data pengguna Anda dengan mudah dan efisien.</p>
        </header>

        {/* Konten utama aplikasi */}
        <main className="p-6">
          {/* Pesan Sukses atau Error (notifikasi) */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 shadow-md transition-opacity duration-300" role="alert">
              <strong className="font-bold">Berhasil!</strong>
              <span className="block sm:inline"> {successMessage}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setSuccessMessage(null)}>
                <i className="fas fa-times"></i>
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 shadow-md transition-opacity duration-300" role="alert">
              <strong className="font-bold">Terjadi Kesalahan!</strong>
              <span className="block sm:inline"> {errorMessage}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setErrorMessage(null)}>
                <i className="fas fa-times"></i>
              </span>
            </div>
          )}

          {/* Bagian form tambah/edit pengguna */}
          <section className="mb-8 p-6 bg-indigo-50 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
              <i className="fas fa-user-plus mr-2"></i> {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
            </h2>
            <UserForm
              addUser={addUser}
              updateUser={updateUser}
              editingUser={editingUser}
              setEditingUser={setEditingUser} // Mengirim setter untuk reset mode edit
            />
          </section>

          {/* Bagian daftar pengguna */}
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
              <i className="fas fa-list mr-2"></i> Daftar Pengguna
            </h2>

            {/* Indikator loading */}
            {loading && (
              <div className="flex flex-col justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-500 mb-3"></div>
                <p className="text-lg text-indigo-600 font-medium">Memuat data pengguna...</p>
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
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg p-6">
                <i className="fas fa-info-circle text-4xl mb-3 text-gray-400"></i>
                <p className="text-lg font-medium">Belum ada data pengguna.</p>
                <p className="text-md">Silakan gunakan formulir di atas untuk menambahkan pengguna pertama Anda.</p>
              </div>
            )}

            {/* Daftar pengguna dalam bentuk kartu */}
            {!loading && users.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-5 transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 mb-2">{user.nama}</h3>
                      <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <i className="fas fa-envelope mr-2 text-red-500"></i> Email: {user.email}
                      </p>
                      {/* Password tidak ditampilkan untuk alasan keamanan */}
                      {/*
                      <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <i className="fas fa-key mr-2 text-gray-500"></i> Password: {user.pass}
                      </p>
                      */}
                      <p className="text-xs text-gray-400 mt-2">
                        <i className="fas fa-clock mr-1"></i> Dibuat pada: {new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Tombol aksi (Edit, Hapus) */}
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 shadow-md text-sm"
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
        </main>
      </div>
    </div>
  );
}

export default User;
