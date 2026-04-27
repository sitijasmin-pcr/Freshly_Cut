import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function ProductForm({ onClose, onSuccess, editingProduct }) {
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    harga: "",
    deskripsi: "",
    gambar: "", // Akan menyimpan URL publik dari storage
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        nama: editingProduct.nama || "",
        kategori: editingProduct.kategori || "",
        harga: editingProduct.harga?.toString() || "",
        deskripsi: editingProduct.deskripsi || "",
        gambar: editingProduct.gambar || "",
      });
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

  // Format angka ke Rupiah untuk tampilan input
  const formatRupiah = (value) => {
    if (!value) return "";
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
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
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama || !form.kategori || !form.harga) {
      alert("Nama, Kategori, dan Harga wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = form.gambar;

      // 1. Upload file baru ke Supabase Storage jika ada
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("produk-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("produk-images")
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;
      }

      // 2. Data untuk disimpan ke database
      const dataToSubmit = {
        nama: form.nama,
        kategori: form.kategori,
        harga: Number(form.harga),
        deskripsi: form.deskripsi || "",
        gambar: imageUrl,
      };

      // 3. Insert atau Update ke Tabel
      let result;
      if (editingProduct) {
        result = await supabase
          .from("produk")
          .update(dataToSubmit)
          .eq("id", editingProduct.id);
      } else {
        result = await supabase.from("produk").insert([dataToSubmit]);
      }

      if (result.error) throw result.error;

      onSuccess();
      onClose();
    } catch (error) {
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-[2rem] shadow-xl w-full max-w-lg relative">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-black text-[#004d33] mb-6">
          {editingProduct ? "Edit Produk" : "Tambah Produk"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nama"
            placeholder="Nama Produk"
            className="w-full p-3 rounded-xl border-2 border-[#004d33]/20"
            value={form.nama}
            onChange={handleChange}
            required
          />

          <select
            name="kategori"
            className="w-full p-3 rounded-xl border-2 border-[#004d33]/20"
            value={form.kategori}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Kategori</option>
            <option value="Buah Potong">Buah Potong</option>
            <option value="Dessert">Dessert</option>
          </select>

          <input
            type="text"
            name="harga"
            placeholder="Harga"
            className="w-full p-3 rounded-xl border-2 border-[#004d33]/20"
            value={formatRupiah(form.harga)}
            onChange={handleChange}
            required
          />

          <textarea
            name="deskripsi"
            placeholder="Deskripsi"
            className="w-full p-3 rounded-xl border-2 border-[#004d33]/20"
            value={form.deskripsi}
            onChange={handleChange}
          />

          {/* INPUT FILE GAMBAR */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Pilih Foto Produk</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="w-full p-2 border-2 border-[#004d33]/20 rounded-xl"
            />
          </div>

          {/* PREVIEW */}
          {(imageFile || form.gambar) && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : form.gambar}
              alt="preview"
              className="w-32 h-32 object-cover mx-auto rounded-xl border-2 border-dashed border-[#004d33]/20"
            />
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 text-gray-500">
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#004d33] text-white px-5 py-2 rounded-xl hover:bg-green-900 disabled:bg-gray-400"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}