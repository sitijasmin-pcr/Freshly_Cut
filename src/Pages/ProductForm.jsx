// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";

// export default function ProductForm({ onClose, onSuccess, editingProduct }) {
//   const [form, setForm] = useState({
//     nama: "",
//     kategori: "",
//     harga: "",
//     deskripsi: "",
//     gambar: "",
//     created_at: "",
//   });

//   useEffect(() => {
//     if (editingProduct) {
//       setForm({
//         ...editingProduct,
//         deskripsi: editingProduct.deskripsi || "",
//         gambar: editingProduct.gambar || "",
//         created_at: editingProduct.created_at || "",
//       });
//     } else {
//       setForm({
//         nama: "",
//         kategori: "",
//         harga: "",
//         deskripsi: "",
//         gambar: "",
//         created_at: "",
//       });
//     }
//   }, [editingProduct]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.nama || !form.kategori || !form.harga) {
//       alert("Nama, Kategori, dan Harga wajib diisi!");
//       return;
//     }

//     const dataToSubmit = { ...form };
//     if (!editingProduct) {
//       delete dataToSubmit.created_at;
//     }

//     try {
//       if (editingProduct) {
//         const { error } = await supabase
//           .from("produk")
//           .update(dataToSubmit)
//           .eq("id", editingProduct.id);
//         if (error) throw error;
//       } else {
//         const { error } = await supabase.from("produk").insert([dataToSubmit]);
//         if (error) throw error;
//       }
//       onSuccess();
//       onClose();
//     } catch (error) {
//       console.error("Error submitting product:", error);
//       alert(`Gagal menyimpan produk: ${error.message}`);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString("id-ID", options);
//   };

//   return (
//     // Hapus div backdrop dan modal content yang dibuat manual,
//     // karena ProductForm sekarang akan dirender di dalam Dialog.Panel di ProductPage.
//     // ProductPage akan menangani backdrop dan struktur modal.
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 backdrop-blur-sm">
//       {/* Modal content: Container putih yang berisi form itu sendiri */}
//       <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up">
//         {/* Tombol Close (X) */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-3xl font-semibold leading-none"
//           aria-label="Tutup"
//         >
//           &times;
//         </button>

//         {/* Judul Modal */}
//         <h2 className="text-xl font-bold text-gray-800 mb-6">
//           {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label
//               htmlFor="nama"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Nama Produk
//             </label>
//             <input
//               type="text"
//               name="nama"
//               id="nama"
//               placeholder="Nama Produk"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//               value={form.nama}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="kategori"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Kategori
//             </label>
//             <select
//               name="kategori"
//               id="kategori"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//               value={form.kategori}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Pilih Kategori</option>
//               <option value="Food and Bakery">Food and Bakery</option>
//               <option value="Classic Coffee">Classic Coffee</option>
//               <option value="Non Coffee">Non Coffee</option>
//               <option value="Fruity Series">Fruity Series</option>
//               <option value="Cheese Latte Series">Cheese Latte Series</option>
//               <option value="Cloud Series">Cloud Series</option>
//               <option value="Jujutsu Kaisen Series">
//                 Jujutsu Kaisen Series
//               </option>
//               <option value="UPSETDUCK X PISTACHIO SERIES">
//                 UPSETDUCK X PISTACHIO SERIES
//               </option>
//               <option value="Pesta Kuliner Banting Harga">
//                 Pesta Kuliner Banting Harga
//               </option>
//               <option value="SPECIAL OFFER">SPECIAL OFFER</option>
//               <option value="Flash Sale Makan Harian">
//                 Flash Sale Makan Harian
//               </option>
//             </select>
//           </div>

//           <div>
//             <label
//               htmlFor="harga"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Harga
//             </label>
//             <input
//               type="number"
//               name="harga"
//               id="harga"
//               placeholder="Harga (Rp)"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//               value={form.harga}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="deskripsi"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Deskripsi
//             </label>
//             <textarea
//               name="deskripsi"
//               id="deskripsi"
//               placeholder="Deskripsi Produk"
//               rows="3"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 resize-y"
//               value={form.deskripsi}
//               onChange={handleChange}
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="gambar"
//               className="block text-sm font-medium text-gray-700"
//             >
//               URL Gambar
//             </label>
//             <input
//               type="text"
//               name="gambar"
//               id="gambar"
//               placeholder="URL Gambar (Internet URL)"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//               value={form.gambar}
//               onChange={handleChange}
//             />
//             {form.gambar && (
//               <div className="mt-2 text-center">
//                 <img
//                   src={form.gambar}
//                   alt="Preview"
//                   className="max-h-24 mx-auto rounded-md object-contain"
//                 />
//               </div>
//             )}
//           </div>

//           {editingProduct && form.created_at && (
//             <div>
//               <label
//                 htmlFor="created_at"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Tanggal Ditambahkan
//               </label>
//               <input
//                 name="created_at"
//                 id="created_at"
//                 value={formatDate(form.created_at)}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
//                 readOnly
//               />
//             </div>
//           )}

//           {/* Bagian tombol */}
//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-colors"
//             >
//               Simpan Produk
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
// Import SweetAlert2 jika Anda ingin notifikasi sukses/error di dalam form modal
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Asumsi supabase diimport di file ProductForm ini juga
// import { supabase } from '../supabase'; // Hapus komentar ini jika Anda memindahkannya

const ProductForm = ({ onClose, onSuccess, editingProduct }) => {
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    harga: "",
    deskripsi: "",
    gambar: "", // URL gambar
  });
  const [loading, setLoading] = useState(false); // State loading untuk form submit

  // Definisikan kategori yang sama dengan ProductPage.jsx
  const categories = [
    "Food and Bakery",
    "Classic Coffee",
    "Non Coffee",
    "Fruity Series",
    "Cheese Latte Series",
    "Cloud Series",
    "Jujutsu Kaisen Series",
    "UPSETDUCK X PISTACHIO SERIES",
    "Pesta Kuliner Banting Harga",
    "SPECIAL OFFER",
    "Flash Sale Makan Harian",
  ];

  // Efek samping untuk mengisi form saat editingProduct berubah
  useEffect(() => {
    if (editingProduct) {
      setForm({
        nama: editingProduct.nama || "",
        kategori: editingProduct.kategori || "",
        harga: editingProduct.harga || "",
        deskripsi: editingProduct.deskripsi || "",
        gambar: editingProduct.gambar || "",
      });
    } else {
      // Reset form jika tidak ada produk yang diedit
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
    // Konversi harga ke angka jika bukan string kosong
    setForm({
      ...form,
      [name]: name === "harga" && value !== "" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validasi dasar
    if (!form.nama || !form.kategori || !form.harga) {
      Swal.fire('Input Tidak Lengkap', 'Nama, Kategori, dan Harga harus diisi!', 'warning');
      setLoading(false);
      return;
    }

    try {
      if (editingProduct) {
        // Logika update produk
        const { error } = await supabase
          .from("produk")
          .update(form)
          .eq("id", editingProduct.id);
        if (error) throw error;
        Swal.fire('Berhasil!', 'Produk berhasil diperbarui.', 'success');
      } else {
        // Logika tambah produk baru
        const { error } = await supabase.from("produk").insert(form);
        if (error) throw error;
        Swal.fire('Berhasil!', 'Produk berhasil ditambahkan.', 'success');
      }
      onSuccess(); // Panggil fungsi onSuccess dari parent (ProductPage) untuk refresh data
      onClose(); // Tutup modal setelah sukses
    } catch (err) {
      console.error("Submit Error:", err.message);
      Swal.fire('Gagal!', `Terjadi kesalahan: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Struktur Modal
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-fade-in-up">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          <i className="fas fa-times-circle"></i>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama Produk */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Produk</label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Nama produk..."
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Select Kategori */}
          <div>
            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              id="kategori"
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Input Harga */}
          <div>
            <label htmlFor="harga" className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
            <input
              type="number"
              id="harga"
              name="harga"
              value={form.harga}
              onChange={handleChange}
              placeholder="Harga produk..."
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
              required
            />
          </div>

          {/* Textarea Deskripsi */}
          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              rows="3"
              placeholder="Deskripsi singkat produk..."
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          {/* Input Gambar URL */}
          <div>
            <label htmlFor="gambar" className="block text-sm font-medium text-gray-700">URL Gambar Produk</label>
            <input
              type="url"
              id="gambar"
              name="gambar"
              value={form.gambar}
              onChange={handleChange}
              placeholder="http://example.com/image.jpg"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Tombol Submit dan Batal */}
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <i className="fas fa-save mr-2"></i>
              )}
              {editingProduct ? "Perbarui Produk" : "Tambah Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
