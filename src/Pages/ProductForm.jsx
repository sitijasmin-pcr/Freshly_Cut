import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function ProductForm({ onClose, onSuccess, editingProduct }) {
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    harga: "",
    deskripsi: "",
    gambar: "",
  });

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    } else {
      setForm({
        nama: "",
        kategori: "",
        harga: "",
        deskripsi: "",
        gambar: "",
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.kategori || !form.harga) {
      alert("Nama, Kategori, Harga wajib diisi!");
      return;
    }

    if (editingProduct) {
      await supabase
        .from("produk")
        .update(form)
        .eq("id", editingProduct.id);
    } else {
      await supabase.from("produk").insert([form]);
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? "Edit Produk" : "Tambah Produk"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="nama"
            placeholder="Nama Produk"
            className="w-full border rounded p-2"
            value={form.nama}
            onChange={handleChange}
          />

          <select
            name="kategori"
            className="w-full border rounded p-2"
            value={form.kategori}
            onChange={handleChange}
          >
            <option value="">Pilih Kategori</option>
            <option value="Food and Bakery">Food and Bakery</option>
            <option value="Classic Coffee">Classic Coffee</option>
            <option value="Non Coffee">Non Coffee</option>
            <option value="Fruity Series">Fruity Series</option>
            <option value="Cheese Latte Series">Cheese Latte Series</option>
            <option value="Cloud Series">Cloud Series</option>
            <option value="Jujutsu Kaisen Series">Jujutsu Kaisen Series</option>
            <option value="UPSETDUCK X PISTACHIO SERIES">UPSETDUCK X PISTACHIO SERIES</option>
            <option value="Pesta Kuliner Banting Harga">Pesta Kuliner Banting Harga</option>
            <option value="SPECIAL OFFER">SPECIAL OFFER</option>
            <option value="Flash Sale Makan Harian">Flash Sale Makan Harian</option>
          </select>

          <input
            type="number"
            name="harga"
            placeholder="Harga"
            className="w-full border rounded p-2"
            value={form.harga}
            onChange={handleChange}
          />

          <textarea
            name="deskripsi"
            placeholder="Deskripsi"
            className="w-full border rounded p-2"
            value={form.deskripsi}
            onChange={handleChange}
          />

          <input
            type="text"
            name="gambar"
            placeholder="URL Gambar (Internet URL)"
            className="w-full border rounded p-2"
            value={form.gambar}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
