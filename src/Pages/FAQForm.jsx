import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Swal from "sweetalert2";

export default function FAQForm({ onClose, editingFAQ, onSuccess }) {
  const [form, setForm] = useState({ question: "", answer: "" });

  useEffect(() => {
    if (editingFAQ) setForm({ question: editingFAQ.question, answer: editingFAQ.answer });
  }, [editingFAQ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = editingFAQ 
      ? await supabase.from("faq").update(form).eq("id", editingFAQ.id)
      : await supabase.from("faq").insert([form]);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Berhasil!", "Data tersimpan.", "success");
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#004d33]/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-black text-[#004d33] mb-6">
          {editingFAQ ? "Edit FAQ" : "Tambah FAQ"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Pertanyaan</label>
            <input
              type="text"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none"
              value={form.question}
              onChange={(e) => setForm({...form, question: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Jawaban</label>
            <textarea
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none"
              rows="4"
              value={form.answer}
              onChange={(e) => setForm({...form, answer: e.target.value})}
              required
            />
          </div>

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
              className="flex-1 py-3 bg-[#004d33] text-white rounded-2xl font-black hover:bg-orange-600 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}