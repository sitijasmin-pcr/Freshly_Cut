// import React, { useState, useEffect, useMemo } from "react";
// import { supabase } from '../supabase'; // Pastikan path ke supabase client Anda benar
// import Swal from 'sweetalert2'; // Pastikan SweetAlert2 sudah diinstal (npm install sweetalert2)
// import 'sweetalert2/dist/sweetalert2.min.css'; // Opsional: Untuk styling default SweetAlert2
// import { Calendar } from "lucide-react";


// import SalesForm from './SalesForm'; // Pastikan SalesForm.jsx berada di direktori yang sama

// // Komponen utama untuk menampilkan dan mengelola pesanan
// const OrderPage = () => {
//   const [statusFilter, setStatusFilter] = useState(''); // '' artinya tampilkan semua status
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null); // Untuk modal detail receipt
//   const [isSalesFormModalOpen, setIsSalesFormModalOpen] = useState(false); // Untuk modal SalesForm
//   const [currentEditingSale, setCurrentEditingSale] = useState(null); // Data untuk diedit di SalesForm

//   // State untuk filter tanggal
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   // State untuk pencarian
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;


//   // --- Helpers ---
//   // Fungsi untuk mendapatkan warna status
//   const getStatusColorClass = (status) => {
//     switch (status) {
//       case 'Completed': return 'bg-orange-500';
//       case 'Processing': return 'bg-orange-500';
//       case 'Pending': return 'bg-yellow-400 text-black';
//       case 'Canceled': return 'bg-red-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   // Fungsi untuk mendapatkan warna member (sesuai User.jsx Anda)
//   const getMemberColorClass = (memberType) => {
//     switch (memberType) {
//       case 'Gold': return 'bg-yellow-500 text-black';
//       case 'Silver': return 'bg-gray-400';
//       case 'Bronze': return 'bg-orange-700';
//       default: return 'bg-blue-500';
//     }
//   };

//   // Fungsi untuk menghitung slice untuk pagination
//   const filteredOrders = useMemo(() => {
//     let currentOrders = orders;

//     // Filter berdasarkan status
//     if (statusFilter !== '') {
//       currentOrders = currentOrders.filter(order => order.status === statusFilter);
//     }

//     // Filter berdasarkan search query (customer_name)
//     if (searchQuery) {
//       currentOrders = currentOrders.filter(order =>
//         order.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     return currentOrders;
//   }, [orders, searchQuery, statusFilter]);

//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   const paginatedOrders = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredOrders, currentPage]);


//   // Fungsi untuk mengambil data pesanan dari Supabase
//   const fetchOrders = async (start = '', end = '') => {
//     setLoading(true);
//     setError(null);
//     try {
//       let query = supabase
//         .from("orders")
//         .select(`
//           id,
//           created_at,
//           customer_name,
//           order_type,
//           table_number,
//           customer_type,
//           status,
//           total_amount,
//           receipt_id,
//           order_items (
//             product_name,
//             quantity,
//             price_per_unit
//           )
//         `);

//       // Tambahkan filter tanggal jika ada
//       if (start) {
//         query = query.gte('created_at', `${start}T00:00:00.000Z`); // Mulai dari awal hari
//       }
//       if (end) {
//         query = query.lte('created_at', `${end}T23:59:59.999Z`); // Sampai akhir hari
//       }

//       query = query.order("created_at", { ascending: false });

//       const { data: ordersData, error: ordersError } = await query;

//       if (ordersError) throw ordersError;

//       // Transformasi data untuk menyesuaikan format yang digunakan di UI Anda
//       const formattedOrders = ordersData.map(order => ({
//         id: order.id,
//         name: order.customer_name,
//         date: new Date(order.created_at).toLocaleString('id-ID', {
//           year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
//         }),
//         order_type: order.order_type,
//         table_number: order.table_number,
//         customer_type: order.customer_type,
//         status: order.status,
//         receipt: order.receipt_id || `INV-${order.id.substring(0, 8).toUpperCase()}`, // Generate if null
//         total_amount: order.total_amount,
//         items_detail: order.order_items, // Array of { product_name, quantity, price_per_unit }
//         member: 'Unknown', // Placeholder: Anda perlu logika untuk mendapatkan tipe member dari user jika ada
//       }));
//       setOrders(formattedOrders);
//     } catch (err) {
//       console.error("Fetch Orders Error:", err.message);
//       setError("Gagal memuat daftar pesanan. Pastikan tabel 'orders' dan 'order_items' ada di Supabase.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Ambil pesanan saat komponen dimuat atau saat tanggal filter berubah
//   useEffect(() => {
//     setCurrentPage(1); // Reset halaman ke 1 saat filter tanggal atau pencarian berubah
//     fetchOrders(startDate, endDate);
//   }, [startDate, endDate]); // Trigger fetch saat startDate atau endDate berubah

//   // Tangani perubahan status untuk pesanan
//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       const { error: updateError } = await supabase
//         .from('orders')
//         .update({ status: newStatus })
//         .eq('id', orderId);

//       if (updateError) throw updateError;
//       fetchOrders(startDate, endDate); // Refresh pesanan setelah pembaruan dengan filter yang sama
//       Swal.fire('Berhasil!', 'Status pesanan berhasil diperbarui.', 'success');
//     } catch (err) {
//       console.error("Update Status Error:", err.message);
//       Swal.fire('Gagal!', `Gagal memperbarui status: ${err.message}`, 'error');
//     }
//   };

//   // Perhitungan ringkasan menggunakan data yang diambil
//   const summary = useMemo(() => {
//     const totalOrders = orders.length; // Menggunakan 'orders' asli untuk ringkasan total keseluruhan
//     const completedOrders = orders.filter(o => o.status === 'Completed').length;
//     const processingOrders = orders.filter(o => o.status === 'Processing').length;
//     const pendingOrders = orders.filter(o => o.status === 'Pending').length;
//     const canceledOrders = orders.filter(o => o.status === 'Canceled').length;

//     const totalProducts = orders.reduce((sum, order) => {
//       const itemsCount = order.items_detail.reduce((itemSum, item) => itemSum + item.quantity, 0);
//       return sum + itemsCount;
//     }, 0);

//     return {
//       total: totalOrders,
//       completed: completedOrders,
//       processing: processingOrders,
//       pending: pendingOrders,
//       canceled: canceledOrders,
//       totalProducts: totalProducts,
//       percentCompleted: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
//       percentCanceled: totalOrders > 0 ? Math.round((canceledOrders / totalOrders) * 100) : 0,
//     };
//   }, [orders]);

//   // Fungsi untuk menghitung total untuk struk tertentu
//   const calculateReceiptTotal = (itemsDetail) => {
//     return itemsDetail.reduce((sum, item) => sum + item.price_per_unit * item.quantity, 0);
//   };

//   const handleDownload = () => {
//     Swal.fire('Fitur Sedang Dikembangkan', 'Fitur unduh resi masih dalam pengembangan. Silakan coba lagi nanti.', 'info');
//   };

//   // --- Fungsi untuk membuka/menutup SalesForm ---
//   const handleOpenNewSalesForm = () => {
//     setCurrentEditingSale(null); // Pastikan null untuk mode tambah baru
//     setIsSalesFormModalOpen(true);
//   };

//   const handleOpenEditSalesForm = (order) => {
//     setCurrentEditingSale(order); // Set data pesanan untuk diedit
//     setIsSalesFormModalOpen(true);
//   };

//   const handleCloseSalesForm = () => {
//     setIsSalesFormModalOpen(false);
//     setCurrentEditingSale(null); // Reset setelah ditutup
//     fetchOrders(startDate, endDate); // Refresh daftar pesanan setelah modal ditutup dengan filter yang sama
//   };

//   const handleDeleteOrder = async (orderId, customerName) => {
//     Swal.fire({
//       title: 'Hapus Pesanan?',
//       text: `Anda yakin ingin menghapus pesanan dari ${customerName}? Tindakan ini tidak dapat dibatalkan.`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Ya, Hapus!',
//       cancelButtonText: 'Batal'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           // Pertama hapus item pesanan terkait
//           const { error: deleteItemsError } = await supabase
//             .from('order_items')
//             .delete()
//             .eq('order_id', orderId);

//           if (deleteItemsError) throw deleteItemsError;

//           // Kemudian hapus pesanan utama
//           const { error: deleteOrderError } = await supabase
//             .from('orders')
//             .delete()
//             .eq('id', orderId);

//           if (deleteOrderError) throw deleteOrderError;

//           fetchOrders(startDate, endDate); // Refresh daftar pesanan dengan filter yang sama
//           Swal.fire('Terhapus!', 'Pesanan berhasil dihapus.', 'success');
//         } catch (err) {
//           console.error("Delete Order Error:", err.message);
//           Swal.fire('Gagal!', `Gagal menghapus pesanan: ${err.message}`, 'error');
//         }
//       }
//     });
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen font-inter">
//       <h1 className="text-3xl font-bold text-center text-orange-700 mb-6">
//         Manajemen Pesanan
//       </h1>

//       {/* Kartu Ringkasan */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white p-5 rounded-lg shadow-md text-center border-l-4 border-orange-600">
//           <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Pesanan</h3>
//           <p className="text-3xl font-bold text-orange-600">{summary.total}</p>
//           <p className="text-xs text-gray-400">Semua pesanan</p>
//         </div>
//         <div className="bg-white p-5 rounded-lg shadow-md text-center border-l-4 border-orange-500">
//           <h3 className="text-sm font-semibold text-gray-500 mb-1">Selesai</h3>
//           <p className="text-3xl font-bold text-orange-500">{summary.completed}</p>
//           <p className="text-xs text-gray-400">{summary.percentCompleted}% dari total</p>
//         </div>
//         <div className="bg-white p-5 rounded-lg shadow-md text-center border-l-4 border-orange-500">
//           <h3 className="text-sm font-semibold text-gray-500 mb-1">Diproses</h3>
//           <p className="text-3xl font-bold text-orange-500">{summary.processing}</p>
//           <p className="text-xs text-gray-400">Pesanan yang sedang diproses</p>
//         </div>
//         <div className="bg-white p-5 rounded-lg shadow-md text-center border-l-4 border-red-500">
//           <h3 className="text-sm font-semibold text-gray-500 mb-1">Dibatalkan</h3>
//           <p className="text-3xl font-bold text-red-500">{summary.canceled}</p>
//           <p className="text-xs text-gray-400">{summary.percentCanceled}% dari total</p>
//         </div>
//       </div>

//       {/* Filter Tanggal dan Tombol Buat Pesanan Baru */}
//       <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
//        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//   <div className="flex items-center gap-2">
//     <label htmlFor="startDate" className="text-sm font-medium text-gray-700 whitespace-nowrap">
//       <Calendar size={18} className="inline-block mr-1 text-orange-500" />Dari:
//     </label>
//     <input
//       type="date"
//       id="startDate"
//       value={startDate}
//       onChange={(e) => setStartDate(e.target.value)}
//       className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
//     />
//   </div>
//   <div className="flex items-center gap-2">
//     <label htmlFor="endDate" className="text-sm font-medium text-gray-700 whitespace-nowrap">
//       <Calendar size={18} className="inline-block mr-1 text-orange-500" />Sampai:
//     </label>
//     <input
//       type="date"
//       id="endDate"
//       value={endDate}
//       onChange={(e) => setEndDate(e.target.value)}
//       className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
//     />
//   </div>
// </div>

//         <button
//           onClick={handleOpenNewSalesForm}
//           className="bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-700 transition-colors duration-200 flex items-center"
//         >
//           <i className="fas fa-plus mr-2"></i> Buat Pesanan Baru
//         </button>
//       </div>

//       {/* Tabel Pesanan */}
//       <div className="bg-white p-6 rounded-lg shadow-xl">
//         <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center">
//           <i className="fas fa-receipt mr-2"></i> Daftar Permintaan Pesanan
//         </h2>

//         {/* Input pencarian dan Dropdown Filter Status */}
//         <div className="mb-5 flex justify-between items-center flex-wrap gap-4">
//           <div className="relative w-full sm:w-1/2 md:w-1/3">
//             <input
//               type="text"
//               placeholder="Cari nama pelanggan..."
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setCurrentPage(1); // Reset halaman saat pencarian berubah
//               }}
//               className="p-2 pl-10 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-orange-500"
//             />
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <svg
//                 className="h-5 w-5 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 ></path>
//               </svg>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <select
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setCurrentPage(1); // Reset halaman saat filter status berubah
//               }}
//               className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
//             >
//               <option value="">Semua Status</option>
//               <option value="Completed">Selesai</option>
//               <option value="Processing">Diproses</option>
//               <option value="Pending">Pending</option>
//               <option value="Canceled">Dibatalkan</option>
//             </select>
//             <span className="text-sm text-gray-500 whitespace-nowrap">
//               Total hasil: {filteredOrders.length}
//             </span>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center py-10">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//             <p className="ml-3 text-lg text-gray-600">Memuat pesanan...</p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
//             <strong className="font-bold">Error:</strong>
//             <span className="block sm:inline"> {error}</span>
//           </div>
//         ) : filteredOrders.length === 0 ? ( // Menggunakan filteredOrders untuk cek kosong
//           <div className="text-center text-gray-500 py-10">
//             <i className="fas fa-info-circle text-4xl mb-3 text-gray-400"></i>
//             <p className="text-lg font-medium">Tidak ada pesanan yang ditemukan dengan kriteria ini.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">#</th>
//                   <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pelanggan</th>
//                   <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe Pesanan</th>
//                   <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal & Waktu</th>
//                   <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Item</th>
//                   <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                   <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Resi</th>
//                   <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedOrders.map((order, index) => (
//                   <tr key={order.id} className="hover:bg-gray-50">
//                     <td className="py-3 px-4 font-bold text-gray-700">
//                       {(currentPage - 1) * itemsPerPage + index + 1}
//                     </td>
//                     <td className="py-3 px-4">{order.name}</td>
//                     <td className="py-3 px-4">{order.order_type}{order.table_number ? ` (Meja ${order.table_number})` : ''}</td>
//                     <td className="py-3 px-4">{order.date}</td>
//                     <td className="py-3 px-4">
//                       <select
//                         value={order.status}
//                         onChange={(e) => handleStatusChange(order.id, e.target.value)}
//                         className={`text-white px-3 py-1 rounded-full text-xs font-semibold focus:outline-none ${getStatusColorClass(order.status)}`}
//                       >
//                         <option value="Processing">Processing</option>
//                         <option value="Pending">Pending</option>
//                         <option value="Completed">Completed</option>
//                         <option value="Canceled">Canceled</option>
//                       </select>
//                     </td>
//                     <td className="py-3 px-4">
//                       {order.items_detail.reduce((s, i) => s + i.quantity, 0)}
//                     </td>
//                     <td className="py-3 px-4 font-bold">
//                       Rp {order.total_amount?.toLocaleString('id-ID')}
//                     </td>
//                     <td className="py-3 px-4">{order.receipt}</td>
//                     <td className="py-3 px-4 space-x-2">
//                       <button onClick={() => { setCurrentEditingSale(order); setIsSalesFormModalOpen(true); }} className="text-blue-600 hover:text-blue-900" title="Edit Pesanan"><i className="fas fa-edit"></i></button>
//                       <button onClick={() => setSelectedOrder(order)} className="text-orange-600 hover:text-orange-900" title="Lihat Detail Resi"><i className="fas fa-eye"></i></button>
//                       <button onClick={() => handleDeleteOrder(order.id, order.name)} className="text-red-600 hover:text-red-900" title="Hapus Pesanan"><i className="fas fa-trash-alt"></i></button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>

//             </table>
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

//       {/* Modal Resi */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl relative animate-fade-in-up">
//             <button
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light"
//               onClick={() => setSelectedOrder(null)}
//               title="Tutup"
//             >
//               &times;
//             </button>

//             <div className="text-center mb-6 border-b pb-4">
//               <h1 className="text-3xl font-bold text-orange-600">TOMORO COFFEE</h1>
//               <p className="text-gray-600 text-sm mt-1">Jl. Sembilang, Limbungan, Kec. Rumbai Pesisir, Kota Pekanbaru, Riau 28266</p>
//               <p className="text-orange-600 font-semibold mt-3">TERIMA KASIH ATAS PESANAN ANDA!</p>
//             </div>

//             <div className="mb-6 space-y-2 text-gray-700">
//               <div className="flex justify-between">
//                 <span className="font-semibold">ID RESI:</span>
//                 <span>{selectedOrder.receipt}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-semibold">PELANGGAN:</span>
//                 <span>{selectedOrder.name}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-semibold">TIPE PESANAN:</span>
//                 <span>{selectedOrder.order_type} {selectedOrder.order_type === 'Dine In' && selectedOrder.table_number ? `(Meja ${selectedOrder.table_number})` : ''}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-semibold">TANGGAL:</span>
//                 <span>{selectedOrder.date}</span>
//               </div>
//             </div>

//             <table className="w-full text-sm mb-6 border-collapse">
//               <thead className="bg-gray-100 text-left text-gray-600 uppercase">
//                 <tr>
//                   <th className="py-2 px-3">Produk</th>
//                   <th className="py-2 px-3 text-center">Qty</th>
//                   <th className="py-2 px-3 text-right">Harga Satuan</th>
//                   <th className="py-2 px-3 text-right">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedOrder.items_detail.map((item, i) => (
//                   <tr key={i} className="border-b border-gray-100 last:border-b-0">
//                     <td className="py-2 px-3 font-medium text-gray-900">{item.product_name}</td>
//                     <td className="py-2 px-3 text-center text-gray-700">{item.quantity}</td>
//                     <td className="py-2 px-3 text-right text-gray-700">Rp {item.price_per_unit?.toLocaleString('id-ID')}</td>
//                     <td className="py-2 px-3 text-right font-semibold text-gray-900">Rp {(item.price_per_unit * item.quantity)?.toLocaleString('id-ID')}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="flex flex-col items-end space-y-2 text-gray-700 font-semibold mb-6">
//               <div className="flex justify-between w-full max-w-xs">
//                 <span>Subtotal:</span>
//                 <span>Rp {calculateReceiptTotal(selectedOrder.items_detail)?.toLocaleString('id-ID')}</span>
//               </div>
//               <div className="flex justify-between w-full max-w-xs">
//                 <span>Pajak (10%):</span>
//                 <span>Rp {(calculateReceiptTotal(selectedOrder.items_detail) * 0.10)?.toLocaleString('id-ID')}</span>
//               </div>
//               <div className="flex justify-between w-full max-w-xs text-xl font-bold text-gray-900 border-t-2 border-gray-300 pt-2">
//                 <span>GRAND TOTAL:</span>
//                 <span>Rp {(calculateReceiptTotal(selectedOrder.items_detail) * 1.10)?.toLocaleString('id-ID')}</span>
//               </div>
//             </div>

//             <div className="text-center">
//               <button
//                 onClick={handleDownload}
//                 className="bg-orange-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center mx-auto"
//               >
//                 <i className="fas fa-download mr-3"></i> Unduh Resi
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* SalesForm Modal */}
//       {isSalesFormModalOpen && (
//         <SalesForm
//           onClose={handleCloseSalesForm}
//           onSuccess={fetchOrders} // Memanggil fetchOrders untuk refresh tabel
//           initialOrderData={currentEditingSale} // Mengirim data jika dalam mode edit
//         />
//       )}
//     </div>
//   );
// };

// export default OrderPage;

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from '../supabase';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Calendar, Search, Filter, Plus, Edit2, Eye, Trash2, X, ReceiptText, Download } from "lucide-react";
import SalesForm from './SalesForm';

const OrderPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSalesFormModalOpen, setIsSalesFormModalOpen] = useState(false);
  const [currentEditingSale, setCurrentEditingSale] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Helpers ---
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Completed': return 'bg-[#004d33] text-white';
      case 'Processing': return 'bg-orange-500 text-white';
      case 'Pending': return 'bg-yellow-400 text-black';
      case 'Canceled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const fetchOrders = async (start = '', end = '') => {
    setLoading(true);
    try {
      let query = supabase.from("orders").select(`*, order_items (*)`).order("created_at", { ascending: false });
      if (start) query = query.gte('created_at', `${start}T00:00:00.000Z`);
      if (end) query = query.lte('created_at', `${end}T23:59:59.999Z`);

      const { data, error: ordersError } = await query;
      if (ordersError) throw ordersError;

      const formattedOrders = data.map(order => ({
        ...order,
        name: order.customer_name,
        date: new Date(order.created_at).toLocaleString('id-ID', {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
        receipt: order.receipt_id || `INV-${order.id.substring(0, 8).toUpperCase()}`,
        items_detail: order.order_items || [],
      }));
      setOrders(formattedOrders);
    } catch (err) {
      setError("Gagal memuat daftar pesanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(startDate, endDate);
  }, [startDate, endDate]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      (statusFilter === '' || order.status === statusFilter) &&
      (order.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [orders, searchQuery, statusFilter]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#FDF8EE] p-4 md:p-8 font-sans text-[#004d33]">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-[#004d33]">
              SALES <span className="text-orange-600">MANAGEMENT</span>
            </h1>
            <p className="text-[#004d33]/60 font-medium">Pantau dan kelola seluruh pesanan pelanggan</p>
          </div>
          <button
            onClick={() => { setCurrentEditingSale(null); setIsSalesFormModalOpen(true); }}
            className="group flex items-center gap-2 bg-[#004d33] text-[#FDF8EE] px-6 py-3 rounded-full font-bold shadow-xl hover:bg-[#003624] transition-all"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            BUAT PESANAN BARU
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Pesanan", val: orders.length, color: "border-[#004d33]" },
          { label: "Selesai", val: orders.filter(o => o.status === 'Completed').length, color: "border-orange-500" },
          { label: "Proses", val: orders.filter(o => o.status === 'Processing').length, color: "border-yellow-500" },
          { label: "Batal", val: orders.filter(o => o.status === 'Canceled').length, color: "border-red-500" },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-[1.5rem] shadow-sm border-l-8 ${stat.color}`}>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
            <p className="text-3xl font-black text-[#004d33]">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-[#004d33]/5">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-[#004d33]/10 bg-white flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari pelanggan..." 
                className="w-full pl-10 pr-4 py-2 bg-[#FDF8EE] rounded-xl border-none focus:ring-2 focus:ring-[#004d33]/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="bg-[#FDF8EE] px-4 py-2 rounded-xl font-bold text-sm border-none focus:ring-2 focus:ring-[#004d33]/20"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#FDF8EE] p-2 rounded-2xl">
             <Calendar size={18} className="text-[#004d33] ml-2" />
             <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="bg-transparent border-none text-xs font-bold focus:ring-0" />
             <span className="text-gray-400">-</span>
             <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="bg-transparent border-none text-xs font-bold focus:ring-0" />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#004d33] text-[#FDF8EE] uppercase text-[10px] tracking-[0.2em] font-black">
                <th className="p-5">Pelanggan</th>
                <th className="p-5">Tipe</th>
                <th className="p-5">Waktu</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Total</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#004d33]/5">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FDF8EE]/50 transition-colors">
                  <td className="p-5 font-bold">{order.name}</td>
                  <td className="p-5 text-sm">{order.order_type}</td>
                  <td className="p-5 text-sm text-gray-500">{order.date}</td>
                  <td className="p-5">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColorClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-5 text-right font-black text-orange-600">
                    Rp {order.total_amount?.toLocaleString('id-ID')}
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Eye size={16}/></button>
                      <button onClick={() => {setCurrentEditingSale(order); setIsSalesFormModalOpen(true);}} className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100"><Edit2 size={16}/></button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 bg-[#FDF8EE]/30 flex justify-between items-center">
          <p className="text-xs font-bold text-gray-400">Menampilkan {paginatedOrders.length} dari {filteredOrders.length} data</p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-4 py-2 bg-white rounded-xl shadow-sm font-bold text-xs disabled:opacity-50"
            >
              Prev
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-4 py-2 bg-[#004d33] text-white rounded-xl shadow-sm font-bold text-xs disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Receipt (Gaya ManajemenProduksi) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#FDF8EE] rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-[#004d33]">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black italic text-[#004d33]">STRUK PESANAN</h2>
                  <p className="text-xs font-bold text-orange-600 tracking-widest uppercase">{selectedOrder.receipt}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-[#004d33] text-white rounded-full hover:rotate-90 transition-transform">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8 bg-white/50 p-6 rounded-[1.5rem]">
                <div className="flex justify-between text-sm">
                  <span className="font-bold opacity-50 uppercase tracking-tighter">Pelanggan</span>
                  <span className="font-black">{selectedOrder.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold opacity-50 uppercase tracking-tighter">Tipe</span>
                  <span className="font-black">{selectedOrder.order_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold opacity-50 uppercase tracking-tighter">Tanggal</span>
                  <span className="font-black">{selectedOrder.date}</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {selectedOrder.items_detail.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-[#004d33]/5 pb-2">
                    <span className="font-bold">{item.product_name} <span className="text-orange-600">x{item.quantity}</span></span>
                    <span className="font-black">Rp {(item.price_per_unit * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#004d33] text-[#FDF8EE] p-6 rounded-[1.5rem] mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold tracking-widest uppercase opacity-70">Grand Total</span>
                  <span className="text-2xl font-black italic">Rp {selectedOrder.total_amount?.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button className="w-full py-4 bg-orange-600 text-white rounded-full font-black tracking-widest flex items-center justify-center gap-3 hover:bg-orange-700 transition-all shadow-lg">
                <Download size={20} /> UNDUH RESI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SalesForm Modal */}
      {isSalesFormModalOpen && (
        <SalesForm
          onClose={() => { setIsSalesFormModalOpen(false); fetchOrders(startDate, endDate); }}
          onSuccess={() => { setIsSalesFormModalOpen(false); fetchOrders(startDate, endDate); }}
          initialOrderData={currentEditingSale}
        />
      )}
    </div>
  );
};

export default OrderPage;