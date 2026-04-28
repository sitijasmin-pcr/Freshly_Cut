import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function FeedbackForm({ onClose, onSuccess, editingFeedback }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    feedback: "",
    rating: "",
  });

  useEffect(() => {
    if (editingFeedback) {
      setForm({
        name: editingFeedback.name || "",
        email: editingFeedback.email || "",
        feedback: editingFeedback.feedback || "",
        rating: editingFeedback.rating || "",
      });
    }
  }, [editingFeedback]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.feedback || !form.rating) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      if (editingFeedback) {
        const { error } = await supabase
          .from("feedback")
          .update(form)
          .eq("id", editingFeedback.id);

        if (error) throw error;
        onSuccess("Berhasil update feedback!");
      } else {
        const { error } = await supabase
          .from("feedback")
          .insert([form]);

        if (error) throw error;
        onSuccess("Berhasil tambah feedback!");
      }

      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#004d33]/20 backdrop-blur-sm z-50 p-4">

      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100">

        <h2 className="text-2xl font-black text-[#004d33] mb-6">
          {editingFeedback ? "Edit Feedback" : "Tambah Feedback"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="block text-xs font-black uppercase opacity-50 mb-1">
              Nama
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#004d33] font-bold"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-black uppercase opacity-50 mb-1">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#004d33] font-bold"
            />
          </div>

          {/* FEEDBACK */}
          <div>
            <label className="block text-xs font-black uppercase opacity-50 mb-1">
              Feedback
            </label>
            <textarea
              name="feedback"
              value={form.feedback}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#004d33] font-bold"
              rows="4"
              required
            />
          </div>

          {/* RATING */}
          <div>
            <label className="block text-xs font-black uppercase opacity-50 mb-1">
              Rating (1-5)
            </label>
            <input
              type="number"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              min="1"
              max="5"
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#004d33] font-bold"
              required
            />
          </div>

          {/* BUTTON */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-100"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex-1 py-4 bg-[#004d33] text-white rounded-2xl font-black hover:opacity-90"
            >
              {editingFeedback ? "Update" : "Simpan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}