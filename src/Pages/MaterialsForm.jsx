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
        harga: editData.harga,
        total_item: editData.total_item,
        satuan_item: editData.satuan_item,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "harga") {
      const clean = value.replace(/[^0-9]/g, "");
      setForm({ ...form, harga: clean });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let error;

    if (editData) {
      ({ error } = await supabase
        .from("materials")
        .update({
          nama_barang: form.nama_barang,
          harga: Number(form.harga),
          total_item: Number(form.total_item),
          satuan_item: form.satuan_item,
        })
        .eq("id", editData.id));
    } else {
      ({ error } = await supabase.from("materials").insert([
        {
          nama_barang: form.nama_barang,
          harga: Number(form.harga),
          total_item: Number(form.total_item),
          satuan_item: form.satuan_item,
        },
      ]));
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

        <input
          type="text"
          name="nama_barang"
          placeholder="Nama Barang"
          value={form.nama_barang}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
          required
        />

        <input
          type="text"
          name="harga"
          placeholder="Harga"
          value={form.harga}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
          required
        />

        <input
          type="number"
          name="total_item"
          placeholder="Total Item"
          value={form.total_item}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border"
          required
        />

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