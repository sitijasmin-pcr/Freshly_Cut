import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../supabase";
import Swal from "sweetalert2";

// ============================================================
// CATATAN DATABASE (jalankan SQL_SETUP.sql terlebih dahulu):
//
// Tabel `stok_produk`:
//   id (uuid, primary key)
//   produk_id (uuid, foreign key → produk.id)
//   stok_saat_ini (int4, default 0)
//   stok_minimum (int4, default 5)
//   updated_at (timestamptz)
//
// Tabel `stok_history`:
//   id (uuid, primary key)
//   produk_id (uuid)
//   jenis (text: 'tambah'|'kurang'|'transaksi'|'koreksi')
//   jumlah (int4)
//   stok_sebelum (int4)
//   stok_sesudah (int4)
//   keterangan (text)
//   referensi_id (text)
//   created_at (timestamptz)
// ============================================================

const EMPTY_BAHAN = { nama_bahan: "", berat: "", satuan: "kg", harga_per_satuan: "" };
const EMPTY_PRODUK = { nama_produk: "", jumlah_hasil: "", harga_jual: "", terjual: "" };

// ============================================================
// MODAL FORM LAPORAN PRODUKSI
// ============================================================
function FormModal({ isOpen, onClose, onSaved, editData }) {
  const isEdit = !!editData;

  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [bahanBaku, setBahanBaku] = useState([{ ...EMPTY_BAHAN }]);
  const [hasilJadi, setHasilJadi] = useState([{ ...EMPTY_PRODUK }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEdit && editData) {
        setTanggal(editData.tanggal || new Date().toISOString().split("T")[0]);
        setBahanBaku(editData.bahan?.length ? editData.bahan.map((b) => ({ ...b })) : [{ ...EMPTY_BAHAN }]);
        setHasilJadi(editData.hasil?.length ? editData.hasil.map((h) => ({ ...h })) : [{ ...EMPTY_PRODUK }]);
      } else {
        setTanggal(new Date().toISOString().split("T")[0]);
        setBahanBaku([{ ...EMPTY_BAHAN }]);
        setHasilJadi([{ ...EMPTY_PRODUK }]);
      }
    }
  }, [isOpen, isEdit, editData]);

  const handleBahanChange = (i, field, value) => {
    const next = [...bahanBaku];
    next[i][field] = value;
    setBahanBaku(next);
  };

  const handleProdukChange = (i, field, value) => {
    const next = [...hasilJadi];
    next[i][field] = value;
    setHasilJadi(next);
  };

  const removeBahan = (i) => setBahanBaku(bahanBaku.filter((_, idx) => idx !== i));
  const removeProduk = (i) => setHasilJadi(hasilJadi.filter((_, idx) => idx !== i));

  const totalModalBahan = bahanBaku.reduce(
    (acc, item) => acc + (parseFloat(item.berat) || 0) * (parseFloat(item.harga_per_satuan) || 0), 0
  );
  const totalPcsDihasilkan = hasilJadi.reduce((acc, item) => acc + (parseInt(item.jumlah_hasil) || 0), 0);
  const hppPerUnit = totalPcsDihasilkan > 0 ? totalModalBahan / totalPcsDihasilkan : 0;
  const totalPcsTerjual = hasilJadi.reduce((acc, item) => acc + (parseInt(item.terjual) || 0), 0);
  const totalOmzet = hasilJadi.reduce(
    (acc, item) => acc + (parseInt(item.terjual) || 0) * (parseFloat(item.harga_jual) || 0), 0
  );
  const totalHppTerjual = totalPcsTerjual * hppPerUnit;
  const labaBersih = totalOmzet - totalHppTerjual;
  const hargaJualRataRata = totalPcsTerjual > 0 ? totalOmzet / totalPcsTerjual : 0;

  const handleSubmit = async () => {
    if (!tanggal) { Swal.fire("Peringatan", "Tanggal harus diisi!", "warning"); return; }
    if (bahanBaku.some((b) => !b.nama_bahan || !b.berat || !b.harga_per_satuan)) {
      Swal.fire("Peringatan", "Lengkapi semua data bahan baku!", "warning"); return;
    }
    if (hasilJadi.some((h) => !h.nama_produk || !h.jumlah_hasil || !h.harga_jual)) {
      Swal.fire("Peringatan", "Lengkapi semua data hasil jadi!", "warning"); return;
    }

    setSaving(true);
    try {
      const laporanPayload = {
        tanggal, total_modal: totalModalBahan, total_hasil_pcs: totalPcsDihasilkan,
        pcs_terjual: totalPcsTerjual, harga_jual_per_pcs: hargaJualRataRata,
        total_pendapatan: totalOmzet, hpp_per_pcs: hppPerUnit, laba_bersih: labaBersih,
      };

      let laporanId;
      if (isEdit) {
        const { error } = await supabase.from("laporan_harian").update(laporanPayload).eq("id_laporan", editData.id_laporan);
        if (error) throw error;
        laporanId = editData.id_laporan;
        await supabase.from("produksi").delete().eq("laporan_id", laporanId);
        await supabase.from("produksi_hasil").delete().eq("laporan_id", laporanId);
      } else {
        const { data, error } = await supabase.from("laporan_harian").insert(laporanPayload).select("id_laporan").single();
        if (error) throw error;
        laporanId = data.id_laporan;
      }

      const bahanPayload = bahanBaku.map((b) => ({
        laporan_id: laporanId, nama_bahan: b.nama_bahan, berat: parseFloat(b.berat) || 0,
        satuan: b.satuan || "kg", harga_per_satuan: parseFloat(b.harga_per_satuan) || 0, hasil_pcs: 0,
      }));
      const { error: bahanError } = await supabase.from("produksi").insert(bahanPayload);
      if (bahanError) throw bahanError;

      const hasilPayload = hasilJadi.map((h) => ({
        laporan_id: laporanId, nama_produk: h.nama_produk, jumlah_hasil: parseInt(h.jumlah_hasil) || 0,
        harga_jual: parseFloat(h.harga_jual) || 0, terjual: parseInt(h.terjual) || 0,
      }));
      const { error: hasilError } = await supabase.from("produksi_hasil").insert(hasilPayload);
      if (hasilError) throw hasilError;

      Swal.fire({
        title: "Berhasil!", text: isEdit ? "Laporan berhasil diperbarui." : "Laporan produksi berhasil disimpan!",
        icon: "success", confirmButtonColor: "#004d33",
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", `Gagal menyimpan: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl bg-[#FDF8EE] rounded-[2rem] shadow-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-[#004d33]/10">
          <div>
            <h2 className="text-2xl font-black italic text-[#004d33]">
              {isEdit ? "✏️ Edit Laporan" : "➕ Tambah Laporan Produksi"}
            </h2>
            <p className="text-sm opacity-50 font-semibold">Freshly Cut Production</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-600 transition-all font-bold text-lg">✕</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <label className="font-black text-[#004d33] text-sm">📅 Tanggal Produksi</label>
            <input type="date" className="p-3 rounded-2xl border-2 border-[#004d33]/20 font-bold outline-none bg-white shadow-sm"
              value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-base font-black mb-4 flex items-center gap-2 text-[#004d33]">
                <span className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-xs">1</span>
                Bahan Baku (Belanja)
              </h3>
              <div className="space-y-2">
                {bahanBaku.map((item, i) => (
                  <div key={i} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl">
                    <input className="flex-1 bg-transparent outline-none font-medium text-sm" placeholder="Nama Bahan"
                      value={item.nama_bahan} onChange={(e) => handleBahanChange(i, "nama_bahan", e.target.value)} />
                    <input type="number" className="w-14 bg-white p-1.5 rounded-lg text-center font-bold text-sm" placeholder="Qty"
                      value={item.berat} onChange={(e) => handleBahanChange(i, "berat", e.target.value)} />
                    <select className="w-16 bg-white p-1.5 rounded-lg text-xs font-bold outline-none"
                      value={item.satuan} onChange={(e) => handleBahanChange(i, "satuan", e.target.value)}>
                      <option value="kg">kg</option>
                      <option value="gram">gram</option>
                      <option value="ml">ml</option>
                      <option value="pcs">pcs</option>
                      <option value="lembar">lembar</option>
                    </select>
                    <input type="number" className="w-24 bg-white p-1.5 rounded-lg text-right font-mono text-sm" placeholder="Harga"
                      value={item.harga_per_satuan} onChange={(e) => handleBahanChange(i, "harga_per_satuan", e.target.value)} />
                    {bahanBaku.length > 1 && (
                      <button onClick={() => removeBahan(i)} className="w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center text-xs font-bold">✕</button>
                    )}
                  </div>
                ))}
                <button onClick={() => setBahanBaku([...bahanBaku, { ...EMPTY_BAHAN }])}
                  className="w-full py-2 border-2 border-dashed border-green-200 rounded-xl text-green-600 font-bold text-sm hover:bg-green-50">
                  + Tambah Bahan
                </button>
              </div>
              <div className="mt-4 p-3 bg-[#004d33] text-white rounded-xl flex justify-between items-center">
                <span className="text-xs font-bold opacity-70">Total Modal Bahan</span>
                <span className="text-lg font-black">Rp {totalModalBahan.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-base font-black mb-4 flex items-center gap-2 text-orange-600">
                <span className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-xs">2</span>
                Hasil Jadi & Penjualan
              </h3>
              <div className="space-y-2">
                {hasilJadi.map((item, i) => (
                  <div key={i} className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                    <div className="flex gap-2 mb-2">
                      <input className="flex-1 bg-white p-1.5 rounded-lg outline-none font-bold text-[#004d33] text-sm" placeholder="Nama Produk"
                        value={item.nama_produk} onChange={(e) => handleProdukChange(i, "nama_produk", e.target.value)} />
                      <input type="number" className="w-16 bg-white p-1.5 rounded-lg text-center font-black text-orange-600 text-sm" placeholder="Jadi"
                        value={item.jumlah_hasil} onChange={(e) => handleProdukChange(i, "jumlah_hasil", e.target.value)} />
                      {hasilJadi.length > 1 && (
                        <button onClick={() => removeProduk(i)} className="w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center text-xs font-bold">✕</button>
                      )}
                    </div>
                    <div className="flex gap-2 text-xs">
                      <div className="flex-1">
                        <label className="block opacity-50 font-bold mb-1">Harga Jual / Pcs</label>
                        <input type="number" className="w-full p-1.5 rounded-lg bg-white outline-none font-mono font-bold text-sm" placeholder="Rp"
                          value={item.harga_jual} onChange={(e) => handleProdukChange(i, "harga_jual", e.target.value)} />
                      </div>
                      <div className="w-20">
                        <label className="block opacity-50 font-bold mb-1">Terjual</label>
                        <input type="number" className="w-full p-1.5 rounded-lg bg-white outline-none font-bold text-center text-sm" placeholder="0"
                          value={item.terjual} onChange={(e) => handleProdukChange(i, "terjual", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setHasilJadi([...hasilJadi, { ...EMPTY_PRODUK }])}
                  className="w-full py-2 border-2 border-dashed border-orange-200 rounded-xl text-orange-600 font-bold text-sm hover:bg-orange-50">
                  + Tambah Produk
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[2rem] border-2 border-[#A7D397]/30 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs font-black uppercase opacity-40 tracking-wider">HPP/pcs</p>
                <p className="text-lg font-black text-green-700">Rp {hppPerUnit.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase opacity-40 tracking-wider">Total Omzet</p>
                <p className="text-lg font-black text-blue-700">Rp {totalOmzet.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase opacity-40 tracking-wider">Laba Bersih</p>
                <p className={`text-lg font-black ${labaBersih >= 0 ? "text-[#004d33]" : "text-red-600"}`}>Rp {labaBersih.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase opacity-40 tracking-wider">Total Terjual</p>
                <p className="text-lg font-black text-orange-600">{totalPcsTerjual} pcs</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-8 py-3 rounded-2xl border-2 border-gray-200 font-black text-gray-500 hover:bg-gray-50 transition-all">Batal</button>
            <button onClick={handleSubmit} disabled={saving}
              className="px-10 py-3 rounded-2xl bg-[#004d33] text-white font-black hover:bg-green-800 active:scale-95 transition-all shadow-lg disabled:opacity-60">
              {saving ? "Menyimpan..." : isEdit ? "✓ Update Laporan" : "✓ Simpan Laporan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL TAMBAH/KURANGI STOK
// ============================================================
function StokModal({ isOpen, onClose, onSaved, produkList, stokData }) {
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [jumlah, setJumlah] = useState("");
  const [jenis, setJenis] = useState("tambah");
  const [keterangan, setKeterangan] = useState("");
  const [stokMinimum, setStokMinimum] = useState("");
  const [saving, setSaving] = useState(false);
  const [tabActive, setTabActive] = useState("tambah"); // "tambah" | "minimum"

  useEffect(() => {
    if (isOpen) {
      setSelectedProduk(null);
      setJumlah("");
      setJenis("tambah");
      setKeterangan("");
      setStokMinimum("");
      setTabActive("tambah");
    }
  }, [isOpen]);

  const stokSaatIni = selectedProduk ? (stokData[selectedProduk]?.stok_saat_ini ?? 0) : 0;
  const stokMin = selectedProduk ? (stokData[selectedProduk]?.stok_minimum ?? 5) : 5;

  const handleSubmit = async () => {
    if (!selectedProduk) { Swal.fire("Peringatan", "Pilih produk terlebih dahulu!", "warning"); return; }

    if (tabActive === "tambah") {
      if (!jumlah || parseInt(jumlah) <= 0) { Swal.fire("Peringatan", "Masukkan jumlah yang valid!", "warning"); return; }
      if (jenis === "kurang" && parseInt(jumlah) > stokSaatIni) {
        Swal.fire("Peringatan", `Stok tidak mencukupi! Stok saat ini: ${stokSaatIni} pcs`, "warning"); return;
      }
    }

    setSaving(true);
    try {
      if (tabActive === "tambah") {
        const jumlahInt = parseInt(jumlah);
        const stokBaru = jenis === "tambah" ? stokSaatIni + jumlahInt : stokSaatIni - jumlahInt;

        const { error } = await supabase.from("stok_produk")
          .upsert({ produk_id: selectedProduk, stok_saat_ini: stokBaru, updated_at: new Date().toISOString() }, { onConflict: "produk_id" });
        if (error) throw error;

        await supabase.from("stok_history").insert({
          produk_id: selectedProduk, jenis, jumlah: jumlahInt,
          stok_sebelum: stokSaatIni, stok_sesudah: stokBaru,
          keterangan: keterangan || null,
        });

        Swal.fire({ title: "Berhasil!", text: `Stok berhasil di${jenis === "tambah" ? "tambah" : "kurangi"}.`, icon: "success", confirmButtonColor: "#004d33", timer: 1500, showConfirmButton: false });
      } else {
        const minInt = parseInt(stokMinimum);
        if (!stokMinimum || minInt < 0) { Swal.fire("Peringatan", "Masukkan stok minimum yang valid!", "warning"); setSaving(false); return; }
        const { error } = await supabase.from("stok_produk")
          .upsert({ produk_id: selectedProduk, stok_minimum: minInt, updated_at: new Date().toISOString() }, { onConflict: "produk_id" });
        if (error) throw error;
        Swal.fire({ title: "Berhasil!", text: "Stok minimum berhasil diperbarui.", icon: "success", confirmButtonColor: "#004d33", timer: 1500, showConfirmButton: false });
      }

      onSaved();
      if (tabActive === "tambah") {
        setJumlah(""); setKeterangan(""); setJenis("tambah");
      } else {
        setStokMinimum("");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const namaSelected = produkList.find(p => p.id === selectedProduk)?.nama || "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#FDF8EE] rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#004d33]/10">
          <div>
            <h2 className="text-xl font-black italic text-[#004d33]">📦 Manajemen Stok</h2>
            <p className="text-xs opacity-50 font-semibold">Atur stok produk</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-600 transition-all font-bold">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Pilih Produk */}
          <div>
            <label className="block text-xs font-black text-[#004d33] opacity-60 uppercase tracking-wider mb-2">Pilih Produk</label>
            <select
              className="w-full p-3 rounded-2xl border-2 border-[#004d33]/20 font-bold outline-none bg-white text-[#004d33] text-sm"
              value={selectedProduk || ""}
              onChange={(e) => setSelectedProduk(e.target.value || null)}
            >
              <option value="">-- Pilih produk --</option>
              {produkList.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
          </div>

          {/* Info Stok Saat Ini */}
          {selectedProduk && (
            <div className="flex gap-3">
              <div className="flex-1 bg-white rounded-2xl p-4 border-2 border-[#004d33]/10 text-center">
                <p className="text-xs font-black opacity-50 uppercase tracking-wider">Stok Saat Ini</p>
                <p className={`text-3xl font-black mt-1 ${stokSaatIni <= stokMin ? "text-red-600" : "text-[#004d33]"}`}>{stokSaatIni}</p>
                <p className="text-xs opacity-50 font-bold">pcs</p>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-4 border-2 border-orange-100 text-center">
                <p className="text-xs font-black opacity-50 uppercase tracking-wider">Stok Minimum</p>
                <p className="text-3xl font-black mt-1 text-orange-500">{stokMin}</p>
                <p className="text-xs opacity-50 font-bold">pcs</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
            <button onClick={() => setTabActive("tambah")}
              className={`flex-1 py-2 rounded-xl font-black text-sm transition-all ${tabActive === "tambah" ? "bg-white text-[#004d33] shadow-sm" : "text-gray-400"}`}>
              ➕ Tambah/Kurangi
            </button>
            <button onClick={() => setTabActive("minimum")}
              className={`flex-1 py-2 rounded-xl font-black text-sm transition-all ${tabActive === "minimum" ? "bg-white text-orange-600 shadow-sm" : "text-gray-400"}`}>
              ⚠️ Set Minimum
            </button>
          </div>

          {tabActive === "tambah" ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <button onClick={() => setJenis("tambah")}
                  className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all ${jenis === "tambah" ? "bg-green-500 text-white shadow-md" : "bg-white text-gray-400 border-2 border-gray-100"}`}>
                  ➕ Tambah
                </button>
                <button onClick={() => setJenis("kurang")}
                  className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all ${jenis === "kurang" ? "bg-red-500 text-white shadow-md" : "bg-white text-gray-400 border-2 border-gray-100"}`}>
                  ➖ Kurangi
                </button>
              </div>
              <div>
                <label className="block text-xs font-black text-[#004d33] opacity-60 uppercase tracking-wider mb-2">Jumlah (pcs)</label>
                <input type="number" min="1"
                  className="w-full p-3 rounded-2xl border-2 border-[#004d33]/20 font-black text-2xl text-center outline-none bg-white"
                  placeholder="0" value={jumlah} onChange={(e) => setJumlah(e.target.value)} />
              </div>
              {selectedProduk && jumlah && (
                <div className={`p-3 rounded-2xl text-center font-black text-sm ${jenis === "tambah" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  Stok {namaSelected}: {stokSaatIni} → {jenis === "tambah" ? stokSaatIni + (parseInt(jumlah) || 0) : stokSaatIni - (parseInt(jumlah) || 0)} pcs
                </div>
              )}
              <div>
                <label className="block text-xs font-black text-[#004d33] opacity-60 uppercase tracking-wider mb-2">Keterangan (opsional)</label>
                <input type="text"
                  className="w-full p-3 rounded-2xl border-2 border-[#004d33]/20 font-medium outline-none bg-white text-sm"
                  placeholder="cth: stok pagi, koreksi stok..." value={keterangan} onChange={(e) => setKeterangan(e.target.value)} />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-black text-[#004d33] opacity-60 uppercase tracking-wider mb-2">Stok Minimum (pcs)</label>
              <input type="number" min="0"
                className="w-full p-3 rounded-2xl border-2 border-orange-200 font-black text-2xl text-center outline-none bg-white"
                placeholder={stokMin.toString()} value={stokMinimum} onChange={(e) => setStokMinimum(e.target.value)} />
              <p className="text-xs opacity-50 font-semibold mt-2 text-center">Produk akan ditandai ⚠️ jika stok ≤ nilai ini</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-black text-gray-500 hover:bg-gray-50 transition-all text-sm">Batal</button>
            <button onClick={handleSubmit} disabled={saving || !selectedProduk}
              className="flex-[2] py-3 rounded-2xl bg-[#004d33] text-white font-black hover:bg-green-800 active:scale-95 transition-all shadow-lg disabled:opacity-60 text-sm">
              {saving ? "Menyimpan..." : "✓ Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// KOMPONEN UTAMA ManajemenProduksi
// ============================================================
function ManajemenProduksi() {
  const [laporan, setLaporan] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [stokData, setStokData] = useState({}); // { produk_id: { stok_saat_ini, stok_minimum } }
  const [loading, setLoading] = useState(true);
  const [loadingStok, setLoadingStok] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [stokModalOpen, setStokModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [detailData, setDetailData] = useState({});
  const [activeTab, setActiveTab] = useState("laporan"); // "laporan" | "stok"
  const realtimeRef = useRef(null);

  const fetchLaporan = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("laporan_harian").select("*").order("tanggal", { ascending: false });
      if (error) throw error;
      setLaporan(data || []);
    } catch (err) {
      Swal.fire("Error", `Gagal memuat data: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProdukDanStok = useCallback(async () => {
    setLoadingStok(true);
    try {
      const [produkRes, stokRes] = await Promise.all([
        supabase.from("produk").select("*").order("nama"),
        supabase.from("stok_produk").select("*"),
      ]);
      if (produkRes.error) throw produkRes.error;
      setProdukList(produkRes.data || []);

      const stokMap = {};
      (stokRes.data || []).forEach(s => { stokMap[s.produk_id] = s; });

      // Inisialisasi stok 0 untuk produk yang belum punya entry
      const produkTanpaStok = (produkRes.data || []).filter(p => !stokMap[p.id]);
      if (produkTanpaStok.length > 0) {
        const inserts = produkTanpaStok.map(p => ({ produk_id: p.id, stok_saat_ini: 0, stok_minimum: 5 }));
        const { data: newStok } = await supabase.from("stok_produk").insert(inserts).select("*");
        (newStok || []).forEach(s => { stokMap[s.produk_id] = s; });
      }
      setStokData(stokMap);
    } catch (err) {
      console.error("Error fetch produk & stok:", err);
    } finally {
      setLoadingStok(false);
    }
  }, []);

  useEffect(() => {
    fetchLaporan();
    fetchProdukDanStok();

    // Realtime subscription untuk stok_produk
    const channel = supabase.channel("stok-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "stok_produk" }, (payload) => {
        setStokData(prev => {
          const updated = { ...prev };
          if (payload.eventType === "DELETE") {
            delete updated[payload.old.produk_id];
          } else {
            updated[payload.new.produk_id] = payload.new;
          }
          return updated;
        });
      })
      .subscribe();
    realtimeRef.current = channel;

    return () => { supabase.removeChannel(channel); };
  }, [fetchLaporan, fetchProdukDanStok]);

  const fetchDetail = async (id) => {
    if (detailData[id]) return;
    try {
      const [bahanRes, hasilRes] = await Promise.all([
        supabase.from("produksi").select("*").eq("laporan_id", id),
        supabase.from("produksi_hasil").select("*").eq("laporan_id", id),
      ]);
      setDetailData(prev => ({ ...prev, [id]: { bahan: bahanRes.data || [], hasil: hasilRes.data || [] } }));
    } catch (err) { console.error(err); }
  };

  const handleExpand = async (id) => {
    if (expandedRow === id) { setExpandedRow(null); } else { setExpandedRow(id); await fetchDetail(id); }
  };

  const handleEdit = async (item) => {
    try {
      const [bahanRes, hasilRes] = await Promise.all([
        supabase.from("produksi").select("*").eq("laporan_id", item.id_laporan),
        supabase.from("produksi_hasil").select("*").eq("laporan_id", item.id_laporan),
      ]);
      setEditData({
        ...item,
        bahan: bahanRes.data?.map(b => ({ nama_bahan: b.nama_bahan, berat: b.berat, satuan: b.satuan || "kg", harga_per_satuan: b.harga_per_satuan })) || [{ ...EMPTY_BAHAN }],
        hasil: hasilRes.data?.map(h => ({ nama_produk: h.nama_produk, jumlah_hasil: h.jumlah_hasil, harga_jual: h.harga_jual, terjual: h.terjual })) || [{ ...EMPTY_PRODUK }],
      });
      setModalOpen(true);
    } catch (err) {
      Swal.fire("Error", "Gagal memuat data untuk diedit.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Laporan?", text: "Data ini tidak dapat dipulihkan!", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#dc2626", cancelButtonColor: "#004d33",
      confirmButtonText: "Ya, Hapus!", cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    try {
      await supabase.from("produksi").delete().eq("laporan_id", id);
      await supabase.from("produksi_hasil").delete().eq("laporan_id", id);
      const { error } = await supabase.from("laporan_harian").delete().eq("id_laporan", id);
      if (error) throw error;
      Swal.fire({ title: "Terhapus!", icon: "success", confirmButtonColor: "#004d33" });
      setDetailData(prev => { const next = { ...prev }; delete next[id]; return next; });
      fetchLaporan();
    } catch (err) {
      Swal.fire("Error", `Gagal menghapus: ${err.message}`, "error");
    }
  };

  const formatRp = (val) => `Rp ${(parseFloat(val) || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
  const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  };

  const filtered = laporan.filter(l => formatTanggal(l.tanggal).toLowerCase().includes(search.toLowerCase()));
  const summaryTotal = filtered.reduce(
    (acc, l) => ({
      modal: acc.modal + (parseFloat(l.total_modal) || 0),
      pendapatan: acc.pendapatan + (parseFloat(l.total_pendapatan) || 0),
      laba: acc.laba + (parseFloat(l.laba_bersih) || 0),
      terjual: acc.terjual + (parseInt(l.pcs_terjual) || 0),
    }),
    { modal: 0, pendapatan: 0, laba: 0, terjual: 0 }
  );

  // Statistik stok
  const stokStats = {
    total: produkList.length,
    habis: produkList.filter(p => (stokData[p.id]?.stok_saat_ini ?? 0) === 0).length,
    menipis: produkList.filter(p => {
      const s = stokData[p.id];
      return s && s.stok_saat_ini > 0 && s.stok_saat_ini <= s.stok_minimum;
    }).length,
    aman: produkList.filter(p => {
      const s = stokData[p.id];
      return s && s.stok_saat_ini > s.stok_minimum;
    }).length,
  };

  return (
    <div className="min-h-screen bg-[#FDF8EE] p-4 md:p-8 text-[#004d33] font-sans">
      <FormModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditData(null); }}
        onSaved={() => { setEditData(null); setDetailData({}); fetchLaporan(); }} editData={editData} />
      <StokModal isOpen={stokModalOpen} onClose={() => setStokModalOpen(false)}
        onSaved={fetchProdukDanStok} produkList={produkList} stokData={stokData} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#004d33]/20 pb-6">
          <div>
            <h1 className="text-3xl font-black italic">Freshly Cut <span className="text-orange-500">Production</span></h1>
            <p className="text-sm opacity-60 font-bold mt-1">Manajemen & Laporan Produksi Harian</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 text-center">
              <p className="text-xs font-bold opacity-50">Total Laporan</p>
              <p className="text-xl font-black text-[#004d33]">{laporan.length}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 text-center">
              <p className="text-xs font-bold opacity-50">Laba Bersih</p>
              <p className={`text-lg font-black ${summaryTotal.laba >= 0 ? "text-green-600" : "text-red-600"}`}>{formatRp(summaryTotal.laba)}</p>
            </div>
            {stokStats.habis > 0 && (
              <div className="bg-red-50 px-4 py-2 rounded-2xl shadow-sm border border-red-100 text-center">
                <p className="text-xs font-bold text-red-400">Stok Habis</p>
                <p className="text-xl font-black text-red-600">{stokStats.habis}</p>
              </div>
            )}
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Modal", value: formatRp(summaryTotal.modal), icon: "🛒", color: "bg-blue-50 border-blue-100" },
            { label: "Total Pendapatan", value: formatRp(summaryTotal.pendapatan), icon: "💰", color: "bg-green-50 border-green-100" },
            { label: "Total Laba Bersih", value: formatRp(summaryTotal.laba), icon: "📈", color: summaryTotal.laba >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100" },
            { label: "Total Terjual", value: `${summaryTotal.terjual.toLocaleString("id-ID")} pcs`, icon: "📦", color: "bg-orange-50 border-orange-100" },
          ].map(card => (
            <div key={card.label} className={`${card.color} border rounded-[1.5rem] p-4 text-center shadow-sm`}>
              <span className="text-2xl">{card.icon}</span>
              <p className="text-xs font-bold opacity-50 mt-1">{card.label}</p>
              <p className="text-base font-black text-[#004d33] mt-0.5 leading-tight">{card.value}</p>
            </div>
          ))}
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-3 mb-6">
          <button onClick={() => setActiveTab("laporan")}
            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === "laporan" ? "bg-[#004d33] text-white shadow-lg" : "bg-white text-gray-400 border border-gray-100 hover:text-[#004d33]"}`}>
            📋 Laporan Produksi
          </button>
          <button onClick={() => setActiveTab("stok")}
            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === "stok" ? "bg-[#004d33] text-white shadow-lg" : "bg-white text-gray-400 border border-gray-100 hover:text-[#004d33]"}`}>
            📦 Stok Produk
            {stokStats.habis > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-black">{stokStats.habis}</span>}
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB LAPORAN */}
        {/* ============================================================ */}
        {activeTab === "laporan" && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">📋</div>
                <div>
                  <h2 className="font-black text-[#004d33] text-lg">Daftar Laporan Produksi</h2>
                  <p className="text-xs opacity-50 font-semibold">{filtered.length} laporan ditemukan</p>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <input type="text" placeholder="🔍 Cari tanggal..."
                  className="flex-1 sm:w-56 p-3 rounded-2xl border-2 border-gray-100 font-medium outline-none focus:border-green-300 bg-gray-50 text-sm"
                  value={search} onChange={(e) => setSearch(e.target.value)} />
                <button onClick={() => { setEditData(null); setModalOpen(true); }}
                  className="bg-[#004d33] text-white font-black px-6 py-3 rounded-2xl hover:bg-green-800 active:scale-95 transition-all shadow-md whitespace-nowrap text-sm">
                  ➕ Tambah Laporan
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-[#004d33] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold opacity-50">Memuat data laporan...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <span className="text-5xl mb-4">📭</span>
                <p className="font-black text-lg">Belum ada laporan</p>
                <p className="text-sm font-semibold">Klik "Tambah Laporan" untuk memulai</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#004d33]/5 text-[#004d33]">
                      <th className="text-left px-6 py-4 font-black text-xs uppercase tracking-wider">Tanggal</th>
                      <th className="text-right px-4 py-4 font-black text-xs uppercase tracking-wider">Modal</th>
                      <th className="text-right px-4 py-4 font-black text-xs uppercase tracking-wider">Terjual</th>
                      <th className="text-right px-4 py-4 font-black text-xs uppercase tracking-wider">HPP/pcs</th>
                      <th className="text-right px-4 py-4 font-black text-xs uppercase tracking-wider">Pendapatan</th>
                      <th className="text-right px-4 py-4 font-black text-xs uppercase tracking-wider">Laba Bersih</th>
                      <th className="text-center px-4 py-4 font-black text-xs uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(item => (
                      <>
                        <tr key={item.id_laporan} className="hover:bg-green-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleExpand(item.id_laporan)}
                                className="w-6 h-6 rounded-lg bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-700 font-bold text-xs transition-all">
                                {expandedRow === item.id_laporan ? "▲" : "▼"}
                              </button>
                              <span className="font-bold text-[#004d33]">{formatTanggal(item.tanggal)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right font-mono font-bold text-gray-600">{formatRp(item.total_modal)}</td>
                          <td className="px-4 py-4 text-right">
                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-lg font-black text-xs">{(parseInt(item.pcs_terjual) || 0).toLocaleString("id-ID")} pcs</span>
                          </td>
                          <td className="px-4 py-4 text-right font-mono text-gray-600">{formatRp(item.hpp_per_pcs)}</td>
                          <td className="px-4 py-4 text-right font-mono font-bold text-blue-700">{formatRp(item.total_pendapatan)}</td>
                          <td className="px-4 py-4 text-right">
                            <span className={`font-black font-mono ${(parseFloat(item.laba_bersih) || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>{formatRp(item.laba_bersih)}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => handleEdit(item)} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl font-black text-xs hover:bg-blue-200 transition-all">✏️ Edit</button>
                              <button onClick={() => handleDelete(item.id_laporan)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-xl font-black text-xs hover:bg-red-200 transition-all">🗑️ Hapus</button>
                            </div>
                          </td>
                        </tr>
                        {expandedRow === item.id_laporan && (
                          <tr key={`detail-${item.id_laporan}`}>
                            <td colSpan={7} className="px-6 py-4 bg-gradient-to-r from-green-50/50 to-orange-50/30">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-black text-[#004d33] text-xs uppercase tracking-wider mb-2">🛒 Bahan Baku</h4>
                                  {detailData[item.id_laporan]?.bahan?.length > 0 ? (
                                    <div className="space-y-1">
                                      {detailData[item.id_laporan].bahan.map((b, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-xl text-xs">
                                          <span className="font-bold">{b.nama_bahan}</span>
                                          <span className="opacity-60">{b.berat} {b.satuan} × {formatRp(b.harga_per_satuan)}</span>
                                          <span className="font-black text-[#004d33]">{formatRp((parseFloat(b.berat) || 0) * (parseFloat(b.harga_per_satuan) || 0))}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : <p className="text-xs opacity-40 italic">Tidak ada data bahan</p>}
                                </div>
                                <div>
                                  <h4 className="font-black text-orange-600 text-xs uppercase tracking-wider mb-2">🍱 Hasil Jadi</h4>
                                  {detailData[item.id_laporan]?.hasil?.length > 0 ? (
                                    <div className="space-y-1">
                                      {detailData[item.id_laporan].hasil.map((h, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-xl text-xs">
                                          <span className="font-bold">{h.nama_produk}</span>
                                          <span className="opacity-60">Jadi: {h.jumlah_hasil} | Terjual: {h.terjual}</span>
                                          <span className="font-black text-orange-600">{formatRp((parseInt(h.terjual) || 0) * (parseFloat(h.harga_jual) || 0))}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : <p className="text-xs opacity-40 italic">Tidak ada data produk</p>}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#004d33] text-white">
                      <td className="px-6 py-4 font-black text-sm">TOTAL ({filtered.length} laporan)</td>
                      <td className="px-4 py-4 text-right font-black font-mono text-sm">{formatRp(summaryTotal.modal)}</td>
                      <td className="px-4 py-4 text-right font-black text-sm">{summaryTotal.terjual.toLocaleString("id-ID")} pcs</td>
                      <td className="px-4 py-4 text-right font-black text-sm">-</td>
                      <td className="px-4 py-4 text-right font-black font-mono text-sm">{formatRp(summaryTotal.pendapatan)}</td>
                      <td className="px-4 py-4 text-right font-black font-mono text-sm">{formatRp(summaryTotal.laba)}</td>
                      <td className="px-4 py-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB STOK */}
        {/* ============================================================ */}
        {activeTab === "stok" && (
          <div className="space-y-6">
            {/* Stok Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Produk", value: stokStats.total, icon: "📦", color: "bg-white border-gray-100" },
                { label: "Stok Aman", value: stokStats.aman, icon: "✅", color: "bg-green-50 border-green-100" },
                { label: "Stok Menipis", value: stokStats.menipis, icon: "⚠️", color: "bg-orange-50 border-orange-100" },
                { label: "Stok Habis", value: stokStats.habis, icon: "🚫", color: stokStats.habis > 0 ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100" },
              ].map(card => (
                <div key={card.label} className={`${card.color} border rounded-[1.5rem] p-4 text-center shadow-sm`}>
                  <span className="text-2xl">{card.icon}</span>
                  <p className="text-xs font-bold opacity-50 mt-1">{card.label}</p>
                  <p className="text-2xl font-black text-[#004d33] mt-0.5">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-lg">📦</div>
                  <div>
                    <h2 className="font-black text-[#004d33] text-lg">Stok Produk</h2>
                    <p className="text-xs opacity-50 font-semibold">Update realtime • Terintegrasi dengan POS</p>
                  </div>
                </div>
                <button onClick={() => setStokModalOpen(true)}
                  className="bg-[#004d33] text-white font-black px-6 py-3 rounded-2xl hover:bg-green-800 active:scale-95 transition-all shadow-md text-sm whitespace-nowrap">
                  ➕ Tambah / Kurangi Stok
                </button>
              </div>

              {/* Grid Stok Produk */}
              {loadingStok ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-[#004d33] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-bold opacity-50">Memuat data stok...</p>
                </div>
              ) : produkList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                  <span className="text-5xl mb-4">📭</span>
                  <p className="font-black text-lg">Belum ada produk</p>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {produkList.map(produk => {
                    const stok = stokData[produk.id];
                    const stokSaatIni = stok?.stok_saat_ini ?? 0;
                    const stokMin = stok?.stok_minimum ?? 5;
                    const isHabis = stokSaatIni === 0;
                    const isMenipis = !isHabis && stokSaatIni <= stokMin;
                    const isAman = stokSaatIni > stokMin;

                    const statusColor = isHabis ? "border-red-200 bg-red-50"
                      : isMenipis ? "border-orange-200 bg-orange-50"
                      : "border-green-100 bg-green-50/30";

                    const badgeColor = isHabis ? "bg-red-500 text-white"
                      : isMenipis ? "bg-orange-400 text-white"
                      : "bg-green-500 text-white";

                    const statusText = isHabis ? "Habis" : isMenipis ? "Menipis" : "Aman";

                    return (
                      <div key={produk.id} className={`rounded-[1.5rem] border-2 overflow-hidden shadow-sm transition-all hover:shadow-md ${statusColor}`}>
                        {/* Gambar / Placeholder */}
                        <div className="relative w-full h-32 bg-white overflow-hidden">
                          {produk.gambar ? (
                            <img src={produk.gambar} alt={produk.nama} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-green-50 to-orange-50">🌿</div>
                          )}
                          <span className={`absolute top-2 right-2 text-xs font-black px-2 py-0.5 rounded-full ${badgeColor}`}>{statusText}</span>
                        </div>

                        <div className="p-4">
                          <p className="font-black text-[#004d33] text-sm truncate">{produk.nama}</p>
                          {produk.kategori && <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{produk.kategori}</p>}

                          {/* Stok Display */}
                          <div className="mt-3 flex items-end justify-between">
                            <div>
                              <p className="text-[10px] font-black opacity-40 uppercase tracking-wider">Stok</p>
                              <p className={`text-3xl font-black leading-none ${isHabis ? "text-red-600" : isMenipis ? "text-orange-500" : "text-[#004d33]"}`}>
                                {stokSaatIni}
                              </p>
                              <p className="text-[10px] opacity-40 font-bold">pcs</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-black opacity-40 uppercase tracking-wider">Min.</p>
                              <p className="text-lg font-black text-orange-400">{stokMin}</p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isHabis ? "bg-red-500" : isMenipis ? "bg-orange-400" : "bg-green-500"}`}
                              style={{ width: `${Math.min(100, stokMin > 0 ? (stokSaatIni / (stokMin * 3)) * 100 : (stokSaatIni > 0 ? 100 : 0))}%` }}
                            />
                          </div>

                          {/* Quick Action */}
                          <button
                            onClick={() => { setStokModalOpen(true); }}
                            className="mt-3 w-full py-2 bg-[#004d33] text-white rounded-xl font-black text-xs hover:bg-green-800 transition-all"
                          >
                            ➕ Update Stok
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManajemenProduksi;
