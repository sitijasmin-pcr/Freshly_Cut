import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import ProductForm from "./ProductForm";
// import { Search } from "lucide-react"; // Import ikon pencarian jika ingin digunakan

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // State untuk filter kategori
  const [searchTerm, setSearchTerm] = useState(""); // State baru untuk input pencarian
  const [currentPage, setCurrentPage] = useState(1); // State untuk halaman pagination
  const itemsPerPage = 10; // Jumlah item per halaman

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
        fetchProducts(); // Refresh daftar produk
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

  // --- Logic Pencarian dan Filter ---
  const filteredAndSearchedProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory ? prod.kategori === selectedCategory : true;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      prod.nama.toLowerCase().includes(lowerCaseSearchTerm) ||
      prod.deskripsi.toLowerCase().includes(lowerCaseSearchTerm);
    return matchesCategory && matchesSearch;
  });

  // Pagination logic applied to filtered and searched products
  const totalPages = Math.ceil(filteredAndSearchedProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSearchedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset page to 1 when category or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Manajemen Produk</h1>

      {/* Product Category Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        <div
          key="all-categories"
          className={`bg-white p-5 rounded-lg shadow-md flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200
          ${!selectedCategory ? 'bg-orange-200 border-2 border-orange-500' : 'hover:bg-orange-100 hover:border-orange-300'}`}
          onClick={() => {
            setSelectedCategory(null);
            // currentPage is already reset by the useEffect below
          }}
        >
          <p className="text-gray-600 text-lg font-semibold">Semua Kategori</p>
          <p className="text-4xl font-bold text-orange-500 mt-2">{products.length}</p>
          <p className="text-gray-500 text-sm">Produk</p>
        </div>
        {categories.map((kategori, index) => (
          <div
            key={index}
            className={`bg-white p-5 rounded-lg shadow-md flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200
            ${selectedCategory === kategori ? 'bg-orange-200 border-2 border-orange-500' : 'hover:bg-orange-100 hover:border-orange-300'}`}
            onClick={() => {
              setSelectedCategory(kategori);
              // currentPage is already reset by the useEffect below
            }}
          >
            <p className="text-gray-600 text-lg font-semibold">{kategori}</p>
            <p className="text-4xl font-bold text-orange-500 mt-2">{countByCategory(kategori)}</p>
            <p className="text-gray-500 text-sm">Produk</p>
          </div>
        ))}
      </div>

      {/* Tombol Tambah Produk (tetap di sini) */}
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Produk {selectedCategory ? `(${selectedCategory})` : ''}</h2>
        {/* Input Pencarian dipindahkan ke sini */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          />
          {/* Anda bisa menggunakan ikon Search dari lucide-react jika diimpor */}
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th> {/* Kolom ID baru */}
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
              {currentItems.map((prod, index) => (
                <tr key={prod.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
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
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center p-6 text-gray-500">
                    {searchTerm || selectedCategory ? "Tidak ada produk ditemukan dengan kriteria ini." : "Tidak ada produk."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredAndSearchedProducts.length > itemsPerPage && (
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                  ${currentPage === i + 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
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