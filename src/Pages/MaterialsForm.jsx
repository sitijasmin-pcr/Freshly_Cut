import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Swal from "sweetalert2";

const MaterialsForm = ({ closeModal, refreshData, editData }) => {
  const [form, setForm] = useState({
    nama_barang: "",
    harga: "",
    total_item: "",
    satuan_item: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        nama_barang: editData.nama_barang,
        harga: editData.harga?.toString() || "",
        total_item: editData.total_item,
        satuan_item: editData.satuan_item,
      });
    }
  }, [editData]);

  // ================= FORMAT RUPIAH =================
  const formatRupiah = (value) => {
    if (!value) return "";
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "harga") {
      const clean = value.replace(/\D/g, ""); // hanya angka
      setForm({ ...form, harga: clean });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    let error;

    const payload = {
      nama_barang: form.nama_barang,
      harga: Number(form.harga),
      total_item: Number(form.total_item),
      satuan_item: form.satuan_item,
    };

    if (editData) {
      ({ error } = await supabase
        .from("materials")
        .update(payload)
        .eq("id", editData.id));
    } else {
      ({ error } = await supabase
        .from("materials")
        .insert([payload]));
    }

    if (!error) {
      Swal.fire({
        title: "Berhasil!",
        text: editData ? "Data berhasil diupdate." : "Data berhasil ditambahkan.",
        icon: "success",
        confirmButtonColor: "#004d33",
      });

      refreshData();
      closeModal();
    } else {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <>
      <h2 className="text-xl font-black text-[#004d33] mb-4">
        {editData ? "Edit Materials" : "Tambah Materials"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NAMA */}
        <input
          type="text"
          name="nama_barang"
          placeholder="Nama Barang"
          value={form.nama_barang}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
          required
        />

        {/* HARGA (RUPIAH) */}
        <input
          type="text"
          name="harga"
          placeholder="Harga"
          value={formatRupiah(form.harga)}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
          required
        />

        {/* TOTAL ITEM */}
        <input
          type="number"
          name="total_item"
          placeholder="Total Item"
          value={form.total_item}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
          required
        />

        {/* SATUAN */}
        <select
          name="satuan_item"
          value={form.satuan_item}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
          required
        >
          <option value="">Pilih Satuan</option>
          <option value="pcs">pcs</option>
          <option value="box">box</option>
          <option value="pack">pack</option>
          <option value="bks">bks</option>
        </select>

        {/* BUTTON */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={closeModal}>
            Batal
          </button>

          <button className="bg-[#004d33] text-white px-5 py-2 rounded-xl">
            Simpan
          </button>
        </div>

      </form>
    </>
  );
};

export default MaterialsForm;