
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from '../supabase'; // Pastikan path ke supabase client Anda benar
import Swal from 'sweetalert2'; // Pastikan SweetAlert2 sudah diinstal (npm install sweetalert2)
import 'sweetalert2/dist/sweetalert2.min.css'; // Opsional: Untuk styling default SweetAlert2

import SalesForm from './SalesForm'; // Pastikan SalesForm.jsx berada di direktori yang sama

// Komponen utama untuk menampilkan dan mengelola pesanan
const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // Untuk modal detail receipt
  const [isSalesFormModalOpen, setIsSalesFormModalOpen] = useState(false); // Untuk modal SalesForm
  const [currentEditingSale, setCurrentEditingSale] = useState(null); // Data untuk diedit di SalesForm

  // State untuk filter tanggal
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- Helpers ---
  // Fungsi untuk mendapatkan warna status
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'Processing': return 'bg-orange-500';
      case 'Pending': return 'bg-yellow-400 text-black';
      case 'Canceled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Fungsi untuk mendapatkan warna member (sesuai User.jsx Anda)
  const getMemberColorClass = (memberType) => {
    switch (memberType) {
      case 'Gold': return 'bg-yellow-500 text-black';
      case 'Silver': return 'bg-gray-400';
      case 'Bronze': return 'bg-orange-700';
      default: return 'bg-blue-500';
    }
  };

  // Fungsi untuk mengambil data pesanan dari Supabase
  const fetchOrders = async (start = '', end = '') => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("orders")
        .select(`
          id,
          created_at,
          customer_name,
          order_type,
          table_number,
          customer_type,
          status,
          total_amount,
          receipt_id,
          order_items (
            product_name,
            quantity,
            price_per_unit
          )
        `);

      // Tambahkan filter tanggal jika ada
      if (start) {
        query = query.gte('created_at', `${start}T00:00:00.000Z`); // Mulai dari awal hari
      }
      if (end) {
        query = query.lte('created_at', `${end}T23:59:59.999Z`); // Sampai akhir hari
      }

      query = query.order("created_at", { ascending: false });

      const { data: ordersData, error: ordersError } = await query;

      if (ordersError) throw ordersError;

      // Transformasi data untuk menyesuaikan format yang digunakan di UI Anda
      const formattedOrders = ordersData.map(order => ({
        id: order.id,
        name: order.customer_name,
        date: new Date(order.created_at).toLocaleString('id-ID', {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
        order_type: order.order_type,
        table_number: order.table_number,
        customer_type: order.customer_type,
        status: order.status,
        receipt: order.receipt_id || `INV-${order.id.substring(0, 8).toUpperCase()}`, // Generate if null
        total_amount: order.total_amount,
        items_detail: order.order_items, // Array of { product_name, quantity, price_per_unit }
        member: 'Unknown', // Placeholder: Anda perlu logika untuk mendapatkan tipe member dari user jika ada
      }));
      setOrders(formattedOrders);
    } catch (err) {
      console.error("Fetch Orders Error:", err.message);
      setError("Gagal memuat daftar pesanan. Pastikan tabel 'orders' dan 'order_items' ada di Supabase.");
    } finally {
      setLoading(false);
    }
  };

  // Ambil pesanan saat komponen dimuat atau saat tanggal filter berubah
  useEffect(() => {
    fetchOrders(startDate, endDate);
  }, [startDate, endDate]); // Trigger fetch saat startDate atau endDate berubah

  // Tangani perubahan status untuk pesanan
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (updateError) throw updateError;
      fetchOrders(startDate, endDate); // Refresh pesanan setelah pembaruan dengan filter yang sama
      Swal.fire('Berhasil!', 'Status pesanan berhasil diperbarui.', 'success');
    } catch (err) {
      console.error("Update Status Error:", err.message);
      Swal.fire('Gagal!', `Gagal memperbarui status: ${err.message}`, 'error');
    }
  };

  // Perhitungan ringkasan menggunakan data yang diambil
  const summary = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    const processingOrders = orders.filter(o => o.status === 'Processing').length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const canceledOrders = orders.filter(o => o.status === 'Canceled').length;

    const totalProducts = orders.reduce((sum, order) => {
      const itemsCount = order.items_detail.reduce((itemSum, item) => itemSum + item.quantity, 0);
      return sum + itemsCount;
    }, 0);

    return {
      total: totalOrders,
      completed: completedOrders,
      processing: processingOrders,
      pending: pendingOrders,
      canceled: canceledOrders,
      totalProducts: totalProducts,
      percentCompleted: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
      percentCanceled: totalOrders > 0 ? Math.round((canceledOrders / totalOrders) * 100) : 0,
    };
  }, [orders]);

  // Fungsi untuk menghitung total untuk struk tertentu
  const calculateReceiptTotal = (itemsDetail) => {
    return itemsDetail.reduce((sum, item) => sum + item.price_per_unit * item.quantity, 0);
  };

  const handleDownload = () => {
    Swal.fire('Fitur Sedang Dikembangkan', 'Fitur unduh resi masih dalam pengembangan. Silakan coba lagi nanti.', 'info');
  };

  // --- Fungsi untuk membuka/menutup SalesForm ---
  const handleOpenNewSalesForm = () => {
    setCurrentEditingSale(null); // Pastikan null untuk mode tambah baru
    setIsSalesFormModalOpen(true);
  };

  const handleOpenEditSalesForm = (order) => {
    setCurrentEditingSale(order); // Set data pesanan untuk diedit
    setIsSalesFormModalOpen(true);
  };

  const handleCloseSalesForm = () => {
    setIsSalesFormModalOpen(false);
    setCurrentEditingSale(null); // Reset setelah ditutup
    fetchOrders(startDate, endDate); // Refresh daftar pesanan setelah modal ditutup dengan filter yang sama
  };

  const handleDeleteOrder = async (orderId, customerName) => {
    Swal.fire({
      title: 'Hapus Pesanan?',
      text: `Anda yakin ingin menghapus pesanan dari ${customerName}? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Pertama hapus item pesanan terkait
          const { error: deleteItemsError } = await supabase
            .from('order_items')
            .delete()
            .eq('order_id', orderId);

          if (deleteItemsError) throw deleteItemsError;

          // Kemudian hapus pesanan utama
          const { error: deleteOrderError } = await supabase
            .from('orders')
            .delete()
            .eq('id', orderId);

          if (deleteOrderError) throw deleteOrderError;

          fetchOrders(startDate, endDate); // Refresh daftar pesanan dengan filter yang sama
          Swal.fire('Terhapus!', 'Pesanan berhasil dihapus.', 'success');
        } catch (err) {
          console.error("Delete Order Error:", err.message);
          Swal.fire('Gagal!', `Gagal menghapus pesanan: ${err.message}`, 'error');
        }
      }
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-inter">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Manajemen Pesanan
      </h1>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-md text-center border-l-4 border-indigo-600">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Pesanan</h3>
          <p className="text-3xl font-bold text-indigo-600">{summary.total}</p>
          <p className="text-xs text-gray-400">Semua pesanan</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Selesai</h3>
          <p className="text-3xl font-bold text-green-500">{summary.completed}</p>
          <p className="text-xs text-gray-400">{summary.percentCompleted}% dari total</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center border-l-4 border-orange-500">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Diproses</h3>
          <p className="text-3xl font-bold text-orange-500">{summary.processing}</p>
          <p className="text-xs text-gray-400">Pesanan yang sedang diproses</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md text-center border-l-4 border-red-500">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Dibatalkan</h3>
          <p className="text-3xl font-bold text-red-500">{summary.canceled}</p>
          <p className="text-xs text-gray-400">{summary.percentCanceled}% dari total</p>
        </div>
      </div>

      {/* Filter Tanggal dan Tombol Buat Pesanan Baru */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <label htmlFor="startDate" className="text-gray-700 font-medium">Dari Tanggal:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <label htmlFor="endDate" className="text-gray-700 font-medium">Sampai Tanggal:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {/* Tombol filter tidak lagi diperlukan karena useEffect akan trigger on change */}
          {/* <button
            onClick={() => fetchOrders(startDate, endDate)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200"
          >
            Filter
          </button> */}
        </div>
        <button
          onClick={handleOpenNewSalesForm}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center"
        >
          <i className="fas fa-plus mr-2"></i> Buat Pesanan Baru
        </button>
      </div>

      {/* Tabel Pesanan */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
          <i className="fas fa-receipt mr-2"></i> Daftar Permintaan Pesanan
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="ml-3 text-lg text-gray-600">Memuat pesanan...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <i className="fas fa-info-circle text-4xl mb-3 text-gray-400"></i>
            <p className="text-lg font-medium">Tidak ada pesanan yang ditemukan untuk periode ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pelanggan</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe Pesanan</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal & Waktu</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Item</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Resi</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">{order.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.order_type} {order.order_type === 'Dine In' && order.table_number ? `(Meja ${order.table_number})` : ''}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-white px-3 py-1 rounded-full text-xs font-semibold focus:outline-none cursor-pointer ${getStatusColorClass(order.status)}`}
                      >
                        <option value="Processing" className="bg-orange-500">Processing</option>
                        <option value="Pending" className="bg-yellow-400 text-black">Pending</option>
                        <option value="Completed" className="bg-green-500">Completed</option>
                        <option value="Canceled" className="bg-red-500">Canceled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {order.items_detail.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-gray-800">
                      Rp {order.total_amount?.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.receipt}</td>
                    <td className="py-3 px-4 flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEditSalesForm(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Pesanan (Buat Pesanan Baru Berdasarkan Data Lama)"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Lihat Detail Resi"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id, order.name)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus Pesanan"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Resi */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light"
              onClick={() => setSelectedOrder(null)}
              title="Tutup"
            >
              &times;
            </button>

            <div className="text-center mb-6 border-b pb-4">
              <h1 className="text-3xl font-bold text-green-600">GREEN GROUNDS COFFEE</h1>
              <p className="text-gray-600 text-sm mt-1">Jl. Contoh No. 123, Kota Anda, Kode Pos 45678</p>
              <p className="text-green-600 font-semibold mt-3">TERIMA KASIH ATAS PESANAN ANDA!</p>
            </div>

            <div className="mb-6 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">ID RESI:</span>
                <span>{selectedOrder.receipt}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">PELANGGAN:</span>
                <span>{selectedOrder.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">TIPE PESANAN:</span>
                <span>{selectedOrder.order_type} {selectedOrder.order_type === 'Dine In' && selectedOrder.table_number ? `(Meja ${selectedOrder.table_number})` : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">TANGGAL:</span>
                <span>{selectedOrder.date}</span>
              </div>
            </div>

            <table className="w-full text-sm mb-6 border-collapse">
              <thead className="bg-gray-100 text-left text-gray-600 uppercase">
                <tr>
                  <th className="py-2 px-3">Produk</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Harga Satuan</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items_detail.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-2 px-3 font-medium text-gray-900">{item.product_name}</td>
                    <td className="py-2 px-3 text-center text-gray-700">{item.quantity}</td>
                    <td className="py-2 px-3 text-right text-gray-700">Rp {item.price_per_unit?.toLocaleString('id-ID')}</td>
                    <td className="py-2 px-3 text-right font-semibold text-gray-900">Rp {(item.price_per_unit * item.quantity)?.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col items-end space-y-2 text-gray-700 font-semibold mb-6">
              <div className="flex justify-between w-full max-w-xs">
                <span>Subtotal:</span>
                <span>Rp {calculateReceiptTotal(selectedOrder.items_detail)?.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between w-full max-w-xs">
                <span>Pajak (10%):</span>
                <span>Rp {(calculateReceiptTotal(selectedOrder.items_detail) * 0.10)?.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between w-full max-w-xs text-xl font-bold text-gray-900 border-t-2 border-gray-300 pt-2">
                <span>GRAND TOTAL:</span>
                <span>Rp {(calculateReceiptTotal(selectedOrder.items_detail) * 1.10)?.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center mx-auto"
              >
                <i className="fas fa-download mr-3"></i> Unduh Resi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SalesForm Modal */}
      {isSalesFormModalOpen && (
        <SalesForm
          onClose={handleCloseSalesForm}
          onSuccess={fetchOrders} // Memanggil fetchOrders untuk refresh tabel
          initialOrderData={currentEditingSale} // Mengirim data jika dalam mode edit
        />
      )}
    </div>
  );
};

export default OrderPage;
