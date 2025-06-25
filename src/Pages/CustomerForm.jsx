import { useState, useEffect } from "react";

export default function CustomerForm({ addCustomer, updateCustomer, editingCustomer, onClose }) {
  const [form, setForm] = useState({
    nama: "",
    usia: "",
    penghasilan: "",
    jenis_kelamin: "",
    jenis_kegiatan: "",
    tingkat_kadar_gula: "",
    email: "",
    metode_pembayaran_favorit: "",
    status_member: "",
    minuman_favorit: "",
    role: "User", // Default role
    created_at: "", // Tambahkan created_at ke state form
  });

  useEffect(() => {
    if (editingCustomer) {
      setForm({
        ...editingCustomer,
        // Pastikan semua field yang bisa null/undefined di DB dihandle
        usia: editingCustomer.usia || "",
        penghasilan: editingCustomer.penghasilan || "",
        jenis_kelamin: editingCustomer.jenis_kelamin || "",
        jenis_kegiatan: editingCustomer.jenis_kegiatan || "",
        tingkat_kadar_gula: editingCustomer.tingkat_kadar_gula || "",
        metode_pembayaran_favorit: editingCustomer.metode_pembayaran_favorit || "",
        status_member: editingCustomer.status_member || "",
        minuman_favorit: editingCustomer.minuman_favorit || "",
        role: editingCustomer.role || "User", // Memastikan role juga dimuat/diset
        created_at: editingCustomer.created_at || "", // Muat created_at saat edit
      });
    } else {
      setForm({
        nama: "",
        usia: "",
        penghasilan: "",
        jenis_kelamin: "",
        jenis_kegiatan: "",
        tingkat_kadar_gula: "",
        email: "",
        metode_pembayaran_favorit: "",
        status_member: "",
        minuman_favorit: "",
        role: "User",
        created_at: "", // Reset untuk form baru
      });
    }
  }, [editingCustomer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi yang lebih lengkap sesuai kebutuhan UI dan DB
    if (!form.nama || !form.email || !form.status_member || !form.metode_pembayaran_favorit) {
      alert("Nama, Email, Status Member, dan Metode Pembayaran Favorit wajib diisi!");
      return;
    }

    // Untuk `addCustomer`, jangan sertakan `created_at` karena Supabase akan mengisinya secara otomatis.
    // Untuk `updateCustomer`, `created_at` tidak perlu diupdate, jadi bisa dilewati atau biarkan saja
    // karena Supabase akan mengabaikan update pada kolom yang otomatis diisi (kecuali diatur sebaliknya).

    const dataToSubmit = { ...form };
    if (!editingCustomer) { // Jika ini adalah customer baru, hapus created_at dari data yang dikirim
      delete dataToSubmit.created_at;
    }


    editingCustomer ? updateCustomer(dataToSubmit) : addCustomer(dataToSubmit); // Gunakan dataToSubmit
    
    // Reset form setelah submit
    setForm({
      nama: "",
      usia: "",
      penghasilan: "",
      jenis_kelamin: "",
      jenis_kegiatan: "",
      tingkat_kadar_gula: "",
      email: "",
      metode_pembayaran_favorit: "",
      status_member: "",
      minuman_favorit: "",
      role: "User",
      created_at: "", // Pastikan created_at juga direset
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
        <label htmlFor="usia" className="block text-sm font-medium text-gray-700">Usia</label>
        <input name="usia" id="usia" placeholder="Usia" type="number" value={form.usia} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
      </div>
      <div>
        <label htmlFor="penghasilan" className="block text-sm font-medium text-gray-700">Penghasilan</label>
        <input name="penghasilan" id="penghasilan" placeholder="Penghasilan (Rp)" type="number" value={form.penghasilan} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
      </div>
      <div>
        <label htmlFor="jenis_kelamin" className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
        <select name="jenis_kelamin" id="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
          <option value="">Pilih Jenis Kelamin</option>
          <option value="Pria">Pria</option>
          <option value="Wanita">Wanita</option>
        </select>
      </div>
      <div>
        <label htmlFor="jenis_kegiatan" className="block text-sm font-medium text-gray-700">Jenis Kegiatan</label>
        <select name="jenis_kegiatan" id="jenis_kegiatan" value={form.jenis_kegiatan} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
          <option value="">Pilih Jenis Kegiatan</option>
          <option value="Mahasiswa">Mahasiswa</option>
          <option value="Pengangguran">Pengangguran</option>
          <option value="Pekerja Kantoran">Pekerja Kantoran</option>
        </select>
      </div>
      <div>
        <label htmlFor="tingkat_kadar_gula" className="block text-sm font-medium text-gray-700">Tingkat Kadar Gula</label>
        <select name="tingkat_kadar_gula" id="tingkat_kadar_gula" value={form.tingkat_kadar_gula} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
          <option value="">Pilih Tingkat Gula</option>
          <option value="Rendah">Rendah</option>
          <option value="Sedang">Sedang</option>
          <option value="Tinggi">Tinggi</option>
        </select>
      </div>
      <div>
        <label htmlFor="metode_pembayaran_favorit" className="block text-sm font-medium text-gray-700">Metode Pembayaran Favorit</label>
        <select name="metode_pembayaran_favorit" id="metode_pembayaran_favorit" value={form.metode_pembayaran_favorit} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required>
          <option value="">Pilih Metode Pembayaran Favorit</option>
          <option value="QRIS">QRIS</option>
          <option value="Cash">Cash</option>
        </select>
      </div>
      <div>
        <label htmlFor="status_member" className="block text-sm font-medium text-gray-700">Status Member</label>
        <select name="status_member" id="status_member" value={form.status_member} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required>
          <option value="">Pilih Status Member</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
          <option value="Bronze">Bronze</option>
          <option value="Newcomer">Newcomer</option>
        </select>
      </div>
      <div>
        <label htmlFor="minuman_favorit" className="block text-sm font-medium text-gray-700">Minuman/Produk Favorit</label>
        <input name="minuman_favorit" id="minuman_favorit" placeholder="Minuman/Produk Favorit (mis: Americano, Croissant)" value={form.minuman_favorit} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
      </div>

      {editingCustomer && form.created_at && ( // Hanya tampilkan saat edit dan created_at ada
        <div>
          <label htmlFor="created_at" className="block text-sm font-medium text-gray-700">Tanggal Ditambahkan</label>
          <input
            name="created_at"
            id="created_at"
            value={formatDate(form.created_at)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
            readOnly // Penting: ini adalah kolom yang tidak boleh diubah pengguna
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
          {editingCustomer ? "Perbarui Customer" : "Tambah Customer"}
        </button>
      </div>
    </form>
  );
}