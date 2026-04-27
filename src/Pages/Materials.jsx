import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import MaterialsForm from "./MaterialsForm";
import Swal from "sweetalert2";

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  // FETCH DATA
  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error) setMaterials(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // DELETE (SweetAlert)
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Materials?",
      text: "Data ini tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#004d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase
        .from("materials")
        .delete()
        .eq("id", id);

      if (error) throw error;

      Swal.fire({
        title: "Terhapus!",
        text: "Data berhasil dihapus.",
        icon: "success",
        confirmButtonColor: "#004d33",
      });

      fetchMaterials();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="p-8 bg-[#FDF8EE] min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black italic text-[#004d33]">
            
          </h1>

          <button
            onClick={() => {
              setEditData(null);
              setShowForm(true);
            }}
            className="bg-[#004d33] text-white px-6 py-3 rounded-2xl hover:bg-green-800 shadow-md"
          >
            + Tambah Materials
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-sm rounded-[2rem] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#004d33]/10 text-[#004d33]">
              <tr>
                <th className="p-4 text-left">No</th>
                <th className="p-4 text-left">Nama Barang</th>
                <th className="p-4 text-left">Harga</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Satuan</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {materials.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-green-50/30">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-bold text-[#004d33]">
                    {item.nama_barang}
                  </td>
                  <td className="p-4">{formatRupiah(item.harga)}</td>
                  <td className="p-4">{item.total_item}</td>
                  <td className="p-4">{item.satuan_item}</td>

                  {/* ACTION */}
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setEditData(item);
                          setShowForm(true);
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-xl text-xs font-bold hover:bg-red-200"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {materials.length === 0 && !loading && (
            <p className="p-6 text-center text-gray-400 font-semibold">
              Belum ada data materials
            </p>
          )}
        </div>

        {/* MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm z-50">
            <div className="bg-[#FDF8EE] p-6 rounded-[2rem] w-full max-w-lg shadow-2xl relative">

              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                ✕
              </button>

              <MaterialsForm
                closeModal={() => setShowForm(false)}
                refreshData={fetchMaterials}
                editData={editData}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;