// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";

// export default function ProductForm({ onClose, onSuccess, editingProduct }) {
//   const [form, setForm] = useState({
//     nama: "",
//     kategori: "",
//     harga: "",
//     deskripsi: "",
//     gambar: "",
//   });

//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (editingProduct) {
//       setForm(editingProduct);
//     }
//   }, [editingProduct]);

//   // ================= FORMAT RUPIAH (DISPLAY SAJA) =================
//   const formatRupiah = (value) => {
//     if (!value) return "";
//     return "Rp " + Number(value).toLocaleString("id-ID");
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "harga") {
//       const angka = value.replace(/\D/g, "");
//       setForm((prev) => ({ ...prev, harga: angka }));
//     } else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleFileChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let imageUrl = "";

//       if (imageFile) {
//         const fileName = `${Date.now()}_${imageFile.name}`;

//         const { error: uploadError } = await supabase.storage
//           .from("produk-images")
//           .upload(fileName, imageFile);

//         if (uploadError) throw uploadError;

//         const { data } = supabase.storage
//           .from("produk-images")
//           .getPublicUrl(fileName);

//         imageUrl = data.publicUrl;
//       }

//       const payload = {
//         nama: form.nama,
//         kategori: form.kategori,
//         harga: Number(form.harga),
//         deskripsi: form.deskripsi,
//         gambar: imageUrl,
//       };

//       const { data, error } = await supabase
//         .from("produk")
//         .insert([payload])
//         .select();

//       if (error) throw error;

//       onSuccess();
//       onClose();

//     } catch (err) {
//       alert("Gagal: " + err.message);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-xl w-[400px]">

//         <h2 className="text-xl font-bold mb-4">
//           {editingProduct ? "Edit Produk" : "Tambah Produk"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-3">

//           <input
//             name="nama"
//             placeholder="Nama"
//             value={form.nama}
//             onChange={handleChange}
//             className="w-full p-2 border"
//             required
//           />

//           <select
//             name="kategori"
//             value={form.kategori}
//             onChange={handleChange}
//             className="w-full p-2 border"
//             required
//           >
//             <option value="">Pilih Kategori</option>
//             <option>Buah Potong 250gr</option>
//             <option>Buah Potong 500gr</option>
//             <option>Dessert</option>
//           </select>

//           {/* ================= HARGA (RUPIAH DISPLAY) ================= */}
//           <input
//             name="harga"
//             placeholder="Harga"
//             value={formatRupiah(form.harga)}
//             onChange={handleChange}
//             className="w-full p-2 border"
//             required
//           />

//           <textarea
//             name="deskripsi"
//             placeholder="Deskripsi"
//             value={form.deskripsi}
//             onChange={handleChange}
//             className="w-full p-2 border"
//           />

//           {/* ================= FILE UPLOAD FIX UI ================= */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-semibold">
//               Upload Gambar
//             </label>

//             <div className="relative w-full">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//               />

//               <div className="w-full p-2 border rounded bg-white text-gray-600 cursor-pointer hover:bg-gray-50">
//                 {imageFile ? imageFile.name : "Choose File"}
//               </div>
//             </div>
//           </div>

//           <button
//             disabled={loading}
//             className="w-full bg-green-700 text-white p-2"
//           >
//             {loading ? "Menyimpan..." : "Simpan"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Swal from "sweetalert2";

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
      setForm({
        nama: editingProduct.nama || "",
        kategori: editingProduct.kategori || "",
        harga: editingProduct.harga || "",
        deskripsi: editingProduct.deskripsi || "",
        gambar: editingProduct.gambar || "",
      });
    }
  }, [editingProduct]);

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
      let imageUrl = form.gambar;

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

      let error;

      if (editingProduct) {
        ({ error } = await supabase
          .from("produk")
          .update(payload)
          .eq("id", editingProduct.id));
      } else {
        ({ error } = await supabase.from("produk").insert([payload]));
      }

      if (error) throw error;

      Swal.fire("Berhasil!", "Data tersimpan.", "success");

      onSuccess();
      onClose();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#004d33]/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-300">

        <h2 className="text-2xl font-black text-[#004d33] mb-6">
          {editingProduct ? "Edit Produk" : "Tambah Produk"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAMA */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase">
              Nama Produk
            </label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          {/* KATEGORI */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase">
              Kategori
            </label>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none"
              required
            >
              <option value="">Pilih Kategori</option>
              <option>Buah Potong 250gr</option>
              <option>Buah Potong 500gr</option>
              <option>Dessert</option>
            </select>
          </div>

          {/* HARGA */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase">
              Harga
            </label>
            <input
              name="harga"
              value={formatRupiah(form.harga)}
              onChange={handleChange}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              rows="4"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase">
              Gambar
            </label>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500">
                {imageFile ? imageFile.name : "Upload gambar"}
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#004d33] text-white rounded-2xl font-black hover:bg-orange-600 transition-colors"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}