import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import ProductForm from "./ProductForm";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    const { data } = await supabase.from("produk").select("*").order("created_at", { ascending: false });
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Yakin hapus produk ini?")) {
      await supabase.from("produk").delete().eq("id", id);
      fetchProducts();
    }
  };

  const countByCategory = (kategori) => products.filter((p) => p.kategori === kategori).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Product Page</h1>

      {/* CARD SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {["Food and Bakery", "Classic Coffee", "Non Coffee", "Fruity Series", "Cheese Latte Series", "Cloud Series", "Jujutsu Kaisen Series", "UPSETDUCK X PISTACHIO SERIES", "Pesta Kuliner Banting Harga", "SPECIAL OFFER", "Flash Sale Makan Harian"].map((kategori, index) => (
          <div key={index} className="p-4 rounded shadow text-center bg-gray-50 border">
            <h2 className="text-base font-semibold">{kategori}</h2>
            <p className="text-xl">{countByCategory(kategori)}</p>
          </div>
        ))}
      </div>

      {/* Tombol Tambah */}
      <div className="mb-4 text-right">
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Tambah Produk
        </button>
      </div>

      {/* TABEL PRODUK */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nama</th>
              <th className="p-2">Kategori</th>
              <th className="p-2">Harga</th>
              <th className="p-2">Deskripsi</th>
              <th className="p-2">Gambar</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="border-t">
                <td className="p-2">{prod.nama}</td>
                <td className="p-2">{prod.kategori}</td>
                <td className="p-2">Rp {prod.harga}</td>
                <td className="p-2">{prod.deskripsi}</td>
                <td className="p-2">
                  {prod.gambar ? (
                    <img src={prod.gambar} alt="Produk" className="w-12 h-12 object-cover rounded" />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsFormOpen(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Tidak ada produk
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isFormOpen && (
        <ProductForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={fetchProducts}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
}
