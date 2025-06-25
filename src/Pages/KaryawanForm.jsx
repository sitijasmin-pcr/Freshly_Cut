import { useState, useEffect } from "react";

export default function KaryawanForm({ addKaryawan, updateKaryawan, editingKaryawan, onClose }) {
  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    email: "",
    jenis_kelamin: "",
    role: "Admin", // Default role
    created_at: "", // Tambahkan created_at untuk ditampilkan saat edit
  });

  useEffect(() => {
    if (editingKaryawan) {
      setForm({
        ...editingKaryawan,
        // Pastikan semua field yang bisa null/undefined di DB dihandle
        alamat: editingKaryawan.alamat || "",
        jenis_kelamin: editingKaryawan.jenis_kelamin || "",
        role: editingKaryawan.role || "Admin",
        created_at: editingKaryawan.created_at || "",
      });
    } else {
      setForm({
        nama: "",
        alamat: "",
        email: "",
        jenis_kelamin: "",
        role: "Admin",
        created_at: "",
      });
    }
  }, [editingKaryawan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.alamat || !form.email || !form.jenis_kelamin || !form.role) {
      alert("Nama, Alamat, Email, Jenis Kelamin, dan Role wajib diisi!");
      return;
    }

    const dataToSubmit = { ...form };
    if (!editingKaryawan) {
      delete dataToSubmit.created_at; // Hapus created_at untuk penambahan baru
    }

    editingKaryawan ? updateKaryawan(dataToSubmit) : addKaryawan(dataToSubmit);
    
    // Reset form setelah submit
    setForm({
      nama: "",
      alamat: "",
      email: "",
      jenis_kelamin: "",
      role: "Admin",
      created_at: "",
    });
    onClose(); // Tutup form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama</label>
        <input name="nama" id="nama" placeholder="Nama Lengkap" value={form.nama} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input name="email" id="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
      </div>
      <div>
        <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat</label>
        <input name="alamat" id="alamat" placeholder="Alamat" value={form.alamat} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
      </div>
      <div>
        <label htmlFor="jenis_kelamin" className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
        <select name="jenis_kelamin" id="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required>
          <option value="">Pilih Jenis Kelamin</option>
          <option value="Pria">Pria</option>
          <option value="Wanita">Wanita</option>
        </select>
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
        <select name="role" id="role" value={form.role} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option> {/* Contoh role lain jika ada */}
          <option value="Staff">Staff</option> {/* Contoh role lain jika ada */}
        </select>
      </div>

      {editingKaryawan && form.created_at && (
        <div>
          <label htmlFor="created_at" className="block text-sm font-medium text-gray-700">Tanggal Ditambahkan</label>
          <input
            name="created_at"
            id="created_at"
            value={formatDate(form.created_at)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
            readOnly
          />
        </div>
      )}

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md shadow-md transition-colors"
        >
          {editingKaryawan ? "Perbarui Karyawan" : "Tambah Karyawan"}
        </button>
      </div>
    </form>
  );
}