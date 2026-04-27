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

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    }
  }, [editingProduct]);

  // ================= FORMAT RUPIAH (DISPLAY SAJA) =================
  const formatRupiah = (value) => {
    if (!value) return "";
    return "Rp " + Number(value).toLocaleString("id-ID");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "harga") {
      const angka = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, harga: angka }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from("produk-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("produk-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      const payload = {
        nama: form.nama,
        kategori: form.kategori,
        harga: Number(form.harga),
        deskripsi: form.deskripsi,
        gambar: imageUrl,
      };

      const { data, error } = await supabase
        .from("produk")
        .insert([payload])
        .select();

      if (error) throw error;

      onSuccess();
      onClose();

    } catch (err) {
      alert("Gagal: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[400px]">

        <h2 className="text-xl font-bold mb-4">
          {editingProduct ? "Edit Produk" : "Tambah Produk"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="nama"
            placeholder="Nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          />

          <select
            name="kategori"
            value={form.kategori}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          >
            <option value="">Pilih Kategori</option>
            <option>Buah Potong 250gr</option>
            <option>Buah Potong 500gr</option>
            <option>Dessert</option>
          </select>

          {/* ================= HARGA (RUPIAH DISPLAY) ================= */}
          <input
            name="harga"
            placeholder="Harga"
            value={formatRupiah(form.harga)}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          />

          <textarea
            name="deskripsi"
            placeholder="Deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            className="w-full p-2 border"
          />

          {/* ================= FILE UPLOAD FIX UI ================= */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">
              Upload Gambar
            </label>

            <div className="relative w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="w-full p-2 border rounded bg-white text-gray-600 cursor-pointer hover:bg-gray-50">
                {imageFile ? imageFile.name : "Choose File"}
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-green-700 text-white p-2"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>

        </form>
      </div>
    </div>
  );
}