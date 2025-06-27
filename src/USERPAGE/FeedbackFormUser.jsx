// src/components/FeedbackForm.jsx atau src/Pages/FeedbackForm.jsx (sesuaikan path)
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { supabase } from "../supabase"; // Pastikan path ini benar sesuai struktur proyek Anda

export default function FeedbackForm({ onClose, onSuccess, editingFeedback }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: "",
    feedback: "",
    role: "",
    job: "",
    photoUrl: "", // Menggunakan photoUrl di state form
  });

  useEffect(() => {
    if (editingFeedback) {
      setForm({
        name: editingFeedback.name || "",
        email: editingFeedback.email || "",
        rating: editingFeedback.rating || "",
        feedback: editingFeedback.feedback || "",
        role: editingFeedback.role || "",
        job: editingFeedback.job || "",
        photoUrl: editingFeedback.photo_url || "", // Mapping photo_url dari DB ke photoUrl di form
      });
    } else {
      setForm({
        name: "",
        email: "",
        rating: "",
        feedback: "",
        role: "",
        job: "",
        photoUrl: "",
      });
    }
  }, [editingFeedback]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Data untuk dikirim ke Supabase
    const dataToSubmit = {
      name: form.name,
      email: form.email,
      rating: parseInt(form.rating), // Pastikan rating adalah integer
      feedback: form.feedback,
      role: form.role,
      job: form.job,
      photo_url: form.photoUrl, // Mapping photoUrl dari form ke photo_url di DB
    };

    try {
      if (editingFeedback) {
        // Mode Edit
        const { error } = await supabase
          .from("feedback")
          .update(dataToSubmit)
          .eq("id", editingFeedback.id);

        if (error) throw error;
        Swal.fire("Berhasil", "Feedback berhasil diperbarui!", "success");
      } else {
        // Mode Tambah Baru
        const { error } = await supabase.from("feedback").insert([dataToSubmit]);

        if (error) throw error;
        Swal.fire("Berhasil", "Feedback berhasil ditambahkan!", "success");
      }
      onSuccess(); // Panggil onSuccess untuk refresh data di komponen induk
      onClose(); // Tutup modal
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Swal.fire("Error", `Gagal menyimpan feedback: ${error.message}`, "error");
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-xl bg-white px-4 sm:px-6 py-6 mx-auto max-h-screen overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
          <Dialog.Title className="text-lg font-bold mb-4 text-orange-700">
            {editingFeedback ? "Edit Feedback" : "Form Feedback"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email (opsional)"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <Select
              label="Peran"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Pilih peran Anda</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
            </Select>
            <Input
              label="Pekerjaan"
              name="job"
              value={form.job}
              onChange={handleChange}
            />
            <Input
              label="Link Foto Profil (opsional)"
              name="photoUrl"
              value={form.photoUrl}
              onChange={handleChange}
              placeholder="Mis: https://example.com/foto.jpg"
            />
            {form.photoUrl && (
              <div className="mt-2 text-center">
                <img src={form.photoUrl} alt="Preview" className="max-h-24 mx-auto rounded-full object-cover border-2 border-gray-200" />
              </div>
            )}
            <Select
              label="Rating Pelayanan"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              required
            >
              <option value="">Pilih rating Anda</option>
              <option value="1">⭐ Sangat Buruk</option>
              <option value="2">⭐⭐ Buruk</option>
              <option value="3">⭐⭐⭐ Cukup</option>
              <option value="4">⭐⭐⭐⭐ Baik</option>
              <option value="5">⭐⭐⭐⭐⭐ Sangat Baik</option>
            </Select>
            <Textarea
              label="Masukan atau Saran"
              name="feedback"
              value={form.feedback}
              onChange={handleChange}
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md shadow-md transition-colors"
              >
                {editingFeedback ? "Simpan Perubahan" : "Kirim"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// Komponen Input reusable
const Input = ({ label, name, type = "text", ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold mb-1">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500"
      {...props}
    />
  </div>
);

// Komponen Select reusable
const Select = ({ label, name, children, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold mb-1">{label}</label>
    <select
      id={name}
      name={name}
      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 appearance-none"
      {...props}
    >
      {children}
    </select>
  </div>
);

// Komponen Textarea reusable
const Textarea = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold mb-1">{label}</label>
    <textarea
      id={name}
      name={name}
      rows="4"
      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500"
      {...props}
    />
  </div>
);