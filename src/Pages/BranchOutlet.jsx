import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import OutletForm from "./OutletForm";
import Swal from "sweetalert2";
import { Store, Plus } from "lucide-react";

export default function Outlet() {
  const [outlets, setOutlets] = useState([]);
  const [editingOutlet, setEditingOutlet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchOutlets = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("outlet")
      .select("*")
      .order("created_at", { ascending: false });

    setOutlets(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  const handleDelete = async (id, name) => {
    const confirm = await Swal.fire({
      title: "Hapus Outlet?",
      text: `${name} akan dihapus permanen`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#004d33",
      cancelButtonColor: "#94a3b8",
    });

    if (confirm.isConfirmed) {
      await supabase.from("outlet").delete().eq("id", id);
      fetchOutlets();
      Swal.fire("Berhasil", "Outlet dihapus", "success");
    }
  };

  const handleEdit = (item) => {
    setEditingOutlet(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingOutlet(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#FDF8EE] p-4 md:p-8 text-[#004d33]">
      <div className="max-w-5xl mx-auto">

        {/* HEADER (STYLE USER.JSX) */}
        <header className="mb-10 border-b border-[#004d33]/20 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black italic flex items-center gap-2">
              <Store /> Manajemen <span className="text-orange-500">Outlet</span>
            </h1>
            <p className="text-sm opacity-60 font-bold mt-1">
              Kelola lokasi branch Freshly Cut
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="px-5 py-2 bg-[#004d33] text-white rounded-2xl font-black flex items-center gap-2"
          >
            <Plus size={18} /> Tambah
          </button>
        </header>

        {/* LIST */}
        <section>
          {loading ? (
            <div className="text-center font-black opacity-50 py-10">
              Memuat data...
            </div>
          ) : (
            <div className="grid gap-4">
              {outlets.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >

                  {/* LEFT CONTENT */}
                  <div className="flex items-center gap-4">

                    {/* IMAGE (TETAP ADA) */}
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-2xl border border-gray-200"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/100x100?text=No+Image")
                      }
                    />

                    {/* TEXT */}
                    <div>
                      <h3 className="font-black text-lg">{item.name}</h3>
                      <p className="text-sm opacity-50">{item.maps_url}</p>
                    </div>

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
                      onClick={() => handleDelete(item.id, item.name)}
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

        {/* FORM MODAL */}
        {showForm && (
          <OutletForm
            editingOutlet={editingOutlet}
            onClose={(msg) => {
              setShowForm(false);
              setEditingOutlet(null);
              if (msg) Swal.fire("Berhasil", msg, "success");
              fetchOutlets();
            }}
          />
        )}

      </div>
    </div>
  );
}