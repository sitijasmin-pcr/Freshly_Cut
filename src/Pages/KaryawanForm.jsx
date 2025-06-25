import { useState, useEffect } from "react";

export default function KaryawanForm({ addKaryawan, updateKaryawan, editingKaryawan }) {
  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    email: "",
    jenis_kelamin: "",
    role: "Admin",
  });

  useEffect(() => {
    if (editingKaryawan) setForm(editingKaryawan);
    else setForm({
      nama: "",
      alamat: "",
      email: "",
      jenis_kelamin: "",
      role: "Admin",
    });
  }, [editingKaryawan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.alamat || !form.email || !form.jenis_kelamin) {
      alert("Semua field wajib diisi!");
      return;
    }
    editingKaryawan ? updateKaryawan(form) : addKaryawan(form);
    setForm({
      nama: "",
      alamat: "",
      email: "",
      jenis_kelamin: "",
      role: "Admin",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-gray-100 p-4 rounded">
      <input name="nama" placeholder="Nama" value={form.nama} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="alamat" placeholder="Alamat" value={form.alamat} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" />
      <select name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Jenis Kelamin</option>
        <option value="Pria">Pria</option>
        <option value="Wanita">Wanita</option>
      </select>
      <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="Admin">Admin</option>
      </select>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {editingKaryawan ? "Perbarui" : "Tambah"} Karyawan
      </button>
    </form>
  );
}
