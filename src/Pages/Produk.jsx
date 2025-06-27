// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";
// import ProductForm from "./ProductForm"; 

// export default function ProductPage() {
//   const [products, setProducts] = useState([]);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);

//   const categories = [
//     "Food and Bakery",
//     "Classic Coffee",
//     "Non Coffee",
//     "Fruity Series",
//     "Cheese Latte Series",
//     "Cloud Series",
//     "Jujutsu Kaisen Series",
//     "UPSETDUCK X PISTACHIO SERIES",
//     "Pesta Kuliner Banting Harga",
//     "SPECIAL OFFER",
//     "Flash Sale Makan Harian",
//   ];

//   const fetchProducts = async () => {
//     const { data, error } = await supabase.from("produk").select("*").order("created_at", { ascending: false });
//     if (error) console.error("Fetch Error:", error);
//     else setProducts(data);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleDelete = async (id) => {
//     if (window.confirm("Yakin ingin menghapus produk ini?")) {
//       const { error } = await supabase.from("produk").delete().eq("id", id);
//       if (error) {
//         console.error("Delete Error:", error);
//         alert(`Gagal menghapus produk: ${error.message}`);
//       } else {
//         fetchProducts();
//       }
//     }
//   };

//   const countByCategory = (kategori) => products.filter((p) => p.kategori === kategori).length;

//   const handleEditClick = (product) => {
//     setEditingProduct(product);
//     setIsFormOpen(true);
//   };

//   const handleAddNewClick = () => {
//     setEditingProduct(null);
//     setIsFormOpen(true);
//   };

//   const handleCloseForm = () => {
//     setIsFormOpen(false);
//     setEditingProduct(null);
//   };

//   const formatDateForTable = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toISOString().split('T')[0];
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Manajemen Produk</h1>

//       {/* Product Category Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
//         {categories.map((kategori, index) => (
//           <div key={index} className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
//             <p className="text-gray-600 text-lg font-semibold">{kategori}</p>
//             <p className="text-4xl font-bold text-orange-500 mt-2">{countByCategory(kategori)}</p>
//             <p className="text-gray-500 text-sm">Produk</p>
//           </div>
//         ))}
//       </div>

//       {/* Tombol Tambah Produk */}
//       <div className="mb-6 flex justify-end">
//         <button
//           onClick={handleAddNewClick}
//           className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
//         >
//           Tambah Produk Baru
//         </button>
//       </div>

//       {/* Tabel Produk */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar Produk</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {products.map((prod) => (
//                 <tr key={prod.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {prod.gambar ? (
//                       <img src={prod.gambar} alt={prod.nama} className="w-16 h-16 object-cover rounded-md shadow-sm" />
//                     ) : (
//                       <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md text-gray-500 text-xs">No Img</div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.nama}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.kategori}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {prod.harga?.toLocaleString('id-ID')}</td>
//                   <td className="px-6 py-4 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{prod.deskripsi}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateForTable(prod.created_at)}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button onClick={() => handleEditClick(prod)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
//                     <button onClick={() => handleDelete(prod.id)} className="text-red-600 hover:text-red-900">Hapus</button>
//                   </td>
//                 </tr>
//               ))}
//               {products.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="text-center p-6 text-gray-500">
//                     Tidak ada produk ditemukan.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* MODAL FORM yang akan muncul di atas halaman */}
//       {isFormOpen && (
//         <ProductForm
//           onClose={handleCloseForm}
//           onSuccess={fetchProducts}
//           editingProduct={editingProduct}
//         />
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import ProductForm from "./ProductForm"; // Pastikan path ini benar
import Swal from 'sweetalert2'; // Import SweetAlert2 untuk notifikasi
import 'sweetalert2/dist/sweetalert2.min.css'; // Opsional: Untuk styling default SweetAlert2

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Tambahkan loading state
  const [error, setError] = useState(null); // Tambahkan error state untuk fetch
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State untuk search input

  // Definisikan kategori produk yang ada di gambar referensi atau sesuai kebutuhan Anda
  // Saya menyertakan beberapa kategori yang mungkin ada di aplikasi Anda
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

  // Fungsi untuk mengambil data produk dari Supabase
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("produk") // Pastikan nama tabel di Supabase Anda adalah 'produk'
        .select("*")
        .order("created_at", { ascending: false });
      if (fetchError) {
        throw fetchError;
      }
      setProducts(data);
    } catch (err) {
      console.error("Fetch Error:", err.message);
      setError("Gagal memuat produk. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fungsi untuk menangani penghapusan produk dengan konfirmasi SweetAlert2
  const handleDelete = async (id, productName) => {
    Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: `Produk "${productName}" akan dihapus permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Warna merah untuk konfirmasi hapus
      cancelButtonColor: '#3085d6', // Warna biru untuk batal
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true); // Aktifkan loading saat operasi hapus
        try {
          const { error } = await supabase.from("produk").delete().eq("id", id);
          if (error) {
            throw error;
          }
          fetchProducts(); // Refresh daftar setelah hapus berhasil
          Swal.fire('Terhapus!', 'Produk berhasil dihapus.', 'success');
        } catch (err) {
          console.error("Delete Error:", err.message);
          Swal.fire('Gagal!', `Gagal menghapus produk: ${err.message}`, 'error');
        } finally {
          setLoading(false); // Nonaktifkan loading
        }
      } else {
        Swal.fire('Dibatalkan', 'Penghapusan produk dibatalkan.', 'info');
      }
    });
  };

  // Menghitung jumlah produk per kategori
  const countByCategory = (kategori) => products.filter((p) => p.kategori === kategori).length;

  // Fungsi untuk membuka form dalam mode edit
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  // Fungsi untuk membuka form dalam mode tambah baru
  const handleAddNewClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // Fungsi untuk menutup form modal
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null); // Pastikan editingProduct direset saat form ditutup
  };

  // Filter produk berdasarkan search term
  const filteredProducts = products.filter(product =>
    product.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-gray-100 min-h-screen font-inter">
      {/* Sidebar Placeholder - Ini akan di luar scope komponen ini di aplikasi nyata */}
      {/* <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Halalbaik</h2>
        <nav className="space-y-4">
          <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600 font-medium">
            <i className="fas fa-tachometer-alt mr-3"></i> Dashboard
          </a>
          <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600 font-medium">
            <i className="fas fa-box mr-3"></i> Orders
          </a>
          <a href="#" className="flex items-center text-indigo-600 font-bold bg-indigo-50 rounded-lg py-2 px-3">
            <i className="fas fa-items mr-3"></i> Items
          </a>
           More nav items 
        </nav>
      </aside> */}

      {/* Main Content Area */}
      <div className="flex-1 p-6 lg:p-8">
        {/* Header dengan Search Bar dan Add Item */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Menu items</h1>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <button
              onClick={handleAddNewClick}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center whitespace-nowrap"
            >
              <i className="fas fa-plus mr-2"></i> Add Item
            </button>
          </div>
        </header>

        {/* Total Items Summary */}
        <div className="mb-8 text-gray-700 font-semibold text-xl">
          Total item - {products.length}
        </div>

        {/* Product Category Summary Cards (Disusun lebih rapi) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
          {categories.map((kategori, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between transition-all duration-200 hover:shadow-lg cursor-pointer">
              <div className="flex items-center">
                {/* Placeholder untuk ikon kategori, bisa diganti dengan ikon sesuai kategori */}
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600">
                  <i className="fas fa-box"></i>
                </div>
                <div>
                  <p className="text-gray-700 font-medium text-sm">{kategori}</p>
                  <p className="text-gray-500 text-xs">{countByCategory(kategori)} Items</p>
                </div>
              </div>
              {/* Panah kanan, seperti di gambar referensi */}
              <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
            </div>
          ))}
        </div>

        {/* Product Grid - Ini adalah perubahan utama dari tabel */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg text-gray-600">Memuat produk...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <i className="fas fa-info-circle text-5xl mb-4 text-gray-400"></i>
            <p className="text-xl font-semibold">Tidak ada produk ditemukan.</p>
            <p className="text-md mt-2">Coba sesuaikan pencarian Anda atau tambahkan produk baru.</p>
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:scale-102 transition-transform duration-200 ease-in-out">
                {/* Gambar Produk */}
                <div className="w-full h-48 overflow-hidden flex items-center justify-center bg-gray-50">
                  {prod.gambar ? (
                    <img
                      src={prod.gambar}
                      alt={prod.nama}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/cccccc/000000?text=No+Image'; }} // Fallback image
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gray-200">No Image Available</div>
                  )}
                </div>

                {/* Detail Produk */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{prod.nama}</h3>
                    <p className="text-orange-500 font-semibold text-xl mb-2">
                      Rp {prod.harga?.toLocaleString('id-ID')}
                    </p>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2" title={prod.deskripsi}>
                      {prod.deskripsi || 'Tidak ada deskripsi.'}
                    </p>
                    <p className="text-gray-600 text-xs font-medium bg-gray-100 rounded-full px-3 py-1 inline-block">
                      {prod.kategori || 'Tidak Berkategori'}
                    </p>
                  </div>
                  {/* Tombol Aksi */}
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 flex items-center justify-center shadow-md text-sm"
                      title="Edit Produk"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id, prod.nama)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 flex items-center justify-center shadow-md text-sm"
                      title="Hapus Produk"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FORM yang akan muncul di atas halaman */}
      {isFormOpen && (
        <ProductForm
          onClose={handleCloseForm}
          onSuccess={fetchProducts} // Panggil fetchProducts setelah sukses operasi
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
}
