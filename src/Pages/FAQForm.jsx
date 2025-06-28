// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";

// export default function FAQForm({ onClose, editingFAQ }) {
//   const [form, setForm] = useState({
//     question: "",
//     answer: "",
//   });

//   useEffect(() => {
//     if (editingFAQ) {
//       setForm({
//         question: editingFAQ.question,
//         answer: editingFAQ.answer,
//       });
//     }
//   }, [editingFAQ]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.question || !form.answer) {
//       alert("Pertanyaan dan Jawaban wajib diisi!");
//       return;
//     }

//     try {
//       if (editingFAQ) {
//         const { error } = await supabase
//           .from("faq")
//           .update(form)
//           .eq("id", editingFAQ.id);
//         if (error) throw error;
//         alert("FAQ berhasil diperbarui!");
//       } else {
//         const { error } = await supabase.from("faq").insert([form]);
//         if (error) throw error;
//         alert("FAQ berhasil ditambahkan!");
//       }
//       onClose();
//     } catch (error) {
//       console.error("Error submitting FAQ:", error);
//       alert(`Gagal menyimpan FAQ! Error: ${error.message}`);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 backdrop-blur-sm">
//       <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
//         {/* Tombol Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl font-bold"
//         >
//           &times;
//         </button>

//         <h2 className="text-xl font-bold text-gray-800 mb-6">
//           {editingFAQ ? "Edit FAQ" : "Tambah FAQ Baru"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="question" className="block text-sm font-medium text-gray-700">
//               Pertanyaan
//             </label>
//             <input
//               type="text"
//               id="question"
//               name="question"
//               value={form.question}
//               onChange={handleChange}
//               placeholder="Masukkan pertanyaan"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
//               Jawaban
//             </label>
//             <textarea
//               id="answer"
//               name="answer"
//               value={form.answer}
//               onChange={handleChange}
//               placeholder="Masukkan jawaban"
//               rows="3"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 resize-y"
//               required
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition"
//             >
//               {editingFAQ ? "Update FAQ" : "Simpan FAQ"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Swal from "sweetalert2";

export default function FAQForm({ onClose, editingFAQ, onSuccess }) {
  const [form, setForm] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    if (editingFAQ) {
      setForm({
        question: editingFAQ.question,
        answer: editingFAQ.answer,
      });
    }
  }, [editingFAQ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.question || !form.answer) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Pertanyaan dan Jawaban wajib diisi!",
      });
      return;
    }

    try {
      if (editingFAQ) {
        const { error } = await supabase
          .from("faq")
          .update(form)
          .eq("id", editingFAQ.id);
        if (error) throw error;

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "FAQ berhasil diperbarui!",
        });
      } else {
        const { error } = await supabase.from("faq").insert([form]);
        if (error) throw error;

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "FAQ berhasil ditambahkan!",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting FAQ:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal menyimpan FAQ! Error: ${error.message}`,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {editingFAQ ? "Edit FAQ" : "Tambah FAQ Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">
              Pertanyaan
            </label>
            <input
              type="text"
              id="question"
              name="question"
              value={form.question}
              onChange={handleChange}
              placeholder="Masukkan pertanyaan"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
              Jawaban
            </label>
            <textarea
              id="answer"
              name="answer"
              value={form.answer}
              onChange={handleChange}
              placeholder="Masukkan jawaban"
              rows="3"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 resize-y"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition"
            >
              {editingFAQ ? "Update FAQ" : "Simpan FAQ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
