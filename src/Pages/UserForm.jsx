import { useState, useEffect } from 'react';

const UserForm = ({ addUser, updateUser, editingUser }) => {
  const [form, setForm] = useState({
    nama: '',
    usia: '',
    penghasilan: '',
    jenis_kelamin: '',
    jenis_kegiatan: '',
    tingkat_kadar_gula: '',
    email: '',
    metode_pembayaran_favorit: '',
    status_member: '',
  });

  useEffect(() => {
    if (editingUser) setForm(editingUser);
    else setForm({
      nama: '',
      usia: '',
      penghasilan: '',
      jenis_kelamin: '',
      jenis_kegiatan: '',
      tingkat_kadar_gula: '',
      email: '',
      metode_pembayaran_favorit: '',
      status_member: '',
    });
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.email) return;  // Validasi dasar
    editingUser ? updateUser(form) : addUser(form);
    setForm({
      nama: '',
      usia: '',
      penghasilan: '',
      jenis_kelamin: '',
      jenis_kegiatan: '',
      tingkat_kadar_gula: '',
      email: '',
      metode_pembayaran_favorit: '',
      status_member: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Nama"
        className="w-full p-2 border rounded"
        value={form.nama}
        onChange={e => setForm({ ...form, nama: e.target.value })}
      />

      <input
        type="number"
        placeholder="Usia"
        className="w-full p-2 border rounded"
        value={form.usia}
        onChange={e => setForm({ ...form, usia: e.target.value })}
      />

      <input
        type="number"
        placeholder="Penghasilan"
        className="w-full p-2 border rounded"
        value={form.penghasilan}
        onChange={e => setForm({ ...form, penghasilan: e.target.value })}
      />

      <select
        className="w-full p-2 border rounded"
        value={form.jenis_kelamin}
        onChange={e => setForm({ ...form, jenis_kelamin: e.target.value })}
      >
        <option value="">Pilih Jenis Kelamin</option>
        <option value="Pria">Pria</option>
        <option value="Wanita">Wanita</option>
      </select>

      <select
        className="w-full p-2 border rounded"
        value={form.jenis_kegiatan}
        onChange={e => setForm({ ...form, jenis_kegiatan: e.target.value })}
      >
        <option value="">Pilih Jenis Kegiatan</option>
        <option value="Mahasiswa">Mahasiswa</option>
        <option value="Pengangguran">Pengangguran</option>
        <option value="Pekerja Kantoran">Pekerja Kantoran</option>
      </select>

      <select
        className="w-full p-2 border rounded"
        value={form.tingkat_kadar_gula}
        onChange={e => setForm({ ...form, tingkat_kadar_gula: e.target.value })}
      >
        <option value="">Tingkat Kadar Gula</option>
        <option value="Rendah">Rendah</option>
        <option value="Sedang">Sedang</option>
        <option value="Tinggi">Tinggi</option>
      </select>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <select
        className="w-full p-2 border rounded"
        value={form.metode_pembayaran_favorit}
        onChange={e => setForm({ ...form, metode_pembayaran_favorit: e.target.value })}
      >
        <option value="">Metode Pembayaran Favorit</option>
        <option value="QRIS">QRIS</option>
        <option value="Cash">Cash</option>
      </select>

      <select
        className="w-full p-2 border rounded"
        value={form.status_member}
        onChange={e => setForm({ ...form, status_member: e.target.value })}
      >
        <option value="">Status Member</option>
        <option value="Gold">Gold</option>
        <option value="Silver">Silver</option>
        <option value="Bronze">Bronze</option>
      </select>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {editingUser ? 'Perbarui User' : 'Tambah User'}
      </button>
    </form>
  );
};

export default UserForm;
