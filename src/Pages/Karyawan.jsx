import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import KaryawanForm from "./KaryawanForm";

export default function KaryawanPage() {
  const [karyawans, setKaryawans] = useState([]);
  const [editingKaryawan, setEditingKaryawan] = useState(null);

  useEffect(() => {
    fetchKaryawans();
  }, []);

  const fetchKaryawans = async () => {
    const { data, error } = await supabase.from("karyawan").select("*").order("created_at", { ascending: false });
    if (error) console.error("Fetch Error:", error);
    else setKaryawans(data);
  };

  const addKaryawan = async (karyawan) => {
    const { error } = await supabase.from("karyawan").insert(karyawan);
    if (error) console.error("Insert Error:", error);
    else fetchKaryawans();
  };

  const updateKaryawan = async (karyawan) => {
    const { error } = await supabase.from("karyawan").update(karyawan).eq("id", karyawan.id);
    if (error) console.error("Update Error:", error);
    else {
      fetchKaryawans();
      setEditingKaryawan(null);
    }
  };

  const deleteKaryawan = async (id) => {
    const { error } = await supabase.from("karyawan").delete().eq("id", id);
    if (error) console.error("Delete Error:", error);
    else fetchKaryawans();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Daftar Karyawan</h1>
      <KaryawanForm
        addKaryawan={addKaryawan}
        updateKaryawan={updateKaryawan}
        editingKaryawan={editingKaryawan}
      />
      <ul className="mt-4">
        {karyawans.map((k) => (
          <li key={k.id} className="border p-2 mb-2">
            <div><strong>{k.nama}</strong> - {k.email} - {k.role}</div>
            <button onClick={() => setEditingKaryawan(k)} className="text-blue-600 mr-2">Edit</button>
            <button onClick={() => deleteKaryawan(k.id)} className="text-red-600">Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
