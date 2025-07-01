// import { useState, useEffect, useMemo } from "react";
// import { supabase } from "../supabase";
// import ProductForm from "./ProductForm";
// import Swal from 'sweetalert2';
// import 'sweetalert2/dist/sweetalert2.min.css';

// export default function ProductPage() {
//   const [products, setProducts] = useState([]);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

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
//     setLoading(true);
//     setError(null);
//     try {
//       const { data, error: fetchError } = await supabase.from("produk").select("*").order("created_at", { ascending: false });
//       if (fetchError) throw fetchError;
//       setProducts(data);
//     } catch (err) {
//       console.error("Fetch Error:", err.message);
//       setError("Gagal memuat daftar produk. Pastikan tabel 'produk' ada di Supabase.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleDelete = async (id, productName) => {
//     Swal.fire({
//       title: 'Hapus Produk?',
//       text: `Anda yakin ingin menghapus produk "${productName}"? Tindakan ini tidak dapat dibatalkan.`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Ya, Hapus!',
//       cancelButtonText: 'Batal'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const { error: deleteError } = await supabase.from("produk").delete().eq("id", id);
//           if (deleteError) throw deleteError;
//           fetchProducts();
//           Swal.fire('Terhapus!', 'Produk berhasil dihapus.', 'success');
//         } catch (err) {
//           console.error("Delete Error:", err.message);
//           Swal.fire('Gagal!', `Gagal menghapus produk: ${err.message}`, 'error');
//         }
//       }
//     });
//   };

//   const productSummary = useMemo(() => {
//     const counts = {
//       total: products.length,
//       ...Object.fromEntries(categories.map(cat => [cat, 0]))
//     };

//     products.forEach(p => {
//       if (counts[p.kategori] !== undefined) {
//         counts[p.kategori]++;
//       }
//     });
//     return counts;
//   }, [products, categories]);

//   const handleEditClick = (product) => {
//     setEditingProduct(product);
//     setIsFormOpen(true);
//   };

//   const handleAddNewClick = () => {
//     setEditingProduct(null);
//     setIsFormOpen(true);
//   };

//   const handleCloseForm = (refresh = false) => {
//     setIsFormOpen(false);
//     setEditingProduct(null);
//     if (refresh) {
//       fetchProducts();
//     }
//   };

//   const formatDateForTable = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleString('id-ID', {
//       year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
//     });
//   };

//   const filteredAndSearchedProducts = useMemo(() => {
//     let currentProducts = products;

//     if (selectedCategory) {
//       currentProducts = currentProducts.filter((prod) => prod.kategori === selectedCategory);
//     }

//     if (searchTerm) {
//       const lowerCaseSearchTerm = searchTerm.toLowerCase();
//       currentProducts = currentProducts.filter(
//         (prod) =>
//           prod.nama.toLowerCase().includes(lowerCaseSearchTerm) ||
//           prod.deskripsi.toLowerCase().includes(lowerCaseSearchTerm)
//       );
//     }
//     return currentProducts;
//   }, [products, selectedCategory, searchTerm]);

//   const totalPages = Math.ceil(filteredAndSearchedProducts.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = useMemo(() => {
//     return filteredAndSearchedProducts.slice(indexOfFirstItem, indexOfLastItem);
//   }, [filteredAndSearchedProducts, indexOfFirstItem, indexOfLastItem]);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [selectedCategory, searchTerm]);

//   return (
//     // Menggunakan 'p-8' dan 'font-inter' yang konsisten dengan SalesManagement.jsx
//     <div className="p-8 bg-gray-50 min-h-screen font-inter">
//       <h1 className="text-3xl font-bold text-center text-orange-700 mb-6">
//         Manajemen Produk
//       </h1>

//       {/* Product Category Summary Cards */}
//       {/* Tata letak grid yang responsif, overflow-x-auto untuk kartu yang banyak */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8 overflow-x-auto pb-4">
//         <div
//           key="all-categories"
//           className={`bg-white p-5 rounded-lg shadow-md flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 border-l-4 min-w-[180px]
//           ${!selectedCategory ? 'border-orange-600 bg-orange-100' : 'border-gray-200 hover:bg-orange-50'}`}
//           onClick={() => setSelectedCategory(null)}
//         >
//           <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Produk</h3>
//           <p className="text-3xl font-bold text-orange-600">{productSummary.total}</p>
//           <p className="text-xs text-gray-400">Semua Kategori</p>
//         </div>
//         {categories.map((kategori, index) => (
//           <div
//             key={index}
//             className={`bg-white p-5 rounded-lg shadow-md flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 border-l-4 min-w-[180px]
//             ${selectedCategory === kategori ? 'border-orange-600 bg-orange-100' : 'border-gray-200 hover:bg-orange-50'}`}
//             onClick={() => setSelectedCategory(kategori)}
//           >
//             <h3 className="text-sm font-semibold text-gray-500 mb-1">{kategori}</h3>
//             <p className="text-3xl font-bold text-orange-600">{productSummary[kategori] || 0}</p>
//             <p className="text-xs text-gray-400">Produk</p>
//           </div>
//         ))}
//       </div>

//       {/* Tombol Tambah Produk (dipertahankan di kanan) */}
//       <div className="flex justify-end items-center mb-6 flex-wrap gap-4">
//         <button
//           onClick={handleAddNewClick}
//           className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center gap-2 w-full md:w-auto justify-center"
//         >
//           <i className="fas fa-plus mr-2"></i> Tambah Produk Baru
//         </button>
//       </div>

//       {/* Tabel Produk */}
//       {/* Padding dan shadow yang sama dengan SalesManagement.jsx */}
//       <div className="bg-white p-6 rounded-lg shadow-xl">
//         <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center">
//           <i className="fas fa-box-open mr-2"></i> Daftar Produk {selectedCategory ? `(${selectedCategory})` : ''}
//         </h2>

//         {/* Input Pencarian dan Filter Kategori */}
//         {/* Konsisten dengan tata letak filter di SalesManagement.jsx */}
//         <div className="mb-5 flex justify-between items-center flex-wrap gap-4">
//           <div className="relative w-full sm:w-1/2 md:w-1/3">
//             <input
//               type="text"
//               placeholder="Cari produk berdasarkan nama atau deskripsi..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               // Padding dan border konsisten
//               className="p-2 pl-10 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-orange-500"
//             />
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//               </svg>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <select
//               value={selectedCategory || ''}
//               onChange={(e) => setSelectedCategory(e.target.value === '' ? null : e.target.value)}
//               className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
//             >
//               <option value="">Semua Kategori</option>
//               {categories.map((cat, idx) => (
//                 <option key={idx} value={cat}>{cat}</option>
//               ))}
//             </select>
//             <span className="text-sm text-gray-500 whitespace-nowrap">
//               Total hasil: {filteredAndSearchedProducts.length}
//             </span>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center py-10">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//             <p className="ml-3 text-lg text-gray-600">Memuat produk...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative text-center">
//             <strong className="font-bold">Error:</strong>
//             <span className="block sm:inline"> {error}</span>
//           </div>
//         ) : filteredAndSearchedProducts.length === 0 ? (
//           <div className="text-center text-gray-500 py-10">
//             <i className="fas fa-info-circle text-4xl mb-3 text-gray-400"></i>
//             <p className="text-lg font-medium">Tidak ada produk ditemukan dengan kriteria ini.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {/* Padding dan font size konsisten dengan SalesManagement.jsx */}
//                   <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">#</th>
//                   <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
//                   <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
//                   <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
//                   <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
//                   <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
//                   <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
//                   <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentItems.map((prod, index) => (
//                   <tr key={prod.id} className="hover:bg-gray-50">
//                     {/* Padding dan font size konsisten */}
//                     <td className="py-3 px-4 font-bold text-gray-700">
//                       {(currentPage - 1) * itemsPerPage + index + 1}
//                     </td>
//                     <td className="py-3 px-4">
//                       {prod.gambar ? (
//                         <img src={prod.gambar} alt={prod.nama} className="w-16 h-16 object-cover rounded-md shadow-sm" />
//                       ) : (
//                         <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md text-gray-500 text-xs">No Img</div>
//                       )}
//                     </td>
//                     <td className="py-3 px-4">{prod.nama}</td>
//                     <td className="py-3 px-4 text-sm text-gray-500">{prod.kategori}</td>
//                     <td className="py-3 px-4 text-sm text-gray-500">Rp {prod.harga?.toLocaleString('id-ID')}</td>
//                     <td className="py-3 px-4 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis break-words">{prod.deskripsi}</td>
//                     <td className="py-3 px-4 text-sm text-gray-500">{formatDateForTable(prod.created_at)}</td>
//                     <td className="py-3 px-4 text-right text-sm font-medium space-x-2">
//                       <button onClick={() => handleEditClick(prod)} className="text-blue-600 hover:text-blue-900" title="Edit Produk"><i className="fas fa-edit"></i></button>
//                       <button onClick={() => handleDelete(prod.id, prod.nama)} className="text-orange-600 hover:text-orange-900" title="Hapus Produk"><i className="fas fa-trash-alt"></i></button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination Controls */}
//             <div className="flex justify-between items-center mt-4">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
//               >
//                 Previous
//               </button>
//               <span className="text-gray-700">
//                 Halaman {currentPage} dari {totalPages}
//               </span>
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* MODAL FORM */}
//       {isFormOpen && (
//         <ProductForm
//           onClose={handleCloseForm}
//           onSuccess={() => handleCloseForm(true)}
//           editingProduct={editingProduct}
//         />
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabase";
import ProductForm from "./ProductForm";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Import ikon dari lucide-react
import { Plus, Edit, Trash2, Search, Filter, Package, LayoutGrid, X } from 'lucide-react';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(''); // Mengubah ke string kosong untuk dropdown "Semua Kategori"
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase.from("produk").select("*").order("created_at", { ascending: false });
      if (fetchError) throw fetchError;
      setProducts(data);
    } catch (err) {
      console.error("Fetch Error:", err.message);
      setError("Gagal memuat daftar produk. Pastikan tabel 'produk' ada di Supabase dan koneksi internet Anda stabil.");
      Swal.fire('Error', `Gagal memuat data produk: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, productName) => {
    Swal.fire({
      title: 'Hapus Produk?',
      text: `Anda yakin ingin menghapus produk "${productName}"? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316', // Oranye
      cancelButtonColor: '#6b7280', // Abu-abu
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { error: deleteError } = await supabase.from("produk").delete().eq("id", id);
          if (deleteError) throw deleteError;
          fetchProducts();
          Swal.fire('Terhapus!', 'Produk berhasil dihapus.', 'success');
        } catch (err) {
          console.error("Delete Error:", err.message);
          Swal.fire('Gagal!', `Gagal menghapus produk: ${err.message}`, 'error');
        }
      }
    });
  };

  const productSummary = useMemo(() => {
    const counts = {
      total: products.length,
    };
    // Initialize counts for all categories
    categories.forEach(cat => {
      counts[cat] = 0;
    });

    products.forEach(p => {
      if (counts[p.kategori] !== undefined) {
        counts[p.kategori]++;
      }
    });
    return counts;
  }, [products, categories]);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = (refresh = false) => {
    setIsFormOpen(false);
    setEditingProduct(null);
    if (refresh) {
      fetchProducts();
    }
  };

  const formatDateForTable = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredAndSearchedProducts = useMemo(() => {
        let currentProducts = products;
    
        if (selectedCategory) {
          currentProducts = currentProducts.filter((prod) => prod.kategori === selectedCategory);
        }
    
        if (searchTerm) {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          currentProducts = currentProducts.filter(
            (prod) =>
              prod.nama.toLowerCase().includes(lowerCaseSearchTerm) || // <<< Perbaikan di sini!
              prod.deskripsi.toLowerCase().includes(lowerCaseSearchTerm)
          );
        }
        return currentProducts;
      }, [products, selectedCategory, searchTerm]);

  const totalPages = Math.ceil(filteredAndSearchedProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(() => {
    return filteredAndSearchedProducts.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAndSearchedProducts, indexOfFirstItem, indexOfLastItem]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    // Reset page to 1 whenever category or search term changes
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-inter">
      {/* Kontainer utama untuk membatasi lebar halaman */}
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-700 mb-2 flex items-center justify-center">
            <Package className="inline-block mr-3 w-8 h-8" /> Manajemen Produk
          </h1>
          <div className="w-24 h-1 bg-orange-700 rounded-full mx-auto mb-6" />
          <p className="text-gray-600 text-base max-w-lg mx-auto">
            Kelola semua produk Anda, mulai dari minuman hingga makanan ringan, dan pantau kategorinya.
          </p>
        </header>

        {/* Product Category Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8 overflow-x-auto pb-4">
          <div
            key="all-categories"
            className={`bg-white p-5 rounded-lg shadow-md flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 border-b-4 min-w-[180px] transform hover:scale-105
              ${!selectedCategory ? 'border-orange-600 bg-orange-100' : 'border-gray-200 hover:bg-orange-50'}`}
            onClick={() => setSelectedCategory('')} // Mengatur kembali ke string kosong
          >
            <LayoutGrid className="text-orange-500 mb-2" size={32} />
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Produk</h3>
            <p className="text-3xl font-bold text-orange-600">{productSummary.total}</p>
            <p className="text-xs text-gray-400">Semua Kategori</p>
          </div>
          {categories.map((kategori, index) => (
            <div
              key={index}
              className={`bg-white p-5 rounded-lg shadow-md flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 border-b-4 min-w-[180px] transform hover:scale-105
                ${selectedCategory === kategori ? 'border-orange-600 bg-orange-100' : 'border-gray-200 hover:bg-orange-50'}`}
              onClick={() => setSelectedCategory(kategori)}
            >
              <Package className="text-orange-500 mb-2" size={32} />
              <h3 className="text-sm font-semibold text-gray-500 mb-1">{kategori}</h3>
              <p className="text-3xl font-bold text-orange-600">{productSummary[kategori] || 0}</p>
              <p className="text-xs text-gray-400">Produk</p>
            </div>
          ))}
        </div>

        {/* Tombol Tambah Produk Baru */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddNewClick}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Produk Baru
          </button>
        </div>

        {/* Form Tambah/Edit Produk (selalu di atas tabel jika terbuka) */}
        {isFormOpen && (
          <section className="mb-8 p-6 bg-white rounded-lg shadow-xl border-l-4 border-orange-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-700 flex items-center">
                <Package className="inline-block mr-3 w-6 h-6" /> {editingProduct ? 'Edit Detail Produk' : 'Tambah Produk Baru'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                title="Tutup Formulir"
              >
                <X size={20} />
              </button>
            </div>
            <ProductForm
              onClose={handleCloseForm}
              onSuccess={() => handleCloseForm(true)}
              editingProduct={editingProduct}
            />
          </section>
        )}

        {/* Tabel Produk */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <Package className="inline-block mr-2 w-6 h-6" /> Daftar Produk {selectedCategory ? `(${selectedCategory})` : ''}
          </h2>

          {/* Input Pencarian dan Filter Kategori */}
          <div className="mb-5 flex flex-col md:flex-row justify-between items-center flex-wrap gap-4">
            <div className="flex-1 w-full md:w-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari produk berdasarkan nama atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-full md:w-auto relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            {/* Keterangan Total Data Berdasarkan Pencarian */}
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Total hasil: <span className="font-semibold text-orange-600">{filteredAndSearchedProducts.length}</span>
            </span>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="flex flex-col justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mb-3"></div>
              <p className="text-lg text-orange-600 font-medium">Memuat data produk...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Oops!</strong>
              <span className="block sm:inline"> {error}</span>
              <p className="text-sm mt-1">Pastikan koneksi internet Anda stabil dan konfigurasi Supabase sudah benar.</p>
            </div>
          )}

          {!loading && filteredAndSearchedProducts.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-orange-300 rounded-lg p-6">
              <Package className="inline-block mb-3 text-orange-400" size={48} />
              <p className="text-lg font-medium">Tidak ada produk ditemukan dengan kriteria ini.</p>
              <p className="text-md">Coba ubah filter atau gunakan tombol "Tambah Produk Baru" untuk menambahkan data.</p>
            </div>
          )}

          {/* Table of Products */}
          {!loading && filteredAndSearchedProducts.length > 0 && (
            <div className="overflow-x-auto **max-h-[400px] overflow-y-auto**">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-orange-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">No.</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Gambar</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Nama Produk</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Kategori</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Harga</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Deskripsi</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Tanggal Dibuat</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((prod, index) => (
                    <tr key={prod.id} className="hover:bg-orange-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {prod.gambar ? (
                          <img src={prod.gambar} alt={prod.nama} className="w-16 h-16 object-cover rounded-md shadow-sm border border-gray-200" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md text-gray-400 text-xs border border-gray-200">No Image</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{prod.kategori}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">Rp {prod.harga?.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis break-words">{prod.deskripsi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateForTable(prod.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditClick(prod)}
                          className="text-orange-600 hover:text-orange-800 inline-flex items-center transition duration-150 ease-in-out"
                          title="Edit Produk"
                        >
                          <Edit size={16} className="mr-1" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.nama)}
                          className="text-red-600 hover:text-red-800 inline-flex items-center transition duration-150 ease-in-out"
                          title="Hapus Produk"
                        >
                          <Trash2 size={16} className="mr-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-5 py-2 rounded-lg font-medium transition duration-200 ease-in-out flex items-center gap-2
                      ${currentPage === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                  >
                    &larr; Sebelumnya
                  </button>
                  <span className="text-gray-700 font-medium">
                    Halaman <span className="font-bold">{currentPage}</span> dari <span className="font-bold">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-5 py-2 rounded-lg font-medium transition duration-200 ease-in-out flex items-center gap-2
                      ${currentPage === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                  >
                    Berikutnya &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div> {/* Akhir kontainer max-w-7xl */}

      {/* MODAL FORM (ProductForm akan dirender di sini, di luar max-w-7xl agar bisa jadi modal fullscreen/overlay) */}
      {isFormOpen && (
        <ProductForm
          onClose={handleCloseForm}
          onSuccess={() => handleCloseForm(true)}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
}