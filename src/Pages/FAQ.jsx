// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";
// import FAQForm from "./FAQForm";
// import Swal from "sweetalert2";

// export default function FAQ() {
//   const [faqs, setFaqs] = useState([]);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingFAQ, setEditingFAQ] = useState(null);
//   const [openIndex, setOpenIndex] = useState(null);

//   const fetchFaqs = async () => {
//     const { data, error } = await supabase
//       .from("faq")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error("Fetch FAQ Error:", error);
//     } else {
//       setFaqs(data);
//     }
//   };

//   useEffect(() => {
//     fetchFaqs();
//   }, []);

//   const handleAddNew = () => {
//     setEditingFAQ(null);
//     setIsFormOpen(true);
//   };

//   const handleEdit = (faq) => {
//     setEditingFAQ(faq);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (id) => {
//     const confirmResult = await Swal.fire({
//       title: "Yakin ingin menghapus FAQ ini?",
//       text: "Aksi ini tidak bisa dibatalkan!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Ya, hapus!",
//       cancelButtonText: "Batal",
//     });

//     if (confirmResult.isConfirmed) {
//       const { error } = await supabase.from("faq").delete().eq("id", id);
//       if (error) {
//         console.error("Delete Error:", error);
//         Swal.fire("Gagal!", `Gagal menghapus: ${error.message}`, "error");
//       } else {
//         Swal.fire("Terhapus!", "FAQ berhasil dihapus.", "success");
//         fetchFaqs();
//       }
//     }
//   };

//   const handleFormClose = () => {
//     setIsFormOpen(false);
//     setEditingFAQ(null);
//     fetchFaqs();
//   };

//   const handleSuccess = () => {
//     Swal.fire({
//       icon: "success",
//       title: "Sukses!",
//       text: "Perubahan FAQ berhasil disimpan!",
//     });
//   };

//   const toggleIndex = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">FAQ – Pertanyaan Umum</h1>

//       {/* Tombol Tambah */}
//       <div className="mb-6 flex justify-end">
//         <button
//           onClick={handleAddNew}
//           className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
//         >
//           + Tambah FAQ Baru
//         </button>
//       </div>

//       {/* List FAQ */}
//       <div className="space-y-4">
//         {faqs.length === 0 ? (
//           <p className="text-center text-gray-500">Belum ada FAQ yang tersedia.</p>
//         ) : (
//           faqs.map((faq, index) => (
//             <div
//               key={faq.id}
//               className="border border-gray-300 rounded-lg bg-white shadow-sm transition"
//             >
//               <button
//                 onClick={() => toggleIndex(index)}
//                 className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
//               >
//                 <span className="font-semibold text-gray-800">{faq.question}</span>
//                 <span
//                   className={`transform transition-transform duration-300 ${
//                     openIndex === index ? "rotate-180" : ""
//                   }`}
//                 >
//                   ▼
//                 </span>
//               </button>

//               {openIndex === index && (
//                 <div className="px-4 pb-4 text-gray-700">{faq.answer}</div>
//               )}

//               <div className="flex justify-end gap-2 px-4 pb-4">
//                 <button
//                   onClick={() => handleEdit(faq)}
//                   className="text-indigo-600 hover:text-indigo-800 text-sm"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(faq.id)}
//                   className="text-red-600 hover:text-red-800 text-sm"
//                 >
//                   Hapus
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Modal Form */}
//       {isFormOpen && (
//         <FAQForm
//           onClose={handleFormClose}
//           editingFAQ={editingFAQ}
//           onSuccess={handleSuccess}
//         />
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import FAQForm from "./FAQForm";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css'; // Pastikan ini diimpor

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("faq")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setFaqs(data);
    } catch (err) {
      console.error("Fetch FAQ Error:", err.message);
      setError("Gagal memuat daftar FAQ. Pastikan tabel 'faq' ada di Supabase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAddNew = () => {
    setEditingFAQ(null);
    setIsFormOpen(true);
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Yakin ingin menghapus FAQ ini?",
      text: "Aksi ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Warna merah untuk delete
      cancelButtonColor: "#3085d6", // Warna biru untuk batal
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmResult.isConfirmed) {
      try {
        const { error: deleteError } = await supabase.from("faq").delete().eq("id", id);
        if (deleteError) throw deleteError;
        Swal.fire("Terhapus!", "FAQ berhasil dihapus.", "success");
        fetchFaqs();
      } catch (err) {
        console.error("Delete Error:", err.message);
        Swal.fire("Gagal!", `Gagal menghapus: ${err.message}`, "error");
      }
    }
  };

  const handleFormClose = (refresh = false) => {
    setIsFormOpen(false);
    setEditingFAQ(null);
    if (refresh) {
      fetchFaqs();
    }
  };

  const handleSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Sukses!",
      text: message || "Perubahan FAQ berhasil disimpan!",
    });
    handleFormClose(true); // Tutup form dan refresh data setelah sukses
  };

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // Padding dan font family yang konsisten
    <div className="p-8 bg-gray-50 min-h-screen font-inter">
      <h1 className="text-3xl font-bold text-center text-orange-700 mb-6">
        Pertanyaan Umum (FAQ)
      </h1>

      {/* Tombol Tambah FAQ */}
      <div className="flex justify-end items-center mb-6 flex-wrap gap-4">
        <button
          onClick={handleAddNew}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-700 transition-colors duration-200 flex items-center"
        >
          <i className="fas fa-plus mr-2"></i> Tambah FAQ Baru
        </button>
      </div>

      {/* Daftar FAQ */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center">
          <i className="fas fa-question-circle mr-2"></i> Daftar Pertanyaan
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="ml-3 text-lg text-gray-600">Memuat FAQ...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <i className="fas fa-info-circle text-4xl mb-3 text-gray-400"></i>
            <p className="text-lg font-medium">Belum ada FAQ yang tersedia.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg bg-white shadow-sm transition hover:shadow-md"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-gray-800 text-lg">{faq.question}</span>
                  <span
                    className={`transform transition-transform duration-300 text-orange-600 text-xl
                      ${openIndex === index ? "rotate-180" : ""}`}
                  >
                    <i className="fas fa-chevron-down"></i>
                  </span>
                </button>

                {openIndex === index && (
                  <div className="px-4 pb-4 text-gray-700 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}

                <div className="flex justify-end gap-2 px-4 pb-4 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    title="Edit FAQ"
                  >
                    <i className="fas fa-edit mr-1"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    title="Hapus FAQ"
                  >
                    <i className="fas fa-trash-alt mr-1"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <FAQForm
          onClose={handleFormClose}
          editingFAQ={editingFAQ}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}