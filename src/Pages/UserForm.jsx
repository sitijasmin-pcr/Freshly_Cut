import { useState, useEffect } from 'react';

// Komponen form untuk menambah atau mengedit pengguna
const UserForm = ({ addUser, updateUser, editingUser, setEditingUser }) => {
  // Inisialisasi state form dengan nilai default hanya untuk atribut yang diperlukan
  const [form, setForm] = useState({
    nama: '',
    email: '',
    pass: '', // Atribut password
  });

  // Efek samping untuk mengisi form saat editingUser berubah
  useEffect(() => {
    if (editingUser) {
      // Mengisi form dengan data pengguna yang sedang diedit
      // Penting: Jangan mengisi field 'pass' dari data yang sudah ada (untuk keamanan).
      // Pengguna harus memasukkan password baru jika ingin mengubahnya saat edit.
      setForm({
        nama: editingUser.nama,
        email: editingUser.email,
        pass: '', // Kosongkan password saat edit, pengguna harus memasukkan ulang/baru
      });
    } else {
      // Mengosongkan form jika tidak ada pengguna yang diedit
      setForm({
        nama: '',
        email: '',
        pass: '',
      });
    }
  }, [editingUser]); // Dependensi: efek akan dijalankan saat editingUser berubah

  // Handler untuk perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handler untuk submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi dasar: nama, email, dan password tidak boleh kosong
    if (!form.nama || !form.email || !form.pass) {
      alert('Nama, Email, dan Password tidak boleh kosong!'); // Tetap gunakan alert sederhana untuk validasi form langsung
      return;
    }

    // Panggil fungsi addUser atau updateUser berdasarkan mode
    // Saat edit, hanya kirim nama dan email, password akan diatur ulang oleh pengguna.
    // Jika password kosong saat edit, jangan update field password di database.
    if (editingUser) {
      const { id, nama, email } = form; // Ambil id dari editingUser
      const dataToUpdate = { nama, email };
      if (form.pass) { // Hanya sertakan password jika diisi saat edit
          dataToUpdate.pass = form.pass;
      }
      updateUser({ id: editingUser.id, ...dataToUpdate });
    } else {
      addUser(form);
    }

    // Reset form setelah submit atau update berhasil
    setForm({
      nama: '',
      email: '',
      pass: '',
    });

    // Jika dalam mode edit, reset editingUser di komponen induk
    if (editingUser && setEditingUser) {
      setEditingUser(null);
    }
  };

  // Handler untuk tombol batal/reset
  const handleCancel = () => {
    // Mengosongkan form
    setForm({
      nama: '',
      email: '',
      pass: '',
    });
    // Mengatur editingUser kembali ke null di komponen induk
    if (setEditingUser) {
      setEditingUser(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Nama */}
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input
            type="text"
            id="nama"
            name="nama"
            placeholder="Misal: Budi Santoso"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={form.nama}
            onChange={handleChange}
            required
          />
        </div>

        {/* Input Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email@example.com"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Input Password */}
        <div>
          <label htmlFor="pass" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="pass"
            name="pass"
            placeholder={editingUser ? "Biarkan kosong jika tidak diubah" : "Masukkan password"}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={form.pass}
            onChange={handleChange}
            required={!editingUser} // Wajib diisi saat menambah, opsional saat edit
          />
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-end space-x-3 mt-6">
        {editingUser && (
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 shadow-md text-lg"
          >
            <i className="fas fa-times-circle mr-2"></i> Batal
          </button>
        )}
        <button
          type="submit"
          className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 shadow-md text-lg"
        >
          <i className="fas fa-save mr-2"></i> {editingUser ? 'Perbarui Pengguna' : 'Tambah Pengguna'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
