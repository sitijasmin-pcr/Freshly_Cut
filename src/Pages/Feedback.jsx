// src/Pages/Feedback.jsx
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react"; // Masih dibutuhkan untuk Dialog.Panel di FeedbackForm
import { Button } from "@/components/ui/button"; // Pastikan path ini benar
import { X, Edit, Trash2 } from "lucide-react";
import { Star } from "lucide-react";
import Swal from "sweetalert2"; // Untuk notifikasi
import { supabase } from "../supabase"; // Import Supabase
import FeedbackForm from "./FeedbackForm"; // Import komponen FeedbackForm yang baru

export default function FormFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null); // State untuk feedback yang sedang diedit

  // Fungsi untuk mengambil data feedback dari Supabase
  const fetchFeedbacks = async () => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false }); // Urutkan berdasarkan waktu terbaru
    if (error) {
      console.error("Error fetching feedbacks:", error.message);
      Swal.fire("Error", `Gagal memuat feedback: ${error.message}`, "error");
    } else {
      setFeedbackList(data || []);
    }
  };

  // Panggil fetchFeedbacks saat komponen dimuat
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Feedback ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("feedback").delete().eq("id", id);

        if (!error) {
          Swal.fire("Terhapus!", "Feedback berhasil dihapus.", "success");
          fetchFeedbacks(); // Refresh daftar feedback setelah penghapusan
        } else {
          console.error("Delete error:", error.message);
          Swal.fire("Error", `Gagal menghapus feedback: ${error.message}`, "error");
        }
      }
    });
  };

  const handleOpenAddModal = () => {
    setEditingFeedback(null); // Pastikan modal dalam mode "tambah baru"
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFeedback(null); // Reset editingFeedback saat modal ditutup
  };

  return (
    <div className="p-6">
      <div className="relative mb-6">
        {/* <Button
          onClick={handleOpenAddModal}
          className="absolute top-0 right-0 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md"
        >
          + Tambah Form
        </Button> */}
        <div className="flex flex-col items-center w-full text-center">
          <h1 className="text-3xl font-bold text-orange-700">USERS FEEDBACK</h1>
          <div className="w-24 h-1 bg-orange-700 rounded-full mt-1 mb-3" />
          <p className="text-gray-600 text-sm mt-2 max-w-3xl mb-10">
          Halaman Feedback Admin berfungsi sebagai pusat kontrol bagi admin untuk memantau, membaca, dan mengelola seluruh masukan, keluhan, atau saran yang dikirimkan oleh pelanggan melalui halaman feedback customer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {feedbackList.length > 0 ? (
          feedbackList.map((item) => (
            <div key={item.id} className="relative group">
              <div className="absolute inset-0 -rotate-6 rounded-2xl bg-orange-400 z-0 scale-95 group-hover:scale-100 transition-transform duration-300"></div>
              <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 text-center border border-orange-100">
                <div className="-mt-16 mb-4">
                  <img
                    src={
                      item.photo_url || `https://i.pravatar.cc/100?img=${item.id % 100 + 1}` // Menggunakan photo_url dari DB
                    }
                    alt={item.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-orange-700">
                  {item.name}
                </h3>
                <div className="flex justify-center gap-2 text-sm font-medium text-orange-500 mb-2">
                  <p>{item.role || "Customer"}</p>
                  {item.job && (
                    <span className="text-gray-500">| {item.job}</span>
                  )}
                </div>
                <p className="text-gray-700 text-sm italic mb-4">
                  "{item.feedback}"
                </p>
                <div className="relative flex justify-center items-end h-12 gap-1 mt-2 -mb-6">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className={`rounded-full w-12 h-12 flex items-center justify-center shadow-md bg-white border ${
                        index < parseInt(item.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      } z-${5 - index} relative`}
                      style={{
                        transform: `translateY(${Math.abs(2 - index) * 4}px)`,
                        marginTop: "-16px",
                      }}
                    >
                      <Star
                        size={20}
                        className={
                          index < parseInt(item.rating) ? "fill-yellow-400" : ""
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Tombol Edit dan Hapus */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    title="Edit Feedback"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    title="Hapus Feedback"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-8">
            Belum ada feedback. Silakan berikan feedback pertama Anda!
          </p>
        )}
      </div>

      {/* Modal untuk FormFeedback */}
      {isModalOpen && (
        <FeedbackForm
          onClose={handleCloseModal}
          onSuccess={fetchFeedbacks} // Panggil fetchFeedbacks saat form berhasil disubmit
          editingFeedback={editingFeedback}
        />
      )}
    </div>
  );
}

// Catatan: Komponen Input, Select, Textarea tidak lagi didefinisikan di sini.
// Mereka ada di FeedbackForm.jsx sekarang. 