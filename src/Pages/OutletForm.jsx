// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";

// export default function OutletForm({ onClose, editingOutlet }) {
//   const [form, setForm] = useState({
//     name: "",
//     maps_url: "",
//     image_url: "",
//   });

//   useEffect(() => {
//     if (editingOutlet) {
//       setForm({
//         name: editingOutlet.name,
//         maps_url: editingOutlet.maps_url,
//         image_url: editingOutlet.image_url,
//       });
//     }
//   }, [editingOutlet]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name || !form.maps_url || !form.image_url) {
//       alert("Semua field wajib diisi!");
//       return;
//     }

//     try {
//       if (editingOutlet) {
//         const { error } = await supabase
//           .from("outlet")
//           .update(form)
//           .eq("id", editingOutlet.id);
//         if (error) throw error;
//         onClose("Data outlet berhasil diperbarui!");
//       } else {
//         const { error } = await supabase.from("outlet").insert([form]);
//         if (error) throw error;
//         onClose("Data outlet berhasil ditambahkan!");
//       }
//     } catch (error) {
//       console.error("Outlet Save Error:", error);
//       alert(`Gagal menyimpan outlet: ${error.message}`);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 backdrop-blur-sm">
//       <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
//         {/* Close button */}
//         <button
//           onClick={() => onClose()}
//           className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl font-bold"
//         >
//           &times;
//         </button>

//         <h2 className="text-xl font-bold text-gray-800 mb-6">
//           {editingOutlet ? "Edit Outlet" : "Tambah Outlet Baru"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Outlet</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Nama Outlet"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="maps_url" className="block text-sm font-medium text-gray-700">URL Maps</label>
//             <input
//               type="text"
//               id="maps_url"
//               name="maps_url"
//               value={form.maps_url}
//               onChange={handleChange}
//               placeholder="Link Google Maps"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">URL Gambar</label>
//             <input
//               type="text"
//               id="image_url"
//               name="image_url"
//               value={form.image_url}
//               onChange={handleChange}
//               placeholder="Link Gambar Internet"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
//               required
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={() => onClose()}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-md shadow-md"
//             >
//               {editingOutlet ? "Update" : "Simpan"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function OutletForm({ onClose, editingOutlet }) {
  const [form, setForm] = useState({
    name: "",
    maps_url: "",
    image_url: "",
  });

  useEffect(() => {
    if (editingOutlet) {
      setForm({
        name: editingOutlet.name,
        maps_url: editingOutlet.maps_url,
        image_url: editingOutlet.image_url,
      });
    }
  }, [editingOutlet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.maps_url || !form.image_url) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      if (editingOutlet) {
        const { error } = await supabase.from("outlet").update(form).eq("id", editingOutlet.id);
        if (error) throw error;
        onClose("Data berhasil diperbarui!");
      } else {
        const { error } = await supabase.from("outlet").insert([form]);
        if (error) throw error;
        onClose("Data berhasil ditambahkan!");
      }
    } catch (error) {
      alert(`Gagal: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#004d33]/20 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-black text-[#004d33] mb-6">
          {editingOutlet ? "Edit Outlet" : "Tambah Outlet Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase opacity-50 mb-1">Nama Outlet</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#004d33] focus:outline-none font-bold"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase opacity-50 mb-1">URL Maps</label>
            <input
              type="text"
              name="maps_url"
              value={form.maps_url}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#004d33] focus:outline-none font-bold"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase opacity-50 mb-1">URL Gambar</label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#004d33] focus:outline-none font-bold"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-[#004d33] text-white rounded-2xl font-black hover:opacity-90 transition-all"
            >
              {editingOutlet ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}