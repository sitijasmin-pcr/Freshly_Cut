import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import ProductForm from "./ProductForm"; 

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = [
    "Food and Bakery",
    "Classic Coffee",
    "Non Coffee",
    "Fruity Series",
    "Cheese Latte Series",
    "Cloud Series",
    "Jujutsu Kaisen Series",
    "UPSETDUCK X PISTACHIO SERIES",
    "Pesta Kuliner Banting Harga",
    "SPECIAL OFFER",
    "Flash Sale Makan Harian",
  ];

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("produk").select("*").order("created_at", { ascending: false });
    if (error) console.error("Fetch Error:", error);
    else setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      const { error } = await supabase.from("produk").delete().eq("id", id);
      if (error) {
        console.error("Delete Error:", error);
        alert(`Gagal menghapus produk: ${error.message}`);
      } else {
        fetchProducts();
      }
    }
  };

  const countByCategory = (kategori) => products.filter((p) => p.kategori === kategori).length;

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const formatDateForTable = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Manajemen Produk</h1>

      {/* Product Category Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {categories.map((kategori, index) => (
          <div key={index} className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <p className="text-gray-600 text-lg font-semibold">{kategori}</p>
            <p className="text-4xl font-bold text-orange-500 mt-2">{countByCategory(kategori)}</p>
            <p className="text-gray-500 text-sm">Produk</p>
          </div>
        ))}
      </div>

      {/* Tombol Tambah Produk */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddNewClick}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Tambah Produk Baru
        </button>
      </div>

      {/* Tabel Produk */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar Produk</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((prod) => (
                <tr key={prod.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prod.gambar ? (
                      <img src={prod.gambar} alt={prod.nama} className="w-16 h-16 object-cover rounded-md shadow-sm" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md text-gray-500 text-xs">No Img</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.kategori}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {prod.harga?.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{prod.deskripsi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateForTable(prod.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEditClick(prod)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(prod.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-500">
                    Tidak ada produk ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM yang akan muncul di atas halaman */}
      {isFormOpen && (
        <ProductForm
          onClose={handleCloseForm}
          onSuccess={fetchProducts}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
}