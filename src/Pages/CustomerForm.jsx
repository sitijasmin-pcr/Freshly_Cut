import { useState, useEffect } from "react";

export default function CustomerForm({ addCustomer, updateCustomer, editingCustomer }) {
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
    role: "User",
  });

  useEffect(() => {
    if (editingCustomer) setForm(editingCustomer);
    else setForm({
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
    });
  }, [editingCustomer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.email) {
      alert("Nama dan Email wajib diisi!");
      return;
    }
    editingCustomer ? updateCustomer(form) : addCustomer(form);
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
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-gray-100 p-4 rounded">
      <input name="nama" placeholder="Nama" value={form.nama} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="usia" placeholder="Usia" type="number" value={form.usia} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="penghasilan" placeholder="Penghasilan" type="number" value={form.penghasilan} onChange={handleChange} className="w-full p-2 border rounded" />
      <select name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Pilih Jenis Kelamin</option>
        <option value="Pria">Pria</option>
        <option value="Wanita">Wanita</option>
      </select>
      <select name="jenis_kegiatan" value={form.jenis_kegiatan} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Pilih Jenis Kegiatan</option>
        <option value="Mahasiswa">Mahasiswa</option>
        <option value="Pengangguran">Pengangguran</option>
        <option value="Pekerja Kantoran">Pekerja Kantoran</option>
      </select>
      <select name="tingkat_kadar_gula" value={form.tingkat_kadar_gula} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Pilih Tingkat Gula</option>
        <option value="Rendah">Rendah</option>
        <option value="Sedang">Sedang</option>
        <option value="Tinggi">Tinggi</option>
      </select>
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" />
      <select name="metode_pembayaran_favorit" value={form.metode_pembayaran_favorit} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Metode Pembayaran Favorit</option>
        <option value="QRIS">QRIS</option>
        <option value="Cash">Cash</option>
      </select>
      <select name="status_member" value={form.status_member} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Status Member</option>
        <option value="Gold">Gold</option>
        <option value="Silver">Silver</option>
        <option value="Bronze">Bronze</option>
      </select>
      <select name="minuman_favorit" value={form.minuman_favorit} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Minuman Favorit</option>
        <option value="Matcha">Matcha</option>
        <option value="Air mineral">Air mineral</option>
        <option value="Chocolate">Chocolate</option>
      </select>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {editingCustomer ? "Perbarui" : "Tambah"} Customer
      </button>
    </form>
  );
}
