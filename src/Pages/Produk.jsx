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

  const categories = [
    "Buah Potong 250gr",
    "Buah Potong 500gr",
    "Dessert",
  ];

  // ================= FETCH =================
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
          <div className="w-full h-48 bg-gray-100">
            {prod.gambar ? (
              <img
                src={prod.gambar}
                alt={prod.nama}
                className="w-full h-full object-cover"
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