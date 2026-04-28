import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import FeedbackForm from "./FeedbackForm";
import Swal from "sweetalert2";

function Feedback() {
  const [data, setData] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    setData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus data?",
      text: "Data tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#004d33",
      cancelButtonColor: "#94a3b8",
    });

    if (confirm.isConfirmed) {
      await supabase.from("feedback").delete().eq("id", id);
      fetchData();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data berhasil dihapus",
      });
    }
  };

  const handleEdit = (item) => {
    setEditingFeedback(item);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#FDF8EE] p-4 md:p-8 text-[#004d33]">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <header className="mb-10 border-b border-[#004d33]/20 pb-6">
          <h1 className="text-4xl font-black italic">
            Manajemen <span className="text-orange-500">Feedback</span>
          </h1>
          <p className="text-sm opacity-60 font-bold mt-1">
            Kelola semua feedback pengguna
          </p>
        </header>

        {/* LIST */}
        <section>
          {loading ? (
            <div className="text-center font-black opacity-50 py-10">
              Memuat data...
            </div>
          ) : (
            <div className="grid gap-4">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4"
                >
                  {/* CONTENT */}
                  <div>
                    <h3 className="font-black text-lg">{item.name}</h3>
                    <p className="text-sm opacity-50">{item.email}</p>
                    <p className="mt-2 text-gray-700">{item.feedback}</p>

                    <p className="text-orange-500 mt-2">
                      {"⭐".repeat(item.rating)}
                    </p>
                  </div>

                  {/* ACTION */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-5 py-2 bg-gray-100 rounded-2xl font-black text-xs hover:bg-[#004d33] hover:text-white transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-5 py-2 bg-red-50 text-red-600 rounded-2xl font-black text-xs hover:bg-red-500 hover:text-white transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MODAL FORM */}
        {showForm && (
          <FeedbackForm
            editingFeedback={editingFeedback}
            onClose={() => {
              setShowForm(false);
              setEditingFeedback(null);
            }}
            onSuccess={() => {
              fetchData();
              setShowForm(false);
              setEditingFeedback(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Feedback;