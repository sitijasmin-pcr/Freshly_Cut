import { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabase";
import ProductForm from "./ProductForm";
import Swal from "sweetalert2";

import { Plus, Edit, Trash2, Search } from "lucide-react";

export default function Produk() {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  const categories = [
    "Buah Potong 250gr",
    "Buah Potong 500gr",
    "Dessert",
  ];
=======
  const categories = ["Buah Potong", "Dessert"];
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a

  // ================= FETCH =================
  const fetchProducts = async () => {
    setLoading(true);
<<<<<<< HEAD

=======
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("created_at", { ascending: false });

<<<<<<< HEAD
    if (!error) {
      setProducts(data);
    }

=======
    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      setProducts(data);
    }
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

<<<<<<< HEAD
  // ================= DELETE =================
  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Hapus Produk?",
      text: `Yakin hapus "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#004d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await supabase.from("produk").delete().eq("id", id);
        fetchProducts();
        Swal.fire("Berhasil!", "Produk dihapus", "success");
      }
    });
  };

  // ================= FILTER =================
=======
  // const handleDelete = (id, name) => {
  //   Swal.fire({
  //     title: "Hapus Produk?",
  //     text: Yakin hapus "${name}"?,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#004d33",
  //     confirmButtonText: "Ya, hapus!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       await supabase.from("produk").delete().eq("id", id);
  //       fetchProducts();
  //       Swal.fire("Berhasil!", "Produk dihapus", "success");
  //     }
  //   });
  // };

>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
  const filteredProducts = useMemo(() => {
    let data = products;

    if (selectedCategory) {
      data = data.filter((p) => p.kategori === selectedCategory);
    }

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      data = data.filter(
        (p) =>
          (p.nama || "").toLowerCase().includes(s) ||
          (p.deskripsi || "").toLowerCase().includes(s)
      );
    }

    return data;
  }, [products, selectedCategory, searchTerm]);

<<<<<<< HEAD
  // ================= GROUPING (URUTAN FIX) =================
  const buah250 = filteredProducts.filter(
    (p) => p.kategori === "Buah Potong 250gr"
  );

  const buah500 = filteredProducts.filter(
    (p) => p.kategori === "Buah Potong 500gr"
  );

  const dessert = filteredProducts.filter(
    (p) => p.kategori === "Dessert"
  );

  // ================= CARD =================
  const renderCards = (list) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {list.map((prod) => (
        <div
          key={prod.id}
          className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition overflow-hidden"
        >
=======
  // ================== PEMISAHAN ==================
  const buahPotong = filteredProducts.filter(
    (p) => p.kategori?.toLowerCase() === "buah potong"
  );

  const dessert = filteredProducts.filter(
    (p) => p.kategori?.toLowerCase() === "dessert"
  );

  // ================== CARD ==================
const renderCards = (list) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {list.map((prod) => (
        <div key={prod.id} className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition overflow-hidden">
>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
          <div className="w-full h-48 bg-gray-100">
            {prod.gambar ? (
              <img
                src={prod.gambar}
                alt={prod.nama}
                className="w-full h-full object-cover"
<<<<<<< HEAD
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-black text-[#004d33] text-lg">
              {prod.nama}
            </h3>

            <p className="text-sm text-gray-500">
              {prod.deskripsi}
            </p>

            <p className="text-green-600 font-bold">
              Rp {(prod.harga || 0).toLocaleString("id-ID")}
            </p>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => {
                  setEditingProduct(prod);
                  setIsFormOpen(true);
                }}
              >
                <Edit size={16} />
              </button>

              <button
                onClick={() => handleDelete(prod.id, prod.nama)}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ================= UI =================
  return (
    <div className="p-8 bg-[#FDF8EE] min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-black text-center text-[#004d33] mb-6">
        Freshly Cut Product
      </h1>

      {/* BUTTON */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="bg-[#004d33] text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari produk..."
          className="w-full p-3 border rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="p-3 border rounded-xl"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Semua</option>
          {categories.map((c, i) => (
            <option key={i}>{c}</option>
          ))}
        </select>
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* ================= URUTAN TAMPILAN (FIX UTAMA) ================= */}

      {/* 1. BUAH 250GR (ATAS) */}
      {!loading && buah250.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-black text-[#004d33] mb-4">
            🍉 Buah Potong 250gr
          </h2>
          {renderCards(buah250)}
        </div>
      )}

      {/* 2. BUAH 500GR (TENGAH) */}
      {!loading && buah500.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-black text-[#004d33] mb-4">
            🍉 Buah Potong 500gr
          </h2>
          {renderCards(buah500)}
        </div>
      )}

      {/* 3. DESSERT (BAWAH) */}
      {!loading && dessert.length > 0 && (
        <div>
          <h2 className="text-xl font-black text-orange-500 mb-4">
            🍰 Dessert
          </h2>
          {renderCards(dessert)}
        </div>
      )}

      {/* FORM */}
=======
                onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=No+Image"; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-black text-[#004d33] text-lg truncate">{prod.nama}</h3>
            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{prod.deskripsi}</p>
            <p className="text-green-700 font-black mb-3">Rp {(prod.harga || 0).toLocaleString("id-ID")}</p>
            <div className="flex justify-between border-t pt-3">
              <button onClick={() => { setEditingProduct(prod); setIsFormOpen(true); }} className="text-[#004d33] flex items-center gap-1"><Edit size={16} /> Edit</button>
              <button onClick={() => handleDelete(prod.id, prod.nama)} className="text-red-500 flex items-center gap-1"><Trash2 size={16} /> Hapus</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div className="p-8 bg-[#FDF8EE] min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-black italic text-center text-[#004d33] mb-6">
          Freshly Cut <span className="text-orange-500">Product</span>
        </h1>

        {/* BUTTON */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="bg-[#004d33] text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-green-800 shadow-md"
          >
            <Plus size={18} /> Tambah Produk
          </button>
        </div>

        {/* FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-full pl-10 p-3 rounded-2xl border-2 border-[#004d33]/20 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="p-3 rounded-2xl border-2 border-[#004d33]/20 bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Semua</option>
            {categories.map((c, i) => (
              <option key={i}>{c}</option>
            ))}
          </select>
        </div>

        {/* LOADING */}
        {loading && <p className="text-center">Loading...</p>}

        {/* ===== BUAH POTONG ===== */}
        {!loading && buahPotong.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-black text-[#004d33] mb-4">
              🍉 Buah Potong
            </h2>
            {renderCards(buahPotong)}
          </div>
        )}

        {/* ===== DESSERT ===== */}
        {!loading && dessert.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-orange-500 mb-4">
              🍰 Dessert
            </h2>
            {renderCards(dessert)}
          </div>
        )}

        {/* EMPTY */}
        {!loading && buahPotong.length === 0 && dessert.length === 0 && (
          <p className="text-center text-gray-500">Tidak ada produk</p>
        )}
      </div>

>>>>>>> 441ce4fe351eb646b61a38cc1a4176429225a86a
      {isFormOpen && (
        <ProductForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchProducts();
          }}
          editingProduct={editingProduct}
        />
      )}

    </div>
  );
}