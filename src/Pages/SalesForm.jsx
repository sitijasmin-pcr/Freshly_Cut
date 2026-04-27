import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase";
import Swal from "sweetalert2";
import { X, Plus, Minus, Trash2, ShoppingCart, Search, Check, AlertTriangle } from "lucide-react";

// ============================================================
// SalesForm.jsx - Form Transaksi POS dengan Cek Stok Realtime
//
// Integrasi:
// - Membaca stok dari tabel `stok_produk`
// - Produk dengan stok 0 tidak bisa ditambah ke keranjang
// - Setelah transaksi berhasil, stok dikurangi otomatis
// - Realtime subscription untuk update stok live
// ============================================================

const formatRp = (v) => `Rp ${(parseFloat(v) || 0).toLocaleString("id-ID")}`;

// Komponen kartu produk dengan info stok
const ProductCard = ({ produk, qty, stok, onAdd, onRemove }) => {
  const isSelected = qty > 0;
  const stokSaatIni = stok?.stok_saat_ini ?? 0;
  const stokMin = stok?.stok_minimum ?? 5;
  const isHabis = stokSaatIni === 0;
  const isMenipis = !isHabis && stokSaatIni <= stokMin;
  const isMaxQty = qty >= stokSaatIni;

  return (
    <div
      onClick={() => !isHabis && !isMaxQty && onAdd()}
      className={`relative rounded-[1.5rem] overflow-hidden border-2 transition-all duration-200 select-none
        ${isHabis
          ? "border-red-200 bg-red-50/50 opacity-60 cursor-not-allowed"
          : isSelected
          ? "border-[#004d33] shadow-lg shadow-[#004d33]/20 scale-[1.02] cursor-pointer"
          : "border-gray-100 hover:border-[#004d33]/40 hover:shadow-md cursor-pointer"
        } bg-white`}
    >
      {/* Badge qty */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 w-7 h-7 bg-[#004d33] text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg">
          {qty}
        </div>
      )}

      {/* Badge habis */}
      {isHabis && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
          HABIS
        </div>
      )}

      {/* Badge menipis */}
      {isMenipis && !isHabis && !isSelected && (
        <div className="absolute top-2 left-2 z-10 bg-orange-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
          <AlertTriangle size={9} /> Sisa {stokSaatIni}
        </div>
      )}

      {/* Gambar produk */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        {produk.gambar ? (
          <img src={produk.gambar} alt={produk.nama} className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-green-50 to-orange-50">
            {isHabis ? "😔" : "🌿"}
          </div>
        )}

        {/* Overlay control qty */}
        {isSelected && !isHabis && (
          <div className="absolute inset-0 bg-[#004d33]/10 flex items-end justify-center pb-2">
            <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 shadow">
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 transition-all"
              >
                <Minus size={12} />
              </button>
              <span className="font-black text-[#004d33] text-sm w-4 text-center">{qty}</span>
              <button
                onClick={(e) => { e.stopPropagation(); if (!isMaxQty) onAdd(); }}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isMaxQty ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-green-100 text-[#004d33] hover:bg-green-200"}`}
                disabled={isMaxQty}
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Overlay habis */}
        {isHabis && (
          <div className="absolute inset-0 bg-red-100/50 flex items-center justify-center">
            <span className="text-red-500 font-black text-xs bg-white px-2 py-1 rounded-full">Stok Habis</span>
          </div>
        )}
      </div>

      {/* Info produk */}
      <div className="p-3">
        <p className="font-black text-[#004d33] text-sm leading-tight truncate">{produk.nama}</p>
        {produk.kategori && (
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">{produk.kategori}</p>
        )}
        <div className="flex items-center justify-between mt-1">
          <p className="font-black text-orange-500 text-sm">{formatRp(produk.harga)}</p>
          {!isHabis && (
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isMenipis ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-700"}`}>
              {stokSaatIni} pcs
            </span>
          )}
        </div>

        {/* Warning max qty */}
        {isSelected && isMaxQty && !isHabis && (
          <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-0.5">
            <AlertTriangle size={9} /> Maks. stok tercapai
          </p>
        )}
      </div>
    </div>
  );
};

// Item di keranjang
const CartItem = ({ item, stok, onAdd, onRemove, onDelete }) => {
  const stokSaatIni = stok?.stok_saat_ini ?? 0;
  const isMaxQty = item.qty >= stokSaatIni;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
        {item.gambar ? (
          <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-[#004d33] text-sm truncate">{item.nama}</p>
        <p className="text-xs text-orange-500 font-bold">{formatRp(item.harga)}</p>
        {isMaxQty && <p className="text-[10px] text-red-400 font-bold">Maks. stok</p>}
      </div>
      <div className="flex items-center gap-1.5">
        <button onClick={onRemove} className="w-7 h-7 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-all">
          <Minus size={13} />
        </button>
        <span className="w-6 text-center font-black text-sm text-[#004d33]">{item.qty}</span>
        <button onClick={onAdd} disabled={isMaxQty}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isMaxQty ? "bg-gray-50 text-gray-200 cursor-not-allowed" : "bg-green-100 text-[#004d33] hover:bg-green-200"}`}>
          <Plus size={13} />
        </button>
      </div>
      <div className="text-right min-w-[70px]">
        <p className="font-black text-[#004d33] text-sm">{formatRp(item.harga * item.qty)}</p>
      </div>
      <button onClick={onDelete} className="w-7 h-7 text-gray-300 hover:text-red-500 flex items-center justify-center transition-all">
        <Trash2 size={14} />
      </button>
    </div>
  );
};

// ── Komponen Utama SalesForm ─────────────────────────────────
const SalesForm = ({ onClose, onSuccess, initialOrderData }) => {
  const isEdit = !!initialOrderData;
  const [produkList, setProdukList] = useState([]);
  const [stokData, setStokData] = useState({}); // { produk_id: { stok_saat_ini, stok_minimum } }
  const [loadingProduk, setLoadingProduk] = useState(true);
  const [keranjang, setKeranjang] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [searchProduk, setSearchProduk] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState("produk");

  // Fetch produk + stok
  const fetchProdukDanStok = useCallback(async () => {
    setLoadingProduk(true);
    try {
      const [produkRes, stokRes] = await Promise.all([
        supabase.from("produk").select("*").order("nama"),
        supabase.from("stok_produk").select("*"),
      ]);
      if (produkRes.error) throw produkRes.error;
      setProdukList(produkRes.data || []);

      const stokMap = {};
      (stokRes.data || []).forEach(s => { stokMap[s.produk_id] = s; });
      setStokData(stokMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProduk(false);
    }
  }, []);

  useEffect(() => {
    fetchProdukDanStok();

    if (isEdit && initialOrderData) {
      setCustomerName(initialOrderData.customer_name || "");
      setNotes(initialOrderData.notes || "");
      const k = {};
      (initialOrderData.items_detail || []).forEach(item => { k[item.product_id] = item.quantity; });
      setKeranjang(k);
    }

    // Realtime subscription untuk stok
    const channel = supabase.channel("stok-pos-realtime")
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

    return () => { supabase.removeChannel(channel); };
  }, [fetchProdukDanStok, isEdit, initialOrderData]);

  const kategoriList = ["Semua", ...Array.from(new Set(produkList.map(p => p.kategori).filter(Boolean)))];

  const filteredProduk = produkList.filter(p => {
    const matchSearch = !searchProduk || p.nama.toLowerCase().includes(searchProduk.toLowerCase());
    const matchKategori = selectedKategori === "Semua" || p.kategori === selectedKategori;
    return matchSearch && matchKategori;
  });

  const cartItems = produkList
    .filter(p => keranjang[p.id] > 0)
    .map(p => ({ ...p, qty: keranjang[p.id] || 0 }));

  const totalItem = cartItems.reduce((s, i) => s + i.qty, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.harga * i.qty, 0);

  const addToCart = (id) => {
    const stok = stokData[id];
    const stokSaatIni = stok?.stok_saat_ini ?? 0;
    const currentQty = keranjang[id] || 0;

    if (stokSaatIni === 0) {
      Swal.fire({ title: "Stok Habis", text: "Produk ini sudah habis!", icon: "warning", confirmButtonColor: "#004d33", timer: 1500, showConfirmButton: false });
      return;
    }
    if (currentQty >= stokSaatIni) {
      Swal.fire({ title: "Stok Tidak Cukup", text: `Stok tersedia hanya ${stokSaatIni} pcs!`, icon: "warning", confirmButtonColor: "#004d33", timer: 1500, showConfirmButton: false });
      return;
    }
    setKeranjang(prev => ({ ...prev, [id]: currentQty + 1 }));
  };

  const removeFromCart = (id) => {
    setKeranjang(prev => {
      const next = { ...prev };
      if (next[id] > 1) next[id] -= 1;
      else delete next[id];
      return next;
    });
  };

  const deleteFromCart = (id) => {
    setKeranjang(prev => { const next = { ...prev }; delete next[id]; return next; });
  };

  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      Swal.fire("Peringatan", "Pilih minimal 1 produk!", "warning");
      return;
    }

    // Validasi stok sebelum submit
    for (const item of cartItems) {
      const stokSaatIni = stokData[item.id]?.stok_saat_ini ?? 0;
      if (item.qty > stokSaatIni) {
        Swal.fire("Stok Tidak Cukup", `Stok "${item.nama}" hanya tersisa ${stokSaatIni} pcs, Anda memilih ${item.qty} pcs.`, "error");
        return;
      }
    }

    setSaving(true);
    try {
      const receiptId = isEdit
        ? initialOrderData.receipt_id
        : `INV-${Date.now().toString(36).toUpperCase()}`;

      const orderPayload = {
        customer_name: customerName || null,
        status: "Completed",
        total_amount: subtotal,
        receipt_id: receiptId,
        notes: notes || null,
      };

      let orderId;

      if (isEdit) {
        const { error } = await supabase.from("orders").update(orderPayload).eq("id", initialOrderData.id);
        if (error) throw error;
        orderId = initialOrderData.id;

        // Kembalikan stok lama sebelum dikurangi lagi
        for (const oldItem of (initialOrderData.items_detail || [])) {
          const stok = stokData[oldItem.product_id];
          if (stok) {
            await supabase.from("stok_produk")
              .update({ stok_saat_ini: stok.stok_saat_ini + oldItem.quantity, updated_at: new Date().toISOString() })
              .eq("produk_id", oldItem.product_id);
          }
        }
        await supabase.from("order_items").delete().eq("order_id", orderId);
      } else {
        const { data, error } = await supabase.from("orders").insert(orderPayload).select().single();
        if (error) throw error;
        orderId = data.id;
      }

      // Insert items
      const itemsPayload = cartItems.map(item => ({
        order_id: orderId,
        product_id: item.id,
        product_name: item.nama,
        quantity: item.qty,
        price_per_unit: item.harga,
        subtotal: item.harga * item.qty,
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);
      if (itemsError) throw itemsError;

      // ⚡ KURANGI STOK setelah transaksi berhasil
      for (const item of cartItems) {
        const stokSaatIni = stokData[item.id]?.stok_saat_ini ?? 0;
        const stokBaru = Math.max(0, stokSaatIni - item.qty);

        const { error: stokError } = await supabase.from("stok_produk")
          .update({ stok_saat_ini: stokBaru, updated_at: new Date().toISOString() })
          .eq("produk_id", item.id);
        if (stokError) console.error("Error update stok:", stokError);

        // Catat history
        await supabase.from("stok_history").insert({
          produk_id: item.id,
          jenis: "transaksi",
          jumlah: item.qty,
          stok_sebelum: stokSaatIni,
          stok_sesudah: stokBaru,
          keterangan: `Transaksi ${receiptId}`,
          referensi_id: orderId,
        });
      }

      // Fetch full order untuk struk
      const { data: fullOrder, error: fetchError } = await supabase
        .from("orders")
        .select(`*, order_items(*)`)
        .eq("id", orderId)
        .single();
      if (fetchError) throw fetchError;

      Swal.fire({ title: "Berhasil!", text: "Transaksi berhasil disimpan", icon: "success", timer: 1500, showConfirmButton: false });
      onSuccess(fullOrder);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4">
      <div className="w-full max-w-5xl bg-[#FDF8EE] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '100dvh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#004d33]/10 flex-shrink-0">
          <div>
            <h2 className="text-xl font-black italic text-[#004d33]">{isEdit ? "✏️ Edit Transaksi" : "🛒 Transaksi Baru"}</h2>
            <p className="text-xs opacity-50 font-semibold">Freshly Cut POS</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-500 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="flex gap-2 px-6 pt-4 flex-shrink-0">
          <button onClick={() => setStep("produk")}
            className={`flex items-center gap-2 px-5 py-2 rounded-2xl font-black text-sm transition-all ${step === "produk" ? "bg-[#004d33] text-white shadow-lg" : "bg-gray-100 text-gray-400 hover:text-[#004d33]"}`}>
            1. Pilih Produk
            {totalItem > 0 && (
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${step === "produk" ? "bg-orange-400 text-white" : "bg-[#004d33] text-white"}`}>{totalItem}</span>
            )}
          </button>
          <button onClick={() => cartItems.length > 0 && setStep("konfirmasi")}
            className={`flex items-center gap-2 px-5 py-2 rounded-2xl font-black text-sm transition-all ${step === "konfirmasi" ? "bg-[#004d33] text-white shadow-lg" : "bg-gray-100 text-gray-400 hover:text-[#004d33]"} ${cartItems.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}>
            2. Konfirmasi
          </button>
        </div>

        {/* STEP 1: Pilih Produk */}
        {step === "produk" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden gap-0">
              {/* Grid Produk */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 pt-4 pb-3 space-y-3 flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input type="text" placeholder="Cari produk..."
                      className="w-full pl-9 pr-4 py-2.5 bg-white rounded-2xl border-2 border-gray-100 focus:border-green-300 outline-none font-medium text-sm"
                      value={searchProduk} onChange={(e) => setSearchProduk(e.target.value)} />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {kategoriList.map(kat => (
                      <button key={kat} onClick={() => setSelectedKategori(kat)}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-black transition-all ${selectedKategori === kat ? "bg-[#004d33] text-white shadow-md" : "bg-white text-gray-400 border border-gray-100 hover:border-[#004d33]/30"}`}>
                        {kat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  {loadingProduk ? (
                    <div className="flex flex-col items-center justify-center h-48">
                      <div className="w-10 h-10 border-4 border-[#004d33] border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="font-bold opacity-40 text-sm">Memuat produk...</p>
                    </div>
                  ) : filteredProduk.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 opacity-30">
                      <span className="text-4xl mb-2">🔍</span>
                      <p className="font-black">Produk tidak ditemukan</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filteredProduk.map(p => (
                        <ProductCard key={p.id} produk={p} qty={keranjang[p.id] || 0}
                          stok={stokData[p.id]}
                          onAdd={() => addToCart(p.id)}
                          onRemove={() => removeFromCart(p.id)} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Panel Keranjang Desktop */}
              <div className="hidden md:flex flex-col w-72 bg-white border-l border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50">
                  <h3 className="font-black text-[#004d33] flex items-center gap-2">
                    <ShoppingCart size={16} />
                    Keranjang
                    {totalItem > 0 && <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 font-black">{totalItem}</span>}
                  </h3>
                </div>
                {cartItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-20 p-4">
                    <ShoppingCart size={36} />
                    <p className="font-bold text-sm mt-2 text-center">Belum ada produk dipilih</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto px-4">
                    {cartItems.map(item => (
                      <CartItem key={item.id} item={item} stok={stokData[item.id]}
                        onAdd={() => addToCart(item.id)}
                        onRemove={() => removeFromCart(item.id)}
                        onDelete={() => deleteFromCart(item.id)} />
                    ))}
                  </div>
                )}
                <div className="p-4 border-t border-gray-100 bg-[#004d33]/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black uppercase opacity-50 tracking-wider">Total</span>
                    <span className="text-xl font-black text-[#004d33]">{formatRp(subtotal)}</span>
                  </div>
                  <button disabled={cartItems.length === 0} onClick={() => setStep("konfirmasi")}
                    className="w-full py-3 bg-[#004d33] text-white rounded-2xl font-black text-sm hover:bg-green-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg">
                    Lanjut Konfirmasi →
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom bar mobile */}
            {totalItem > 0 && (
              <div className="md:hidden flex-shrink-0 p-4 bg-[#004d33] flex items-center justify-between">
                <div className="text-white">
                  <p className="text-xs opacity-70 font-bold">{totalItem} item dipilih</p>
                  <p className="text-lg font-black">{formatRp(subtotal)}</p>
                </div>
                <button onClick={() => setStep("konfirmasi")}
                  className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black text-sm active:scale-95 transition-all shadow">
                  Lanjut →
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Konfirmasi */}
        {step === "konfirmasi" && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-lg mx-auto space-y-5">
              <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
                <h3 className="font-black text-[#004d33] text-sm mb-4 flex items-center gap-2">
                  <ShoppingCart size={15} /> Ringkasan Pesanan
                </h3>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center text-xs font-black">{item.qty}</span>
                        <span className="font-bold text-[#004d33]">{item.nama}</span>
                      </div>
                      <span className="font-black text-[#004d33]">{formatRp(item.harga * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                  <span className="font-black text-sm uppercase opacity-50">Total</span>
                  <span className="text-2xl font-black text-[#004d33]">{formatRp(subtotal)}</span>
                </div>
              </div>

              <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase opacity-50 tracking-wider mb-2">
                    Nama Pelanggan <span className="font-normal normal-case">(opsional)</span>
                  </label>
                  <input type="text" placeholder="Contoh: Budi"
                    className="w-full p-3 rounded-2xl border-2 border-gray-100 focus:border-green-300 outline-none font-bold text-sm bg-gray-50"
                    value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase opacity-50 tracking-wider mb-2">
                    Catatan <span className="font-normal normal-case">(opsional)</span>
                  </label>
                  <textarea rows={2} placeholder="Contoh: tanpa gula, extra pedas..."
                    className="w-full p-3 rounded-2xl border-2 border-gray-100 focus:border-green-300 outline-none font-medium text-sm bg-gray-50 resize-none"
                    value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("produk")}
                  className="flex-1 py-4 border-2 border-[#004d33]/20 rounded-2xl font-black text-[#004d33] hover:bg-[#004d33]/5 transition-all text-sm">
                  ← Kembali
                </button>
                <button onClick={handleSubmit} disabled={saving}
                  className="flex-[2] py-4 bg-[#004d33] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-800 active:scale-95 transition-all shadow-xl disabled:opacity-60 text-sm">
                  {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={18} />}
                  {saving ? "Menyimpan..." : isEdit ? "Update Transaksi" : "Selesaikan Transaksi"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesForm;
