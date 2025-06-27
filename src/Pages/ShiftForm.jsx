import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import Swal from "sweetalert2";

const ShiftForm = ({ shift, onClose }) => {
  const [formData, setFormData] = useState({
    employee_name: "",
    contact: "",
    shift_type: "Pagi",
    shift_date: new Date().toISOString().split("T")[0],
    time_in: "",
    time_out: "",
    status: "Hadir",
    notes: "",
  });

  useEffect(() => {
    if (shift) setFormData(shift);
  }, [shift]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (shift) {
      // Update
      const { error } = await supabase
        .from("shifts")
        .update(formData)
        .eq("id", shift.id);

      if (!error) {
        Swal.fire("Berhasil", "Shift berhasil diperbarui.", "success");
        onClose();
      }
    } else {
      // Insert
      const { error } = await supabase.from("shifts").insert([formData]);

      if (!error) {
        Swal.fire("Berhasil", "Shift berhasil ditambahkan.", "success");
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">
          {shift ? "Edit Shift" : "Tambah Shift"}
        </h2>

        <input
          type="text"
          placeholder="Nama Karyawan"
          value={formData.employee_name}
          onChange={(e) =>
            setFormData({ ...formData, employee_name: e.target.value })
          }
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Kontak"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />
        <select
          value={formData.shift_type}
          onChange={(e) => setFormData({ ...formData, shift_type: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="Pagi">Pagi</option>
          <option value="Malam">Malam</option>
          <option value="Fulltime">Fulltime</option>
          <option value="Part Time">Part Time</option>
        </select>
        <input
          type="date"
          value={formData.shift_date}
          onChange={(e) => setFormData({ ...formData, shift_date: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="time"
          value={formData.time_in}
          onChange={(e) => setFormData({ ...formData, time_in: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="time"
          value={formData.time_out}
          onChange={(e) => setFormData({ ...formData, time_out: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="Hadir">Hadir</option>
          <option value="Absen">Absen</option>
          <option value="Izin">Izin</option>
          <option value="Sakit">Sakit</option>
        </select>
        <textarea
          placeholder="Catatan tambahan"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300">
            Batal
          </button>
          <button type="submit" className="px-4 py-2 rounded bg-orange-500 text-white">
            {shift ? "Update" : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShiftForm;
