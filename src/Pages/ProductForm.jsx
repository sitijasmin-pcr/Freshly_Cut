import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function ProductForm({ onClose, onSuccess, editingProduct }) {
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    harga: "",
    deskripsi: "",
    gambar: "",
    created_at: "",
  });

  useEffect(() => {
    if (editingProduct) {
      setForm({
        ...editingProduct,
        deskripsi: editingProduct.deskripsi || "",
        gambar: editingProduct.gambar || "",
        created_at: editingProduct.created_at || "",
      });
    } else {
      setForm({
        nama: "",
        kategori: "",
        harga: "",
        deskripsi: "",
        gambar: "",
        created_at: "", // Pastikan ini kosong untuk produk baru
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
      alert("Nama, Kategori, dan Harga wajib diisi!");
      return;
    }

    const dataToSubmit = { ...form };
    if (!editingProduct) {
      // Hapus created_at jika ini produk baru agar Supabase mengisi otomatis
      delete dataToSubmit.created_at;
    }

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("produk")
          .update(dataToSubmit)
          .eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("produk").insert([dataToSubmit]);
        if (error) throw error;
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting product:", error);
      alert(`Gagal menyimpan produk: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-3xl font-semibold leading-none"
          aria-label="Tutup"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nama"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Produk
            </label>
            <input
              type="text"
              name="nama"
              id="nama"
              placeholder="Nama Produk"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={form.nama}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="kategori"
              className="block text-sm font-medium text-gray-700"
            >
              Kategori
            </label>
            <select
              name="kategori"
              id="kategori"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={form.kategori}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="Food and Bakery">Food and Bakery</option>
              <option value="Classic Coffee">Classic Coffee</option>
              <option value="Non Coffee">Non Coffee</option>
              <option value="Fruity Series">Fruity Series</option>
              <option value="Cheese Latte Series">Cheese Latte Series</option>
              <option value="Cloud Series">Cloud Series</option>
              <option value="Jujutsu Kaisen Series">
                Jujutsu Kaisen Series
              </option>
              <option value="UPSETDUCK X PISTACHIO SERIES">
                UPSETDUCK X PISTACHIO SERIES
              </option>
              <option value="Pesta Kuliner Banting Harga">
                Pesta Kuliner Banting Harga
              </option>
              <option value="SPECIAL OFFER">SPECIAL OFFER</option>
              <option value="Flash Sale Makan Harian">
                Flash Sale Makan Harian
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="harga"
              className="block text-sm font-medium text-gray-700"
            >
              Harga
            </label>
            <input
              type="number"
              name="harga"
              id="harga"
              placeholder="Harga (Rp)"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={form.harga}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="deskripsi"
              className="block text-sm font-medium text-gray-700"
            >
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              id="deskripsi"
              placeholder="Deskripsi Produk"
              rows="3"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 resize-y"
              value={form.deskripsi}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="gambar"
              className="block text-sm font-medium text-gray-700"
            >
              URL Gambar
            </label>
            <input
              type="text"
              name="gambar"
              id="gambar"
              placeholder="URL Gambar (Internet URL)"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={form.gambar}
              onChange={handleChange}
            />
            {form.gambar && (
              <div className="mt-2 text-center">
                <img
                  src={form.gambar}
                  alt="Preview"
                  className="max-h-24 mx-auto rounded-md object-contain"
                />
              </div>
            )}
          </div>

          {editingProduct && form.created_at && (
            <div>
              <label
                htmlFor="created_at"
                className="block text-sm font-medium text-gray-700"
              >
                Tanggal Ditambahkan
              </label>
              <input
                name="created_at"
                id="created_at"
                value={formatDate(form.created_at)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                readOnly
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-colors"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}