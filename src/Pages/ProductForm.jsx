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
<<<<<<< HEAD
      setForm(editingProduct);
    }
  }, [editingProduct]);

  // ================= FORMAT RUPIAH (DISPLAY SAJA) =================
  const formatRupiah = (value) => {
    if (!value) return "";
    return "Rp " + Number(value).toLocaleString("id-ID");
=======
      setForm({
        nama: editingProduct.nama || "",
        kategori: editingProduct.kategori || "",
        harga: editingProduct.harga?.toString() || "",
        deskripsi: editingProduct.deskripsi || "",
        gambar: editingProduct.gambar || "",
      });
    }
  }, [editingProduct]);

  const formatRupiah = (value) => {
    if (!value) return "";
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
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
<<<<<<< HEAD
    setImageFile(e.target.files[0]);
=======
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
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
=======

    if (!form.nama || !form.kategori || !form.harga) {
      alert("Nama, Kategori, dan Harga wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = form.gambar;

      // 🔥 UPLOAD GAMBAR (AMAN)
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split(".").pop();
          const fileName = `${Date.now()}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from("produk-images")
            .upload(fileName, imageFile, {
              cacheControl: "3600",
              upsert: true,
              contentType: imageFile.type,
            });

          if (!error && data) {
            const { data: publicUrlData } = supabase.storage
              .from("produk-images")
              .getPublicUrl(data.path);

            imageUrl = publicUrlData.publicUrl;
          } else {
            console.warn("Upload gagal, lanjut tanpa gambar");
          }
        } catch (err) {
          console.warn("Upload error:", err);
        }
      }

      const dataToSubmit = {
        nama: form.nama,
        kategori: form.kategori,
        harga: Number(form.harga),
        deskripsi: form.deskripsi || "",
        gambar: imageUrl || null,
      };

      let result;

      // 🔥 FIX CORS → pakai UPSERT
      if (editingProduct) {
        result = await supabase
          .from("produk")
          .upsert({
            id: editingProduct.id,
            ...dataToSubmit,
          })
          .select();
      } else {
        result = await supabase
          .from("produk")
          .insert([dataToSubmit])
          .select();
      }

      if (result.error) throw result.error;

      alert("Berhasil disimpan!");
      onSuccess();
      onClose();

    } catch (error) {
      console.error("ERROR:", error);
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RETURN HARUS DI LUAR TRY
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-[2rem] shadow-xl w-full max-w-lg relative">

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
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
            required
          />

          <select
            name="kategori"
<<<<<<< HEAD
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
=======
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
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
            required
          />

          <textarea
            name="deskripsi"
            placeholder="Deskripsi"
<<<<<<< HEAD
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

=======
            className="w-full p-3 rounded-xl border-2 border-[#004d33]/20"
            value={form.deskripsi}
            onChange={handleChange}
          />

          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="w-full p-2 border-2 border-[#004d33]/20 rounded-xl"
          />

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

>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
        </form>
      </div>
    </div>
  );
}